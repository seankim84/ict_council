import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const BUCKET = 'ict-council-assets';
const ALLOWED_PREFIXES = ['news/', 'gallery/'];

// 관리자 전용 파일 업로드 엔드포인트 — news/ 및 gallery/ 경로 허용
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const pathPrefix = formData.get('pathPrefix') as string | null;

  if (!file || !pathPrefix) {
    return NextResponse.json({ message: 'file and pathPrefix are required' }, { status: 400 });
  }

  if (!ALLOWED_PREFIXES.some((p) => pathPrefix.startsWith(p))) {
    return NextResponse.json({ message: 'Invalid path prefix' }, { status: 400 });
  }

  // 한글 등 비ASCII 문자가 포함된 파일명은 Supabase Storage에서 허용되지 않으므로
  // 확장자만 추출하고 타임스탬프 기반 안전한 파일명으로 변환
  const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') ?? 'bin';
  const safeName = `${Date.now()}.${ext}`;
  const filePath = `${pathPrefix}/${safeName}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
    contentType: file.type || 'application/octet-stream',
    upsert: false
  });

  if (error) {
    console.error('[admin/upload] Supabase storage error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return NextResponse.json({ fileUrl: publicUrl });
}
