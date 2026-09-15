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

    const today = new Date().toISOString().split('T')[0];

    const attendance = await db
      .collection('attendance')
      .findOne({
        employeeId,
        date: today,
      });

    if (!attendance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please check in first',
        },
        { status: 400 }
      );
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already checked out today',
        },
        { status: 400 }
      );
    }

    const checkOutTime = new Date();

    const checkInTime = new Date(attendance.checkIn);

    // Calculate working hours
    const workingMilliseconds =
      checkOutTime.getTime() - checkInTime.getTime();

    const workingHours =
      Number((workingMilliseconds / (1000 * 60 * 60)).toFixed(2));

    await db
      .collection('attendance')
      .updateOne(
        {
          _id: attendance._id,
        },
        {
          $set: {
            checkOut: checkOutTime,
            workingHours,
            updatedAt: new Date(),
          },
        }
      );

    return NextResponse.json({
      success: true,
      message: 'Checked out successfully',

      data: {
        checkOut: checkOutTime,
        workingHours,
      },
    });
  } catch (error) {
    console.error('Check-out error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check out',
      },
      { status: 500 }
    );
  }
}