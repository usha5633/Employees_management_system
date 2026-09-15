import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentSession } from '@/lib/auth/session';
import { issueOtp, sendOtp } from '@/lib/auth/otp';
import { ok, fail, withErrorHandling } from '@/lib/utils/api-response';

// POST /api/v1/auth/resend-otp
export async function POST() {
  return withErrorHandling(async () => {
    const session = await getCurrentSession();
    if (!session || session.mfaVerified) {
      return fail('No pending OTP verification for this session.', 400);
    }

    const db = await getDb();
    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(session.userId) });
    if (!user) return fail('Account not found.', 404);

    const code = await issueOtp(session.userId);
    await sendOtp(session.userId, code, user.email);

    return ok({ sent: true });
  });
}
