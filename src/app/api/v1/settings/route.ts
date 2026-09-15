import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Fetch Settings (Role agnostic)
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ _id: auth.user._id });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      settings: {
        fullName: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        team: user.team || 'Engineering & Design',
        city: user.location || '',
        address: user.personalInfo?.address || '',
        notifications: user.notifications || {},
        theme: user.theme || 'Light mode',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST: Update Settings (Role agnostic)
export async function POST(req: NextRequest) {
  try {
    const auth = authContext || (await getAuthContext());
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = await getDatabase();

    // Flexible update object based on sent payload
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (body.fullName !== undefined) {
      updateData.name = body.fullName;
      updateData.fullName = body.fullName;
    }
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.team !== undefined) updateData.team = body.team;
    if (body.city !== undefined) updateData.location = body.city;
    if (body.address !== undefined) updateData['personalInfo.address'] = body.address;
    if (body.notifications !== undefined) updateData.notifications = body.notifications;
    if (body.theme !== undefined) updateData.theme = body.theme;

    await db.collection('users').updateOne(
      { _id: auth.user._id },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}