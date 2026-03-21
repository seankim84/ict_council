import { NextRequest, NextResponse } from 'next/server';
import { createUploadUrl } from '@/api/upload/route';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const pathPrefix = payload.pathPrefix as string;
  const fileName = payload.fileName as string;
  const contentType = payload.contentType as string;

  if (!pathPrefix || !fileName || !contentType) {
    return NextResponse.json({ message: 'pathPrefix, fileName and contentType are required' }, { status: 400 });
  }

  const result = await createUploadUrl(pathPrefix, fileName, contentType);
  return NextResponse.json(result);
}
