'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { FolderKanban, Users, CalendarDays, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Project {
  id?: string;
  name: string;
  lead: string;
  team: number;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Done' | string;
  deadline: string;
  color: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/projects');
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Projects" subtitle="Track all team projects and their progress.">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: projects.length },
          { label: 'On Track', value: projects.filter((p) => p.status === 'On Track').length },
          { label: 'At Risk', value: projects.filter((p) => p.status === 'At Risk').length },
          { label: 'Done', value: projects.filter((p) => p.status === 'Done').length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id || p.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.color}`}>
                  <FolderKanban className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500">Lead: {p.lead}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  p.status === 'On Track'
                    ? 'bg-emerald-50 text-emerald-700'
                    : p.status === 'At Risk'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-700'
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
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {p.team} members
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                Due {p.deadline}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ManagerPageShell>
  );
}