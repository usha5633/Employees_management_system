import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase } from '@/lib/db';

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
        { name: 'Aanya Sharma', avatar: 'AS', color: 'bg-violet-100 text-violet-700', taskComp: 92, attendance: 98, onTime: 95, rating: 'Excellent' },
        { name: 'Rohit Verma', avatar: 'RV', color: 'bg-sky-100 text-sky-700', taskComp: 88, attendance: 95, onTime: 90, rating: 'Good' },
        { name: 'Sneha Pillai', avatar: 'SP', color: 'bg-pink-100 text-pink-700', taskComp: 94, attendance: 97, onTime: 96, rating: 'Excellent' },
        { name: 'Vikram Singh', avatar: 'VS', color: 'bg-cyan-100 text-cyan-700', taskComp: 85, attendance: 92, onTime: 87, rating: 'Good' },
        { name: 'Priya Joshi', avatar: 'PJ', color: 'bg-lime-100 text-lime-700', taskComp: 80, attendance: 90, onTime: 82, rating: 'Average' },
      ];
      return NextResponse.json({ members: defaultMembers });
    }

    const formatted = dbMembers.map((m) => ({
      id: m._id.toString(),
      name: m.name || 'Team Member',
      avatar: m.avatar || 'TM',
      color: m.color || 'bg-slate-100 text-slate-700',
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