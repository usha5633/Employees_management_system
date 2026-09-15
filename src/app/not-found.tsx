import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB] px-6">
      <div className="w-full max-w-md rounded-2xl border border-[#E5ECF5] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF1FF] text-2xl text-[#3B6DF5]">
          404
        </div>
        <h1 className="text-2xl font-bold text-[#1E2A45]">Page not found</h1>
        <p className="mt-3 text-sm text-[#5C6478]">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/employees"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#3B6DF5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D5DEB]"
        >
          Go to Employee Dashboard
        </Link>
      </div>
    </main>
  );
}
