// import crypto from 'crypto';

// export function verifyPassword(password: string, storedHash: string): boolean {
//   if (!storedHash) return false;

//   // Direct Plaintext Match
//   if (!storedHash.includes('$') && !storedHash.includes(':')) {
//     return password === storedHash;
//   }

//   // Handle Django/Standard PBKDF2 Format (pbkdf2$iterations$digest$salt$hash)
//   if (storedHash.startsWith('pbkdf2$')) {
//     const parts = storedHash.split('$');
//     if (parts.length === 5) {
//       const [, iterationsStr, digest, salt, originalHash] = parts;
//       const iterations = parseInt(iterationsStr, 10);
//       const keyLen = Buffer.from(originalHash, 'hex').length || 32;
//       const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLen, digest);
//       return derivedKey.toString('hex') === originalHash;
//     }
//   }

//   // Handle Simple salt:hash Format
//   if (storedHash.includes(':')) {
//     const [salt, hash] = storedHash.split(':');
//     const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
//     return hash === verifyHash;
//   }

//   return false;
// }

import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production'
);

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  if (!storedHash.includes('$') && !storedHash.includes(':')) {
    return password === storedHash;
  }
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
  if (storedHash.includes(':')) {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
  return false;
}

export async function createSession(userId: string, role?: string, tenantId?: string) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const token = await new SignJWT({ userId, role, tenantId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
    return token;
  } catch (err) {
    console.error('Session Cookie Warning:', err);
    return null;
  }
}