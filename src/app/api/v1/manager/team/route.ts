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
    const tenantId = auth.user.tenantId;

    const dbTeam = await db
      .collection('employees')
      .find({ tenantId })
      .toArray();

    if (!dbTeam || dbTeam.length === 0) {
      const defaultTeam = [
        { id: '1', name: 'Aanya Sharma', role: 'Product Designer', dept: 'Design', status: 'Active', avatar: 'AS', color: 'bg-violet-100 text-violet-700', tasks: 5, attendance: '98%', perf: 92 },
        { id: '2', name: 'Rohit Verma', role: 'Frontend Engineer', dept: 'Engineering', status: 'Remote', avatar: 'RV', color: 'bg-sky-100 text-sky-700', tasks: 8, attendance: '95%', perf: 88 },
        { id: '3', name: 'Sneha Pillai', role: 'UX Researcher', dept: 'Design', status: 'Active', avatar: 'SP', color: 'bg-pink-100 text-pink-700', tasks: 4, attendance: '97%', perf: 94 },
        { id: '4', name: 'Vikram Singh', role: 'DevOps Engineer', dept: 'Engineering', status: 'Active', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', tasks: 6, attendance: '92%', perf: 85 },
        { id: '5', name: 'Priya Joshi', role: 'Talent Acquisition', dept: 'HR', status: 'On Leave', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', tasks: 2, attendance: '90%', perf: 80 },
      ];
      return NextResponse.json({ team: defaultTeam });
    }

    const formatted = dbTeam.map((m) => ({
      id: m._id.toString(),
      name: m.name || m.fullName || 'Team Member',
      role: m.role || m.designation || 'Employee',
      dept: m.department || m.dept || 'General',
      status: m.status || 'Active',
      avatar: m.avatar || 'TM',
      color: m.color || 'bg-slate-100 text-slate-700',
      tasks: m.openTasks ?? m.tasks ?? 0,
      attendance: m.attendanceRate || m.attendance || '100%',
      perf: m.performanceScore ?? m.perf ?? 85,
    }));

    return NextResponse.json({ team: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}