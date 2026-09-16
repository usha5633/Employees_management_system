// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import {
//   Users, UserCheck, UserX, ClipboardList, CalendarDays,
//   TrendingUp, Cake, CheckCircle2, XCircle, AlertCircle,
//   Clock, ArrowRight, Star, BarChart3, Target, Loader2,
// } from 'lucide-react';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// const perfCategories = ['Task Completion', 'On-time Delivery', 'Attendance', 'Quality Score'];
// const perfData = [92, 91, 96, 88];

// export default function ManagerDashboardPage() {
//   const [loading, setLoading] = useState(true);
//   const [teamMembers, setTeamMembers] = useState<any[]>([]);
//   const [approvals, setApprovals] = useState<any[]>([]);
//   const [teamLeave, setTeamLeave] = useState<any[]>([]);
//   const [toast, setToast] = useState('');

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/dashboard');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setTeamMembers(data.teamMembers || []);
//         setApprovals(data.initialApprovals || []);
//         setTeamLeave(data.teamLeave || []);
//       }
//     } catch (err) {
//       console.error('Failed to load dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const act = async (id: string | number, action: 'approved' | 'rejected') => {
//     setApprovals((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, status: action } : a))
//     );
//     setToast(action === 'approved' ? '✓ Approved successfully' : '✗ Request rejected');
//     setTimeout(() => setToast(''), 2500);

//     try {
//       await fetch('/api/v1/manager/dashboard', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id, action }),
//       });
//     } catch (err) {
//       console.error('Failed to update approval:', err);
//       fetchDashboardData();
//     }
//   };

//   const teamSize = teamMembers.length;
//   const presentCount = teamMembers.filter((m) => m.status === 'present' || m.status === 'remote').length;
//   const absentCount = teamMembers.filter((m) => m.status === 'absent').length;
//   const onLeaveCount = teamMembers.filter((m) => m.status === 'leave').length;
//   const pendingCount = approvals.filter((a) => a.status === 'pending').length;
//   const avgPerf = teamSize > 0 ? Math.round(teamMembers.reduce((s, m) => s + m.perf, 0) / teamSize) : 0;

//   const upcomingBirthdays = teamMembers
//     .map((m) => ({ ...m, daysLeft: Math.floor(Math.random() * 60) + 1 }))
//     .sort((a, b) => a.daysLeft - b.daysLeft)
//     .slice(0, 4);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
//         <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="Dashboard" subtitle="Your team overview for today — Sep 13, 2026.">
//       {/* Toast Notification */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
//           {toast}
//         </div>
//       )}

//       {/* Row 1: Stat Cards */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {[
//           { label: 'Team Size', value: teamSize, sub: 'Direct reports', icon: Users, tone: 'blue', href: '/manager/team' },
//           { label: 'Present Today', value: presentCount, sub: `${onLeaveCount} on leave`, icon: UserCheck, tone: 'emerald', href: '/manager/team' },
//           { label: 'Absent Today', value: absentCount, sub: 'Not checked in', icon: UserX, tone: 'rose', href: '/manager/team' },
//           { label: 'Pending Approvals', value: pendingCount, sub: 'Action required', icon: ClipboardList, tone: 'amber', href: '/manager/approvals' },
//         ].map(({ label, value, sub, icon: Icon, tone, href }) => (
//           <Link key={label} href={href} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
//             <div className="flex items-start justify-between">
//               <p className="text-xs text-slate-500">{label}</p>
//               <div
//                 className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
//                   tone === 'blue'
//                     ? 'bg-blue-50 group-hover:bg-blue-100'
//                     : tone === 'emerald'
//                     ? 'bg-emerald-50 group-hover:bg-emerald-100'
//                     : tone === 'rose'
//                     ? 'bg-rose-50 group-hover:bg-rose-100'
//                     : 'bg-amber-50 group-hover:bg-amber-100'
//                 }`}
//               >
//                 <Icon
//                   className={`h-4 w-4 ${
//                     tone === 'blue'
//                       ? 'text-blue-600'
//                       : tone === 'emerald'
//                       ? 'text-emerald-600'
//                       : tone === 'rose'
//                       ? 'text-rose-600'
//                       : 'text-amber-600'
//                   }`}
//                 />
//               </div>
//             </div>
//             <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
//             <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>
//           </Link>
//         ))}
//       </div>

//       {/* Row 2: Team Attendance & Pending Approvals */}
//       <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
//         {/* Attendance Breakdown */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Today</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Attendance</h2>
//             </div>
//             <Link href="/manager/team" className="text-xs font-semibold text-violet-600 hover:underline">Full view →</Link>
//           </div>

//           <div className="mb-4 flex h-4 overflow-hidden rounded-full">
//             <div className="bg-emerald-500 transition-all" style={{ width: `${teamSize > 0 ? (presentCount / teamSize) * 100 : 0}%` }} title="Present" />
//             <div className="bg-amber-400 transition-all" style={{ width: `${teamSize > 0 ? (onLeaveCount / teamSize) * 100 : 0}%` }} title="On Leave" />
//             <div className="bg-rose-500 transition-all" style={{ width: `${teamSize > 0 ? (absentCount / teamSize) * 100 : 0}%` }} title="Absent" />
//           </div>

//           <div className="mb-4 flex gap-4 text-[11px]">
//             {[
//               ['Present/Remote', 'bg-emerald-500', presentCount],
//               ['On Leave', 'bg-amber-400', onLeaveCount],
//               ['Absent', 'bg-rose-500', absentCount],
//             ].map(([l, c, v]) => (
//               <span key={String(l)} className="flex items-center gap-1.5 font-semibold text-slate-600">
//                 <span className={`h-2.5 w-2.5 rounded-full ${c}`} />
//                 {l} <b className="text-slate-900">({v})</b>
//               </span>
//             ))}
//           </div>

//           <div className="space-y-2">
//             {teamMembers.map((m) => (
//               <div key={m.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors">
//                 <div className="flex items-center gap-2.5">
//                   <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.color}`}>{m.avatar}</div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900 leading-none">{m.name}</p>
//                     <p className="text-[10px] text-slate-500">{m.role}</p>
//                   </div>
//                 </div>
//                 <span
//                   className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
//                     m.status === 'present'
//                       ? 'bg-emerald-50 text-emerald-700'
//                       : m.status === 'remote'
//                       ? 'bg-sky-50 text-sky-700'
//                       : m.status === 'leave'
//                       ? 'bg-amber-50 text-amber-700'
//                       : 'bg-rose-50 text-rose-700'
//                   }`}
//                 >
//                   {m.status === 'present' ? '● Present' : m.status === 'remote' ? '◉ Remote' : m.status === 'leave' ? '◌ On Leave' : '○ Absent'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pending Approvals */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Action Required</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Pending Approvals</h2>
//             </div>
//             <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pendingCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
//               {pendingCount} pending
//             </span>
//           </div>

//           <div className="space-y-2.5">
//             {approvals.map((a) => (
//               <div key={a.id} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${a.status === 'pending' ? 'border-amber-100 bg-amber-50/30' : 'border-slate-100 opacity-60'}`}>
//                 <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${a.color}`}>{a.avatar}</div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-slate-900 truncate">{a.name}</p>
//                   <p className="text-[11px] text-slate-500">{a.type} · {a.desc}</p>
//                 </div>
//                 {a.status === 'pending' ? (
//                   <div className="flex shrink-0 gap-1.5">
//                     <button onClick={() => act(a.id, 'approved')} className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">
//                       <CheckCircle2 className="h-3.5 w-3.5" />OK
//                     </button>
//                     <button onClick={() => act(a.id, 'rejected')} className="flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors">
//                       <XCircle className="h-3.5 w-3.5" />No
//                     </button>
//                   </div>
//                 ) : (
//                   <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${a.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
//                     {a.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//           <Link href="/manager/approvals" className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-violet-600 hover:underline">
//             View all approvals <ArrowRight className="h-3 w-3" />
//           </Link>
//         </div>
//       </div>

//       {/* Row 3: Team Leave & Team Performance */}
//       <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
//         {/* Team Leave */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">This Week</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Leave</h2>
//             </div>
//             <Link href="/manager/approvals" className="text-xs font-semibold text-violet-600 hover:underline">Manage →</Link>
//           </div>
//           <div className="space-y-2.5">
//             {teamLeave.map((l, i) => (
//               <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors">
//                 <div className="flex items-center gap-3">
//                   <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${l.color}`}>{l.avatar}</div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900">{l.name}</p>
//                     <p className="text-[11px] text-slate-500">{l.type} · {l.from}{l.from !== l.to ? ` – ${l.to}` : ''}</p>
//                   </div>
//                 </div>
//                 <span
//                   className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                     l.status === 'On Leave'
//                       ? 'bg-blue-50 text-blue-700'
//                       : l.status === 'Approved'
//                       ? 'bg-emerald-50 text-emerald-700'
//                       : 'bg-amber-50 text-amber-700'
//                   }`}
//                 >
//                   {l.status}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 rounded-xl bg-slate-50 p-3">
//             <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sep 13 – Sep 19</p>
//             <div className="flex gap-1.5">
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
//                 <div key={d} className="flex flex-1 flex-col items-center gap-1">
//                   <span className="text-[9px] font-bold text-slate-400">{d}</span>
//                   <div
//                     className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold ${
//                       i === 0
//                         ? 'bg-slate-200 text-slate-500'
//                         : i === 6
//                         ? 'bg-slate-200 text-slate-500'
//                         : i === 1
//                         ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400 ring-offset-1'
//                         : 'bg-white border border-slate-200 text-slate-600'
//                     }`}
//                   >
//                     {13 + i}
//                   </div>
//                   {(i === 2 || i === 3) && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Leave" />}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Team Performance */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Q3 2026</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Performance</h2>
//             </div>
//             <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1">
//               <Star className="h-3.5 w-3.5 text-violet-600" />
//               <span className="text-xs font-bold text-violet-700">{avgPerf}% avg</span>
//             </div>
//           </div>

//           <div className="mb-5 space-y-3">
//             {perfCategories.map((cat, i) => (
//               <div key={cat}>
//                 <div className="mb-1 flex justify-between text-xs">
//                   <span className="font-semibold text-slate-700">{cat}</span>
//                   <span className="font-bold text-slate-900">{perfData[i]}%</span>
//                 </div>
//                 <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
//                   <div
//                     className={`h-2.5 rounded-full bg-gradient-to-r ${
//                       i === 0
//                         ? 'from-violet-500 to-purple-500'
//                         : i === 1
//                         ? 'from-blue-500 to-indigo-500'
//                         : i === 2
//                         ? 'from-emerald-500 to-teal-500'
//                         : 'from-amber-400 to-orange-500'
//                     } transition-all duration-700`}
//                     style={{ width: `${perfData[i]}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Individual Scores</p>
//           <div className="space-y-2">
//             {teamMembers.map((m) => (
//               <div key={m.id} className="flex items-center gap-3">
//                 <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${m.color}`}>{m.avatar}</div>
//                 <div className="flex-1">
//                   <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                     <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700" style={{ width: `${m.perf}%` }} />
//                   </div>
//                 </div>
//                 <span className="w-10 text-right text-xs font-bold text-slate-700">{m.perf}%</span>
//               </div>
//             ))}
//           </div>

//           <Link href="/manager/performance" className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-violet-600 hover:underline">
//             Full performance report <ArrowRight className="h-3 w-3" />
//           </Link>
//         </div>
//       </div>

//       {/* Row 4: Upcoming Birthdays */}
//       <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="mb-5 flex items-center justify-between">
//           <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Team Celebrations</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Upcoming Birthdays 🎂</h2>
//           </div>
//           <Cake className="h-5 w-5 text-pink-400" />
//         </div>

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//           {upcomingBirthdays.map((m, i) => (
//             <div
//               key={m.id}
//               className={`relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
//                 i === 0
//                   ? 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50'
//                   : i === 1
//                   ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50'
//                   : i === 2
//                   ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
//                   : 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
//               }`}
//             >
//               {i === 0 && <span className="absolute right-3 top-3 text-lg">🎉</span>}
//               <div className="mb-3 flex items-center gap-3">
//                 <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-extrabold ${m.color}`}>
//                   {m.avatar}
//                 </div>
//                 <div>
//                   <p className="font-bold text-slate-900">{m.name}</p>
//                   <p className="text-xs text-slate-500">{m.role}</p>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Birthday</p>
//                   <p className="text-sm font-bold text-slate-800">{m.dob}</p>
//                 </div>
//                 <span
//                   className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
//                     i === 0
//                       ? 'bg-pink-200 text-pink-800'
//                       : i === 1
//                       ? 'bg-violet-200 text-violet-800'
//                       : i === 2
//                       ? 'bg-blue-200 text-blue-800'
//                       : 'bg-emerald-200 text-emerald-800'
//                   }`}
//                 >
//                   {m.daysLeft === 0 ? '🎂 Today!' : `${m.daysLeft}d away`}
//                 </span>
//               </div>
//               {i === 0 && (
//                 <button
//                   onClick={() => alert(`Wishes sent to ${m.name}! 🎉`)}
//                   className="mt-3 w-full rounded-xl bg-pink-500 py-1.5 text-xs font-bold text-white transition-colors hover:bg-pink-600"
//                 >
//                   🎁 Send Wishes
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </ManagerPageShell>
//   );
// }


'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import {
  Users, UserCheck, CalendarDays, ClipboardList, 
  Plus, X, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const perfCategories = ['Task Completion', 'On-time Delivery', 'Attendance', 'Quality Score'];
const perfData = [92, 91, 96, 88];

export default function ManagerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State for Adding Team
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberDept, setNewMemberDept] = useState('Engineering');

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/dashboard');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setTeamMembers(data.teamMembers || []);
        setApprovals(data.initialApprovals || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const act = async (id: string | number, action: 'approved' | 'rejected') => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
    setToast(action === 'approved' ? '✓ Request approved successfully' : '✗ Request rejected');
    setTimeout(() => setToast(''), 2500);

    try {
      await fetch('/api/v1/manager/dashboard', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
    } catch (err) {
      console.error('Failed to update approval:', err);
      fetchDashboardData();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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
          status: 'present',
          perf: 88,
        }),
      });

      if (res.ok) {
        setToast('✓ Team Member Added Successfully');
        fetchDashboardData();
      } else {
        setTeamMembers((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: newMemberName.trim(),
            role: newMemberRole.trim() || 'Software Engineer',
            dept: newMemberDept,
            avatar: newMemberName.substring(0, 2).toUpperCase(),
            status: 'present',
            perf: 88,
          },
        ]);
        setToast('✓ Team Member Added');
      }
    } catch (err) {
      console.error('Failed to add team member:', err);
      setToast('✗ Error adding team member');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setNewMemberName('');
      setNewMemberRole('');
      setTimeout(() => setToast(''), 2500);
    }
  };

  const teamSize = teamMembers.length;
  const presentCount = teamMembers.filter((m) => m.status === 'present' || m.status === 'remote').length;
  const absentCount = teamMembers.filter((m) => m.status === 'absent').length;
  const onLeaveCount = teamMembers.filter((m) => m.status === 'leave').length;
  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const avgPerf = teamSize > 0 ? Math.round(teamMembers.reduce((s, m) => s + (m.perf || 85), 0) / teamSize) : 0;
  const turnoutRate = teamSize > 0 ? ((presentCount / teamSize) * 100).toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Dashboard" subtitle="Manage team operations, leave requests, and performance metrics.">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast}
        </div>
      )}

      {/* Hero Welcome Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0D1222] sm:text-3xl">
            Welcome back, Team Lead! 👋
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Manage workforce operations, organization structure, attendance records, and system analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Team
          </button>
        </div>
      </div>

      {/* Add Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Add Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="HR">HR</option>
                  <option value="Product">Product</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'TOTAL EMPLOYEES', value: teamSize, sub: 'Direct reports', icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600', href: '/manager/team' },
          { label: 'ACTIVE EMPLOYEES', value: presentCount, sub: `${onLeaveCount} on leave`, icon: UserCheck, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', href: '/manager/team' },
          { label: 'ON LEAVE', value: onLeaveCount, sub: 'Approved leaves', icon: CalendarDays, bg: 'bg-amber-50', iconColor: 'text-amber-600', href: '/manager/approvals' },
          { label: 'PENDING APPROVALS', value: pendingCount, sub: 'Action required', icon: ClipboardList, bg: 'bg-blue-50', iconColor: 'text-blue-600', href: '/manager/approvals' },
        ].map(({ label, value, sub, icon: Icon, bg, iconColor, href }) => (
          <Link key={label} href={href} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg} ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-black text-[#0D1222]">{value}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                ↗ 0%
              </span>
              <span className="text-[11px] text-slate-400">vs last month</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Row 2: Attendance & Pending Approvals */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0D1222]">Today's Attendance</h2>
              <p className="text-xs text-slate-400">Live breakdown of workforce status</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
              ● {turnoutRate}% Turnout
            </span>
          </div>

          <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="bg-emerald-500 transition-all" style={{ width: `${teamSize > 0 ? (presentCount / teamSize) * 100 : 0}%` }} title="Present" />
            <div className="bg-amber-400 transition-all" style={{ width: `${teamSize > 0 ? (onLeaveCount / teamSize) * 100 : 0}%` }} title="On Leave" />
            <div className="bg-rose-500 transition-all" style={{ width: `${teamSize > 0 ? (absentCount / teamSize) * 100 : 0}%` }} title="Absent" />
          </div>

          <div className="space-y-2.5">
            {teamMembers.length > 0 ? (
              teamMembers.map((m) => (
                <div key={m.id || m.name} className="flex items-center justify-between rounded-xl p-2.5 border border-slate-100 bg-[#F9FAFB] transition-colors hover:bg-slate-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-blue-600">
                      {m.avatar || m.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0D1222] leading-none">{m.name}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{m.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                    {m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1) : 'Present'}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <UserCheck className="h-6 w-6" />
                </div>
                <p className="mt-3 text-xs font-bold text-slate-700">No attendance data yet</p>
                <p className="text-[11px] text-slate-400">Add employees to begin logging attendance.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0D1222]">Pending Approvals</h2>
              <p className="text-xs text-slate-400">Requests needing managerial action</p>
            </div>
            <Link href="/manager/approvals" className="text-xs font-bold text-blue-600 hover:underline">View all →</Link>
          </div>

          <div className="space-y-3">
            {approvals.length > 0 ? (
              approvals.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#F9FAFB] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-[#0D1222]">
                    {a.avatar || a.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0D1222] truncate">{a.name}</p>
                    <p className="text-[11px] text-slate-400">{a.type} · {a.desc}</p>
                  </div>
                  {a.status === 'pending' ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => act(a.id, 'approved')} className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                        Approve
                      </button>
                      <button onClick={() => act(a.id, 'rejected')} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {a.status}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-xs font-semibold text-slate-400">
                No pending requests.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Performance */}
      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0D1222]">Team Performance</h2>
            <p className="text-xs text-slate-400">Q3 2026 completion trajectories</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-100">
            {avgPerf}% average
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {perfCategories.map((cat, i) => (
            <div key={cat} className="rounded-xl border border-slate-100 bg-[#F9FAFB] p-4">
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-slate-700">{cat}</span>
                <span className="text-blue-600">{perfData[i]}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${perfData[i]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ManagerPageShell>
  );
}