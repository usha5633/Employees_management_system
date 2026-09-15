import crypto from 'crypto';

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // 1. Plaintext fallback (Dev mode)
  if (!storedHash.includes('$') && !storedHash.includes(':')) {
    return password === storedHash;
  }

  // 2. Format: pbkdf2$iterations$digest$salt$hash
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length === 5) {
      const [, iterationsStr, digest, salt, originalHash] = parts;
      const iterations = parseInt(iterationsStr, 10);
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 32, digest);
      return derivedKey.toString('hex') === originalHash;
    }
  }

  // 3. Format: salt:hash (Simple PBKDF2)
  if (storedHash.includes(':')) {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }

  return false;
}