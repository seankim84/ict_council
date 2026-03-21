import { NextRequest, NextResponse } from 'next/server';
import { deleteMember, getMemberById, updateMember } from '@/api/members/route';

interface RouteParams {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const member = await getMemberById(params.id);
  if (!member) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const payload = await request.json();
  const updated = await updateMember(params.id, payload);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const deleted = await deleteMember(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
