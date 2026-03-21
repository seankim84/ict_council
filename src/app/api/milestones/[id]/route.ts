import { NextRequest, NextResponse } from 'next/server';
import { deleteMilestone, updateMilestone } from '@/api/milestones/route';

interface RouteParams {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await request.json();
    const updated = await updateMilestone(params.id, payload);
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const deleted = await deleteMilestone(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
