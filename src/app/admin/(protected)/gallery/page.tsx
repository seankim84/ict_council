'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { GalleryUpload } from '@/components/admin/GalleryUpload';
import type { GalleryItem } from '@/types/gallery';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = (await res.json()) as GalleryItem[];
      setGallery(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGallery();
  }, [fetchGallery]);

  // GalleryUpload에서 router.refresh()를 호출하면 Next.js가 서버 컴포넌트를 재렌더링하지만
  // 이 페이지는 클라이언트 컴포넌트이므로 커스텀 이벤트로 새로고침을 트리거
  useEffect(() => {
    const handler = () => void fetchGallery();
    window.addEventListener('gallery-updated', handler);
    return () => window.removeEventListener('gallery-updated', handler);
  }, [fetchGallery]);

  async function handleDelete(id: string) {
    if (!confirm('이 사진을 삭제하시겠습니까?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setGallery((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  // 행사별로 그룹핑
  const events = Array.from(new Set(gallery.map((item) => item.eventName))).filter(Boolean);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">갤러리 관리</h1>

      <GalleryUpload onUploaded={fetchGallery} />

      {isLoading ? (
        <p className="text-text-secondary">불러오는 중...</p>
      ) : gallery.length === 0 ? (
        <p className="text-text-secondary">등록된 사진이 없습니다.</p>
      ) : (
        <div className="space-y-8">
          {events.map((eventName) => {
            const items = gallery.filter((item) => item.eventName === eventName);
            const firstItem = items[0];
            return (
              <div key={eventName} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{eventName}</h2>
                  {firstItem?.eventDate && (
                    <span className="text-sm text-text-secondary">{firstItem.eventDate}</span>
                  )}
                  <span className="text-sm text-text-muted">{items.length}장</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-bg-secondary"
                    >
                      <div className="relative h-44 w-full">
                        <Image
                          src={item.imageUrl}
                          alt={item.eventName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        onClick={() => void handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                      >
                        {deletingId === item.id ? '삭제 중...' : '삭제'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
