import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId } = body;

    if (!employeeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Employee ID is required',
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Create today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check if employee already checked in today
    const existingAttendance = await db
      .collection('attendance')
      .findOne({
        employeeId,
        date: today,
      });

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already checked in today',
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const attendance = {
      employeeId,
      date: today,

      checkIn: now,

      checkOut: null,

      workingHours: 0,

      breakSeconds: 0,

      status: 'Present',

      method: 'Web',

      createdAt: now,

      updatedAt: now,
    };

    const result = await db
      .collection('attendance')
      .insertOne(attendance);

    return NextResponse.json(
      {
        success: true,
        message: 'Checked in successfully',

        data: {
          _id: result.insertedId.toString(),
          ...attendance,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check in',
      },
      { status: 500 }
    );
  }
}