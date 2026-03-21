import { NextRequest, NextResponse } from 'next/server';
import { createApplication, listApplications } from '@/api/applications/route';
import type { ApplicationStatus } from '@/types/application';

// GET /api/applications — 목록 조회 (어드민 페이지는 미들웨어로 보호됨)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') as ApplicationStatus | null;

  const data = await listApplications(status ?? undefined);
  return NextResponse.json(data);
}

// POST /api/applications — 공개 (신청 제출)
export async function POST(request: NextRequest) {
  const payload = await request.json();

  const nameKo = (payload.nameKo as string)?.trim() ?? '';
  const nameEn = nameKo; // 단일 회사명 필드 — 동일값으로 저장
  const applicantName = (payload.applicantName as string)?.trim() ?? '';
  const sector = (payload.sector as string)?.trim() ?? '';

  if (!nameKo || !applicantName || !sector) {
    return NextResponse.json(
      { message: '회사명, 성함, 업종은 필수입니다.' },
      { status: 400 }
    );
  }

  const application = await createApplication({
    nameKo,
    nameEn,
    applicantName,
    applicantPosition: (payload.applicantPosition as string)?.trim() ?? '',
    phone: (payload.phone as string)?.trim() ?? '',
    sector,
    logoUrl: (payload.logoUrl as string)?.trim() ?? '',
    profilePhotoUrl: (payload.profilePhotoUrl as string)?.trim() ?? '',
    description: (payload.description as string)?.trim() ?? '',
    websiteUrl: (payload.websiteUrl as string)?.trim() ?? ''
  });

  return NextResponse.json(application, { status: 201 });
}
