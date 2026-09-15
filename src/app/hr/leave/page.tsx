'use client';

import HRPageShell from '@/components/hr/HRPageShell';
import { CheckCircle2, XCircle, AlertCircle, Search, Filter, X } from 'lucide-react';
import { useState, useMemo } from 'react';

type LeaveStatus = 'pending' | 'approved' | 'rejected';
interface LeaveReq { id: number; name: string; avatar: string; color: string; type: string; from: string; to: string; days: number; reason: string; status: LeaveStatus; }

const seed: LeaveReq[] = [
  { id: 1, name: 'Rohit Verma',   avatar: 'RV', color: 'bg-sky-100 text-sky-700',       type: 'Casual Leave', from: 'Sep 15', to: 'Sep 16', days: 2, reason: 'Family function',    status: 'pending'  },
  { id: 2, name: 'Sneha Pillai',  avatar: 'SP', color: 'bg-pink-100 text-pink-700',     type: 'Sick Leave',   from: 'Sep 13', to: 'Sep 13', days: 1, reason: 'Not feeling well',   status: 'pending'  },
  { id: 3, name: 'Aanya Sharma',  avatar: 'AS', color: 'bg-violet-100 text-violet-700', type: 'Paid Leave',   from: 'Sep 20', to: 'Sep 22', days: 3, reason: 'Travel',             status: 'pending'  },
  { id: 4, name: 'Danish Khan',   avatar: 'DK', color: 'bg-amber-100 text-amber-700',   type: 'Casual Leave', from: 'Sep 10', to: 'Sep 10', days: 1, reason: 'Personal work',     status: 'approved' },
  { id: 5, name: 'Vikram Singh',  avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     type: 'Sick Leave',   from: 'Sep 5',  to: 'Sep 6',  days: 2, reason: 'Fever',             status: 'rejected' },
  { id: 6, name: 'Pooja Iyer',    avatar: 'PI', color: 'bg-rose-100 text-rose-700',     type: 'Paid Leave',   from: 'Oct 1',  to: 'Oct 3',  days: 3, reason: 'Holiday trip',      status: 'pending'  },
];

const statusBadge: Record<LeaveStatus, string> = {
  pending:  'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
};

export default function HRLeavePage() {
  const [leaves, setLeaves] = useState<LeaveReq[]>(seed);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | LeaveStatus>('all');
  const [toast, setToast] = useState('');

  const act = (id: number, action: LeaveStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    setToast(action === 'approved' ? 'Leave approved ✓' : 'Leave rejected ✗');
    setTimeout(() => setToast(''), 2500);
  };

  const filtered = useMemo(() => leaves.filter(l => {
    const q = search.toLowerCase();
    const matchQ = l.name.toLowerCase().includes(q) || l.type.toLowerCase().includes(q);
    const matchF = filter === 'all' || l.status === filter;
    return matchQ && matchF;
  }), [leaves, search, filter]);

  const counts = { all: leaves.length, pending: leaves.filter(l => l.status === 'pending').length, approved: leaves.filter(l => l.status === 'approved').length, rejected: leaves.filter(l => l.status === 'rejected').length };

  return (
    <HRPageShell title="Leave Management" subtitle="Review and approve employee leave requests.">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.includes('approved') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.includes('approved') ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}{toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-2xl border p-4 shadow-sm text-left transition-all ${filter === s ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
            <p className="text-xs text-slate-500 capitalize">{s === 'all' ? 'Total Requests' : `${s.charAt(0).toUpperCase() + s.slice(1)}`}</p>
            <p className={`mt-2 text-3xl font-bold ${s === 'pending' ? 'text-amber-600' : s === 'approved' ? 'text-emerald-600' : s === 'rejected' ? 'text-rose-600' : 'text-slate-900'}`}>{counts[s]}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Leave Requests <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{filtered.length}</span></h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee…" className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length === 0 && <p className="py-12 text-center text-sm text-slate-400">No requests found.</p>}
          {filtered.map(l => (
            <div key={l.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center hover:bg-slate-50/50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${l.color}`}>{l.avatar}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{l.name}</p>
                  <p className="text-xs text-slate-500">{l.type} · {l.from} – {l.to} ({l.days}d) · "{l.reason}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[l.status]}`}>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
                {l.status === 'pending' && (
                  <>
                    <button onClick={() => act(l.id, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">
                      <CheckCircle2 className="h-3.5 w-3.5" />Approve
                    </button>
                    <button onClick={() => act(l.id, 'rejected')} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors">
                      <XCircle className="h-3.5 w-3.5" />Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRPageShell>
  );
}
