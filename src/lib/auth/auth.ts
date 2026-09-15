import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDatabase } from './db';
import { ObjectId } from 'mongodb';

const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = 'sha256';

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export async function createSession(userId: string): Promise<string> {
  const db = await getDatabase();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Days

  await db.collection('auth_sessions').insertOne({
    token,
    userId: new ObjectId(userId),
    expiresAt,
    createdAt: new Date(),
  });

  // Set HTTP-Only Cookie
  const cookieStore = await cookies();
  cookieStore.set('ems_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ems_session')?.value;
  if (token) {
    const db = await getDatabase();
    await db.collection('auth_sessions').deleteOne({ token });
    cookieStore.delete('ems_session');
  }
}