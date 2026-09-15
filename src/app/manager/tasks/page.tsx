'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { Circle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ManagerTask {
  id?: string;
  title: string;
  assignee: string;
  avatar: string;
  color: string;
  due: string;
  status: 'todo' | 'inprogress' | 'done' | string;
  priority: 'High' | 'Medium' | 'Low' | string;
}

const statusGroups = [
  { key: 'todo', label: 'To Do', icon: Circle, iconClass: 'text-slate-400', bg: 'bg-slate-50' },
  { key: 'inprogress', label: 'In Progress', icon: Clock, iconClass: 'text-blue-500', bg: 'bg-blue-50/50' },
  { key: 'done', label: 'Done', icon: CheckCircle2, iconClass: 'text-emerald-500', bg: 'bg-emerald-50/50' },
];

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/tasks');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load manager tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Tasks" subtitle="View and assign tasks across your team.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {statusGroups.map(({ key, label, icon: Icon, iconClass, bg }) => {
          const groupTasks = tasks.filter((t) => t.status === key);
          return (
            <div key={key} className={`rounded-2xl border border-slate-200 ${bg} p-5 shadow-sm`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${iconClass}`} />
                  <h3 className="font-bold text-slate-900">{label}</h3>
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
                  {groupTasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {groupTasks.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-400">No tasks here</p>
                )}
                {groupTasks.map((t) => (
                  <div key={t.id || t.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className={`text-sm font-medium ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {t.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${t.color}`}>
                          {t.avatar}
                        </div>
                        <span className="text-xs text-slate-500">{t.assignee.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            t.priority === 'High'
                              ? 'bg-rose-50 text-rose-600'
                              : t.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">{t.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ManagerPageShell>
  );
}