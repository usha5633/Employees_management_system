import crypto from 'crypto';

export function verifyPassword(
  plainPassword: string,
  storedHash: string
): boolean {

  try {

    const parts = storedHash.split('$');

    const scheme = parts[0];
    const iterations = parseInt(parts[1], 10);
    const digest = parts[2];
    const salt = parts[3];
    const hash = parts[4];

    if (scheme !== 'pbkdf2') {
      return false;
    }

    const keyLength = Buffer.from(hash, 'hex').length;

    const candidateHash = crypto
      .pbkdf2Sync(
        plainPassword,
        salt,
        iterations,
        keyLength,
        digest
      )
      .toString('hex');

    return candidateHash === hash;

  } catch (error) {

    console.error('Password verify error:', error);

    return false;
  }
}