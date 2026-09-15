'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { ArrowDownToLine, Download, Eye, IndianRupee, Loader2, X } from 'lucide-react';
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
  const [payslipHistory, setPayslipHistory] = useState<PayslipRow[]>([]);

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
      console.error('Failed to load payslips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslips();
  }, []);

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
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip-${monthName.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download payslip. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <EmployeePageShell
      title="Payslips"
      subtitle="Review payslips, deductions, and your monthly salary summary."
      actions={
        <button
          onClick={() => handleDownload(latest.month)}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-full bg-[#3B6DF5] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(59,109,245,0.25)] hover:bg-[#2F5FE7] disabled:opacity-50"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </button>
      }
    >
      {/* Modal Preview */}
      {selectedMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setSelectedMonth(null)}>
          <div className="w-full max-w-md rounded-[22px] border border-[#E7ECF5] bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E7ECF5] pb-3 mb-4">
              <h3 className="text-[16px] font-bold text-[#1E2A45]">Payslip Details - {selectedMonth}</h3>
              <button onClick={() => setSelectedMonth(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-[13px] text-[#53627F]">
              <div className="flex justify-between"><span>Basic Salary</span><span className="font-semibold text-[#1E2A45]">{latest.basic}</span></div>
              <div className="flex justify-between"><span>Allowances</span><span className="font-semibold text-[#1E2A45]">{latest.allowances}</span></div>
              <div className="flex justify-between"><span>Deductions</span><span className="font-semibold text-[#1E2A45]">{latest.deductions}</span></div>
              <div className="border-t border-[#E7ECF5] pt-2 flex justify-between font-bold text-[#1E2A45]"><span>Net Salary</span><span>{latest.net}</span></div>
            </div>
            <button
              onClick={() => { handleDownload(selectedMonth); setSelectedMonth(null); }}
              className="mt-6 w-full rounded-full bg-[#3B6DF5] py-2.5 text-[12px] font-semibold text-white hover:bg-[#2F5FE7]"
            >
              Download PDF Statement
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Latest Salary Card */}
        <div className="rounded-[22px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Latest</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">{latest.month}</h3>
            </div>
          </div>

          <div className="space-y-3 rounded-[18px] bg-[#F8FAFF] p-4">
            <div className="flex items-center justify-between text-[13px] text-[#53627F]">
              <span>Basic salary</span>
              <span className="font-semibold text-[#1E2A45]">{latest.basic}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-[#53627F]">
              <span>Allowances</span>
              <span className="font-semibold text-[#1E2A45]">{latest.allowances}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-[#53627F]">
              <span>Bonuses</span>
              <span className="font-semibold text-[#1E2A45]">{latest.bonuses}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-[#53627F]">
              <span>Deductions</span>
              <span className="font-semibold text-[#1E2A45]">{latest.deductions}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-[#53627F]">
              <span>Tax</span>
              <span className="font-semibold text-[#1E2A45]">{latest.tax}</span>
            </div>
            <div className="my-2 border-t border-[#E7ECF5]" />
            <div className="flex items-center justify-between text-[14px] font-bold text-[#1E2A45]">
              <span>Net salary</span>
              <span>{latest.net}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedMonth(latest.month)}
              className="inline-flex items-center gap-2 rounded-full bg-[#3B6DF5] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#2F5FE7]"
            >
              <Eye className="h-4 w-4" />
              View payslip
            </button>
            <button
              onClick={() => handleDownload(latest.month)}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full border border-[#E7ECF5] bg-white px-4 py-2 text-[12px] font-semibold text-[#1E2A45] hover:bg-[#F3F7FF] disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        {/* Breakdown Overview */}
        <div className="rounded-[22px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
          <div className="mb-4 text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Breakdown</div>
          <div className="space-y-3">
            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="text-[12px] text-[#7581A3]">Gross salary</div>
              <div className="mt-1 text-[22px] font-extrabold text-[#1E2A45]">{latest.gross}</div>
            </div>
            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="text-[12px] text-[#7581A3]">Total deductions</div>
              <div className="mt-1 text-[22px] font-extrabold text-[#1E2A45]">{latest.deductions}</div>
            </div>
            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="text-[12px] text-[#7581A3]">Take-home</div>
              <div className="mt-1 text-[22px] font-extrabold text-[#1E2A45]">{latest.net}</div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.09em] text-[#7581A3]">History</div>
            <h3 className="mt-1 text-[18px] font-bold text-[#1E2A45]">Previous payslips</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-[16px] border border-[#E7ECF5]">
          {loading ? (
            <div className="flex h-28 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#3B6DF5]" />
            </div>
          ) : (
            <table className="min-w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFF] text-[#7581A3]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Month</th>
                  <th className="px-4 py-3 font-semibold">Net salary</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payslipHistory.map((row) => (
                  <tr key={row.month} className="border-t border-[#E7ECF5] bg-white">
                    <td className="px-4 py-3 text-[#1E2A45] font-medium">{row.month}</td>
                    <td className="px-4 py-3 text-[#53627F]">{row.net}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#1DAA6E]">{row.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedMonth(row.month)} className="text-[#3B6DF5] font-semibold hover:underline">
                        View
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