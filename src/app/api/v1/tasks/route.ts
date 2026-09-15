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
    const userId = auth.user._id;
    const tenantId = auth.user.tenantId;

    const dbTasks = await db
      .collection('tasks')
      .find({ tenantId, assignedTo: userId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!dbTasks || dbTasks.length === 0) {
      const defaultTasks = [
        { id: '1', title: 'Review updated design mockups', due: 'Today', status: 'todo', priority: 'High', project: 'Design System v2' },
        { id: '2', title: 'Update component documentation', due: 'Sep 14', status: 'inprogress', priority: 'Medium', project: 'Design System v2' },
        { id: '3', title: 'Submit Q3 self-review form', due: 'Sep 15', status: 'inprogress', priority: 'High', project: 'HR Process' },
        { id: '4', title: 'Prepare sprint retrospective notes', due: 'Sep 16', status: 'todo', priority: 'Medium', project: 'Mobile App MVP' },
        { id: '5', title: 'Finalize onboarding deck', due: 'Sep 10', status: 'done', priority: 'Low', project: 'HR Process' },
        { id: '6', title: 'Prototype review feedback', due: 'Sep 8', status: 'done', priority: 'Medium', project: 'UX Research' },
      ];
      return NextResponse.json({ tasks: defaultTasks });
    }

    const formattedTasks = dbTasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      due: t.dueDate || 'No date',
      status: t.status || 'todo',
      priority: t.priority || 'Medium',
      project: t.projectName || 'General',
    }));

    return NextResponse.json({ tasks: formattedTasks });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
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