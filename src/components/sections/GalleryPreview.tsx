import Link from 'next/link';
import Image from 'next/image';
import { listGallery } from '@/api/gallery/route';

export async function GalleryPreview() {
  const gallery = await listGallery();

  // 이벤트별 대표 사진 1장씩, 날짜 내림차순, 최대 3개
  const seen = new Set<string>();
  const preview = [...gallery]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .filter((item) => {
      if (seen.has(item.eventName)) return false;
      seen.add(item.eventName);
      return true;
    })
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((item) => (
          <article key={item.id} className="group relative overflow-hidden rounded-xl border border-[var(--color-border)]">
            <Image src={item.imageUrl} alt={item.eventName} width={800} height={560} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm">
              <p className="font-semibold">{item.eventName}</p>
              <p className="text-text-secondary">{item.eventDate}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
