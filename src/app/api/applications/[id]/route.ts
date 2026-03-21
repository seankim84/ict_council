import { NextRequest, NextResponse } from 'next/server';
import { updateApplicationStatus } from '@/api/applications/route';
import { createMember } from '@/api/members/route';
import { supabase } from '@/lib/supabase';
import type { MemberSector } from '@/types/member';

interface RouteParams {
  params: { id: string };
}

// PUT /api/applications/[id] — 승인(approve) / 거절(reject)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const payload = await request.json();
  const action = payload.action as 'approve' | 'reject';

  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ message: 'action must be approve or reject' }, { status: 400 });
  }

  if (action === 'approve') {
    const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
    if (error || !data) {
      return NextResponse.json({ message: '신청 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    await createMember({
      nameKo: data.name_ko as string,
      nameEn: data.name_en as string,
      sector: (data.sector as MemberSector) ?? '기타',
      description: (data.description as string) ?? '',
      logoUrl: (data.logo_url as string) ?? '',
      profilePhotoUrl: (data.profile_photo_url as string) ?? '',
      websiteUrl: (data.website_url as string) ?? ''
    });

    await updateApplicationStatus(id, 'approved');
    return NextResponse.json({ ok: true });
  }

  await updateApplicationStatus(id, 'rejected');
  return NextResponse.json({ ok: true });
}
