'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeesRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/employees/dashboard'); }, [router]);
  return null;
}
