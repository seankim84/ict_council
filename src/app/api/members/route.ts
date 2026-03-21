import { NextRequest, NextResponse } from 'next/server';
import { createMember, listMembers } from '@/api/members/route';

export async function GET() {
  const members = await listMembers();
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const created = await createMember(payload);
  return NextResponse.json(created, { status: 201 });
}
