// import { NextRequest, NextResponse } from 'next/server';
// import { getAuthContext } from '@/lib/rbac';
// import { getDatabase } from '@/lib/db';
// import { ObjectId } from 'mongodb';

// export const dynamic = 'force-dynamic';

// export async function GET(req: NextRequest) {
//   try {
//     const auth = await getAuthContext();
//     if (!auth) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const db = await getDatabase();
//     const tenantId = auth.user.tenantId;

//     const dbApprovals = await db
//       .collection('approvals')
//       .find({ tenantId })
//       .sort({ createdAt: -1 })
//       .toArray();

//     if (!dbApprovals || dbApprovals.length === 0) {
//       const defaultApprovals = [
//         { id: '1', name: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', type: 'Leave Request', desc: 'Sick leave — Sep 15–16 (2 days)', urgency: 'high', status: 'pending' },
//         { id: '2', name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700', type: 'WFH Request', desc: 'Work from home — Sep 13, Friday', urgency: 'medium', status: 'pending' },
//         { id: '3', name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', type: 'Overtime Claim', desc: '4 hrs extra — Sep 10', urgency: 'low', status: 'pending' },
//         { id: '4', name: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', type: 'Task Reassign', desc: 'Sprint 4 task → Sprint 5', urgency: 'medium', status: 'pending' },
//         { id: '5', name: 'Priya Joshi', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', type: 'Leave Request', desc: 'Casual leave — Sep 20 (1 day)', urgency: 'low', status: 'approved' },
//       ];
//       return NextResponse.json({ approvals: defaultApprovals });
//     }

//     const formatted = dbApprovals.map((a) => ({
//       id: a._id.toString(),
//       name: a.employeeName || 'Team Member',
//       avatar: a.avatar || 'TM',
//       color: a.avatarColor || 'bg-slate-100 text-slate-700',
//       type: a.requestType || 'General Request',
//       desc: a.description || '',
//       urgency: a.urgency || 'low',
//       status: a.status || 'pending',
//     }));

//     return NextResponse.json({ approvals: formatted });
//   } catch (error: any) {
//     return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
//   }
// }

// export async function PATCH(req: NextRequest) {
//   try {
//     const auth = await getAuthContext();
//     if (!auth) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id, status } = await req.json();
//     const db = await getDatabase();

//     if (ObjectId.isValid(id)) {
//       await db.collection('approvals').updateOne(
//         { _id: new ObjectId(id), tenantId: auth.user.tenantId },
//         { $set: { status, updatedAt: new Date() } }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: 'Failed to update approval status' }, { status: 500 });
//   }
// }

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

    const dbApprovals = await db
      .collection('approvals')
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .toArray();

    if (!dbApprovals || dbApprovals.length === 0) {
      const defaultApprovals = [
        { id: '1', name: 'Rohit Verma', avatar: 'RV', color: 'bg-[#F0F9FF] text-[#0369A1]', type: 'Leave Request', desc: 'Sick leave — Sep 15–16 (2 days)', urgency: 'high', status: 'pending' },
        { id: '2', name: 'Sneha Pillai', avatar: 'SP', color: 'bg-[#FDF2F8] text-[#BE185D]', type: 'WFH Request', desc: 'Work from home — Sep 13, Friday', urgency: 'medium', status: 'pending' },
        { id: '3', name: 'Vikram Singh', avatar: 'VS', color: 'bg-[#ECFEFF] text-[#0E7490]', type: 'Overtime Claim', desc: '4 hrs extra — Sep 10', urgency: 'low', status: 'pending' },
        { id: '4', name: 'Aanya Sharma', avatar: 'AS', color: 'bg-[#F5F3FF] text-[#6D28D9]', type: 'Task Reassign', desc: 'Sprint 4 task → Sprint 5', urgency: 'medium', status: 'pending' },
        { id: '5', name: 'Priya Joshi', avatar: 'PJ', color: 'bg-[#F7FEE7] text-[#4D7C0F]', type: 'Leave Request', desc: 'Casual leave — Sep 20 (1 day)', urgency: 'low', status: 'approved' },
      ];
      return NextResponse.json({ approvals: defaultApprovals });
    }

    const formatted = dbApprovals.map((a) => ({
      id: a._id.toString(),
      name: a.employeeName || a.name || 'Team Member',
      avatar: a.avatar || (a.name ? a.name.substring(0, 2).toUpperCase() : 'TM'),
      color: a.avatarColor || 'bg-slate-100 text-slate-700',
      type: a.requestType || a.type || 'General Request',
      desc: a.description || a.desc || '',
      urgency: a.urgency || 'low',
      status: a.status || 'pending',
    }));

    return NextResponse.json({ approvals: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
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

    const newApproval = {
      tenantId,
      employeeName: body.name,
      avatar: body.avatar || body.name.substring(0, 2).toUpperCase(),
      requestType: body.type,
      description: body.desc,
      urgency: body.urgency || 'medium',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('approvals').insertOne(newApproval);

    return NextResponse.json({
      success: true,
      approval: {
        id: result.insertedId.toString(),
        ...newApproval,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create approval request' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();
    const db = await getDatabase();

    if (ObjectId.isValid(id)) {
      await db.collection('approvals').updateOne(
        { _id: new ObjectId(id), tenantId: auth.user.tenantId },
        { $set: { status, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update approval status' }, { status: 500 });
  }
}