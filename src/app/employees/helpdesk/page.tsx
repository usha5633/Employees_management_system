'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { HelpCircle, Plus, MessageSquare, CheckCircle2, Clock, Circle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: 'open' | 'inprogress' | 'resolved';
  priority: 'Low' | 'Medium' | 'High';
  created: string;
}

const statusIcon: Record<string, JSX.Element> = {
  open:       <Circle className="h-4 w-4 text-slate-400" />,
  inprogress: <Clock className="h-4 w-4 text-blue-500" />,
  resolved:   <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

const statusLabel: Record<string, string> = {
  open:       'Open',
  inprogress: 'In Progress',
  resolved:   'Resolved',
};

const statusBadge: Record<string, string> = {
  open:       'bg-slate-100 text-slate-700',
  inprogress: 'bg-blue-50 text-blue-700',
  resolved:   'bg-emerald-50 text-emerald-700',
};

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT Support');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');

  // Fetch tickets from database API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/helpdesk/tickets');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/helpdesk/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, priority, description }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit ticket');
      }

      // Reset form & add new ticket
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchTickets();
    } catch (err: any) {
      setError(err.message || 'Error submitting ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EmployeePageShell
      title="Helpdesk"
      subtitle="Raise and track your support tickets."
      actions={
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open',        value: tickets.filter(t => t.status === 'open').length,        tone: 'slate' },
          { label: 'In Progress', value: tickets.filter(t => t.status === 'inprogress').length,  tone: 'blue' },
          { label: 'Resolved',    value: tickets.filter(t => t.status === 'resolved').length,    tone: 'emerald' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.tone === 'blue' ? 'text-blue-600' : s.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Raise New Ticket</h3>
          {error && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-200">
              {error}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Issue Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Briefly describe your issue"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {['IT Support', 'HR', 'Payroll', 'Admin', 'Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Detailed description of the issue..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} disabled={submitting} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">My Tickets</p>
          <h2 className="mt-0.5 text-lg font-bold text-slate-900">Support Requests</h2>
        </div>
        
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No support tickets found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map(t => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60">
                {statusIcon[t.status] || statusIcon.open}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">{t.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{t.id}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                    <MessageSquare className="h-3 w-3" />
                    <span>{t.category}</span>
                    <span>·</span>
                    <span>Opened {t.created}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{t.priority}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusBadge[t.status] || statusBadge.open}`}>{statusLabel[t.status] || 'Open'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployeePageShell>
  );
}