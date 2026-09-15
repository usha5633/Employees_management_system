'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { CalendarCheck2, FileText, Plus, Search, Upload, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface LeaveRequest {
  id?: string;
  type: string;
  start: string;
  end: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  tone: 'warning' | 'success' | 'danger';
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

  // Form states
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Leave Data from Backend
  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/leaves');
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

  // Handle Form Submission (FormData for File Upload)
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setError('Please select both Start Date and End Date.');
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
        body: formData, // Browser sets multipart/form-data boundary automatically
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (${res.status}). Check API Route path.`);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit leave request');
      }

      // Reset form & Refresh Table
      setReason('');
      setStartDate('');
      setEndDate('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchLeaveData();
    } catch (err: any) {
      setError(err.message || 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeePageShell
      title="Leave Management"
      subtitle="Apply for leave and track your requests in one place."
      actions={
        <button
          onClick={() => {
            const formElement = document.getElementById('apply-leave-section');
            formElement?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#3B6DF5] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(59,109,245,0.25)] hover:bg-[#2F5FE7]"
        >
          <Plus className="h-4 w-4" />
          Apply Leave
        </button>
      }
    >
      {/* Leave Balances Grid */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(balances.length > 0
          ? balances
          : [
              { label: 'Casual leave', value: '8', tone: 'blue' },
              { label: 'Sick leave', value: '5', tone: 'green' },
              { label: 'Paid leave', value: '12', tone: 'purple' },
              { label: 'Unpaid leave', value: '2', tone: 'orange' },
            ]
        ).map(({ label, value, tone }) => (
          <div key={label} className="rounded-[18px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_24px_rgba(35,65,140,0.04)]">
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] ${
                tone === 'blue'
                  ? 'bg-[#EAF0FF] text-[#3B6DF5]'
                  : tone === 'green'
                  ? 'bg-[#EAF7EE] text-[#1DAA6E]'
                  : tone === 'purple'
                  ? 'bg-[#F0EBFF] text-[#7B5AF0]'
                  : 'bg-[#FFF3E7] text-[#D68A28]'
              }`}
            >
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div className="text-[12px] text-[#7581A3]">{label}</div>
            <div className="mt-2 text-[24px] font-extrabold text-[#1E2A45]">{value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Apply Form & Overview */}
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div id="apply-leave-section" className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Request</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">Apply leave</h3>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-[12px] bg-[#FDE8EC] p-3 text-[12px] font-semibold text-[#F1526D]">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Leave type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Paid Leave</option>
                <option>Unpaid Leave</option>
                <option>Work From Home</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
                placeholder="Family function"
              />
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              />
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">End date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              />
            </div>
          </div>

          {/* Supporting Document File Input */}
          <div className="mt-4">
            <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Supporting document</label>
            <div className="flex items-center justify-between rounded-[12px] border border-dashed border-[#C9D8FF] bg-[#F7F9FF] px-3 py-3 text-[13px] text-[#53627F]">
              <span className="inline-flex items-center gap-2 truncate max-w-[220px]">
                <Upload className="h-4 w-4 shrink-0 text-[#3B6DF5]" />
                {file ? <span className="font-medium text-[#1E2A45]">{file.name}</span> : 'Upload document'}
              </span>
              <div className="flex items-center gap-2">
                {file && (
                  <button
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <label className="cursor-pointer rounded-full bg-[#EAF0FF] px-3 py-1.5 text-[11px] font-bold text-[#3B6DF5] hover:bg-[#D8E4FF]">
                  Choose file
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

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#3B6DF5] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_10px_20px_rgba(59,109,245,0.22)] hover:bg-[#2F5FE7] disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </div>

        {/* Leave Overview Summary */}
        <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Summary</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">Leave overview</h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="text-[12px] text-[#7581A3]">Pending requests</div>
              <div className="mt-1 text-[22px] font-extrabold text-[#1E2A45]">
                {String(summary.pending).padStart(2, '0')}
              </div>
            </div>
            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="text-[12px] text-[#7581A3]">Approved</div>
              <div className="mt-1 text-[22px] font-extrabold text-[#1E2A45]">
                {String(summary.approved).padStart(2, '0')}
              </div>
            </div>
            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="text-[12px] text-[#7581A3]">Rejected</div>
              <div className="mt-1 text-[22px] font-extrabold text-[#1E2A45]">
                {String(summary.rejected).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request History Table */}
      <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#7581A3]">Requests</div>
            <h3 className="mt-1 text-[18px] font-bold text-[#1E2A45]">Leave request history</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-[#E7ECF5]">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#3B6DF5]" />
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#7581A3]">No leave requests found.</div>
          ) : (
            <table className="min-w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFF] text-[#7581A3]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Start date</th>
                  <th className="px-4 py-3 font-semibold">End date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request, index) => (
                  <tr key={request.id || index} className="border-t border-[#E7ECF5] bg-white">
                    <td className="px-4 py-3 font-medium text-[#1E2A45]">{request.type}</td>
                    <td className="px-4 py-3 text-[#53627F]">{request.start}</td>
                    <td className="px-4 py-3 text-[#53627F]">{request.end}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          request.tone === 'success'
                            ? 'bg-[#EAF7EE] text-[#1DAA6E]'
                            : request.tone === 'warning'
                            ? 'bg-[#FFF3D8] text-[#C98900]'
                            : 'bg-[#FDE8EC] text-[#F1526D]'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#3B6DF5]">Cancel</td>
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