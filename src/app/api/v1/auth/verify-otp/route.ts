import { NextRequest } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';
import { verifyOtp } from '@/lib/auth/otp';
import { getCurrentSession, markSessionMfaVerified, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { getPanelPathForRole } from '@/lib/auth/roles';
import { ok, fail, withErrorHandling } from '@/lib/utils/api-response';
import { ObjectId } from 'mongodb';

const VerifySchema = z.object({
  code: z.string().min(4).max(10),
});

// POST /api/v1/auth/verify-otp
// Step 2 of auth: submit the OTP that was sent after /login. Requires the
// mfa-unverified session cookie already set by /login.
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const { code } = VerifySchema.parse(await req.json());

    const session = await getCurrentSession();
    if (!session) {
      return fail('No active login attempt found. Please log in again.', 401);
    }
    if (session.mfaVerified) {
      return ok({ mfaRequired: false, alreadyVerified: true });
    }

    const result = await verifyOtp(session.userId, code);
    if (!result.ok) {
      const messages: Record<string, string> = {
        not_found: 'No OTP was found for this account. Please log in again.',
        expired: 'This code has expired. Please request a new one.',
        max_attempts: 'Too many incorrect attempts. Please request a new code.',
        mismatch: 'Incorrect code. Please try again.',
      };
      return fail(messages[result.reason], 400);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await markSessionMfaVerified(token);
    }

    const db = await getDb();
    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(session.userId) });

    return ok({
      mfaRequired: false,
      verified: true,
      user: user
        ? { id: session.userId, email: user.email, role: user.role, fullName: user.fullName }
        : null,
      redirectTo: getPanelPathForRole(session.role),
    });
  });
}
