import crypto from 'crypto';

/**
 * Password hashing via Node's native crypto module — no external deps.
 * Format stored in DB: pbkdf2$<iterations>$<digest>$<saltHex>$<hashHex>
 * Storing the parameters alongside the hash lets us tune iteration count
 * over time without breaking verification of older hashes.
 */

const ITERATIONS = parseInt(process.env.PBKDF2_ITERATIONS || '210000', 10);
const KEYLEN = parseInt(process.env.PBKDF2_KEYLEN || '64', 10);
const DIGEST = process.env.PBKDF2_DIGEST || 'sha256';
const SALT_BYTES = 16;

export function hashPassword(plainPassword: string): string {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
  const hash = crypto.pbkdf2Sync(plainPassword, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `pbkdf2$${ITERATIONS}$${DIGEST}$${salt}$${hash}`;
}

export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  try {
    const [scheme, iterationsStr, digest, salt, hash] = storedHash.split('$');
    if (scheme !== 'pbkdf2') return false;

    const iterations = parseInt(iterationsStr, 10);
    const keylen = Buffer.from(hash, 'hex').length;

    const candidateHash = crypto
      .pbkdf2Sync(plainPassword, salt, iterations, keylen, digest)
      .toString('hex');

    // Constant-time comparison to avoid timing attacks.
    const a = Buffer.from(candidateHash, 'hex');
    const b = Buffer.from(hash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Basic password strength gate — tune to org policy. */
export function isPasswordStrongEnough(plainPassword: string): boolean {
  return (
    typeof plainPassword === 'string' &&
    plainPassword.length >= 8 &&
    /[A-Z]/.test(plainPassword) &&
    /[a-z]/.test(plainPassword) &&
    /[0-9]/.test(plainPassword)
  );
}
