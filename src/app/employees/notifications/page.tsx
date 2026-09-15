// 'use client';

// import EmployeePageShell from '@/components/employee/EmployeePageShell';
// import { Bell, CheckCircle2, Clock, CalendarDays, CheckSquare, AlertTriangle, Check } from 'lucide-react';
// import { useState } from 'react';

// const allNotifications = [
//   { id: 1,  type: 'leave',       title: 'Leave Request Approved',      body: 'Your sick leave for Sep 7 has been approved by your manager.',       time: '30m ago',  read: false },
//   { id: 2,  type: 'task',        title: 'Task Assigned',                body: 'You have been assigned "Review design mockups" — due today.',         time: '1h ago',   read: false },
//   { id: 3,  type: 'payroll',     title: 'Payslip Available',            body: 'Your August 2026 payslip is ready. Click to download.',              time: '2h ago',   read: false },
//   { id: 4,  type: 'attendance',  title: 'Late Attendance Alert',        body: 'You checked in 12 minutes late on Sep 11. Please be on time.',       time: '1d ago',   read: false },
//   { id: 5,  type: 'task',        title: 'Task Deadline Approaching',    body: '"Q3 self-review submission" is due in 3 days.',                      time: '1d ago',   read: true  },
//   { id: 6,  type: 'leave',       title: 'Leave Balance Updated',        body: 'Your leave balance has been updated for Q3.',                        time: '2d ago',   read: true  },
//   { id: 7,  type: 'attendance',  title: 'Attendance Summary Ready',     body: 'Your September attendance summary is now available.',                time: '3d ago',   read: true  },
//   { id: 8,  type: 'general',     title: 'Q3 All-Hands Meeting',        body: 'Reminder: Q3 all-hands meeting is on Friday at 4:00 PM.',           time: '3d ago',   read: true  },
// ];

// const typeConfig: Record<string, { icon: React.ElementType; bg: string; icon_color: string }> = {
//   leave:      { icon: CalendarDays, bg: 'bg-emerald-50',  icon_color: 'text-emerald-600' },
//   task:       { icon: CheckSquare,  bg: 'bg-blue-50',     icon_color: 'text-blue-600' },
//   payroll:    { icon: CheckCircle2, bg: 'bg-violet-50',   icon_color: 'text-violet-600' },
//   attendance: { icon: AlertTriangle,bg: 'bg-amber-50',    icon_color: 'text-amber-600' },
//   general:    { icon: Bell,         bg: 'bg-slate-100',   icon_color: 'text-slate-600' },
// };

// const filterTabs = ['All', 'Unread', 'Tasks', 'Leave', 'Attendance'];

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState(allNotifications);
//   const [activeFilter, setActiveFilter] = useState('All');

//   const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//   const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

//   const filtered = notifications.filter(n => {
//     if (activeFilter === 'Unread')    return !n.read;
//     if (activeFilter === 'Tasks')     return n.type === 'task';
//     if (activeFilter === 'Leave')     return n.type === 'leave';
//     if (activeFilter === 'Attendance')return n.type === 'attendance';
//     return true;
//   });

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <EmployeePageShell
//       title="Notifications"
//       subtitle="Stay updated with your latest alerts and updates."
//       actions={
//         <button onClick={markAllRead} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
//           <Check className="h-4 w-4" />Mark all read
//         </button>
//       }
//     >
//       {/* Stats */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {[
//           { label: 'Total',      value: notifications.length,                                         tone: 'slate' },
//           { label: 'Unread',     value: unreadCount,                                                   tone: 'blue' },
//           { label: 'Tasks',      value: notifications.filter(n => n.type === 'task').length,           tone: 'violet' },
//           { label: 'Leave/Att.', value: notifications.filter(n => ['leave','attendance'].includes(n.type)).length, tone: 'emerald' },
//         ].map(s => (
//           <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <p className="text-xs text-slate-500">{s.label}</p>
//             <p className={`mt-2 text-3xl font-bold ${s.tone === 'blue' ? 'text-blue-600' : s.tone === 'violet' ? 'text-violet-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{s.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         {/* Filter Tabs */}
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
//           <div className="flex gap-1">
//             {filterTabs.map(f => (
//               <button key={f} onClick={() => setActiveFilter(f)} className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilter === f ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
//                 {f}{f === 'Unread' && unreadCount > 0 && <span className="ml-1 rounded-full bg-white/30 px-1">{unreadCount}</span>}
//               </button>
//             ))}
//           </div>
//           <span className="text-xs text-slate-400">{filtered.length} notifications</span>
//         </div>

//         {/* List */}
//         <div className="divide-y divide-slate-100">
//           {filtered.length === 0 && (
//             <div className="py-12 text-center text-sm text-slate-400">No notifications found.</div>
//           )}
//           {filtered.map(n => {
//             const cfg = typeConfig[n.type] ?? typeConfig.general;
//             const Icon = cfg.icon;
//             return (
//               <div key={n.id} className={`flex items-start gap-4 p-5 transition-colors hover:bg-slate-50/60 ${!n.read ? 'bg-blue-50/20' : ''}`}>
//                 <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
//                   <Icon className={`h-5 w-5 ${cfg.icon_color}`} />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
//                     <p className={`font-semibold text-slate-900 ${n.read ? 'font-medium' : ''}`}>{n.title}</p>
//                   </div>
//                   <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>
//                   <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
//                     <Clock className="h-3 w-3" />{n.time}
//                   </div>
//                 </div>
//                 {!n.read && (
//                   <button onClick={() => markRead(n.id)} className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100">
//                     Mark read
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </EmployeePageShell>
//   );
// }

'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { Bell, CheckCircle2, Clock, CalendarDays, CheckSquare, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NotificationItem {
  id: string | number;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const typeConfig: Record<string, { icon: React.ElementType; bg: string; icon_color: string }> = {
  leave: { icon: CalendarDays, bg: 'bg-emerald-50', icon_color: 'text-emerald-600' },
  task: { icon: CheckSquare, bg: 'bg-blue-50', icon_color: 'text-blue-600' },
  payroll: { icon: CheckCircle2, bg: 'bg-violet-50', icon_color: 'text-violet-600' },
  attendance: { icon: AlertTriangle, bg: 'bg-amber-50', icon_color: 'text-amber-600' },
  general: { icon: Bell, bg: 'bg-slate-100', icon_color: 'text-slate-600' },
};

const filterTabs = ['All', 'Unread', 'Tasks', 'Leave', 'Attendance'];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/notifications');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/v1/notifications', { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to update all read:', err);
    }
  };

  const markRead = async (id: string | number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Tasks') return n.type === 'task';
    if (activeFilter === 'Leave') return n.type === 'leave';
    if (activeFilter === 'Attendance') return n.type === 'attendance';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <EmployeePageShell
      title="Notifications"
      subtitle="Stay updated with your latest alerts and updates."
      actions={
        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Check className="h-4 w-4" />Mark all read
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: notifications.length, tone: 'slate' },
          { label: 'Unread', value: unreadCount, tone: 'blue' },
          { label: 'Tasks', value: notifications.filter((n) => n.type === 'task').length, tone: 'violet' },
          { label: 'Leave/Att.', value: notifications.filter((n) => ['leave', 'attendance'].includes(n.type)).length, tone: 'emerald' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.tone === 'blue' ? 'text-blue-600' : s.tone === 'violet' ? 'text-violet-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <div className="flex gap-1">
            {filterTabs.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${activeFilter === f ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {f}{f === 'Unread' && unreadCount > 0 && <span className="ml-1 rounded-full bg-white/30 px-1">{unreadCount}</span>}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400">{filtered.length} notifications</span>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No notifications found.</div>
          ) : (
            filtered.map((n) => {
              const cfg = typeConfig[n.type] ?? typeConfig.general;
              const Icon = cfg.icon;
              return (
                <div key={n.id} className={`flex items-start gap-4 p-5 transition-colors hover:bg-slate-50/60 ${!n.read ? 'bg-blue-50/20' : ''}`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                    <Icon className={`h-5 w-5 ${cfg.icon_color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                      <p className={`font-semibold text-slate-900 ${n.read ? 'font-medium' : ''}`}>{n.title}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />{n.time}
                    </div>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100">
                      Mark read
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </EmployeePageShell>
  );
}