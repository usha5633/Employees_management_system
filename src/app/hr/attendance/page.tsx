// 'use client';
// import HRPageShell from '@/components/hr/HRPageShell';
// import { Search, Filter, Download } from 'lucide-react';
// import { useState, useMemo } from 'react';

// const records = [
//   { name: 'Aanya Sharma',  avatar: 'AS', color: 'bg-violet-100 text-violet-700', dept: 'Design',      checkIn: '09:05 AM', checkOut: '06:30 PM', hours: '9h 25m', status: 'Present', date: 'Sep 12' },
//   { name: 'Rohit Verma',   avatar: 'RV', color: 'bg-sky-100 text-sky-700',       dept: 'Engineering', checkIn: '09:42 AM', checkOut: '06:15 PM', hours: '8h 33m', status: 'Late',    date: 'Sep 12' },
//   { name: 'Meera Nair',    avatar: 'MN', color: 'bg-emerald-100 text-emerald-700',dept: 'HR',          checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present', date: 'Sep 12' },
//   { name: 'Danish Khan',   avatar: 'DK', color: 'bg-amber-100 text-amber-700',   dept: 'Sales',       checkIn: '—',        checkOut: '—',        hours: '—',      status: 'Leave',   date: 'Sep 12' },
//   { name: 'Vikram Singh',  avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     dept: 'Engineering', checkIn: '—',        checkOut: '—',        hours: '—',      status: 'Absent',  date: 'Sep 12' },
//   { name: 'Pooja Iyer',    avatar: 'PI', color: 'bg-rose-100 text-rose-700',     dept: 'Finance',     checkIn: '09:15 AM', checkOut: '06:45 PM', hours: '9h 30m', status: 'Present', date: 'Sep 12' },
//   { name: 'Sneha Pillai',  avatar: 'SP', color: 'bg-pink-100 text-pink-700',     dept: 'Design',      checkIn: '09:55 AM', checkOut: '07:00 PM', hours: '9h 05m', status: 'Late',    date: 'Sep 12' },
// ];

// const statusBadge: Record<string, string> = {
//   Present: 'bg-emerald-50 text-emerald-700',
//   Late:    'bg-amber-50 text-amber-700',
//   Absent:  'bg-rose-50 text-rose-700',
//   Leave:   'bg-blue-50 text-blue-700',
// };

// const FILTERS = ['All', 'Present', 'Late', 'Absent', 'Leave'];

// export default function HRAttendancePage() {
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');

//   const filtered = useMemo(() => records.filter(r => {
//     const q = search.toLowerCase();
//     const matchQ = r.name.toLowerCase().includes(q) || r.dept.toLowerCase().includes(q);
//     const matchS = statusFilter === 'All' || r.status === statusFilter;
//     return matchQ && matchS;
//   }), [search, statusFilter]);

//   const counts = { Present: records.filter(r => r.status === 'Present').length, Late: records.filter(r => r.status === 'Late').length, Absent: records.filter(r => r.status === 'Absent').length, Leave: records.filter(r => r.status === 'Leave').length };

//   return (
//     <HRPageShell title="Attendance" subtitle="Today's attendance overview across the organisation.">
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {Object.entries(counts).map(([label, val]) => (
//           <div key={label} className={`rounded-2xl border p-4 shadow-sm ${statusBadge[label]}`}>
//             <p className="text-xs font-semibold">{label}</p>
//             <p className="mt-2 text-3xl font-bold">{val}</p>
//           </div>
//         ))}
//       </div>

//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
//           <h2 className="text-lg font-bold text-slate-900">Today&apos;s Attendance — Sep 12</h2>
//           <div className="flex flex-wrap gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
//               <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="w-44 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
//             </div>
//             <div className="flex gap-1">
//               {FILTERS.map(f => (
//                 <button key={f} onClick={() => setStatusFilter(f)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${statusFilter === f ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{f}</button>
//               ))}
//             </div>
//             <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
//               <Download className="h-4 w-4" />Export
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-slate-100 text-sm">
//             <thead className="bg-slate-50">
//               <tr>{['Employee', 'Department', 'Check-In', 'Check-Out', 'Hours', 'Status'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>)}</tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {filtered.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">No records found.</td></tr>}
//               {filtered.map(r => (
//                 <tr key={r.name} className="hover:bg-slate-50/70">
//                   <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${r.color}`}>{r.avatar}</div><p className="font-semibold text-slate-900">{r.name}</p></div></td>
//                   <td className="px-5 py-3.5 text-slate-600">{r.dept}</td>
//                   <td className="px-5 py-3.5 text-slate-700">{r.checkIn}</td>
//                   <td className="px-5 py-3.5 text-slate-700">{r.checkOut}</td>
//                   <td className="px-5 py-3.5 font-medium text-slate-700">{r.hours}</td>
//                   <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[r.status]}`}>{r.status}</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </HRPageShell>
//   );
// }

'use client';

import HRPageShell from '@/components/hr/HRPageShell';
import { CheckCircle2, Clock, XCircle, Search, Filter, Calendar } from 'lucide-react';
import { useState } from 'react';

interface AttendanceRecord {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'leave';
}

const seedData: AttendanceRecord[] = [
  { id: '1', name: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', role: 'Frontend Engineer', checkIn: '09:15 AM', checkOut: '06:00 PM', status: 'present' },
  { id: '2', name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700', role: 'UX Researcher', checkIn: '09:45 AM', checkOut: '06:30 PM', status: 'late' },
  { id: '3', name: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', role: 'Product Designer', checkIn: '09:00 AM', checkOut: '05:45 PM', status: 'present' },
  { id: '4', name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', role: 'DevOps Engineer', checkIn: '—', checkOut: '—', status: 'leave' },
  { id: '5', name: 'Priya Joshi', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', role: 'Talent Acquisition', checkIn: '—', checkOut: '—', status: 'absent' },
];

export default function HRAttendancePage() {
  const [records] = useState<AttendanceRecord[]>(seedData);
  const [search, setSearch] = useState('');

  const filtered = records.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <HRPageShell title="Attendance Management" subtitle="Track daily employee check-ins, check-outs, and attendance logs.">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Daily Log</p>
            {/* Fixed unescaped entity on Today's */}
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">Today Attendance Summary</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee…"
              className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Employee', 'Role', 'Check In', 'Check Out', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${r.color}`}>
                        {r.avatar}
                      </div>
                      <span className="font-semibold text-slate-900">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{r.role}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.checkIn}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.checkOut}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.status === 'late'
                          ? 'bg-amber-50 text-amber-700'
                          : r.status === 'leave'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRPageShell>
  );
}
