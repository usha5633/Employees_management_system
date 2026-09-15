'use client';
import HRPageShell from '@/components/hr/HRPageShell';
import { FileText, Upload, Download, CheckCircle2, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { useState } from 'react';

const docs = [
  { id: 1, employee: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', docName: 'Offer Letter',           category: 'Employment', uploaded: '12 Mar 2023', status: 'verified'  },
  { id: 2, employee: 'Rohit Verma',  avatar: 'RV', color: 'bg-sky-100 text-sky-700',       docName: 'PAN Card Copy',           category: 'Identity',   uploaded: '15 Mar 2023', status: 'pending'   },
  { id: 3, employee: 'Meera Nair',   avatar: 'MN', color: 'bg-emerald-100 text-emerald-700',docName: 'Appointment Letter',     category: 'Employment', uploaded: '10 Feb 2022', status: 'verified'  },
  { id: 4, employee: 'Danish Khan',  avatar: 'DK', color: 'bg-amber-100 text-amber-700',   docName: 'Aadhaar Card Copy',       category: 'Identity',   uploaded: '22 Jul 2021', status: 'verified'  },
  { id: 5, employee: 'Pooja Iyer',   avatar: 'PI', color: 'bg-rose-100 text-rose-700',     docName: 'Educational Certificate', category: 'Education',  uploaded: '06 Aug 2022', status: 'pending'   },
  { id: 6, employee: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     docName: 'Bank Passbook Copy',      category: 'Finance',    uploaded: '11 Oct 2022', status: 'rejected'  },
];

const statusBadge: Record<string, string> = {
  verified: 'bg-emerald-50 text-emerald-700',
  pending:  'bg-amber-50 text-amber-700',
  rejected: 'bg-rose-50 text-rose-700',
};
const statusIcon: Record<string, React.ReactElement> = {
  verified: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  pending:  <Clock className="h-3.5 w-3.5 text-amber-500" />,
  rejected: <AlertCircle className="h-3.5 w-3.5 text-rose-500" />,
};

export default function HRDocumentsPage() {
  const [documents, setDocuments] = useState(docs);
  const [showUpload, setShowUpload] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const verify = (id: number) => setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'verified' } : d));
  const reject = (id: number) => setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'rejected' } : d));

  const filtered = filterStatus === 'all' ? documents : documents.filter(d => d.status === filterStatus);

  return (
    <HRPageShell title="Documents" subtitle="Manage and verify employee documents."
      actions={<button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" />Upload Document</button>}>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900">Upload Employee Document</h3>
              <button onClick={() => setShowUpload(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['Employee Name', 'text', 'e.g. Aanya Sharma'], ['Document Name', 'text', 'e.g. Offer Letter'], ['Category', 'text', 'Employment / Identity / Education']].map(([label, type, ph]) => (
                <div key={String(label)}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input type={String(type)} placeholder={String(ph)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              ))}
              <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-3 py-3">
                <span className="flex items-center gap-2 text-sm text-slate-500"><Upload className="h-4 w-4 text-emerald-500" />Choose file (PDF, JPG, PNG)</span>
                <button className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white">Browse</button>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowUpload(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button onClick={() => setShowUpload(false)} className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: documents.length, color: 'text-slate-900' },
          { label: 'Verified', value: documents.filter(d => d.status === 'verified').length, color: 'text-emerald-600' },
          { label: 'Pending Review', value: documents.filter(d => d.status === 'pending').length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">Employee Documents</h2>
          <div className="flex gap-1">
            {['all', 'verified', 'pending', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${filterStatus === f ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>{['Employee', 'Document', 'Category', 'Uploaded', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${d.color}`}>{d.avatar}</div><span className="font-semibold text-slate-900">{d.employee}</span></div></td>
                  <td className="px-5 py-3.5"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /><span className="text-slate-700">{d.docName}</span></div></td>
                  <td className="px-5 py-3.5"><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{d.category}</span></td>
                  <td className="px-5 py-3.5 text-slate-600">{d.uploaded}</td>
                  <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadge[d.status]}`}>{statusIcon[d.status]}{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-3.5 w-3.5" /></button>
                      {d.status === 'pending' && <>
                        <button onClick={() => verify(d.id)} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Verify</button>
                        <button onClick={() => reject(d.id)} className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100">Reject</button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRPageShell>
  );
}
