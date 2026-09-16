import { NextResponse } from 'next/server';

// Temporary mock database array (Aap ise apne MongoDB / Prisma / GridFS model se replace kar sakte hain)
let mockDocuments = [
  {
    id: '1',
    name: 'Employment Offer Letter.pdf',
    type: 'PDF Document',
    size: '1.2 MB',
    uploaded: 'Sep 1, 2026',
    expiry: null,
    status: 'verified',
    category: 'Employment',
    fileId: 'file_001',
  },
  {
    id: '2',
    name: 'Aadhaar Card Copy.pdf',
    type: 'PDF Document',
    size: '850 KB',
    uploaded: 'Sep 3, 2026',
    expiry: '2030-12-31',
    status: 'verified',
    category: 'Identity',
    fileId: 'file_002',
  },
  {
    id: '3',
    name: 'B.Tech Degree Certificate.pdf',
    type: 'PDF Document',
    size: '2.4 MB',
    uploaded: 'Sep 5, 2026',
    expiry: null,
    status: 'pending',
    category: 'Education',
    fileId: 'file_003',
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      documents: mockDocuments,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string || (file ? file.name : 'Untitled Document');
    const category = formData.get('category') as string || 'Other';
    const expiry = formData.get('expiry') as string || null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    const newDoc = {
      id: Date.now().toString(),
      name: name,
      type: file.type.includes('pdf') ? 'PDF Document' : 'Image File',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploaded: 'Just now',
      expiry: expiry || null,
      status: 'pending' as const,
      category: category as any,
      fileId: `file_${Date.now()}`,
    };

    mockDocuments.unshift(newDoc);

    return NextResponse.json({
      success: true,
      message: 'Document uploaded and stored successfully',
      document: newDoc,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process upload' },
      { status: 500 }
    );
  }
}