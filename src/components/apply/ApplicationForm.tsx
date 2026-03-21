'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { MEMBER_SECTORS } from '@/types/member';

type UploadField = 'logoUrl' | 'profilePhotoUrl';

async function uploadFile(file: File, pathPrefix: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pathPrefix', pathPrefix);

  const response = await fetch('/api/applications/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? '파일 업로드에 실패했습니다.');
  }

  const { fileUrl } = (await response.json()) as { fileUrl: string };
  return fileUrl;
}

const inputCls =
  'rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40';

function FieldLabel({
  required,
  optional,
  children
}: {
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1 text-sm text-text-secondary">
      {required && <span className="text-accent">*</span>}
      {children}
      {optional && <span className="text-xs text-text-muted">(선택)</span>}
    </span>
  );
}

export function ApplicationForm() {
  const [form, setForm] = useState({
    name: '',
    applicantName: '',
    applicantPosition: '',
    phone: '',
    sector: '',
    logoUrl: '',
    profilePhotoUrl: '',
    description: '',
    websiteUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<UploadField, boolean>>({
    logoUrl: false,
    profilePhotoUrl: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isUploading = uploading.logoUrl || uploading.profilePhotoUrl;

  async function handleFileUpload(file: File, field: UploadField, pathPrefix: string) {
    setSubmitError('');
    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const url = await uploadFile(file, pathPrefix);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError('');

    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = '회사명은 필수입니다.';
    if (!form.applicantName.trim()) nextErrors.applicantName = '성함은 필수입니다.';
    if (!form.sector) nextErrors.sector = '업종을 선택해주세요.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, nameKo: form.name })
      });
      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? '신청 중 오류가 발생했습니다.');
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl text-accent">
          ✓
        </div>
        <h2 className="font-heading text-2xl font-bold text-text-primary">신청이 완료되었습니다</h2>
        <p className="max-w-md leading-relaxed text-text-secondary">
          회원사 가입 신청을 주셔서 감사합니다.
          <br />
          관리자 검토 후 순차적으로 연락드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5 rounded-2xl border border-[var(--color-border)] bg-bg-secondary p-8"
      onSubmit={handleSubmit}
    >
      {/* 회사명 */}
      <label className="flex flex-col gap-2">
        <FieldLabel required>회사명</FieldLabel>
        <input
          className={inputCls}
          placeholder="예) KOCHAM ICT Corp."
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
      </label>

      {/* 성함 & 직책 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <FieldLabel required>성함</FieldLabel>
          <input
            className={inputCls}
            placeholder="홍길동"
            value={form.applicantName}
            onChange={(e) => setForm((prev) => ({ ...prev, applicantName: e.target.value }))}
          />
          {errors.applicantName && (
            <span className="text-xs text-red-400">{errors.applicantName}</span>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel optional>직책</FieldLabel>
          <input
            className={inputCls}
            placeholder="예) 대표이사, 이사"
            value={form.applicantPosition}
            onChange={(e) => setForm((prev) => ({ ...prev, applicantPosition: e.target.value }))}
          />
        </label>
      </div>

      {/* 전화번호 */}
      <label className="flex flex-col gap-2">
        <FieldLabel optional>전화번호</FieldLabel>
        <input
          type="tel"
          className={inputCls}
          placeholder="+84 00-000-0000"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        />
      </label>

      {/* 업종 */}
      <label className="flex flex-col gap-2">
        <FieldLabel required>업종</FieldLabel>
        <select
          className={inputCls}
          value={form.sector}
          onChange={(e) => setForm((prev) => ({ ...prev, sector: e.target.value }))}
        >
          <option value="">업종을 선택하세요</option>
          {MEMBER_SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.sector && <span className="text-xs text-red-400">{errors.sector}</span>}
      </label>

      {/* 로고 */}
      <label className="flex flex-col gap-2">
        <FieldLabel optional>로고 이미지</FieldLabel>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFileUpload(file, 'logoUrl', 'applications/logos');
            }}
            className="block w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-3 py-2 text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-white"
          />
          {uploading.logoUrl && (
            <span className="inline-flex items-center gap-2 text-xs text-text-secondary">
              <Spinner /> 업로드 중...
            </span>
          )}
          {form.logoUrl && <span className="text-xs text-emerald-400">✓ 업로드 완료</span>}
        </div>
      </label>

      {/* 프로필 사진 */}
      <label className="flex flex-col gap-2">
        <FieldLabel optional>프로필 사진</FieldLabel>
        <p className="text-xs text-text-muted">미입력 시 기본 이미지가 사용됩니다.</p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFileUpload(file, 'profilePhotoUrl', 'applications/photos');
            }}
            className="block w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-3 py-2 text-sm text-text-secondary file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-white"
          />
          {uploading.profilePhotoUrl && (
            <span className="inline-flex items-center gap-2 text-xs text-text-secondary">
              <Spinner /> 업로드 중...
            </span>
          )}
          {form.profilePhotoUrl && <span className="text-xs text-emerald-400">✓ 업로드 완료</span>}
        </div>
      </label>

      {/* 소개글 */}
      <label className="flex flex-col gap-2">
        <FieldLabel optional>소개글</FieldLabel>
        <textarea
          className={`${inputCls} min-h-28`}
          placeholder="회사를 간략하게 소개해 주세요."
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </label>

      {/* 웹사이트 */}
      <label className="flex flex-col gap-2">
        <FieldLabel optional>웹사이트 URL</FieldLabel>
        <input
          type="url"
          className={inputCls}
          placeholder="https://example.com"
          value={form.websiteUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
        />
      </label>

      {submitError && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{submitError}</p>
      )}

      <Button type="submit" disabled={isSubmitting || isUploading} className="mt-2">
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner /> 제출 중...
          </span>
        ) : (
          '신청서 제출하기'
        )}
      </Button>
    </form>
  );
}
