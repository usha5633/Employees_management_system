import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Fetch Team Members directly from Database
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
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = (dbTeam || []).map((m) => ({
      id: m._id.toString(),
      name: m.name || m.fullName || 'Team Member',
      role: m.role || m.designation || 'Employee',
      dept: m.department || m.dept || 'Engineering',
      status: m.status || 'Active',
      avatar: m.avatar || (m.name ? m.name.substring(0, 2).toUpperCase() : 'TM'),
      color: m.color || 'bg-blue-100 text-blue-700',
      tasks: m.openTasks ?? m.tasks ?? 0,
      attendance: m.attendanceRate || m.attendance || '100%',
      perf: m.performanceScore ?? m.perf ?? 85,
    }));

    return NextResponse.json({ team: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// POST: Direct Insert New Team Member to Database
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, dept, status } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const tenantId = auth.user.tenantId;

    const avatar = name
      .trim()
      .split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newEmployeeDocument = {
      tenantId,
      name: name.trim(),
      fullName: name.trim(),
      role: role?.trim() || 'Software Engineer',
      designation: role?.trim() || 'Software Engineer',
      department: dept?.trim() || 'Engineering',
      status: status || 'Active',
      avatar,
      color: 'bg-blue-100 text-blue-700',
      tasks: 0,
      attendance: '100%',
      perf: 85,
      createdAt: new Date(),
    };

    const result = await db.collection('employees').insertOne(newEmployeeDocument);

    return NextResponse.json(
      {
        success: true,
        member: {
          id: result.insertedId.toString(),
          ...newEmployeeDocument,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}