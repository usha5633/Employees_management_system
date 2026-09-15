import { Db } from 'mongodb';
import { getDb } from './mongodb';

/**
 * Central registry of collection names. Phase 1 only needs auth/RBAC
 * collections — employees/attendance/leave/etc. collections get added here
 * as later phases wire up each module.
 */
export const COLLECTIONS = {
  USERS: 'users',
  ROLES: 'roles',
  OTP_CODES: 'otp_codes',
  SESSIONS: 'sessions',
} as const;

/**
 * Ensures indexes exist for core collections. Safe to call repeatedly —
 * createIndex is idempotent. Called once at cold-start via instrumentation.ts.
 */
export async function ensureIndexes(db?: Db): Promise<void> {
  const database = db ?? (await getDb());

  await Promise.all([
    database.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true }),
    database.collection(COLLECTIONS.ROLES).createIndex({ name: 1 }, { unique: true }),
    database
      .collection(COLLECTIONS.OTP_CODES)
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database
      .collection(COLLECTIONS.SESSIONS)
      .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database.collection(COLLECTIONS.SESSIONS).createIndex({ tokenHash: 1 }, { unique: true }),
  ]);
}
