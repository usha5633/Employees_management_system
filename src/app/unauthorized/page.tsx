import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
        <ShieldAlert className="h-6 w-6 text-rose-600" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Your account doesn&apos;t have permission to view this panel.
      </p>
      <Link
        href="/login"
        className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
      >
        Back to sign in
      </Link>
    </div>
  );
}
