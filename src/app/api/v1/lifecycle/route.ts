import { NextResponse } from 'next/server';

// Shared Central State Engine (Synced across Admin, HR, Manager & Employee Portals)
let systemProfileState = {
  name: 'Priya Sharma',
  designation: 'Senior Full Stack Engineer',
  employeeId: 'EMP-2026-894',
  status: 'Active Service',
  email: 'priya.sharma@infinitecloud.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, KA, India',
  department: 'Core Engineering & Cloud Architecture',
  manager: {
    name: 'Rajesh Kumar',
    designation: 'VP of Engineering',
    email: 'rajesh.k@infinitecloud.com',
    phone: '+91 91234 56789',
    initials: 'RK',
  },
  security: {
    lastPasswordChange: '12 Days ago',
    lastLogin: 'Today, 09:42 AM • IP: 172.16.24.13',
  },
  documents: [
    { name: 'Offer & Employment Contract', status: 'Verified', state: 'success' },
    { name: 'KYC & Government Identity', status: 'Verified', state: 'success' },
    { name: 'Tax Compliance Declaration', status: 'Action Required', state: 'warning' },
    { name: 'Educational Certifications', status: 'Verified', state: 'success' },
  ],
  assets: [
    { name: 'Workstation', details: 'MacBook Pro M3 Max (36GB RAM)', tone: 'blue' },
    { name: 'Corporate Mobile', details: 'Unlimited 5G e-SIM Coverage', tone: 'purple' },
    { name: 'HQ Security Pass', details: 'RFID Access Pass #4829', tone: 'green' },
  ],
  personalInfo: [
    { label: 'Full Legal Name', value: 'Priya Sharma' },
    { label: 'Date of Birth', value: '14 August 1996' },
    { label: 'Blood Group', value: 'O Positive (O+)' },
    { label: 'Gender Identity', value: 'Female' },
  ],
  employmentInfo: [
    { label: 'Joining Date', value: '01 October 2023' },
    { label: 'Work Arrangements', value: 'Hybrid Executive' },
    { label: 'Corporate Title', value: 'Senior Developer' },
    { label: 'Division', value: 'Engineering Services' },
  ],
  emergencyInfo: [
    { label: 'Primary Contact', value: 'Anindya Sharma' },
    { label: 'Relationship', value: 'Spouse' },
    { label: 'Phone Number', value: '+91 98111 22334' },
    { label: 'Alternate Contact', value: '+91 98222 33445' },
  ],
};

let lifecycleStages = [
  { id: 1, label: 'Onboarding', status: 'Completed', description: 'Docs & System Access Setup Done', updatedBy: 'HR Portal', timestamp: '01 Oct 2023' },
  { id: 2, label: 'Active Service', status: 'Active', description: 'Assigned to Core Cloud Engineering', updatedBy: 'Manager (Rajesh K.)', timestamp: '15 Jan 2024' },
  { id: 3, label: 'Career Growth', status: 'Pending', description: 'Senior Tech Lead Promotion Track', updatedBy: 'Admin Panel', timestamp: 'Pending Review' },
  { id: 4, label: 'Annual Appraisal', status: 'Pending', description: 'Q4 Performance Review Scheduled', updatedBy: 'HR Portal', timestamp: 'Pending' },
  { id: 5, label: 'Offboarding', status: 'Pending', description: 'Exit Protocols Inactive', updatedBy: 'System', timestamp: 'N/A' },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    profile: systemProfileState,
    lifecycle: lifecycleStages,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === 'UPDATE_PROFILE') {
      if (body.name) systemProfileState.name = body.name;
      if (body.phone) systemProfileState.phone = body.phone;
      if (body.location) systemProfileState.location = body.location;
      if (body.designation) systemProfileState.designation = body.designation;

      return NextResponse.json({
        success: true,
        message: 'Profile records updated in database and dispatched to Admin/HR/Manager!',
        profile: systemProfileState,
      });
    }

    if (body.type === 'UPDATE_LIFECYCLE') {
      const { stepId, nextStatus } = body;
      lifecycleStages = lifecycleStages.map((st) => {
        if (st.id === stepId) {
          return {
            ...st,
            status: nextStatus,
            updatedBy: 'Employee Action',
            timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          };
        }
        return st;
      });

      return NextResponse.json({
        success: true,
        message: `Lifecycle stage updated to ${nextStatus} & synced to Admin/HR/Manager!`,
        lifecycle: lifecycleStages,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid update payload' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}