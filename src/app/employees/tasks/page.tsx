// 'use client';

// import EmployeePageShell from '@/components/employee/EmployeePageShell';
// import { Circle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface Task {
//   id?: string;
//   title: string;
//   due: string;
//   status: 'todo' | 'inprogress' | 'done';
//   priority: 'High' | 'Medium' | 'Low';
//   project: string;
// }

// const statusGroups = [
//   { key: 'todo', label: 'To Do', icon: Circle, iconClass: 'text-slate-400', bg: 'bg-slate-50' },
//   { key: 'inprogress', label: 'In Progress', icon: Clock, iconClass: 'text-blue-500', bg: 'bg-blue-50/40' },
//   { key: 'done', label: 'Done', icon: CheckCircle2, iconClass: 'text-emerald-500', bg: 'bg-emerald-50/40' },
// ];

// export default function EmployeeTasksPage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/tasks');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setTasks(data.tasks || []);
//       }
//     } catch (err) {
//       console.error('Failed to load tasks:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <EmployeePageShell title="Tasks" subtitle="Your assigned tasks and current progress.">
//       <div className="grid grid-cols-3 gap-4 mb-2">
//         {[
//           { label: 'Total', value: tasks.length },
//           { label: 'Pending', value: tasks.filter((t) => t.status !== 'done').length },
//           { label: 'Completed', value: tasks.filter((t) => t.status === 'done').length },
//         ].map((s) => (
//           <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <p className="text-xs text-slate-500">{s.label}</p>
//             <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {loading ? (
//         <div className="flex h-40 items-center justify-center">
//           <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//           {statusGroups.map(({ key, label, icon: Icon, iconClass, bg }) => {
//             const groupTasks = tasks.filter((t) => t.status === key);
//             return (
//               <div key={key} className={`rounded-2xl border border-slate-200 ${bg} p-5 shadow-sm`}>
//                 <div className="mb-4 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Icon className={`h-4 w-4 ${iconClass}`} />
//                     <h3 className="font-bold text-slate-900">{label}</h3>
//                   </div>
//                   <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
//                     {groupTasks.length}
//                   </span>
//                 </div>
//                 <div className="space-y-2.5">
//                   {groupTasks.length === 0 && (
//                     <p className="text-xs text-slate-400 text-center py-4">No tasks here</p>
//                   )}
//                   {groupTasks.map((t) => (
//                     <div key={t.id || t.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
//                       <p className={`text-sm font-medium ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
//                         {t.title}
//                       </p>
//                       <div className="mt-2 flex items-center justify-between">
//                         <span className="text-[10px] text-slate-500">{t.project}</span>
//                         <div className="flex items-center gap-1.5">
//                           <span
//                             className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
//                               t.priority === 'High'
//                                 ? 'bg-rose-50 text-rose-600'
//                                 : t.priority === 'Medium'
//                                 ? 'bg-amber-50 text-amber-600'
//                                 : 'bg-slate-100 text-slate-500'
//                             }`}
//                           >
//                             {t.priority}
//                           </span>
//                           <span className="text-[10px] text-slate-400">{t.due}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </EmployeePageShell>
//   );
// }

'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { 
  Circle, Clock, CheckCircle2, Loader2, Plus, 
  Search, Calendar, UserCheck, AlertCircle 
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  due: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'High' | 'Medium' | 'Low';
  project: string;
  assignedBy?: string;
}

const statusGroups = [
  { key: 'todo', label: 'To Do', icon: Circle, iconClass: 'text-slate-400', bg: 'bg-slate-50/80', border: 'border-slate-200' },
  { key: 'inprogress', label: 'In Progress', icon: Clock, iconClass: 'text-blue-500 animate-pulse', bg: 'bg-blue-50/30', border: 'border-blue-100' },
  { key: 'done', label: 'Completed', icon: CheckCircle2, iconClass: 'text-emerald-500', bg: 'bg-emerald-50/30', border: 'border-emerald-100' },
];

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    project: 'Core Development',
    priority: 'Medium' as const,
    due: '22 Sep 2026',
  });

  // 1. Fetch Dynamic Tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/tasks');
      if (res.ok) {
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

  // 2. Dynamic Task Add Handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          status: 'todo',
          assignedBy: 'Self Created',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => [data.task, ...prev]);
        setIsModalOpen(false);
        setNewTask({ title: '', project: 'Core Development', priority: 'Medium', due: '22 Sep 2026' });
      }
    } catch (err) {
      console.error('Task Addition Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Dynamic Status Update Handler
  const handleUpdateStatus = async (taskId: string, nextStatus: 'todo' | 'inprogress' | 'done') => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );

    try {
      await fetch('/api/v1/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to sync status:', err);
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <EmployeePageShell 
      title="Task Workspace" 
      subtitle="Dynamic real-time team and manager task workflow."
      actions={
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Task</span>
        </button>
      }
    >
      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'text-slate-900', border: 'border-slate-200' },
          { label: 'Pending Action', value: tasks.filter((t) => t.status !== 'done').length, color: 'text-blue-600', border: 'border-blue-100' },
          { label: 'Completed', value: tasks.filter((t) => t.status === 'done').length, color: 'text-emerald-600', border: 'border-emerald-100' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border ${s.border} bg-white/90 p-5 shadow-sm backdrop-blur-xl`}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks or project tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
          />
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statusGroups.map(({ key, label, icon: Icon, iconClass, bg, border }) => {
            const groupTasks = filteredTasks.filter((t) => t.status === key);
            return (
              <div key={key} className={`flex flex-col rounded-3xl border ${border} ${bg} p-5 shadow-sm backdrop-blur-xl`}>
                <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${iconClass}`} />
                    <h3 className="text-sm font-black text-slate-900">{label}</h3>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700 shadow-xs border border-slate-200">
                    {groupTasks.length}
                  </span>
                </div>

                <div className="space-y-3.5 flex-1">
                  {groupTasks.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/70 p-4 text-center">
                      <AlertCircle className="h-5 w-5 text-slate-300 mb-1" />
                      <p className="text-xs font-semibold text-slate-400">No tasks in this lane</p>
                    </div>
                  )}

                  {groupTasks.map((t) => (
                    <div
                      key={t.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200/60">
                            {t.project}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              t.priority === 'High'
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : t.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <h4
                          className={`text-xs font-bold leading-relaxed ${
                            t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'
                          }`}
                        >
                          {t.title}
                        </h4>
                      </div>

                      {/* Manager Tag Details */}
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 bg-blue-50/50 rounded-lg p-1.5">
                        <UserCheck className="h-3 w-3 shrink-0" />
                        <span className="truncate">Assigned by: {t.assignedBy || 'Manager'}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span className="text-[10px] font-semibold">{t.due}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {t.status === 'todo' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'inprogress')}
                              className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Start →
                            </button>
                          )}
                          {t.status === 'inprogress' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'done')}
                              className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              Complete ✓
                            </button>
                          )}
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

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 mb-1">Add Task</h3>
            <p className="text-xs text-slate-500 mb-4">Task direct dynamic queue me store ho jayega.</p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Task description..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Project</label>
                  <input
                    type="text"
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                >
                  {isSubmitting ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </EmployeePageShell>
  );
}