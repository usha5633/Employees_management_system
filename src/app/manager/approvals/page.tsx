'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ApprovalItem {
  id: string | number;
  name: string;
  avatar: string;
  color: string;
  type: string;
  desc: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/approvals');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handle = async (id: string | number, action: 'approved' | 'rejected') => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );

    try {
      await fetch('/api/v1/manager/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action }),
      });
    } catch (err) {
      console.error('Failed to update approval status:', err);
      fetchApprovals();
    }
  };

  const pending = approvals.filter((a) => a.status === 'pending');
  const resolved = approvals.filter((a) => a.status !== 'pending');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Approvals" subtitle="Review and action pending team requests.">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending.length, tone: 'amber' },
          { label: 'Approved', value: approvals.filter((a) => a.status === 'approved').length, tone: 'emerald' },
          { label: 'Rejected', value: approvals.filter((a) => a.status === 'rejected').length, tone: 'rose' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 shadow-sm ${s.tone === 'amber' ? 'border-amber-100 bg-amber-50' : s.tone === 'emerald' ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
            <p className={`text-xs font-semibold ${s.tone === 'amber' ? 'text-amber-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.tone === 'amber' ? 'text-amber-700' : s.tone === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Pending</p>
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${a.color}`}>{a.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                      <AlertCircle className={`h-3.5 w-3.5 ${a.urgency === 'high' ? 'text-rose-500' : a.urgency === 'medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-500">{a.type} · {a.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handle(a.id, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => handle(a.id, 'rejected')} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Resolved</p>
          <div className="space-y-3">
            {resolved.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 opacity-70">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${a.color}`}>{a.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{a.name}</p>
                    <p className="text-xs text-slate-400">{a.type} · {a.desc}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {a.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ManagerPageShell>
  );
}