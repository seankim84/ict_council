'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { NewsItem } from '@/types/news';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface Props {
  initialData?: NewsItem;
}

type ImageEntry =
  | { type: 'existing'; url: string }
  | { type: 'new'; file: File; previewUrl: string };

async function uploadFile(file: File, pathPrefix: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('pathPrefix', pathPrefix);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });

  let body: Record<string, unknown> = {};
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    // 응답 바디가 비어있거나 JSON이 아닌 경우
  }

  if (!res.ok) {
    throw new Error(
      typeof body.message === 'string' ? body.message : `파일 업로드 실패 (${res.status})`
    );
  }

  if (typeof body.fileUrl !== 'string') {
    throw new Error('업로드 응답에서 URL을 받지 못했습니다.');
  }
  return body.fileUrl;
}

export function NewsForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.titleKo ?? '');
  const [category, setCategory] = useState<'notice' | 'activity' | 'seminar' | 'member' | 'policy'>(
    initialData?.category ?? 'notice'
  );
  const [content, setContent] = useState(initialData?.content ?? '');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? initialData.publishedAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );

  // 이미지 (기존 URL + 새 파일) — 첫 번째 이미지가 자동으로 썸네일로 사용됨
  const [images, setImages] = useState<ImageEntry[]>(
    (initialData?.imageUrls ?? []).map((url) => ({ type: 'existing' as const, url }))
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const newEntries: ImageEntry[] = files.map((file) => ({
      type: 'new',
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...newEntries]);
    e.target.value = '';
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const entry = prev[index];
      if (entry.type === 'new') URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // 이미지 업로드
      const imageUrls: string[] = [];
      for (const entry of images) {
        if (entry.type === 'existing') {
          imageUrls.push(entry.url);
        } else {
          const url = await uploadFile(entry.file, 'news/images');
          imageUrls.push(url);
        }
      }

      // 첫 번째 이미지를 썸네일로 사용
      const thumbnailUrl = imageUrls[0] ?? '';

      const payload = {
        titleKo: title,
        titleEn: title,
        category,
        content,
        thumbnailUrl,
        imageUrls,
        publishedAt: new Date(publishedAt).toISOString()
      };

      const url = isEdit ? `/api/news/${initialData!.id}` : '/api/news';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let message = `저장 실패 (${res.status})`;
        try {
          const data = (await res.json()) as { message?: string };
          if (data.message) message = data.message;
        } catch {}
        throw new Error(message);
      }

      router.push('/admin/news');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls =
    'rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40';

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 rounded-xl border border-[var(--color-border)] bg-bg-secondary p-6"
    >
      {/* 제목 */}
      <div className="grid gap-2">
        <label className="text-sm text-text-secondary">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className={inputCls}
        />
      </div>

      {/* 카테고리 & 날짜 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm text-text-secondary">카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'notice' | 'activity' | 'seminar' | 'member' | 'policy')}
            className={inputCls}
          >
            <option value="notice">공지사항</option>
            <option value="activity">활동뉴스</option>
            <option value="seminar">세미나·행사</option>
            <option value="member">회원사 소식</option>
            <option value="policy">정책·동향</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-text-secondary">게시 날짜</label>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* 본문 */}
      <div className="grid gap-2">
        <label className="text-sm text-text-secondary">본문</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="뉴스 본문을 입력하세요"
          rows={8}
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* 이미지 (다중) — 첫 번째 이미지가 썸네일로 자동 지정 */}
      <div className="grid gap-2">
        <label className="text-sm text-text-secondary">
          이미지{' '}
          <span className="text-text-muted">(여러 장 선택 가능 · 첫 번째 사진이 대표 이미지로 사용됩니다)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-2 file:text-accent"
        />
        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((entry, i) => {
              const src = entry.type === 'existing' ? entry.url : entry.previewUrl;
              return (
                <div
                  key={i}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    i === 0
                      ? 'border-accent ring-2 ring-accent/40'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  <Image src={src} alt={`이미지 ${i + 1}`} fill className="object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-accent/80 px-1.5 py-0.5 text-[10px] text-white">
                      대표
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> 저장 중...
            </span>
          ) : isEdit ? (
            '수정 완료'
          ) : (
            '뉴스 등록'
          )}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/admin/news')}>
          취소
        </Button>
      </div>
    </form>
  );
}
