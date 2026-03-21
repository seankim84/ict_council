'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { MEMBER_SECTORS } from '@/types/member';
import type { Member } from '@/types/member';

interface Props {
  member?: Member; // 편집 모드일 때 기존 데이터
}

export function MemberForm({ member }: Props) {
  const router = useRouter();
  const isEdit = !!member;

  const [form, setForm] = useState({
    nameKo: '',
    sector: '',
    description: '',
    logoUrl: '',
    profilePhotoUrl: '',
    websiteUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 편집 모드: 기존 데이터로 초기값 설정
  useEffect(() => {
    if (member) {
      setForm({
        nameKo: member.nameKo ?? '',
        sector: member.sector ?? '',
        description: member.description ?? '',
        logoUrl: member.logoUrl ?? '',
        profilePhotoUrl: member.profilePhotoUrl ?? '',
        websiteUrl: member.websiteUrl ?? ''
      });
    }
  }, [member]);

  async function handleFileUpload(file: File, field: 'logoUrl' | 'profilePhotoUrl', pathPrefix: string) {
    const setUploading = field === 'logoUrl' ? setIsUploadingLogo : setIsUploadingPhoto;
    setSubmitError('');
    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathPrefix,
          fileName: file.name,
          contentType: file.type || 'application/octet-stream'
        })
      });

      if (!response.ok) throw new Error('업로드 URL 발급에 실패했습니다.');

      const data = (await response.json()) as { uploadUrl: string; fileUrl: string };

      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file
      });

      if (!uploadResponse.ok) throw new Error('파일 업로드에 실패했습니다.');

      setForm((prev) => ({ ...prev, [field]: data.fileUrl }));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError('');

    const nextErrors: Record<string, string> = {};
    if (!form.nameKo.trim()) nextErrors.nameKo = '회사명은 필수입니다.';
    if (!form.sector.trim()) nextErrors.sector = '업종은 필수입니다.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const url = isEdit ? `/api/members/${member!.id}` : '/api/members';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, nameEn: form.nameKo })
      });

      if (!response.ok) throw new Error(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');

      router.push('/admin/members');
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isUploading = isUploadingLogo || isUploadingPhoto;

  return (
    <form className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-bg-secondary p-6" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        회사명*
        <input
          className="rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary"
          value={form.nameKo}
          onChange={(event) => setForm((prev) => ({ ...prev, nameKo: event.target.value }))}
        />
        {errors.nameKo ? <span className="text-xs text-red-400">{errors.nameKo}</span> : null}
      </label>
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        업종*
        <select
          className="rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary"
          value={form.sector}
          onChange={(event) => setForm((prev) => ({ ...prev, sector: event.target.value }))}
        >
          <option value="">업종 선택</option>
          {MEMBER_SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.sector ? <span className="text-xs text-red-400">{errors.sector}</span> : null}
      </label>
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        로고 이미지 파일
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFileUpload(file, 'logoUrl', 'members/logos');
            }}
            className="block w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-3 py-2 text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-white"
          />
          {isUploadingLogo ? (
            <span className="inline-flex items-center gap-2 text-xs text-text-secondary">
              <Spinner /> 업로드 중...
            </span>
          ) : null}
          {form.logoUrl && <span className="text-xs text-emerald-400">업로드 완료</span>}
        </div>
        {form.logoUrl && <span className="break-all text-xs text-text-muted">{form.logoUrl}</span>}
      </label>
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        프로필 사진 파일 <span className="text-xs text-text-muted">(선택 · 미입력 시 기본 이미지 사용)</span>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFileUpload(file, 'profilePhotoUrl', 'members/photos');
            }}
            className="block w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-3 py-2 text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-white"
          />
          {isUploadingPhoto ? (
            <span className="inline-flex items-center gap-2 text-xs text-text-secondary">
              <Spinner /> 업로드 중...
            </span>
          ) : null}
          {form.profilePhotoUrl && <span className="text-xs text-emerald-400">업로드 완료</span>}
        </div>
        {form.profilePhotoUrl && <span className="break-all text-xs text-text-muted">{form.profilePhotoUrl}</span>}
      </label>
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        소개글
        <textarea
          className="min-h-28 rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-text-secondary">
        웹사이트 URL
        <input
          className="rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary"
          value={form.websiteUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, websiteUrl: event.target.value }))}
        />
      </label>
      {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
      <Button type="submit" disabled={isSubmitting || isUploading}>
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner /> 저장 중...
          </span>
        ) : isEdit ? '수정 완료' : '저장'}
      </Button>
    </form>
  );
}
