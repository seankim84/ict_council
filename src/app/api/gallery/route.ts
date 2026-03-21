import { NextRequest, NextResponse } from 'next/server';
import { createGallery, deleteGallery, listGallery } from '@/api/gallery/route';

export async function GET() {
  const gallery = await listGallery();
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const created = await createGallery(payload);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 });

  const deleted = await deleteGallery(id);
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
