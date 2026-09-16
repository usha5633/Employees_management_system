import { NextResponse } from 'next/server';

// Mock Server Database State (Replace with your database query like Prisma / Mongoose)
let settingsDatabase = {
  profile: {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@infinitecloud.com',
    phone: '+91 98765 43210',
    city: 'Bengaluru',
    address: 'B-204, Green Park, Bengaluru',
  },
  notifications: {
    'Email notifications': true,
    'Leave notifications': true,
    'Attendance reminders': true,
    'Payroll notifications': true,
    'Announcement notifications': false,
  },
  theme: 'Light mode',
  security: {
    twoFactorEnabled: true,
    lastLogin: 'Today, 09:42 AM • IP: 172.16.24.13',
  },
};

export async function GET() {
  return NextResponse.json({ success: true, settings: settingsDatabase });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Update Server Database
    if (body.profile) {
      settingsDatabase.profile = { ...settingsDatabase.profile, ...body.profile };
    }
    if (body.notifications) {
      settingsDatabase.notifications = body.notifications;
    }
    if (body.theme) {
      settingsDatabase.theme = body.theme;
    }

    return NextResponse.json({
      success: true,
      message: 'Profile and Settings updated in database successfully!',
      settings: settingsDatabase,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Database update failed.' },
      { status: 500 }
    );
  }
}