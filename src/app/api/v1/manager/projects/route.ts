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

    const dbProjects = await db
      .collection('projects')
      .find({ tenantId })
      .toArray();

    if (!dbProjects || dbProjects.length === 0) {
      const defaultProjects = [
        { id: '1', name: 'Design System v2', lead: 'Aanya Sharma', team: 3, progress: 72, status: 'On Track', deadline: 'Sep 30', color: 'from-violet-500 to-purple-500' },
        { id: '2', name: 'Mobile App MVP', lead: 'Rohit Verma', team: 4, progress: 45, status: 'At Risk', deadline: 'Oct 10', color: 'from-amber-400 to-orange-500' },
        { id: '3', name: 'API Integration', lead: 'Vikram Singh', team: 2, progress: 90, status: 'On Track', deadline: 'Sep 20', color: 'from-blue-500 to-indigo-500' },
        { id: '4', name: 'UX Research Phase', lead: 'Sneha Pillai', team: 2, progress: 60, status: 'On Track', deadline: 'Oct 5', color: 'from-pink-400 to-rose-500' },
      ];
      return NextResponse.json({ projects: defaultProjects });
    }

    const formatted = dbProjects.map((p) => ({
      id: p._id.toString(),
      name: p.name || 'Untitled Project',
      lead: p.lead || 'Team Lead',
      team: p.teamMembersCount || p.team || 0,
      progress: p.progress ?? 0,
      status: p.status || 'On Track',
      deadline: p.deadline || 'N/A',
      color: p.color || 'from-blue-500 to-indigo-500',
    }));

    return NextResponse.json({ projects: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}