'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

async function uploadFile(file: File): Promise<string> {
  // 1단계: 서버에서 서명 URL 발급 (파일 데이터 없이 파일명/타입만 전송)
  const urlRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pathPrefix: 'gallery/images',
      fileName: file.name,
      contentType: file.type || 'application/octet-stream'
    })
  });

  if (!urlRes.ok) throw new Error(`서명 URL 발급 실패 (${urlRes.status})`);
  const { uploadUrl, fileUrl } = (await urlRes.json()) as { uploadUrl: string; fileUrl: string };

  // 2단계: Supabase에 직접 업로드 (Next.js 서버 거치지 않아 용량 제한 없음)
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' }
  });

  if (!uploadRes.ok) throw new Error(`파일 업로드 실패 (${uploadRes.status})`);
  return fileUrl;
}

interface FileEntry {
  file: File;
  previewUrl: string;
}

interface Props {
  onUploaded?: () => void;
}

export function GalleryUpload({ onUploaded }: Props) {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const entries: FileEntry[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setFileEntries((prev) => [...prev, ...entries]);
    e.target.value = '';
  }

  function removeFile(index: number) {
    setFileEntries((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventName.trim()) {
      setError('행사명을 입력해 주세요.');
      return;
    }
    if (fileEntries.length === 0) {
      setError('이미지를 한 장 이상 선택해 주세요.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      for (let i = 0; i < fileEntries.length; i++) {
        const imageUrl = await uploadFile(fileEntries[i].file);
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl,
            eventName: eventName.trim(),
            eventDate,
            order: i
          })
        });
        if (!res.ok) throw new Error('갤러리 저장에 실패했습니다.');
      }

      // 폼 초기화
      setEventName('');
      setEventDate(new Date().toISOString().slice(0, 10));
      fileEntries.forEach((e) => URL.revokeObjectURL(e.previewUrl));
      setFileEntries([]);
      onUploaded?.();
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
      className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-bg-secondary p-6"
    >
      <h2 className="text-lg font-semibold">갤러리 사진 업로드</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm text-text-secondary">행사명 *</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="행사명을 입력하세요"
            className={inputCls}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-text-secondary">행사 날짜</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-text-secondary">이미지 선택 (여러 장 가능)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          className="text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-2 file:text-accent"
        />
      </div>

      {fileEntries.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {fileEntries.map((entry, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)]"
            >
              <Image src={entry.previewUrl} alt={`미리보기 ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <Button type="submit" disabled={isLoading} className="w-fit">
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner /> 업로드 중...
          </span>
        ) : (
          '업로드'
        )}
      </Button>
    </form>
  );
}
