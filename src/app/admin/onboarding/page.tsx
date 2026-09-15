'use client';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { UserPlus, CheckCircle2, Circle, Clock } from 'lucide-react';

const onboardees = [
  { name: 'Ananya Roy',      role: 'Frontend Engineer', dept: 'Engineering', startDate: 'Sep 15', progress: 60, steps: [true, true, true, false, false] },
  { name: 'Kiran Pillai',    role: 'HR Specialist',     dept: 'HR',          startDate: 'Sep 18', progress: 30, steps: [true, true, false, false, false] },
  { name: 'Saurabh Tiwari',  role: 'Sales Executive',   dept: 'Sales',       startDate: 'Sep 22', progress: 10, steps: [true, false, false, false, false] },
];

const stepLabels = ['Offer Letter', 'IT Setup', 'HR Induction', 'Team Intro', 'First Task'];

export default function OnboardingPage() {
  return (
    <AdminLayout pageTitle="Onboarding" breadcrumbs={[{ label: 'Onboarding' }]}>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Onboardings', value: onboardees.length },
          { label: 'Completing This Week', value: 1 },
          { label: 'Avg. Completion', value: '33%' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Onboarding</p>
            <h2 className="mt-0.5 text-xl font-bold text-slate-900">New Hire Tracker</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <UserPlus className="h-4 w-4" />Add New Hire
          </button>
        </div>
        <div className="space-y-5">
          {onboardees.map(o => (
            <div key={o.name} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {o.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{o.name}</p>
                    <p className="text-xs text-slate-500">{o.role} · {o.dept} · Starts {o.startDate}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700">{o.progress}%</span>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${o.progress}%` }} />
              </div>
              <div className="flex gap-2 mt-3">
                {stepLabels.map((step, i) => (
                  <div key={step} className="flex flex-1 items-center gap-1">
                    {o.steps[i] ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> : <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
                    <span className={`text-[10px] truncate ${o.steps[i] ? 'text-emerald-700' : 'text-slate-400'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
