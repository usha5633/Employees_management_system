import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';

/**
 * Session Engine — HTTPOnly Secure Cookies (`ems_session`)
 *
 * The cookie itself only carries an opaque random token. The token is never
 * stored raw in the database — only its SHA-256 hash — so a DB read leak
 * can't be replayed as a live session cookie. Session metadata (userId,
 * role, expiry) lives server-side and is looked up on every request.
 */

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'ems_session';
const MAX_AGE_SECONDS = parseInt(process.env.SESSION_MAX_AGE_SECONDS || '604800', 10); // 7 days

export interface SessionRecord {
  tokenHash: string;
  userId: string;
  role: string;
  mfaVerified: boolean;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

/**
 * Creates a new server-side session record and sets the HTTPOnly cookie.
 * Call after successful password verification (mfaVerified=false until the
 * OTP step completes, if 2FA is enabled for the account).
 */
export async function createSession(params: {
  userId: string;
  role: string;
  mfaVerified: boolean;
  userAgent?: string;
  ip?: string;
}): Promise<string> {
  const db = await getDb();
  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + MAX_AGE_SECONDS * 1000);

  const record: SessionRecord = {
    tokenHash: hashToken(token),
    userId: params.userId,
    role: params.role,
    mfaVerified: params.mfaVerified,
    createdAt: now,
    expiresAt,
    userAgent: params.userAgent,
    ip: params.ip,
  };

  await db.collection<SessionRecord>(COLLECTIONS.SESSIONS).insertOne(record);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });

  return token;
}

/** Marks a session as MFA-verified after successful OTP check. */
export async function markSessionMfaVerified(token: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<SessionRecord>(COLLECTIONS.SESSIONS)
    .updateOne({ tokenHash: hashToken(token) }, { $set: { mfaVerified: true } });
}

/** Reads and validates the current request's session cookie. Returns null if absent/expired. */
export async function getCurrentSession(): Promise<SessionRecord | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const db = await getDb();
  const record = await db
    .collection<SessionRecord>(COLLECTIONS.SESSIONS)
    .findOne({ tokenHash: hashToken(token) });

  if (!record) return null;
  if (record.expiresAt.getTime() < Date.now()) {
    await db.collection(COLLECTIONS.SESSIONS).deleteOne({ tokenHash: hashToken(token) });
    return null;
  }

  return record;
}

/** Destroys the current session (server record + cookie) — used by logout. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    const db = await getDb();
    await db.collection(COLLECTIONS.SESSIONS).deleteOne({ tokenHash: hashToken(token) });
  }

  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
