import { NextResponse } from 'next/server';

let employeeProfileData = {
  name: 'Priya Sharma',
  designation: 'Senior Full Stack Engineer',
  employeeId: 'EMP-2026-894',
  status: 'Active Member',
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
    twoFactorStatus: 'Enabled',
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

export async function GET() {
  return NextResponse.json({ success: true, profile: employeeProfileData });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.phone) employeeProfileData.phone = body.phone;
    if (body.location) employeeProfileData.location = body.location;
    if (body.name) employeeProfileData.name = body.name;

    return NextResponse.json({
      success: true,
      message: 'Profile records updated in database!',
      profile: employeeProfileData,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}