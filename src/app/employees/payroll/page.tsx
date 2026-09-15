// 'use client';

// import EmployeePageShell from '@/components/employee/EmployeePageShell';
// import { Download, CreditCard, Loader2 } from 'lucide-react';
// import { useState, useEffect } from 'react';

// interface Payslip {
//   id: string;
//   month: string;
//   gross: string;
//   deductions: string;
//   net: string;
//   status: string;
//   date: string;
// }

// interface BreakdownItem {
//   label: string;
//   amount: string;
//   type: 'earning' | 'deduction';
// }

// interface Stats {
//   gross: string;
//   deductions: string;
//   net: string;
//   ytd: string;
// }

// export default function PayrollPage() {
//   const [loading, setLoading] = useState(true);
//   const [downloadingId, setDownloadingId] = useState<string | null>(null);
//   const [stats, setStats] = useState<Stats>({ gross: '₹85,000', deductions: '₹12,400', net: '₹72,600', ytd: '₹5.8L' });
//   const [payslips, setPayslips] = useState<Payslip[]>([]);
//   const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
//   const [currentMonth, setCurrentMonth] = useState('August 2026');

//   const fetchPayroll = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/payroll');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         setStats(data.stats || stats);
//         setPayslips(data.payslips || []);
//         setBreakdown(data.breakdown || []);
//         setCurrentMonth(data.currentMonth || 'August 2026');
//       }
//     } catch (err) {
//       console.error('Failed to load payroll:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayroll();
//   }, []);

//   const handleDownload = async (payslip: Payslip) => {
//     try {
//       setDownloadingId(payslip.month);
//       const res = await fetch('/api/v1/payroll/download', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ month: payslip.month }),
//       });

//       if (!res.ok) throw new Error('Download failed');

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `Payslip-${payslip.month.replace(/\s+/g, '-')}.txt`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (err) {
//       alert('Failed to download payslip. Please try again.');
//     } finally {
//       setDownloadingId(null);
//     }
//   };

//   return (
//     <EmployeePageShell title="Payroll" subtitle="View your salary details and download payslips.">
//       {/* Top Stats Cards */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {[
//           { label: 'Gross Salary',   value: stats.gross,      tone: 'blue' },
//           { label: 'Deductions',     value: stats.deductions, tone: 'rose' },
//           { label: 'Net Take Home',   value: stats.net,        tone: 'emerald' },
//           { label: 'YTD Earnings',   value: stats.ytd,        tone: 'violet' },
//         ].map(s => (
//           <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//             <p className="text-xs text-slate-500">{s.label}</p>
//             <p className={`mt-2 text-2xl font-bold ${s.tone === 'blue' ? 'text-blue-600' : s.tone === 'rose' ? 'text-rose-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-violet-600'}`}>{s.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
//         {/* Payslip History Table */}
//         <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-100 px-5 py-4">
//             <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">History</p>
//             <h2 className="mt-0.5 text-lg font-bold text-slate-900">Payslip History</h2>
//           </div>
          
//           {loading ? (
//             <div className="flex h-40 items-center justify-center">
//               <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-100 text-sm">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     {['Month', 'Gross', 'Deductions', 'Net Pay', 'Status', ''].map(h => (
//                       <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 bg-white">
//                   {payslips.map(p => (
//                     <tr key={p.month} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-3 font-semibold text-slate-900">{p.month}</td>
//                       <td className="px-4 py-3 text-slate-600">{p.gross}</td>
//                       <td className="px-4 py-3 text-rose-600">{p.deductions}</td>
//                       <td className="px-4 py-3 font-bold text-emerald-700">{p.net}</td>
//                       <td className="px-4 py-3">
//                         <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">{p.status}</span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => handleDownload(p)}
//                           disabled={downloadingId === p.month}
//                           className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
//                         >
//                           {downloadingId === p.month ? (
//                             <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                           ) : (
//                             <Download className="h-3.5 w-3.5" />
//                           )}
//                           PDF
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Salary Breakdown Card */}
//         <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center gap-2">
//             <CreditCard className="h-5 w-5 text-blue-600" />
//             <div>
//               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{currentMonth}</p>
//               <h3 className="text-base font-bold text-slate-900">Salary Breakdown</h3>
//             </div>
//           </div>
//           <div className="space-y-2.5">
//             {breakdown.map(b => (
//               <div key={b.label} className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${b.type === 'earning' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
//                 <span className="text-sm text-slate-700">{b.label}</span>
//                 <span className={`font-bold ${b.type === 'earning' ? 'text-emerald-700' : 'text-rose-700'}`}>{b.amount}</span>
//               </div>
//             ))}
//             <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-3 mt-3">
//               <span className="font-bold text-blue-800">Net Take Home</span>
//               <span className="text-lg font-extrabold text-blue-700">{stats.net}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </EmployeePageShell>
//   );
// }

'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { CreditCard, Download, FileText, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function EmployeePayrollPage() {
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState<any>({
    salary: '₹65,000',
    month: 'August 2026',
    status: 'Paid',
    breakdown: [
      { label: 'Basic Salary', amount: '₹40,000' },
      { label: 'HRA', amount: '₹15,000' },
      { label: 'Special Allowance', amount: '₹10,000' },
    ],
    deductions: [
      { label: 'PF', amount: '₹1,800' },
      { label: 'Professional Tax', amount: '₹200' },
    ],
    netPay: '₹63,000',
  });

  const fetchPayroll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/payroll');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.payroll) {
          setPayrollData(data.payroll);
        }
      }
    } catch (err) {
      console.error('Failed to load payroll data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const handleDownloadPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <EmployeePageShell title="My Payroll" subtitle="View and download your monthly payslips.">
      <div className="space-y-6">
        {/* Header Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Month</p>
                <h2 className="text-xl font-bold text-slate-900">{payrollData.month}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {payrollData.status}
              </span>
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Earnings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-900">Earnings</h3>
            <div className="space-y-3">
              {payrollData.breakdown?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-900">Deductions</h3>
            <div className="space-y-3">
              {payrollData.deductions?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between rounded-xl bg-rose-50/50 p-3 text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-bold text-rose-600">-{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Net Take Home */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Net Take Home</p>
              <p className="text-2xl font-extrabold text-emerald-900">{payrollData.netPay}</p>
            </div>
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>
    </EmployeePageShell>
  );
}