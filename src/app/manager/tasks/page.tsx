// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import { Circle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface ManagerTask {
//   id?: string;
//   title: string;
//   assignee: string;
//   avatar: string;
//   color: string;
//   due: string;
//   status: 'todo' | 'inprogress' | 'done' | string;
//   priority: 'High' | 'Medium' | 'Low' | string;
// }

// const statusGroups = [
//   { key: 'todo', label: 'To Do', icon: Circle, iconClass: 'text-slate-400', bg: 'bg-slate-50' },
//   { key: 'inprogress', label: 'In Progress', icon: Clock, iconClass: 'text-blue-500', bg: 'bg-blue-50/50' },
//   { key: 'done', label: 'Done', icon: CheckCircle2, iconClass: 'text-emerald-500', bg: 'bg-emerald-50/50' },
// ];

// export default function ManagerTasksPage() {
//   const [tasks, setTasks] = useState<ManagerTask[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/tasks');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setTasks(data.tasks || []);
//       }
//     } catch (err) {
//       console.error('Failed to load manager tasks:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="Tasks" subtitle="View and assign tasks across your team.">
//       <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
//         {statusGroups.map(({ key, label, icon: Icon, iconClass, bg }) => {
//           const groupTasks = tasks.filter((t) => t.status === key);
//           return (
//             <div key={key} className={`rounded-2xl border border-slate-200 ${bg} p-5 shadow-sm`}>
//               <div className="mb-4 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Icon className={`h-4 w-4 ${iconClass}`} />
//                   <h3 className="font-bold text-slate-900">{label}</h3>
//                 </div>
//                 <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
//                   {groupTasks.length}
//                 </span>
//               </div>

//               <div className="space-y-2.5">
//                 {groupTasks.length === 0 && (
//                   <p className="py-4 text-center text-xs text-slate-400">No tasks here</p>
//                 )}
//                 {groupTasks.map((t) => (
//                   <div key={t.id || t.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
//                     <p className={`text-sm font-medium ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
//                       {t.title}
//                     </p>
//                     <div className="mt-2 flex items-center justify-between">
//                       <div className="flex items-center gap-1.5">
//                         <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${t.color}`}>
//                           {t.avatar}
//                         </div>
//                         <span className="text-xs text-slate-500">{t.assignee.split(' ')[0]}</span>
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <span
//                           className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
//                             t.priority === 'High'
//                               ? 'bg-rose-50 text-rose-600'
//                               : t.priority === 'Medium'
//                               ? 'bg-amber-50 text-amber-600'
//                               : 'bg-slate-100 text-slate-500'
//                           }`}
//                         >
//                           {t.priority}
//                         </span>
//                         <span className="text-[10px] text-slate-400">{t.due}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </ManagerPageShell>
//   );
// }
'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { 
  Circle, Clock, CheckCircle2, Loader2, Plus, Search, 
  Filter, X, ChevronRight 
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface ManagerTask {
  id: string;
  title: string;
  assignee: string;
  avatar?: string;
  color?: string;
  due: string;
  status: 'todo' | 'inprogress' | 'done' | string;
  priority: 'High' | 'Medium' | 'Low' | string;
}

const statusGroups = [
  { key: 'todo', label: 'To Do', icon: Circle, iconClass: 'text-slate-400', bg: 'bg-[#F8FAFC]' },
  { key: 'inprogress', label: 'In Progress', icon: Clock, iconClass: 'text-blue-600', bg: 'bg-[#F4F7FC]' },
  { key: 'done', label: 'Completed', icon: CheckCircle2, iconClass: 'text-emerald-600', bg: 'bg-[#F0FDF4]' },
];

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Fetch Tasks from Database
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/tasks');
      if (res.ok) {
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

  // Format Date String
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return 'Today';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Status Change (To Do -> In Progress -> Completed) in Database
  const handleMoveStatus = async (taskId: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      todo: 'inprogress',
      inprogress: 'done',
      done: 'todo',
    };
    const newStatus = nextStatusMap[currentStatus] || 'todo';

    // Optimistic UI Update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch('/api/v1/manager/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (res.ok) {
        setToast(`✓ Task moved to ${newStatus.toUpperCase()}`);
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      fetchTasks();
    } finally {
      setTimeout(() => setToast(''), 2000);
    }
  };

  // Submit & Save New Task to Database
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const formattedDue = formatDateDisplay(dueDate);

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/manager/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle.trim(),
          assignee: assignee.trim() || 'Team Member',
          due: formattedDue,
          priority,
        }),
      });

      if (res.ok) {
        setToast('✓ Task Saved to Database');
        fetchTasks(); // Re-fetch from DB
      } else {
        setToast('✗ Failed to save task');
      }
    } catch (err) {
      console.error('Error saving task:', err);
      setToast('✗ Error saving task');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setTaskTitle('');
      setAssignee('');
      setDueDate('');
      setTimeout(() => setToast(''), 2500);
    }
  };

  // Filter Computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' ? true : t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Task Kanban Board" subtitle="Manage, assign, and track live team tasks.">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast}
        </div>
      )}

      {/* Header Action Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0D1222] sm:text-3xl">Team Task Workspace</h1>
          <p className="mt-1 text-xs text-slate-500">Assign deliverables and monitor live status columns.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />  Create Task
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks or team member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {['all', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                priorityFilter === p
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p} Priority
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {statusGroups.map(({ key, label, icon: Icon, iconClass, bg }) => {
          const groupTasks = filteredTasks.filter((t) => t.status === key);
          return (
            <div key={key} className={`rounded-2xl border border-slate-200/80 ${bg} p-5 shadow-sm min-h-[500px] flex flex-col`}>
              <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${iconClass}`} />
                  <h3 className="text-sm font-bold text-[#0D1222]">{label}</h3>
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs">
                  {groupTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {groupTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs font-medium text-slate-400 border-2 border-dashed border-slate-200/60 rounded-xl">
                    No tasks in {label}
                  </div>
                ) : (
                  groupTasks.map((t) => (
                    <div
                      key={t.id}
                      className="group relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className={`text-xs font-bold ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-[#0D1222]'}`}>
                          {t.title}
                        </p>
                        <button
                          onClick={() => handleMoveStatus(t.id, t.status)}
                          title="Move to next status"
                          className="rounded-lg p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors shrink-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white bg-blue-600 shadow-xs">
                            {t.avatar || t.assignee.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-slate-600">{t.assignee.split(' ')[0]}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                              t.priority === 'High'
                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                : t.priority === 'Medium'
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {t.priority}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">Due {t.due}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Assign New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth Flow"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerPageShell>
  );
}