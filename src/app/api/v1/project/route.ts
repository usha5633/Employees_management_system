import { NextResponse } from 'next/server';
import { globalProjectsStore, Project } from '@/lib/projectsStore';

// GET: Employee Page continuously polls this route to receive live assigned projects
export async function GET() {
  return NextResponse.json({ 
    success: true, 
    projects: globalProjectsStore 
  });
}

// POST: Manager / HR / Admin portal triggers this endpoint to dispatch project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: body.name,
      role: body.role || 'Software Engineer',
      progress: 0,
      status: 'On Track',
      deadline: body.deadline || '2026-12-31',
      color: body.color || 'from-blue-600 to-sky-500',
      tasks: Number(body.tasks) || 10,
      done: 0,
      assignedBy: body.assignedBy || 'Manager Portal',
      assignedTo: body.assignedTo || 'Priya Sharma',
    };

    // Push directly to Central Database Engine
    globalProjectsStore.unshift(newProject);

    return NextResponse.json({ 
      success: true, 
      message: 'Project assigned successfully to Employee Portal!',
      project: newProject 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to assign project' }, { status: 500 });
  }
}

// PATCH: Employee updates task progress
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    const projectIndex = globalProjectsStore.findIndex((p) => p.id === id);

    if (projectIndex !== -1) {
      const p = globalProjectsStore[projectIndex];
      const updatedDone = Math.min(p.tasks, p.done + 1);
      const updatedProgress = Math.round((updatedDone / p.tasks) * 100);

      globalProjectsStore[projectIndex] = {
        ...p,
        done: updatedDone,
        progress: updatedProgress,
        status: updatedProgress === 100 ? 'Completed' : p.status,
      };
    }

    return NextResponse.json({ success: true, projects: globalProjectsStore });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}