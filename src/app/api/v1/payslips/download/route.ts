import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { month } = await req.json();

    const payslipContent = `
==============================================
               SALARY PAYSLIP
==============================================
Month       : ${month || 'September 2026'}
Employee ID : ${auth.user._id}
Tenant ID   : ${auth.user.tenantId}

EARNINGS & DEDUCTIONS:
----------------------------------------------
Basic Salary     : ₹25,000
Allowances       : ₹7,000
Bonuses          : ₹2,500
Gross Salary     : ₹34,500

Deductions       : ₹3,000
Tax              : ₹2,500
Total Deductions : ₹5,500

----------------------------------------------
NET SALARY       : ₹29,000
Status           : PAID
==============================================
`;

    return new NextResponse(payslipContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="Payslip-${(month || 'September-2026').replace(/\s+/g, '-')}.txt"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
}