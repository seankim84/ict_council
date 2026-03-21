'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export interface GalleryEvent {
  eventName: string;
  eventDate: string;
  thumbnailUrl: string;
  photoCount: number;
  photos: string[];
  createdAt: string;
}

interface Props {
  events: GalleryEvent[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function GalleryList({ events }: Props) {
  const [modal, setModal] = useState<{ photos: string[]; index: number; eventName: string } | null>(null);

  const openModal = (event: GalleryEvent, index = 0) => {
    setModal({ photos: event.photos, index, eventName: event.eventName });
  };

  const closeModal = useCallback(() => setModal(null), []);

  const prev = useCallback(() => {
    setModal((m) => m && { ...m, index: (m.index - 1 + m.photos.length) % m.photos.length });
  }, []);

  const next = useCallback(() => {
    setModal((m) => m && { ...m, index: (m.index + 1) % m.photos.length });
  }, []);

  // 키보드 내비게이션
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

  if (events.length === 0) {
    return <p className="mt-16 text-center text-text-secondary">등록된 갤러리가 없습니다.</p>;
  }

  return (
    <>
      <ul className="mt-10 divide-y divide-[var(--color-border)]">
        {events.map((event) => (
          <li key={event.eventName}>
            <button
              type="button"
              onClick={() => openModal(event)}
              className="flex w-full flex-col gap-4 py-6 text-left transition-opacity hover:opacity-80 sm:flex-row sm:items-center sm:gap-6 sm:py-8"
            >
              {/* 텍스트 영역 */}
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-sm font-medium text-accent">갤러리</p>
                <h2 className="text-xl font-bold leading-snug text-text-primary lg:text-2xl">
                  {event.eventName}
                </h2>
                <p className="mt-3 text-sm text-text-secondary">사진 {event.photoCount}장</p>
                <p className="mt-2 text-sm text-text-secondary">
                  {event.eventDate ? formatDate(event.eventDate) : ''}
                </p>
              </div>

              {/* 대표 이미지 */}
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[var(--color-border)] sm:h-32 sm:w-48 sm:flex-shrink-0 lg:h-40 lg:w-60">
                <Image src={event.thumbnailUrl} alt={event.eventName} fill className="object-cover" />
              </div>
            </button>
          </li>
        ))}
      </ul>

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

          {/* 이벤트명 + 페이지 표시 */}
          <div className="absolute left-0 right-0 top-5 flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-white">{modal.eventName}</p>
            {modal.photos.length > 1 && (
              <p className="text-xs text-white/60">
                {modal.index + 1} / {modal.photos.length}
              </p>
            )}
          </div>

          {/* 이전 버튼 */}
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
          <div
            className="relative max-h-[82vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
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

          {/* 다음 버튼 */}
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

          {/* 하단 썸네일 스트립 (사진 2장 이상일 때) */}
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
