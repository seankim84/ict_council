import { listGallery } from '@/api/gallery/route';
import type { GalleryItem } from '@/types/gallery';
import { GalleryList } from '@/components/gallery/GalleryList';
import type { GalleryEvent } from '@/components/gallery/GalleryList';

export const revalidate = 0;

function groupByEvent(items: GalleryItem[]): GalleryEvent[] {
  const map = new Map<string, GalleryEvent>();

  for (const item of items) {
    if (!map.has(item.eventName)) {
      map.set(item.eventName, {
        eventName: item.eventName,
        eventDate: item.eventDate,
        thumbnailUrl: item.imageUrl,
        photoCount: 1,
        photos: [item.imageUrl],
        createdAt: item.createdAt,
      });
    } else {
      const entry = map.get(item.eventName)!;
      entry.photoCount += 1;
      entry.photos.push(item.imageUrl);
      if (item.createdAt > entry.createdAt) entry.createdAt = item.createdAt;
    }
  }

  return [...map.values()].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
  );
}

export default async function GalleryPage() {
  const gallery = await listGallery();
  const events = groupByEvent(gallery);

  return (
    <div className="section-shell">
      <p className="eyebrow">Gallery</p>
      <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">갤러리</h1>
      <GalleryList events={events} />
    </div>
  );
}
