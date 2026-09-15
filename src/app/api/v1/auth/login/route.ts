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
// }
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    if (user.disabled === true) {
      return NextResponse.json(
        { error: 'User account is disabled' },
        { status: 403 }
      );
    }

    // Pass password AND check both password/passwordHash keys
    const storedHashOrPassword = user.password || user.passwordHash || '';
    const validPassword = verifyPassword(password, storedHashOrPassword);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    await createSession(user._id.toString(), user.role, user.tenantId);

    return NextResponse.json({
      success: true,
      role: user.role,
      redirectTo:
        user.role === 'admin'
          ? '/admin'
          : user.role === 'hr'
          ? '/hr'
          : user.role === 'manager'
          ? '/manager'
          : '/employee',
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}