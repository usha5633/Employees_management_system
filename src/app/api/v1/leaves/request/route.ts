import { NextResponse } from 'next/server';

// Temporary shared in-memory store or connect to your database (Prisma / Mongoose)
export let globalLeaveRequestsStore = [
  {
    id: 'leave-01',
    type: 'Casual Leave',
    start: '2026-09-20',
    end: '2026-09-22',
    status: 'Pending',
    tone: 'warning',
    reason: 'Personal family engagement',
  },
  {
    id: 'leave-02',
    type: 'Sick Leave',
    start: '2026-08-10',
    end: '2026-08-11',
    status: 'Approved',
    tone: 'success',
    reason: 'Viral fever and medical rest',
  },
];

export async function GET() {
  const pendingCount = globalLeaveRequestsStore.filter((l) => l.status === 'Pending').length;
  const approvedCount = globalLeaveRequestsStore.filter((l) => l.status === 'Approved').length;
  const rejectedCount = globalLeaveRequestsStore.filter((l) => l.status === 'Rejected').length;

  return NextResponse.json({
    success: true,
    balances: [
      { label: 'Casual leave', value: '8', tone: 'blue' },
      { label: 'Sick leave', value: '5', tone: 'green' },
      { label: 'Paid leave', value: '12', tone: 'purple' },
      { label: 'Unpaid leave', value: '2', tone: 'orange' },
    ],
    summary: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    },
    history: globalLeaveRequestsStore,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const leaveType = formData.get('leaveType') as string;
    const reason = formData.get('reason') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const file = formData.get('file') as File | null;

    if (!startDate || !endDate || !leaveType) {
      return NextResponse.json({ success: false, error: 'Missing required leave fields' }, { status: 400 });
    }

    // Create new leave record for Manager DB / Queue
    const newRequest = {
      id: `leave-${Date.now()}`,
      type: leaveType,
      start: startDate,
      end: endDate,
      status: 'Pending' as const,
      tone: 'warning' as const,
      reason: reason || 'Not specified',
      documentAttached: file ? file.name : null,
      submittedAt: new Date().toISOString(),
    };

    // Prepend to store so manager & employee see it instantly
    globalLeaveRequestsStore.unshift(newRequest);

    return NextResponse.json({
      success: true,
      message: 'Leave request submitted and routed to manager successfully!',
      request: newRequest,
    });
  } catch (error) {
    console.error('Leave submission error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error while processing leave' }, { status: 500 });
  }
}