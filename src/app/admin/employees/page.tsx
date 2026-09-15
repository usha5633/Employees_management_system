'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Search,
  Filter,
  Plus,
  Building2,
  Users,
  UserCheck,
  ShieldCheck,
  BriefcaseBusiness,
  X,
  ChevronDown,
  ArrowUpRight,
  Eye,
  Pencil,
  Loader2,
} from 'lucide-react';

interface Employee {
  id: string | number;
  name: string;
  role: string;
  department: string;
  status: string;
  avatar: string;
  avatarColor: string;
}

const departmentBreakdown = [
  { name: 'Engineering', count: 420, percent: 68, color: 'from-blue-500 to-indigo-500' },
  { name: 'Sales', count: 206, percent: 52, color: 'from-amber-400 to-orange-500' },
  { name: 'Design', count: 148, percent: 38, color: 'from-violet-400 to-purple-500' },
  { name: 'HR', count: 96, percent: 28, color: 'from-emerald-400 to-teal-500' },
  { name: 'Finance', count: 84, percent: 22, color: 'from-rose-400 to-pink-500' },
];

const statusConfig: Record<string, { badge: string; dot: string }> = {
  Active: { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Remote: { badge: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200', dot: 'bg-sky-500' },
  'On Leave': { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-400' },
};

const DEPARTMENTS = ['All Departments', 'Engineering', 'Design', 'Sales', 'HR', 'Finance'];
const STATUSES = ['All Status', 'Active', 'Remote', 'On Leave'];

// Modal Component with POST API Integration
function AddEmployeeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (emp: Employee) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: 'Engineering',
    status: 'Active',
    joinDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/v1/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        onAdd(data.employee);
        onClose();
      } else {
        alert('Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Employee</h2>
            <p className="mt-0.5 text-xs text-slate-500">Fill in the details to onboard a new team member</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="e.g. Aanya"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Last Name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="e.g. Sharma"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="aanya@company.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Job Role</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Product Designer"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {DEPARTMENTS.slice(1).map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {STATUSES.slice(1).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Join Date</label>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/employees');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setEmployees(data.employees || []);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const q = search.toLowerCase();
      const matchSearch =
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);
      const matchDept = deptFilter === 'All Departments' || emp.department === deptFilter;
      const matchStatus = statusFilter === 'All Status' || emp.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const remoteCount = employees.filter((e) => e.status === 'Remote').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;

  if (loading) {
    return (
      <AdminLayout pageTitle="Employees" breadcrumbs={[{ label: 'Employees' }]}>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Employees" breadcrumbs={[{ label: 'Employees' }]}>
      {showModal && (
        <AddEmployeeModal
          onClose={() => setShowModal(false)}
          onAdd={(newEmp) => setEmployees((prev) => [newEmp, ...prev])}
        />
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total employees', value: employees.length.toString(), change: '+8.2%', tone: 'blue' },
          { label: 'Active', value: activeCount.toString(), change: '+3.4%', tone: 'green' },
          { label: 'Remote', value: remoteCount.toString(), change: '+1.2%', tone: 'sky' },
          { label: 'On Leave', value: onLeaveCount.toString(), change: '+1.0%', tone: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
            <div
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                stat.tone === 'blue'
                  ? 'bg-blue-50 text-blue-600'
                  : stat.tone === 'green'
                  ? 'bg-emerald-50 text-emerald-600'
                  : stat.tone === 'sky'
                  ? 'bg-sky-50 text-sky-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              <ArrowUpRight className="h-3 w-3" />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* Employee Table Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Directory</p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900">
                All Employees
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                  {filtered.length}
                </span>
              </h2>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, role, dept…"
                  className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                    deptFilter !== 'All Departments' || statusFilter !== 'All Status'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {(deptFilter !== 'All Departments' || statusFilter !== 'All Status') && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {(deptFilter !== 'All Departments' ? 1 : 0) + (statusFilter !== 'All Status' ? 1 : 0)}
                    </span>
                  )}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    <div className="mb-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Department</p>
                      <div className="space-y-1">
                        {DEPARTMENTS.map((d) => (
                          <button
                            key={d}
                            onClick={() => {
                              setDeptFilter(d);
                              setShowFilterMenu(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                              deptFilter === d ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {deptFilter === d && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Status</p>
                      <div className="space-y-1">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setStatusFilter(s);
                              setShowFilterMenu(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                              statusFilter === s ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {statusFilter === s && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(deptFilter !== 'All Departments' || statusFilter !== 'All Status') && (
                      <button
                        onClick={() => {
                          setDeptFilter('All Departments');
                          setStatusFilter('All Status');
                        }}
                        className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Add Employee Button */}
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add employee
              </button>
            </div>
          </div>

          {/* Active Filters Chips */}
          {(deptFilter !== 'All Departments' || statusFilter !== 'All Status') && (
            <div className="flex flex-wrap gap-2 px-5 pt-3">
              {deptFilter !== 'All Departments' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {deptFilter}
                  <button onClick={() => setDeptFilter('All Departments')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'All Status' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {statusFilter}
                  <button onClick={() => setStatusFilter('All Status')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Employee</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Department</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-400">
                      No employees match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr key={emp.id} className="group transition-colors hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${emp.avatarColor}`}>
                            {emp.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{emp.name}</div>
                            <div className="text-xs text-slate-500">{emp.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          <Building2 className="h-3 w-3 text-slate-500" />
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig[emp.status]?.badge || 'bg-slate-100 text-slate-700'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusConfig[emp.status]?.dot || 'bg-slate-400'}`} />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            <span>
              Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{employees.length}</span> employees
            </span>
            <div className="flex items-center gap-1">
              <button className="rounded-lg border border-slate-200 px-2.5 py-1 hover:bg-slate-50 disabled:opacity-40" disabled>
                ← Prev
              </button>
              <span className="rounded-lg bg-blue-600 px-2.5 py-1 font-semibold text-white">1</span>
              <button className="rounded-lg border border-slate-200 px-2.5 py-1 hover:bg-slate-50">Next →</button>
            </div>
          </div>
        </div>

        {/* Side Widgets */}
        <div className="space-y-5">
          {/* Department Mix */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Overview</p>
                <h3 className="mt-0.5 text-base font-bold text-slate-900">Department Mix</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </div>

            <div className="space-y-4">
              {departmentBreakdown.map((dept) => (
                <div key={dept.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept.name}</span>
                    <span className="text-slate-500">
                      {dept.count} <span className="text-slate-400">·</span> {dept.percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${dept.color} transition-all duration-500`} style={{ width: `${dept.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workforce Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Workforce</p>
                <h3 className="mt-0.5 text-base font-bold text-slate-900">Status Breakdown</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
                <Users className="h-4 w-4 text-slate-600" />
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Active employees', value: activeCount, icon: UserCheck, iconClass: 'text-emerald-600 bg-emerald-50', valueClass: 'text-emerald-700' },
                { label: 'Working remotely', value: remoteCount, icon: ShieldCheck, iconClass: 'text-sky-600 bg-sky-50', valueClass: 'text-sky-700' },
                { label: 'Currently on leave', value: onLeaveCount, icon: BriefcaseBusiness, iconClass: 'text-amber-600 bg-amber-50', valueClass: 'text-amber-700' },
              ].map(({ label, value, icon: Icon, iconClass, valueClass }) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-slate-700">{label}</span>
                  </div>
                  <span className={`text-lg font-bold ${valueClass}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Status Visual Bar */}
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-[11px] font-medium text-slate-500">
                <span>Team distribution</span>
                <span>{employees.length} total</span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                <div className="bg-emerald-400 transition-all" style={{ width: `${employees.length > 0 ? (activeCount / employees.length) * 100 : 0}%` }} />
                <div className="bg-sky-400 transition-all" style={{ width: `${employees.length > 0 ? (remoteCount / employees.length) * 100 : 0}%` }} />
                <div className="bg-amber-400 transition-all" style={{ width: `${employees.length > 0 ? (onLeaveCount / employees.length) * 100 : 0}%` }} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />Remote
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />On Leave
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Performance</p>
            <div className="space-y-3">
              {[
                { label: 'Avg. attendance', value: '94.8%', up: true },
                { label: 'Retention rate', value: '92.3%', up: true },
                { label: 'Monthly growth', value: '+12.6%', up: true },
              ].map(({ label, value, up }) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <span className="text-xs text-slate-500">{label}</span>
                  <div className="flex items-center gap-1">
                    {up && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
                    <span className="text-sm font-bold text-slate-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}