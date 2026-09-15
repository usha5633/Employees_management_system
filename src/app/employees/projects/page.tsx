'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { FolderKanban, CalendarDays, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Project {
  id?: string;
  name: string;
  role: string;
  progress: number;
  status: string;
  deadline: string;
  color: string;
  tasks: number;
  done: number;
}

export default function EmployeeProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/projects');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <EmployeePageShell title="Projects" subtitle="Projects you are currently assigned to.">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No projects assigned yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id || p.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.color}`}>
                    <FolderKanban className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.role}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    p.status === 'On Track' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="mb-3">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-slate-700">{p.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {p.done}/{p.tasks} tasks done
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />Due {p.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </EmployeePageShell>
  );
}