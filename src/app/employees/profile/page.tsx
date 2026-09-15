'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
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
} from 'lucide-react';
import { useState, useEffect } from 'react';

const lifecycleSteps = [
  { label: 'Onboarding', done: true },
  { label: 'Active', active: true },
  { label: 'Transfer/Promotion' },
  { label: 'Leave/Exit' },
  { label: 'Offboarding' },
];

const restrictedInfo = [
  { title: 'Banking', description: 'Bank account, salary deposit, tax data', action: 'Request access' },
  { title: 'Government / Identity', description: 'Aadhaar, passport, DL, compliance records', action: 'Request access' },
];

function InfoBlock({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="profile-card p-5">
      <h3 className="mb-4 text-[15px] font-bold text-[#1E2A45]">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(({ label, value }) => (
          <div key={label} className="profile-info-tile p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7581A3]">{label}</div>
            <div className="mt-1 text-[13px] font-medium text-[#1E2A45]">{value}</div>
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
  const [profile, setProfile] = useState<any>(null);

  // Edit form states
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/profile');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setProfile(data.profile);
        setPhone(data.profile.phone);
        setLocation(data.profile.location);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/v1/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, location }),
      });

      if (res.ok) {
        setShowEditModal(false);
        fetchProfile();
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B6DF5]" />
      </div>
    );
  }

  return (
    <div className="profile-page-bg min-h-screen text-[#1E2A45]">
      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={() => setShowEditModal(false)}>
          <div className="w-full max-w-md rounded-[22px] border border-[#E7ECF5] bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E7ECF5] pb-3 mb-4">
              <h3 className="text-[16px] font-bold text-[#1E2A45]">Edit Contact Details</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#53627F] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#53627F] mb-1">Work Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="rounded-full border border-[#E7ECF5] px-4 py-2 text-[12px] font-semibold text-[#53627F]">Cancel</button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#3B6DF5] px-5 py-2 text-[12px] font-semibold text-white hover:bg-[#2F5FE7] disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1380px] px-4 py-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#667599]">
            <Link href="/employees" className="inline-flex items-center gap-2 font-medium text-[#3B6DF5] hover:text-[#2952C8]">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-[#99A6C2]" />
            <span className="font-semibold text-[#1E2A45]">My profile</span>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="profile-action-btn rounded-full border border-[#DDE6FF] bg-white px-4 py-2 text-[12px] font-semibold text-[#3B6DF5] shadow-sm hover:bg-[#F3F7FF]"
          >
            Edit profile
          </button>
        </div>

        <div className="profile-shell rounded-[26px] border border-[#E7ECF5] p-5 lg:p-7">
          <div className="grid gap-7 xl:grid-cols-[320px_1fr]">
            <aside className="profile-soft-card p-5">
              <div className="relative mx-auto mb-5 h-[112px] w-[112px]">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#D9E6FF] via-[#EEF4FF] to-[#C8D9FF] text-[34px] font-bold text-[#3B6DF5] shadow-[0_12px_30px_rgba(59,109,245,0.15)]">
                  {profile.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <button className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#3B6DF5] text-white shadow-lg transition hover:bg-[#2D5EE8]">
                  <Camera className="h-[17px] w-[17px]" />
                </button>
              </div>

              <div className="text-center">
                <h1 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#1E2A45]">{profile.name}</h1>
                <p className="mt-1 text-[14px] font-medium text-[#53627F]">{profile.designation}</p>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-[14px] bg-white px-4 py-3 shadow-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-[#7581A3]">Employee ID</div>
                  <div className="mt-1 text-[14px] font-bold text-[#1E2A45]">{profile.employeeId}</div>
                </div>
                <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-bold text-[#1DAA6E]">{profile.status}</span>
              </div>

              <div className="mt-5 space-y-3 text-[13px] text-[#53627F]">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#3B6DF5]" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#3B6DF5]" />
                  {profile.phone}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#3B6DF5]" />
                  {profile.location}
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="profile-soft-card p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7581A3]">Lifecycle status</div>
                    <h2 className="mt-1 text-[18px] font-bold text-[#1E2A45]">Employee journey</h2>
                  </div>
                  <span className="rounded-full bg-[#EAF0FF] px-2.5 py-1 text-[11px] font-bold text-[#3B6DF5]">Current stage</span>
                </div>

                <div className="grid gap-3 md:grid-cols-5">
                  {lifecycleSteps.map(({ label, done, active }, index) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full ${
                          done ? 'bg-[#2DBE72] text-white' : active ? 'bg-[#3B6DF5] text-white' : 'bg-[#E5EBF7] text-[#60729F]'
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className={`text-[12px] font-semibold ${active ? 'text-[#3B6DF5]' : done ? 'text-[#1DAA6E]' : 'text-[#6C7A99]'}`}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
                <div className="profile-card p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.08em] text-[#7581A3]">Reporting manager</div>
                      <h3 className="text-[16px] font-bold text-[#1E2A45]">Manager</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-[14px] bg-[#F8FAFF] p-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#DCE9FF] to-[#F1F5FF] text-[18px] font-bold text-[#3B6DF5]">
                      {profile.manager.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-[15px] font-bold text-[#1E2A45]">{profile.manager.name}</div>
                      <div className="text-[12px] text-[#53627F]">{profile.manager.designation}</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-[13px] text-[#53627F]">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#3B6DF5]" />
                      {profile.manager.email}
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#3B6DF5]" />
                      {profile.manager.phone}
                    </div>
                  </div>
                </div>

                <div className="profile-card p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.08em] text-[#7581A3]">Security</div>
                      <h3 className="text-[16px] font-bold text-[#1E2A45]">Password & security</h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-[13px] text-[#53627F]">
                    <div className="flex items-center justify-between rounded-[12px] bg-[#F8FAFF] p-3">
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#3B6DF5]" />
                        Last password change
                      </span>
                      <span className="font-semibold text-[#1E2A45]">{profile.security.lastPasswordChange}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-[12px] bg-[#F8FAFF] p-3">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#3B6DF5]" />
                        Last login
                      </span>
                      <span className="font-semibold text-[#1E2A45]">{profile.security.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-card p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[12px] uppercase tracking-[0.08em] text-[#7581A3]">Documents</div>
                    <h3 className="text-[16px] font-bold text-[#1E2A45]">Official records</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {profile.documents.map(({ name, status, state }: any) => (
                    <div key={name} className="rounded-[14px] border border-[#E7ECF5] bg-[#F8FAFF] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-[#3B6DF5] shadow-sm">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            state === 'success' ? 'bg-[#EAF7EE] text-[#1DAA6E]' : 'bg-[#FFF3D8] text-[#C98900]'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="text-[14px] font-bold text-[#1E2A45]">{name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-card p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[12px] uppercase tracking-[0.08em] text-[#7581A3]">Assets</div>
                    <h3 className="text-[16px] font-bold text-[#1E2A45]">Assigned company assets</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {profile.assets.map(({ name, details, tone }: any) => (
                    <div key={name} className="rounded-[14px] border border-[#E7ECF5] bg-[#F8FAFF] p-4">
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[10px] ${
                          tone === 'blue'
                            ? 'bg-[#EAF0FF] text-[#3B6DF5]'
                            : tone === 'purple'
                            ? 'bg-[#F0EBFF] text-[#7B5AF0]'
                            : 'bg-[#EAF7EE] text-[#1DAA6E]'
                        }`}
                      >
                        {name === 'Laptop' ? <Laptop className="h-5 w-5" /> : name === 'SIM card' ? <Smartphone className="h-5 w-5" /> : <IdCard className="h-5 w-5" />}
                      </div>
                      <div className="text-[14px] font-bold text-[#1E2A45]">{name}</div>
                      <div className="mt-1 text-[12px] text-[#53627F]">{details}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-card p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[12px] uppercase tracking-[0.08em] text-[#7581A3]">Restricted info</div>
                    <h3 className="text-[16px] font-bold text-[#1E2A45]">Sensitive access</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {restrictedInfo.map(({ title, description, action }) => (
                    <div key={title} className="flex items-center justify-between gap-4 rounded-[14px] border border-[#E7ECF5] bg-[#F8FAFF] p-4">
                      <div>
                        <div className="text-[14px] font-bold text-[#1E2A45]">{title}</div>
                        <div className="mt-1 text-[12px] text-[#53627F]">{description}</div>
                      </div>
                      <button className="profile-action-btn rounded-full bg-[#EAF0FF] px-3 py-2 text-[11px] font-bold text-[#3B6DF5] hover:bg-[#DEE9FF]">
                        {action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-3">
                <InfoBlock title="Personal information" items={profile.personalInfo} />
                <InfoBlock title="Employment information" items={profile.employmentInfo} />
                <InfoBlock title="Emergency information" items={profile.emergencyInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}