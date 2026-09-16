// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import { TrendingUp, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface TeamMember {
//   name: string;
//   avatar: string;
//   color: string;
//   taskComp: number;
//   attendance: number;
//   onTime: number;
//   rating: string;
// }

// const ratingColor: Record<string, string> = {
//   Excellent: 'bg-emerald-50 text-emerald-700',
//   Good: 'bg-blue-50 text-blue-700',
//   Average: 'bg-amber-50 text-amber-700',
// };

// export default function ManagerPerformancePage() {
//   const [members, setMembers] = useState<TeamMember[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchPerformance = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/performance');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setMembers(data.members || []);
//       }
//     } catch (err) {
//       console.error('Failed to load performance metrics:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPerformance();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
//         <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="Performance" subtitle="Track and review your team's performance metrics.">
//       <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
//           <div>
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Q3 2026</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Team Performance Review</h2>
//           </div>
//           <TrendingUp className="h-5 w-5 text-violet-600" />
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-slate-100 text-sm">
//             <thead className="bg-slate-50">
//               <tr>
//                 {['Member', 'Task Completion', 'Attendance', 'On-time Delivery', 'Rating'].map((h) => (
//                   <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 bg-white">
//               {members.map((m) => (
//                 <tr key={m.name} className="hover:bg-slate-50/70">
//                   <td className="px-5 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${m.color}`}>
//                         {m.avatar}
//                       </div>
//                       <span className="font-semibold text-slate-900">{m.name}</span>
//                     </div>
//                   </td>
//                   {[m.taskComp, m.attendance, m.onTime].map((val, i) => (
//                     <td key={i} className="px-5 py-4">
//                       <div className="flex items-center gap-2">
//                         <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
//                           <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${val}%` }} />
//                         </div>
//                         <span className="text-xs font-semibold text-slate-700">{val}%</span>
//                       </div>
//                     </td>
//                   ))}
//                   <td className="px-5 py-4">
//                     <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ratingColor[m.rating] || 'bg-slate-100 text-slate-700'}`}>
//                       {m.rating}
//                     </span>
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
import { TrendingUp, Loader2, Search, Award, Target, Filter } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  dept?: string;
  avatar: string;
  taskComp: number;
  attendance: number;
  onTime: number;
  rating: 'Excellent' | 'Good' | 'Average' | string;
}

const ratingColor: Record<string, string> = {
  Excellent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Good: 'bg-blue-50 text-blue-700 border-blue-100',
  Average: 'bg-amber-50 text-amber-700 border-amber-100',
};

export default function ManagerPerformancePage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Fetch Team & Performance from Backend DB
  const fetchPerformanceData = async () => {
    try {
      setLoading(true);

      // Fetch Performance Data
      const perfRes = await fetch('/api/v1/manager/performance');
      let perfMembers: TeamMember[] = [];
      if (perfRes.ok) {
        const perfData = await perfRes.json();
        perfMembers = perfData.members || [];
      }

      // Fetch Latest Added Team Members from Database (/api/v1/manager/team)
      const teamRes = await fetch('/api/v1/manager/team');
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        const dbTeam = teamData.team || teamData.teamMembers || [];

        // Merge DB added team members into performance view dynamically
        const mergedMembers: TeamMember[] = dbTeam.map((m: any) => {
          const existing = perfMembers.find((p) => p.name.toLowerCase() === m.name.toLowerCase());
          if (existing) return existing;

          // Default fallback metrics for newly added team member
          const taskScore = m.perf || 85;
          return {
            id: m.id || m._id,
            name: m.name,
            role: m.role || 'Software Engineer',
            dept: m.dept || 'Engineering',
            avatar: m.avatar || m.name.substring(0, 2).toUpperCase(),
            taskComp: taskScore,
            attendance: 95,
            onTime: 90,
            rating: taskScore >= 90 ? 'Excellent' : taskScore >= 80 ? 'Good' : 'Average',
          };
        });

        setMembers(mergedMembers.length > 0 ? mergedMembers : perfMembers);
      } else {
        setMembers(perfMembers);
      }
    } catch (err) {
      console.error('Failed to load performance metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  // Filter Logic
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.role && m.role.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRating = ratingFilter === 'all' ? true : m.rating === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [members, searchQuery, ratingFilter]);

  // Dynamic Overall Metrics
  const totalAvg =
    members.length > 0
      ? Math.round(
          members.reduce((acc, m) => acc + (m.taskComp + m.attendance + m.onTime) / 3, 0) /
            members.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell
      title="Performance Analytics"
      subtitle="Track, analyze, and review your team's quarterly performance."
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TEAM AVERAGE
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-[#0D1222]">{totalAvg}%</p>
          <p className="mt-1 text-xs text-slate-400">Overall score across {members.length} members</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TOP PERFORMERS
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-[#0D1222]">
            {members.filter((m) => m.rating === 'Excellent').length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Members with Excellent rating</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TASK COMPLETION
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-black text-[#0D1222]">
            {members.length > 0
              ? Math.round(members.reduce((a, m) => a + m.taskComp, 0) / members.length)
              : 0}
            %
          </p>
          <p className="mt-1 text-xs text-slate-400">Average team task completion rate</p>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search team member or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {['all', 'Excellent', 'Good', 'Average'].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                ratingFilter === r
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              DATABASE TEAM METRICS
            </span>
            <h2 className="text-base font-bold text-[#0D1222]">Team Performance Review</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {filteredMembers.length} Members listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {['Member', 'Task Completion', 'Attendance', 'On-time Delivery', 'Rating'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m) => (
                  <tr key={m.name} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-blue-600 shadow-sm">
                          {m.avatar || m.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D1222] text-xs">{m.name}</p>
                          <p className="text-[11px] text-slate-400">{m.role || 'Software Engineer'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-blue-600" style={{ width: `${m.taskComp}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{m.taskComp}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${m.attendance}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{m.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${m.onTime}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{m.onTime}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border ${
                          ratingColor[m.rating] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {m.rating}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs font-semibold text-slate-400">
                    No team performance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerPageShell>
  );
}