import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { month } = await req.json();

    const payslipText = `
==============================================
            PAYSLIP - ${month || 'CURRENT'}
==============================================
Employee Name : ${auth.user.email}
Tenant ID     : ${auth.user.tenantId}

EARNINGS:
- Basic Salary     : ₹50,000
- HRA              : ₹18,000
- Special Allowance: ₹17,000
----------------------------------------------
GROSS SALARY       : ₹85,000

DEDUCTIONS:
- PF Deduction     : ₹6,000
- TDS              : ₹4,400
- Professional Tax : ₹2,000
----------------------------------------------
TOTAL DEDUCTIONS   : ₹12,400

==============================================
NET TAKE HOME      : ₹72,600
==============================================
Status             : PAID
`;

    return new NextResponse(payslipText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="Payslip-${month.replace(/\s+/g, '-')}.txt"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download payslip' }, { status: 500 });
  }
}