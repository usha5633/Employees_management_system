'use client';
import HRPageShell from '@/components/hr/HRPageShell';
import { CheckCircle2, Circle, UserPlus, X, Plus } from 'lucide-react';
import { useState } from 'react';

const stepLabels = ['Offer Letter', 'IT Setup', 'HR Induction', 'Team Intro', 'First Task'];

interface Hire { id: number; name: string; role: string; dept: string; startDate: string; steps: boolean[]; }

const seed: Hire[] = [
  { id: 1, name: 'Ananya Roy',     role: 'Frontend Engineer', dept: 'Engineering', startDate: 'Sep 15', steps: [true, true, true, false, false] },
  { id: 2, name: 'Kiran Pillai',   role: 'HR Specialist',     dept: 'HR',          startDate: 'Sep 18', steps: [true, true, false, false, false] },
  { id: 3, name: 'Saurabh Tiwari', role: 'Sales Executive',   dept: 'Sales',       startDate: 'Sep 22', steps: [true, false, false, false, false] },
];

export default function OnboardingPage() {
  const [hires, setHires] = useState<Hire[]>(seed);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', dept: '', startDate: '' });
  const [saved, setSaved] = useState(false);

  const toggleStep = (hireId: number, stepIdx: number) => {
    setHires(prev => prev.map(h => h.id !== hireId ? h : { ...h, steps: h.steps.map((s, i) => i === stepIdx ? !s : s) }));
  };

  const addHire = () => {
    if (!form.name || !form.role) return;
    const initials = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    setHires(prev => [...prev, { id: Date.now(), name: form.name, role: form.role, dept: form.dept || 'General', startDate: form.startDate || 'TBD', steps: [false, false, false, false, false] }]);
    setSaved(true); setTimeout(() => { setSaved(false); setShowAdd(false); setForm({ name: '', role: '', dept: '', startDate: '' }); }, 1200);
  };

  return (
    <HRPageShell title="Onboarding" subtitle="Track new hire onboarding progress."
      actions={<button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" />Add New Hire</button>}>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">Add New Hire</h3>
              <button onClick={() => setShowAdd(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            {saved ? (
              <div className="flex flex-col items-center gap-3 py-10"><CheckCircle2 className="h-12 w-12 text-emerald-500" /><p className="font-bold text-slate-900">New Hire Added!</p></div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                {[['Full Name', 'name', 'Ananya Roy'], ['Job Role', 'role', 'Frontend Engineer'], ['Department', 'dept', 'Engineering'], ['Start Date', 'startDate', 'Sep 25']].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowAdd(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                  <button onClick={addHire} className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Add</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {hires.map(h => {
          const done = h.steps.filter(Boolean).length;
          const progress = Math.round((done / stepLabels.length) * 100);
          return (
            <div key={h.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {h.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{h.name}</p>
                    <p className="text-xs text-slate-500">{h.role} · {h.dept} · Starts {h.startDate}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${progress === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{progress}%</span>
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {stepLabels.map((step, i) => (
                  <button key={step} onClick={() => toggleStep(h.id, i)} className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all hover:bg-slate-50 ${h.steps[i] ? 'opacity-100' : 'opacity-50'}`}>
                    {h.steps[i] ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                    <span className={`text-[10px] text-center font-medium ${h.steps[i] ? 'text-emerald-700' : 'text-slate-400'}`}>{step}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </HRPageShell>
  );
}
