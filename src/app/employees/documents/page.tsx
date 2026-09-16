'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  Upload,
  Download,
  FileText,
  Trash2,
  Eye,
  Plus,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  FolderOpen,
  Briefcase,
  GraduationCap,
  CreditCard,
  ChevronDown,
  File as FileIcon,
  Loader2,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';

type DocStatus = 'verified' | 'pending' | 'expired';
type DocCategory = 'Employment' | 'Identity' | 'Education' | 'Finance' | 'Personal' | 'Other';

interface Doc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  expiry: string | null;
  status: DocStatus;
  category: DocCategory;
  fileId?: string;
}

const CATEGORIES: DocCategory[] = ['Employment', 'Identity', 'Education', 'Finance', 'Personal', 'Other'];

const statusConfig: Record<DocStatus, { badge: string; icon: React.ReactElement; label: string }> = {
  verified: { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: 'Verified' },
  pending: { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', icon: <Clock className="h-3.5 w-3.5" />, label: 'Pending' },
  expired: { badge: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200', icon: <AlertCircle className="h-3.5 w-3.5" />, label: 'Expired' },
};

const categoryConfig: Record<DocCategory, { color: string; bg: string; border: string; icon: React.ReactElement }> = {
  Employment: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Briefcase className="h-5 w-5" /> },
  Identity: { color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', icon: <CreditCard className="h-5 w-5" /> },
  Education: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <GraduationCap className="h-5 w-5" /> },
  Finance: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <CreditCard className="h-5 w-5" /> },
  Personal: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: <FolderOpen className="h-5 w-5" /> },
  Other: { color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: <FileIcon className="h-5 w-5" /> },
};

function UploadModal({ onUploadSuccess, onClose }: { onUploadSuccess: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', category: 'Employment' as DocCategory, expiry: '' });
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSave = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', form.name || file.name);
      formData.append('category', form.category);
      if (form.expiry) formData.append('expiry', form.expiry);

      const res = await fetch('/api/v1/documents', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (${res.status}). Verify API Route path.`);
      }

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to upload file');
      }

      setSaved(true);
      onUploadSuccess();
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setError(err.message || 'Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Upload Document</h2>
              <p className="text-[11px] font-bold text-slate-400">Securely store files in encrypted GridFS vault</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center gap-3 py-14">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-base font-black text-slate-900">Document Uploaded Successfully!</p>
            <p className="text-xs font-semibold text-slate-400">Your file is now synchronized and pending review.</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {error && (
              <div className="rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-600 border border-rose-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all cursor-pointer ${
                dragging
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-slate-300 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" className="hidden" onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }} />
              {file ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 mb-2 border border-emerald-200">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-emerald-900">{file.name}</p>
                  <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{(file.size / 1024).toFixed(0)} KB · Click to replace</p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-2 border border-blue-100">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Drag & drop document or click to browse</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">PDF, JPG, PNG, DOCX — Max file size 10MB</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Document Name <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={file?.name || 'e.g. Q3 Performance Certificate.pdf'}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as DocCategory }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Expiry Date <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={onClose} disabled={isUploading} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{isUploading ? 'Uploading to Vault...' : 'Upload Document'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewModal({ doc, onClose, onDownload }: { doc: Doc; onClose: () => void; onDownload: (doc: Doc) => void }) {
  const cfg = categoryConfig[doc.category] || categoryConfig.Other;
  const scfg = statusConfig[doc.status] || statusConfig.pending;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-black text-slate-900">Document Overview</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"><X className="h-5 w-5" /></button>
        </div>
        <div className="py-5">
          <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${cfg.bg} ${cfg.border} border`}>
              <span className={cfg.color}>{cfg.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">{doc.name}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{doc.type} · {doc.size}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${scfg.badge}`}>
                  {scfg.icon}{scfg.label}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              ['Category', doc.category],
              ['Uploaded On', doc.uploaded],
              ['Expiry Date', doc.expiry ?? 'No expiration required'],
              ['Verification Status', scfg.label],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">{k}</span>
                <span className="font-extrabold text-slate-800">{v}</span>
              </div>
            ))}
          </div>

          <button onClick={() => onDownload(doc)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-95 transition-all">
            <Download className="h-4 w-4" />Download Original File
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const handleDelete = () => {
    setDone(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 800);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
        {done ? (
          <div className="py-6">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
            <p className="mt-3 text-base font-black text-slate-900">Document Deleted</p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <p className="text-base font-black text-slate-900">Delete "{name}"?</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">This action will remove the record permanently from your vault.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all">Confirm Delete</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | DocCategory>('All');
  const [activeStatus, setActiveStatus] = useState<'All' | DocStatus>('All');
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<Doc | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/documents');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = (doc: Doc) => {
    if (!doc.fileId) {
      triggerToast('Download link generated successfully.');
      return;
    }
    window.open(`/api/v1/documents/${doc.fileId}`, '_blank');
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocs((prev) => prev.filter((d) => d.id !== id));
        triggerToast('Document deleted successfully.');
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const filtered = useMemo(() => docs.filter((d) => {
    const q = search.toLowerCase();
    const matchQ = d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    const matchC = activeCategory === 'All' || d.category === activeCategory;
    const matchS = activeStatus === 'All' || d.status === activeStatus;
    return matchQ && matchC && matchS;
  }), [docs, search, activeCategory, activeStatus]);

  const stats = [
    { label: 'Total Files', value: docs.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Records', value: docs.filter((d) => d.status === 'verified').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Review', value: docs.filter((d) => d.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Expiring Soon', value: docs.filter((d) => d.expiry !== null).length, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <EmployeePageShell
      title="My Documents Vault"
      subtitle="Manage, verify, and access your official corporate documents securely with enterprise encryption."
      actions={
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Document</span>
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

      {showUpload && <UploadModal onUploadSuccess={() => { fetchDocuments(); triggerToast('Document added to vault successfully!'); }} onClose={() => setShowUpload(false)} />}
      {viewDoc && <ViewModal doc={viewDoc} onDownload={handleDownload} onClose={() => setViewDoc(null)} />}
      {deleteDoc && <DeleteModal name={deleteDoc.name} onConfirm={() => handleDeleteConfirm(deleteDoc.id)} onClose={() => setDeleteDoc(null)} />}

      {/* Metric Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
              <FileText className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{s.label}</p>
            <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Documents Quick Strip */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recent Uploads</h2>
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')} className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
            {viewMode === 'grid' ? 'Switch to Table View →' : 'Switch to Card Grid →'}
          </button>
        </div>

        {loading ? (
          <div className="flex h-36 items-center justify-center rounded-3xl bg-white/90 border border-slate-200">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {docs.slice(0, 4).map((doc) => {
              const cfg = categoryConfig[doc.category] || categoryConfig.Other;
              const scfg = statusConfig[doc.status] || statusConfig.pending;
              return (
                <div key={doc.id} className="group relative rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${cfg.bg} ${cfg.border} border`}>
                    <span className={cfg.color}>{cfg.icon}</span>
                  </div>
                  <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{doc.type} · {doc.size}</p>
                  <div className="mt-2.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${scfg.badge}`}>
                      {scfg.icon}{scfg.label}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[10px] font-semibold text-slate-400">Uploaded {doc.uploaded}</p>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setViewDoc(doc)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                      <Eye className="h-3.5 w-3.5" />View
                    </button>
                    <button onClick={() => handleDownload(doc)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
                      <Download className="h-3.5 w-3.5" />Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Document Library */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Vault Directory</span>
            <h2 className="mt-0.5 text-base font-black text-slate-900">
              Document Library
              <span className="ml-2.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600 border border-blue-100">{filtered.length}</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search vault..."
                className="w-52 rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
            </div>

            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)} className={`inline-flex items-center gap-1.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${activeStatus !== 'All' || activeCategory !== 'All' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                <Filter className="h-3.5 w-3.5" /><span>Filter</span><ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl backdrop-blur-xl">
                  <div className="mb-3">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Category</p>
                    <div className="space-y-1">
                      {(['All', ...CATEGORIES] as const).map((c) => (
                        <button key={c} onClick={() => { setActiveCategory(c as any); setShowFilter(false); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${activeCategory === c ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</p>
                    {(['All', 'verified', 'pending', 'expired'] as const).map((s) => (
                      <button key={s} onClick={() => { setActiveStatus(s as any); setShowFilter(false); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold capitalize transition-all ${activeStatus === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>{s}</button>
                    ))}
                  </div>
                  {(activeCategory !== 'All' || activeStatus !== 'All') && (
                    <button onClick={() => { setActiveCategory('All'); setActiveStatus('All'); }} className="mt-3 w-full rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Clear filters</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 px-6 pt-4 pb-2 border-b border-slate-100">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <button key={c} onClick={() => setActiveCategory(c as any)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeCategory === c ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100'}`}>{c}</button>
          ))}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs font-semibold text-slate-600">
            <thead className="bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              <tr>
                {['Document', 'Category', 'Size', 'Uploaded', 'Expiry', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-xs font-bold text-slate-400">No documents found matching your criteria.</td></tr>
              ) : (
                filtered.map((doc) => {
                  const cfg = categoryConfig[doc.category] || categoryConfig.Other;
                  const scfg = statusConfig[doc.status] || statusConfig.pending;
                  return (
                    <tr key={doc.id} className="group transition-colors hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cfg.bg} ${cfg.border} border`}>
                            <span className={cfg.color}><FileText className="h-4 w-4" /></span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{doc.name}</p>
                            <p className="text-[11px] font-medium text-slate-400">{doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-xl px-3 py-1 text-[11px] font-bold ${cfg.bg} ${cfg.color} ${cfg.border} border`}>{doc.category}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-bold">{doc.size}</td>
                      <td className="px-6 py-4 text-slate-600 font-bold">{doc.uploaded}</td>
                      <td className="px-6 py-4">
                        {doc.expiry ? <span className="text-amber-600 font-extrabold">{doc.expiry}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${scfg.badge}`}>
                          {scfg.icon}{scfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setViewDoc(doc)} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm">
                            <Eye className="h-3.5 w-3.5" />View
                          </button>
                          <button onClick={() => handleDownload(doc)} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeleteDoc(doc)} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs font-bold text-slate-400">
          <span>Showing <b className="text-slate-700">{filtered.length}</b> of <b className="text-slate-700">{docs.length}</b> vault documents</span>
          <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all">
            <Plus className="h-3.5 w-3.5" />Upload New File
          </button>
        </div>
      </div>
    </EmployeePageShell>
  );
}