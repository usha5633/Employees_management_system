import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log('Login request:', email);

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

    console.log('User found:', !!user);

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

    const validPassword = verifyPassword(
      password,
      user.passwordHash
    );

    console.log('Password valid:', validPassword);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    await createSession(user._id.toString());

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