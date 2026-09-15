'use client';
import HRPageShell from '@/components/hr/HRPageShell';
import { Download, BarChart3, Users, CalendarDays, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';

const deptData = [
  { dept: 'Engineering', count: 18, percent: 32, color: 'from-blue-500 to-indigo-500' },
  { dept: 'Sales',        count: 12, percent: 21, color: 'from-amber-400 to-orange-500' },
  { dept: 'Design',       count: 8,  percent: 14, color: 'from-violet-400 to-purple-500' },
  { dept: 'HR',           count: 6,  percent: 11, color: 'from-emerald-400 to-teal-500' },
  { dept: 'Finance',      count: 7,  percent: 13, color: 'from-rose-400 to-pink-500' },
  { dept: 'Operations',   count: 5,  percent: 9,  color: 'from-cyan-400 to-sky-500' },
];

const newJoiners = [
  { name: 'Ananya Roy',     dept: 'Engineering', date: 'Sep 15', avatar: 'AR', color: 'bg-blue-100 text-blue-700' },
  { name: 'Kiran Pillai',   dept: 'HR',          date: 'Sep 18', avatar: 'KP', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Saurabh Tiwari', dept: 'Sales',       date: 'Sep 22', avatar: 'ST', color: 'bg-amber-100 text-amber-700' },
];

export default function HRReportsPage() {
  return (
    <HRPageShell title="HR Reports" subtitle="Analytics and reports across HR operations."
      actions={<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" />Export Report</button>}>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Employees', value: '56',  change: '+3 this month', icon: Users,       tone: 'blue' },
          { label: 'New Joiners',     value: '3',   change: 'This quarter',  icon: TrendingUp,  tone: 'emerald' },
          { label: 'Avg. Attendance', value: '94%', change: 'September',     icon: Clock,       tone: 'violet' },
          { label: 'Leave Taken',     value: '4.2', change: 'Days/employee', icon: CalendarDays,tone: 'amber' },
        ].map(({ label, value, change, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-xs text-slate-500">{label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone === 'blue' ? 'bg-blue-50' : tone === 'emerald' ? 'bg-emerald-50' : tone === 'violet' ? 'bg-violet-50' : 'bg-amber-50'}`}>
                <Icon className={`h-4 w-4 ${tone === 'blue' ? 'text-blue-600' : tone === 'emerald' ? 'text-emerald-600' : tone === 'violet' ? 'text-violet-600' : 'text-amber-600'}`} />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500"><ArrowUpRight className="h-3 w-3 text-emerald-500" />{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900">Department-wise Employees</h3>
          </div>
          <div className="space-y-4">
            {deptData.map(d => (
              <div key={d.dept}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{d.dept}</span>
                  <span className="text-slate-500">{d.count} employees · {d.percent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-2.5 rounded-full bg-gradient-to-r ${d.color}`} style={{ width: `${d.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Joiners + Active/Inactive */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-slate-900">New Joiners (This Quarter)</h3>
            <div className="space-y-2.5">
              {newJoiners.map(j => (
                <div key={j.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${j.color}`}>{j.avatar}</div>
                    <div><p className="text-sm font-semibold text-slate-900">{j.name}</p><p className="text-xs text-slate-500">{j.dept}</p></div>
                  </div>
                  <span className="text-xs text-slate-500">{j.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-bold text-slate-900">Active / Inactive Status</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Active',    value: 48, percent: 86, color: 'bg-emerald-500' },
                { label: 'On Leave',  value: 5,  percent: 9,  color: 'bg-amber-400' },
                { label: 'Inactive',  value: 3,  percent: 5,  color: 'bg-rose-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-semibold text-slate-700">{s.label}</span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs text-slate-500">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Export Reports</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Employee List', 'Attendance Report', 'Leave Summary', 'Department Report'].map(r => (
            <button key={r} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
              <Download className="h-4 w-4" />{r}
            </button>
          ))}
        </div>
      </div>
    </HRPageShell>
  );
}
