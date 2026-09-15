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

    const dbProjects = await db
      .collection('projects')
      .find({ tenantId, $or: [{ assignedUsers: userId }, { leadId: userId }] })
      .sort({ createdAt: -1 })
      .toArray();

    if (!dbProjects || dbProjects.length === 0) {
      const defaultProjects = [
        { id: '1', name: 'Design System v2', role: 'Lead Designer', progress: 72, status: 'On Track', deadline: 'Sep 30', color: 'from-violet-500 to-purple-500', tasks: 5, done: 3 },
        { id: '2', name: 'Mobile App MVP', role: 'Contributor', progress: 45, status: 'At Risk', deadline: 'Oct 10', color: 'from-amber-400 to-orange-500', tasks: 8, done: 3 },
        { id: '3', name: 'UX Research Phase', role: 'Researcher', progress: 60, status: 'On Track', deadline: 'Oct 5', color: 'from-pink-400 to-rose-500', tasks: 4, done: 2 },
      ];
      return NextResponse.json({ projects: defaultProjects });
    }

    const formattedProjects = dbProjects.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      role: p.userRole || 'Contributor',
      progress: p.progress || 0,
      status: p.status || 'On Track',
      deadline: p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
      color: p.color || 'from-violet-500 to-purple-500',
      tasks: p.totalTasks || 0,
      done: p.completedTasks || 0,
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}