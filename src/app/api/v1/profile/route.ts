import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/v1/profile - Fetch employee profile details
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const user = await db.collection('users').findOne({ _id: auth.user._id });

    // Default profile fallback data if database fields are missing
    const profileData = {
      name: user?.name || 'Priya Sharma',
      designation: user?.designation || 'Software Engineer',
      employeeId: user?.employeeId || 'EMP-2048',
      email: user?.email || 'priya.sharma@infinitecloud.com',
      phone: user?.phone || '+91 98765 43210',
      location: user?.location || 'Bengaluru, India',
      status: user?.status || 'Active',
      manager: user?.manager || {
        name: 'Aman Khurana',
        designation: 'Engineering Manager',
        email: 'aman.khurana@infinitecloud.com',
        phone: '+91 98765 11223',
        initials: 'AK',
      },
      security: {
        lastPasswordChange: user?.security?.lastPasswordChange || '22 Aug 2026',
        lastLogin: user?.security?.lastLogin || 'Today, 09:42 AM',
      },
      documents: user?.documents || [
        { name: 'Offer letter', status: 'Uploaded', state: 'success' },
        { name: 'Appointment letter', status: 'Uploaded', state: 'success' },
        { name: 'PAN copy', status: 'Pending', state: 'warning' },
        { name: 'Passport copy', status: 'Uploaded', state: 'success' },
      ],
      assets: user?.assets || [
        { name: 'Laptop', details: 'Dell Latitude 5440', tone: 'blue' },
        { name: 'SIM card', details: '+91 98765 43210', tone: 'purple' },
        { name: 'ID card', details: 'Employee badge 2048', tone: 'green' },
      ],
      personalInfo: [
        { label: 'Date of birth', value: user?.personalInfo?.dob || '14 Aug 1995' },
        { label: 'Gender', value: user?.personalInfo?.gender || 'Female' },
        { label: 'Blood group', value: user?.personalInfo?.bloodGroup || 'O+' },
        { label: 'Marital status', value: user?.personalInfo?.maritalStatus || 'Married' },
        { label: 'Address', value: user?.personalInfo?.address || 'B-204, Green Park, Bengaluru' },
        { label: 'Emergency contact', value: user?.personalInfo?.emergencyContact || 'Rohan Sharma • +91 99887 66554' },
      ],
      employmentInfo: [
        { label: 'Employee ID', value: user?.employeeId || 'EMP-2048' },
        { label: 'Department', value: user?.department || 'Engineering' },
        { label: 'Designation', value: user?.designation || 'Software Engineer' },
        { label: 'Work location', value: user?.location || 'Bengaluru HQ' },
        { label: 'Date of joining', value: user?.dateOfJoining || '12 Mar 2023' },
        { label: 'Employment type', value: user?.employmentType || 'Full-time' },
      ],
      emergencyInfo: [
        { label: 'Primary emergency contact', value: user?.emergencyInfo?.primaryName || 'Rohan Sharma' },
        { label: 'Relationship', value: user?.emergencyInfo?.primaryRelation || 'Spouse' },
        { label: 'Phone', value: user?.emergencyInfo?.primaryPhone || '+91 99887 66554' },
        { label: 'Alternate contact', value: user?.emergencyInfo?.altName || 'Nandini Sharma' },
        { label: 'Relationship', value: user?.emergencyInfo?.altRelation || 'Sister' },
        { label: 'Phone', value: user?.emergencyInfo?.altPhone || '+91 98765 12345' },
      ],
    };

    return NextResponse.json({ profile: profileData });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// POST /api/v1/profile - Update profile details
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = await getDatabase();

    await db.collection('users').updateOne(
      { _id: auth.user._id },
      {
        $set: {
          phone: body.phone,
          location: body.location,
          'personalInfo.address': body.address,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}