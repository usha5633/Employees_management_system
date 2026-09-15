import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function PATCH() {
  try {
    const db = await getDatabase();

    const result = await db.collection('announcements').updateMany(
      {},
      {
        $set: {
          status: 'Read',
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'All announcements marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Mark all read error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update announcements',
      },
      { status: 500 }
    );
  }
}