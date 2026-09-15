'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { Download, CreditCard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Payslip {
  id: string;
  month: string;
  gross: string;
  deductions: string;
  net: string;
  status: string;
  date: string;
}

interface BreakdownItem {
  label: string;
  amount: string;
  type: 'earning' | 'deduction';
}

interface Stats {
  gross: string;
  deductions: string;
  net: string;
  ytd: string;
}

export default function PayrollPage() {
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ gross: '₹85,000', deductions: '₹12,400', net: '₹72,600', ytd: '₹5.8L' });
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState('August 2026');

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/payroll');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setStats(data.stats || stats);
        setPayslips(data.payslips || []);
        setBreakdown(data.breakdown || []);
        setCurrentMonth(data.currentMonth || 'August 2026');
      }
    } catch (err) {
      console.error('Failed to load payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleDownload = async (payslip: Payslip) => {
    try {
      setDownloadingId(payslip.month);
      const res = await fetch('/api/v1/payroll/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: payslip.month }),
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip-${payslip.month.replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Failed to download payslip. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <EmployeePageShell title="Payroll" subtitle="View your salary details and download payslips.">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Gross Salary',   value: stats.gross,      tone: 'blue' },
          { label: 'Deductions',     value: stats.deductions, tone: 'rose' },
          { label: 'Net Take Home',   value: stats.net,        tone: 'emerald' },
          { label: 'YTD Earnings',   value: stats.ytd,        tone: 'violet' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-2xl font-bold ${s.tone === 'blue' ? 'text-blue-600' : s.tone === 'rose' ? 'text-rose-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-violet-600'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Payslip History Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">History</p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">Payslip History</h2>
          </div>
          
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Month', 'Gross', 'Deductions', 'Net Pay', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payslips.map(p => (
                    <tr key={p.month} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-slate-900">{p.month}</td>
                      <td className="px-4 py-3 text-slate-600">{p.gross}</td>
                      <td className="px-4 py-3 text-rose-600">{p.deductions}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">{p.net}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{p.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDownload(p)}
                          disabled={downloadingId === p.month}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {downloadingId === p.month ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Salary Breakdown Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{currentMonth}</p>
              <h3 className="text-base font-bold text-slate-900">Salary Breakdown</h3>
            </div>
          </div>
          <div className="space-y-2.5">
            {breakdown.map(b => (
              <div key={b.label} className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${b.type === 'earning' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                <span className="text-sm text-slate-700">{b.label}</span>
                <span className={`font-bold ${b.type === 'earning' ? 'text-emerald-700' : 'text-rose-700'}`}>{b.amount}</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-3 mt-3">
              <span className="font-bold text-blue-800">Net Take Home</span>
              <span className="text-lg font-extrabold text-blue-700">{stats.net}</span>
            </div>
          </div>
        </div>
      </div>
    </EmployeePageShell>
  );
}