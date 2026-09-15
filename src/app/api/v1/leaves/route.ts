import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/v1/leaves - Get balances, counts, and leave request history
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const userId = auth.user._id;
    const tenantId = auth.user.tenantId;

    // Fetch user leave applications
    const leaves = await db
      .collection('leaves')
      .find({ userId, tenantId })
      .sort({ createdAt: -1 })
      .toArray();

    // Summary calculation
    const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
    const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
    const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

    const formattedHistory = leaves.map((l) => ({
      id: l._id.toString(),
      type: l.leaveType,
      start: new Date(l.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      end: new Date(l.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: l.status || 'Pending',
      tone: l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning',
    }));

    // Default Balances (Can be extended from users/settings collection)
    const leaveBalance = [
      { label: 'Casual leave', value: '8', tone: 'blue' },
      { label: 'Sick leave', value: '5', tone: 'green' },
      { label: 'Paid leave', value: '12', tone: 'purple' },
      { label: 'Unpaid leave', value: '2', tone: 'orange' },
    ];

    return NextResponse.json(
      {
        balances: leaveBalance,
        summary: { pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
        history: formattedHistory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch leave records' }, { status: 500 });
  }
}