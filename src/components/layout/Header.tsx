'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { mockUserData } from '@/data/dashboard';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close Dropdowns on Outside Click
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
      
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-black tracking-tight text-[#0D1222] sm:text-xl leading-none">
            Dashboard
          </h1>
          <p className="hidden text-xs font-medium text-slate-500 sm:block mt-1">
            Overview of HR operations & organization activity
          </p>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden max-w-md flex-1 px-8 md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, departments, requests..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2 pl-10 pr-12 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-extrabold text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Support Link Button */}
        <button
          className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          title="HR Support & Documentation"
        >
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
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2 px-1">
                <span className="text-xs font-bold text-[#0D1222]">Notifications</span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
                  3 New
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="rounded-xl bg-slate-50 p-2.5 text-xs hover:bg-slate-100/80 transition-colors">
                  <p className="font-bold text-[#0D1222]">Leave Request Approved</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Rajesh approved Sneha&apos;s sick leave request.</p>
                  <span className="mt-1 block text-[9px] font-semibold text-slate-400">10m ago</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 text-xs hover:bg-slate-100/80 transition-colors">
                  <p className="font-bold text-[#0D1222]">New Employee Joined</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Ananya Roy onboarded to Engineering department.</p>
                  <span className="mt-1 block text-[9px] font-semibold text-slate-400">1h ago</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 text-xs hover:bg-slate-100/80 transition-colors">
                  <p className="font-bold text-[#0D1222]">Attendance Report Ready</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Monthly attendance summary generated.</p>
                  <span className="mt-1 block text-[9px] font-semibold text-slate-400">3h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200/80" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100/80 transition-colors"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-blue-600/20 shadow-xs">
              <img
                src={mockUserData.avatar}
                alt={mockUserData.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden text-left sm:block">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#0D1222]">{mockUserData.name}</span>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <p className="text-[10px] font-medium text-slate-400">{mockUserData.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
              <div className="border-b border-slate-100 px-3 py-2 mb-1">
                <p className="text-xs font-bold text-[#0D1222]">{mockUserData.name}</p>
                <p className="text-[11px] font-medium text-slate-400 truncate">{mockUserData.email}</p>
              </div>
              <div className="space-y-0.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Account Settings</span>
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
      </div>
    </header>
  );
};