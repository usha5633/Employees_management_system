import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: Fetch Projects directly from MongoDB (No Static Mock Fallbacks)
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
      .sort({ createdAt: -1 })
      .toArray();

    const formatted = (dbProjects || []).map((p) => ({
      id: p._id.toString(),
      name: p.name || 'Untitled Project',
      lead: p.lead || 'Team Lead',
      team: p.teamMembersCount ?? p.team ?? 0,
      progress: p.progress ?? 0,
      status: p.status || 'On Track',
      deadline: p.deadline || 'N/A',
      color: p.color || 'from-blue-600 to-indigo-600',
    }));

    return NextResponse.json({ projects: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST: Direct Insert to MongoDB
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, lead, team, progress, status, deadline } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const tenantId = auth.user.tenantId;

    const newProjectDocument = {
      tenantId,
      name: name.trim(),
      lead: lead?.trim() || auth.user.name || 'Team Lead',
      team: Number(team) || 1,
      teamMembersCount: Number(team) || 1,
      progress: progress ?? 0,
      status: status || 'On Track',
      deadline: deadline || 'N/A',
      color: 'from-blue-600 to-indigo-600',
      createdAt: new Date(),
    };

    const result = await db.collection('projects').insertOne(newProjectDocument);

    return NextResponse.json(
      {
        success: true,
        project: {
          id: result.insertedId.toString(),
          ...newProjectDocument,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}