import crypto from 'crypto';

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // Direct Plaintext Match
  if (!storedHash.includes('$') && !storedHash.includes(':')) {
    return password === storedHash;
  }

  // Handle Django/Standard PBKDF2 Format (pbkdf2$iterations$digest$salt$hash)
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length === 5) {
      const [, iterationsStr, digest, salt, originalHash] = parts;
      const iterations = parseInt(iterationsStr, 10);
      const keyLen = Buffer.from(originalHash, 'hex').length || 32;
      const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLen, digest);
      return derivedKey.toString('hex') === originalHash;
    }
  }

  // Handle Simple salt:hash Format
  if (storedHash.includes(':')) {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }

  return false;
}