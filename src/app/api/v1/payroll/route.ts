import { NextResponse } from 'next/server';
import { globalPayrollStats, globalPayslipsStore } from '@/lib/payrollStore';

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: globalPayrollStats,
    payslips: globalPayslipsStore,
    currentMonth: globalPayslipsStore[0]?.month || 'August 2026',
  });
}