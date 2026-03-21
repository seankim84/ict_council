import { NextRequest, NextResponse } from 'next/server';
import { createExecutive, deleteExecutive, listExecutives, updateExecutive } from '@/api/executives/route';

export async function GET() {
  const executives = await listExecutives();
  return NextResponse.json(executives);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  return NextResponse.json(await createExecutive(payload), { status: 201 });
}

export async function PUT(request: NextRequest) {
  const payload = await request.json();
  const id = payload.id as string | undefined;
  if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 });

  const updated = await updateExecutive(id, payload);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 });

  const deleted = await deleteExecutive(id);
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
