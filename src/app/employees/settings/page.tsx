'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { 
  Bell, Check, Eye, Lock, MoonStar, Palette, Shield, 
  User, Users, Loader2, Sparkles, Save
} from 'lucide-react';
import { useState, useEffect } from 'react';

const notificationOptions = [
  'Email notifications',
  'Leave notifications',
  'Attendance reminders',
  'Payroll notifications',
  'Announcement notifications',
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Form States
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState('Light mode');
  const [securityInfo, setSecurityInfo] = useState({
    twoFactorEnabled: true,
    lastLogin: 'Today, 09:42 AM • IP: 172.16.24.13',
  });

  const isDark = theme === 'Dark mode';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch live data from Database via API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setProfile(data.settings.profile);
          setNotifications(data.settings.notifications);
          setTheme(data.settings.theme);
          setSecurityInfo(data.settings.security);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 2. Dynamic Update Request to Backend API
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, notifications, theme }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('Profile & Settings updated in Database!');
      } else {
        triggerToast('Failed to save to database.');
      }
    } catch (err) {
      triggerToast('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (option: string) => {
    const nextState = !notifications[option];
    setNotifications((prev) => ({
      ...prev,
      [option]: nextState,
    }));
    triggerToast(`${option} set to ${nextState ? 'ON' : 'OFF'}`);
  };

  const toggle2FA = () => {
    setSecurityInfo((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
    triggerToast(`2FA ${!securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#0B0F19] text-white' : 'bg-transparent text-slate-900'}`}>
      <EmployeePageShell
        title="Account & Preference Settings"
        subtitle="Manage your profile information, authentication security, and notification triggers."
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Changes</span>
          </button>
        }
      >
        {/* Dynamic Toast Popup */}
        {toastMessage && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-blue-200 bg-white text-slate-800'
          }`}>
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          
          {/* Dynamic Profile Settings */}
          <div className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-colors ${
            isDark ? 'border-slate-800/80 bg-slate-900/90' : 'border-slate-200/80 bg-white/90'
          }`}>
            <div className={`mb-5 flex items-center gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">Personal Details</span>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#0D1222]'}`}>Profile Settings</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={`mb-1 block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                <input
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-colors ${
                    isDark 
                      ? 'border-slate-800 bg-slate-800/60 text-white focus:border-blue-500' 
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-800 focus:border-blue-600 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1 block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Corporate Email</label>
                <input
                  value={profile.email}
                  disabled
                  className={`w-full cursor-not-allowed rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none ${
                    isDark ? 'border-slate-800/60 bg-slate-950/40 text-slate-500' : 'border-slate-200/80 bg-slate-100/80 text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1 block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 Phone number"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-colors ${
                    isDark 
                      ? 'border-slate-800 bg-slate-800/60 text-white focus:border-blue-500' 
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-800 focus:border-blue-600 focus:bg-white'
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1 block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>City</label>
                <input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-colors ${
                    isDark 
                      ? 'border-slate-800 bg-slate-800/60 text-white focus:border-blue-500' 
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-800 focus:border-blue-600 focus:bg-white'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`mb-1 block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Address</label>
                <input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium outline-none transition-colors ${
                    isDark 
                      ? 'border-slate-800 bg-slate-800/60 text-white focus:border-blue-500' 
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-800 focus:border-blue-600 focus:bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl transition-colors ${
            isDark ? 'border-slate-800/80 bg-slate-900/90' : 'border-slate-200/80 bg-white/90'
          }`}>
            <div className={`mb-5 flex items-center gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">Access Control</span>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#0D1222]'}`}>Account Security</h3>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className={`flex items-center justify-between rounded-2xl p-3.5 border transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-blue-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Change Password</span>
                </div>
                <button
                  onClick={() => triggerToast('Password update request sent to email.')}
                  className="rounded-xl bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 text-xs font-bold text-blue-500 hover:bg-blue-600 hover:text-white transition-all"
                >
                  Update
                </button>
              </div>

              <div className={`flex items-center justify-between rounded-2xl p-3.5 border transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Two-Factor Authentication</span>
                </div>
                <button
                  onClick={toggle2FA}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    securityInfo.twoFactorEnabled
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {securityInfo.twoFactorEnabled ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>

              <div className={`rounded-2xl p-3.5 border transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="mb-1 flex items-center gap-3">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Login Security Status</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">Last login: {securityInfo.lastLogin}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Notification Triggers */}
          <div className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl xl:col-span-2 transition-colors ${
            isDark ? 'border-slate-800/80 bg-slate-900/90' : 'border-slate-200/80 bg-white/90'
          }`}>
            <div className={`mb-5 flex items-center gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">Preferences</span>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#0D1222]'}`}>Notification Triggers</h3>
              </div>
            </div>

            <div className="grid gap-3.5 md:grid-cols-2">
              {notificationOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleNotification(option)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl p-3.5 text-xs font-bold border transition-colors select-none ${
                    isDark 
                      ? 'bg-slate-800/40 border-slate-800 text-slate-200 hover:bg-slate-800/80' 
                      : 'bg-slate-50/80 border-slate-200/60 text-slate-800 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{option}</span>
                  <span
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                      notifications[option] ? 'bg-blue-600' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
                        notifications[option] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Switcher */}
          <div className={`rounded-3xl border p-6 shadow-xl backdrop-blur-xl xl:col-span-2 transition-colors ${
            isDark ? 'border-slate-800/80 bg-slate-900/90' : 'border-slate-200/80 bg-white/90'
          }`}>
            <div className={`mb-5 flex items-center gap-3 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500">Interface Theme</span>
                <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#0D1222]'}`}>Theme Options</h3>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Light mode', icon: Check },
                { label: 'Dark mode', icon: MoonStar },
                { label: 'Blue theme', icon: Users },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  onClick={() => {
                    setTheme(label);
                    triggerToast(`Switched theme to ${label}`);
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 text-xs font-bold transition-colors select-none border ${
                    theme === label
                      ? 'border-blue-600 bg-blue-600/10 text-blue-500 shadow-sm'
                      : isDark
                      ? 'border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800'
                      : 'border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-blue-500" />
                    {label}
                  </span>
                  <span
                    className={`h-4 w-4 rounded-full border-2 transition-colors ${
                      theme === label ? 'border-blue-600 bg-blue-600' : isDark ? 'border-slate-700' : 'border-slate-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </EmployeePageShell>
    </div>
  );
}