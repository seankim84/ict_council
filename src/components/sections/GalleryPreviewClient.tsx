'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GalleryEvent } from '@/components/gallery/GalleryList';

interface Props {
  events: GalleryEvent[];
}

export function GalleryPreviewClient({ events }: Props) {
  const [modal, setModal] = useState<{ photos: string[]; index: number; eventName: string } | null>(null);

  const closeModal = useCallback(() => setModal(null), []);
  const prev = useCallback(() => {
    setModal((m) => m && { ...m, index: (m.index - 1 + m.photos.length) % m.photos.length });
  }, []);
  const next = useCallback(() => {
    setModal((m) => m && { ...m, index: (m.index + 1) % m.photos.length });
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, prev, next, closeModal]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((item) => (
          <button
            key={item.eventName}
            type="button"
            onClick={() => setModal({ photos: item.photos, index: 0, eventName: item.eventName })}
            className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] text-left"
          >
            <Image
              src={item.thumbnailUrl}
              alt={item.eventName}
              width={800}
              height={560}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm">
              <p className="font-semibold text-white">{item.eventName}</p>
              <p className="text-white/70">{item.eventDate}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 라이트박스 모달 */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          {/* 닫기 */}
          <button
            type="button"
            onClick={closeModal}
            aria-label="닫기"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            ×
          </button>

          {/* 행사명 + 페이지 */}
          <div className="absolute left-0 right-0 top-5 flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-white">{modal.eventName}</p>
            {modal.photos.length > 1 && (
              <p className="text-xs text-white/60">{modal.index + 1} / {modal.photos.length}</p>
            )}
          </div>

          {/* 이전 */}
          {modal.photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="이전 사진"
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/25"
            >
              ‹
            </button>
          )}

          {/* 사진 */}
          <div className="relative max-h-[82vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              key={modal.photos[modal.index]}
              src={modal.photos[modal.index]}
              alt={`${modal.eventName} ${modal.index + 1}`}
              width={1400}
              height={900}
              className="max-h-[82vh] w-auto rounded-xl object-contain shadow-2xl"
              style={{ maxWidth: '90vw' }}
            />
          </div>

          {/* 다음 */}
          {modal.photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="다음 사진"
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white hover:bg-white/25"
            >
              ›
            </button>
          )}

          {/* 하단 썸네일 */}
          {modal.photos.length > 1 && (
            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-6">
              {modal.photos.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setModal((m) => m && { ...m, index: i }); }}
                  className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === modal.index ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image src={url} alt={`썸네일 ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
