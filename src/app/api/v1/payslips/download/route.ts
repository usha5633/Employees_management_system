import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { month } = await request.json();

    // Generate clean text-based PDF/statement layout only for the requested payslip
    const payslipContent = `
============================================================
                  OFFICIAL SALARY PAYSLIP                   
============================================================
Statement Month : ${month || 'September 2026'}
Disbursement Date: 01st of following month
Status          : PAID & VERIFIED
------------------------------------------------------------
EARNINGS BREAKDOWN:
  - Basic Salary             : ₹25,000.00
  - House Rent Allowance     : ₹4,500.00
  - Special Allowance        : ₹2,500.00
  - Performance Incentives   : ₹2,500.00
------------------------------------------------------------
DEDUCTIONS & TAXES:
  - Provident Fund (PF)      : ₹1,800.00
  - Professional Tax (PT)    : ₹200.00
  - Income Tax (TDS)         : ₹1,000.00
------------------------------------------------------------
GROSS SALARY                 : ₹34,500.00
TOTAL DEDUCTIONS             : ₹3,000.00
NET TAKE-HOME AMOUNT         : ₹29,000.00
============================================================
            Generated via InfiniteCloud HR Engine           
============================================================
`;

    return new NextResponse(payslipContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Payslip_${(month || 'Statement').replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}