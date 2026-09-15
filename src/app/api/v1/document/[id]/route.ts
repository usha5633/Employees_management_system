import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getGridFSBucket, getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET /api/v1/documents/:id - Download stream
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fileId = new ObjectId(params.id);
    const db = await getDatabase();
    
    const fileMetaData = await db.collection('documents.files').findOne({
      _id: fileId,
      'metadata.tenantId': auth.user.tenantId,
    });

    if (!fileMetaData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const bucket = await getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(fileId);

    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileMetaData.metadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileMetaData.filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error streaming file' }, { status: 500 });
  }
}

// DELETE /api/v1/documents/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fileId = new ObjectId(params.id);
    const bucket = await getGridFSBucket();
    await bucket.delete(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}