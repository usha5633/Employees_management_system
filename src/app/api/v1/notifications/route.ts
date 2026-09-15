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
    const userId = auth.user._id;

    const dbNotifications = await db
      .collection('notifications')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!dbNotifications || dbNotifications.length === 0) {
      const defaultNotifications = [
        { id: '1', type: 'leave', title: 'Leave Request Approved', body: 'Your sick leave for Sep 7 has been approved by your manager.', time: '30m ago', read: false },
        { id: '2', type: 'task', title: 'Task Assigned', body: 'You have been assigned "Review design mockups" — due today.', time: '1h ago', read: false },
        { id: '3', type: 'payroll', title: 'Payslip Available', body: 'Your August 2026 payslip is ready. Click to download.', time: '2h ago', read: false },
        { id: '4', type: 'attendance', title: 'Late Attendance Alert', body: 'You checked in 12 minutes late on Sep 11. Please be on time.', time: '1d ago', read: false },
        { id: '5', type: 'task', title: 'Task Deadline Approaching', body: '"Q3 self-review submission" is due in 3 days.', time: '1d ago', read: true },
        { id: '6', type: 'leave', title: 'Leave Balance Updated', body: 'Your leave balance has been updated for Q3.', time: '2d ago', read: true },
        { id: '7', type: 'attendance', title: 'Attendance Summary Ready', body: 'Your September attendance summary is now available.', time: '3d ago', read: true },
        { id: '8', type: 'general', title: 'Q3 All-Hands Meeting', body: 'Reminder: Q3 all-hands meeting is on Friday at 4:00 PM.', time: '3d ago', read: true },
      ];

      return NextResponse.json({ notifications: defaultNotifications });
    }

    const formatted = dbNotifications.map((n) => ({
      id: n._id.toString(),
      type: n.type || 'general',
      title: n.title,
      body: n.body,
      time: n.time || 'recently',
      read: !!n.read,
    }));

    return NextResponse.json({ notifications: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    await db.collection('notifications').updateMany({ userId: auth.user._id }, { $set: { read: true } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}