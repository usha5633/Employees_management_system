'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { Circle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Task {
  id?: string;
  title: string;
  due: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'High' | 'Medium' | 'Low';
  project: string;
}

const statusGroups = [
  { key: 'todo', label: 'To Do', icon: Circle, iconClass: 'text-slate-400', bg: 'bg-slate-50' },
  { key: 'inprogress', label: 'In Progress', icon: Clock, iconClass: 'text-blue-500', bg: 'bg-blue-50/40' },
  { key: 'done', label: 'Done', icon: CheckCircle2, iconClass: 'text-emerald-500', bg: 'bg-emerald-50/40' },
];

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tasks');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <EmployeePageShell title="Tasks" subtitle="Your assigned tasks and current progress.">
      <div className="grid grid-cols-3 gap-4 mb-2">
        {[
          { label: 'Total', value: tasks.length },
          { label: 'Pending', value: tasks.filter((t) => t.status !== 'done').length },
          { label: 'Completed', value: tasks.filter((t) => t.status === 'done').length },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
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
                    <p className="text-xs text-slate-400 text-center py-4">No tasks here</p>
                  )}
                  {groupTasks.map((t) => (
                    <div key={t.id || t.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className={`text-sm font-medium ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {t.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{t.project}</span>
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
      )}
    </EmployeePageShell>
  );
}