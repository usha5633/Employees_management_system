import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const tenantId = auth.user.tenantId;

    // Fetch collections data
    const dbTeam = await db.collection('employees').find({ tenantId }).toArray();
    const dbApprovals = await db.collection('approvals').find({ tenantId }).sort({ createdAt: -1 }).toArray();
    const dbLeave = await db.collection('leaves').find({ tenantId }).toArray();

    // Default mock fallbacks if database collections are empty
    const teamMembers = dbTeam.length > 0 ? dbTeam.map((m, i) => ({
      id: m._id.toString(),
      name: m.name || m.fullName || 'Team Member',
      role: m.role || m.designation || 'Employee',
      avatar: m.avatar || 'TM',
      color: m.color || 'bg-violet-100 text-violet-700',
      status: m.status || 'present',
      perf: m.perfScore ?? 85,
      birthday: m.birthday || 'Sep 20',
      dob: m.dob || '20 Sep',
    })) : [
      { id: '1', name: 'Aanya Sharma', role: 'Product Designer', avatar: 'AS', color: 'bg-violet-100 text-violet-700', status: 'present', perf: 92, birthday: 'Sep 20', dob: '20 Sep' },
      { id: '2', name: 'Rohit Verma', role: 'Frontend Engineer', avatar: 'RV', color: 'bg-sky-100 text-sky-700', status: 'remote', perf: 88, birthday: 'Oct 3', dob: '03 Oct' },
      { id: '3', name: 'Sneha Pillai', role: 'UX Researcher', avatar: 'SP', color: 'bg-pink-100 text-pink-700', status: 'present', perf: 94, birthday: 'Nov 12', dob: '12 Nov' },
      { id: '4', name: 'Vikram Singh', role: 'DevOps Engineer', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', status: 'leave', perf: 85, birthday: 'Sep 28', dob: '28 Sep' },
      { id: '5', name: 'Priya Joshi', role: 'Talent Acquisition', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', status: 'absent', perf: 80, birthday: 'Dec 5', dob: '05 Dec' },
      { id: '6', name: 'Sahil Rao', role: 'Full Stack Dev', avatar: 'SR', color: 'bg-blue-100 text-blue-700', status: 'present', perf: 90, birthday: 'Oct 18', dob: '18 Oct' },
    ];

    const initialApprovals = dbApprovals.length > 0 ? dbApprovals.map((a) => ({
      id: a._id.toString(),
      name: a.employeeName || 'Team Member',
      avatar: a.avatar || 'TM',
      color: a.avatarColor || 'bg-sky-100 text-sky-700',
      type: a.requestType || 'Leave Request',
      desc: a.description || '',
      urgency: a.urgency || 'medium',
      status: a.status || 'pending',
    })) : [
      { id: '1', name: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', type: 'Leave Request', desc: '2 days — Sep 15–16', urgency: 'high', status: 'pending' },
      { id: '2', name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700', type: 'WFH Request', desc: 'Sep 13, Friday', urgency: 'medium', status: 'pending' },
      { id: '3', name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', type: 'Overtime Claim', desc: '4 hrs — Sep 10', urgency: 'low', status: 'pending' },
      { id: '4', name: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', type: 'Task Reassign', desc: 'Sprint 4 → Sprint 5', urgency: 'medium', status: 'pending' },
      { id: '5', name: 'Priya Joshi', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', type: 'Leave Request', desc: 'Sep 20 — 1 day', urgency: 'low', status: 'approved' },
    ];

    const teamLeave = dbLeave.length > 0 ? dbLeave.map((l) => ({
      name: l.employeeName || 'Team Member',
      avatar: l.avatar || 'TM',
      color: l.avatarColor || 'bg-slate-100 text-slate-700',
      type: l.leaveType || 'Casual Leave',
      from: l.fromDate || 'Sep 13',
      to: l.toDate || 'Sep 13',
      status: l.status || 'Approved',
    })) : [
      { name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', type: 'Casual Leave', from: 'Sep 13', to: 'Sep 13', status: 'On Leave' },
      { name: 'Priya Joshi', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', type: 'Sick Leave', from: 'Sep 13', to: 'Sep 14', status: 'Approved' },
      { name: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', type: 'Casual Leave', from: 'Sep 15', to: 'Sep 16', status: 'Pending' },
      { name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700', type: 'WFH', from: 'Sep 13', to: 'Sep 13', status: 'Pending' },
    ];

    return NextResponse.json({
      teamMembers,
      initialApprovals,
      teamLeave,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch manager dashboard data' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = await req.json();
    const db = await getDatabase();

    if (ObjectId.isValid(id)) {
      await db.collection('approvals').updateOne(
        { _id: new ObjectId(id), tenantId: auth.user.tenantId },
        { $set: { status: action, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update approval action' }, { status: 500 });
  }
}