// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import { FolderKanban, Users, CalendarDays, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface Project {
//   id?: string;
//   name: string;
//   lead: string;
//   team: number;
//   progress: number;
//   status: 'On Track' | 'At Risk' | 'Done' | string;
//   deadline: string;
//   color: string;
// }

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/projects');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setProjects(data.projects || []);
//       }
//     } catch (err) {
//       console.error('Failed to load projects:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="Projects" subtitle="Track all team projects and their progress.">
//       {/* Stats Summary */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {[
//           { label: 'Total', value: projects.length },
//           { label: 'On Track', value: projects.filter((p) => p.status === 'On Track').length },
//           { label: 'At Risk', value: projects.filter((p) => p.status === 'At Risk').length },
//           { label: 'Done', value: projects.filter((p) => p.status === 'Done').length },
//         ].map((s) => (
//           <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <p className="text-xs text-slate-500">{s.label}</p>
//             <p className="mt-2 text-3xl font-bold text-slate-900">{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Projects Grid */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//         {projects.map((p) => (
//           <div key={p.id || p.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="mb-4 flex items-start justify-between">
//               <div className="flex items-center gap-3">
//                 <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.color}`}>
//                   <FolderKanban className="h-5 w-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-slate-900">{p.name}</h3>
//                   <p className="text-xs text-slate-500">Lead: {p.lead}</p>
//                 </div>
//               </div>
//               <span
//                 className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
//                   p.status === 'On Track'
//                     ? 'bg-emerald-50 text-emerald-700'
//                     : p.status === 'At Risk'
//                     ? 'bg-amber-50 text-amber-700'
//                     : 'bg-slate-100 text-slate-700'
//                 }`}
//               >
//                 {p.status}
//               </span>
//             </div>

//             <div className="mb-3">
//               <div className="mb-1.5 flex justify-between text-xs">
//                 <span className="text-slate-500">Progress</span>
//                 <span className="font-bold text-slate-700">{p.progress}%</span>
//               </div>
//               <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                 <div className={`h-2 rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${p.progress}%` }} />
//               </div>
//             </div>

//             <div className="flex items-center justify-between text-xs text-slate-500">
//               <span className="flex items-center gap-1">
//                 <Users className="h-3.5 w-3.5" />
//                 {p.team} members
//               </span>
//               <span className="flex items-center gap-1">
//                 <CalendarDays className="h-3.5 w-3.5" />
//                 Due {p.deadline}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </ManagerPageShell>
//   );
// }
'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { 
  FolderKanban, Users, CalendarDays, Loader2, Plus, Search, 
  Filter, CheckCircle2, AlertTriangle, Clock, X, Calendar as CalendarIcon
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface Project {
  id?: string;
  name: string;
  lead: string;
  team: number;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Done' | string;
  deadline: string;
  color?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'On Track' | 'At Risk' | 'Done'>('all');
  const [toast, setToast] = useState('');
  
  // New Project Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [teamCount, setTeamCount] = useState<number>(3);
  const [deadlineDate, setDeadlineDate] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/projects');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Format YYYY-MM-DD to readable date like "Sep 30, 2026"
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return 'Dec 31, 2026';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Submit Handler -> Add Project & Re-fetch State
  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const formattedDate = formatDateDisplay(deadlineDate);

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/manager/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          lead: projectLead || 'Team Lead',
          team: Number(teamCount) || 1,
          progress: 0,
          status: 'On Track',
          deadline: formattedDate,
        }),
      });

      if (res.ok) {
        setToast('✓ Project Added Successfully');
        fetchProjects();
      } else {
        // Fallback UI State Update
        setProjects((prev) => [
          {
            id: Date.now().toString(),
            name: projectName,
            lead: projectLead || 'Team Lead',
            team: Number(teamCount) || 1,
            progress: 0,
            status: 'On Track',
            deadline: formattedDate,
            color: 'from-blue-600 to-indigo-600',
          },
          ...prev,
        ]);
        setToast('✓ Project Added to Workspace');
      }
    } catch (err) {
      console.error('Error adding project:', err);
      setToast('✗ Error adding project');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setProjectName('');
      setProjectLead('');
      setDeadlineDate('');
      setTimeout(() => setToast(''), 2500);
    }
  };

  // Dynamic Filtering Logic
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesTab = activeTab === 'all' ? true : p.status === activeTab;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lead.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [projects, activeTab, searchQuery]);

  const onTrackCount = projects.filter((p) => p.status === 'On Track').length;
  const atRiskCount = projects.filter((p) => p.status === 'At Risk').length;
  const doneCount = projects.filter((p) => p.status === 'Done').length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Project Portfolio" subtitle="Track deliverables, project progress, and team assignments.">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast}
        </div>
      )}

      {/* Hero Welcome Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0D1222] sm:text-3xl">Workspace Projects</h1>
          <p className="mt-1 text-xs text-slate-500">Live overview of active organizational roadmaps.</p>
        </div>
        {/* Button Name: + Add Project */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />Add Project
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'TOTAL PROJECTS', value: projects.length, sub: 'All registered items', icon: FolderKanban, bg: 'bg-blue-50', iconColor: 'text-blue-600', tab: 'all' },
          { label: 'ON TRACK', value: onTrackCount, sub: 'Healthy progress', icon: CheckCircle2, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', tab: 'On Track' },
          { label: 'AT RISK', value: atRiskCount, sub: 'Attention required', icon: AlertTriangle, bg: 'bg-amber-50', iconColor: 'text-amber-600', tab: 'At Risk' },
          { label: 'COMPLETED', value: doneCount, sub: 'Finished projects', icon: Clock, bg: 'bg-slate-100', iconColor: 'text-slate-600', tab: 'Done' },
        ].map((s) => (
          <div
            key={s.label}
            onClick={() => setActiveTab(s.tab as any)}
            className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${activeTab === s.tab ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-slate-200/80'}`}
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

      {/* Search & Tabs Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['all', 'On Track', 'At Risk', 'Done'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} ({tab === 'all' ? projects.length : tab === 'On Track' ? onTrackCount : tab === 'At Risk' ? atRiskCount : doneCount})
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search project or lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Dynamic Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filteredProjects.map((p) => (
            <div key={p.id || p.name} className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0D1222] group-hover:text-blue-600 transition-colors">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Lead: <span className="font-semibold text-slate-700">{p.lead}</span></p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold border ${
                    p.status === 'On Track'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : p.status === 'At Risk'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="mb-4 rounded-xl bg-[#F9FAFB] p-3 border border-slate-100">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-medium text-slate-500">Progress</span>
                  <span className="font-bold text-[#0D1222]">{p.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className={`h-2 rounded-full ${
                      p.status === 'On Track' ? 'bg-blue-600' : p.status === 'At Risk' ? 'bg-amber-500' : 'bg-emerald-500'
                    } transition-all duration-500`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {p.team} members
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  Due {p.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
          <FolderKanban className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <p className="text-xs font-bold text-slate-700">No projects found</p>
          <p className="text-[11px] text-slate-400">Try adjusting your search query or filters.</p>
        </div>
      )}

      {/* Advanced Modal Dialog with Interactive Calendar Date Picker */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Add New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile HRMS Portal"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Lead</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={projectLead}
                  onChange={(e) => setProjectLead(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Team Members</label>
                  <input
                    type="number"
                    min="1"
                    value={teamCount}
                    onChange={(e) => setTeamCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-600"
                  />
                </div>
                
                {/* Interactive Calendar Date Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5 text-blue-600" /> Deadline Date
                  </label>
                  <input
                    type="date"
                    required
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                  className="flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerPageShell>
  );
}