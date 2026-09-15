// 'use client';

// // SRS 5.19: Settings — Organization, Attendance, Leave, Payroll
// // SRS 5.14: WhatsApp Integration | SRS 5.15: Notification System

// import React, { useState } from 'react';
// import { AdminLayout } from '@/components/layout/AdminLayout';
// // import {
// //   Building2, Clock, CalendarDays, CreditCard, Bell,
// //   Save, CheckCircle2, MessageCircle, Globe, Upload,
// //   Plus, Trash2, ChevronDown, ChevronRight, Toggle,
// //   Smartphone, Mail, MessageSquare, AlertCircle, X,
// // } from 'lucide-react';
// // AFTER
// import {
//   Save, CheckCircle2, MessageCircle, Globe, Upload,
//   Plus, Trash2, ChevronDown, ChevronRight,
//   Smartphone, Mail, MessageSquare, AlertCircle, X,
// } from 'lucide-react';

// // ─── Toggle Switch ────────────────────────────────────────────────────────────
// function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
//   return (
//     <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'}`}>
//       <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
//     </button>
//   );
// }

// function Field({ label, defaultValue, type = 'text', hint }: { label: string; defaultValue?: string; type?: string; hint?: string }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
//       <input type={type} defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
//       {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
//     </div>
//   );
// }

// function Select({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
//   return (
//     <div>
//       <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
//       <select defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
//         {options.map(o => <option key={o}>{o}</option>)}
//       </select>
//     </div>
//   );
// }

// function SectionHead({ title, desc }: { title: string; desc?: string }) {
//   return (
//     <div className="mb-5 border-b border-slate-100 pb-4">
//       <h3 className="text-base font-bold text-slate-900">{title}</h3>
//       {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
//     </div>
//   );
// }

// // ─── Tabs ─────────────────────────────────────────────────────────────────────
// const TABS = [
//   { key: 'org',           label: 'Organization',   icon: Building2   },
//   { key: 'attendance',    label: 'Attendance',     icon: Clock        },
//   { key: 'leave',         label: 'Leave',          icon: CalendarDays },
//   { key: 'payroll',       label: 'Payroll',        icon: CreditCard   },
//   { key: 'notifications', label: 'Notifications',  icon: Bell         },
//   { key: 'whatsapp',      label: 'WhatsApp',       icon: MessageCircle},
// ] as const;

// type TabKey = typeof TABS[number]['key'];

// // ─── Leave Types State ────────────────────────────────────────────────────────
// const initLeaveTypes = [
//   { id: 1, name: 'Casual Leave',    days: 8,  paid: true,  carryFwd: 0,  approval: '2-Tier' },
//   { id: 2, name: 'Sick Leave',      days: 5,  paid: true,  carryFwd: 0,  approval: 'HR' },
//   { id: 3, name: 'Earned Leave',    days: 12, paid: true,  carryFwd: 30, approval: '2-Tier' },
//   { id: 4, name: 'Maternity Leave', days: 90, paid: true,  carryFwd: 0,  approval: 'HR' },
//   { id: 5, name: 'Paternity Leave', days: 5,  paid: true,  carryFwd: 0,  approval: 'HR' },
//   { id: 6, name: 'Unpaid Leave',    days: 30, paid: false, carryFwd: 0,  approval: 'HR' },
// ];

// // ─── Salary Components ────────────────────────────────────────────────────────
// const initSalaryComponents = [
//   { id: 1, name: 'Basic Salary',       type: 'Earning',   pct: 50,  fixed: null, active: true },
//   { id: 2, name: 'HRA',                type: 'Earning',   pct: 20,  fixed: null, active: true },
//   { id: 3, name: 'Special Allowance',  type: 'Earning',   pct: null,fixed: null, active: true },
//   { id: 4, name: 'Bonus',              type: 'Earning',   pct: null,fixed: null, active: true },
//   { id: 5, name: 'Overtime',           type: 'Earning',   pct: null,fixed: null, active: true },
//   { id: 6, name: 'Provident Fund',     type: 'Deduction', pct: 12,  fixed: null, active: true },
//   { id: 7, name: 'Professional Tax',   type: 'Deduction', pct: null,fixed: 200,  active: true },
//   { id: 8, name: 'TDS / Income Tax',   type: 'Deduction', pct: null,fixed: null, active: true },
// ];

// // ─── WhatsApp events ──────────────────────────────────────────────────────────
// const whatsappEvents = [
//   { key: 'payslip',    label: 'Payslip Generated',    icon: '💰', desc: 'Send payslip link via WhatsApp' },
//   { key: 'leaveAp',   label: 'Leave Approved',        icon: '✅', desc: 'Notify employee on approval' },
//   { key: 'leaveRej',  label: 'Leave Rejected',        icon: '❌', desc: 'Notify employee on rejection' },
//   { key: 'attRem',    label: 'Attendance Reminder',   icon: '⏰', desc: 'Daily check-in reminder at 9 AM' },
//   { key: 'birthday',  label: 'Birthday Wishes',       icon: '🎂', desc: 'Auto wish on birthday' },
//   { key: 'joining',   label: 'Joining Notification',  icon: '👋', desc: 'Welcome message on joining' },
//   { key: 'hrRem',     label: 'HR Reminder',           icon: '📋', desc: 'Pending actions reminders' },
// ];

// // ─── Notification channels ────────────────────────────────────────────────────
// const notifChannels = [
//   { key: 'inapp',    label: 'In-App',        icon: Bell,          desc: 'Real-time in-app notifications' },
//   { key: 'email',    label: 'Email',         icon: Mail,          desc: 'Email via configured SMTP' },
//   { key: 'sms',      label: 'SMS',           icon: Smartphone,    desc: 'SMS via SMS gateway API' },
//   { key: 'whatsapp', label: 'WhatsApp',      icon: MessageCircle, desc: 'WhatsApp Business API' },
//   { key: 'push',     label: 'Push',          icon: AlertCircle,   desc: 'Mobile push notifications' },
// ];

// const notifEvents = [
//   { label: 'Leave Approved / Rejected',    channels: ['inapp','email','whatsapp'] },
//   { label: 'Attendance Marked',            channels: ['inapp'] },
//   { label: 'Payslip Generated',            channels: ['inapp','email','whatsapp'] },
//   { label: 'New Announcement',             channels: ['inapp','email'] },
//   { label: 'Task Assigned',               channels: ['inapp','email'] },
//   { label: 'Helpdesk Ticket Updated',      channels: ['inapp','email'] },
//   { label: 'Birthday Reminder',            channels: ['inapp','whatsapp'] },
//   { label: 'Joining Welcome',              channels: ['inapp','email','whatsapp'] },
// ];

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function AdminSettingsPage() {
//   const [activeTab, setActiveTab]           = useState<TabKey>('org');
//   const [toast, setToast]                   = useState('');
//   const [leaveTypes, setLeaveTypes]         = useState(initLeaveTypes);
//   const [salaryComps, setSalaryComps]       = useState(initSalaryComponents);
//   const [channelToggles, setChannelToggles] = useState<Record<string, boolean>>({ inapp: true, email: true, sms: false, whatsapp: true, push: false });
//   const [wpToggles, setWpToggles]           = useState<Record<string, boolean>>({ payslip: true, leaveAp: true, leaveRej: true, attRem: false, birthday: true, joining: true, hrRem: false });
//   const [showAddLeave, setShowAddLeave]     = useState(false);
//   const [newLeave, setNewLeave]             = useState({ name: '', days: '', paid: true });

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

//   const addLeaveType = () => {
//     if (!newLeave.name || !newLeave.days) return;
//     setLeaveTypes(prev => [...prev, { id: Date.now(), name: newLeave.name, days: Number(newLeave.days), paid: newLeave.paid, carryFwd: 0, approval: '2-Tier' }]);
//     setNewLeave({ name: '', days: '', paid: true });
//     setShowAddLeave(false);
//     showToast('Leave type added');
//   };

//   const deleteLeave = (id: number) => setLeaveTypes(prev => prev.filter(l => l.id !== id));
//   const toggleComp  = (id: number) => setSalaryComps(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));

//   return (
//     <AdminLayout pageTitle="Settings" breadcrumbs={[{ label: 'Settings' }]}>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
//           <CheckCircle2 className="h-4 w-4 text-emerald-400" />{toast}
//         </div>
//       )}

//       {/* Page Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
//           <p className="text-xs text-slate-500 mt-0.5">SRS 5.19 — Configure all system modules</p>
//         </div>
//         <button onClick={() => showToast('Settings saved successfully!')} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
//           <Save className="h-4 w-4" />Save Changes
//         </button>
//       </div>

//       {/* Tab Bar */}
//       <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
//         {TABS.map(({ key, label, icon: Icon }) => (
//           <button key={key} onClick={() => setActiveTab(key)}
//             className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
//             <Icon className="h-4 w-4" />{label}
//           </button>
//         ))}
//       </div>

//       {/* ── SRS 5.19.1: Organization Settings ── */}
//       {activeTab === 'org' && (
//         <div className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Company Information" desc="SRS 5.19.1 — Organization Settings" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <Field label="Company Name"     defaultValue="Infinite Cloud Technologies Pvt. Ltd." />
//               <Field label="Company Website"  defaultValue="https://infinitecloud.in" />
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Logo</label>
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white">IC</div>
//                   <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
//                     <Upload className="h-4 w-4" />Upload Logo
//                   </button>
//                 </div>
//               </div>
//               <Select label="Default Timezone" options={['Asia/Kolkata (IST +05:30)', 'UTC', 'America/New_York', 'Europe/London']} defaultValue="Asia/Kolkata (IST +05:30)" />
//               <Select label="Base Currency"    options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']} defaultValue="INR (₹)" />
//               <Field label="Address Line 1"    defaultValue="Unit 401, TechPark Alpha" />
//               <Field label="City / State"      defaultValue="Bengaluru, Karnataka" />
//               <Field label="PIN Code"          defaultValue="560001" />
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Working Days & Holidays" desc="SRS 5.19.1 — Configure office calendar" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-2">Working Days</label>
//                 <div className="flex flex-wrap gap-2">
//                   {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
//                     const active = i < 5;
//                     return (
//                       <button key={d} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${active ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{d}</button>
//                     );
//                   })}
//                 </div>
//               </div>
//               <Select label="Financial Year Start" options={['April (India)', 'January', 'July']} defaultValue="April (India)" />
//             </div>
//             {/* Holiday list */}
//             <div className="mt-4">
//               <p className="mb-2 text-xs font-bold text-slate-700">National Holidays 2026</p>
//               <div className="space-y-2">
//                 {[
//                   ['Oct 2',  'Gandhi Jayanti',     'National'],
//                   ['Oct 12', 'Dussehra',           'National'],
//                   ['Oct 20', 'Diwali',             'National'],
//                   ['Dec 25', 'Christmas',          'National'],
//                 ].map(([date, name, type]) => (
//                   <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
//                     <div className="flex items-center gap-3">
//                       <span className="text-xs font-bold text-slate-500 w-14">{date}</span>
//                       <span className="text-sm font-semibold text-slate-900">{name}</span>
//                       <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{type}</span>
//                     </div>
//                     <button className="text-slate-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
//                   </div>
//                 ))}
//                 <button className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 w-full">
//                   <Plus className="h-3.5 w-3.5" />Add Holiday
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SRS 5.19.2: Attendance Settings ── */}
//       {activeTab === 'attendance' && (
//         <div className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Office Hours" desc="SRS 5.19.2 — Attendance Settings" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               <Field label="Shift Start Time"    defaultValue="09:00" type="time" />
//               <Field label="Shift End Time"      defaultValue="18:00" type="time" />
//               <Field label="Grace Period (mins)" defaultValue="15" hint="Late mark after grace period" />
//               <Field label="Min Working Hours"   defaultValue="8"  hint="Hours/day for full day" />
//               <Field label="Half Day Hours"      defaultValue="4"  hint="Hours/day for half day" />
//               <Field label="Overtime Threshold (hrs)" defaultValue="9" hint="Hours after which overtime starts" />
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Break Rules — SRS 5.5.3" desc="FR-ATT-003 Break Management" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//               <Field label="Max Break Duration (mins)" defaultValue="60" />
//               <Field label="Number of Breaks Allowed"  defaultValue="2" />
//               <Select label="Break Deduction Rule" options={['Auto-deduct 30 min', 'Track manually', 'No deduction']} />
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Attendance Methods — SRS 5.5.7" desc="FR-ATT-007 Supported methods" />
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//               {[
//                 { label: 'Web Portal',  icon: '🌐', active: true },
//                 { label: 'Mobile App', icon: '📱', active: true },
//                 { label: 'GPS',        icon: '📍', active: false },
//                 { label: 'Biometric',  icon: '👆', active: false },
//                 { label: 'RFID',       icon: '💳', active: false },
//                 { label: 'API',        icon: '🔗', active: false },
//               ].map(m => (
//                 <div key={m.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${m.active ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
//                   <span className="text-sm font-semibold text-slate-800">{m.icon} {m.label}</span>
//                   <Toggle on={m.active} onToggle={() => {}} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SRS 5.19.3: Leave Settings ── */}
//       {activeTab === 'leave' && (
//         <div className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-5 flex items-center justify-between">
//               <SectionHead title="Leave Types — SRS 5.6.1 FR-LEAVE-001" desc="Configure leave types, days, and carry-forward rules" />
//               <button onClick={() => setShowAddLeave(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
//                 <Plus className="h-4 w-4" />Add Type
//               </button>
//             </div>

//             {showAddLeave && (
//               <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
//                 <div className="grid grid-cols-3 gap-3 mb-3">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-600 mb-1">Leave Name</label>
//                     <input value={newLeave.name} onChange={e => setNewLeave(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Annual Leave"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-600 mb-1">Days Per Year</label>
//                     <input value={newLeave.days} onChange={e => setNewLeave(f => ({ ...f, days: e.target.value }))} type="number" placeholder="12"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
//                   </div>
//                   <div className="flex items-end gap-2">
//                     <button onClick={addLeaveType} className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700">Add</button>
//                     <button onClick={() => setShowAddLeave(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"><X className="h-4 w-4" /></button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-100 text-sm">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     {['Leave Type', 'Days/Year', 'Paid', 'Carry Forward', 'Approval', 'Actions'].map(h => (
//                       <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 bg-white">
//                   {leaveTypes.map(l => (
//                     <tr key={l.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-3 font-semibold text-slate-900">{l.name}</td>
//                       <td className="px-4 py-3"><input type="number" defaultValue={l.days} className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" /></td>
//                       <td className="px-4 py-3">
//                         <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${l.paid ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
//                           {l.paid ? 'Paid' : 'Unpaid'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3"><input type="number" defaultValue={l.carryFwd} className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" /></td>
//                       <td className="px-4 py-3">
//                         <select defaultValue={l.approval} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
//                           {['2-Tier', 'HR', 'Manager', 'Auto'].map(o => <option key={o}>{o}</option>)}
//                         </select>
//                       </td>
//                       <td className="px-4 py-3">
//                         <button onClick={() => deleteLeave(l.id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Approval Workflow — SRS 5.6.3 FR-LEAVE-003" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <Select label="Leave Approval Flow" options={['Employee → Manager → HR', 'Employee → Manager', 'Employee → HR', 'Auto Approve']} />
//               <Field  label="Max Consecutive Leave Days" defaultValue="15" />
//               <Select label="Carry-Forward Policy"       options={['Max 30 days', 'No carry forward', 'Full carry forward']} />
//               <Field  label="Leave Encashment (max days)" defaultValue="10" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SRS 5.19.4: Payroll Settings ── */}
//       {activeTab === 'payroll' && (
//         <div className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Payroll Cycle — SRS 5.7.2 FR-PAY-002" desc="Configure salary calculation and disbursement" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <Select label="Payroll Cycle"         options={['Monthly (1st–Last)', 'Bi-weekly', 'Weekly']} />
//               <Field  label="Disbursement Date"     defaultValue="1" hint="Day of month for salary credit" />
//               <Select label="Payslip Generation"    options={['Auto on cycle end', 'Manual approval', 'After HR approval']} />
//               <Field  label="Payslip Template"      defaultValue="Standard A4 — Indian Format" />
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Salary Components — SRS 5.7.1 FR-PAY-001" desc="Configure earnings and deductions" />
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-100 text-sm">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     {['Component', 'Type', '% of Basic', 'Fixed Amount', 'Active'].map(h => (
//                       <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 bg-white">
//                   {salaryComps.map(c => (
//                     <tr key={c.id} className={`transition-colors ${c.active ? 'hover:bg-slate-50/70' : 'opacity-40'}`}>
//                       <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
//                       <td className="px-4 py-3">
//                         <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c.type === 'Earning' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{c.type}</span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <input type="number" defaultValue={c.pct ?? ''} placeholder="—" className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" />
//                       </td>
//                       <td className="px-4 py-3">
//                         <input type="number" defaultValue={c.fixed ?? ''} placeholder="—" className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" />
//                       </td>
//                       <td className="px-4 py-3">
//                         <Toggle on={c.active} onToggle={() => toggleComp(c.id)} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
//               <Plus className="h-3.5 w-3.5" />Add Salary Component
//             </button>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Payroll Approval — SRS 5.7.4 FR-PAY-004" />
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <Select label="Approval Required By" options={['HR Manager', 'Finance Head', 'Both HR + Finance', 'Admin Only']} />
//               <Select label="Processing Method"    options={['Single approval', 'Dual approval', 'Auto-process']} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SRS 5.15: Notification System ── */}
//       {activeTab === 'notifications' && (
//         <div className="space-y-6">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Notification Channels — SRS 5.15" desc="Enable/disable notification delivery channels" />
//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//               {notifChannels.map(({ key, label, icon: Icon, desc }) => (
//                 <div key={key} className={`flex items-start justify-between rounded-2xl border p-4 transition-all ${channelToggles[key] ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-slate-50'}`}>
//                   <div className="flex items-start gap-3">
//                     <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${channelToggles[key] ? 'bg-blue-100' : 'bg-slate-200'}`}>
//                       <Icon className={`h-4 w-4 ${channelToggles[key] ? 'text-blue-600' : 'text-slate-400'}`} />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">{label}</p>
//                       <p className="text-[11px] text-slate-500">{desc}</p>
//                     </div>
//                   </div>
//                   <Toggle on={channelToggles[key]} onToggle={() => setChannelToggles(p => ({ ...p, [key]: !p[key] }))} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="Event-based Notifications — SRS 5.15" desc="Configure which events trigger which channels" />
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="bg-slate-50">
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Event</th>
//                     {notifChannels.map(c => (
//                       <th key={c.key} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {notifEvents.map(ev => (
//                     <tr key={ev.label} className="hover:bg-slate-50/60">
//                       <td className="px-4 py-3 font-medium text-slate-800">{ev.label}</td>
//                       {notifChannels.map(c => (
//                         <td key={c.key} className="px-4 py-3 text-center">
//                           <input type="checkbox" defaultChecked={ev.channels.includes(c.key)} className="h-4 w-4 rounded accent-blue-600" />
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── SRS 5.14: WhatsApp Integration ── */}
//       {activeTab === 'whatsapp' && (
//         <div className="space-y-6">
//           <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white text-xl shadow-lg shadow-emerald-600/30">💬</div>
//                 <div>
//                   <h3 className="font-bold text-slate-900 text-lg">WhatsApp Business API</h3>
//                   <p className="text-xs text-slate-600 mt-0.5">SRS 5.14 — Connect WhatsApp Business for automatic notifications</p>
//                 </div>
//               </div>
//               <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Optional Feature</span>
//             </div>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <Field label="WhatsApp Business Account ID" defaultValue="" hint="From Meta Business Manager" />
//               <Field label="Phone Number ID"              defaultValue="" hint="Business phone number ID" />
//               <Field label="Access Token"                 type="password" hint="WhatsApp API Access Token" />
//               <Field label="Webhook URL"                  defaultValue="https://your-domain.com/api/whatsapp/webhook" />
//             </div>
//             <div className="mt-4 flex gap-3">
//               <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Test Connection</button>
//               <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">View Logs</button>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="WhatsApp Notification Events — SRS 5.14" desc="Configure which events send WhatsApp messages to employees" />
//             <div className="space-y-3">
//               {whatsappEvents.map(ev => (
//                 <div key={ev.key} className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition-all ${wpToggles[ev.key] ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
//                   <div className="flex items-center gap-4">
//                     <span className="text-2xl">{ev.icon}</span>
//                     <div>
//                       <p className="font-semibold text-slate-900">{ev.label}</p>
//                       <p className="text-[11px] text-slate-500">{ev.desc}</p>
//                     </div>
//                   </div>
//                   <Toggle on={wpToggles[ev.key]} onToggle={() => setWpToggles(p => ({ ...p, [ev.key]: !p[ev.key] }))} />
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <SectionHead title="WhatsApp Flow Diagram — SRS 5.14" />
//             <div className="flex flex-wrap items-center gap-2 text-sm">
//               {['Payroll Generated', '→', 'Payslip Created', '→', 'WhatsApp Service', '→', 'Employee'].map((s, i) => (
//                 <span key={i} className={`${s === '→' ? 'text-slate-400 font-bold' : 'rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-800'}`}>{s}</span>
//               ))}
//             </div>
//             <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
//               {['Leave Approved', '→', 'Create Notification', '→', 'Send In-App', '→', 'Send Email', '→', 'Optional WhatsApp'].map((s, i) => (
//                 <span key={i} className={`${s === '→' ? 'text-slate-400 font-bold' : 'rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 font-semibold text-blue-800'}`}>{s}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//     </AdminLayout>
//   );
// }


'use client';

// SRS 5.19: Settings — Organization, Attendance, Leave, Payroll
// SRS 5.14: WhatsApp Integration | SRS 5.15: Notification System

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Building2, Clock, CalendarDays, CreditCard, Bell,
  Save, CheckCircle2, MessageCircle, Globe, Upload,
  Plus, Trash2, ChevronDown, ChevronRight,
  Smartphone, Mail, MessageSquare, AlertCircle, X,
} from 'lucide-react';

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Field({ label, defaultValue, type = 'text', hint }: { label: string; defaultValue?: string; type?: string; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input type={type} defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function Select({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <select defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5 border-b border-slate-100 pb-4">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'org',           label: 'Organization',   icon: Building2   },
  { key: 'attendance',    label: 'Attendance',     icon: Clock        },
  { key: 'leave',         label: 'Leave',          icon: CalendarDays },
  { key: 'payroll',       label: 'Payroll',        icon: CreditCard   },
  { key: 'notifications', label: 'Notifications',  icon: Bell         },
  { key: 'whatsapp',      label: 'WhatsApp',       icon: MessageCircle},
] as const;

type TabKey = typeof TABS[number]['key'];

// ─── Leave Types State ────────────────────────────────────────────────────────
const initLeaveTypes = [
  { id: 1, name: 'Casual Leave',    days: 8,  paid: true,  carryFwd: 0,  approval: '2-Tier' },
  { id: 2, name: 'Sick Leave',      days: 5,  paid: true,  carryFwd: 0,  approval: 'HR' },
  { id: 3, name: 'Earned Leave',    days: 12, paid: true,  carryFwd: 30, approval: '2-Tier' },
  { id: 4, name: 'Maternity Leave', days: 90, paid: true,  carryFwd: 0,  approval: 'HR' },
  { id: 5, name: 'Paternity Leave', days: 5,  paid: true,  carryFwd: 0,  approval: 'HR' },
  { id: 6, name: 'Unpaid Leave',    days: 30, paid: false, carryFwd: 0,  approval: 'HR' },
];

// ─── Salary Components ────────────────────────────────────────────────────────
const initSalaryComponents = [
  { id: 1, name: 'Basic Salary',       type: 'Earning',   pct: 50,  fixed: null, active: true },
  { id: 2, name: 'HRA',                type: 'Earning',   pct: 20,  fixed: null, active: true },
  { id: 3, name: 'Special Allowance',  type: 'Earning',   pct: null,fixed: null, active: true },
  { id: 4, name: 'Bonus',              type: 'Earning',   pct: null,fixed: null, active: true },
  { id: 5, name: 'Overtime',           type: 'Earning',   pct: null,fixed: null, active: true },
  { id: 6, name: 'Provident Fund',     type: 'Deduction', pct: 12,  fixed: null, active: true },
  { id: 7, name: 'Professional Tax',   type: 'Deduction', pct: null,fixed: 200,  active: true },
  { id: 8, name: 'TDS / Income Tax',   type: 'Deduction', pct: null,fixed: null, active: true },
];

// ─── WhatsApp events ──────────────────────────────────────────────────────────
const whatsappEvents = [
  { key: 'payslip',    label: 'Payslip Generated',    icon: '💰', desc: 'Send payslip link via WhatsApp' },
  { key: 'leaveAp',   label: 'Leave Approved',        icon: '✅', desc: 'Notify employee on approval' },
  { key: 'leaveRej',  label: 'Leave Rejected',        icon: '❌', desc: 'Notify employee on rejection' },
  { key: 'attRem',    label: 'Attendance Reminder',   icon: '⏰', desc: 'Daily check-in reminder at 9 AM' },
  { key: 'birthday',  label: 'Birthday Wishes',       icon: '🎂', desc: 'Auto wish on birthday' },
  { key: 'joining',   label: 'Joining Notification',  icon: '👋', desc: 'Welcome message on joining' },
  { key: 'hrRem',     label: 'HR Reminder',           icon: '📋', desc: 'Pending actions reminders' },
];

// ─── Notification channels ────────────────────────────────────────────────────
const notifChannels = [
  { key: 'inapp',    label: 'In-App',        icon: Bell,          desc: 'Real-time in-app notifications' },
  { key: 'email',    label: 'Email',         icon: Mail,          desc: 'Email via configured SMTP' },
  { key: 'sms',      label: 'SMS',           icon: Smartphone,    desc: 'SMS via SMS gateway API' },
  { key: 'whatsapp', label: 'WhatsApp',      icon: MessageCircle, desc: 'WhatsApp Business API' },
  { key: 'push',     label: 'Push',          icon: AlertCircle,   desc: 'Mobile push notifications' },
];

const notifEvents = [
  { label: 'Leave Approved / Rejected',    channels: ['inapp','email','whatsapp'] },
  { label: 'Attendance Marked',            channels: ['inapp'] },
  { label: 'Payslip Generated',            channels: ['inapp','email','whatsapp'] },
  { label: 'New Announcement',             channels: ['inapp','email'] },
  { label: 'Task Assigned',                channels: ['inapp','email'] },
  { label: 'Helpdesk Ticket Updated',      channels: ['inapp','email'] },
  { label: 'Birthday Reminder',            channels: ['inapp','whatsapp'] },
  { label: 'Joining Welcome',              channels: ['inapp','email','whatsapp'] },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab]           = useState<TabKey>('org');
  const [toast, setToast]                   = useState('');
  const [leaveTypes, setLeaveTypes]         = useState(initLeaveTypes);
  const [salaryComps, setSalaryComps]       = useState(initSalaryComponents);
  const [channelToggles, setChannelToggles] = useState<Record<string, boolean>>({ inapp: true, email: true, sms: false, whatsapp: true, push: false });
  const [wpToggles, setWpToggles]           = useState<Record<string, boolean>>({ payslip: true, leaveAp: true, leaveRej: true, attRem: false, birthday: true, joining: true, hrRem: false });
  const [showAddLeave, setShowAddLeave]     = useState(false);
  const [newLeave, setNewLeave]             = useState({ name: '', days: '', paid: true });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const addLeaveType = () => {
    if (!newLeave.name || !newLeave.days) return;
    setLeaveTypes(prev => [...prev, { id: Date.now(), name: newLeave.name, days: Number(newLeave.days), paid: newLeave.paid, carryFwd: 0, approval: '2-Tier' }]);
    setNewLeave({ name: '', days: '', paid: true });
    setShowAddLeave(false);
    showToast('Leave type added');
  };

  const deleteLeave = (id: number) => setLeaveTypes(prev => prev.filter(l => l.id !== id));
  const toggleComp  = (id: number) => setSalaryComps(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));

  return (
    <AdminLayout pageTitle="Settings" breadcrumbs={[{ label: 'Settings' }]}>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />{toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">SRS 5.19 — Configure all system modules</p>
        </div>
        <button onClick={() => showToast('Settings saved successfully!')} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
          <Save className="h-4 w-4" />Save Changes
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      {/* ── SRS 5.19.1: Organization Settings ── */}
      {activeTab === 'org' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Company Information" desc="SRS 5.19.1 — Organization Settings" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Company Name"     defaultValue="Infinite Cloud Technologies Pvt. Ltd." />
              <Field label="Company Website"  defaultValue="https://infinitecloud.in" />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company Logo</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white">IC</div>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Upload className="h-4 w-4" />Upload Logo
                  </button>
                </div>
              </div>
              <Select label="Default Timezone" options={['Asia/Kolkata (IST +05:30)', 'UTC', 'America/New_York', 'Europe/London']} defaultValue="Asia/Kolkata (IST +05:30)" />
              <Select label="Base Currency"    options={['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)']} defaultValue="INR (₹)" />
              <Field label="Address Line 1"    defaultValue="Unit 401, TechPark Alpha" />
              <Field label="City / State"      defaultValue="Bengaluru, Karnataka" />
              <Field label="PIN Code"          defaultValue="560001" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Working Days & Holidays" desc="SRS 5.19.1 — Configure office calendar" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
                    const active = i < 5;
                    return (
                      <button key={d} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${active ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{d}</button>
                    );
                  })}
                </div>
              </div>
              <Select label="Financial Year Start" options={['April (India)', 'January', 'July']} defaultValue="April (India)" />
            </div>
            {/* Holiday list */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold text-slate-700">National Holidays 2026</p>
              <div className="space-y-2">
                {[
                  ['Oct 2',  'Gandhi Jayanti',     'National'],
                  ['Oct 12', 'Dussehra',           'National'],
                  ['Oct 20', 'Diwali',             'National'],
                  ['Dec 25', 'Christmas',          'National'],
                ].map(([date, name, type]) => (
                  <div key={name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 w-14">{date}</span>
                      <span className="text-sm font-semibold text-slate-900">{name}</span>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{type}</span>
                    </div>
                    <button className="text-slate-400 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
                <button className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 w-full">
                  <Plus className="h-3.5 w-3.5" />Add Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SRS 5.19.2: Attendance Settings ── */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Office Hours" desc="SRS 5.19.2 — Attendance Settings" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Shift Start Time"    defaultValue="09:00" type="time" />
              <Field label="Shift End Time"      defaultValue="18:00" type="time" />
              <Field label="Grace Period (mins)" defaultValue="15" hint="Late mark after grace period" />
              <Field label="Min Working Hours"   defaultValue="8"  hint="Hours/day for full day" />
              <Field label="Half Day Hours"      defaultValue="4"  hint="Hours/day for half day" />
              <Field label="Overtime Threshold (hrs)" defaultValue="9" hint="Hours after which overtime starts" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Break Rules — SRS 5.5.3" desc="FR-ATT-003 Break Management" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Max Break Duration (mins)" defaultValue="60" />
              <Field label="Number of Breaks Allowed"  defaultValue="2" />
              <Select label="Break Deduction Rule" options={['Auto-deduct 30 min', 'Track manually', 'No deduction']} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Attendance Methods — SRS 5.5.7" desc="FR-ATT-007 Supported methods" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Web Portal',  icon: '🌐', active: true },
                { label: 'Mobile App', icon: '📱', active: true },
                { label: 'GPS',        icon: '📍', active: false },
                { label: 'Biometric',  icon: '👆', active: false },
                { label: 'RFID',       icon: '💳', active: false },
                { label: 'API',        icon: '🔗', active: false },
              ].map(m => (
                <div key={m.label} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${m.active ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <span className="text-sm font-semibold text-slate-800">{m.icon} {m.label}</span>
                  <Toggle on={m.active} onToggle={() => {}} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SRS 5.19.3: Leave Settings ── */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <SectionHead title="Leave Types — SRS 5.6.1 FR-LEAVE-001" desc="Configure leave types, days, and carry-forward rules" />
              <button onClick={() => setShowAddLeave(true)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                <Plus className="h-4 w-4" />Add Type
              </button>
            </div>

            {showAddLeave && (
              <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Leave Name</label>
                    <input value={newLeave.name} onChange={e => setNewLeave(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Annual Leave"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Days Per Year</label>
                    <input value={newLeave.days} onChange={e => setNewLeave(f => ({ ...f, days: e.target.value }))} type="number" placeholder="12"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="flex items-end gap-2">
                    <button onClick={addLeaveType} className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700">Add</button>
                    <button onClick={() => setShowAddLeave(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"><X className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Leave Type', 'Days/Year', 'Paid', 'Carry Forward', 'Approval', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {leaveTypes.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-semibold text-slate-900">{l.name}</td>
                      <td className="px-4 py-3"><input type="number" defaultValue={l.days} className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" /></td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${l.paid ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {l.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3"><input type="number" defaultValue={l.carryFwd} className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" /></td>
                      <td className="px-4 py-3">
                        <select defaultValue={l.approval} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
                          {['2-Tier', 'HR', 'Manager', 'Auto'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteLeave(l.id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Approval Workflow — SRS 5.6.3 FR-LEAVE-003" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Leave Approval Flow" options={['Employee → Manager → HR', 'Employee → Manager', 'Employee → HR', 'Auto Approve']} />
              <Field  label="Max Consecutive Leave Days" defaultValue="15" />
              <Select label="Carry-Forward Policy"       options={['Max 30 days', 'No carry forward', 'Full carry forward']} />
              <Field  label="Leave Encashment (max days)" defaultValue="10" />
            </div>
          </div>
        </div>
      )}

      {/* ── SRS 5.19.4: Payroll Settings ── */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Payroll Cycle — SRS 5.7.2 FR-PAY-002" desc="Configure salary calculation and disbursement" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Payroll Cycle"         options={['Monthly (1st–Last)', 'Bi-weekly', 'Weekly']} />
              <Field  label="Disbursement Date"     defaultValue="1" hint="Day of month for salary credit" />
              <Select label="Payslip Generation"    options={['Auto on cycle end', 'Manual approval', 'After HR approval']} />
              <Field  label="Payslip Template"      defaultValue="Standard A4 — Indian Format" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Salary Components — SRS 5.7.1 FR-PAY-001" desc="Configure earnings and deductions" />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Component', 'Type', '% of Basic', 'Fixed Amount', 'Active'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {salaryComps.map(c => (
                    <tr key={c.id} className={`transition-colors ${c.active ? 'hover:bg-slate-50/70' : 'opacity-40'}`}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${c.type === 'Earning' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{c.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={c.pct ?? ''} placeholder="—" className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" defaultValue={c.fixed ?? ''} placeholder="—" className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <Toggle on={c.active} onToggle={() => toggleComp(c.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
              <Plus className="h-3.5 w-3.5" />Add Salary Component
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Payroll Approval — SRS 5.7.4 FR-PAY-004" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Approval Required By" options={['HR Manager', 'Finance Head', 'Both HR + Finance', 'Admin Only']} />
              <Select label="Processing Method"    options={['Single approval', 'Dual approval', 'Auto-process']} />
            </div>
          </div>
        </div>
      )}

      {/* ── SRS 5.15: Notification System ── */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Notification Channels — SRS 5.15" desc="Enable/disable notification delivery channels" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {notifChannels.map(({ key, label, icon: Icon, desc }) => (
                <div key={key} className={`flex items-start justify-between rounded-2xl border p-4 transition-all ${channelToggles[key] ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${channelToggles[key] ? 'bg-blue-100' : 'bg-slate-200'}`}>
                      <Icon className={`h-4 w-4 ${channelToggles[key] ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{label}</p>
                      <p className="text-[11px] text-slate-500">{desc}</p>
                    </div>
                  </div>
                  <Toggle on={channelToggles[key]} onToggle={() => setChannelToggles(p => ({ ...p, [key]: !p[key] }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="Event-based Notifications — SRS 5.15" desc="Configure which events trigger which channels" />
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Event</th>
                    {notifChannels.map(c => (
                      <th key={c.key} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notifEvents.map(ev => (
                    <tr key={ev.label} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-medium text-slate-800">{ev.label}</td>
                      {notifChannels.map(c => (
                        <td key={c.key} className="px-4 py-3 text-center">
                          <input type="checkbox" defaultChecked={ev.channels.includes(c.key)} className="h-4 w-4 rounded accent-blue-600" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SRS 5.14: WhatsApp Integration ── */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white text-xl shadow-lg shadow-emerald-600/30">💬</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">WhatsApp Business API</h3>
                  <p className="text-xs text-slate-600 mt-0.5">SRS 5.14 — Connect WhatsApp Business for automatic notifications</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Optional Feature</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="WhatsApp Business Account ID" defaultValue="" hint="From Meta Business Manager" />
              <Field label="Phone Number ID"              defaultValue="" hint="Business phone number ID" />
              <Field label="Access Token"                 type="password" hint="WhatsApp API Access Token" />
              <Field label="Webhook URL"                  defaultValue="https://your-domain.com/api/whatsapp/webhook" />
            </div>
            <div className="mt-4 flex gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Test Connection</button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">View Logs</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="WhatsApp Notification Events — SRS 5.14" desc="Configure which events send WhatsApp messages to employees" />
            <div className="space-y-3">
              {whatsappEvents.map(ev => (
                <div key={ev.key} className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition-all ${wpToggles[ev.key] ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{ev.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{ev.label}</p>
                      <p className="text-[11px] text-slate-500">{ev.desc}</p>
                    </div>
                  </div>
                  <Toggle on={wpToggles[ev.key]} onToggle={() => setWpToggles(p => ({ ...p, [ev.key]: !p[ev.key] }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHead title="WhatsApp Flow Diagram — SRS 5.14" />
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {['Payroll Generated', '→', 'Payslip Created', '→', 'WhatsApp Service', '→', 'Employee'].map((s, i) => (
                <span key={i} className={`${s === '→' ? 'text-slate-400 font-bold' : 'rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-800'}`}>{s}</span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {['Leave Approved', '→', 'Create Notification', '→', 'Send In-App', '→', 'Send Email', '→', 'Optional WhatsApp'].map((s, i) => (
                <span key={i} className={`${s === '→' ? 'text-slate-400 font-bold' : 'rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 font-semibold text-blue-800'}`}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}