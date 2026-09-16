export interface Project {
  id: string;
  name: string;
  role: string;
  progress: number;
  status: 'On Track' | 'In Review' | 'Completed';
  deadline: string;
  color: string;
  tasks: number;
  done: number;
  assignedBy: string;
  assignedTo: string; // Employee Name or ID
}

// Global Central Database State
export let globalProjectsStore: Project[] = [
  {
    id: 'proj-101',
    name: 'Infinite AI Cloud Platform',
    role: 'Lead Frontend Architect',
    progress: 65,
    status: 'On Track',
    deadline: '28 Oct 2026',
    color: 'from-blue-600 to-sky-500',
    tasks: 20,
    done: 13,
    assignedBy: 'Manager (Rajesh K.)',
    assignedTo: 'Priya Sharma',
  },
  {
    id: 'proj-102',
    name: 'Enterprise Payroll Engine',
    role: 'Full Stack Engineer',
    progress: 40,
    status: 'In Review',
    deadline: '15 Nov 2026',
    color: 'from-indigo-600 to-purple-500',
    tasks: 15,
    done: 6,
    assignedBy: 'HR Department',
    assignedTo: 'Priya Sharma',
  },
];