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
    const tenantId = auth.user.tenantId;

    // Fetch user details
    const user = await db.collection('users').findOne({ _id: userId });

    // Fetch today's attendance record
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = await db.collection('attendance').findOne({
      userId,
      tenantId,
      date: todayStr,
    });

    const dashboardData = {
      user: {
        name: user?.name || user?.fullName || 'Rahul Sharma',
      },
      todayAttendance: {
        checkedIn: todayAttendance ? todayAttendance.status === 'present' : true,
        checkInTime: todayAttendance?.checkIn || '09:28 AM',
        checkOutTime: todayAttendance?.checkOut || '—',
        elapsed: todayAttendance?.elapsed || '06h 45m',
      },
      leaveBalance: [
        { label: 'Casual', used: 2, total: 8, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' },
        { label: 'Sick', used: 1, total: 5, color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700' },
        { label: 'Paid', used: 3, total: 12, color: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700' },
        { label: 'Unpaid', used: 0, total: 2, color: 'bg-rose-400', light: 'bg-rose-50', text: 'text-rose-700' },
      ],
      leaveRequests: [
        { type: 'Casual Leave', from: 'Sep 14', to: 'Sep 15', days: 2, status: 'Pending', tone: 'amber' },
        { type: 'Sick Leave', from: 'Sep 5', to: 'Sep 5', days: 1, status: 'Approved', tone: 'emerald' },
        { type: 'WFH Request', from: 'Sep 3', to: 'Sep 3', days: 1, status: 'Rejected', tone: 'rose' },
      ],
      payslip: {
        month: 'August 2026',
        gross: '₹85,000',
        deductions: '₹12,400',
        net: '₹72,600',
        status: 'Paid',
        date: '31 Aug 2026',
      },
      announcements: [
        { title: 'Q3 All-Hands Meeting', category: 'Meeting', date: 'Fri 4:00 PM', priority: 'High', read: false },
        { title: 'New WFH Policy Update', category: 'HR Policy', date: 'Oct 1, 2026', priority: 'High', read: false },
        { title: 'Performance Reviews Open', category: 'HR', date: 'Sep 20–30, 2026', priority: 'Medium', read: true },
      ],
      holidays: [
        { name: 'Gandhi Jayanti', date: 'Oct 2, 2026', day: 'Friday', daysLeft: 19, color: 'bg-orange-50 border-orange-200 text-orange-800' },
        { name: 'Dussehra', date: 'Oct 12, 2026', day: 'Monday', daysLeft: 29, color: 'bg-blue-50 border-blue-200 text-blue-800' },
        { name: 'Diwali', date: 'Oct 20, 2026', day: 'Tuesday', daysLeft: 37, color: 'bg-amber-50 border-amber-200 text-amber-800' },
        { name: 'Christmas', date: 'Dec 25, 2026', day: 'Friday', daysLeft: 103, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
      ],
    };

    return NextResponse.json(dashboardData);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json(); // 'checkIn' or 'checkOut'
    const db = await getDatabase();
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (action === 'checkIn') {
      await db.collection('attendance').updateOne(
        { userId: auth.user._id, date: todayStr },
        {
          $set: {
            tenantId: auth.user.tenantId,
            status: 'present',
            checkIn: timeStr,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    } else if (action === 'checkOut') {
      await db.collection('attendance').updateOne(
        { userId: auth.user._id, date: todayStr },
        {
          $set: {
            checkOut: timeStr,
            updatedAt: new Date(),
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update attendance action' }, { status: 500 });
  }
}