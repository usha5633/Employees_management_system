'use client';

import HRPageShell from '@/components/hr/HRPageShell';
import { Search, Plus, X, Filter, Eye, Pencil, Trash2, ChevronDown, Building2, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';

type Status = 'Active' | 'Remote' | 'On Leave';

interface Employee {
  id: number; name: string; role: string; department: string;
  status: Status; avatar: string; color: string; email: string; phone: string; joining: string;
}

const seed: Employee[] = [
  { id: 1,  name: 'Aanya Sharma',  role: 'Product Designer',        department: 'Design',      status: 'Active',   avatar: 'AS', color: 'bg-violet-100 text-violet-700', email: 'aanya@co.com',  phone: '+91 98765 11111', joining: '12 Mar 2023' },
  { id: 2,  name: 'Rohit Verma',   role: 'Frontend Engineer',       department: 'Engineering', status: 'Remote',   avatar: 'RV', color: 'bg-sky-100 text-sky-700',       email: 'rohit@co.com',  phone: '+91 98765 22222', joining: '01 Jan 2023' },
  { id: 3,  name: 'Meera Nair',    role: 'HR Operations Lead',      department: 'HR',          status: 'Active',   avatar: 'MN', color: 'bg-emerald-100 text-emerald-700',email: 'meera@co.com',  phone: '+91 98765 33333', joining: '15 Feb 2022' },
  { id: 4,  name: 'Danish Khan',   role: 'Sales Manager',           department: 'Sales',       status: 'On Leave', avatar: 'DK', color: 'bg-amber-100 text-amber-700',   email: 'danish@co.com', phone: '+91 98765 44444', joining: '20 Jul 2021' },
  { id: 5,  name: 'Pooja Iyer',    role: 'Finance Analyst',         department: 'Finance',     status: 'Active',   avatar: 'PI', color: 'bg-rose-100 text-rose-700',     email: 'pooja@co.com',  phone: '+91 98765 55555', joining: '05 Aug 2022' },
  { id: 6,  name: 'Vikram Singh',  role: 'DevOps Engineer',         department: 'Engineering', status: 'Active',   avatar: 'VS', color: 'bg-cyan-100 text-cyan-700',     email: 'vikram@co.com', phone: '+91 98765 66666', joining: '10 Oct 2022' },
  { id: 7,  name: 'Sneha Pillai',  role: 'UX Researcher',           department: 'Design',      status: 'Active',   avatar: 'SP', color: 'bg-pink-100 text-pink-700',     email: 'sneha@co.com',  phone: '+91 98765 77777', joining: '18 Apr 2023' },
];

const DEPTS = ['All', 'Engineering', 'Design', 'Sales', 'HR', 'Finance'];
const STATS: Status[] = ['Active', 'Remote', 'On Leave'];
const statusBadge: Record<Status, string> = {
  Active:     'bg-emerald-50 text-emerald-700',
  Remote:     'bg-sky-50 text-sky-700',
  'On Leave': 'bg-amber-50 text-amber-700',
};

function EmployeeModal({ emp, onClose }: { emp: Employee | null; onClose: () => void }) {
  if (!emp) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Employee Profile</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${emp.color}`}>{emp.avatar}</div>
            <div>
              <p className="text-xl font-bold text-slate-900">{emp.name}</p>
              <p className="text-sm text-slate-500">{emp.role} · {emp.department}</p>
              <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge[emp.status]}`}>{emp.status}</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {[['Email', emp.email], ['Phone', emp.phone], ['Joining Date', emp.joining], ['Department', emp.department]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="text-xs font-semibold text-slate-500">{k}</span>
                <span className="text-sm font-medium text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onAdd, onClose }: { onAdd: (e: Employee) => void; onClose: () => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', role: '', department: DEPTS[1], status: 'Active' as Status, email: '', phone: '' });
  const [saved, setSaved] = useState(false);

  const submit = () => {
    if (!form.firstName || !form.role) return;
    const initials = (form.firstName[0] + form.lastName[0]).toUpperCase();
    const colors = ['bg-violet-100 text-violet-700','bg-sky-100 text-sky-700','bg-pink-100 text-pink-700','bg-teal-100 text-teal-700'];
    onAdd({ id: Date.now(), name: `${form.firstName} ${form.lastName}`, role: form.role, department: form.department, status: form.status, avatar: initials, color: colors[Math.floor(Math.random() * colors.length)], email: form.email || `${form.firstName.toLowerCase()}@co.com`, phone: form.phone || '+91 00000 00000', joining: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div><h3 className="font-bold text-slate-900">Add New Employee</h3><p className="text-xs text-slate-500 mt-0.5">Fill details to onboard a new member</p></div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        {saved ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="font-bold text-slate-900">Employee Added!</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[['First Name', 'firstName', 'e.g. Aanya'], ['Last Name', 'lastName', 'e.g. Sharma']].map(([label, key, ph]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Job Role</label>
              <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Product Designer" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
                <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  {DEPTS.slice(1).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                  {STATS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={submit} className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Add Employee</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const confirm = () => { setDone(true); setTimeout(() => { onConfirm(); onClose(); }, 900); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
        {done ? <p className="py-6 font-bold text-emerald-600">Removed successfully</p> : (<>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100"><Trash2 className="h-7 w-7 text-rose-600" /></div>
          <p className="font-bold text-slate-900">Remove {name}?</p>
          <p className="mt-1 text-sm text-slate-500">This action cannot be undone.</p>
          <div className="mt-5 flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={confirm} className="flex-1 rounded-xl bg-rose-600 py-2 text-sm font-semibold text-white hover:bg-rose-700">Delete</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

export default function HREmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(seed);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [deleteEmp, setDeleteEmp] = useState<Employee | null>(null);

  const filtered = useMemo(() => employees.filter(e => {
    const q = search.toLowerCase();
    const matchQ = e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
    const matchD = dept === 'All' || e.department === dept;
    return matchQ && matchD;
  }), [employees, search, dept]);

  return (
    <HRPageShell title="Employees" subtitle="Manage all employees in the organisation."
      actions={<button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" />Add Employee</button>}>
      {showAdd && <AddModal onAdd={e => setEmployees(prev => [e, ...prev])} onClose={() => setShowAdd(false)} />}
      {viewEmp && <EmployeeModal emp={viewEmp} onClose={() => setViewEmp(null)} />}
      {deleteEmp && <DeleteModal name={deleteEmp.name} onConfirm={() => setEmployees(prev => prev.filter(e => e.id !== deleteEmp!.id))} onClose={() => setDeleteEmp(null)} />}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Employees <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{filtered.length}</span></h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, role…" className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
            </div>
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)} className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium ${dept !== 'All' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                <Filter className="h-4 w-4" />Filter<ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</p>
                  {DEPTS.map(d => <button key={d} onClick={() => { setDept(d); setShowFilter(false); }} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm ${dept === d ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>{d}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Employee', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-sm text-slate-400">No employees found.</td></tr>}
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${emp.color}`}>{emp.avatar}</div>
                      <div><p className="font-semibold text-slate-900">{emp.name}</p><p className="text-xs text-slate-500">{emp.role}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"><Building2 className="h-3 w-3" />{emp.department}</span></td>
                  <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[emp.status]}`}>{emp.status}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewEmp(emp)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><Eye className="h-3.5 w-3.5" />View</button>
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" />Edit</button>
                      <button onClick={() => setDeleteEmp(emp)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
          <span>Showing <b className="text-slate-700">{filtered.length}</b> of <b className="text-slate-700">{employees.length}</b></span>
          <div className="flex gap-1">
            <button className="rounded-lg border border-slate-200 px-2.5 py-1 hover:bg-slate-50 disabled:opacity-40" disabled>← Prev</button>
            <span className="rounded-lg bg-emerald-600 px-2.5 py-1 font-semibold text-white">1</span>
            <button className="rounded-lg border border-slate-200 px-2.5 py-1 hover:bg-slate-50">Next →</button>
          </div>
        </div>
      </div>
    </HRPageShell>
  );
}
