import { NextRequest, NextResponse } from 'next/server';
import { createGallery, deleteGallery, listGallery, updateGalleryEvent } from '@/api/gallery/route';

export async function GET() {
  const gallery = await listGallery();
  return NextResponse.json(gallery);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const created = await createGallery(payload);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { oldEventName, eventName, eventDate } = await request.json() as {
    oldEventName: string;
    eventName: string;
    eventDate: string;
  };
  if (!oldEventName || !eventName) {
    return NextResponse.json({ message: 'oldEventName and eventName are required' }, { status: 400 });
  }
  const ok = await updateGalleryEvent(oldEventName, eventName, eventDate);
  if (!ok) return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 });

  const deleted = await deleteGallery(id);
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
