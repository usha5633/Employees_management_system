import { getAuthContext } from '@/lib/auth/rbac';
import { ok, withErrorHandling } from '@/lib/utils/api-response';

// GET /api/v1/auth/me
export async function GET() {
  return withErrorHandling(async () => {
    const ctx = await getAuthContext();
    return ok({
      userId: ctx.userId,
      email: ctx.email,
      fullName: ctx.fullName,
      role: ctx.role,
      permissions: ctx.permissions,
      mfaVerified: ctx.mfaVerified,
    });
  });
}
