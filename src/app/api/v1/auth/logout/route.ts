import { destroySession } from '@/lib/auth/session';
import { ok, withErrorHandling } from '@/lib/utils/api-response';

// POST /api/v1/auth/logout
export async function POST() {
  return withErrorHandling(async () => {
    await destroySession();
    return ok({ loggedOut: true });
  });
}
