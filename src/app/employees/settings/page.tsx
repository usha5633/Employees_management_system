'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import { Bell, Check, Eye, Lock, MoonStar, Palette, Shield, User, Users, Loader2 } from 'lucide-react';
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

  // Form States
  const [profile, setProfile] = useState({
    fullName: 'Priya Sharma',
    email: 'priya.sharma@infinitecloud.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    address: 'B-204, Green Park, Bengaluru',
  });

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'Email notifications': true,
    'Leave notifications': true,
    'Attendance reminders': true,
    'Payroll notifications': true,
    'Announcement notifications': false,
  });

  const [theme, setTheme] = useState('Light mode');
  const [securityInfo, setSecurityInfo] = useState({
    twoFactorEnabled: true,
    lastLogin: 'Today, 09:42 AM • IP: 172.16.24.13',
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/settings');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, notifications, theme }),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (option: string) => {
    setNotifications((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B6DF5]" />
      </div>
    );
  }

  return (
    <EmployeePageShell
      title="Settings"
      subtitle="Manage your profile, account security, and notification preferences."
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full border border-[#E7ECF5] bg-white px-4 py-2 text-[12px] font-semibold text-[#1E2A45] hover:bg-[#F3F7FF] disabled:opacity-50"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save changes
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Profile Settings */}
        <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Profile</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">Profile settings</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Full name</label>
              <input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Email</label>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#7581A3] cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Phone number</label>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">City</label>
              <input
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[12px] font-semibold text-[#53627F]">Address</label>
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full rounded-[12px] border border-[#E7ECF5] bg-[#F8FAFF] px-3 py-2.5 text-[13px] text-[#1E2A45] outline-none focus:border-[#3B6DF5]"
              />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Account</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">Account security</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-[#3B6DF5]" />
                <span className="text-[13px] text-[#1E2A45] font-medium">Change password</span>
              </div>
              <button
                onClick={() => alert('Password update requested.')}
                className="rounded-full bg-[#EAF0FF] px-3 py-1.5 text-[11px] font-bold text-[#3B6DF5]"
              >
                Update
              </button>
            </div>

            <div className="flex items-center justify-between rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-[#3B6DF5]" />
                <span className="text-[13px] text-[#1E2A45] font-medium">Two-factor authentication</span>
              </div>
              <button className="rounded-full bg-[#EAF7EE] px-3 py-1.5 text-[11px] font-bold text-[#1DAA6E]">
                {securityInfo.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="rounded-[14px] bg-[#F8FAFF] p-3">
              <div className="mb-2 flex items-center gap-3">
                <Bell className="h-4 w-4 text-[#3B6DF5]" />
                <span className="text-[13px] text-[#1E2A45] font-medium">Login security</span>
              </div>
              <div className="text-[12px] text-[#53627F]">Last login: {securityInfo.lastLogin}</div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)] xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Alerts</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">Notification settings</h3>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {notificationOptions.map((option) => (
              <label
                key={option}
                onClick={() => toggleNotification(option)}
                className="flex cursor-pointer items-center justify-between rounded-[14px] bg-[#F8FAFF] p-3 text-[13px] text-[#1E2A45] font-medium select-none"
              >
                <span>{option}</span>
                <span className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${notifications[option] ? 'bg-[#3B6DF5]' : 'bg-[#D1DAF3]'}`}>
                  <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${notifications[option] ? 'translate-x-5' : 'translate-x-0'}`} />
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="rounded-[20px] border border-[#E7ECF5] bg-white p-5 shadow-[0_10px_28px_rgba(35,65,140,0.04)] xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EAF0FF] text-[#3B6DF5]">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-[0.09em] text-[#7581A3]">Appearance</div>
              <h3 className="text-[18px] font-bold text-[#1E2A45]">Theme preferences</h3>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label
              onClick={() => setTheme('Light mode')}
              className="flex cursor-pointer items-center justify-between rounded-[14px] bg-[#F8FAFF] p-3 text-[13px] text-[#1E2A45] font-medium select-none"
            >
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#3B6DF5]" /> Light mode</span>
              <span className={`h-4 w-4 rounded-full border-2 ${theme === 'Light mode' ? 'border-[#3B6DF5] bg-[#3B6DF5]' : 'border-[#D1DAF3]'}`} />
            </label>
            <label
              onClick={() => setTheme('Dark mode')}
              className="flex cursor-pointer items-center justify-between rounded-[14px] bg-[#F8FAFF] p-3 text-[13px] text-[#1E2A45] font-medium select-none"
            >
              <span className="inline-flex items-center gap-2"><MoonStar className="h-4 w-4 text-[#3B6DF5]" /> Dark mode</span>
              <span className={`h-4 w-4 rounded-full border-2 ${theme === 'Dark mode' ? 'border-[#3B6DF5] bg-[#3B6DF5]' : 'border-[#D1DAF3]'}`} />
            </label>
            <label
              onClick={() => setTheme('Blue theme')}
              className="flex cursor-pointer items-center justify-between rounded-[14px] bg-[#F8FAFF] p-3 text-[13px] text-[#1E2A45] font-medium select-none"
            >
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-[#3B6DF5]" /> Blue theme</span>
              <span className={`h-4 w-4 rounded-full border-2 ${theme === 'Blue theme' ? 'border-[#3B6DF5] bg-[#3B6DF5]' : 'border-[#D1DAF3]'}`} />
            </label>
          </div>
        </div>
      </div>
    </EmployeePageShell>
  );
}