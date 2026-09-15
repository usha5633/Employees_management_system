'use client';

import HRPageShell from '@/components/hr/HRPageShell';
import { Plus, X, ChevronRight, CheckCircle2, User, Mail, Phone, Briefcase } from 'lucide-react';
import { useState } from 'react';

type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired';
interface Candidate { id: number; name: string; role: string; email: string; phone: string; stage: Stage; applied: string; avatar: string; color: string; }

const stages: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
const stageColor: Record<Stage, string> = {
  Applied:   'bg-slate-100 text-slate-700',
  Screening: 'bg-blue-50 text-blue-700',
  Interview: 'bg-violet-50 text-violet-700',
  Offer:     'bg-amber-50 text-amber-700',
  Hired:     'bg-emerald-50 text-emerald-700',
};

const seed: Candidate[] = [
  { id: 1, name: 'Ananya Roy',     role: 'Frontend Engineer', email: 'ananya@gmail.com',  phone: '+91 99000 11111', stage: 'Interview', applied: 'Sep 5',  avatar: 'AR', color: 'bg-violet-100 text-violet-700' },
  { id: 2, name: 'Kiran Pillai',   role: 'HR Specialist',     email: 'kiran@gmail.com',   phone: '+91 99000 22222', stage: 'Offer',     applied: 'Sep 3',  avatar: 'KP', color: 'bg-pink-100 text-pink-700' },
  { id: 3, name: 'Saurabh Tiwari', role: 'Sales Executive',   email: 'saurabh@gmail.com', phone: '+91 99000 33333', stage: 'Screening', applied: 'Sep 8',  avatar: 'ST', color: 'bg-sky-100 text-sky-700' },
  { id: 4, name: 'Divya Menon',    role: 'UI Designer',       email: 'divya@gmail.com',   phone: '+91 99000 44444', stage: 'Applied',   applied: 'Sep 10', avatar: 'DM', color: 'bg-emerald-100 text-emerald-700' },
  { id: 5, name: 'Rohan Kapoor',   role: 'DevOps Engineer',   email: 'rohan@gmail.com',   phone: '+91 99000 55555', stage: 'Hired',     applied: 'Aug 28', avatar: 'RK', color: 'bg-teal-100 text-teal-700' },
];

function CandidateModal({ c, onClose, onStage }: { c: Candidate; onClose: () => void; onStage: (id: number, s: Stage) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Candidate Details</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${c.color}`}>{c.avatar}</div>
            <div>
              <p className="text-xl font-bold text-slate-900">{c.name}</p>
              <p className="text-sm text-slate-500">{c.role}</p>
              <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${stageColor[c.stage]}`}>{c.stage}</span>
            </div>
          </div>
          <div className="mb-5 space-y-2.5">
            {[[Mail, c.email], [Phone, c.phone], [Briefcase, c.role]].map(([Icon, val], i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="text-slate-400">{/* @ts-ignore */}<Icon className="h-4 w-4" /></span>
                <span className="text-sm text-slate-800">{String(val)}</span>
              </div>
            ))}
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Move to Stage</p>
          <div className="flex flex-wrap gap-2">
            {stages.map(s => (
              <button key={s} onClick={() => { onStage(c.id, s); onClose(); }} className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${c.stage === s ? stageColor[s] + ' ring-2 ring-offset-1 ring-emerald-500' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HRRecruitmentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(seed);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', email: '', phone: '' });
  const [saved, setSaved] = useState(false);

  const moveStage = (id: number, stage: Stage) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage } : c));

  const addCandidate = () => {
    if (!form.name || !form.role) return;
    const init = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    setCandidates(prev => [{ id: Date.now(), name: form.name, role: form.role, email: form.email, phone: form.phone, stage: 'Applied', applied: 'Today', avatar: init, color: 'bg-blue-100 text-blue-700' }, ...prev]);
    setSaved(true); setTimeout(() => { setSaved(false); setShowAdd(false); setForm({ name: '', role: '', email: '', phone: '' }); }, 1200);
  };

  return (
    <HRPageShell title="Recruitment" subtitle="Manage candidates across the hiring pipeline."
      actions={<button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" />Add Candidate</button>}>
      {selected && <CandidateModal c={selected} onClose={() => setSelected(null)} onStage={moveStage} />}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">Add Candidate</h3>
              <button onClick={() => setShowAdd(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            {saved ? (
              <div className="flex flex-col items-center gap-3 py-10"><CheckCircle2 className="h-12 w-12 text-emerald-500" /><p className="font-bold text-slate-900">Candidate Added!</p></div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                {[['Full Name', 'name', 'Ananya Roy'], ['Role Applied', 'role', 'Frontend Engineer'], ['Email', 'email', 'ananya@gmail.com'], ['Phone', 'phone', '+91 98765 00000']].map(([label, key, ph]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowAdd(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                  <button onClick={addCandidate} className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Add</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {stages.map(stage => {
          const stageCands = candidates.filter(c => c.stage === stage);
          return (
            <div key={stage} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stageColor[stage]}`}>{stage}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{stageCands.length}</span>
              </div>
              <div className="space-y-2">
                {stageCands.length === 0 && <p className="py-4 text-center text-xs text-slate-400">No candidates</p>}
                {stageCands.map(c => (
                  <button key={c.id} onClick={() => setSelected(c)} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-left hover:border-slate-200 hover:bg-white transition-all">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${c.color}`}>{c.avatar}</div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-900">{c.name}</p>
                        <p className="truncate text-[10px] text-slate-500">{c.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table view */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">All Candidates <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{candidates.length}</span></h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50"><tr>{['Candidate', 'Role', 'Applied', 'Stage', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {candidates.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${c.color}`}>{c.avatar}</div><p className="font-semibold text-slate-900">{c.name}</p></div></td>
                  <td className="px-5 py-3.5 text-slate-600">{c.role}</td>
                  <td className="px-5 py-3.5 text-slate-600">{c.applied}</td>
                  <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stageColor[c.stage]}`}>{c.stage}</span></td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelected(c)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <ChevronRight className="h-3.5 w-3.5" />Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRPageShell>
  );
}
