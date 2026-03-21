import { NextRequest, NextResponse } from 'next/server';
import { createMilestone, listMilestones } from '@/api/milestones/route';

export async function GET() {
  try {
    const milestones = await listMilestones();
    return NextResponse.json(milestones);
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const created = await createMilestone(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 });
  }
}
