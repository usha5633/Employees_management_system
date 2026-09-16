'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  Bell,
  CheckCircle2,
  Clock,
  CalendarDays,
  CheckSquare,
  AlertTriangle,
  Check,
  Loader2,
  Sparkles,
  Inbox,
  Filter,
  CheckCheck,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface NotificationItem {
  id: string | number;
  type: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const typeConfig: Record<string, { icon: React.ElementType; bg: string; icon_color: string; border: string }> = {
  leave: { icon: CalendarDays, bg: 'bg-emerald-50', icon_color: 'text-emerald-600', border: 'border-emerald-100' },
  task: { icon: CheckSquare, bg: 'bg-blue-50', icon_color: 'text-blue-600', border: 'border-blue-100' },
  payroll: { icon: CheckCircle2, bg: 'bg-violet-50', icon_color: 'text-violet-600', border: 'border-violet-100' },
  attendance: { icon: AlertTriangle, bg: 'bg-amber-50', icon_color: 'text-amber-600', border: 'border-amber-100' },
  general: { icon: Bell, bg: 'bg-slate-100', icon_color: 'text-slate-600', border: 'border-slate-200' },
};

const filterTabs = ['All', 'Unread', 'Tasks', 'Leave', 'Attendance'];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, type: 'leave', title: 'Leave Request Approved', body: 'Your sick leave for Sep 7 has been approved by your manager.', time: '30m ago', read: false },
    { id: 2, type: 'task', title: 'Task Assigned', body: 'You have been assigned "Review design mockups" — due today.', time: '1h ago', read: false },
    { id: 3, type: 'payroll', title: 'Payslip Available', body: 'Your August 2026 payslip is ready. Click to download statement.', time: '2h ago', read: false },
    { id: 4, type: 'attendance', title: 'Late Attendance Alert', body: 'You checked in 12 minutes late on Sep 11. Please maintain punctuality.', time: '1d ago', read: false },
    { id: 5, type: 'task', title: 'Task Deadline Approaching', body: '"Q3 self-review submission" is due in 3 days.', time: '1d ago', read: true },
    { id: 6, type: 'leave', title: 'Leave Balance Updated', body: 'Your leave balance has been refreshed for Q3 cycle.', time: '2d ago', read: true },
    { id: 7, type: 'attendance', title: 'Attendance Summary Ready', body: 'Your September attendance summary is now available for download.', time: '3d ago', read: true },
    { id: 8, type: 'general', title: 'Q3 All-Hands Meeting', body: 'Reminder: Q3 corporate all-hands meeting is scheduled for Friday at 4:00 PM.', time: '3d ago', read: true },
  ]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/notifications');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('All notifications marked as read.');
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
      title="Activity & Notifications"
      subtitle="Stay ahead with real-time updates regarding tasks, leave approvals, and payroll."
      actions={
        <button
          onClick={markAllRead}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <CheckCheck className="h-4 w-4" />
          <span>Mark all as read</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Alerts', value: notifications.length, tone: 'slate', icon: Inbox },
          { label: 'Unread Items', value: unreadCount, tone: 'blue', icon: Bell },
          { label: 'Active Tasks', value: notifications.filter((n) => n.type === 'task').length, tone: 'violet', icon: CheckSquare },
          { label: 'Leave & Attendance', value: notifications.filter((n) => ['leave', 'attendance'].includes(n.type)).length, tone: 'emerald', icon: CalendarDays },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{s.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p
                className={`mt-3 text-3xl font-black ${
                  s.tone === 'blue'
                    ? 'text-blue-600'
                    : s.tone === 'violet'
                    ? 'text-violet-600'
                    : s.tone === 'emerald'
                    ? 'text-emerald-600'
                    : 'text-slate-900'
                }`}
              >
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Notification Hub Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl overflow-hidden">
        {/* Filter Bar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {filterTabs.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {f}
                  {f === 'Unread' && unreadCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-slate-400">Showing {filtered.length} entries</span>
        </div>

        {/* Notifications Feed */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="flex h-44 items-center justify-center bg-slate-50/50">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No notifications found</p>
              <p className="text-xs text-slate-400 mt-0.5">You are fully caught up with all your updates!</p>
            </div>
          ) : (
            filtered.map((n) => {
              const cfg = typeConfig[n.type] ?? typeConfig.general;
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-5 transition-all hover:bg-slate-50/80 ${
                    !n.read ? 'bg-blue-50/30 border-l-4 border-l-blue-600' : 'bg-white'
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${cfg.bg} ${cfg.border} border`}>
                    <Icon className={`h-5 w-5 ${cfg.icon_color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      {!n.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600 animate-pulse" />}
                      <p className={`text-sm text-slate-900 ${!n.read ? 'font-black' : 'font-bold'}`}>{n.title}</p>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed">{n.body}</p>
                    <div className="mt-2.5 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{n.time}</span>
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                    >
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