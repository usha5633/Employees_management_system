'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { Megaphone, MessageSquare, UserCircle, Sparkles, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Company Announcements', 'HR Messages', 'Manager Messages', 'Important Notices'];

const announcements = [
  { title: 'Q3 All-Hands Meeting',       from: 'Company',         date: 'Sep 12, 2026', priority: 'High',   unread: true,  body: 'All employees are requested to join the Q3 all-hands meeting on Friday, Sep 12 at 4 PM IST. Attendance is mandatory.' },
  { title: 'New Work-From-Home Policy',  from: 'HR Department',   date: 'Sep 10, 2026', priority: 'High',   unread: true,  body: 'Effective Oct 1, employees can work from home up to 2 days per week. Please refer to the updated HR policy document.' },
  { title: 'Company Holiday — Oct 2',    from: 'HR Department',   date: 'Sep 8, 2026',  priority: 'Medium', unread: false, body: 'The office will remain closed on October 2, 2026 (Gandhi Jayanti). Enjoy the holiday!' },
  { title: 'Sprint 4 Kickoff',           from: 'Aman Khurana',    date: 'Sep 9, 2026',  priority: 'Medium', unread: true,  body: 'Sprint 4 planning is scheduled for Sep 14. Please review the backlog items and come prepared with estimates.' },
  { title: 'Critical: Security Update',  from: 'IT Department',   date: 'Sep 7, 2026',  priority: 'High',   unread: false, body: 'Immediate action required: Please update your laptop OS and VPN client to the latest version by end of today.' },
];

const hrMessages = [
  { title: 'Leave Policy Update',     date: 'Sep 5, 2026',  body: 'Updated leave encashment rules are now in effect. Please review the new policy on the HR portal.' },
  { title: 'Performance Review Dates',date: 'Sep 1, 2026',  body: 'Q3 performance reviews will be conducted September 20–30. Self-appraisals should be submitted by Sep 18.' },
];

const managerMessages = [
  { title: 'Task priority change',   from: 'Aman Khurana', date: 'Sep 11, 2026', body: 'Please prioritise the Design System v2 handoff before the mobile app UAT.' },
  { title: 'Good work on Sprint 3',  from: 'Aman Khurana', date: 'Sep 6, 2026',  body: 'Great job completing all sprint 3 tasks on time. Keep it up!' },
];

const importantNotices = [
  { title: 'Server Maintenance Window', date: 'Sep 14, 2026 11PM–2AM', body: 'All company systems will be under scheduled maintenance. Please save your work beforehand.' },
  { title: 'ID Card Renewal',           date: 'By Sep 30, 2026',       body: 'Employees with ID cards expiring this quarter must submit renewal forms to the admin desk.' },
];

const priorityBadge: Record<string, string> = {
  High:   'bg-rose-50 text-rose-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low:    'bg-slate-100 text-slate-600',
};

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');

  return (
    <EmployeePageShell
      title="Communication"
      subtitle="Stay updated with company announcements, HR and manager messages."
    >
      {/* Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-slate-100">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors ${activeTab === i ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {i === 0 && <Megaphone className="h-4 w-4" />}
              {i === 1 && <UserCircle className="h-4 w-4" />}
              {i === 2 && <MessageSquare className="h-4 w-4" />}
              {i === 3 && <Sparkles className="h-4 w-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="divide-y divide-slate-100">
          {activeTab === 0 && announcements.filter(a => a.title.toLowerCase().includes(search.toLowerCase())).map(a => (
            <div key={a.title} className={`flex gap-4 p-5 hover:bg-slate-50/60 transition-colors ${a.unread ? 'bg-blue-50/20' : ''}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.unread ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Megaphone className={`h-5 w-5 ${a.unread ? 'text-blue-600' : 'text-slate-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {a.unread && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                  <p className="font-bold text-slate-900">{a.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityBadge[a.priority]}`}>{a.priority}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{a.body}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span>From: {a.from}</span><span>·</span><span>{a.date}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 mt-1" />
            </div>
          ))}

          {activeTab === 1 && hrMessages.map(m => (
            <div key={m.title} className="flex gap-4 p-5 hover:bg-slate-50/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <UserCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{m.title}</p>
                <p className="mt-1 text-sm text-slate-600">{m.body}</p>
                <p className="mt-2 text-xs text-slate-400">HR Department · {m.date}</p>
              </div>
            </div>
          ))}

          {activeTab === 2 && managerMessages.map(m => (
            <div key={m.title} className="flex gap-4 p-5 hover:bg-slate-50/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <MessageSquare className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{m.title}</p>
                <p className="mt-1 text-sm text-slate-600">{m.body}</p>
                <p className="mt-2 text-xs text-slate-400">From: {m.from} · {m.date}</p>
              </div>
            </div>
          ))}

          {activeTab === 3 && importantNotices.map(n => (
            <div key={n.title} className="flex gap-4 p-5 hover:bg-slate-50/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                <Sparkles className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{n.title}</p>
                <p className="mt-1 text-sm text-slate-600">{n.body}</p>
                <p className="mt-2 text-xs text-slate-400">{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployeePageShell>
  );
}
