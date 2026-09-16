// import { NextRequest, NextResponse } from 'next/server';
// import { getAuthContext } from '@/lib/rbac';
// import { getDatabase } from '@/lib/db';

// export const dynamic = 'force-dynamic';

// export async function GET(req: NextRequest) {
//   try {
//     const auth = await getAuthContext();
//     if (!auth) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const db = await getDatabase();
//     const user = await db.collection('users').findOne({ _id: auth.user._id });

//     const settingsData = {
//       fullName: user?.name || user?.fullName || 'Manager Name',
//       email: user?.email || 'manager@company.com',
//       team: user?.team || 'Engineering & Design',
//     };

//     return NextResponse.json({ settings: settingsData });
//   } catch (error: any) {
//     return NextResponse.json({ error: 'Failed to fetch manager settings' }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const auth = await getAuthContext();
//     if (!auth) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
//     const db = await getDatabase();

//     await db.collection('users').updateOne(
//       { _id: auth.user._id },
//       {
//         $set: {
//           name: body.fullName,
//           fullName: body.fullName,
//           team: body.team,
//           updatedAt: new Date(),
//         },
//       }
//     );

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
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
    
    // Safely parse user ObjectId
    const userId = typeof auth.user._id === 'string' ? new ObjectId(auth.user._id) : auth.user._id;
    const user = await db.collection('users').findOne({ _id: userId });

    const settingsData = {
      id: auth.user._id.toString(),
      fullName: user?.name || user?.fullName || 'Manager Name',
      email: user?.email || 'manager@company.com',
      role: user?.role || 'Team Lead',
      team: user?.team || 'Engineering & Design',
      avatar: user?.avatar || (user?.name ? user.name.substring(0, 2).toUpperCase() : 'M'),
      color: user?.color || 'bg-blue-100 text-blue-700',
      notifications: user?.notifications ?? true,
    };

    return NextResponse.json({ settings: settingsData });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch manager settings' }, { status: 500 });
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
    const userId = typeof auth.user._id === 'string' ? new ObjectId(auth.user._id) : auth.user._id;

    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          name: body.fullName,
          fullName: body.fullName,
          team: body.team || 'Engineering & Design',
          role: body.role || 'Team Lead',
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const db = await getDatabase();
    const userId = typeof auth.user._id === 'string' ? new ObjectId(auth.user._id) : auth.user._id;

    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}