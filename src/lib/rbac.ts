import { cookies } from 'next/headers';
import { getDatabase } from './db';
import { ObjectId } from 'mongodb';

export interface AuthContext {
  user: {
    _id: ObjectId;
    email: string;
    role: string;
    permissions: string[];
    tenantId: string;
  };
  sessionId: ObjectId;
}

export async function getAuthContext(): Promise<AuthContext | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ems_session')?.value;

    const db = await getDatabase();

    // 1. If valid session token exists in cookies
    if (token) {
      const session = await db.collection('auth_sessions').findOne({
        token,
        expiresAt: { $gt: new Date() },
      });

      if (session) {
        const user = await db.collection('users').findOne({ _id: session.userId });
        if (user) {
          return {
            user: {
              _id: user._id,
              email: user.email,
              role: user.role,
              permissions: user.permissions || [],
              tenantId: user.tenantId || 'tenant_default',
            },
            sessionId: session._id,
          };
        }
      }
    }

    // 2. Dev Fallback: If no cookie/session is found, pick default user from DB
    const fallbackUser = await db.collection('users').findOne({});
    if (fallbackUser) {
      return {
        user: {
          _id: fallbackUser._id,
          email: fallbackUser.email || 'employee@company.com',
          role: fallbackUser.role || 'EMPLOYEE',
          permissions: fallbackUser.permissions || [],
          tenantId: fallbackUser.tenantId || 'tenant_default',
        },
        sessionId: new ObjectId(),
      };
    }

    return null;
  } catch (error) {
    console.error('RBAC Auth Context Error:', error);
    return null;
  }
}