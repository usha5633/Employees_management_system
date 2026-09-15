'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  CreditCard,
  FolderOpen,
  MessageSquare,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ShieldCheck,
  X,
  Menu,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface NavItem { label: string; href: string; icon: React.ElementType; badge?: string; }
interface NavGroup { label: string; items: NavItem[]; }

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'My Dashboard',  href: '/employees/dashboard',  icon: LayoutDashboard },
      { label: 'My Profile',    href: '/employees/profile',    icon: User },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'My Attendance', href: '/employees/attendance', icon: Clock },
      { label: 'My Leave',      href: '/employees/leave',      icon: CalendarDays },
      { label: 'My Tasks',      href: '/employees/tasks',      icon: CheckSquare },
      { label: 'My Projects',   href: '/employees/projects',   icon: FolderKanban },
    ],
  },
  {
    label: 'Finance & Docs',
    items: [
      { label: 'My Payroll',    href: '/employees/payroll',    icon: CreditCard },
      { label: 'My Documents',  href: '/employees/documents',  icon: FolderOpen },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Communication', href: '/employees/communication', icon: MessageSquare },
      { label: 'Notifications', href: '/employees/notifications', icon: Bell,        badge: '3' },
      { label: 'Helpdesk',      href: '/employees/helpdesk',      icon: HelpCircle,  badge: '2' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings',      href: '/employees/settings',   icon: Settings },
    ],
  },
];

export default function EmployeePageShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen]           = useState(false);
  const [isProfileOpen, setIsProfileOpen]           = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <Link href="/employees" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30">
              <span className="text-[12px] font-extrabold">IC</span>
            </div>
            <div>
              <p className="text-[15px] font-bold leading-none tracking-tight text-white">Infinite <span className="text-blue-400">Cloud</span></p>
              <p className="mt-0.5 text-[10px] text-slate-400">Employee Portal</p>
            </div>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{group.label}</p>
              <nav className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon, badge }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span className="truncate">{label}</span>
                      </div>
                      {badge && (
                        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-slate-800 text-blue-400'}`}>{badge}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          {/* User Card */}
          <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-slate-800/60 px-3 py-2.5">
            <div className="relative h-8 w-8 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">RS</div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-slate-200">Rahul Sharma</p>
              <p className="truncate text-[10px] text-slate-400">Software Engineer</p>
            </div>
          </div>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors">
            <LogOut className="h-4 w-4" />Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-slate-900 leading-none">{title}</h1>
              <p className="hidden text-[11px] text-slate-500 sm:block mt-0.5">{subtitle}</p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden max-w-xs flex-1 px-6 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                </span>
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
                    <span className="text-sm font-bold text-slate-800">Notifications</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">3 New</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {[
                      { title: 'Leave Request Approved', body: 'Your sick leave for Sep 7 has been approved.', time: '30m ago', dot: 'bg-emerald-500' },
                      { title: 'Task Assigned',           body: 'You have been assigned "Review mockups".', time: '1h ago',  dot: 'bg-blue-500' },
                      { title: 'Payslip Available',       body: 'Your August payslip is ready.', time: '2h ago',  dot: 'bg-violet-500' },
                    ].map(n => (
                      <div key={n.title} className="flex gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                        <div>
                          <p className="text-[12px] font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500">{n.body}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2">
                    <Link href="/employees/notifications" onClick={() => setIsNotificationsOpen(false)} className="text-xs font-semibold text-blue-600 hover:underline">View all notifications →</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }} className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100">
                <div className="relative h-8 w-8 shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-blue-500/25">RS</div>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="hidden text-left sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-slate-900">Rahul Sharma</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <p className="text-[10px] text-slate-500">Employee</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
                  <div className="border-b border-slate-100 px-3 py-2 mb-1">
                    <p className="text-xs font-bold text-slate-900">Rahul Sharma</p>
                    <p className="text-[11px] text-slate-500">rahul@company.com</p>
                  </div>
                  {[
                    { href: '/employees/profile',  label: 'My Profile',  icon: User },
                    { href: '/employees/settings', label: 'Settings',    icon: Settings },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={label} href={href} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100">
                      <Icon className="h-3.5 w-3.5 text-slate-500" />{label}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-rose-600 hover:bg-rose-50">
                      <LogOut className="h-3.5 w-3.5" />Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {actions && <div className="ml-1 flex items-center">{actions}</div>}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
