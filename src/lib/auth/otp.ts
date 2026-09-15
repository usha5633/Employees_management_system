import crypto from 'crypto';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';

/**
 * Multi-Factor Auth — 2FA OTP Verification.
 *
 * OTPs are numeric codes, hashed at rest (SHA-256), single-use, short-lived,
 * and rate-limited per attempt count. Delivery (email/SMS) is intentionally
 * left as a hook — wire up your provider (SES, Twilio, etc.) inside
 * `sendOtp()` below. Until then it logs the code to the server console so
 * the flow is testable locally.
 */

const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6', 10);
const OTP_EXPIRY_SECONDS = parseInt(process.env.OTP_EXPIRY_SECONDS || '300', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);

interface OtpRecord {
  userId: string;
  codeHash: string;
  attempts: number;
  createdAt: Date;
  expiresAt: Date;
  consumed: boolean;
}

function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function generateNumericCode(length: number): string {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, '0');
}

/** Generates and persists a fresh OTP for a user, invalidating any prior unconsumed codes. */
export async function issueOtp(userId: string): Promise<string> {
  const db = await getDb();
  const collection = db.collection<OtpRecord>(COLLECTIONS.OTP_CODES);

  await collection.updateMany({ userId, consumed: false }, { $set: { consumed: true } });

  const code = generateNumericCode(OTP_LENGTH);
  const now = new Date();

  await collection.insertOne({
    userId,
    codeHash: hashCode(code),
    attempts: 0,
    createdAt: now,
    expiresAt: new Date(now.getTime() + OTP_EXPIRY_SECONDS * 1000),
    consumed: false,
  });

  return code;
}

/** Delivery hook — wire this up to your email/SMS provider. */
export async function sendOtp(userId: string, code: string, destination: string): Promise<void> {
  console.log(`[otp] Sending code ${code} to ${destination} for user ${userId}`);
  // TODO: integrate provider, e.g. AWS SES / Twilio / SendGrid
}

export type OtpVerifyResult =
  | { ok: true }
  | { ok: false; reason: 'not_found' | 'expired' | 'max_attempts' | 'mismatch' };

/** Verifies a submitted OTP code against the latest unconsumed record for the user. */
export async function verifyOtp(userId: string, submittedCode: string): Promise<OtpVerifyResult> {
  const db = await getDb();
  const collection = db.collection<OtpRecord>(COLLECTIONS.OTP_CODES);

  const record = await collection.findOne({ userId, consumed: false }, { sort: { createdAt: -1 } });

  if (!record) return { ok: false, reason: 'not_found' };
  if (record.expiresAt.getTime() < Date.now()) return { ok: false, reason: 'expired' };
  if (record.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: 'max_attempts' };

  const matches = hashCode(submittedCode) === record.codeHash;

  if (!matches) {
    await collection.updateOne({ _id: (record as any)._id }, { $inc: { attempts: 1 } });
    return { ok: false, reason: 'mismatch' };
  }

  await collection.updateOne({ _id: (record as any)._id }, { $set: { consumed: true } });
  return { ok: true };
}
