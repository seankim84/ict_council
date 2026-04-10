'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { GalleryUpload } from '@/components/admin/GalleryUpload';
import { Spinner } from '@/components/ui/Spinner';
import type { GalleryItem } from '@/types/gallery';

interface EditState {
  originalName: string;
  eventName: string;
  eventDate: string;
  items: GalleryItem[];
}

async function uploadFile(file: File): Promise<string> {
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
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type || 'application/octet-stream' }
  });
  if (!uploadRes.ok) throw new Error(`파일 업로드 실패 (${uploadRes.status})`);
  return fileUrl;
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

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

  useEffect(() => { void fetchGallery(); }, [fetchGallery]);

  useEffect(() => {
    const handler = () => void fetchGallery();
    window.addEventListener('gallery-updated', handler);
    return () => window.removeEventListener('gallery-updated', handler);
  }, [fetchGallery]);

  function openEdit(eventName: string) {
    const items = gallery.filter((item) => item.eventName === eventName);
    setEditState({
      originalName: eventName,
      eventName,
      eventDate: items[0]?.eventDate ?? '',
      items
    });
    setNewFiles([]);
    setNewPreviews([]);
    setEditError('');
  }

  function closeEdit() {
    newPreviews.forEach((url) => URL.revokeObjectURL(url));
    setEditState(null);
    setNewFiles([]);
    setNewPreviews([]);
    setEditError('');
  }

  function handleNewFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  }

  function removeNewFile(index: number) {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleDeletePhoto(id: string) {
    if (!editState) return;
    await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    setEditState((prev) => prev && { ...prev, items: prev.items.filter((item) => item.id !== id) });
    setGallery((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleSaveEdit() {
    if (!editState) return;
    if (!editState.eventName.trim()) { setEditError('행사명을 입력해주세요.'); return; }
    setEditSaving(true);
    setEditError('');
    try {
      // 1. 행사명/날짜 수정
      const res = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldEventName: editState.originalName,
          eventName: editState.eventName.trim(),
          eventDate: editState.eventDate
        })
      });
      if (!res.ok) throw new Error('행사 정보 수정에 실패했습니다.');

      // 2. 새 사진 업로드
      for (let i = 0; i < newFiles.length; i++) {
        const imageUrl = await uploadFile(newFiles[i]);
        const r = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl,
            eventName: editState.eventName.trim(),
            eventDate: editState.eventDate,
            order: editState.items.length + i
          })
        });
        if (!r.ok) throw new Error('사진 추가에 실패했습니다.');
      }

      await fetchGallery();
      closeEdit();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setEditSaving(false);
    }
  }

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

  const events = Array.from(new Set(gallery.map((item) => item.eventName))).filter(Boolean);

  const inputCls = 'rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/40';

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
              <div key={eventName} className="rounded-xl border border-[var(--color-border)] bg-bg-secondary p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <h2 className="text-lg font-semibold truncate">{eventName}</h2>
                    {firstItem?.eventDate && (
                      <span className="text-sm text-text-secondary shrink-0">{firstItem.eventDate}</span>
                    )}
                    <span className="text-sm text-text-muted shrink-0">{items.length}장</span>
                  </div>
                  <button
                    onClick={() => openEdit(eventName)}
                    className="shrink-0 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm text-accent hover:border-accent/40 hover:bg-accent/10"
                  >
                    수정
                  </button>
                </div>
                <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
                  {items.map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-xl border border-[var(--color-border)]">
                      <div className="relative h-32 w-full">
                        <Image src={item.imageUrl} alt={item.eventName} fill className="object-cover" />
                      </div>
                      <button
                        onClick={() => void handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                      >
                        {deletingId === item.id ? '...' : '삭제'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 수정 모달 */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-12 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-bg-secondary p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">갤러리 수정</h2>
              <button onClick={closeEdit} className="text-text-muted hover:text-text-primary text-xl">×</button>
            </div>

            {/* 행사명 / 날짜 */}
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="grid gap-1.5">
                <label className="text-sm text-text-secondary">행사명 *</label>
                <input
                  type="text"
                  value={editState.eventName}
                  onChange={(e) => setEditState({ ...editState, eventName: e.target.value })}
                  className={inputCls + ' w-full'}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm text-text-secondary">행사 날짜</label>
                <input
                  type="date"
                  value={editState.eventDate}
                  onChange={(e) => setEditState({ ...editState, eventDate: e.target.value })}
                  className={inputCls + ' w-full'}
                />
              </div>
            </div>

            {/* 기존 사진 */}
            <div className="mb-4">
              <p className="mb-2 text-sm text-text-secondary">등록된 사진 <span className="text-text-muted">({editState.items.length}장 · 삭제하려면 ✕ 클릭)</span></p>
              {editState.items.length === 0 ? (
                <p className="text-sm text-text-muted">사진이 없습니다.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {editState.items.map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-lg border border-[var(--color-border)]">
                      <div className="relative h-24 w-full">
                        <Image src={item.imageUrl} alt="" fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleDeletePhoto(item.id)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 새 사진 추가 */}
            <div className="mb-5">
              <p className="mb-2 text-sm text-text-secondary">사진 추가</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewFiles}
                className="text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-1.5 file:text-sm file:text-accent"
              />
              {newPreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {newPreviews.map((url, i) => (
                    <div key={i} className="relative overflow-hidden rounded-lg border border-[var(--color-border)]">
                      <div className="relative h-24 w-full">
                        <Image src={url} alt="" fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {editError && (
              <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{editError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm"
              >
                취소
              </button>
              <button
                onClick={() => void handleSaveEdit()}
                disabled={editSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {editSaving ? <><Spinner /> 저장 중...</> : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
