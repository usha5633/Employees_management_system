'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TeamMember {
  name: string;
  avatar: string;
  color: string;
  taskComp: number;
  attendance: number;
  onTime: number;
  rating: string;
}

const ratingColor: Record<string, string> = {
  Excellent: 'bg-emerald-50 text-emerald-700',
  Good: 'bg-blue-50 text-blue-700',
  Average: 'bg-amber-50 text-amber-700',
};

export default function ManagerPerformancePage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/performance');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to load performance metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Performance" subtitle="Track and review your team's performance metrics.">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Q3 2026</p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Performance Review</h2>
          </div>
          <TrendingUp className="h-5 w-5 text-violet-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Member', 'Task Completion', 'Attendance', 'On-time Delivery', 'Rating'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {members.map((m) => (
                <tr key={m.name} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${m.color}`}>
                        {m.avatar}
                      </div>
                      <span className="font-semibold text-slate-900">{m.name}</span>
                    </div>
                  </td>
                  {[m.taskComp, m.attendance, m.onTime].map((val, i) => (
                    <td key={i} className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${val}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{val}%</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ratingColor[m.rating] || 'bg-slate-100 text-slate-700'}`}>
                      {m.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerPageShell>
  );
}