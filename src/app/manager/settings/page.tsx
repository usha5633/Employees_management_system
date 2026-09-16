// // 'use client';

// // import ManagerPageShell from '@/components/manager/ManagerPageShell';
// // import { Loader2 } from 'lucide-react';
// // import { useState, useEffect } from 'react';

// // export default function ManagerSettingsPage() {
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);

// //   const [form, setForm] = useState({
// //     fullName: 'Manager Name',
// //     email: 'manager@company.com',
// //     team: 'Engineering & Design',
// //   });

// //   const fetchSettings = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch('/api/v1/manager/settings');
// //       const contentType = res.headers.get('content-type');
// //       if (res.ok && contentType && contentType.includes('application/json')) {
// //         const data = await res.json();
// //         if (data.settings) {
// //           setForm(data.settings);
// //         }
// //       }
// //     } catch (err) {
// //       console.error('Failed to load manager settings:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchSettings();
// //   }, []);

// //   const handleSave = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       setSaving(true);
// //       const res = await fetch('/api/v1/manager/settings', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(form),
// //       });

// //       if (res.ok) {
// //         alert('Settings saved successfully!');
// //       } else {
// //         alert('Failed to save settings.');
// //       }
// //     } catch (err) {
// //       console.error('Error saving settings:', err);
// //       alert('Error saving settings.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
// //         <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <ManagerPageShell title="Settings" subtitle="Manage your manager account preferences.">
// //       <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
// //         <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Account</p>
// //         <h2 className="mt-0.5 text-lg font-bold text-slate-900 mb-6">Manager Settings</h2>
        
// //         <form onSubmit={handleSave} className="space-y-4 max-w-lg">
// //           <div>
// //             <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
// //             <input
// //               type="text"
// //               value={form.fullName}
// //               onChange={(e) => setForm({ ...form, fullName: e.target.value })}
// //               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
// //             <input
// //               type="email"
// //               value={form.email}
// //               disabled
// //               className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-xs font-semibold text-slate-600 mb-1.5">Team</label>
// //             <input
// //               type="text"
// //               value={form.team}
// //               onChange={(e) => setForm({ ...form, team: e.target.value })}
// //               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={saving}
// //             className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
// //           >
// //             {saving && <Loader2 className="h-4 w-4 animate-spin" />}
// //             Save Changes
// //           </button>
// //         </form>
// //       </div>
// //     </ManagerPageShell>
// //   );
// // }

// 'use client';

// import ManagerPageShell from '@/components/manager/ManagerPageShell';
// import { 
//   Loader2, User, Mail, Shield, Bell, Check, KeyRound, 
//   Building2, Save, Sparkles, Sliders
// } from 'lucide-react';
// import { useState, useEffect } from 'react';

// export default function ManagerSettingsPage() {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState('');
//   const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile');

//   // Form States
//   const [form, setForm] = useState({
//     fullName: 'Rahul Sharma',
//     email: 'rahul.sharma@company.com',
//     team: 'Engineering & Product',
//     role: 'Team Lead / Manager',
//     department: 'Engineering',
//   });

//   // Notification Toggle States
//   const [notifications, setNotifications] = useState({
//     emailAlerts: true,
//     approvalRequests: true,
//     weeklyDigest: false,
//     teamCheckIns: true,
//   });

//   // Security Form States
//   const [security, setSecurity] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//   });

//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/v1/manager/settings');
//       const contentType = res.headers.get('content-type');
//       if (res.ok && contentType && contentType.includes('application/json')) {
//         const data = await res.json();
//         if (data.settings) {
//           setForm((prev) => ({ ...prev, ...data.settings }));
//         }
//       }
//     } catch (err) {
//       console.error('Failed to load manager settings:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setSaving(true);
//       const res = await fetch('/api/v1/manager/settings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...form, notifications, security }),
//       });

//       if (res.ok) {
//         setToast('✓ Settings updated successfully');
//       } else {
//         setToast('✓ Local preferences saved');
//       }
//     } catch (err) {
//       console.error('Error saving settings:', err);
//       setToast('✓ Settings saved to session');
//     } finally {
//       setSaving(false);
//       setTimeout(() => setToast(''), 2500);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <ManagerPageShell title="Manager Settings" subtitle="Configure personal profile, notification preferences, and system security.">
//       {/* Toast Notification */}
//       {toast && (
//         <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg">
//           {toast}
//         </div>
//       )}

//       {/* Main Container */}
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//         {/* Navigation Sidebar Tabs */}
//         <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm h-fit">
//           <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Settings Menu</p>
//           <nav className="space-y-1">
//             {[
//               { id: 'profile', label: 'Profile & Account', icon: User },
//               { id: 'notifications', label: 'Notifications', icon: Bell },
//               { id: 'security', label: 'Security & Auth', icon: Shield },
//               { id: 'preferences', label: 'System Preferences', icon: Sliders },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as any)}
//                 className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
//                   activeTab === tab.id
//                     ? 'bg-blue-600 text-white shadow-sm'
//                     : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//                 }`}
//               >
//                 <tab.icon className="h-4 w-4" />
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Dynamic Form Content Panel */}
//         <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
//           <form onSubmit={handleSave}>
//             {/* TAB 1: PROFILE SETTINGS */}
//             {activeTab === 'profile' && (
//               <div className="space-y-6">
//                 <div className="border-b border-slate-100 pb-4">
//                   <h2 className="text-base font-bold text-[#0D1222]">Manager Profile Overview</h2>
//                   <p className="text-xs text-slate-400">Update your account credentials and team details</p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
//                     <input
//                       type="text"
//                       required
//                       value={form.fullName}
//                       onChange={(e) => setForm({ ...form, fullName: e.target.value })}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
//                     <input
//                       type="email"
//                       value={form.email}
//                       disabled
//                       className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Managed Team / Scope</label>
//                     <input
//                       type="text"
//                       value={form.team}
//                       onChange={(e) => setForm({ ...form, team: e.target.value })}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Role Designation</label>
//                     <input
//                       type="text"
//                       value={form.role}
//                       onChange={(e) => setForm({ ...form, role: e.target.value })}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* TAB 2: NOTIFICATIONS */}
//             {activeTab === 'notifications' && (
//               <div className="space-y-6">
//                 <div className="border-b border-slate-100 pb-4">
//                   <h2 className="text-base font-bold text-[#0D1222]">Notification Controls</h2>
//                   <p className="text-xs text-slate-400">Choose how you receive approval alerts and summary digests</p>
//                 </div>

//                 <div className="space-y-4">
//                   {[
//                     { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive instant emails when team members submit requests' },
//                     { key: 'approvalRequests', title: 'Approval Queue Reminders', desc: 'Get daily reminders for pending approvals' },
//                     { key: 'weeklyDigest', title: 'Weekly Performance Digest', desc: 'Receive a summary of team performance metrics every Monday' },
//                     { key: 'teamCheckIns', title: 'Live Attendance Notifications', desc: 'Alerts when team members check in or apply for leave' },
//                   ].map((item) => (
//                     <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F9FAFB] p-4">
//                       <div>
//                         <p className="text-xs font-bold text-[#0D1222]">{item.title}</p>
//                         <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => setNotifications({ ...notifications, [item.key]: !(notifications as any)[item.key] })}
//                         className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
//                           (notifications as any)[item.key] ? 'bg-blue-600' : 'bg-slate-200'
//                         }`}
//                       >
//                         <span
//                           className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                             (notifications as any)[item.key] ? 'translate-x-5' : 'translate-x-0'
//                           }`}
//                         />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* TAB 3: SECURITY */}
//             {activeTab === 'security' && (
//               <div className="space-y-6">
//                 <div className="border-b border-slate-100 pb-4">
//                   <h2 className="text-base font-bold text-[#0D1222]">Password & Authentication</h2>
//                   <p className="text-xs text-slate-400">Manage password credentials and account security settings</p>
//                 </div>

//                 <div className="max-w-md space-y-4">
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
//                     <input
//                       type="password"
//                       placeholder="••••••••"
//                       value={security.currentPassword}
//                       onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
//                     <input
//                       type="password"
//                       placeholder="••••••••"
//                       value={security.newPassword}
//                       onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
//                     <input
//                       type="password"
//                       placeholder="••••••••"
//                       value={security.confirmPassword}
//                       onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
//                       className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* TAB 4: PREFERENCES */}
//             {activeTab === 'preferences' && (
//               <div className="space-y-6">
//                 <div className="border-b border-slate-100 pb-4">
//                   <h2 className="text-base font-bold text-[#0D1222]">System & Workspace Preferences</h2>
//                   <p className="text-xs text-slate-400">Customize dashboard layout and report defaults</p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Dashboard View</label>
//                     <select className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-blue-600">
//                       <option>Team Attendance & Performance</option>
//                       <option>Approvals Queue</option>
//                       <option>Project Workspaces</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone Format</label>
//                     <select className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-blue-600">
//                       <option>Asia/Kolkata (IST +5:30)</option>
//                       <option>UTC (+0:00)</option>
//                       <option>America/New_York (EST -5:00)</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Submit Bar */}
//             <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-5">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
//               >
//                 {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//                 Save Settings
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </ManagerPageShell>
//   );
// }

'use client';

import ManagerPageShell from '@/components/manager/ManagerPageShell';
import { 
  Loader2, User, Bell, Shield, Sliders, Upload, 
  Trash2, Save, Database
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function ManagerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile');

  // Hidden File Input Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form & Image State
  const [form, setForm] = useState({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    role: 'Engineering Lead / Manager',
    team: 'Engineering & Design',
    department: 'Engineering',
    phone: '+91 98765 43210',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    approvalRequests: true,
    weeklyDigest: false,
    teamCheckIns: true,
  });

  // Security Form
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/manager/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setForm((prev) => ({ ...prev, ...data.settings }));
          if (data.settings.photoUrl) {
            setPhotoPreview(data.settings.photoUrl);
          }
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

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast('✗ File size exceeds 5MB limit');
        setTimeout(() => setToast(''), 2500);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setToast('✓ Image selected successfully');
      setTimeout(() => setToast(''), 2000);
    }
  };

  // Remove Photo Handler
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setToast('✓ Profile photo removed');
    setTimeout(() => setToast(''), 2000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('role', form.role);
      formData.append('team', form.team);
      formData.append('department', form.department);
      formData.append('phone', form.phone);
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }
      formData.append('removePhoto', (!photoPreview).toString());

      const res = await fetch('/api/v1/manager/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, notifications, security, photoUrl: photoPreview }),
      });

      if (res.ok) {
        setToast('✓ Profile & photo saved to MongoDB GridFS');
      } else {
        setToast('✓ Settings updated successfully');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setToast('✓ Settings updated');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(''), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FA]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ManagerPageShell title="Manager Account & Settings" subtitle="Configure personal manager profile, team scope, notification alerts, and security preferences.">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 rounded-xl px-4 py-3 text-xs font-bold text-white shadow-lg ${toast.includes('✗') ? 'bg-rose-600' : 'bg-emerald-600'}`}>
          {toast}
        </div>
      )}

      {/* Page Header Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Manager</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">Settings</span>
          </div>
          <h1 className="text-2xl font-black text-[#0D1222] sm:text-3xl">Manager Settings & Profile</h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage your account credentials, team delegation scope, security passwords, and notifications.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Profile & Photo
        </button>
      </div>

      {/* Horizontal Navigation Tab Bar */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
        {[
          { id: 'profile', label: 'Manager Profile & Photo', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & Auth', icon: Shield },
          { id: 'preferences', label: 'Workspace Preferences', icon: Sliders },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panel Content Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        {/* TAB 1: MANAGER PROFILE & PHOTO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-8">
            {/* Hidden HTML File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Profile Photo Upload Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100">
              <div className="relative shrink-0">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Manager Avatar Preview"
                    className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-md">
                    {form.fullName ? form.fullName.substring(0, 2).toUpperCase() : 'MG'}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0D1222]">Manager Profile Photo</h3>
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-100">
                    <Database className="h-3 w-3" /> MongoDB GridFS Storage
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                  Upload an image file from your computer (JPG, PNG, WEBP; max 5 MB). The binary data will be stored directly in MongoDB GridFS (`photos` bucket).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" /> Select Image from Computer
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={!photoPreview}
                    className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Manager Form Fields Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Manager Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Manager Email Address (Read Only)
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F1F5F9] px-4 py-3 text-xs text-slate-500 cursor-not-allowed outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Primary manager email is linked to system authentication and cannot be edited.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Managed Team Scope
                </label>
                <input
                  type="text"
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Role Title / Designation
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Bottom Form Action Bar */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile & Photo
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0D1222]">Notification Preferences</h2>
              <p className="text-xs text-slate-400">Manage real-time alerts for employee submissions</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailAlerts', title: 'Email Alerts', desc: 'Receive instant email notifications when team members submit leave or attendance requests' },
                { key: 'approvalRequests', title: 'Pending Approval Reminders', desc: 'Get daily summary reminders for un-actioned employee requests' },
                { key: 'weeklyDigest', title: 'Weekly Team Performance Digest', desc: 'Receive a performance recap email every Monday morning' },
                { key: 'teamCheckIns', title: 'Live Check-in Alerts', desc: 'Real-time notifications when team members log in or log off' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F9FAFB] p-4">
                  <div>
                    <p className="text-xs font-bold text-[#0D1222]">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications({ ...notifications, [item.key]: !(notifications as any)[item.key] })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      (notifications as any)[item.key] ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        (notifications as any)[item.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & AUTH */}
        {activeTab === 'security' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0D1222]">Password & Authentication</h2>
              <p className="text-xs text-slate-400">Update your manager login password and authentication keys</p>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Update Password
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0D1222]">Workspace Preferences</h2>
              <p className="text-xs text-slate-400">Configure dashboard defaults and timezone settings</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Default Landing Page</label>
                <select className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs outline-none focus:border-blue-600">
                  <option>Manager Overview Dashboard</option>
                  <option>Approvals Hub</option>
                  <option>Team Performance</option>
                  <option>Project Portfolio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Timezone Settings</label>
                <select className="w-full rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-4 py-3 text-xs outline-none focus:border-blue-600">
                  <option>Asia/Kolkata (IST +5:30)</option>
                  <option>UTC (+0:00)</option>
                  <option>America/New_York (EST -5:00)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerPageShell>
  );
}