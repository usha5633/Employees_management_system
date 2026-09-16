'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  CreditCard, TrendingUp, Bell, BarChart3, Settings,
  ShieldAlert, Puzzle, Target, UserCog, LogOut, X, Sparkles,
} from 'lucide-react';

interface SidebarProps { 
  isOpen: boolean; 
  onClose: () => void; 
}

interface NavItem { 
  name: string; 
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
    label: 'Core Governance',
    items: [
      { name: 'Dashboard',     href: '/admin/dashboard',   icon: LayoutDashboard },
      { name: 'Employees',     href: '/admin/employees',   icon: Users },
      { name: 'Organization',  href: '/admin/organization',icon: Building2 },
      { name: 'HR Management', href: '/admin/hr',          icon: UserCog },
      { name: 'Managers',      href: '/admin/managers',    icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Attendance',    href: '/admin/attendance',  icon: Clock },
      { name: 'Leave',         href: '/admin/leave',       icon: CalendarDays, badge: '5' },
      { name: 'Payroll',       href: '/admin/payroll',     icon: CreditCard },
      { name: 'Performance',   href: '/admin/performance', icon: TrendingUp },
      { name: 'Recruitment',   href: '/admin/recruitment', icon: Target },
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
    label: 'System Control',
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
      {/* Mobile Glass Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-md lg:hidden transition-opacity" 
          onClick={onClose} 
        />
      )}

      {/* Glassmorphic Dark Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-[#0B1120]/95 text-slate-200 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-5">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 font-black text-white shadow-lg shadow-blue-600/30 transition-transform group-hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">EMS / HRMS</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">ADMIN</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400">Super Admin Panel</p>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800/80 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Groups Container */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                {group.label}
              </p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (pathname === '/' && item.href === '/admin/dashboard');

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-800 text-blue-400 border border-blue-900/50'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Status & Sign Out Footer */}
        <div className="shrink-0 border-t border-slate-800/80 p-3.5">
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-blue-900/30 bg-blue-950/20 p-2.5 backdrop-blur-md">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white shadow-sm">
              AD
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-200">Admin User</p>
              <p className="truncate text-[10px] font-medium text-slate-400">Super Administrator</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
};