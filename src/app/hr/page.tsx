'use client';

import HRPageShell from '@/components/hr/HRPageShell';
import { Users, UserPlus, CalendarDays, Clock, BarChart3, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const recentLeaves = [
  { name: 'Rohit Verma',   type: 'Casual Leave', days: 2, status: 'pending',  avatar: 'RV', color: 'bg-sky-100 text-sky-700' },
  { name: 'Sneha Pillai',  type: 'Sick Leave',   days: 1, status: 'pending',  avatar: 'SP', color: 'bg-pink-100 text-pink-700' },
  { name: 'Aanya Sharma',  type: 'Paid Leave',   days: 3, status: 'approved', avatar: 'AS', color: 'bg-violet-100 text-violet-700' },
  { name: 'Danish Khan',   type: 'Casual Leave', days: 1, status: 'rejected', avatar: 'DK', color: 'bg-amber-100 text-amber-700' },
];

const recentHires = [
  { name: 'Ananya Roy',    role: 'Frontend Engineer', dept: 'Engineering', joining: 'Sep 15', status: 'Onboarding' },
  { name: 'Kiran Pillai',  role: 'HR Specialist',     dept: 'HR',          joining: 'Sep 18', status: 'Offer Sent' },
  { name: 'Saurabh Tiwari',role: 'Sales Executive',   dept: 'Sales',       joining: 'Sep 22', status: 'Doc Pending' },
];

const attendanceSummary = [
  { label: 'Present Today',  value: 48, total: 56, color: 'bg-emerald-500' },
  { label: 'On Leave',       value: 5,  total: 56, color: 'bg-amber-400' },
  { label: 'Absent',         value: 3,  total: 56, color: 'bg-rose-500' },
];

export default function HRDashboardPage() {
  const [leaves, setLeaves] = useState(recentLeaves);

  const handleLeave = (idx: number, action: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map((l, i) => i === idx ? { ...l, status: action } : l));
  };

  const pending = leaves.filter(l => l.status === 'pending').length;

  return (
    <HRPageShell title="HR Dashboard" subtitle="Overview of HR operations across the organisation.">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Employees',    value: '56',      icon: Users,       tone: 'blue',    change: '+3 this month' },
          { label: 'Pending Leaves',     value: String(pending), icon: CalendarDays, tone: 'amber',   change: `${pending} awaiting` },
          { label: 'Open Positions',     value: '6',       icon: UserPlus,    tone: 'violet',  change: '3 in pipeline' },
          { label: 'Avg. Attendance',    value: '94%',     icon: Clock,       tone: 'emerald', change: 'This month' },
        ].map(({ label, value, icon: Icon, tone, change }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs text-slate-500">{label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone === 'blue' ? 'bg-blue-50' : tone === 'amber' ? 'bg-amber-50' : tone === 'violet' ? 'bg-violet-50' : 'bg-emerald-50'}`}>
                <Icon className={`h-4 w-4 ${tone === 'blue' ? 'text-blue-600' : tone === 'amber' ? 'text-amber-600' : tone === 'violet' ? 'text-violet-600' : 'text-emerald-600'}`} />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500"><ArrowUpRight className="h-3 w-3 text-emerald-500" />{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Leave Approvals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Action Required</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Leave Requests</h2>
            </div>
            <Link href="/hr/leave" className="text-xs font-semibold text-emerald-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2.5">
            {leaves.map((l, i) => (
              <div key={`${l.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${l.color}`}>{l.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{l.name}</p>
                  <p className="text-xs text-slate-500">{l.type} · {l.days} day{l.days > 1 ? 's' : ''}</p>
                </div>
                {l.status === 'pending' ? (
                  <div className="flex gap-1.5">
                    <button onClick={() => handleLeave(i, 'approved')} className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">Approve</button>
                    <button onClick={() => handleLeave(i, 'rejected')} className="rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors">Reject</button>
                  </div>
                ) : (
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${l.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {l.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Today</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Attendance Overview</h2>
            </div>
            <Link href="/hr/attendance" className="text-xs font-semibold text-emerald-600 hover:underline">Details →</Link>
          </div>
          <div className="space-y-4">
            {attendanceSummary.map(a => (
              <div key={a.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{a.label}</span>
                  <span className="text-slate-500">{a.value} / {a.total}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full ${a.color} transition-all`} style={{ width: `${(a.value / a.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Present', value: 48, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Leave',   value: 5,  color: 'text-amber-600 bg-amber-50' },
              { label: 'Absent',  value: 3,  color: 'text-rose-600 bg-rose-50' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-[11px] font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Hires / Onboarding */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Onboarding</p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">Recent Hires</h2>
          </div>
          <Link href="/hr/onboarding" className="text-xs font-semibold text-emerald-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Candidate', 'Role', 'Department', 'Joining Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentHires.map(h => (
                <tr key={h.name} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{h.name.split(' ').map(n => n[0]).join('')}</div>
                      <span className="font-semibold text-slate-900">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{h.role}</td>
                  <td className="px-4 py-3 text-slate-600">{h.dept}</td>
                  <td className="px-4 py-3 text-slate-600">{h.joining}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      h.status === 'Onboarding' ? 'bg-blue-50 text-blue-700' :
                      h.status === 'Offer Sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>{h.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Employee Retention', value: '92%', icon: TrendingUp, tone: 'emerald' },
          { label: 'Avg. Leave/Employee', value: '4.2 days', icon: CalendarDays, tone: 'blue' },
          { label: 'Open Recruitment', value: '6 roles', icon: UserPlus, tone: 'violet' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={`flex items-center gap-4 rounded-2xl p-4 ${tone === 'emerald' ? 'bg-emerald-50' : tone === 'blue' ? 'bg-blue-50' : 'bg-violet-50'}`}>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone === 'emerald' ? 'bg-emerald-600' : tone === 'blue' ? 'bg-blue-600' : 'bg-violet-600'}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-2xl font-bold ${tone === 'emerald' ? 'text-emerald-700' : tone === 'blue' ? 'text-blue-700' : 'text-violet-700'}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>
    </HRPageShell>
  );
}
