'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Clock, CalendarDays, FileText,
  UserPlus, X, CreditCard, TrendingUp, Bell, BarChart3, Settings,
  ShieldAlert, Puzzle, Target, UserCog, LogOut,
} from 'lucide-react';

interface SidebarProps { isOpen: boolean; onClose: () => void; }
interface NavItem { name: string; href: string; icon: React.ElementType; badge?: string; }
interface NavGroup { label: string; items: NavItem[]; }

const navGroups: NavGroup[] = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard',    href: '/admin/dashboard',   icon: LayoutDashboard },
      { name: 'Employees',    href: '/admin/employees',   icon: Users },
      { name: 'Organization', href: '/admin/organization',icon: Building2 },
      { name: 'HR Management',href: '/admin/hr',          icon: UserCog },
      { name: 'Managers',     href: '/admin/managers',    icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Attendance',  href: '/admin/attendance',  icon: Clock },
      { name: 'Leave',       href: '/admin/leave',       icon: CalendarDays, badge: '5' },
      { name: 'Payroll',     href: '/admin/payroll',     icon: CreditCard },
      { name: 'Performance', href: '/admin/performance', icon: TrendingUp },
      { name: 'Recruitment', href: '/admin/recruitment', icon: Target },
    ],
  },
  {
    label: 'Insights',
    items: [
      { name: 'Reports',       href: '/admin/reports',       icon: BarChart3 },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: '3' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings',     href: '/admin/settings',     icon: Settings },
      { name: 'Audit Logs',   href: '/admin/audit-logs',   icon: ShieldAlert },
      { name: 'Integrations', href: '/admin/integrations', icon: Puzzle },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[15px] font-bold leading-none tracking-tight text-white">EMS <span className="text-blue-400 text-xs font-semibold">/ HRMS</span></p>
              <p className="mt-0.5 text-[10px] text-slate-400">Admin Control Panel</p>
            </div>
          </Link>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{group.label}</p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (pathname === '/' && item.href === '/admin/dashboard');
                  return (
                    <Link key={item.name} href={item.href} onClick={onClose}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-white/25 text-white' : 'bg-slate-800 text-blue-400'}`}>{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-slate-800/60 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">AD</div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-slate-200">Admin User</p>
              <p className="truncate text-[10px] text-slate-400">Super Administrator</p>
            </div>
          </div>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors">
            <LogOut className="h-4 w-4" />Sign out
          </button>
        </div>
      </aside>
    </>
  );
};
