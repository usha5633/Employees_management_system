// 'use client';

// // FR-ATT-001 Check-In | FR-ATT-002 Check-Out | FR-ATT-003 Break Management
// // FR-ATT-004 Working Hours | FR-ATT-005 Attendance Status | FR-ATT-006 Correction

// import EmployeePageShell from '@/components/employee/EmployeePageShell';
// import {
//   LogIn, LogOut, Clock, Coffee, Download, CheckCircle2,
//   AlertCircle, X, ChevronRight, Play, Pause, Send,
// } from 'lucide-react';
// import { useState, useEffect } from 'react';

// // FR-ATT-005: Attendance Status types
// type AttStatus = 'Present' | 'Absent' | 'Half Day' | 'Late' | 'Early Leave' | 'Work From Home' | 'Holiday' | 'Weekend' | 'Leave';

// interface HistoryRow {
//   date: string; checkIn: string; checkOut: string;
//   hours: string; breakDur: string; status: AttStatus;
//   method: string;
// }

// const history: HistoryRow[] = [
//   { date: '12 Sep 2026', checkIn: '09:05 AM', checkOut: '06:30 PM', hours: '09h 10m', breakDur: '45m', status: 'Present',       method: 'Web' },
//   { date: '11 Sep 2026', checkIn: '09:42 AM', checkOut: '06:15 PM', hours: '08h 03m', breakDur: '30m', status: 'Late',           method: 'Web' },
//   { date: '10 Sep 2026', checkIn: '09:00 AM', checkOut: '01:30 PM', hours: '04h 30m', breakDur: '0m',  status: 'Half Day',       method: 'Web' },
//   { date: '09 Sep 2026', checkIn: '—',        checkOut: '—',        hours: '—',       breakDur: '—',   status: 'Leave',          method: '—' },
//   { date: '08 Sep 2026', checkIn: '09:15 AM', checkOut: '06:40 PM', hours: '09h 05m', breakDur: '20m', status: 'Work From Home', method: 'Web' },
//   { date: '07 Sep 2026', checkIn: '—',        checkOut: '—',        hours: '—',       breakDur: '—',   status: 'Weekend',        method: '—' },
//   { date: '06 Sep 2026', checkIn: '—',        checkOut: '—',        hours: '—',       breakDur: '—',   status: 'Weekend',        method: '—' },
//   { date: '05 Sep 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '09h 00m', breakDur: '60m', status: 'Present',        method: 'Web' },
// ];

// // FR-ATT-005 color config
// const statusConfig: Record<AttStatus, { badge: string; dot: string }> = {
//   Present:       { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
//   Absent:        { badge: 'bg-rose-50 text-rose-700',       dot: 'bg-rose-500' },
//   'Half Day':    { badge: 'bg-orange-50 text-orange-700',   dot: 'bg-orange-400' },
//   Late:          { badge: 'bg-amber-50 text-amber-700',     dot: 'bg-amber-400' },
//   'Early Leave': { badge: 'bg-yellow-50 text-yellow-700',   dot: 'bg-yellow-400' },
//   'Work From Home':{ badge: 'bg-blue-50 text-blue-700',     dot: 'bg-blue-500' },
//   Holiday:       { badge: 'bg-purple-50 text-purple-700',   dot: 'bg-purple-400' },
//   Weekend:       { badge: 'bg-slate-100 text-slate-500',    dot: 'bg-slate-400' },
//   Leave:         { badge: 'bg-sky-50 text-sky-700',         dot: 'bg-sky-500' },
// };

// // Sep 2026 calendar data
// const calDays: { day: number; status: AttStatus | null }[] = [
//   { day: 1, status: 'Holiday' }, { day: 2, status: null },
//   { day: 3, status: 'Present' }, { day: 4, status: 'Present' }, { day: 5, status: 'Present' },
//   { day: 6, status: 'Weekend' }, { day: 7, status: 'Weekend' },
//   { day: 8, status: 'Work From Home' }, { day: 9, status: 'Leave' }, { day: 10, status: 'Half Day' },
//   { day: 11, status: 'Late' }, { day: 12, status: 'Present' },
//   { day: 13, status: 'Weekend' }, { day: 14, status: 'Weekend' },
//   { day: 15, status: null }, { day: 16, status: null }, { day: 17, status: null },
//   { day: 18, status: null }, { day: 19, status: null },
//   { day: 20, status: 'Weekend' }, { day: 21, status: 'Weekend' },
// ];

// export default function AttendancePage() {
//   // FR-ATT-001 / FR-ATT-002
//   const [checkedIn,   setCheckedIn]   = useState(false);
//   const [checkInTime, setCheckInTime] = useState('');
//   const [checkOutTime,setCheckOutTime]= useState('');
//   const [workSecs,    setWorkSecs]    = useState(0);

//   // FR-ATT-003 Break Management
//   const [onBreak,    setOnBreak]    = useState(false);
//   const [breakSecs,  setBreakSecs]  = useState(0);
//   const [breakStart, setBreakStart] = useState('');

//   // FR-ATT-006 Correction Request
//   const [showCorrection, setShowCorrection] = useState(false);
//   const [corrForm,        setCorrForm]       = useState({ date: '', checkIn: '', checkOut: '', reason: '' });
//   const [corrSaved,       setCorrSaved]      = useState(false);

//   const [toast, setToast] = useState('');

//   const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

//   // Work timer
//   useEffect(() => {
//     if (!checkedIn || onBreak) return;
//     const id = setInterval(() => setWorkSecs(s => s + 1), 1000);
//     return () => clearInterval(id);
//   }, [checkedIn, onBreak]);

//   // Break timer
//   useEffect(() => {
//     if (!onBreak) return;
//     const id = setInterval(() => setBreakSecs(s => s + 1), 1000);
//     return () => clearInterval(id);
//   }, [onBreak]);

//   // FR-ATT-004: WorkingHours = CheckOut - CheckIn - BreakDuration
//   const fmt = (secs: number) => `${String(Math.floor(secs / 3600)).padStart(2,'0')}h ${String(Math.floor((secs % 3600) / 60)).padStart(2,'0')}m`;
//   const netSecs = Math.max(0, workSecs - breakSecs);

//   const handleCheckIn = () => {
//     setCheckedIn(true);
//     setCheckInTime(now());
//     setWorkSecs(0);
//     showToast('✓ Checked in successfully');
//   };
//   const handleCheckOut = () => {
//     setCheckedIn(false);
//     setCheckOutTime(now());
//     showToast('✓ Checked out — Great work today!');
//   };
//   const handleBreakStart = () => { setOnBreak(true); setBreakStart(now()); showToast('Break started'); };
//   const handleBreakEnd   = () => { setOnBreak(false); showToast('Break ended — back to work!'); };

//   const submitCorrection = () => {
//     if (!corrForm.date || !corrForm.reason) return;
//     setCorrSaved(true);
//     setTimeout(() => { setCorrSaved(false); setShowCorrection(false); setCorrForm({ date:'',checkIn:'',checkOut:'',reason:'' }); showToast('Correction request submitted'); }, 1200);
//   };

//   return (
//     <EmployeePageShell
//       title="My Attendance"
//       subtitle="FR-ATT: Check-in, check-out, break management & corrections."
//       actions={
//         <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
//           <Download className="h-4 w-4" />Export
//         </button>
//       }
//     >
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-5 right-5 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>
//       )}

//       {/* FR-ATT-006 Correction Modal */}
//       {showCorrection && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
//           <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
//             <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//               <div><h3 className="font-bold text-slate-900">Attendance Correction</h3><p className="text-xs text-slate-500 mt-0.5">FR-ATT-006 · Request will go to Manager → HR</p></div>
//               <button onClick={() => setShowCorrection(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
//             </div>
//             {corrSaved ? (
//               <div className="flex flex-col items-center gap-3 py-10">
//                 <CheckCircle2 className="h-12 w-12 text-emerald-500" />
//                 <p className="font-bold text-slate-900">Request Submitted!</p>
//                 <p className="text-xs text-slate-500">Sent to Manager for approval</p>
//               </div>
//             ) : (
//               <div className="px-6 py-5 space-y-4">
//                 <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 flex gap-2">
//                   <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
//                   <p className="text-xs text-amber-800">Correction flow: Employee → Manager → HR → Approved/Rejected</p>
//                 </div>
//                 {[['Date','date','date'],['Correct Check-In','checkIn','time'],['Correct Check-Out','checkOut','time']].map(([lbl,key,type]) => (
//                   <div key={key}>
//                     <label className="block text-xs font-semibold text-slate-600 mb-1.5">{lbl}</label>
//                     <input type={type} value={(corrForm as any)[key]} onChange={e => setCorrForm(f => ({ ...f, [key]: e.target.value }))}
//                       className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
//                   </div>
//                 ))}
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reason *</label>
//                   <textarea rows={3} value={corrForm.reason} onChange={e => setCorrForm(f => ({ ...f, reason: e.target.value }))} placeholder="Explain the reason for correction…"
//                     className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <button onClick={() => setShowCorrection(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
//                   <button onClick={submitCorrection} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
//                     <Send className="h-4 w-4" />Submit Request
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── FR-ATT-001/002/003/004: Today's Attendance ── */}
//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Today — Sep 13, 2026</p>
//               <h2 className="mt-0.5 text-lg font-bold text-slate-900">Attendance Status</h2>
//             </div>
//             <div className="flex items-center gap-2">
//               {/* FR-ATT-007: method badge */}
//               <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">🌐 Web</span>
//               <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${checkedIn ? (onBreak ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700') : 'bg-slate-100 text-slate-500'}`}>
//                 {checkedIn ? (onBreak ? '☕ On Break' : '● Present') : '○ Not checked in'}
//               </span>
//             </div>
//           </div>

//           {/* FR-ATT-004: Working Hours formula display */}
//           <div className="mb-4 grid grid-cols-4 gap-3">
//             {[
//               { label: 'Check-In',      value: checkInTime  || '—',     Icon: LogIn,    color: 'text-emerald-600 bg-emerald-50' },
//               { label: 'Check-Out',     value: checkOutTime || '—',     Icon: LogOut,   color: 'text-rose-500   bg-rose-50' },
//               { label: 'Break',         value: onBreak ? fmt(breakSecs) : fmt(breakSecs), Icon: Coffee, color: 'text-amber-600  bg-amber-50' },
//               { label: 'Net Hours',     value: checkedIn ? fmt(netSecs) : '00h 00m', Icon: Clock, color: 'text-blue-600   bg-blue-50' },
//             ].map(({ label, value, Icon, color }) => (
//               <div key={label} className="rounded-xl bg-slate-50 p-3 text-center">
//                 <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
//                   <Icon className="h-4 w-4" />
//                 </div>
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
//                 <p className="mt-0.5 text-sm font-extrabold text-slate-900">{value}</p>
//               </div>
//             ))}
//           </div>

//           {/* Formula note */}
//           <div className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500">
//             Net Hours = Check-Out − Check-In − Break Duration (FR-ATT-004)
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-2">
//             <button onClick={handleCheckIn} disabled={checkedIn}
//               className="flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
//               <LogIn className="h-4 w-4" />Check In
//             </button>
//             <button onClick={!onBreak ? handleBreakStart : handleBreakEnd} disabled={!checkedIn}
//               className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${onBreak ? 'bg-amber-500 text-white hover:bg-amber-600' : 'border border-slate-200 bg-white text-slate-700 hover:bg-amber-50 hover:border-amber-300'}`}>
//               {onBreak ? <><Pause className="h-4 w-4" />End Break</> : <><Coffee className="h-4 w-4" />Start Break</>}
//             </button>
//             <button onClick={handleCheckOut} disabled={!checkedIn || onBreak}
//               className="flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
//               <LogOut className="h-4 w-4" />Check Out
//             </button>
//           </div>

//           {/* FR-ATT-006: Request Correction */}
//           <button onClick={() => setShowCorrection(true)} className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
//             Request attendance correction <ChevronRight className="h-3 w-3" />
//           </button>
//         </div>

//         {/* Monthly Summary */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">September Summary</p>
//           <div className="space-y-2.5 mb-4">
//             {[
//               { label: 'Present',       value: 8,  color: 'bg-emerald-500', light: 'text-emerald-700' },
//               { label: 'Work From Home',value: 2,  color: 'bg-blue-500',    light: 'text-blue-700' },
//               { label: 'Late',          value: 1,  color: 'bg-amber-400',   light: 'text-amber-700' },
//               { label: 'Half Day',      value: 1,  color: 'bg-orange-400',  light: 'text-orange-700' },
//               { label: 'Leave',         value: 1,  color: 'bg-sky-400',     light: 'text-sky-700' },
//               { label: 'Absent',        value: 0,  color: 'bg-rose-400',    light: 'text-rose-700' },
//             ].map(s => (
//               <div key={s.label} className="flex items-center gap-3">
//                 <span className="w-28 text-xs font-semibold text-slate-700">{s.label}</span>
//                 <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
//                   <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${(s.value / 13) * 100}%` }} />
//                 </div>
//                 <span className={`w-5 text-right text-xs font-bold ${s.light}`}>{s.value}</span>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             {[
//               { label: 'Working days', value: '13/22' },
//               { label: 'Total hours',  value: '117h' },
//               { label: 'Avg hours/day',value: '9.0h' },
//               { label: 'On-time rate', value: '88%' },
//             ].map(s => (
//               <div key={s.label} className="rounded-xl bg-slate-50 px-3 py-2.5 text-center">
//                 <p className="text-[10px] text-slate-500">{s.label}</p>
//                 <p className="mt-0.5 text-base font-extrabold text-slate-900">{s.value}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── FR-ATT-005: Monthly Calendar with all status types ── */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="mb-4 flex items-center justify-between">
//           <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">FR-ATT-005 — All Status Types</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Monthly Attendance Calendar</h2>
//           </div>
//           <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">September 2026</span>
//         </div>

//         <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] mb-3">
//           {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="py-1 font-bold text-slate-400">{d}</div>)}
//           {/* Sep 1 = Tuesday → 1 blank */}
//           <div />
//           {calDays.map(({ day, status }) => {
//             const cfg = status ? statusConfig[status] : null;
//             return (
//               <div key={day} title={status ?? 'Future'} className={`flex h-9 items-center justify-center rounded-lg text-[11px] font-semibold cursor-default transition-transform hover:scale-110 ${cfg ? `${cfg.badge}` : 'bg-slate-50 text-slate-400'} ${day === 13 ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}>
//                 {day}
//               </div>
//             );
//           })}
//         </div>

//         {/* Legend — FR-ATT-005 */}
//         <div className="flex flex-wrap gap-2">
//           {(Object.entries(statusConfig) as [AttStatus, any][]).map(([s, cfg]) => (
//             <span key={s} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${cfg.badge}`}>
//               <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />{s}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* ── Attendance History Table ── */}
//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">History</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Recent Attendance Records</h2>
//           </div>
//           <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
//             <Download className="h-3.5 w-3.5" />Export CSV
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-slate-100 text-sm">
//             <thead className="bg-slate-50">
//               <tr>
//                 {['Date','Check-In','Check-Out','Net Hours','Break','Status','Method'].map(h => (
//                   <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {history.map(row => {
//                 const cfg = statusConfig[row.status];
//                 return (
//                   <tr key={row.date} className="hover:bg-slate-50/70 transition-colors">
//                     <td className="px-5 py-3 font-semibold text-slate-900">{row.date}</td>
//                     <td className="px-5 py-3 text-slate-600">{row.checkIn}</td>
//                     <td className="px-5 py-3 text-slate-600">{row.checkOut}</td>
//                     <td className="px-5 py-3 font-semibold text-slate-800">{row.hours}</td>
//                     <td className="px-5 py-3 text-slate-500">{row.breakDur}</td>
//                     <td className="px-5 py-3">
//                       <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.badge}`}>
//                         <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />{row.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 text-slate-500">{row.method}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </EmployeePageShell>
//   );
// }

'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';

import {
  LogIn,
  LogOut,
  Clock,
  Coffee,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Pause,
  Play,
  Send,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

type AttStatus =
  | 'Present'
  | 'Absent'
  | 'Half Day'
  | 'Late'
  | 'Early Leave'
  | 'Work From Home'
  | 'Holiday'
  | 'Weekend'
  | 'Leave';

interface AttendanceRecord {
  _id: string;
  employeeId: string;
  date: string;
  checkIn?: string | Date | null;
  checkOut?: string | Date | null;
  workingHours?: number;
  breakSeconds?: number;
  status: AttStatus;
  method?: string;
}

const employeeId = 'EMP001';

const statusConfig: Record<
  AttStatus,
  {
    badge: string;
    dot: string;
  }
> = {
  Present: {
    badge: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },

  Absent: {
    badge: 'bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },

  'Half Day': {
    badge: 'bg-orange-50 text-orange-700',
    dot: 'bg-orange-400',
  },

  Late: {
    badge: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-400',
  },

  'Early Leave': {
    badge: 'bg-yellow-50 text-yellow-700',
    dot: 'bg-yellow-400',
  },

  'Work From Home': {
    badge: 'bg-blue-50 text-blue-700',
    dot: 'bg-blue-500',
  },

  Holiday: {
    badge: 'bg-purple-50 text-purple-700',
    dot: 'bg-purple-400',
  },

  Weekend: {
    badge: 'bg-slate-100 text-slate-500',
    dot: 'bg-slate-400',
  },

  Leave: {
    badge: 'bg-sky-50 text-sky-700',
    dot: 'bg-sky-500',
  },
};

export default function AttendancePage() {
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [checkedIn, setCheckedIn] =
    useState(false);

  const [onBreak, setOnBreak] =
    useState(false);

  const [checkInTime, setCheckInTime] =
    useState('');

  const [checkOutTime, setCheckOutTime] =
    useState('');

  const [workSecs, setWorkSecs] =
    useState(0);

  const [breakSecs, setBreakSecs] =
    useState(0);

  const [toast, setToast] =
    useState('');

  const [showCorrection, setShowCorrection] =
    useState(false);

  const [corrForm, setCorrForm] =
    useState({
      date: '',
      checkIn: '',
      checkOut: '',
      reason: '',
    });

  const [corrSaved, setCorrSaved] =
    useState(false);

  const today =
    new Date().toISOString().split('T')[0];

  function showToast(message: string) {
    setToast(message);

    setTimeout(() => {
      setToast('');
    }, 3000);
  }

  function formatTime(
    value?: string | Date | null
  ) {
    if (!value) return '—';

    return new Date(value).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    );
  }

  function formatSeconds(seconds: number) {
    const hours =
      Math.floor(seconds / 3600);

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    return `${String(hours).padStart(
      2,
      '0'
    )}h ${String(minutes).padStart(
      2,
      '0'
    )}m`;
  }

  /*
  -----------------------------------
  FETCH ATTENDANCE
  -----------------------------------
  */

  async function fetchAttendance() {
    try {
      const response =
        await fetch(
          `/api/v1/attendance/logs?employeeId=${employeeId}`,
          {
            cache: 'no-store',
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        return;
      }

      setAttendance(data.data);

      const todayRecord =
        data.data.find(
          (item: AttendanceRecord) =>
            item.date === today
        );

      if (todayRecord) {
        if (todayRecord.checkIn) {
          setCheckedIn(
            !todayRecord.checkOut
          );

          setCheckInTime(
            formatTime(
              todayRecord.checkIn
            )
          );

          if (todayRecord.checkOut) {
            setCheckOutTime(
              formatTime(
                todayRecord.checkOut
              )
            );
          }

          if (
            !todayRecord.checkOut &&
            todayRecord.checkIn
          ) {
            const checkInDate =
              new Date(
                todayRecord.checkIn
              ).getTime();

            const elapsed =
              Math.floor(
                (Date.now() -
                  checkInDate) /
                  1000
              );

            setWorkSecs(elapsed);
          }
        }
      }
    } catch (error) {
      console.error(
        'Fetch attendance error:',
        error
      );
    }
  }

  useEffect(() => {
    fetchAttendance();
  }, []);

  /*
  -----------------------------------
  LIVE WORK TIMER
  -----------------------------------
  */

  useEffect(() => {
    if (!checkedIn || onBreak) {
      return;
    }

    const interval =
      setInterval(() => {
        setWorkSecs(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [
    checkedIn,
    onBreak,
  ]);

  /*
  -----------------------------------
  BREAK TIMER
  -----------------------------------
  */

  useEffect(() => {
    if (!onBreak) {
      return;
    }

    const interval =
      setInterval(() => {
        setBreakSecs(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [onBreak]);

  /*
  -----------------------------------
  CHECK IN
  -----------------------------------
  */

  async function handleCheckIn() {
    setLoading(true);

    try {
      const response =
        await fetch(
          '/api/v1/attendance/check-in',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                employeeId,
              }),
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        showToast(
          data.error ||
            'Check-in failed'
        );

        return;
      }

      setCheckedIn(true);

      setCheckInTime(
        formatTime(
          data.data.checkIn
        )
      );

      setCheckOutTime('');

      setWorkSecs(0);

      showToast(
        '✓ Checked in successfully'
      );

      fetchAttendance();
    } catch (error) {
      console.error(error);

      showToast(
        'Failed to check in'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  CHECK OUT
  -----------------------------------
  */

  async function handleCheckOut() {
    if (onBreak) {
      showToast(
        'Please end your break first'
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          '/api/v1/attendance/check-out',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                employeeId,
              }),
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        showToast(
          data.error ||
            'Check-out failed'
        );

        return;
      }

      setCheckedIn(false);

      setCheckOutTime(
        formatTime(
          data.data.checkOut
        )
      );

      showToast(
        '✓ Checked out successfully'
      );

      fetchAttendance();
    } catch (error) {
      console.error(error);

      showToast(
        'Failed to check out'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  BREAK
  -----------------------------------
  */

  function handleBreak() {
    if (!checkedIn) {
      showToast(
        'Please check in first'
      );

      return;
    }

    if (onBreak) {
      setOnBreak(false);

      showToast(
        'Break ended — back to work!'
      );
    } else {
      setOnBreak(true);

      showToast(
        'Break started'
      );
    }
  }

  /*
  -----------------------------------
  CORRECTION
  -----------------------------------
  */

  function submitCorrection() {
    if (
      !corrForm.date ||
      !corrForm.reason
    ) {
      showToast(
        'Date and reason are required'
      );

      return;
    }

    setCorrSaved(true);

    setTimeout(() => {
      setCorrSaved(false);

      setShowCorrection(false);

      setCorrForm({
        date: '',
        checkIn: '',
        checkOut: '',
        reason: '',
      });

      showToast(
        'Correction request submitted'
      );
    }, 1200);
  }

  /*
  -----------------------------------
  SUMMARY
  -----------------------------------
  */

  const summary =
    useMemo(() => {
      const result = {
        Present: 0,
        Late: 0,
        'Half Day': 0,
        Leave: 0,
        Absent: 0,
        'Work From Home': 0,
      };

      attendance.forEach(
        (item) => {
          if (
            item.status in result
          ) {
            result[
              item.status as keyof typeof result
            ]++;
          }
        }
      );

      return result;
    }, [attendance]);

  const netSecs =
    Math.max(
      0,
      workSecs - breakSecs
    );

  /*
  -----------------------------------
  UI
  -----------------------------------
  */

  return (
    <EmployeePageShell
      title="My Attendance"
      subtitle="Track your check-in, check-out, breaks and working hours."
      actions={
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      }
    >
      {/* TOAST */}

      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}

      {/* CORRECTION MODAL */}

      {showCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

              <div>
                <h3 className="font-bold text-slate-900">
                  Attendance Correction
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Request correction for attendance records.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCorrection(
                    false
                  )
                }
                className="rounded-lg p-1.5 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>

            </div>

            {corrSaved ? (

              <div className="flex flex-col items-center gap-3 py-10">

                <CheckCircle2 className="h-12 w-12 text-emerald-500" />

                <p className="font-bold text-slate-900">
                  Request Submitted!
                </p>

              </div>

            ) : (

              <div className="space-y-4 px-6 py-5">

                <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <p className="text-xs text-amber-800">
                    Your correction request will be sent for approval.
                  </p>

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Date
                  </label>

                  <input
                    type="date"

                    value={
                      corrForm.date
                    }

                    onChange={(event) =>
                      setCorrForm(
                        (form) => ({
                          ...form,
                          date:
                            event.target
                              .value,
                        })
                      )
                    }

                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Correct Check-In
                  </label>

                  <input
                    type="time"

                    value={
                      corrForm.checkIn
                    }

                    onChange={(event) =>
                      setCorrForm(
                        (form) => ({
                          ...form,
                          checkIn:
                            event.target
                              .value,
                        })
                      )
                    }

                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Correct Check-Out
                  </label>

                  <input
                    type="time"

                    value={
                      corrForm.checkOut
                    }

                    onChange={(event) =>
                      setCorrForm(
                        (form) => ({
                          ...form,
                          checkOut:
                            event.target
                              .value,
                        })
                      )
                    }

                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />

                </div>

                <div>

                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Reason *
                  </label>

                  <textarea
                    rows={3}

                    value={
                      corrForm.reason
                    }

                    onChange={(event) =>
                      setCorrForm(
                        (form) => ({
                          ...form,
                          reason:
                            event.target
                              .value,
                        })
                      )
                    }

                    placeholder="Explain the reason for correction..."

                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                  />

                </div>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() =>
                      setShowCorrection(
                        false
                      )
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={
                      submitCorrection
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
                  >
                    <Send className="h-4 w-4" />
                    Submit Request
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>
      )}

      {/* TODAY ATTENDANCE */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Today
              </p>

              <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                Attendance Status
              </h2>

            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                checkedIn
                  ? onBreak
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {checkedIn
                ? onBreak
                  ? '☕ On Break'
                  : '● Present'
                : '○ Not checked in'}
            </span>

          </div>

          {/* TIME CARDS */}

          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">

            {[
              {
                label: 'Check-In',
                value:
                  checkInTime ||
                  '—',
                Icon: LogIn,
                color:
                  'text-emerald-600 bg-emerald-50',
              },

              {
                label: 'Check-Out',
                value:
                  checkOutTime ||
                  '—',
                Icon: LogOut,
                color:
                  'text-rose-500 bg-rose-50',
              },

              {
                label: 'Break',
                value:
                  formatSeconds(
                    breakSecs
                  ),
                Icon: Coffee,
                color:
                  'text-amber-600 bg-amber-50',
              },

              {
                label: 'Net Hours',
                value:
                  formatSeconds(
                    netSecs
                  ),
                Icon: Clock,
                color:
                  'text-blue-600 bg-blue-50',
              },
            ].map(
              ({
                label,
                value,
                Icon,
                color,
              }) => (

                <div
                  key={label}
                  className="rounded-xl bg-slate-50 p-3 text-center"
                >

                  <div
                    className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                    {value}
                  </p>

                </div>
              )
            )}

          </div>

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-2">

            <button
              onClick={
                handleCheckIn
              }

              disabled={
                checkedIn ||
                loading
              }

              className="flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogIn className="h-4 w-4" />

              {loading
                ? 'Loading...'
                : 'Check In'}

            </button>

            <button
              onClick={
                handleBreak
              }

              disabled={
                !checkedIn
              }

              className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold ${
                onBreak
                  ? 'bg-amber-500 text-white'
                  : 'border border-slate-200 bg-white text-slate-700'
              }`}
            >

              {onBreak ? (
                <>
                  <Play className="h-4 w-4" />
                  End Break
                </>
              ) : (
                <>
                  <Coffee className="h-4 w-4" />
                  Start Break
                </>
              )}

            </button>

            <button
              onClick={
                handleCheckOut
              }

              disabled={
                !checkedIn ||
                onBreak ||
                loading
              }

              className="flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogOut className="h-4 w-4" />

              Check Out

            </button>

          </div>

          <button
            onClick={() =>
              setShowCorrection(
                true
              )
            }
            className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            Request attendance correction

            <ChevronRight className="h-3 w-3" />

          </button>

        </div>

        {/* MONTHLY SUMMARY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Attendance Summary
          </p>

          <div className="space-y-3">

            {[
              {
                label:
                  'Present',

                value:
                  summary.Present,

                color:
                  'bg-emerald-500',
              },

              {
                label:
                  'Late',

                value:
                  summary.Late,

                color:
                  'bg-amber-400',
              },

              {
                label:
                  'Half Day',

                value:
                  summary[
                    'Half Day'
                  ],

                color:
                  'bg-orange-400',
              },

              {
                label:
                  'Leave',

                value:
                  summary.Leave,

                color:
                  'bg-sky-400',
              },
            ].map(
              (item) => (

                <div
                  key={
                    item.label
                  }
                  className="flex items-center gap-3"
                >

                  <span className="w-24 text-xs font-semibold text-slate-700">
                    {item.label}
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full ${item.color}`}

                      style={{
                        width: `${Math.min(
                          item.value *
                            10,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <span className="w-5 text-right text-xs font-bold">
                    {item.value}
                  </span>

                </div>
              )
            )}

          </div>

        </div>

      </div>

      {/* ATTENDANCE HISTORY */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              History
            </p>

            <h2 className="mt-0.5 text-lg font-bold text-slate-900">
              Recent Attendance Records
            </h2>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-slate-100 text-sm">

            <thead className="bg-slate-50">

              <tr>

                {[
                  'Date',
                  'Check-In',
                  'Check-Out',
                  'Working Hours',
                  'Break',
                  'Status',
                  'Method',
                ].map(
                  (heading) => (

                    <th
                      key={
                        heading
                      }
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  )
                )}

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">

              {attendance.length ===
              0 ? (

                <tr>

                  <td
                    colSpan={
                      7
                    }
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No attendance records found.
                  </td>

                </tr>

              ) : (

                attendance.map(
                  (record) => {

                    const config =
                      statusConfig[
                        record.status
                      ] ||
                      statusConfig.Present;

                    return (

                      <tr
                        key={
                          record._id
                        }
                        className="transition-colors hover:bg-slate-50"
                      >

                        <td className="px-5 py-3 font-semibold text-slate-900">
                          {new Date(
                            record.date
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day:
                                '2-digit',
                              month:
                                'short',
                              year:
                                'numeric',
                            }
                          )}
                        </td>

                        <td className="px-5 py-3 text-slate-600">
                          {formatTime(
                            record.checkIn
                          )}
                        </td>

                        <td className="px-5 py-3 text-slate-600">
                          {formatTime(
                            record.checkOut
                          )}
                        </td>

                        <td className="px-5 py-3 font-semibold text-slate-800">

                          {record.workingHours
                            ? `${record.workingHours} hrs`
                            : '—'}

                        </td>

                        <td className="px-5 py-3 text-slate-500">

                          {record.breakSeconds
                            ? formatSeconds(
                                record.breakSeconds
                              )
                            : '0m'}

                        </td>

                        <td className="px-5 py-3">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.badge}`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                            />

                            {
                              record.status
                            }

                          </span>

                        </td>

                        <td className="px-5 py-3 text-slate-500">

                          {record.method ||
                            'Web'}

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </EmployeePageShell>
  );
}