import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 });
    }

    const formData = await req.formData();
    const leaveType = formData.get('leaveType') as string;
    const reason = formData.get('reason') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const file = formData.get('file') as File | null;

    if (!leaveType || !startDate || !endDate) {
      return NextResponse.json({ error: 'Leave type, start date, and end date are required' }, { status: 400 });
    }

    const db = await getDatabase();

    const newLeave = {
      userId: auth.user._id,
      tenantId: auth.user.tenantId,
      leaveType,
      reason: reason || '',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      fileName: file ? file.name : null,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('leaves').insertOne(newLeave);

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error: any) {
    console.error('Leave Request Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit leave request' }, { status: 500 });
  }
}