import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const userId = auth.user._id;
    const tenantId = auth.user.tenantId;

    const records = await db
      .collection('payslips')
      .find({ userId, tenantId })
      .sort({ createdAt: -1 })
      .toArray();

    // Fallback Mock data if database collection has no records yet
    if (!records || records.length === 0) {
      const defaultLatest = {
        month: 'September 2026',
        basic: '₹25,000',
        allowances: '₹7,000',
        bonuses: '₹2,500',
        deductions: '₹3,000',
        tax: '₹2,500',
        net: '₹29,000',
        gross: '₹34,500',
      };

      const defaultHistory = [
        { month: 'September 2026', net: '₹29,000', status: 'Paid' },
        { month: 'August 2026', net: '₹28,450', status: 'Paid' },
        { month: 'July 2026', net: '₹27,900', status: 'Paid' },
      ];

      return NextResponse.json({
        latest: defaultLatest,
        history: defaultHistory,
      });
    }

    const latestDoc = records[0];
    const formattedLatest = {
      month: latestDoc.month || 'September 2026',
      basic: `₹${latestDoc.basic?.toLocaleString('en-IN') || '25,000'}`,
      allowances: `₹${latestDoc.allowances?.toLocaleString('en-IN') || '7,000'}`,
      bonuses: `₹${latestDoc.bonuses?.toLocaleString('en-IN') || '2,500'}`,
      deductions: `₹${latestDoc.deductions?.toLocaleString('en-IN') || '3,000'}`,
      tax: `₹${latestDoc.tax?.toLocaleString('en-IN') || '2,500'}`,
      net: `₹${latestDoc.net?.toLocaleString('en-IN') || '29,000'}`,
      gross: `₹${latestDoc.gross?.toLocaleString('en-IN') || '34,500'}`,
    };

    const formattedHistory = records.map((r) => ({
      month: r.month,
      net: `₹${r.net?.toLocaleString('en-IN')}`,
      status: r.status || 'Paid',
    }));

    return NextResponse.json({
      latest: formattedLatest,
      history: formattedHistory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch payslips' }, { status: 500 });
  }
}