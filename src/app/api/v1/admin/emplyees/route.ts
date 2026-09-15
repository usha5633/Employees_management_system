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

    const dbEmployees = await db
      .collection('employees')
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!dbEmployees || dbEmployees.length === 0) {
      const defaultEmployees = [
        { id: '1', name: 'Aanya Sharma', role: 'Product Designer', department: 'Design', status: 'Active', avatar: 'AS', avatarColor: 'bg-violet-100 text-violet-700' },
        { id: '2', name: 'Rohit Verma', role: 'Senior Frontend Engineer', department: 'Engineering', status: 'Remote', avatar: 'RV', avatarColor: 'bg-sky-100 text-sky-700' },
        { id: '3', name: 'Meera Nair', role: 'HR Operations Lead', department: 'HR', status: 'Active', avatar: 'MN', avatarColor: 'bg-emerald-100 text-emerald-700' },
        { id: '4', name: 'Danish Khan', role: 'Sales Manager', department: 'Sales', status: 'On Leave', avatar: 'DK', avatarColor: 'bg-amber-100 text-amber-700' },
        { id: '5', name: 'Pooja Iyer', role: 'Finance Analyst', department: 'Finance', status: 'Active', avatar: 'PI', avatarColor: 'bg-rose-100 text-rose-700' },
        { id: '6', name: 'Arjun Mehta', role: 'Backend Engineer', department: 'Engineering', status: 'Remote', avatar: 'AM', avatarColor: 'bg-indigo-100 text-indigo-700' },
        { id: '7', name: 'Sneha Pillai', role: 'UX Researcher', department: 'Design', status: 'Active', avatar: 'SP', avatarColor: 'bg-pink-100 text-pink-700' },
        { id: '8', name: 'Karan Gupta', role: 'Sales Executive', department: 'Sales', status: 'Active', avatar: 'KG', avatarColor: 'bg-orange-100 text-orange-700' },
        { id: '9', name: 'Nisha Reddy', role: 'Payroll Specialist', department: 'Finance', status: 'On Leave', avatar: 'NR', avatarColor: 'bg-teal-100 text-teal-700' },
        { id: '10', name: 'Vikram Singh', role: 'DevOps Engineer', department: 'Engineering', status: 'Active', avatar: 'VS', avatarColor: 'bg-cyan-100 text-cyan-700' },
        { id: '11', name: 'Priya Joshi', role: 'Talent Acquisition', department: 'HR', status: 'Remote', avatar: 'PJ', avatarColor: 'bg-lime-100 text-lime-700' },
        { id: '12', name: 'Sahil Rao', role: 'Full Stack Developer', department: 'Engineering', status: 'Active', avatar: 'SR', avatarColor: 'bg-blue-100 text-blue-700' },
      ];
      return NextResponse.json({ employees: defaultEmployees });
    }

    const formatted = dbEmployees.map((emp) => ({
      id: emp._id.toString(),
      name: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Employee',
      role: emp.role || emp.jobRole || 'Team Member',
      department: emp.department || 'General',
      status: emp.status || 'Active',
      avatar: emp.avatar || (emp.name ? emp.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'EM'),
      avatarColor: emp.avatarColor || 'bg-blue-100 text-blue-700',
    }));

    return NextResponse.json({ employees: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
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

    const firstName = body.firstName || '';
    const lastName = body.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'New Employee';
    const avatar = (firstName[0] || 'E') + (lastName[0] || 'M');

    const newEmp = {
      tenantId: auth.user.tenantId,
      name,
      firstName,
      lastName,
      email: body.email,
      role: body.role,
      department: body.department,
      status: body.status || 'Active',
      joinDate: body.joinDate || new Date().toISOString(),
      avatar: avatar.toUpperCase(),
      avatarColor: 'bg-blue-100 text-blue-700',
      createdAt: new Date(),
    };

    const result = await db.collection('employees').insertOne(newEmp);

    return NextResponse.json({
      success: true,
      employee: { id: result.insertedId.toString(), ...newEmp },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}