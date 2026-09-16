'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Building2,
  Eye,
  Calendar,
  Wallet,
  Receipt,
  PieChart,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Payslip {
  id: string;
  month: string;
  gross: string;
  deductions: string;
  net: string;
  status: string;
  disbursementDate: string;
  earnings: Array<{ label: string; amount: string }>;
  deductionsList: Array<{ label: string; amount: string }>;
}

interface Stats {
  gross: string;
  deductions: string;
  net: string;
  ytd: string;
}

export default function EmployeePayrollPage() {
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [stats, setStats] = useState<Stats>({
    gross: '₹85,000',
    deductions: '₹12,400',
    net: '₹72,600',
    ytd: '₹5,80,200',
  });
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPayroll = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/payroll');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.payslips && data.payslips.length > 0) {
          setPayslips(data.payslips);
          setSelectedPayslip(data.payslips[0]);
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

  // Client-Side PDF Generation & Download Function
  const generateAndDownloadPDF = (payslip: Payslip) => {
    try {
      setDownloadingId(payslip.month);
      const doc = new jsPDF();

      // 1. Executive Header Banner
      doc.setFillColor(30, 58, 138); // Dark Navy Blue
      doc.rect(0, 0, 210, 42, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('INFINITE CLOUD ENTERPRISE', 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL EMPLOYEE SALARY PAYSLIP STATEMENT', 14, 27);
      doc.text(`STATEMENT PERIOD: ${payslip.month.toUpperCase()}`, 14, 35);

      // 2. Employee & Disbursement Info
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('EMPLOYEE DETAILS:', 14, 52);

      doc.setFont('helvetica', 'normal');
      doc.text('Employee Name : Priya Sharma', 14, 59);
      doc.text('Designation    : Senior Full Stack Engineer', 14, 65);
      doc.text('Department     : Core Cloud Architecture', 14, 71);

      doc.setFont('helvetica', 'bold');
      doc.text('PAYMENT METRICS:', 120, 52);
      doc.setFont('helvetica', 'normal');
      doc.text(`Disbursement Date : ${payslip.disbursementDate}`, 120, 59);
      doc.text(`Payment Status    : ${payslip.status.toUpperCase()}`, 120, 65);
      doc.text('Mode of Transfer  : Direct Bank Transfer', 120, 71);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 77, 196, 77);

      // 3. Itemized Earnings Table
      const earningsRows = payslip.earnings ? payslip.earnings.map((e) => [e.label, e.amount]) : [];
      earningsRows.push(['Gross Earnings Total', payslip.gross]);

      autoTable(doc, {
        startY: 83,
        head: [['Itemized Earnings & Allowances', 'Amount']],
        body: earningsRows,
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        theme: 'grid',
      });

      // 4. Itemized Deductions Table
      const deductionsRows = payslip.deductionsList ? payslip.deductionsList.map((d) => [d.label, `- ${d.amount}`]) : [];
      deductionsRows.push(['Total Statutory Deductions', `- ${payslip.deductions}`]);

      const finalEarningsY = (doc as any).lastAutoTable.finalY || 130;

      autoTable(doc, {
        startY: finalEarningsY + 10,
        head: [['Statutory Deductions & Taxes', 'Deducted Amount']],
        body: deductionsRows,
        headStyles: {
          fillColor: [225, 29, 72],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: { fontSize: 9, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        theme: 'grid',
      });

      // 5. Net Salary Highlight Box
      const finalDeductionsY = (doc as any).lastAutoTable.finalY || 190;

      doc.setFillColor(239, 246, 255);
      doc.rect(14, finalDeductionsY + 10, 182, 28, 'F');
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.rect(14, finalDeductionsY + 10, 182, 28, 'S');

      doc.setTextColor(30, 58, 138);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('NET TAKE-HOME SALARY DISBURSED', 20, finalDeductionsY + 23);

      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129);
      doc.text(payslip.net, 145, finalDeductionsY + 27);

      // 6. Security Footer
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('This PDF document is digitally verified by HR Engine.', 14, 280);

      // 7. Save Binary PDF File
      doc.save(`Payslip-${payslip.month.replace(/\s+/g, '-')}.pdf`);
      triggerToast(`Payslip PDF downloaded for ${payslip.month}!`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      triggerToast('Failed to generate PDF file.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading || !selectedPayslip) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <EmployeePageShell
      title="Executive Payroll Portal"
      subtitle="Comprehensive breakdown of salary disbursements, deductions, and tax certificates."
      actions={
        <button
          onClick={() => generateAndDownloadPDF(selectedPayslip)}
          disabled={downloadingId === selectedPayslip.month}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
        >
          {downloadingId === selectedPayslip.month ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Download {selectedPayslip.month} Statement</span>
        </button>
      }
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Hero Financial Banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-600/20">
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">Disbursement Cycle</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3" /> Disbursed
                </span>
              </div>
              <h2 className="mt-0.5 text-2xl font-black text-slate-900">{selectedPayslip.month}</h2>
              <p className="text-xs font-semibold text-slate-400">Processed on {selectedPayslip.disbursementDate} via Direct Bank Wire</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Net Disbursed</div>
              <div className="text-base font-black text-emerald-600">{selectedPayslip.net}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Gross Total</div>
              <div className="text-base font-black text-slate-900">{selectedPayslip.gross}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Gross Earnings', value: stats.gross, icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', note: 'Base + Allowances' },
          { label: 'Total Deductions', value: stats.deductions, icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', note: 'PF, Tax & PT' },
          { label: 'Net Take-Home', value: stats.net, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', note: 'Bank Transfer' },
          { label: 'Cumulative YTD', value: stats.ytd, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', note: 'FY 2026-27' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{item.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color} border ${item.border}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className={`mt-3 text-2xl font-black ${item.color}`}>{item.value}</div>
              <div className="mt-1 text-[11px] font-medium text-slate-400">{item.note}</div>
            </div>
          );
        })}
      </div>

      {/* Main Breakdown Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Earnings Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Earnings & Allowances</h3>
                <p className="text-[11px] font-bold text-slate-400">Fixed & variable components</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +{selectedPayslip.gross}
            </span>
          </div>

          <div className="space-y-3">
            {selectedPayslip.earnings?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:bg-white hover:border-emerald-200"
              >
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <span className="text-xs font-black text-slate-900">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Statutory Deductions</h3>
                <p className="text-[11px] font-bold text-slate-400">Taxes, PF, and compliance</p>
              </div>
            </div>
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              -{selectedPayslip.deductions}
            </span>
          </div>

          <div className="space-y-3">
            {selectedPayslip.deductionsList?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:bg-white hover:border-rose-200"
              >
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <span className="text-xs font-black text-rose-600">-{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net Disbursed Highlight Card */}
      <div className="mb-8 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 p-6 text-white shadow-xl shadow-blue-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300">Final Net Take-Home</span>
            <div className="mt-1 text-3xl font-black text-white">{selectedPayslip.net}</div>
            <p className="mt-0.5 text-xs text-blue-200">Transferred directly to registered corporate bank account</p>
          </div>
          <button
            onClick={() => generateAndDownloadPDF(selectedPayslip)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-blue-950 shadow-md transition-all hover:bg-blue-50 active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Receipt</span>
          </button>
        </div>
      </div>

      {/* Historical Payslips Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Statement Archive</span>
            <h3 className="text-base font-black text-slate-900">Payslip History</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs font-semibold text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Disbursement Month</th>
                <th className="px-5 py-3.5">Gross Pay</th>
                <th className="px-5 py-3.5">Deductions</th>
                <th className="px-5 py-3.5">Net Disbursed</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payslips.map((p) => {
                const isSelected = selectedPayslip.id === p.id;
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-slate-50/80 ${isSelected ? 'bg-blue-50/40' : 'bg-white'}`}
                  >
                    <td className="px-5 py-4 font-bold text-slate-900">{p.month}</td>
                    <td className="px-5 py-4 font-bold text-slate-700">{p.gross}</td>
                    <td className="px-5 py-4 font-bold text-rose-600">-{p.deductions}</td>
                    <td className="px-5 py-4 font-black text-blue-600">{p.net}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-emerald-600 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-3">
                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Select & View
                      </button>
                      <button
                        onClick={() => generateAndDownloadPDF(p)}
                        className="font-bold text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeePageShell>
  );
}