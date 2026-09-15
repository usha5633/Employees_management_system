import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/rbac';
import { getDatabase, getGridFSBucket } from '@/lib/db';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET /api/v1/documents - Fetch tenant-scoped documents list
export async function GET(req: NextRequest) {
  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const files = await db
      .collection('documents.files')
      .find({ 'metadata.tenantId': auth.user.tenantId })
      .sort({ uploadDate: -1 })
      .toArray();

    const formattedDocs = files.map((file) => ({
      id: file._id.toString(),
      fileId: file._id.toString(),
      name: file.metadata?.customName || file.filename,
      type: file.metadata?.contentType ? file.metadata.contentType.split('/')[1]?.toUpperCase() : 'PDF',
      size: `${(file.length / 1024).toFixed(0)} KB`,
      uploaded: new Date(file.uploadDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      expiry: file.metadata?.expiry || null,
      status: file.metadata?.status || 'pending',
      category: file.metadata?.category || 'Other',
    }));

    return NextResponse.json({ documents: formattedDocs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/v1/documents - Upload file to MongoDB GridFS
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const customName = (formData.get('name') as string) || '';
    const category = (formData.get('category') as string) || 'Other';
    const expiry = (formData.get('expiry') as string) || null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const bucket = await getGridFSBucket();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        customName: customName || file.name,
        category: category,
        expiry: expiry,
        status: 'pending',
        tenantId: auth.user.tenantId,
        uploadedBy: auth.user._id,
        contentType: file.type || 'application/octet-stream',
      },
    });

    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.on('error', (err) => reject(err));
      stream.pipe(uploadStream);
    });

    return NextResponse.json({ success: true, fileId: fileId.toString() }, { status: 201 });
  } catch (error: any) {
    console.error('GridFS Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}