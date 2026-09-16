import { NextResponse } from 'next/server';

// Temporary In-Memory Data store for dynamic state synchronization
let tasksDatabase = [
  { id: '1', title: 'Refactor Authentication Pipeline', project: 'Security API', priority: 'High', due: '18 Sep 2026', status: 'todo', assignedBy: 'Manager (Rajesh K.)' },
  { id: '2', title: 'Design Glassmorphism Dashboard', project: 'UI/UX Redesign', priority: 'High', due: '19 Sep 2026', status: 'inprogress', assignedBy: 'Manager (Rajesh K.)' },
  { id: '3', title: 'MongoDB Index Optimization', project: 'Database Core', priority: 'Medium', due: '22 Sep 2026', status: 'inprogress', assignedBy: 'Admin' },
  { id: '4', title: 'Setup CI/CD Deployment Pipeline', project: 'DevOps', priority: 'Low', due: '15 Sep 2026', status: 'done', assignedBy: 'Manager (Rajesh K.)' },
];

export async function GET() {
  return NextResponse.json({ success: true, tasks: tasksDatabase });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask = {
      id: Date.now().toString(),
      title: body.title,
      project: body.project || 'General',
      priority: body.priority || 'Medium',
      due: body.due || 'Upcoming',
      status: body.status || 'todo',
      assignedBy: body.assignedBy || 'Self / Employee',
    };

    tasksDatabase.unshift(newTask);
    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    tasksDatabase = tasksDatabase.map((t) =>
      t.id === body.id ? { ...t, status: body.status } : t
    );
    return NextResponse.json({ success: true, tasks: tasksDatabase });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}