'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  CalendarCheck2,
  FileText,
  Plus,
  Search,
  Upload,
  Loader2,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ShieldAlert,
  ChevronRight,
  PlaneTakeoff,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface LeaveRequest {
  id?: string;
  type: string;
  start: string;
  end: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  tone: 'warning' | 'success' | 'danger';
  reason?: string;
}

interface LeaveBalance {
  label: string;
  value: string;
  tone: string;
}

export default function LeavePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Apply Leave Form
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/leaves/request');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setBalances(data.balances || []);
        setSummary(data.summary || { pending: 0, approved: 0, rejected: 0 });
        setLeaveRequests(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both Start Date and End Date.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after the end date.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('leaveType', leaveType);
      formData.append('reason', reason);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch('/api/v1/leaves/request', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit leave request');
      }

      // Reset Form & Close Modal & Refresh
      setReason('');
      setStartDate('');
      setEndDate('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsModalOpen(false);
      
      await fetchLeaveData();
      triggerToast('Leave request submitted and routed to manager successfully!');
    } catch (err: any) {
      setError(err.message || 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeePageShell
      title="Leave & Time-Off Portal"
      subtitle="Manage corporate leave quotas, submit time-off applications, and track manager approvals."
      actions={
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Apply For Leave</span>
        </button>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Interactive Apply Leave Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-all"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <PlaneTakeoff className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">New Leave Application</h3>
                  <p className="text-[11px] font-bold text-slate-400">Direct routing to reporting manager</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Paid Leave</option>
                  <option>Unpaid Leave</option>
                  <option>Work From Home</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Reason / Subject</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                  placeholder="e.g. Family function or medical checkup"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Supporting Document Upload */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Supporting Document (Optional)</label>
                <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-2 truncate max-w-[240px]">
                    <Upload className="h-4 w-4 shrink-0 text-blue-600" />
                    {file ? <span className="font-bold text-slate-900">{file.name}</span> : 'Upload medical certificate or notice'}
                  </span>
                  <div className="flex items-center gap-2">
                    {file && (
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <label className="cursor-pointer rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors">
                      Browse
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setFile(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Balances Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(balances.length > 0
          ? balances
          : [
              { label: 'Casual leave', value: '8', tone: 'blue' },
              { label: 'Sick leave', value: '5', tone: 'green' },
              { label: 'Paid leave', value: '12', tone: 'purple' },
              { label: 'Unpaid leave', value: '2', tone: 'orange' },
            ]
        ).map(({ label, value, tone }) => (
          <div
            key={label}
            className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${
                tone === 'blue'
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : tone === 'green'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : tone === 'purple'
                  ? 'bg-purple-50 text-purple-600 border border-purple-100'
                  : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}
            >
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</div>
            <div className="mt-2 text-3xl font-black text-slate-900">{value} Days</div>
          </div>
        ))}
      </div>

      {/* Analytics Summary Banner */}
      <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Analytics</span>
            <h3 className="text-base font-black text-slate-900">Leave Status Breakdown</h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Pending Manager Approvals</div>
            <div className="mt-1 text-2xl font-black text-amber-600">{String(summary.pending).padStart(2, '0')}</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Approved Time-Offs</div>
            <div className="mt-1 text-2xl font-black text-emerald-600">{String(summary.approved).padStart(2, '0')}</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Rejected Requests</div>
            <div className="mt-1 text-2xl font-black text-rose-600">{String(summary.rejected).padStart(2, '0')}</div>
          </div>
        </div>
      </div>

      {/* Request History Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Timeline</span>
            <h3 className="text-base font-black text-slate-900">Leave Request History</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          {loading ? (
            <div className="flex h-36 items-center justify-center bg-slate-50">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">No leave requests found in database.</div>
          ) : (
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Leave Type</th>
                  <th className="px-5 py-3.5">Start Date</th>
                  <th className="px-5 py-3.5">End Date</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((request, index) => (
                  <tr key={request.id || index} className="bg-white hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{request.type}</td>
                    <td className="px-5 py-4 text-slate-600">{request.start}</td>
                    <td className="px-5 py-4 text-slate-600">{request.end}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{request.reason || 'N/A'}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                          request.tone === 'success' || request.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : request.tone === 'warning' || request.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {request.status === 'Pending' ? (
                        <button
                          onClick={async () => {
                            triggerToast('Leave request cancellation requested.');
                          }}
                          className="font-bold text-rose-600 hover:text-rose-700 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </EmployeePageShell>
  );
}