'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { 
  FolderKanban, CalendarDays, Loader2, Search, 
  CheckCircle2, Sparkles, TrendingUp, Layers, Filter, UserCheck, ShieldCheck 
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Project {
  id: string;
  name: string;
  role: string;
  progress: number;
  status: string;
  deadline: string;
  color: string;
  tasks: number;
  done: number;
  assignedBy?: string;
}

export default function EmployeeProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const previousCountRef = useRef<number>(0);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real-Time Background Fetcher (Syncs Manager/HR/Admin Data Live)
  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/v1/projects');
      if (res.ok) {
        const data = await res.json();
        const incomingProjects: Project[] = data.projects || [];

        // Alert user if Manager/HR sent a new project
        if (previousCountRef.current > 0 && incomingProjects.length > previousCountRef.current) {
          const latestProj = incomingProjects[0];
          triggerToast(`New Project Received! "${latestProj.name}" from ${latestProj.assignedBy}`);
        }

        previousCountRef.current = incomingProjects.length;
        setProjects(incomingProjects);
      }
    } catch (err) {
      console.error('Failed to sync projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // 3-second live sync interval from server
    const interval = setInterval(fetchProjects, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleIncrementTask = async (id: string) => {
    try {
      const res = await fetch('/api/v1/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchProjects();
        triggerToast('Progress updated successfully!');
      }
    } catch (err) {
      console.error('Error updating task progress:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <EmployeePageShell
      title="Assigned Projects Portal"
      subtitle="Live project stream received from Admin, HR, and Team Managers."
    >
      {/* Live Incoming Project Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-black text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Real-time Analytics Bar */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Assigned Projects', value: projects.length, icon: Layers, color: 'text-blue-600', border: 'border-blue-100' },
          { label: 'Completion Velocity', value: `${Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1))}%`, icon: TrendingUp, color: 'text-emerald-600', border: 'border-emerald-100' },
          { label: 'Completed Deliverables', value: projects.filter((p) => p.progress === 100).length, icon: CheckCircle2, color: 'text-indigo-600', border: 'border-indigo-100' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex items-center justify-between rounded-2xl border ${s.border} bg-white/90 p-5 shadow-sm backdrop-blur-xl`}>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{s.label}</p>
                <p className={`mt-1 text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-600">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {['All', 'On Track', 'In Review', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterStatus === st ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Projects Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center backdrop-blur-xl">
          <FolderKanban className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-600">No projects assigned from Manager/HR yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl"
            >
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${p.color}`} />

              <div>
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-white shadow-md transition-transform group-hover:scale-105`}>
                      <FolderKanban className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                      <p className="text-xs font-semibold text-slate-400">{p.role}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                      p.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : p.status === 'On Track'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Sender Badge */}
                <div className="mb-4 flex items-center gap-1.5 rounded-xl bg-blue-50/70 border border-blue-100 p-2 text-[10px] font-bold text-blue-700">
                  <UserCheck className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                  <span className="truncate">Received from: {p.assignedBy}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Progress</span>
                    <span className="font-black text-slate-800">{p.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${p.color} transition-all duration-500`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Task Action */}
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{p.done} / {p.tasks} tasks completed</span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                    <span>Due {p.deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleIncrementTask(p.id)}
                  disabled={p.done >= p.tasks}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:text-slate-700 active:scale-[0.98]"
                >
                  {p.done >= p.tasks ? 'Project Complete ✓' : '+ Advance Task Step'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </EmployeePageShell>
  );
}