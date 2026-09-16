import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const tenantId = auth.user.tenantId;

    const dbMembers = await db
      .collection('performance')
      .find({ tenantId })
      .toArray();

    if (!dbMembers || dbMembers.length === 0) {
      const defaultMembers = [
        { name: 'Aanya Sharma', avatar: 'AS', color: 'bg-blue-100 text-blue-700', taskComp: 92, attendance: 98, onTime: 95, rating: 'Excellent' },
        { name: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', taskComp: 88, attendance: 95, onTime: 90, rating: 'Good' },
        { name: 'Sneha Pillai', avatar: 'SP', color: 'bg-indigo-100 text-indigo-700', taskComp: 94, attendance: 97, onTime: 96, rating: 'Excellent' },
        { name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', taskComp: 85, attendance: 92, onTime: 87, rating: 'Good' },
        { name: 'Priya Joshi', avatar: 'PJ', color: 'bg-emerald-100 text-emerald-700', taskComp: 80, attendance: 90, onTime: 82, rating: 'Average' },
      ];
      return NextResponse.json({ members: defaultMembers });
    }

    const formatted = dbMembers.map((m) => ({
      id: m._id.toString(),
      name: m.name || 'Team Member',
      avatar: m.avatar || (m.name ? m.name.substring(0, 2).toUpperCase() : 'TM'),
      color: m.color || 'bg-blue-100 text-blue-700',
      taskComp: m.taskComp ?? 0,
      attendance: m.attendance ?? 0,
      onTime: m.onTime ?? 0,
      rating: m.rating || 'Good',
    }));

    return NextResponse.json({ members: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch performance metrics' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = await getDatabase();
    const tenantId = auth.user.tenantId;

    const newRecord = {
      tenantId,
      name: body.name,
      avatar: body.avatar || body.name.substring(0, 2).toUpperCase(),
      color: body.color || 'bg-blue-100 text-blue-700',
      taskComp: Number(body.taskComp) || 85,
      attendance: Number(body.attendance) || 90,
      onTime: Number(body.onTime) || 88,
      rating: body.rating || 'Good',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('performance').insertOne(newRecord);

    return NextResponse.json({
      success: true,
      member: {
        id: result.insertedId.toString(),
        ...newRecord,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create performance record' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, taskComp, attendance, onTime, rating } = await req.json();
    const db = await getDatabase();

    if (ObjectId.isValid(id)) {
      await db.collection('performance').updateOne(
        { _id: new ObjectId(id), tenantId: auth.user.tenantId },
        { 
          $set: { 
            ...(taskComp !== undefined && { taskComp: Number(taskComp) }),
            ...(attendance !== undefined && { attendance: Number(attendance) }),
            ...(onTime !== undefined && { onTime: Number(onTime) }),
            ...(rating && { rating }),
            updatedAt: new Date() 
          } 
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update performance scores' }, { status: 500 });
  }
}