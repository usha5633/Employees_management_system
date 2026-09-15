import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const employeeId =
      searchParams.get('employeeId');

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

    const attendance = await db
      .collection('attendance')
      .find({
        employeeId,
      })
      .sort({
        date: -1,
      })
      .toArray();

    const formattedAttendance =
      attendance.map((item) => ({
        ...item,

        _id: item._id.toString(),
      }));

    return NextResponse.json({
      success: true,

      data: formattedAttendance,
    });
  } catch (error) {
    console.error('Attendance logs error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch attendance logs',
      },
      { status: 500 }
    );
  }
}