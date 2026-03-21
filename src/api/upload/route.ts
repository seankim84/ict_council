import { supabase } from '@/lib/supabase';

const BUCKET = 'ict-council-assets';

export async function createUploadUrl(pathPrefix: string, fileName: string, contentType: string) {
  // 한글 등 비ASCII 문자가 포함된 파일명은 Supabase Storage에서 허용되지 않으므로
  // 확장자만 추출하고 타임스탬프 기반 안전한 파일명으로 변환
  const ext = fileName.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') ?? 'bin';
  const safeName = `${Date.now()}.${ext}`;
  const path = `${pathPrefix}/${safeName}`;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl }
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { uploadUrl: data.signedUrl, fileUrl: publicUrl };
}
