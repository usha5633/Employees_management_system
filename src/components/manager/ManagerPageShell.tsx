'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  ClipboardList,
  TrendingUp,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  X,
  Menu,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Manager',
    items: [
      { label: 'Dashboard',   href: '/manager',             icon: LayoutDashboard },
      { label: 'My Team',     href: '/manager/team',        icon: Users },
      { label: 'Projects',    href: '/manager/projects',    icon: FolderKanban },
      { label: 'Tasks',       href: '/manager/tasks',       icon: CheckSquare },
      { label: 'Approvals',   href: '/manager/approvals',   icon: ClipboardList, badge: '4' },
      { label: 'Performance', href: '/manager/performance', icon: TrendingUp },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings', href: '/manager/settings', icon: Settings },
    ],
  },
];

export default function ManagerPageShell({
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
  const [isSidebarOpen, setIsSidebarOpen]       = useState(false);
  const [isProfileOpen, setIsProfileOpen]       = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900 antialiased">

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <Link href="/manager" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/30">
              <span className="text-[13px] font-bold">M</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">Manager</span>
              <span className="ml-1 text-xs font-semibold uppercase tracking-wider text-violet-400">Portal</span>
              <p className="text-[10px] text-slate-400">Team Management</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                {group.label}
              </div>
              <nav className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon, badge }) => {
                  const isActive = pathname === href || (href === '/manager' && pathname === '/manager');
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-violet-400 group-hover:bg-slate-700'}`}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-lg bg-slate-800/50 p-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              Manager: Active
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Team Lead Access</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
              <p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p>
            </div>
          </div>

          <div className="hidden max-w-md flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team, tasks, projects..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden">
              <Search className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-600" />
                </span>
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                    <span className="text-sm font-semibold text-slate-800">Notifications</span>
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">4 New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                    <div className="p-3 hover:bg-slate-50">
                      <p className="font-medium text-slate-800">Leave Approval Pending</p>
                      <p className="text-slate-500">Rohit Verma requested 2 days leave.</p>
                      <span className="mt-1 block text-[10px] text-slate-400">15m ago</span>
                    </div>
                    <div className="p-3 hover:bg-slate-50">
                      <p className="font-medium text-slate-800">Task Overdue</p>
                      <p className="text-slate-500">Design Sprint task is past deadline.</p>
                      <span className="mt-1 block text-[10px] text-slate-400">1h ago</span>
                    </div>
                    <div className="p-3 hover:bg-slate-50">
                      <p className="font-medium text-slate-800">Performance Review Due</p>
                      <p className="text-slate-500">Q3 reviews are due this Friday.</p>
                      <span className="mt-1 block text-[10px] text-slate-400">3h ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200" />

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-slate-100"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-violet-600 ring-2 ring-violet-500/30 flex items-center justify-center text-white font-bold text-sm">
                  M
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden text-left sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900">Manager</span>
                    <ShieldCheck className="h-4 w-4 text-violet-600" />
                  </div>
                  <p className="text-xs text-slate-500">Team Lead</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-900">Manager</p>
                    <p className="text-[11px] text-slate-500">manager@company.com</p>
                  </div>
                  <div className="py-1 text-xs text-slate-700">
                    <Link href="/manager/settings" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-slate-100">
                      <User className="h-4 w-4 text-slate-500" />
                      <span>Profile</span>
                    </Link>
                    <Link href="/manager/settings" onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-slate-100">
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 pt-1 text-xs text-rose-600">
                    <button onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-rose-50">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {actions && <div className="flex items-center">{actions}</div>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
