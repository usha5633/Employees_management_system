'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { Users, Mail, Phone, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  dept: string;
  status: 'Active' | 'Remote' | 'On Leave' | string;
  avatar: string;
  color: string;
  tasks: number;
  attendance: string;
  perf: number;
  email?: string;
  phone?: string;
}

export default function MyTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/team');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setTeam(data.team || []);
      }
    } catch (err) {
      console.error('Failed to load team directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Email Action Trigger Function
  const handleEmailAction = (member: TeamMember) => {
    const email = member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    window.location.href = `mailto:${email}?subject=Work Update Inquiry`;
  };

  // Phone/Call Action Trigger Function
  const handleCallAction = (member: TeamMember) => {
    const phone = member.phone || '+919876543210';
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="My Team" subtitle="View and manage all your direct reports.">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Members', value: team.length.toString() },
          { label: 'Active', value: team.filter((t) => t.status === 'Active').length.toString() },
          { label: 'Remote', value: team.filter((t) => t.status === 'Remote').length.toString() },
          { label: 'On Leave', value: team.filter((t) => t.status === 'On Leave').length.toString() },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Team Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Directory</p>
          <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Member', 'Department', 'Status', 'Open Tasks', 'Attendance', 'Performance', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {team.map((m) => (
                <tr key={m.id || m.name} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.color}`}>
                        {m.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{m.dept}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        m.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : m.status === 'Remote'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          m.status === 'Active' ? 'bg-emerald-500' : m.status === 'Remote' ? 'bg-sky-500' : 'bg-amber-400'
                        }`}
                      />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{m.tasks}</td>
                  <td className="px-5 py-3.5 text-slate-700">{m.attendance}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${m.perf}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{m.perf}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {/* Email Button */}
                      <button
                        title="Send Email"
                        onClick={() => handleEmailAction(m)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </button>

                      {/* Phone/Call Button */}
                      <button
                        title="Call Member"
                        onClick={() => handleCallAction(m)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </button>

                      {/* Performance Stats Button */}
                      <button
                        title="View Performance"
                        onClick={() => alert(`Opening performance review for ${m.name}`)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-colors"
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                      </button>
                    </div>
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