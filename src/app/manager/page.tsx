// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import {
//   Users, UserCheck, UserX, ClipboardList, CalendarDays,
//   TrendingUp, Cake, CheckCircle2, XCircle, AlertCircle,
//   Clock, ArrowRight, Star, BarChart3, Target,
// } from 'lucide-react';
// import Link from 'next/link';
// import { useState } from 'react';

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const teamMembers = [
//   { id: 1, name: 'Aanya Sharma',  role: 'Product Designer',   avatar: 'AS', color: 'bg-violet-100 text-violet-700', status: 'present', perf: 92, birthday: 'Sep 20', dob: '20 Sep' },
//   { id: 2, name: 'Rohit Verma',   role: 'Frontend Engineer',  avatar: 'RV', color: 'bg-sky-100 text-sky-700',       status: 'remote',  perf: 88, birthday: 'Oct 3',  dob: '03 Oct' },
//   { id: 3, name: 'Sneha Pillai',  role: 'UX Researcher',      avatar: 'SP', color: 'bg-pink-100 text-pink-700',     status: 'present', perf: 94, birthday: 'Nov 12', dob: '12 Nov' },
//   { id: 4, name: 'Vikram Singh',  role: 'DevOps Engineer',    avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     status: 'leave',   perf: 85, birthday: 'Sep 28', dob: '28 Sep' },
//   { id: 5, name: 'Priya Joshi',   role: 'Talent Acquisition', avatar: 'PJ', color: 'bg-lime-100 text-lime-700',     status: 'absent',  perf: 80, birthday: 'Dec 5',  dob: '05 Dec' },
//   { id: 6, name: 'Sahil Rao',     role: 'Full Stack Dev',     avatar: 'SR', color: 'bg-blue-100 text-blue-700',     status: 'present', perf: 90, birthday: 'Oct 18', dob: '18 Oct' },
// ];

// const initialApprovals = [
//   { id: 1, name: 'Rohit Verma',  avatar: 'RV', color: 'bg-sky-100 text-sky-700',       type: 'Leave Request',  desc: '2 days — Sep 15–16', urgency: 'high',   status: 'pending' },
//   { id: 2, name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700',     type: 'WFH Request',    desc: 'Sep 13, Friday',     urgency: 'medium', status: 'pending' },
//   { id: 3, name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     type: 'Overtime Claim', desc: '4 hrs — Sep 10',     urgency: 'low',    status: 'pending' },
//   { id: 4, name: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', type: 'Task Reassign',  desc: 'Sprint 4 → Sprint 5',urgency: 'medium', status: 'pending' },
//   { id: 5, name: 'Priya Joshi',  avatar: 'PJ', color: 'bg-lime-100 text-lime-700',     type: 'Leave Request',  desc: 'Sep 20 — 1 day',     urgency: 'low',    status: 'approved'},
// ];

// const teamLeave = [
//   { name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     type: 'Casual Leave',  from: 'Sep 13', to: 'Sep 13', status: 'On Leave'  },
//   { name: 'Priya Joshi',  avatar: 'PJ', color: 'bg-lime-100 text-lime-700',     type: 'Sick Leave',    from: 'Sep 13', to: 'Sep 14', status: 'Approved'  },
//   { name: 'Rohit Verma',  avatar: 'RV', color: 'bg-sky-100 text-sky-700',       type: 'Casual Leave',  from: 'Sep 15', to: 'Sep 16', status: 'Pending'   },
//   { name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700',     type: 'WFH',           from: 'Sep 13', to: 'Sep 13', status: 'Pending'   },
// ];

// const perfCategories = ['Task Completion', 'On-time Delivery', 'Attendance', 'Quality Score'];
// const perfData = [92, 91, 96, 88]; // team averages %

// const upcomingBirthdays = teamMembers
//   .map(m => ({ ...m, daysLeft: Math.floor(Math.random() * 60) + 1 }))
//   .sort((a, b) => a.daysLeft - b.daysLeft)
//   .slice(0, 4);

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function ManagerDashboardPage() {
//   const [approvals, setApprovals] = useState(initialApprovals);
//   const [toast, setToast] = useState('');

//   const act = (id: number, action: 'approved' | 'rejected') => {
//     setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
//     setToast(action === 'approved' ? '✓ Approved successfully' : '✗ Request rejected');
//     setTimeout(() => setToast(''), 2500);
//   };

//   // FR-DASH-002: computed values
//   const teamSize      = teamMembers.length;
//   const presentCount  = teamMembers.filter(m => m.status === 'present' || m.status === 'remote').length;
//   const absentCount   = teamMembers.filter(m => m.status === 'absent').length;
//   const onLeaveCount  = teamMembers.filter(m => m.status === 'leave').length;
//   const pendingCount  = approvals.filter(a => a.status === 'pending').length;
//   const avgPerf       = Math.round(teamMembers.reduce((s, m) => s + m.perf, 0) / teamMembers.length);

//   return (
//     <ManagerPageShell
//       title="Dashboard"
//       subtitle="Your team overview for today — Sep 13, 2026."
//     >
//       {/* Toast */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
//           {toast}
//         </div>
//       )}

//       {/* ── FR-DASH-002: Team Size + Present + Absent + Pending Approvals ── */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {[
//           { label: 'Team Size',         value: teamSize,     sub: 'Direct reports',    icon: Users,         tone: 'blue',   href: '/manager/team' },
//           { label: 'Present Today',     value: presentCount, sub: `${onLeaveCount} on leave`,   icon: UserCheck,     tone: 'emerald',href: '/manager/team' },
//           { label: 'Absent Today',      value: absentCount,  sub: 'Not checked in',    icon: UserX,         tone: 'rose',   href: '/manager/team' },
//           { label: 'Pending Approvals', value: pendingCount, sub: 'Action required',   icon: ClipboardList, tone: 'amber',  href: '/manager/approvals' },
//         ].map(({ label, value, sub, icon: Icon, tone, href }) => (
//           <Link key={label} href={href} className={`group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}>
//             <div className="flex items-start justify-between">
//               <p className="text-xs text-slate-500">{label}</p>
//               <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
//                 tone === 'blue'   ? 'bg-blue-50   group-hover:bg-blue-100' :
//                 tone === 'emerald'? 'bg-emerald-50 group-hover:bg-emerald-100' :
//                 tone === 'rose'   ? 'bg-rose-50   group-hover:bg-rose-100' :
//                                     'bg-amber-50  group-hover:bg-amber-100'
//               }`}>
//                 <Icon className={`h-4 w-4 ${
//                   tone === 'blue'   ? 'text-blue-600'   :
//                   tone === 'emerald'? 'text-emerald-600' :
//                   tone === 'rose'   ? 'text-rose-600'   :
//                                       'text-amber-600'
//                 }`} />
//               </div>
//             </div>
//             <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
//             <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>
//           </Link>
//         ))}
//       </div>

//       {/* ── FR-DASH-002 Row 2: Team Attendance Status + Pending Approvals ── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

//         {/* Team Attendance Breakdown */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Today</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Attendance</h2>
//             </div>
//             <Link href="/manager/team" className="text-xs font-semibold text-violet-600 hover:underline">Full view →</Link>
//           </div>

//           {/* Visual stacked bar */}
//           <div className="mb-4 flex h-4 overflow-hidden rounded-full">
//             <div className="bg-emerald-500 transition-all" style={{ width: `${(presentCount / teamSize) * 100}%` }} title="Present" />
//             <div className="bg-amber-400 transition-all"   style={{ width: `${(onLeaveCount / teamSize) * 100}%` }} title="On Leave" />
//             <div className="bg-rose-500 transition-all"    style={{ width: `${(absentCount / teamSize) * 100}%` }} title="Absent" />
//           </div>
//           <div className="mb-4 flex gap-4 text-[11px]">
//             {[['Present/Remote','bg-emerald-500',presentCount],['On Leave','bg-amber-400',onLeaveCount],['Absent','bg-rose-500',absentCount]].map(([l,c,v])=>(
//               <span key={String(l)} className="flex items-center gap-1.5 font-semibold text-slate-600">
//                 <span className={`h-2.5 w-2.5 rounded-full ${c}`}/>{l} <b className="text-slate-900">({v})</b>
//               </span>
//             ))}
//           </div>

//           {/* Member list */}
//           <div className="space-y-2">
//             {teamMembers.map(m => (
//               <div key={m.id} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors">
//                 <div className="flex items-center gap-2.5">
//                   <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.color}`}>{m.avatar}</div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900 leading-none">{m.name}</p>
//                     <p className="text-[10px] text-slate-500">{m.role}</p>
//                   </div>
//                 </div>
//                 <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
//                   m.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
//                   m.status === 'remote'  ? 'bg-sky-50 text-sky-700' :
//                   m.status === 'leave'   ? 'bg-amber-50 text-amber-700' :
//                                            'bg-rose-50 text-rose-700'
//                 }`}>
//                   {m.status === 'present' ? '● Present' : m.status === 'remote' ? '◉ Remote' : m.status === 'leave' ? '◌ On Leave' : '○ Absent'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pending Approvals — interactive */}
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
//             {approvals.map(a => (
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

//       {/* ── FR-DASH-002 Row 3: Team Leave + Team Performance ─────────────── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

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
//                 <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
//                   l.status === 'On Leave' ? 'bg-blue-50 text-blue-700' :
//                   l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
//                                             'bg-amber-50 text-amber-700'
//                 }`}>{l.status}</span>
//               </div>
//             ))}
//           </div>
//           {/* Leave calendar snippet */}
//           <div className="mt-4 rounded-xl bg-slate-50 p-3">
//             <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Sep 13 – Sep 19</p>
//             <div className="flex gap-1.5">
//               {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
//                 <div key={d} className="flex flex-1 flex-col items-center gap-1">
//                   <span className="text-[9px] font-bold text-slate-400">{d}</span>
//                   <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold ${
//                     i === 0 ? 'bg-slate-200 text-slate-500' :
//                     i === 6 ? 'bg-slate-200 text-slate-500' :
//                     i === 1 ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400 ring-offset-1' :
//                                'bg-white border border-slate-200 text-slate-600'
//                   }`}>{13 + i}</div>
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

//           {/* Category bars */}
//           <div className="mb-5 space-y-3">
//             {perfCategories.map((cat, i) => (
//               <div key={cat}>
//                 <div className="mb-1 flex justify-between text-xs">
//                   <span className="font-semibold text-slate-700">{cat}</span>
//                   <span className="font-bold text-slate-900">{perfData[i]}%</span>
//                 </div>
//                 <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
//                   <div className={`h-2.5 rounded-full bg-gradient-to-r ${
//                     i === 0 ? 'from-violet-500 to-purple-500' :
//                     i === 1 ? 'from-blue-500 to-indigo-500' :
//                     i === 2 ? 'from-emerald-500 to-teal-500' :
//                                'from-amber-400 to-orange-500'
//                   } transition-all duration-700`} style={{ width: `${perfData[i]}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Per-member ratings */}
//           <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Individual Scores</p>
//           <div className="space-y-2">
//             {teamMembers.map(m => (
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

//       {/* ── FR-DASH-002: Upcoming Birthdays ─────────────────────────────── */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="mb-5 flex items-center justify-between">
//           <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Team Celebrations</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Upcoming Birthdays 🎂</h2>
//           </div>
//           <Cake className="h-5 w-5 text-pink-400" />
//         </div>

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//           {upcomingBirthdays.map((m, i) => (
//             <div key={m.id} className={`relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
//               i === 0 ? 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50' :
//               i === 1 ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50' :
//               i === 2 ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' :
//                         'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50'
//             }`}>
//               {i === 0 && (
//                 <span className="absolute right-3 top-3 text-lg">🎉</span>
//               )}
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
//                 <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
//                   i === 0 ? 'bg-pink-200 text-pink-800' :
//                   i === 1 ? 'bg-violet-200 text-violet-800' :
//                   i === 2 ? 'bg-blue-200 text-blue-800' :
//                             'bg-emerald-200 text-emerald-800'
//                 }`}>
//                   {m.daysLeft === 0 ? '🎂 Today!' : `${m.daysLeft}d away`}
//                 </span>
//               </div>
//               {i === 0 && (
//                 <button className="mt-3 w-full rounded-xl bg-pink-500 py-1.5 text-xs font-bold text-white hover:bg-pink-600 transition-colors">
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
import { redirect } from 'next/navigation';

export default function ManagerRootPage() {
  redirect('/manager/dashboard');
}