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
    const tickets = await db
      .collection('tickets')
      .find({
        tenantId: auth.user.tenantId,
        userId: auth.user._id,
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedTickets = tickets.map((t) => ({
      id: t.ticketNumber || `TKT-${t._id.toString().slice(-4).toUpperCase()}`,
      title: t.subject || t.title,
      category: t.category || 'IT Support',
      status: t.status ? t.status.toLowerCase() : 'open',
      priority: t.priority || 'Medium',
      created: t.createdAt
        ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Just now',
    }));

    return NextResponse.json({ tickets: formattedTickets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, priority, description } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and Description are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const count = await db.collection('tickets').countDocuments({ tenantId: auth.user.tenantId });
    const ticketNumber = `TKT-${String(count + 1).padStart(3, '0')}`;

    const newTicket = {
      ticketNumber,
      userId: auth.user._id,
      tenantId: auth.user.tenantId,
      subject: title,
      category: category || 'IT Support',
      priority: priority || 'Medium',
      description,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('tickets').insertOne(newTicket);

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create ticket' }, { status: 500 });
  }
}