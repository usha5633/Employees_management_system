'use client';
import HRPageShell from '@/components/hr/HRPageShell';
import { Bell, CheckCircle2, Clock, Users, CalendarDays, Check } from 'lucide-react';
import { useState } from 'react';

const seed = [
  { id: 1, title: 'New Leave Request',        body: 'Rohit Verma applied for 2 days casual leave (Sep 15–16).',      time: '20m ago',  type: 'leave',      read: false },
  { id: 2, title: 'Onboarding Pending',        body: 'Ananya Roy — 3 onboarding steps still pending.',                time: '1h ago',   type: 'onboarding', read: false },
  { id: 3, title: 'Attendance Irregularity',   body: '3 employees marked absent today without prior notification.',   time: '2h ago',   type: 'attendance', read: false },
  { id: 4, title: 'Document Pending Verify',   body: 'Pooja Iyer — Educational Certificate awaiting verification.',  time: '3h ago',   type: 'document',   read: false },
  { id: 5, title: 'New Employee Joined',       body: 'Kiran Pillai has been onboarded to HR department.',            time: '1d ago',   type: 'employee',   read: true  },
  { id: 6, title: 'Leave Approved',            body: 'You approved Danish Khan\'s casual leave for Sep 10.',        time: '2d ago',   type: 'leave',      read: true  },
];

const typeConfig: Record<string, { bg: string; icon_color: string; icon: React.ElementType }> = {
  leave:      { bg: 'bg-blue-50',     icon_color: 'text-blue-600',    icon: CalendarDays },
  onboarding: { bg: 'bg-violet-50',   icon_color: 'text-violet-600',  icon: Users },
  attendance: { bg: 'bg-amber-50',    icon_color: 'text-amber-600',   icon: Clock },
  document:   { bg: 'bg-slate-100',   icon_color: 'text-slate-600',   icon: Bell },
  employee:   { bg: 'bg-emerald-50',  icon_color: 'text-emerald-600', icon: CheckCircle2 },
};

export default function HRNotificationsPage() {
  const [notifications, setNotifications] = useState(seed);

  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unread = notifications.filter(n => !n.read).length;

  return (
    <HRPageShell title="Notifications" subtitle="Stay updated with HR alerts and activity."
      actions={<button onClick={markAllRead} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Check className="h-4 w-4" />Mark all read</button>}>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total',   value: notifications.length,                                    tone: 'slate' },
          { label: 'Unread',  value: unread,                                                   tone: 'blue' },
          { label: 'Leave',   value: notifications.filter(n => n.type === 'leave').length,    tone: 'emerald' },
          { label: 'Alerts',  value: notifications.filter(n => n.type === 'attendance').length,tone: 'amber' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.tone === 'blue' ? 'text-blue-600' : s.tone === 'emerald' ? 'text-emerald-600' : s.tone === 'amber' ? 'text-amber-600' : 'text-slate-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">All Notifications</h2>
          {unread > 0 && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">{unread} unread</span>}
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.map(n => {
            const cfg = typeConfig[n.type] ?? typeConfig.document;
            const Icon = cfg.icon;
            return (
              <div key={n.id} className={`flex items-start gap-4 p-5 hover:bg-slate-50/60 transition-colors ${!n.read ? 'bg-blue-50/20' : ''}`}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 ${cfg.icon_color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                    <p className="font-semibold text-slate-900">{n.title}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{n.body}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3 w-3" />{n.time}</div>
                </div>
                {!n.read && <button onClick={() => markRead(n.id)} className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100">Mark read</button>}
              </div>
            );
          })}
        </div>
      </div>
    </HRPageShell>
  );
}
