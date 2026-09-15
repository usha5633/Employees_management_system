import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentSession } from './session';

/**
 * Server-side RBAC engine.
 *
 * Roles live in the `roles` collection as { name, permissions: string[] }.
 * Permissions are simple string tokens. Panel-level access uses the
 * convention "panel:<segment>" matching the route segment under src/app —
 * "panel:admin" guards /admin/**, "panel:employees" guards /employees/**,
 * etc. A "*" segment (or the bare permission "*") matches everything, which
 * is how the seeded "admin" role gets full access.
 */

export interface AuthContext {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
  mfaVerified: boolean;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Resolves the authenticated user + their effective permissions for the
 * current request, based on the `ems_session` cookie. Throws AuthError
 * (401) if there is no valid session.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await getCurrentSession();
  if (!session) {
    throw new AuthError('Not authenticated', 401);
  }

  const db = await getDb();
  const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(session.userId) });

  if (!user || user.disabled) {
    throw new AuthError('Account not found or disabled', 401);
  }

  const roleDoc = await db.collection(COLLECTIONS.ROLES).findOne({ name: session.role });
  const permissions: string[] = roleDoc?.permissions ?? [];

  return {
    userId: session.userId,
    email: user.email,
    fullName: user.fullName,
    role: session.role,
    permissions,
    mfaVerified: session.mfaVerified,
  };
}

/** Same as getAuthContext(), but returns null instead of throwing when unauthenticated. */
export async function getAuthContextSafe(): Promise<AuthContext | null> {
  try {
    return await getAuthContext();
  } catch {
    return null;
  }
}

/**
 * Checks whether a set of granted permissions satisfies a required
 * permission string, supporting a trailing "*" wildcard on either side,
 * e.g. required "employees:write" is satisfied by granted "employees:*"
 * or by the superuser grant "*".
 */
export function checkPermissions(granted: string[], required: string | string[]): boolean {
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.every((req) => granted.some((perm) => permissionMatches(perm, req)));
}

function permissionMatches(granted: string, required: string): boolean {
  if (granted === '*') return true;
  if (granted === required) return true;

  const grantedParts = granted.split(':');
  const requiredParts = required.split(':');
  if (grantedParts.length !== requiredParts.length) return false;

  return grantedParts.every((part, i) => part === '*' || part === requiredParts[i]);
}

/**
 * Convenience guard for API route handlers: resolves auth context and
 * enforces a required permission (and optionally that MFA has been
 * completed) in one call. Throws AuthError with the appropriate status on
 * failure — pair with withErrorHandling() in api-response.ts.
 */
export async function requirePermission(
  required: string | string[],
  opts: { requireMfa?: boolean } = {}
): Promise<AuthContext> {
  const ctx = await getAuthContext();

  if (opts.requireMfa !== false && !ctx.mfaVerified) {
    throw new AuthError('MFA verification required', 403);
  }

  if (!checkPermissions(ctx.permissions, required)) {
    throw new AuthError('Insufficient permissions', 403);
  }

  return ctx;
}

/**
 * Convenience guard for Server Component layouts (e.g. src/app/admin/layout.tsx).
 * Unlike requirePermission(), this never throws — it redirects, since
 * layouts render straight to the user rather than returning a JSON error.
 */
export async function requirePanelAccessOrRedirect(panel: string): Promise<AuthContext> {
  const { redirect } = await import('next/navigation');

  const ctx = await getAuthContextSafe();
  if (!ctx || !ctx.mfaVerified) {
    redirect('/login');
  }

  if (!checkPermissions(ctx!.permissions, `panel:${panel}`)) {
    redirect('/unauthorized');
  }

  return ctx!;
}
