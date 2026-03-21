import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getNewsById } from '@/api/news/route';

interface Params {
  params: {
    id: string;
  };
}

export default async function NewsDetailPage({ params }: Params) {
  const news = await getNewsById(params.id);
  if (!news) {
    notFound();
  }

  return (
    <article className="section-shell mx-auto max-w-none md:max-w-4xl">
      <p className="eyebrow">{news.category === 'notice' ? '공지사항' : '활동뉴스'}</p>
      <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">{news.titleKo}</h1>
      <p className="mt-3 text-sm text-text-secondary">
        {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('ko-KR') : ''}
      </p>

      {news.thumbnailUrl && (
        <div className="relative mt-8 h-48 sm:h-[420px] w-full overflow-hidden rounded-xl">
          <Image
            src={news.thumbnailUrl}
            alt={news.titleKo}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-line text-text-primary">
        <p>{news.content}</p>
      </div>

      {news.imageUrls && news.imageUrls.length > 0 && (
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold">사진</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {news.imageUrls.map((url, i) => (
              <div
                key={i}
                className="relative h-64 w-full overflow-hidden rounded-xl border border-[var(--color-border)]"
              >
                <Image
                  src={url}
                  alt={`${news.titleKo} 이미지 ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
