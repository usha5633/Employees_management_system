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
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';

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
    label: 'Manager Portal',
    items: [
      { label: 'Dashboard',   href: '/manager/dashboard', icon: LayoutDashboard },
      { label: 'My Team',     href: '/manager/team',      icon: Users },
      { label: 'Projects',    href: '/manager/projects',  icon: FolderKanban },
      { label: 'Tasks',       href: '/manager/tasks',     icon: CheckSquare },
      { label: 'Approvals',   href: '/manager/approvals', icon: ClipboardList, badge: '4' },
      { label: 'Performance', href: '/manager/performance', icon: TrendingUp },
    ],
  },
  {
    label: 'Preferences',
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Glassmorphic Dark Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-[#0B1120]/95 text-slate-200 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
          <Link href="/manager/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 font-black text-white shadow-lg shadow-blue-600/30 transition-transform group-hover:scale-105">
              <span className="text-sm font-black">M</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">Manager</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">PORTAL</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400">Team Governance</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800/80 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                {group.label}
              </div>
              <nav className="space-y-1">
                {group.items.map(({ label, href, icon: Icon, badge }) => {
                  const isActive = pathname === href || (href === '/manager/dashboard' && pathname === '/manager');
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400 border border-blue-900/50'}`}>
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

        {/* Footer Status Box */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="rounded-xl border border-blue-900/30 bg-blue-950/20 p-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Portal Live
            </div>
            <p className="mt-1 text-[10px] text-slate-400">Manager Security Level 2</p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Glassmorphism Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[#0D1222] sm:text-xl">{title}</h1>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">{subtitle}</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden max-w-md flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team members, projects, approvals..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                </span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2 px-1">
                    <span className="text-xs font-bold text-[#0D1222]">Notifications</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">4 New</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="rounded-xl bg-slate-50 p-2.5 text-xs hover:bg-slate-100/80 transition-colors">
                      <p className="font-bold text-[#0D1222]">Leave Approval Requested</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Rohit Verma requested 2 days casual leave.</p>
                      <span className="mt-1 block text-[9px] font-semibold text-slate-400">15m ago</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 text-xs hover:bg-slate-100/80 transition-colors">
                      <p className="font-bold text-[#0D1222]">Sprint Task Overdue</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Mobile app layout design task is overdue.</p>
                      <span className="mt-1 block text-[9px] font-semibold text-slate-400">1h ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200/80" />

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-100/80 transition-colors"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white shadow-md shadow-blue-600/20">
                  M
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden text-left sm:block">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#0D1222]">Manager</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-medium text-slate-400">Team Lead</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
                  <div className="border-b border-slate-100 px-3 py-2 mb-1">
                    <p className="text-xs font-bold text-[#0D1222]">Manager Account</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">manager@company.com</p>
                  </div>
                  <div className="space-y-0.5">
                    <Link
                      href="/manager/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/manager/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="mt-1 border-t border-slate-100 pt-1">
                    <Link
                      href="/login"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Sign Out</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {actions && <div className="flex items-center">{actions}</div>}
          </div>
        </header>

        {/* Dynamic Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}