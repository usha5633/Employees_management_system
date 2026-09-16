import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { month } = await request.json();

    const payslipText = `
============================================================
             OFFICIAL PAYROLL SALARY STATEMENT              
============================================================
Statement Month   : ${month || 'August 2026'}
Employee Name     : Priya Sharma
Designation       : Senior Full Stack Engineer
Disbursement Status: CONFIRMED & PAID VIA BANK WIRE
------------------------------------------------------------
EARNINGS BREAKDOWN:
  - Basic Salary             : ₹50,000.00
  - House Rent Allowance     : ₹20,000.00
  - Special Allowance        : ₹10,000.00
  - Performance Bonus        : ₹5,000.00
------------------------------------------------------------
DEDUCTIONS & TAXES:
  - Provident Fund (PF)      : ₹6,000.00
  - Professional Tax (PT)    : ₹400.00
  - Income Tax (TDS)         : ₹6,000.00
------------------------------------------------------------
TOTAL GROSS EARNINGS         : ₹85,000.00
TOTAL DEDUCTIONS             : ₹12,400.00
NET TAKE-HOME DISBURSED      : ₹72,600.00
============================================================
           InfiniteCloud HR & Finance Automation           
============================================================
`;

    return new NextResponse(payslipText, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Payslip_${(month || 'Statement').replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Download failed' }, { status: 500 });
  }
}