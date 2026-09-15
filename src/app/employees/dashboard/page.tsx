// 'use client';

// import EmployeePageShell from '@/components/employee/EmployeePageShell';
// import {
//   LogIn, LogOut, Clock, CalendarDays, CheckCircle2,
//   Circle, Timer, Megaphone, Gift, CreditCard,
//   ArrowRight, AlertCircle, TrendingUp, ChevronRight,
//   Sun, Moon, Coffee,
// } from 'lucide-react';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// // ─── Static Data ──────────────────────────────────────────────────────────────

// const leaveBalance = [
//   { label: 'Casual',  used: 2,  total: 8,  color: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-700' },
//   { label: 'Sick',    used: 1,  total: 5,  color: 'bg-emerald-500',light: 'bg-emerald-50',text: 'text-emerald-700' },
//   { label: 'Paid',    used: 3,  total: 12, color: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700' },
//   { label: 'Unpaid',  used: 0,  total: 2,  color: 'bg-rose-400',   light: 'bg-rose-50',   text: 'text-rose-700' },
// ];

// const leaveRequests = [
//   { type: 'Casual Leave', from: 'Sep 14', to: 'Sep 15', days: 2, status: 'Pending',  tone: 'amber'   },
//   { type: 'Sick Leave',   from: 'Sep 5',  to: 'Sep 5',  days: 1, status: 'Approved', tone: 'emerald' },
//   { type: 'WFH Request',  from: 'Sep 3',  to: 'Sep 3',  days: 1, status: 'Rejected', tone: 'rose'    },
// ];

// // Sep 2026 attendance — 0=absent, 1=present, 2=late, 3=leave, 4=holiday, 5=weekend
// const attendanceMap: Record<number, number> = {
//   1:4, 2:4, 3:1, 4:1, 5:1, 6:1, 7:1,
//   8:4, 9:4, 10:1, 11:1, 12:1, 13:3, 14:2,
//   15:0, 16:1, 17:1, 18:1, 19:1, 20:1,
//   21:4, 22:4, 23:1, 24:1, 25:1, 26:1, 27:1,
//   28:4, 29:4, 30:1,
// };
// const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
// // Sep 1 2026 is a Tuesday → offset 1
// const SEP_OFFSET = 1;

// const dayConfig: Record<number, { bg: string; text: string; title: string }> = {
//   0: { bg: 'bg-rose-100',    text: 'text-rose-600',    title: 'Absent' },
//   1: { bg: 'bg-emerald-100', text: 'text-emerald-700', title: 'Present' },
//   2: { bg: 'bg-amber-100',   text: 'text-amber-700',   title: 'Late' },
//   3: { bg: 'bg-blue-100',    text: 'text-blue-700',    title: 'Leave' },
//   4: { bg: 'bg-slate-100',   text: 'text-slate-400',   title: 'Holiday / Weekend' },
//   5: { bg: 'bg-slate-100',   text: 'text-slate-400',   title: 'Weekend' },
// };

// const payslip = {
//   month:      'August 2026',
//   gross:      '₹85,000',
//   deductions: '₹12,400',
//   net:        '₹72,600',
//   status:     'Paid',
//   date:       '31 Aug 2026',
// };

// const announcements = [
//   { title: 'Q3 All-Hands Meeting',     category: 'Meeting',   date: 'Fri 4:00 PM',     priority: 'High',   read: false },
//   { title: 'New WFH Policy Update',    category: 'HR Policy', date: 'Oct 1, 2026',     priority: 'High',   read: false },
//   { title: 'Performance Reviews Open', category: 'HR',        date: 'Sep 20–30, 2026', priority: 'Medium', read: true  },
// ];

// const holidays = [
//   { name: 'Gandhi Jayanti',   date: 'Oct 2, 2026',   day: 'Friday',   daysLeft: 19, color: 'bg-orange-50 border-orange-200 text-orange-800' },
//   { name: 'Dussehra',         date: 'Oct 12, 2026',  day: 'Monday',   daysLeft: 29, color: 'bg-blue-50   border-blue-200   text-blue-800' },
//   { name: 'Diwali',           date: 'Oct 20, 2026',  day: 'Tuesday',  daysLeft: 37, color: 'bg-amber-50  border-amber-200  text-amber-800' },
//   { name: 'Christmas',        date: 'Dec 25, 2026',  day: 'Friday',   daysLeft: 103,color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
// ];

// const statusBadge: Record<string, string> = {
//   Pending:  'bg-amber-50  text-amber-700',
//   Approved: 'bg-emerald-50 text-emerald-700',
//   Rejected: 'bg-rose-50   text-rose-700',
// };

// // ─── Greeting helper ─────────────────────────────────────────────────────────
// function getGreeting(hour: number) {
//   if (hour < 12) return { text: 'Good morning',   icon: <Sun  className="h-5 w-5 text-amber-400" /> };
//   if (hour < 17) return { text: 'Good afternoon', icon: <Coffee className="h-5 w-5 text-orange-400" /> };
//   return           { text: 'Good evening',         icon: <Moon className="h-5 w-5 text-indigo-400" /> };
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function EmployeeDashboardPage() {
//   const [checkedIn,  setCheckedIn]  = useState(true);
//   const [checkInTime]               = useState('09:28 AM');
//   const [elapsed,    setElapsed]    = useState('06h 45m');
//   const [hour,       setHour]       = useState(9);

//   // Live clock tick (demo)
//   useEffect(() => {
//     const now = new Date();
//     setHour(now.getHours());
//     const id = setInterval(() => setElapsed(prev => {
//       const [h, m] = prev.replace('h ', ':').replace('m', '').split(':').map(Number);
//       const nm = m + 1 >= 60 ? 0 : m + 1;
//       const nh = m + 1 >= 60 ? h + 1 : h;
//       return `${String(nh).padStart(2, '0')}h ${String(nm).padStart(2, '0')}m`;
//     }), 60000);
//     return () => clearInterval(id);
//   }, []);

//   const greeting = getGreeting(hour);
//   const presentDays = Object.values(attendanceMap).filter(v => v === 1).length;
//   const lateDays    = Object.values(attendanceMap).filter(v => v === 2).length;
//   const absentDays  = Object.values(attendanceMap).filter(v => v === 0).length;
//   const leaveDays   = Object.values(attendanceMap).filter(v => v === 3).length;

//   return (
//     <EmployeePageShell
//       title="My Dashboard"
//       subtitle="Welcome back, Rahul! Here's your complete overview for today."
//     >
//       {/* ── FR-DASH-003 ── Greeting Banner ─────────────────────────────────── */}
//       <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white shadow-lg shadow-blue-600/20">
//         <div className="flex items-center gap-3">
//           {greeting.icon}
//           <div>
//             <p className="text-sm font-medium text-blue-100">{greeting.text}</p>
//             <h2 className="text-xl font-extrabold tracking-tight">Rahul Sharma 👋</h2>
//           </div>
//         </div>
//         <div className="hidden text-right sm:block">
//           <p className="text-xs text-blue-200">Today</p>
//           <p className="text-sm font-bold">Sunday, 13 Sep 2026</p>
//         </div>
//       </div>

//       {/* ── FR-DASH-003 Row 1: Today's Attendance — Check-In/Out + Working Hours ── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">

//         {/* Today's Attendance Card */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Today — Sep 13</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Attendance Status</h2>
//             </div>
//             <span className={`rounded-full px-3 py-1 text-xs font-bold ${checkedIn ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
//               {checkedIn ? '● Present' : '○ Not checked in'}
//             </span>
//           </div>

//           {/* Check-in / Check-out / Working Hours */}
//           <div className="mb-4 grid grid-cols-3 gap-3">
//             {[
//               { label: 'Check-In',      value: checkedIn ? checkInTime : '—',    Icon: LogIn,  color: 'text-emerald-600 bg-emerald-50' },
//               { label: 'Check-Out',     value: checkedIn ? '—' : '06:30 PM',      Icon: LogOut, color: 'text-rose-500 bg-rose-50' },
//               { label: 'Working Hours', value: checkedIn ? elapsed : '00h 00m',   Icon: Clock,  color: 'text-blue-600 bg-blue-50' },
//             ].map(({ label, value, Icon, color }) => (
//               <div key={label} className="rounded-xl bg-slate-50 p-3 text-center">
//                 <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
//                   <Icon className="h-4 w-4" />
//                 </div>
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
//                 <p className="mt-1 text-base font-extrabold text-slate-900">{value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             <button
//               onClick={() => setCheckedIn(true)}
//               disabled={checkedIn}
//               className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-500/25 transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <LogIn className="h-4 w-4" />Check In
//             </button>
//             <button
//               onClick={() => setCheckedIn(false)}
//               disabled={!checkedIn}
//               className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//             >
//               <LogOut className="h-4 w-4" />Check Out
//             </button>
//           </div>

//           <Link href="/employees/attendance" className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
//             View full attendance record <ArrowRight className="h-3 w-3" />
//           </Link>
//         </div>

//         {/* Leave Balance */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">FY 2026–27</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Leave Balance</h2>
//             </div>
//             <Link href="/employees/leave" className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100">Apply →</Link>
//           </div>

//           <div className="space-y-3 mb-4">
//             {leaveBalance.map(l => (
//               <div key={l.label}>
//                 <div className="mb-1 flex justify-between text-xs">
//                   <span className="font-semibold text-slate-700">{l.label} Leave</span>
//                   <span className={`font-bold ${l.text}`}>{l.total - l.used} / {l.total} left</span>
//                 </div>
//                 <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                   <div className={`h-2 rounded-full ${l.color} transition-all duration-700`} style={{ width: `${((l.total - l.used) / l.total) * 100}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pending leave alert */}
//           <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
//             <div className="flex items-center gap-2">
//               <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
//               <div>
//                 <p className="text-xs font-bold text-amber-800">Pending: Casual Leave</p>
//                 <p className="text-[11px] text-amber-700">Sep 14–15 · Awaiting manager approval</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── FR-DASH-003 Row 2: Leave Requests + Monthly Attendance ─────────── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

//         {/* Leave Requests */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">My Requests</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Leave Requests</h2>
//             </div>
//             <Link href="/employees/leave" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
//           </div>
//           <div className="space-y-2.5">
//             {leaveRequests.map((req, i) => (
//               <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50/60 transition-colors">
//                 <div className="flex items-center gap-3">
//                   <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
//                     req.tone === 'emerald' ? 'bg-emerald-50' : req.tone === 'amber' ? 'bg-amber-50' : 'bg-rose-50'
//                   }`}>
//                     <CalendarDays className={`h-4 w-4 ${
//                       req.tone === 'emerald' ? 'text-emerald-600' : req.tone === 'amber' ? 'text-amber-600' : 'text-rose-600'
//                     }`} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900">{req.type}</p>
//                     <p className="text-[11px] text-slate-500">{req.from} – {req.to} · {req.days} day{req.days > 1 ? 's' : ''}</p>
//                   </div>
//                 </div>
//                 <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadge[req.status]}`}>{req.status}</span>
//               </div>
//             ))}
//           </div>
//           <Link href="/employees/leave" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
//             <CalendarDays className="h-4 w-4" />Apply New Leave
//           </Link>
//         </div>

//         {/* Monthly Attendance Calendar */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Monthly</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Attendance — Sep 2026</h2>
//             </div>
//             <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
//               {presentDays + lateDays}/22 days
//             </div>
//           </div>

//           {/* Calendar grid */}
//           <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-3">
//             {dayLabels.map(d => <div key={d} className="py-1 font-bold text-slate-400">{d}</div>)}

//             {/* Offset blank cells */}
//             {Array.from({ length: SEP_OFFSET }).map((_, i) => <div key={`blank-${i}`} />)}

//             {/* Days 1–30 */}
//             {Array.from({ length: 30 }).map((_, i) => {
//               const day = i + 1;
//               const type = attendanceMap[day] ?? 5;
//               const cfg  = dayConfig[type];
//               const isToday = day === 13;
//               return (
//                 <div
//                   key={day}
//                   title={cfg.title}
//                   className={`flex h-8 items-center justify-center rounded-lg text-[11px] font-semibold transition-transform hover:scale-110 cursor-default ${cfg.bg} ${cfg.text} ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
//                 >
//                   {day}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Legend */}
//           <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
//             {[
//               { label: 'Present', color: 'bg-emerald-400' },
//               { label: 'Late',    color: 'bg-amber-400' },
//               { label: 'Absent',  color: 'bg-rose-400' },
//               { label: 'Leave',   color: 'bg-blue-400' },
//               { label: 'Holiday', color: 'bg-slate-300' },
//             ].map(l => (
//               <span key={l.label} className="flex items-center gap-1 font-medium text-slate-500">
//                 <span className={`h-2.5 w-2.5 rounded-sm ${l.color}`} />{l.label}
//               </span>
//             ))}
//           </div>

//           {/* Monthly summary */}
//           <div className="mt-3 grid grid-cols-4 gap-2">
//             {[
//               { label: 'Present', value: presentDays, color: 'text-emerald-600 bg-emerald-50' },
//               { label: 'Late',    value: lateDays,    color: 'text-amber-600 bg-amber-50' },
//               { label: 'Absent',  value: absentDays,  color: 'text-rose-600 bg-rose-50' },
//               { label: 'Leave',   value: leaveDays,   color: 'text-blue-600 bg-blue-50' },
//             ].map(s => (
//               <div key={s.label} className={`rounded-xl p-2 text-center ${s.color}`}>
//                 <p className="text-lg font-extrabold">{s.value}</p>
//                 <p className="text-[10px] font-semibold">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── FR-DASH-003 Row 3: Latest Payslip + Announcements ──────────────── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

//         {/* Latest Payslip */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Latest</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Payslip — {payslip.month}</h2>
//             </div>
//             <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">● {payslip.status}</span>
//           </div>

//           {/* Salary breakdown */}
//           <div className="space-y-2.5 mb-4">
//             {[
//               { label: 'Gross Salary',   value: payslip.gross,      color: 'text-slate-900',   bg: 'bg-slate-50' },
//               { label: 'Deductions',     value: payslip.deductions,  color: 'text-rose-600',    bg: 'bg-rose-50' },
//               { label: 'Net Take Home',  value: payslip.net,         color: 'text-emerald-700', bg: 'bg-emerald-50' },
//             ].map(({ label, value, color, bg }) => (
//               <div key={label} className={`flex items-center justify-between rounded-xl px-4 py-3 ${bg}`}>
//                 <span className="text-sm text-slate-600">{label}</span>
//                 <span className={`text-base font-extrabold ${color}`}>{value}</span>
//               </div>
//             ))}
//           </div>

//           <p className="mb-3 text-[11px] text-slate-400 text-center">Processed on {payslip.date}</p>

//           <div className="flex gap-3">
//             <Link href="/employees/payroll" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
//               <CreditCard className="h-4 w-4" />View Details
//             </Link>
//             <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
//               <TrendingUp className="h-4 w-4" />Download PDF
//             </button>
//           </div>
//         </div>

//         {/* Announcements */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Company</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Announcements</h2>
//             </div>
//             <Link href="/employees/communication" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
//           </div>

//           <div className="space-y-3">
//             {announcements.map((a, i) => (
//               <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-slate-50/60 ${!a.read ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100'}`}>
//                 <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${!a.read ? 'bg-blue-100' : 'bg-slate-100'}`}>
//                   <Megaphone className={`h-4 w-4 ${!a.read ? 'text-blue-600' : 'text-slate-500'}`} />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2">
//                     {!a.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
//                     <p className="text-sm font-semibold text-slate-900 truncate">{a.title}</p>
//                   </div>
//                   <div className="mt-0.5 flex items-center gap-1.5">
//                     <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{a.category}</span>
//                     <span className="text-[10px] text-slate-400">{a.date}</span>
//                   </div>
//                 </div>
//                 <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${a.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
//                   {a.priority}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── FR-DASH-003 Row 4: Upcoming Holidays ───────────────────────────── */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="mb-5 flex items-center justify-between">
//           <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Calendar</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Upcoming Holidays</h2>
//           </div>
//           <Gift className="h-5 w-5 text-slate-400" />
//         </div>

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//           {holidays.map((h, i) => (
//             <div key={i} className={`flex items-start gap-3 rounded-2xl border p-4 ${h.color}`}>
//               <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white/60 text-center">
//                 <p className="text-[10px] font-bold uppercase leading-none">
//                   {h.date.split(' ')[0]}
//                 </p>
//                 <p className="text-lg font-extrabold leading-tight">
//                   {h.date.split(' ')[1]?.replace(',', '')}
//                 </p>
//               </div>
//               <div className="min-w-0">
//                 <p className="font-bold text-sm truncate">{h.name}</p>
//                 <p className="text-[11px] opacity-75">{h.day}</p>
//                 <span className="mt-1 inline-block rounded-full bg-white/50 px-2 py-0.5 text-[10px] font-bold">
//                   {h.daysLeft} days away
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//     </EmployeePageShell>
//   );
// }


'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  LogIn, LogOut, Clock, CalendarDays, CheckCircle2,
  Circle, Timer, Megaphone, Gift, CreditCard,
  ArrowRight, AlertCircle, TrendingUp, ChevronRight,
  Sun, Moon, Coffee, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Sep 2026 attendance map
const attendanceMap: Record<number, number> = {
  1: 4, 2: 4, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1,
  8: 4, 9: 4, 10: 1, 11: 1, 12: 1, 13: 3, 14: 2,
  15: 0, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1,
  21: 4, 22: 4, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1,
  28: 4, 29: 4, 30: 1,
};
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SEP_OFFSET = 1;

const dayConfig: Record<number, { bg: string; text: string; title: string }> = {
  0: { bg: 'bg-rose-100', text: 'text-rose-600', title: 'Absent' },
  1: { bg: 'bg-emerald-100', text: 'text-emerald-700', title: 'Present' },
  2: { bg: 'bg-amber-100', text: 'text-amber-700', title: 'Late' },
  3: { bg: 'bg-blue-100', text: 'text-blue-700', title: 'Leave' },
  4: { bg: 'bg-slate-100', text: 'text-slate-400', title: 'Holiday / Weekend' },
  5: { bg: 'bg-slate-100', text: 'text-slate-400', title: 'Weekend' },
};

const statusBadge: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
};

function getGreeting(hour: number) {
  if (hour < 12) return { text: 'Good morning', icon: <Sun className="h-5 w-5 text-amber-400" /> };
  if (hour < 17) return { text: 'Good afternoon', icon: <Coffee className="h-5 w-5 text-orange-400" /> };
  return { text: 'Good evening', icon: <Moon className="h-5 w-5 text-indigo-400" /> };
}

export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Rahul Sharma');
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:28 AM');
  const [checkOutTime, setCheckOutTime] = useState('—');
  const [elapsed, setElapsed] = useState('06h 45m');
  const [hour, setHour] = useState(9);

  const [leaveBalance, setLeaveBalance] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [payslip, setPayslip] = useState<any>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/dashboard');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.user?.name) setUserName(data.user.name);
        if (data.todayAttendance) {
          setCheckedIn(data.todayAttendance.checkedIn);
          setCheckInTime(data.todayAttendance.checkInTime);
          setCheckOutTime(data.todayAttendance.checkOutTime);
          setElapsed(data.todayAttendance.elapsed);
        }
        setLeaveBalance(data.leaveBalance || []);
        setLeaveRequests(data.leaveRequests || []);
        setPayslip(data.payslip || {});
        setAnnouncements(data.announcements || []);
        setHolidays(data.holidays || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const now = new Date();
    setHour(now.getHours());
    const id = setInterval(() => {
      setElapsed((prev) => {
        const [h, m] = prev.replace('h ', ':').replace('m', '').split(':').map(Number);
        const nm = m + 1 >= 60 ? 0 : m + 1;
        const nh = m + 1 >= 60 ? h + 1 : h;
        return `${String(nh).padStart(2, '0')}h ${String(nm).padStart(2, '0')}m`;
      });
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const handleAttendanceAction = async (action: 'checkIn' | 'checkOut') => {
    if (action === 'checkIn') setCheckedIn(true);
    else setCheckedIn(false);

    try {
      await fetch('/api/v1/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const greeting = getGreeting(hour);
  const presentDays = Object.values(attendanceMap).filter((v) => v === 1).length;
  const lateDays = Object.values(attendanceMap).filter((v) => v === 2).length;
  const absentDays = Object.values(attendanceMap).filter((v) => v === 0).length;
  const leaveDays = Object.values(attendanceMap).filter((v) => v === 3).length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <EmployeePageShell
      title="My Dashboard"
      subtitle={`Welcome back, ${userName}! Here's your complete overview for today.`}
    >
      {/* Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-center gap-3">
          {greeting.icon}
          <div>
            <p className="text-sm font-medium text-blue-100">{greeting.text}</p>
            <h2 className="text-xl font-extrabold tracking-tight">{userName} 👋</h2>
          </div>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-xs text-blue-200">Today</p>
          <p className="text-sm font-bold">Sunday, 13 Sep 2026</p>
        </div>
      </div>

      {/* Row 1: Attendance & Leave Balance */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Today — Sep 13</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Attendance Status</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${checkedIn ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {checkedIn ? '● Present' : '○ Not checked in'}
            </span>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Check-In', value: checkedIn ? checkInTime : '—', Icon: LogIn, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Check-Out', value: checkedIn ? '—' : checkOutTime, Icon: LogOut, color: 'text-rose-500 bg-rose-50' },
              { label: 'Working Hours', value: checkedIn ? elapsed : '00h 00m', Icon: Clock, color: 'text-blue-600 bg-blue-50' },
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3 text-center">
                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-1 text-base font-extrabold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAttendanceAction('checkIn')}
              disabled={checkedIn}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-500/25 transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogIn className="h-4 w-4" />Check In
            </button>
            <button
              onClick={() => handleAttendanceAction('checkOut')}
              disabled={!checkedIn}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogOut className="h-4 w-4" />Check Out
            </button>
          </div>

          <Link href="/employees/attendance" className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
            View full attendance record <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">FY 2026–27</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Leave Balance</h2>
            </div>
            <Link href="/employees/leave" className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100">Apply →</Link>
          </div>

          <div className="space-y-3 mb-4">
            {leaveBalance.map((l) => (
              <div key={l.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{l.label} Leave</span>
                  <span className={`font-bold ${l.text}`}>{l.total - l.used} / {l.total} left</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${l.color} transition-all duration-700`} style={{ width: `${((l.total - l.used) / l.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-amber-800">Pending: Casual Leave</p>
                <p className="text-[11px] text-amber-700">Sep 14–15 · Awaiting manager approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Leave Requests & Monthly Attendance */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">My Requests</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Leave Requests</h2>
            </div>
            <Link href="/employees/leave" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-2.5">
            {leaveRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${req.tone === 'emerald' ? 'bg-emerald-50' : req.tone === 'amber' ? 'bg-amber-50' : 'bg-rose-50'}`}>
                    <CalendarDays className={`h-4 w-4 ${req.tone === 'emerald' ? 'text-emerald-600' : req.tone === 'amber' ? 'text-amber-600' : 'text-rose-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{req.type}</p>
                    <p className="text-[11px] text-slate-500">{req.from} – {req.to} · {req.days} day{req.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadge[req.status]}`}>{req.status}</span>
              </div>
            ))}
          </div>
          <Link href="/employees/leave" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors">
            <CalendarDays className="h-4 w-4" />Apply New Leave
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Monthly</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Attendance — Sep 2026</h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              {presentDays + lateDays}/22 days
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-3">
            {dayLabels.map((d) => <div key={d} className="py-1 font-bold text-slate-400">{d}</div>)}
            {Array.from({ length: SEP_OFFSET }).map((_, i) => <div key={`blank-${i}`} />)}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const type = attendanceMap[day] ?? 5;
              const cfg = dayConfig[type];
              const isToday = day === 13;
              return (
                <div
                  key={day}
                  title={cfg.title}
                  className={`flex h-8 items-center justify-center rounded-lg text-[11px] font-semibold transition-transform hover:scale-110 cursor-default ${cfg.bg} ${cfg.text} ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
            {[
              { label: 'Present', color: 'bg-emerald-400' },
              { label: 'Late', color: 'bg-amber-400' },
              { label: 'Absent', color: 'bg-rose-400' },
              { label: 'Leave', color: 'bg-blue-400' },
              { label: 'Holiday', color: 'bg-slate-300' },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1 font-medium text-slate-500">
                <span className={`h-2.5 w-2.5 rounded-sm ${l.color}`} />{l.label}
              </span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { label: 'Present', value: presentDays, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Late', value: lateDays, color: 'text-amber-600 bg-amber-50' },
              { label: 'Absent', value: absentDays, color: 'text-rose-600 bg-rose-50' },
              { label: 'Leave', value: leaveDays, color: 'text-blue-600 bg-blue-50' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-2 text-center ${s.color}`}>
                <p className="text-lg font-extrabold">{s.value}</p>
                <p className="text-[10px] font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payslip & Announcements */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Latest</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Payslip — {payslip.month}</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">● {payslip.status}</span>
          </div>

          <div className="space-y-2.5 mb-4">
            {[
              { label: 'Gross Salary', value: payslip.gross, color: 'text-slate-900', bg: 'bg-slate-50' },
              { label: 'Deductions', value: payslip.deductions, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Net Take Home', value: payslip.net, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`flex items-center justify-between rounded-xl px-4 py-3 ${bg}`}>
                <span className="text-sm text-slate-600">{label}</span>
                <span className={`text-base font-extrabold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <p className="mb-3 text-[11px] text-slate-400 text-center">Processed on {payslip.date}</p>

          <div className="flex gap-3">
            <Link href="/employees/payroll" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <CreditCard className="h-4 w-4" />View Details
            </Link>
            <button
              onClick={handleDownloadPdf}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />Download PDF
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Company</p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">Announcements</h2>
            </div>
            <Link href="/employees/communication" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
          </div>

          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-slate-50/60 ${!a.read ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100'}`}>
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${!a.read ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  <Megaphone className={`h-4 w-4 ${!a.read ? 'text-blue-600' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!a.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                    <p className="text-sm font-semibold text-slate-900 truncate">{a.title}</p>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{a.category}</span>
                    <span className="text-[10px] text-slate-400">{a.date}</span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${a.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                  {a.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Holidays */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Calendar</p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">Upcoming Holidays</h2>
          </div>
          <Gift className="h-5 w-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {holidays.map((h, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-2xl border p-4 ${h.color}`}>
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white/60 text-center">
                <p className="text-[10px] font-bold uppercase leading-none">
                  {h.date.split(' ')[0]}
                </p>
                <p className="text-lg font-extrabold leading-tight">
                  {h.date.split(' ')[1]?.replace(',', '')}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{h.name}</p>
                <p className="text-[11px] opacity-75">{h.day}</p>
                <span className="mt-1 inline-block rounded-full bg-white/50 px-2 py-0.5 text-[10px] font-bold">
                  {h.daysLeft} days away
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployeePageShell>
  );
}