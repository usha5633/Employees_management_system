'use client';
import HRPageShell from '@/components/hr/HRPageShell';
import { Plus, X, Megaphone, CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Ann { id: number; title: string; body: string; category: string; priority: string; date: string; audience: string; }

const seed: Ann[] = [
  { id: 1, title: 'Q3 All-Hands Meeting',      body: 'All employees must join the Q3 all-hands on Friday Sep 12 at 4 PM IST.', category: 'Meeting',   priority: 'High',   date: 'Sep 12, 2026', audience: 'All' },
  { id: 2, title: 'New Work-From-Home Policy',  body: 'Effective Oct 1, employees can WFH up to 2 days per week.',              category: 'HR Policy', priority: 'High',   date: 'Sep 10, 2026', audience: 'All' },
  { id: 3, title: 'Company Holiday — Oct 2',    body: 'Office closed on October 2, 2026 for Gandhi Jayanti.',                  category: 'Holiday',   priority: 'Medium', date: 'Sep 8, 2026',  audience: 'All' },
  { id: 4, title: 'Salary Revision — Q4',       body: 'Annual performance-based salary revision will be effective from Oct 1.', category: 'Finance',  priority: 'High',   date: 'Sep 5, 2026',  audience: 'All' },
];

const priorityBadge: Record<string, string> = { High: 'bg-rose-50 text-rose-700', Medium: 'bg-amber-50 text-amber-700', Low: 'bg-slate-100 text-slate-600' };
const categoryBadge: Record<string, string> = { Meeting: 'bg-blue-50 text-blue-700', 'HR Policy': 'bg-violet-50 text-violet-700', Holiday: 'bg-emerald-50 text-emerald-700', Finance: 'bg-amber-50 text-amber-700' };

export default function HRAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Ann[]>(seed);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'General', priority: 'Medium', audience: 'All' });

  const post = () => {
    if (!form.title || !form.body) return;
    setAnnouncements(prev => [{ id: Date.now(), title: form.title, body: form.body, category: form.category, priority: form.priority, date: 'Today', audience: form.audience }, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setForm({ title: '', body: '', category: 'General', priority: 'Medium', audience: 'All' }); }, 1200);
  };

  const del = (id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  return (
    <HRPageShell title="Announcements" subtitle="Post and manage company-wide announcements."
      actions={<button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" />New Announcement</button>}>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">Post Announcement</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            {saved ? (
              <div className="flex flex-col items-center gap-3 py-10"><CheckCircle2 className="h-12 w-12 text-emerald-500" /><p className="font-bold text-slate-900">Announcement Posted!</p></div>
            ) : (
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title…" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                  <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={3} placeholder="Write your announcement…" className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[['Category', 'category', ['General', 'Meeting', 'HR Policy', 'Holiday', 'Finance', 'IT']], ['Priority', 'priority', ['High', 'Medium', 'Low']], ['Audience', 'audience', ['All', 'Engineering', 'HR', 'Sales', 'Finance']]].map(([label, key, opts]) => (
                    <div key={String(key)}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                      <select value={(form as any)[String(key)]} onChange={e => setForm(f => ({ ...f, [String(key)]: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                        {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                  <button onClick={post} className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Post Announcement</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><Megaphone className="h-5 w-5 text-emerald-600" /></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{a.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryBadge[a.category] ?? 'bg-slate-100 text-slate-600'}`}>{a.category}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityBadge[a.priority]}`}>{a.priority}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">Audience: {a.audience}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{a.date}</p>
                </div>
              </div>
              <button onClick={() => del(a.id)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </HRPageShell>
  );
}
