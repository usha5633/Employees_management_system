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

    // Manager View: Fetch all team tasks scoped by tenantId
    const dbTasks = await db
      .collection('tasks')
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!dbTasks || dbTasks.length === 0) {
      const defaultTasks = [
        { id: '1', title: 'Review design mockups', assignee: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', due: 'Today', status: 'todo', priority: 'High' },
        { id: '2', title: 'Sprint planning meeting', assignee: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', due: 'Tomorrow', status: 'inprogress', priority: 'High' },
        { id: '3', title: 'Performance review forms', assignee: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700', due: 'Sep 15', status: 'done', priority: 'Medium' },
        { id: '4', title: 'Deploy API v2 to staging', assignee: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', due: 'Sep 16', status: 'inprogress', priority: 'High' },
        { id: '5', title: 'Update project docs', assignee: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', due: 'Sep 18', status: 'todo', priority: 'Low' },
        { id: '6', title: 'Code review — auth module', assignee: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', due: 'Sep 17', status: 'done', priority: 'Medium' },
      ];
      return NextResponse.json({ tasks: defaultTasks });
    }

    const formattedTasks = dbTasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      assignee: t.assigneeName || t.assignee || 'Unassigned',
      avatar: t.avatar || 'TM',
      color: t.color || 'bg-slate-100 text-slate-700',
      due: t.dueDate || 'No date',
      status: t.status || 'todo',
      priority: t.priority || 'Medium',
    }));

    return NextResponse.json({ tasks: formattedTasks });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch manager tasks' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, newStatus } = await req.json();
    const db = await getDatabase();

    if (ObjectId.isValid(taskId)) {
      await db.collection('tasks').updateOne(
        { _id: new ObjectId(taskId), tenantId: auth.user.tenantId },
        { $set: { status: newStatus, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}