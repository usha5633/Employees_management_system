'use client';

import React from 'react';
import Link from 'next/link';
import { mockAnnouncements } from '@/data/dashboard';
import { Megaphone, Pin, ArrowRight } from 'lucide-react';

export const Announcements: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl backdrop-blur-xl">
      {/* Component Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-[#0D1222]">Announcements</h3>
            <p className="text-xs font-medium text-slate-500">Company broadcast & policy alerts</p>
          </div>
        </div>
        <Link 
          href="/admin/notifications"
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Announcements Cards List */}
      <div className="mt-5 space-y-3">
        {mockAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`relative rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              ann.isImportant
                ? 'border-blue-200 bg-blue-50/40 shadow-xs'
                : 'border-slate-200/70 bg-slate-50/50'
            }`}
          >
            {/* Pinned Badge */}
            {ann.isImportant && (
              <span className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                <Pin className="h-2.5 w-2.5" /> Pinned
              </span>
            )}

            {/* Category & Date Metadata */}
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200/80 shadow-2xs">
                {ann.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">{ann.date}</span>
            </div>

            {/* Title & Body Content */}
            <h4 className="mt-2 text-xs font-bold text-[#0D1222] sm:text-sm">{ann.title}</h4>
            <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
              {ann.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};