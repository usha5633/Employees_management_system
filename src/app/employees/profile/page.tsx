'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  FileText,
  IdCard,
  Laptop,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  UserCircle2,
  Wallet,
  Loader2,
  X,
  Sparkles,
  Edit3,
  Building,
  BadgeCheck,
  Send,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const restrictedInfo = [
  { title: 'Bank Account & Salary Wire', description: 'Direct deposit accounts, payslips, and tax withholding', action: 'Request Clearance' },
  { title: 'Identity & National Records', description: 'Tax registration, identity certificates, and legal files', action: 'Request Clearance' },
];

function InfoCard({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-blue-400/40 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">{title}</h3>
        <div className="h-2 w-2 rounded-full bg-blue-500" />
      </div>
      <div className="grid gap-3.5 md:grid-cols-2">
        {items.map(({ label, value }) => (
          <div key={label} className="group rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all hover:bg-blue-50/40 hover:border-blue-100">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">{label}</div>
            <div className="mt-1 text-xs font-bold text-slate-800">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EmployeeProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Server States
  const [profile, setProfile] = useState<any>(null);
  const [lifecycle, setLifecycle] = useState<any[]>([]);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/lifecycle');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setLifecycle(data.lifecycle || []);
        setName(data.profile.name);
        setPhone(data.profile.phone);
        setLocation(data.profile.location);
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // 1. Edit Profile & Transmit to Admin, HR & Manager
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/v1/lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'UPDATE_PROFILE', name, phone, location }),
      });

      if (res.ok) {
        setShowEditModal(false);
        await fetchProfileData();
        triggerToast('Profile saved & dispatched to Admin, HR & Manager!');
      } else {
        triggerToast('Failed to sync profile changes.');
      }
    } catch (err) {
      triggerToast('Error updating backend database.');
    } finally {
      setSaving(false);
    }
  };

  // 2. Interactive Lifecycle Stage Status Toggle
  const handleLifecycleStepClick = async (step: any) => {
    const nextStatus = step.status === 'Completed' ? 'Active' : step.status === 'Active' ? 'Pending' : 'Completed';
    try {
      const res = await fetch('/api/v1/lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'UPDATE_LIFECYCLE',
          stepId: step.id,
          nextStatus,
        }),
      });

      if (res.ok) {
        await fetchProfileData();
        triggerToast(`Stage "${step.label}" marked as ${nextStatus}. Admin & HR notified!`);
      }
    } catch (err) {
      console.error('Lifecycle status update error:', err);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-xl animate-bounce">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Glassmorphism Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-all"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Profile Details</h3>
                  <p className="text-[11px] font-bold text-slate-400">Syncs to Admin, HR & Manager Portals</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Work Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Save & Dispatch Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-[1380px] px-4 py-8 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/employees" className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Employee Portal
            </Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="font-extrabold text-slate-900">Executive Profile & Lifecycle</span>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-95"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Hero Profile Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
          <div className="h-36 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-6">
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
                Synced with Admin, HR & Manager
              </span>
            </div>
          </div>

          <div className="relative px-6 pb-6 pt-0">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between -mt-14">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
                <div className="relative h-28 w-28 shrink-0">
                  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-3xl font-black text-white shadow-xl ring-4 ring-white">
                    {profile.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-2xl border-2 border-white bg-blue-600 text-white shadow-md transition-transform hover:scale-105 active:scale-95">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
                  <p className="text-xs font-bold text-blue-600">{profile.designation}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2 text-center">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Employee ID</div>
                  <div className="text-xs font-black text-slate-800">{profile.employeeId}</div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-center">
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Status</div>
                  <div className="text-xs font-black text-emerald-700">{profile.status}</div>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                <span>{profile.department}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 5-Stage Career Lifecycle Component */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">Lifecycle Engine</span>
                <h2 className="text-base font-black text-slate-900">Career Progress Tracker (5 Stages)</h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 border border-blue-200">
                Click stage to switch status & alert HR
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              {lifecycle.map((step) => {
                const isCompleted = step.status === 'Completed';
                const isActive = step.status === 'Active';

                return (
                  <div
                    key={step.id}
                    onClick={() => handleLifecycleStepClick(step)}
                    className={`group cursor-pointer flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300 select-none ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60'
                        : isActive
                        ? 'border-blue-500/50 bg-blue-50/60 shadow-md ring-2 ring-blue-500/20 hover:bg-blue-100/50'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80'
                    }`}
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black transition-transform group-hover:scale-110 ${
                          isCompleted ? 'bg-emerald-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          isCompleted ? 'bg-emerald-100 text-emerald-700' : isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <h4 className={`text-xs font-black ${isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {step.label}
                      </h4>
                      <p className="mt-1 text-[10px] font-medium text-slate-500 line-clamp-2">{step.description}</p>
                    </div>

                    <div className="mt-4 border-t border-slate-200/60 pt-2 flex items-center justify-between text-[9px] font-extrabold text-slate-400">
                      <span>{step.updatedBy}</span>
                      <span>{step.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Details Sections */}
          <div className="grid gap-6 xl:grid-cols-3">
            <InfoCard title="Personal Information" items={profile.personalInfo} />
            <InfoCard title="Employment Profile" items={profile.employmentInfo} />
            <InfoCard title="Emergency Contacts" items={profile.emergencyInfo} />
          </div>

          {/* Reporting Officer & Security Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Direct Manager */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Hierarchy</span>
                  <h3 className="text-sm font-black text-slate-900">Reporting Officer</h3>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-md">
                  {profile.manager.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black text-slate-900">{profile.manager.name}</div>
                  <div className="text-xs font-bold text-slate-400">{profile.manager.designation}</div>
                </div>
                <div className="space-y-1 text-right text-xs font-semibold text-slate-600">
                  <div>{profile.manager.email}</div>
                  <div>{profile.manager.phone}</div>
                </div>
              </div>
            </div>

            {/* Authentication & Access */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Security</span>
                  <h3 className="text-sm font-black text-slate-900">Authentication Controls</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100">
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    Last Password Change
                  </span>
                  <span className="font-bold text-slate-900">{profile.security.lastPasswordChange}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Active Session Activity
                  </span>
                  <span className="font-bold text-slate-900">{profile.security.lastLogin}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Records & Inventory Assets */}
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Document Verification */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Verification</span>
                  <h3 className="text-sm font-black text-slate-900">Official Record Files</h3>
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                {profile.documents.map(({ name, status, state }: any) => (
                  <div key={name} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition-all hover:bg-white hover:border-blue-200">
                    <div className="mb-2 flex items-center justify-between">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        state === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Inventory</span>
                  <h3 className="text-sm font-black text-slate-900">Assigned Company Assets</h3>
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-3">
                {profile.assets.map(({ name, details, tone }: any) => (
                  <div key={name} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition-all hover:bg-white hover:border-blue-200">
                    <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${
                      tone === 'blue' ? 'bg-blue-50 text-blue-600' : tone === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {name === 'Workstation' ? <Laptop className="h-4 w-4" /> : name === 'Corporate Mobile' ? <Smartphone className="h-4 w-4" /> : <IdCard className="h-4 w-4" />}
                    </div>
                    <div className="text-xs font-bold text-slate-900">{name}</div>
                    <div className="mt-1 text-[10px] font-semibold text-slate-400">{details}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sensitive Clearance Access */}
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Restricted Data</span>
                <h3 className="text-sm font-black text-slate-900">Sensitive Information Access</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {restrictedInfo.map(({ title, description, action }) => (
                <div key={title} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{title}</div>
                    <div className="mt-1 text-[11px] font-medium text-slate-400">{description}</div>
                  </div>
                  <button
                    onClick={() => triggerToast(`Clearance request sent to HR for ${title}`)}
                    className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shrink-0"
                  >
                    {action}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}