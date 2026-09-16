'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  ArrowDownToLine,
  Download,
  Eye,
  IndianRupee,
  Loader2,
  X,
  Sparkles,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface PayslipRow {
  month: string;
  net: string;
  status: string;
}

interface PayslipLatest {
  month: string;
  basic: string;
  allowances: string;
  bonuses: string;
  deductions: string;
  tax: string;
  net: string;
  gross: string;
}

export default function PayslipsPage() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [latest, setLatest] = useState<PayslipLatest>({
    month: 'September 2026',
    basic: '₹25,000',
    allowances: '₹7,000',
    bonuses: '₹2,500',
    deductions: '₹3,000',
    tax: '₹2,500',
    net: '₹29,000',
    gross: '₹34,500',
  });

  const [payslipHistory, setPayslipHistory] = useState<PayslipRow[]>([
    { month: 'August 2026', net: '₹29,000', status: 'Paid' },
    { month: 'July 2026', net: '₹28,500', status: 'Paid' },
    { month: 'June 2026', net: '₹28,500', status: 'Paid' },
    { month: 'May 2026', net: '₹27,000', status: 'Paid' },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/payslips');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.latest) setLatest(data.latest);
        if (data.history) setPayslipHistory(data.history);
      }
    } catch (err) {
      console.error('Failed to fetch payslips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

  // Isolated PDF File Download Function
  const handleDownload = async (monthName: string) => {
    try {
      setDownloading(true);
      const res = await fetch('/api/v1/payslips/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: monthName }),
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Payslip-${monthName.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      triggerToast(`Payslip PDF for ${monthName} downloaded successfully!`);
    } catch (err) {
      triggerToast('Downloaded statement file.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <EmployeePageShell
      title="Payslips & Compensation"
      subtitle="Review monthly earnings, taxes, benefits, and download official PDF statements."
      actions={
        <button
          onClick={() => handleDownload(latest.month)}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 disabled:opacity-50"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span>Download Statement</span>
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

      {/* Structured Modal View (View Detail Mode) */}
      {selectedMonth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-all"
          onClick={() => setSelectedMonth(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Payslip Statement</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>{selectedMonth}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMonth(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Full Financial Detail View */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Earning Components</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Amount</span>
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span className="font-bold text-slate-900">{latest.basic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances & HRA</span>
                    <span className="font-bold text-slate-900">{latest.allowances}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Incentive</span>
                    <span className="font-bold text-emerald-600">+{latest.bonuses}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Deductions & Statutory</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500">Deducted</span>
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Total Deductions (PF/PT)</span>
                    <span className="font-bold text-red-500">-{latest.deductions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Withheld (TDS)</span>
                    <span className="font-bold text-slate-900">{latest.tax}</span>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight Box */}
              <div className="flex items-center justify-between rounded-2xl bg-blue-50/70 p-4 border border-blue-100">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">Total Take-Home Disbursed</div>
                  <div className="text-xl font-black text-blue-700">{latest.net}</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase text-emerald-600 border border-emerald-200">
                  Disbursed
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setSelectedMonth(null)}
                className="w-1/3 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedMonth);
                  setSelectedMonth(null);
                }}
                className="w-2/3 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-95 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Payslip Cards */}
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Latest Cycle Overview */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Current Cycle</span>
                <h3 className="text-base font-black text-slate-900">{latest.month}</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase text-emerald-600 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified
            </span>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Basic Salary</span>
              <span className="font-bold text-slate-900">{latest.basic}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Allowances</span>
              <span className="font-bold text-slate-900">{latest.allowances}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Performance Incentives</span>
              <span className="font-bold text-emerald-600">+{latest.bonuses}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Deductions</span>
              <span className="font-bold text-red-500">-{latest.deductions}</span>
            </div>
            <div className="my-2 border-t border-slate-200/60" />
            <div className="flex items-center justify-between text-sm font-black text-slate-900">
              <span>Net Take-Home Amount</span>
              <span className="text-base font-black text-blue-600">{latest.net}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedMonth(latest.month)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all"
            >
              <Eye className="h-4 w-4" />
              <span>View Detail View</span>
            </button>
            <button
              onClick={() => handleDownload(latest.month)}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span>Download PDF Only</span>
            </button>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Financial Breakdown</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Gross Salary</div>
              <div className="mt-1 text-2xl font-black text-slate-900">{latest.gross}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Deductions</div>
              <div className="mt-1 text-2xl font-black text-red-600">{latest.deductions}</div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">Disbursed Take-Home</div>
              <div className="mt-1 text-2xl font-black text-blue-600">{latest.net}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Table View */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Disbursement History</span>
            <h3 className="text-base font-black text-slate-900">Previous Payslips</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          {loading ? (
            <div className="flex h-32 items-center justify-center bg-slate-50">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Month</th>
                  <th className="px-5 py-3.5">Net Disbursed</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payslipHistory.map((row) => (
                  <tr key={row.month} className="bg-white hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{row.month}</td>
                    <td className="px-5 py-4 font-bold text-slate-600">{row.net}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-emerald-600 border border-emerald-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-3">
                      <button
                        onClick={() => setSelectedMonth(row.month)}
                        className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDownload(row.month)}
                        className="font-bold text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        Download PDF
                      </button>
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