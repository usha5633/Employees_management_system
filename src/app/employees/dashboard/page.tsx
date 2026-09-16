'use client';

import EmployeePageShell from '@/components/employee/EmployeePageShell';
import {
  LogIn, LogOut, Clock, CalendarDays, CheckCircle2,
  Circle, Timer, Megaphone, Gift, CreditCard,
  ArrowRight, AlertCircle, TrendingUp, ChevronRight,
  Sun, Moon, Coffee, Loader2, Sparkles, ShieldCheck, RefreshCw, MapPin, Award, Zap, FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Company Office Coordinates (Example)
const OFFICE_LOCATION = {
  lat: 26.2389,
  lng: 73.0243,
  radiusKm: 0.5,
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const attendanceMap: Record<number, number> = {
  1: 4, 2: 4, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1,
  8: 4, 9: 4, 10: 1, 11: 1, 12: 1, 13: 3, 14: 2,
  15: 0, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1,
  21: 4, 22: 4, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1,
  28: 4, 29: 4, 30: 1,
};
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SEP_OFFSET = 1;

const dayConfig: Record<number, { bg: string; text: string; title: string }> = {
  0: { bg: 'bg-rose-100', text: 'text-rose-600', title: 'Absent' },
  1: { bg: 'bg-emerald-100', text: 'text-emerald-700', title: 'Present' },
  2: { bg: 'bg-amber-100', text: 'text-amber-700', title: 'Late' },
  3: { bg: 'bg-blue-100', text: 'text-blue-700', title: 'Leave' },
  4: { bg: 'bg-slate-100', text: 'text-slate-400', title: 'Holiday / Weekend' },
  5: { bg: 'bg-slate-100', text: 'text-slate-400', title: 'Weekend' },
};

const statusBadge: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm',
  Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm',
  Rejected: 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm',
};

function getGreeting(hour: number) {
  if (hour < 12) return { text: 'Good morning', icon: <Sun className="h-6 w-6 text-amber-300 animate-pulse" />, gradient: 'from-blue-600 via-indigo-600 to-sky-600' };
  if (hour < 17) return { text: 'Good afternoon', icon: <Coffee className="h-6 w-6 text-orange-300" />, gradient: 'from-blue-700 via-indigo-700 to-purple-700' };
  return { text: 'Good evening', icon: <Moon className="h-6 w-6 text-indigo-200" />, gradient: 'from-slate-900 via-indigo-950 to-blue-950' };
}

export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userName, setUserName] = useState('Rahul Sharma');
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:28 AM');
  const [checkOutTime, setCheckOutTime] = useState('—');
  const [elapsed, setElapsed] = useState('06h 45m');
  const [hour, setHour] = useState(9);
  const [currentTime, setCurrentTime] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAtOffice, setIsAtOffice] = useState<boolean | null>(null);
  const [locationChecking, setLocationChecking] = useState(true);

  const [leaveBalance, setLeaveBalance] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [payslip, setPayslip] = useState<any>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const dist = calculateDistance(latitude, longitude, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
          setIsAtOffice(dist <= OFFICE_LOCATION.radiusKm);
          setLocationChecking(false);
        },
        () => {
          setIsAtOffice(false);
          setLocationChecking(false);
        },
        { timeout: 10000 }
      );
    } else {
      setIsAtOffice(false);
      setLocationChecking(false);
    }
  }, []);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/v1/dashboard');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.user?.name && !data.user.name.toLowerCase().includes('administrator')) {
          setUserName(data.user.name);
        }
        if (data.todayAttendance) {
          setCheckedIn(data.todayAttendance.checkedIn);
          setCheckInTime(data.todayAttendance.checkInTime);
          setCheckOutTime(data.todayAttendance.checkOutTime);
          setElapsed(data.todayAttendance.elapsed);
        }
        setLeaveBalance(data.leaveBalance || []);
        setLeaveRequests(data.leaveRequests || []);
        setPayslip(data.payslip || {});
        setAnnouncements(data.announcements || []);
        setHolidays(data.holidays || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const now = new Date();
    setHour(now.getHours());

    const id = setInterval(() => {
      setElapsed((prev) => {
        const cleanPrev = prev.includes('h') ? prev : '00h 00m';
        const [h, m] = cleanPrev.replace('h ', ':').replace('m', '').split(':').map(Number);
        const nm = (isNaN(m) ? 0 : m) + 1 >= 60 ? 0 : (isNaN(m) ? 0 : m) + 1;
        const nh = (isNaN(m) ? 0 : m) + 1 >= 60 ? (isNaN(h) ? 0 : h) + 1 : (isNaN(h) ? 0 : h);
        return `${String(nh).padStart(2, '0')}h ${String(nm).padStart(2, '0')}m`;
      });
    }, 60000);

    const pollId = setInterval(fetchDashboard, 30000);
    return () => {
      clearInterval(id);
      clearInterval(pollId);
    };
  }, []);

  const handleAttendanceAction = async (action: 'checkIn' | 'checkOut') => {
    try {
      setActionLoading(true);
      if (action === 'checkIn') setCheckedIn(true);
      else setCheckedIn(false);

      const res = await fetch('/api/v1/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (res.ok) {
        triggerToast(`Successfully recorded ${action === 'checkIn' ? 'Check-In' : 'Check-Out'}`);
        await fetchDashboard();
      }
    } catch (err) {
      console.error('Failed to update attendance:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const presentDays = Object.values(attendanceMap).filter((v) => v === 1).length;
  const lateDays = Object.values(attendanceMap).filter((v) => v === 2).length;
  const absentDays = Object.values(attendanceMap).filter((v) => v === 0).length;
  const leaveDays = Object.values(attendanceMap).filter((v) => v === 3).length;
  const greeting = getGreeting(hour);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <EmployeePageShell
      title="Employee Workspace"
      subtitle={`Welcome back, ${userName}! Here is your real-time corporate overview.`}
      actions={
        <div className="flex items-center gap-3 animate-in fade-in duration-500">
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2 text-xs font-extrabold text-slate-700 shadow-sm backdrop-blur-xl">
            <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
            <span>{currentTime || 'Loading live time...'}</span>
          </div>
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync</span>
          </button>
        </div>
      }
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Modern Vibrant Greeting & Location Banner */}
      <div className={`mb-6 rounded-3xl bg-gradient-to-r ${greeting.gradient} px-8 py-6 text-white shadow-xl shadow-blue-600/15 relative overflow-hidden animate-in fade-in duration-700`}>
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-12 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-inner">
              {greeting.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {greeting.text}
                </span>
                
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${
                  locationChecking ? 'bg-amber-500/20 text-amber-200 border-amber-300/30' :
                  isAtOffice ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-blue-400/20 text-blue-200 border-blue-300/30'
                }`}>
                  <MapPin className="h-3 w-3" />
                  {locationChecking ? 'Detecting Location...' : isAtOffice ? 'In Office (Geo-Verified)' : 'Remote / Out of Office'}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">{userName} 👋</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3 rounded-2xl shadow-inner md:text-right">
            <div>
              <p className="text-[10px] font-extrabold text-blue-200 uppercase tracking-widest">Active Workspace Date</p>
              <p className="text-xs font-black text-white mt-0.5">Wednesday, 16 Sep 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Quick Productivity & Metrics Strip */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weekly Performance</p>
            <p className="text-lg font-black text-slate-900">98.4% <span className="text-xs font-bold text-emerald-600">On-Time</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Monthly Attendance</p>
            <p className="text-lg font-black text-slate-900">{presentDays} Days <span className="text-xs font-bold text-blue-600">Present</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Active Leave Requests</p>
            <p className="text-lg font-black text-slate-900">1 Pending <span className="text-xs font-bold text-amber-600">Review</span></p>
          </div>
        </div>
      </div>

      {/* Row 1: Attendance & Leave Balance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] mb-6">
        
        {/* Today's Attendance Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Live Shift Monitor</p>
                <h2 className="text-base font-black text-slate-900">Attendance Status</h2>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase transition-all duration-300 ${checkedIn ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
              <span className={`h-2 w-2 rounded-full animate-ping ${checkedIn ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {checkedIn ? '● Present / Active' : '○ Not checked in'}
            </span>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {[
              { label: 'Check-In',      value: checkedIn ? checkInTime : '—',     Icon: LogIn,  color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' },
              { label: 'Check-Out',     value: checkedIn ? '—' : checkOutTime,     Icon: LogOut, color: 'text-rose-500 bg-rose-50 border border-rose-100' },
              { label: 'Working Hours', value: checkedIn ? elapsed : '00h 00m',   Icon: Clock,  color: 'text-blue-600 bg-blue-50 border border-blue-100' },
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="rounded-2xl bg-slate-50/70 p-4 text-center border border-slate-100 transition-all hover:-translate-y-0.5">
                <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-1 text-base font-black text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAttendanceAction('checkIn')}
              disabled={checkedIn || actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Check In
            </button>
            <button
              onClick={() => handleAttendanceAction('checkOut')}
              disabled={!checkedIn || actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-extrabold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Check Out
            </button>
          </div>

          <Link href="/employees/attendance" className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
            <span>View full attendance audit trail</span> <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Leave Balance */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">FY 2026–27</p>
                <h2 className="text-base font-black text-slate-900">Leave Balance</h2>
              </div>
              <Link href="/employees/leave" className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">Apply →</Link>
            </div>

            <div className="space-y-3.5 mb-4">
              {leaveBalance.map(l => {
                const remaining = l.total - l.used;
                return (
                  <div key={l.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-bold text-slate-700">{l.label} Leave</span>
                      <span className={`font-extrabold ${l.text}`}>{remaining} / {l.total} left</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${l.color} transition-all duration-700`} style={{ width: `${(remaining / l.total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 border border-amber-200/70 p-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-bold text-amber-900">Pending: Casual Leave</p>
                <p className="text-[11px] font-semibold text-amber-700">Sep 14–15 · Awaiting manager verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Leave Requests & Monthly Attendance Calendar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        
        {/* Leave Requests */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">My Requests</p>
              <h2 className="text-base font-black text-slate-900">Leave Approvals</h2>
            </div>
            <Link href="/employees/leave" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {leaveRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    req.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : req.tone === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{req.type}</p>
                    <p className="text-[11px] font-semibold text-slate-400">{req.from} – {req.to} · {req.days} day{req.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${statusBadge[req.status] || 'bg-slate-100 text-slate-700'}`}>{req.status}</span>
              </div>
            ))}
          </div>
          <Link href="/employees/leave" className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/80 py-3 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all shadow-sm">
            <CalendarDays className="h-4 w-4" />Apply New Leave Request
          </Link>
        </div>

        {/* Monthly Attendance Calendar */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Monthly Audit</p>
              <h2 className="text-base font-black text-slate-900">Attendance — Sep 2026</h2>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
              {presentDays + lateDays}/22 days
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] mb-3">
            {dayLabels.map(d => <div key={d} className="py-1 font-extrabold text-slate-400 uppercase">{d}</div>)}
            {Array.from({ length: SEP_OFFSET }).map((_, i) => <div key={`blank-${i}`} />)}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const type = attendanceMap[day] ?? 5;
              const cfg  = dayConfig[type];
              const isToday = day === 16;
              return (
                <div
                  key={day}
                  title={cfg.title}
                  className={`flex h-8 items-center justify-center rounded-xl text-[11px] font-extrabold transition-all hover:scale-105 cursor-default ${cfg.bg} ${cfg.text} ${isToday ? 'ring-2 ring-blue-600 ring-offset-2 shadow-sm' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] mb-4">
            {[
              { label: 'Present', color: 'bg-emerald-400' },
              { label: 'Late',    color: 'bg-amber-400' },
              { label: 'Absent',  color: 'bg-rose-400' },
              { label: 'Leave',   color: 'bg-blue-400' },
              { label: 'Holiday', color: 'bg-slate-300' },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 font-bold text-slate-500">
                <span className={`h-2.5 w-2.5 rounded-md ${l.color}`} />{l.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Present', value: presentDays, color: 'text-emerald-700 bg-emerald-50 border border-emerald-100' },
              { label: 'Late',    value: lateDays,    color: 'text-amber-700 bg-amber-50 border border-amber-100' },
              { label: 'Absent',  value: absentDays,  color: 'text-rose-700 bg-rose-50 border border-rose-100' },
              { label: 'Leave',   value: leaveDays,   color: 'text-blue-700 bg-blue-50 border border-blue-100' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl p-2.5 text-center ${s.color}`}>
                <p className="text-base font-black">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payslip & Announcements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        
        {/* Latest Payslip */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Payroll</p>
                <h2 className="text-base font-black text-slate-900">Payslip — {payslip.month || 'August 2026'}</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700 border border-emerald-200 shadow-sm">● {payslip.status || 'Paid'}</span>
            </div>

            <div className="space-y-3 mb-4">
              {[
                { label: 'Gross Salary',   value: payslip.gross || '₹85,000',      color: 'text-slate-900',   bg: 'bg-slate-50' },
                { label: 'Total Deductions', value: payslip.deductions || '₹12,400',  color: 'text-rose-600',    bg: 'bg-rose-50/70' },
                { label: 'Net Take Home',  value: payslip.net || '₹72,600',         color: 'text-emerald-700', bg: 'bg-emerald-50/70 font-black' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`flex items-center justify-between rounded-2xl px-4 py-3.5 border border-slate-100 ${bg}`}>
                  <span className="text-xs font-bold text-slate-600">{label}</span>
                  <span className={`text-sm font-black ${color}`}>{value}</span>
                </div>
              ))}
            </div>
            <p className="mb-4 text-[11px] font-semibold text-slate-400 text-center">Successfully disbursed on {payslip.date || '31 Aug 2026'}</p>
          </div>

          <div className="flex gap-3">
            <Link href="/employees/payroll" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <CreditCard className="h-4 w-4" />View Breakdown
            </Link>
            <button
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all"
            >
              <TrendingUp className="h-4 w-4" />Download PDF
            </button>
          </div>
        </div>

        {/* Announcements */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Company</p>
              <h2 className="text-base font-black text-slate-900">Announcements</h2>
            </div>
            <Link href="/employees/communication" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">View all →</Link>
          </div>

          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-all hover:bg-slate-50/60 ${!a.read ? 'border-blue-200 bg-blue-50/40 shadow-sm' : 'border-slate-100 bg-slate-50/40'}`}>
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${!a.read ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                  <Megaphone className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!a.read && <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />}
                    <p className="text-xs font-black text-slate-900 truncate">{a.title}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">{a.category}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{a.date}</span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase ${a.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                  {a.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Upcoming Holidays */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Calendar</p>
            <h2 className="text-base font-black text-slate-900">Upcoming Holidays</h2>
          </div>
          <Gift className="h-5 w-5 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {holidays.map((h, i) => (
            <div key={i} className={`flex items-start gap-3.5 rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-1 ${h.color || 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/80 border border-white text-center shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-widest leading-none text-slate-500">
                  {h.date?.split(' ')[0]}
                </p>
                <p className="text-base font-black leading-tight text-slate-900 mt-0.5">
                  {h.date?.split(' ')[1]?.replace(',', '')}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-xs text-slate-900 truncate">{h.name}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{h.day}</p>
                <span className="mt-1.5 inline-block rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-extrabold shadow-sm text-slate-700 border border-slate-200/50">
                  In {h.daysLeft} Days
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployeePageShell>
  );
}