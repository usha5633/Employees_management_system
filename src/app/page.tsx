// // 'use client';

// // import Link from 'next/link';
// // import {
// //   ShieldCheck, UserCog, Briefcase, UserCircle,
// //   ArrowRight, LayoutDashboard, Users, Clock,
// //   CalendarDays, CheckSquare, CreditCard, BarChart3,
// //   FolderKanban, ClipboardList, TrendingUp, FolderOpen,
// // } from 'lucide-react';

// // const panels = [
// //   {
// //     role: 'Admin Panel',
// //     tag: 'Full System Control',
// //     description: 'Manage entire organisation — employees, payroll, recruitment, performance, settings and more.',
// //     href: '/admin/dashboard',
// //     icon: ShieldCheck,
// //     gradient: 'from-blue-600 to-indigo-600',
// //     iconBg: 'bg-blue-600',
// //     badgeColor: 'bg-blue-100 text-blue-700',
// //     ring: 'ring-blue-500/30',
// //     cta: 'Open Admin Panel',
// //     ctaStyle: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25',
// //     accent: 'border-blue-600',
// //     features: [
// //       { icon: Users,       label: 'All Employees' },
// //       { icon: CreditCard,  label: 'Payroll' },
// //       { icon: BarChart3,   label: 'Reports' },
// //       { icon: TrendingUp,  label: 'Performance' },
// //     ],
// //   },
// //   {
// //     role: 'HR Panel',
// //     tag: 'HR Operations',
// //     description: 'Manage employee lifecycle, recruitment pipeline, leave approvals, attendance and documents.',
// //     href: '/hr',
// //     icon: UserCog,
// //     gradient: 'from-emerald-500 to-teal-600',
// //     iconBg: 'bg-emerald-600',
// //     badgeColor: 'bg-emerald-100 text-emerald-700',
// //     ring: 'ring-emerald-500/30',
// //     cta: 'Open HR Panel',
// //     ctaStyle: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
// //     accent: 'border-emerald-600',
// //     features: [
// //       { icon: Users,       label: 'Employees' },
// //       { icon: CalendarDays,label: 'Leave' },
// //       { icon: Clock,       label: 'Attendance' },
// //       { icon: FolderOpen,  label: 'Documents' },
// //     ],
// //   },
// //   {
// //     role: 'Manager Panel',
// //     tag: 'Team Management',
// //     description: 'Oversee your team, assign tasks, track projects, review performance and handle approvals.',
// //     href: '/manager',
// //     icon: Briefcase,
// //     gradient: 'from-violet-600 to-purple-600',
// //     iconBg: 'bg-violet-600',
// //     badgeColor: 'bg-violet-100 text-violet-700',
// //     ring: 'ring-violet-500/30',
// //     cta: 'Open Manager Portal',
// //     ctaStyle: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/25',
// //     accent: 'border-violet-600',
// //     features: [
// //       { icon: Users,        label: 'My Team' },
// //       { icon: FolderKanban, label: 'Projects' },
// //       { icon: CheckSquare,  label: 'Tasks' },
// //       { icon: ClipboardList,label: 'Approvals' },
// //     ],
// //   },
// //   {
// //     role: 'Employee Portal',
// //     tag: 'Self Service',
// //     description: 'Your personal portal — attendance, leave, tasks, payroll, documents and helpdesk.',
// //     href: '/employees',
// //     icon: UserCircle,
// //     gradient: 'from-rose-500 to-pink-600',
// //     iconBg: 'bg-rose-500',
// //     badgeColor: 'bg-rose-100 text-rose-700',
// //     ring: 'ring-rose-500/30',
// //     cta: 'Open Employee Portal',
// //     ctaStyle: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25',
// //     accent: 'border-rose-500',
// //     features: [
// //       { icon: Clock,        label: 'Attendance' },
// //       { icon: CalendarDays, label: 'Leave' },
// //       { icon: CheckSquare,  label: 'My Tasks' },
// //       { icon: CreditCard,   label: 'Payroll' },
// //     ],
// //   },
// // ];

// // const quickLinks = [
// //   { label: 'Admin Dashboard',    href: '/admin/dashboard',      color: 'text-blue-400 border-blue-800 hover:bg-blue-950' },
// //   { label: 'All Employees',      href: '/admin/employees',      color: 'text-blue-400 border-blue-800 hover:bg-blue-950' },
// //   { label: 'Payroll',            href: '/admin/payroll',        color: 'text-blue-400 border-blue-800 hover:bg-blue-950' },
// //   { label: 'HR Dashboard',       href: '/hr',                   color: 'text-emerald-400 border-emerald-800 hover:bg-emerald-950' },
// //   { label: 'Leave Approvals',    href: '/hr/leave',             color: 'text-emerald-400 border-emerald-800 hover:bg-emerald-950' },
// //   { label: 'Recruitment',        href: '/hr/recruitment',       color: 'text-emerald-400 border-emerald-800 hover:bg-emerald-950' },
// //   { label: 'Manager Dashboard',  href: '/manager',              color: 'text-violet-400 border-violet-800 hover:bg-violet-950' },
// //   { label: 'My Team',            href: '/manager/team',         color: 'text-violet-400 border-violet-800 hover:bg-violet-950' },
// //   { label: 'Approvals',          href: '/manager/approvals',    color: 'text-violet-400 border-violet-800 hover:bg-violet-950' },
// //   { label: 'Employee Dashboard', href: '/employees',            color: 'text-rose-400 border-rose-800 hover:bg-rose-950' },
// //   { label: 'My Attendance',      href: '/employees/attendance', color: 'text-rose-400 border-rose-800 hover:bg-rose-950' },
// //   { label: 'My Leave',           href: '/employees/leave',      color: 'text-rose-400 border-rose-800 hover:bg-rose-950' },
// //   { label: 'My Payroll',         href: '/employees/payroll',    color: 'text-rose-400 border-rose-800 hover:bg-rose-950' },
// //   { label: 'Helpdesk',           href: '/employees/helpdesk',   color: 'text-rose-400 border-rose-800 hover:bg-rose-950' },
// // ];

// // export default function LandingPage() {
// //   return (
// //     <div className="min-h-screen bg-slate-950 font-sans antialiased">
// //       <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
// //       <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-violet-950/20" />

// //       <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
// //         {/* Header */}
// //         <div className="mb-16 text-center">
// //           <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 px-5 py-2.5 backdrop-blur">
// //             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold text-white">IC</div>
// //             <span className="text-sm font-semibold text-slate-200">Infinite Cloud · HRMS</span>
// //           </div>
// //           <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
// //             4-Panel{' '}
// //             <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">HRMS</span>
// //             <br />System
// //           </h1>
// //           <p className="mx-auto mt-5 max-w-xl text-base text-slate-400">
// //             Choose your role to enter the respective panel. Fully interactive frontend with local state management.
// //           </p>
// //         </div>

// //         {/* 4 Panel Cards — 2x2 grid */}
// //         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
// //           {panels.map((panel) => {
// //             const Icon = panel.icon;
// //             return (
// //               <div key={panel.role} className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl`}>
// //                 <div className={`h-1 w-full bg-gradient-to-r ${panel.gradient}`} />
// //                 <div className="flex flex-1 flex-col p-6">
// //                   <div className="mb-4 flex items-start justify-between">
// //                     <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${panel.iconBg} shadow-lg`}>
// //                       <Icon className="h-6 w-6 text-white" />
// //                     </div>
// //                     <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${panel.badgeColor}`}>{panel.tag}</span>
// //                   </div>
// //                   <h2 className="text-xl font-bold text-white">{panel.role}</h2>
// //                   <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{panel.description}</p>
// //                   <div className="mt-4 grid grid-cols-2 gap-2">
// //                     {panel.features.map(({ icon: FIcon, label }) => (
// //                       <div key={label} className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2">
// //                         <FIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
// //                         <span className="truncate text-[11px] font-medium text-slate-300">{label}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <Link href={panel.href} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all ${panel.ctaStyle}`}>
// //                     {panel.cta}
// //                     <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
// //                   </Link>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {/* Quick Links */}
// //         <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur">
// //           <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">Quick Access — All Pages</p>
// //           <div className="flex flex-wrap justify-center gap-2">
// //             {quickLinks.map(({ label, href, color }) => (
// //               <Link key={label} href={href} className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${color}`}>
// //                 <LayoutDashboard className="h-3 w-3" />{label}
// //               </Link>
// //             ))}
// //           </div>
// //         </div>

// //         <p className="mt-8 text-center text-[11px] text-slate-700">Infinite Cloud EMS · 4-Panel HRMS · Frontend Demo · v2.0</p>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import Link from 'next/link';
// import {
//   ShieldCheck,
//   UserCog,
//   Briefcase,
//   UserCircle,
//   ArrowRight,
//   LayoutDashboard,
//   Users,
//   Clock,
//   CalendarDays,
//   CheckSquare,
//   CreditCard,
//   BarChart3,
//   FolderKanban,
//   ClipboardList,
//   TrendingUp,
//   FolderOpen,
// } from 'lucide-react';

// const panels = [
//   {
//     role: 'Admin Panel',
//     tag: 'Full Control',
//     description: 'Manage entire organization — employees, payroll, recruitment, performance, settings and more.',
//     href: '/admin/dashboard',
//     icon: ShieldCheck,
//     gradient: 'from-blue-600 to-indigo-600',
//     iconBg: 'bg-blue-600',
//     badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
//     cta: 'Open Admin Panel',
//     ctaStyle: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
//     features: [
//       { icon: Users, label: 'All Employees' },
//       { icon: CreditCard, label: 'Payroll' },
//       { icon: BarChart3, label: 'Reports' },
//       { icon: TrendingUp, label: 'Performance' },
//     ],
//   },
//   {
//     role: 'HR Panel',
//     tag: 'HR Operations',
//     description: 'Manage employee lifecycle, recruitment pipeline, leave approvals, attendance and documents.',
//     href: '/hr',
//     icon: UserCog,
//     gradient: 'from-emerald-500 to-teal-600',
//     iconBg: 'bg-emerald-600',
//     badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
//     cta: 'Open HR Panel',
//     ctaStyle: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
//     features: [
//       { icon: Users, label: 'Employees' },
//       { icon: CalendarDays, label: 'Leave' },
//       { icon: Clock, label: 'Attendance' },
//       { icon: FolderOpen, label: 'Documents' },
//     ],
//   },
//   {
//     role: 'Manager Panel',
//     tag: 'Team Operations',
//     description: 'Oversee your team, assign tasks, track projects, review performance and handle approvals.',
//     href: '/manager',
//     icon: Briefcase,
//     gradient: 'from-violet-600 to-purple-600',
//     iconBg: 'bg-violet-600',
//     badgeColor: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
//     cta: 'Open Manager Portal',
//     ctaStyle: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20',
//     features: [
//       { icon: Users, label: 'My Team' },
//       { icon: FolderKanban, label: 'Projects' },
//       { icon: CheckSquare, label: 'Tasks' },
//       { icon: ClipboardList, label: 'Approvals' },
//     ],
//   },
//   {
//     role: 'Employee Portal',
//     tag: 'Self Service',
//     description: 'Your personal portal — attendance, leave, tasks, payroll, documents and helpdesk.',
//     href: '/employees',
//     icon: UserCircle,
//     gradient: 'from-rose-500 to-pink-600',
//     iconBg: 'bg-rose-500',
//     badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
//     cta: 'Open Employee Portal',
//     ctaStyle: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20',
//     features: [
//       { icon: Clock, label: 'Attendance' },
//       { icon: CalendarDays, label: 'Leave' },
//       { icon: CheckSquare, label: 'My Tasks' },
//       { icon: CreditCard, label: 'Payroll' },
//     ],
//   },
// ];

// const quickLinks = [
//   { label: 'Admin Dashboard', href: '/admin/dashboard', color: 'text-blue-400 border-blue-900/60 hover:bg-blue-950/50' },
//   { label: 'All Employees', href: '/admin/employees', color: 'text-blue-400 border-blue-900/60 hover:bg-blue-950/50' },
//   { label: 'Payroll', href: '/admin/payroll', color: 'text-blue-400 border-blue-900/60 hover:bg-blue-950/50' },
//   { label: 'HR Dashboard', href: '/hr', color: 'text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/50' },
//   { label: 'Leave Approvals', href: '/hr/leave', color: 'text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/50' },
//   { label: 'Recruitment', href: '/hr/recruitment', color: 'text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/50' },
//   { label: 'Manager Dashboard', href: '/manager', color: 'text-violet-400 border-violet-900/60 hover:bg-violet-950/50' },
//   { label: 'My Team', href: '/manager/team', color: 'text-violet-400 border-violet-900/60 hover:bg-violet-950/50' },
//   { label: 'Approvals', href: '/manager/approvals', color: 'text-violet-400 border-violet-900/60 hover:bg-violet-950/50' },
//   { label: 'Employee Dashboard', href: '/employees', color: 'text-rose-400 border-rose-900/60 hover:bg-rose-950/50' },
//   { label: 'My Attendance', href: '/employees/attendance', color: 'text-rose-400 border-rose-900/60 hover:bg-rose-950/50' },
//   { label: 'My Leave', href: '/employees/leave', color: 'text-rose-400 border-rose-900/60 hover:bg-rose-950/50' },
//   { label: 'My Payroll', href: '/employees/payroll', color: 'text-rose-400 border-rose-900/60 hover:bg-rose-950/50' },
//   { label: 'Helpdesk', href: '/employees/helpdesk', color: 'text-rose-400 border-rose-900/60 hover:bg-rose-950/50' },
// ];

// export default function LandingPage() {
//   return (
//     <div className="relative min-h-screen bg-slate-950 font-sans antialiased selection:bg-blue-500 selection:text-white">
//       {/* Background patterns */}
//       <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
//       <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-violet-950/20" />

//       <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-14 text-center">
//           <div className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-2 backdrop-blur-md">
//             <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-black text-white">IC</div>
//             <span className="text-xs font-semibold tracking-wide text-slate-300">Infinite Cloud · Enterprise HRMS</span>
//           </div>

//           <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
//             4-Panel{' '}
//             <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
//               HRMS Platform
//             </span>
//           </h1>
//           <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
//             Select your panel to access your workspace.
//           </p>
//         </div>

//         {/* 4 Panel Cards */}
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//           {panels.map((panel) => {
//             const Icon = panel.icon;
//             return (
//               <div
//                 key={panel.role}
//                 className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl"
//               >
//                 <div className={`h-1 w-full bg-gradient-to-r ${panel.gradient}`} />
//                 <div className="flex flex-1 flex-col p-6">
//                   <div className="mb-4 flex items-center justify-between">
//                     <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${panel.iconBg} shadow-lg`}>
//                       <Icon className="h-6 w-6 text-white" />
//                     </div>
//                     <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${panel.badgeColor}`}>
//                       {panel.tag}
//                     </span>
//                   </div>

//                   <h2 className="text-xl font-bold text-white">{panel.role}</h2>
//                   <p className="mt-2 text-xs leading-relaxed text-slate-400 min-h-[40px]">{panel.description}</p>

//                   <div className="mt-5 grid grid-cols-2 gap-2">
//                     {panel.features.map(({ icon: FIcon, label }) => (
//                       <div
//                         key={label}
//                         className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-800/40 px-3 py-2 transition-colors group-hover:border-slate-700/80"
//                       >
//                         <FIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
//                         <span className="truncate text-[11px] font-medium text-slate-300">{label}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <Link
//                     href={panel.href}
//                     className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all ${panel.ctaStyle}`}
//                   >
//                     {panel.cta}
//                     <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Quick Links Section */}
//         <div className="mt-12 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md">
//           <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
//             Direct Module Shortcuts
//           </p>
//           <div className="flex flex-wrap justify-center gap-2">
//             {quickLinks.map(({ label, href, color }) => (
//               <Link
//                 key={label}
//                 href={href}
//                 className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${color}`}
//               >
//                 <LayoutDashboard className="h-3 w-3" />
//                 {label}
//               </Link>
//             ))}
//           </div>
//         </div>

//         <p className="mt-8 text-center text-[11px] font-medium text-slate-600">
//           Infinite Cloud EMS · 4-Panel HRMS · Enterprise Platform v2.0
//         </p>
//       </div>
//     </div>
//   );
// }

'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  UserCog,
  Briefcase,
  UserCircle,
  ArrowRight,
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CheckSquare,
  CreditCard,
  BarChart3,
  FolderKanban,
  ClipboardList,
  TrendingUp,
  FolderOpen,
  Cloud,
  Layers,
} from 'lucide-react';

const panels = [
  {
    role: 'Admin Panel',
    tag: 'Full Control',
    description: 'Manage entire organization — employees, payroll, recruitment & performance.',
    href: '/admin/dashboard',
    icon: ShieldCheck,
    gradient: 'from-blue-600 via-sky-500 to-indigo-600',
    iconBg: 'bg-gradient-to-tr from-blue-600 to-sky-500',
    badgeColor: 'bg-blue-500/10 text-sky-400 border border-sky-500/30',
    cta: 'Open Admin',
    ctaStyle: 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 shadow-sky-600/20',
    features: [
      { icon: Users, label: 'Employees' },
      { icon: CreditCard, label: 'Payroll' },
      { icon: BarChart3, label: 'Reports' },
      { icon: TrendingUp, label: 'Performance' },
    ],
  },
  {
    role: 'HR Panel',
    tag: 'HR Operations',
    description: 'Manage employee lifecycle, recruitment, leave approvals & attendance.',
    href: '/hr',
    icon: UserCog,
    gradient: 'from-emerald-500 via-teal-500 to-sky-500',
    iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    cta: 'Open HR',
    ctaStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20',
    features: [
      { icon: Users, label: 'Employees' },
      { icon: CalendarDays, label: 'Leave' },
      { icon: Clock, label: 'Attendance' },
      { icon: FolderOpen, label: 'Documents' },
    ],
  },
  {
    role: 'Manager Panel',
    tag: 'Team Governance',
    description: 'Oversee team members, assign tasks, track projects & approve requests.',
    href: '/manager',
    icon: Briefcase,
    gradient: 'from-indigo-600 via-purple-500 to-sky-500',
    iconBg: 'bg-gradient-to-tr from-indigo-600 to-purple-500',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
    cta: 'Open Manager',
    ctaStyle: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/20',
    features: [
      { icon: Users, label: 'My Team' },
      { icon: FolderKanban, label: 'Projects' },
      { icon: CheckSquare, label: 'Tasks' },
      { icon: ClipboardList, label: 'Approvals' },
    ],
  },
  {
    role: 'Employee Portal',
    tag: 'Self Service',
    description: 'Access attendance records, apply for leave, view payroll & helpdesk.',
    href: '/employees',
    icon: UserCircle,
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    iconBg: 'bg-gradient-to-tr from-sky-500 to-blue-600',
    badgeColor: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
    cta: 'Open Employee',
    ctaStyle: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/20',
    features: [
      { icon: Clock, label: 'Attendance' },
      { icon: CalendarDays, label: 'Leave' },
      { icon: CheckSquare, label: 'My Tasks' },
      { icon: CreditCard, label: 'Payroll' },
    ],
  },
];

const quickLinks = [
  { label: 'Admin Dashboard', href: '/admin/dashboard' },
  { label: 'All Employees', href: '/admin/employees' },
  { label: 'Payroll', href: '/admin/payroll' },
  { label: 'HR Dashboard', href: '/hr' },
  { label: 'Leave Approvals', href: '/hr/leave' },
  { label: 'Recruitment', href: '/hr/recruitment' },
  { label: 'Manager Dashboard', href: '/manager' },
  { label: 'My Team', href: '/manager/team' },
  { label: 'Approvals', href: '/manager/approvals' },
  { label: 'Employee Dashboard', href: '/employees' },
  { label: 'My Attendance', href: '/employees/attendance' },
  { label: 'My Leave', href: '/employees/leave' },
  { label: 'My Payroll', href: '/employees/payroll' },
  { label: 'Helpdesk', href: '/employees/helpdesk' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#060B16] font-sans antialiased selection:bg-sky-500 selection:text-white overflow-hidden">
      
      {/* ── REAL-TIME ANIMATED BACKGROUND CLOUDS & LIGHT GLOWS ────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        
        {/* Animated Pulsing Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[130px] animate-pulse [animation-duration:8s]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[550px] w-[550px] rounded-full bg-sky-500/20 blur-[140px] animate-pulse [animation-duration:10s]" />
        <div className="absolute top-[35%] left-[25%] h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[120px] animate-pulse [animation-duration:12s]" />

        {/* Floating Clouds Vector Animations */}
        <div className="absolute top-12 left-[8%] animate-[bounce_16s_infinite] opacity-15">
          <Cloud className="h-36 w-36 text-sky-400" />
        </div>
        <div className="absolute top-[45%] right-[6%] animate-[bounce_20s_infinite] opacity-10">
          <Cloud className="h-48 w-48 text-blue-300" />
        </div>
        <div className="absolute bottom-16 left-[22%] animate-[pulse_14s_infinite] opacity-10">
          <Cloud className="h-60 w-60 text-indigo-300" />
        </div>

        {/* Dynamic Subtle Sky Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/50 px-3.5 py-1 backdrop-blur-2xl shadow-lg shadow-sky-500/10">
            <Cloud className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-wider text-sky-300 uppercase">
              Infinite Cloud · Enterprise HRMS Platform
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            4-Panel{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              HRMS Suite
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs text-slate-400 font-medium">
            Select your dedicated role portal to enter your enterprise workspace.
          </p>
        </div>

        {/* 4 Panel Glassmorphism Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <div
                key={panel.role}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-sky-900/40 bg-slate-900/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:bg-slate-900/70 hover:shadow-2xl hover:shadow-sky-500/15"
              >
                {/* Glowing Gradient Line */}
                <div className={`h-1 w-full bg-gradient-to-r ${panel.gradient}`} />

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${panel.iconBg} text-white shadow-md transition-transform group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${panel.badgeColor}`}>
                      {panel.tag}
                    </span>
                  </div>

                  <h2 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                    {panel.role}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400 min-h-[32px] font-medium">
                    {panel.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-1.5">
                    {panel.features.map(({ icon: FIcon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-800/40 px-2.5 py-1.5 transition-colors group-hover:border-sky-500/20"
                      >
                        <FIcon className="h-3 w-3 shrink-0 text-sky-400" />
                        <span className="truncate text-[10px] font-bold text-slate-300">{label}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={panel.href}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white transition-all active:scale-[0.98] ${panel.ctaStyle}`}
                  >
                    {panel.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Shortcuts */}
        <div className="mt-8 rounded-2xl border border-sky-900/40 bg-slate-900/30 p-4 backdrop-blur-xl shadow-xl">
          <div className="mb-3 flex items-center justify-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-sky-300">
              Direct Module Shortcuts
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {quickLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-1.5 rounded-lg border border-sky-900/40 bg-sky-950/20 px-3 py-1.5 text-[11px] font-bold text-sky-300 hover:bg-sky-600 hover:text-white hover:border-sky-500 transition-all"
              >
                <LayoutDashboard className="h-3 w-3" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] font-semibold text-slate-500">
          Infinite Cloud HRMS Platform · Enterprise Infrastructure v2.0
        </p>
      </div>
    </div>
  );
}