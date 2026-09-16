// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import { Users, Mail, Phone, TrendingUp, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface TeamMember {
//   id?: string;
//   name: string;
//   role: string;
//   dept: string;
//   status: 'Active' | 'Remote' | 'On Leave' | string;
//   avatar: string;
//   color: string;
//   tasks: number;
//   attendance: string;
//   perf: number;
//   email?: string;
//   phone?: string;
// }

// export default function MyTeamPage() {
//   const [team, setTeam] = useState<TeamMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchTeam = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/team');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setTeam(data.team || []);
//       }
//     } catch (err) {
//       console.error('Failed to load team directory:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeam();
//   }, []);

//   // Email Action Trigger Function
//   const handleEmailAction = (member: TeamMember) => {
//     const email = member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
//     window.location.href = `mailto:${email}?subject=Work Update Inquiry`;
//   };

//   // Phone/Call Action Trigger Function
//   const handleCallAction = (member: TeamMember) => {
//     const phone = member.phone || '+919876543210';
//     window.location.href = `tel:${phone}`;
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="My Team" subtitle="View and manage all your direct reports.">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {[
//           { label: 'Total Members', value: team.length.toString() },
//           { label: 'Active', value: team.filter((t) => t.status === 'Active').length.toString() },
//           { label: 'Remote', value: team.filter((t) => t.status === 'Remote').length.toString() },
//           { label: 'On Leave', value: team.filter((t) => t.status === 'On Leave').length.toString() },
//         ].map((s) => (
//           <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <p className="text-xs text-slate-500">{s.label}</p>
//             <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Team Directory Table */}
//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-100 px-5 py-4">
//           <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Directory</p>
//           <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Members</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-slate-100 text-sm">
//             <thead className="bg-slate-50">
//               <tr>
//                 {['Member', 'Department', 'Status', 'Open Tasks', 'Attendance', 'Performance', 'Actions'].map((h) => (
//                   <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {team.map((m) => (
//                 <tr key={m.id || m.name} className="hover:bg-slate-50/70">
//                   <td className="px-5 py-3.5">
//                     <div className="flex items-center gap-3">
//                       <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.color}`}>
//                         {m.avatar}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-slate-900">{m.name}</p>
//                         <p className="text-xs text-slate-500">{m.role}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-5 py-3.5 text-slate-600">{m.dept}</td>
//                   <td className="px-5 py-3.5">
//                     <span
//                       className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
//                         m.status === 'Active'
//                           ? 'bg-emerald-50 text-emerald-700'
//                           : m.status === 'Remote'
//                           ? 'bg-sky-50 text-sky-700'
//                           : 'bg-amber-50 text-amber-700'
//                       }`}
//                     >
//                       <span
//                         className={`h-1.5 w-1.5 rounded-full ${
//                           m.status === 'Active' ? 'bg-emerald-500' : m.status === 'Remote' ? 'bg-sky-500' : 'bg-amber-400'
//                         }`}
//                       />
//                       {m.status}
//                     </span>
//                   </td>
//                   <td className="px-5 py-3.5 font-semibold text-slate-700">{m.tasks}</td>
//                   <td className="px-5 py-3.5 text-slate-700">{m.attendance}</td>
//                   <td className="px-5 py-3.5">
//                     <div className="flex items-center gap-2">
//                       <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
//                         <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${m.perf}%` }} />
//                       </div>
//                       <span className="text-xs font-semibold text-slate-700">{m.perf}%</span>
//                     </div>
//                   </td>
//                   <td className="px-5 py-3.5">
//                     <div className="flex items-center gap-1.5">
//                       {/* Email Button */}
//                       <button
//                         title="Send Email"
//                         onClick={() => handleEmailAction(m)}
//                         className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
//                       >
//                         <Mail className="h-3.5 w-3.5" />
//                       </button>

//                       {/* Phone/Call Button */}
//                       <button
//                         title="Call Member"
//                         onClick={() => handleCallAction(m)}
//                         className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
//                       >
//                         <Phone className="h-3.5 w-3.5" />
//                       </button>

//                       {/* Performance Stats Button */}
//                       <button
//                         title="View Performance"
//                         onClick={() => alert(`Opening performance review for ${m.name}`)}
//                         className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-violet-600 transition-colors"
//                       >
//                         <TrendingUp className="h-3.5 w-3.5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </ManagerPageShell>
//   );
// }

'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { 
  Users, Mail, Phone, TrendingUp, Loader2, Plus, Search, 
  Filter, CheckCircle2, UserCheck, UserX, X, Eye, Shield, Building2
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  dept: string;
  status: 'Active' | 'Remote' | 'On Leave' | string;
  avatar: string;
  color?: string;
  tasks: number;
  attendance: string;
  perf: number;
  email?: string;
  phone?: string;
}

export default function MyTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [toast, setToast] = useState('');

  // Selected Member Modal State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberDept, setNewMemberDept] = useState('Engineering');

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

  // Submit Handler -> Add Member & Refresh DB
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/manager/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName.trim(),
          role: newMemberRole.trim() || 'Software Engineer',
          dept: newMemberDept,
          status: 'Active',
        }),
      });

      if (res.ok) {
        setToast('✓ Member Added to Team Directory');
        fetchTeam();
      } else {
        setToast('✗ Failed to add team member');
      }
    } catch (err) {
      console.error('API Error:', err);
      setToast('✗ Error connecting to server');
    } finally {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setNewMemberName('');
      setNewMemberRole('');
      setTimeout(() => setToast(''), 2500);
    }
  };

  // Triggers
  const handleEmailAction = (member: TeamMember) => {
    const email = member.email || `${member.name.toLowerCase().replace(/\s+/g, '.')}@company.com`;
    window.location.href = `mailto:${email}?subject=Work Update Inquiry`;
  };

  const handleCallAction = (member: TeamMember) => {
    const phone = member.phone || '+919876543210';
    window.location.href = `tel:${phone}`;
  };

  // Filter Computation
  const filteredTeam = useMemo(() => {
    return team.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dept.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' ? true : m.status === statusFilter;
      const matchesDept = deptFilter === 'all' ? true : m.dept === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [team, searchQuery, statusFilter, deptFilter]);

  const activeCount = team.filter((t) => t.status === 'Active').length;
  const remoteCount = team.filter((t) => t.status === 'Remote').length;
  const leaveCount = team.filter((t) => t.status === 'On Leave').length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="My Team Directory" subtitle="Direct report oversight, communication actions, and performance analytics.">
      {/* Toast Banner */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast}
        </div>
      )}

      {/* Hero Welcome Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0D1222] sm:text-3xl">Team Workforce Directory</h1>
          <p className="mt-1 text-xs text-slate-500">Real-time status tracking and individual direct report profiles.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> + Add Member
        </button>
      </div>

      {/* Metric Cards Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'TOTAL DIRECT REPORTS', value: team.length, sub: 'All registered team', icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600', filter: 'all' },
          { label: 'ACTIVE ON-SITE', value: activeCount, sub: 'In office status', icon: UserCheck, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', filter: 'Active' },
          { label: 'REMOTE WORKERS', value: remoteCount, sub: 'Working remotely', icon: Building2, bg: 'bg-sky-50', iconColor: 'text-sky-600', filter: 'Remote' },
          { label: 'ON LEAVE', value: leaveCount, sub: 'Away / Vacation', icon: UserX, bg: 'bg-amber-50', iconColor: 'text-amber-600', filter: 'On Leave' },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => setStatusFilter(s.filter)}
            className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${statusFilter === s.filter ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-slate-200/80'}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${s.bg} ${s.iconColor}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-black text-[#0D1222]">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls: Search & Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search team member by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="HR">HR</option>
            <option value="Product">Product</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Remote">Remote</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Team Directory Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">DATABASE MEMBERS</span>
            <h2 className="text-base font-bold text-[#0D1222]">Workforce Directory</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">{filteredTeam.length} Members listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {['Member', 'Department', 'Status', 'Open Tasks', 'Attendance', 'Performance', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTeam.length > 0 ? (
                filteredTeam.map((m) => (
                  <tr key={m.id || m.name} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-blue-600 shadow-sm">
                          {m.avatar || m.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D1222] text-xs">{m.name}</p>
                          <p className="text-[11px] text-slate-400">{m.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{m.dept}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                          m.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : m.status === 'Remote'
                            ? 'bg-sky-50 text-sky-600 border-sky-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            m.status === 'Active' ? 'bg-emerald-500' : m.status === 'Remote' ? 'bg-sky-500' : 'bg-amber-500'
                          }`}
                        />
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 text-xs">{m.tasks}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{m.attendance}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-blue-600" style={{ width: `${m.perf}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{m.perf}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="Send Email"
                          onClick={() => handleEmailAction(m)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </button>

                        <button
                          title="Call Member"
                          onClick={() => handleCallAction(m)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                        </button>

                        <button
                          title="View Profile Details"
                          onClick={() => setSelectedMember(m)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400">
                    No team members found matching your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Profile Drawer Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Team Member Performance Profile</h3>
              <button onClick={() => setSelectedMember(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                  {selectedMember.avatar || selectedMember.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0D1222]">{selectedMember.name}</h4>
                  <p className="text-xs text-slate-500">{selectedMember.role} · {selectedMember.dept}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Work Status</span>
                  <p className="font-bold text-[#0D1222] mt-0.5">{selectedMember.status}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Performance Score</span>
                  <p className="font-bold text-blue-600 mt-0.5">{selectedMember.perf}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance Rate</span>
                  <p className="font-bold text-emerald-600 mt-0.5">{selectedMember.attendance}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Open Deliverables</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedMember.tasks} Active Tasks</p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Add New Team Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineer"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="HR">HR</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerPageShell>
  );
}