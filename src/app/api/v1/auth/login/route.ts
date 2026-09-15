// // import { NextRequest, NextResponse } from 'next/server';
// // import { getDatabase } from '@/lib/db';
// // import { verifyPassword, createSession } from '@/lib/auth';

// // export async function POST(req: NextRequest) {
// //   try {
// //     const { email, password } = await req.json();

// //     console.log('Login request:', email);

// //     if (!email || !password) {
// //       return NextResponse.json(
// //         { error: 'Email and password are required' },
// //         { status: 400 }
// //       );
// //     }

// //     const db = await getDatabase();

// //     const user = await db.collection('users').findOne({
// //       email: email.toLowerCase(),
// //     });

// //     console.log('User found:', !!user);

// //     if (!user) {
// //       return NextResponse.json(
// //         { error: 'User not found' },
// //         { status: 401 }
// //       );
// //     }

// //     if (user.disabled === true) {
// //       return NextResponse.json(
// //         { error: 'User account is disabled' },
// //         { status: 403 }
// //       );
// //     }

// //     const validPassword = verifyPassword(
// //       password,
// //       user.passwordHash
// //     );

// //     console.log('Password valid:', validPassword);

// //     if (!validPassword) {
// //       return NextResponse.json(
// //         { error: 'Incorrect password' },
// //         { status: 401 }
// //       );
// //     }

// //     await createSession(user._id.toString());

// //     return NextResponse.json({
// //       success: true,
// //       role: user.role,
// //       redirectTo:
// //         user.role === 'admin'
// //           ? '/admin'
// //           : user.role === 'hr'
// //           ? '/hr'
// //           : user.role === 'manager'
// //           ? '/manager'
// //           : '/employee',
// //     });

// //   } catch (error) {

// //     console.error('LOGIN ERROR:', error);

// //     return NextResponse.json(
// //       {
// //         error:
// //           error instanceof Error
// //             ? error.message
// //             : 'Internal Server Error',
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { SignJWT, jwtVerify } from 'jose';
// import { cookies } from 'next/headers';
// import crypto from 'crypto';

// const SECRET_KEY = new TextEncoder().encode(
//   process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-in-production'
// );

// // Password Verify Function
// export function verifyPassword(password: string, storedHash: string): boolean {
//   if (!storedHash) return false;
//   if (!storedHash.includes(':')) {
//     return password === storedHash;
//   }
//   const [salt, hash] = storedHash.split(':');
//   const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
//   return hash === verifyHash;
// }

// // createSession Function (Jiske na hone se error aa raha tha)
// export async function createSession(userId: string, role?: string, tenantId?: string) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   const token = await new SignJWT({ userId, role, tenantId })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(SECRET_KEY);

//   const cookieStore = await cookies();
//   cookieStore.set('session', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     expires: expiresAt,
//     sameSite: 'lax',
//     path: '/',
//   });

//   return token;
// // }
// import { NextRequest, NextResponse } from 'next/server';
// import { getDatabase } from '@/lib/db';
// import { verifyPassword, createSession } from '@/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     console.log('--- LOGIN ATTEMPT ---', { email });

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const user = await db.collection('users').findOne({
//       email: email.trim().toLowerCase(),
//     });

//     if (!user) {
//       console.log('LOGIN FAILED: User not found in MongoDB');
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 401 }
//       );
//     }

//     if (user.disabled === true) {
//       return NextResponse.json(
//         { error: 'User account is disabled' },
//         { status: 403 }
//       );
//     }

//     const storedHashOrPassword = user.password || user.passwordHash || '';
//     const validPassword = verifyPassword(password, storedHashOrPassword);

//     console.log('PASSWORD CHECK RESULT:', validPassword);

//     if (!validPassword) {
//       return NextResponse.json(
//         { error: 'Incorrect password' },
//         { status: 401 }
//       );
//     }

//     // Create session cookie
//     await createSession(user._id.toString(), user.role, user.tenantId);

//     return NextResponse.json({
//       success: true,
//       role: user.role || 'admin',
//       redirectTo:
//         user.role === 'admin'
//           ? '/admin'
//           : user.role === 'hr'
//           ? '/hr'
//           : user.role === 'manager'
//           ? '/manager'
//           : '/employee',
//     });
//   } catch (error) {
//     console.error('SERVER LOGIN ERROR:', error);
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : 'Internal Server Error',
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { issueOtp, sendOtp } from '@/lib/auth/otp';
import { getPanelPathForRole } from '@/lib/auth/roles';
import { ok, fail, withErrorHandling } from '@/lib/utils/api-response';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/v1/auth/login
// Step 1 of auth: verify email/password. If the account has 2FA enabled,
// sets an mfa-unverified session cookie and emails/logs an OTP — the client
// must then call /verify-otp. Otherwise it signs the user straight in.
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const { email, password } = LoginSchema.parse(await req.json());
    const cleanEmail = email.trim().toLowerCase();

    const db = await getDb();
    const user = await db.collection(COLLECTIONS.USERS).findOne({ email: cleanEmail });

    if (!user) {
      return fail('Invalid email or password.', 401);
    }

    if (user.disabled) {
      return fail('This account has been disabled. Contact your administrator.', 403);
    }

    const validPassword = verifyPassword(password, user.passwordHash || '');
    if (!validPassword) {
      return fail('Invalid email or password.', 401);
    }

    const userAgent = req.headers.get('user-agent') || undefined;
    const ip = req.headers.get('x-forwarded-for') || undefined;

    // Accounts default to requiring MFA unless explicitly disabled (mfaEnabled === false).
    const mfaRequired = user.mfaEnabled !== false;

    await createSession({
      userId: user._id.toString(),
      role: user.role,
      mfaVerified: !mfaRequired,
      userAgent,
      ip,
    });

    if (mfaRequired) {
      const code = await issueOtp(user._id.toString());
      await sendOtp(user._id.toString(), code, user.email);
      return ok({ mfaRequired: true });
    }

    return ok({
      mfaRequired: false,
      role: user.role,
      redirectTo: getPanelPathForRole(user.role),
    });
  });
}