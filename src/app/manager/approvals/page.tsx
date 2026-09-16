// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import { AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface ApprovalItem {
//   id: string | number;
//   name: string;
//   avatar: string;
//   color: string;
//   type: string;
//   desc: string;
//   urgency: 'high' | 'medium' | 'low';
//   status: 'pending' | 'approved' | 'rejected';
// }

// export default function ApprovalsPage() {
//   const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchApprovals = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/approvals');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setApprovals(data.approvals || []);
//       }
//     } catch (err) {
//       console.error('Failed to load approvals:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApprovals();
//   }, []);

//   const handle = async (id: string | number, action: 'approved' | 'rejected') => {
//     setApprovals((prev) =>
//       prev.map((a) => (a.id === id ? { ...a, status: action } : a))
//     );

//     try {
//       await fetch('/api/v1/manager/approvals', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id, status: action }),
//       });
//     } catch (err) {
//       console.error('Failed to update approval status:', err);
//       fetchApprovals();
//     }
//   };

//   const pending = approvals.filter((a) => a.status === 'pending');
//   const resolved = approvals.filter((a) => a.status !== 'pending');

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="Approvals" subtitle="Review and action pending team requests.">
//       <div className="grid grid-cols-3 gap-4">
//         {[
//           { label: 'Pending', value: pending.length, tone: 'amber' },
//           { label: 'Approved', value: approvals.filter((a) => a.status === 'approved').length, tone: 'emerald' },
//           { label: 'Rejected', value: approvals.filter((a) => a.status === 'rejected').length, tone: 'rose' },
//         ].map((s) => (
//           <div key={s.label} className={`rounded-2xl border p-4 shadow-sm ${s.tone === 'amber' ? 'border-amber-100 bg-amber-50' : s.tone === 'emerald' ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
//             <p className={`text-xs font-semibold ${s.tone === 'amber' ? 'text-amber-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>{s.label}</p>
//             <p className={`mt-1 text-3xl font-bold ${s.tone === 'amber' ? 'text-amber-700' : s.tone === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {pending.length > 0 && (
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Pending</p>
//           <div className="space-y-3">
//             {pending.map((a) => (
//               <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
//                 <div className="flex items-center gap-3">
//                   <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${a.color}`}>{a.avatar}</div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <p className="text-sm font-semibold text-slate-900">{a.name}</p>
//                       <AlertCircle className={`h-3.5 w-3.5 ${a.urgency === 'high' ? 'text-rose-500' : a.urgency === 'medium' ? 'text-amber-500' : 'text-slate-400'}`} />
//                     </div>
//                     <p className="text-xs text-slate-500">{a.type} · {a.desc}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button onClick={() => handle(a.id, 'approved')} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
//                     <CheckCircle2 className="h-3.5 w-3.5" /> Approve
//                   </button>
//                   <button onClick={() => handle(a.id, 'rejected')} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
//                     <XCircle className="h-3.5 w-3.5" /> Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {resolved.length > 0 && (
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">Resolved</p>
//           <div className="space-y-3">
//             {resolved.map((a) => (
//               <div key={a.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 opacity-70">
//                 <div className="flex items-center gap-3">
//                   <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${a.color}`}>{a.avatar}</div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-700">{a.name}</p>
//                     <p className="text-xs text-slate-400">{a.type} · {a.desc}</p>
//                   </div>
//                 </div>
//                 <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${a.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
//                   {a.status === 'approved' ? 'Approved' : 'Rejected'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </ManagerPageShell>
//   );
// }

'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { 
  AlertCircle, CheckCircle2, XCircle, Loader2, Clock, Check, X, 
  Search, Filter, Eye, Calendar, User, FileText, Plus 
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface ApprovalItem {
  id: string | number;
  name: string;
  role?: string;
  avatar: string;
  type: string;
  desc: string;
  startDate?: string;
  endDate?: string;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic Filtering & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  
  // Request Detail Modal State
  const [selectedRequest, setSelectedRequest] = useState<ApprovalItem | null>(null);
  const [toast, setToast] = useState('');

  // Create Request Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empName, setEmpName] = useState('');
  const [reqType, setReqType] = useState('Casual Leave');
  const [reqDesc, setReqDesc] = useState('');
  const [reqUrgency, setReqUrgency] = useState<'high' | 'medium' | 'low'>('medium');

  // Fetch Approvals & Sync with Database
  const fetchApprovalsData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/approvals');
      let approvalItems: ApprovalItem[] = [];
      if (res.ok) {
        const data = await res.json();
        approvalItems = data.approvals || [];
      }

      const teamRes = await fetch('/api/v1/manager/team');
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        const dbTeam = teamData.team || teamData.teamMembers || [];

        const updatedList = [...approvalItems];
        dbTeam.forEach((member: any) => {
          const exists = updatedList.some((a) => a.name.toLowerCase() === member.name.toLowerCase());
          if (!exists && member.status === 'Onboarding') {
            updatedList.unshift({
              id: member.id || member._id,
              name: member.name,
              role: member.role || 'Software Engineer',
              avatar: member.avatar || member.name.substring(0, 2).toUpperCase(),
              type: 'New Member Onboarding',
              desc: `Approval required for adding ${member.name} to ${member.dept || 'Engineering'} team.`,
              urgency: 'medium',
              status: 'pending',
            });
          }
        });
        setApprovals(updatedList);
      } else {
        setApprovals(approvalItems);
      }
    } catch (err) {
      console.error('Failed to load approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalsData();
  }, []);

  // Handle Action (Approve / Reject)
  const handleAction = async (id: string | number, action: 'approved' | 'rejected') => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a))
    );
    
    setToast(action === 'approved' ? '✓ Request Approved Successfully' : '✗ Request Rejected');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: action } : null));
    }
    
    setTimeout(() => setToast(''), 2500);

    try {
      await fetch('/api/v1/manager/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action }),
      });
    } catch (err) {
      console.error('Failed to update approval status:', err);
      fetchApprovalsData();
    }
  };

  // Handle Form Submission for New Request Creation
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !reqDesc.trim()) return;

    const newRequest: ApprovalItem = {
      id: Date.now().toString(),
      name: empName.trim(),
      role: 'Software Engineer',
      avatar: empName.substring(0, 2).toUpperCase(),
      type: reqType,
      desc: reqDesc.trim(),
      urgency: reqUrgency,
      status: 'pending',
    };

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/manager/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });

      if (res.ok) {
        setToast('✓ Approval Request Created Successfully');
        fetchApprovalsData();
      } else {
        setApprovals((prev) => [newRequest, ...prev]);
        setToast('✓ Request Added to Pending Queue');
      }
    } catch (err) {
      console.error('Failed to create approval request:', err);
      setApprovals((prev) => [newRequest, ...prev]);
      setToast('✓ Request Added');
    } finally {
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setEmpName('');
      setReqDesc('');
      setReqUrgency('medium');
      setTimeout(() => setToast(''), 2500);
    }
  };

  // Filter Computation
  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      const matchesTab = activeTab === 'all' ? true : item.status === activeTab;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUrgency = urgencyFilter === 'all' ? true : item.urgency === urgencyFilter;
      return matchesTab && matchesSearch && matchesUrgency;
    });
  }, [approvals, activeTab, searchQuery, urgencyFilter]);

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Approvals Hub" subtitle="Real-time verification center for employee leave & work requests.">
      {/* Dynamic Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${toast.includes('✓') ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast}
        </div>
      )}

      {/* Hero Header Action Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0D1222] sm:text-3xl">
            Team Approvals
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Review, log, and process employee leave applications and operational requests.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Request
        </button>
      </div>

      {/* Metric Cards Header */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'ALL REQUESTS', value: approvals.length, sub: 'Total submissions', icon: FileText, bg: 'bg-blue-50', iconColor: 'text-blue-600', tab: 'all' },
          { label: 'PENDING', value: pendingCount, sub: 'Action required', icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-600', tab: 'pending' },
          { label: 'APPROVED', value: approvedCount, sub: 'Verified requests', icon: CheckCircle2, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', tab: 'approved' },
          { label: 'REJECTED', value: rejectedCount, sub: 'Declined requests', icon: XCircle, bg: 'bg-rose-50', iconColor: 'text-rose-600', tab: 'rejected' },
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

      {/* Filter Control Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} ({tab === 'all' ? approvals.length : tab === 'pending' ? pendingCount : tab === 'approved' ? approvedCount : rejectedCount})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee or request..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600"
          >
            <option value="all">All Urgency</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Employee Submissions Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#0D1222]">Database Employee Requests</h2>
          <span className="text-xs font-semibold text-slate-400">Showing {filteredApprovals.length} records</span>
        </div>

        {filteredApprovals.length > 0 ? (
          <div className="space-y-3">
            {filteredApprovals.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-[#F9FAFB] p-4 transition-all hover:border-slate-300 hover:bg-slate-100/40"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white bg-blue-600 shadow-sm">
                    {a.avatar || a.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#0D1222]">{a.name}</p>
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        a.urgency === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' : a.urgency === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <AlertCircle className="h-3 w-3" />
                        {a.urgency ? a.urgency.toUpperCase() : 'NORMAL'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{a.type} · {a.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedRequest(a)}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4 text-slate-400" /> View
                  </button>

                  {a.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAction(a.id, 'approved')}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(a.id, 'rejected')}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </>
                  ) : (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold border ${
                      a.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {a.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Clock className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-xs font-bold text-slate-700">No matching requests found</p>
          </div>
        )}
      </div>

      {/* CREATE NEW REQUEST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Create Approval Request</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Request Type</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Overtime Approval">Overtime Approval</option>
                  <option value="Expense Reimbursement">Expense Reimbursement</option>
                  <option value="Equipment Grant">Equipment Grant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
                <select
                  value={reqUrgency}
                  onChange={(e: any) => setReqUrgency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide reason for request..."
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL VERIFICATION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0D1222]">Employee Request Verification</h3>
              <button onClick={() => setSelectedRequest(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {selectedRequest.avatar || selectedRequest.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0D1222]">{selectedRequest.name}</h4>
                  <p className="text-xs text-slate-500">{selectedRequest.role || 'Employee'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Request Type</span>
                  <p className="font-bold text-[#0D1222] mt-0.5">{selectedRequest.type}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Urgency</span>
                  <p className="font-bold capitalize text-rose-600 mt-0.5">{selectedRequest.urgency}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Description / Notes</span>
                <p className="text-xs text-slate-700 mt-1">{selectedRequest.desc}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                {selectedRequest.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'rejected')}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'approved')}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Approve Request
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ManagerPageShell>
  );
}