import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ _id: auth.user._id });

    const settingsData = {
      fullName: user?.name || user?.fullName || 'Manager Name',
      email: user?.email || 'manager@company.com',
      team: user?.team || 'Engineering & Design',
    };

    return NextResponse.json({ settings: settingsData });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch manager settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = await getDatabase();

    await db.collection('users').updateOne(
      { _id: auth.user._id },
      {
        $set: {
          name: body.fullName,
          fullName: body.fullName,
          team: body.team,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}