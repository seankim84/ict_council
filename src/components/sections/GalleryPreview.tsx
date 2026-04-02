import Link from 'next/link';
import { listGallery } from '@/api/gallery/route';
import { GalleryPreviewClient } from './GalleryPreviewClient';
import type { GalleryEvent } from '@/components/gallery/GalleryList';

export async function GalleryPreview() {
  const gallery = await listGallery();

  // 이벤트별 그룹핑
  const eventMap = new Map<string, GalleryEvent>();
  for (const item of gallery) {
    if (!eventMap.has(item.eventName)) {
      eventMap.set(item.eventName, {
        eventName: item.eventName,
        eventDate: item.eventDate,
        thumbnailUrl: item.imageUrl,
        photoCount: 1,
        photos: [item.imageUrl],
        createdAt: item.createdAt
      });
    } else {
      const entry = eventMap.get(item.eventName)!;
      entry.photoCount += 1;
      entry.photos.push(item.imageUrl);
    }
  }

  // 날짜 내림차순, 최대 3개
  const preview = [...eventMap.values()]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, 3);

  if (preview.length === 0) return null;

  return (
    <section className="section-shell pt-0">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2 className="font-heading text-3xl font-bold lg:text-4xl">행사 갤러리</h2>
        </div>
        <Link href="/gallery" className="text-sm text-accent hover:text-accent-hover">
          전체 갤러리
        </Link>
      </div>
      <GalleryPreviewClient events={preview} />
    </section>
  );
}
