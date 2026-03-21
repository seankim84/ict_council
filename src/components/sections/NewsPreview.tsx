import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { listNews } from '@/api/news/route';

const CATEGORY_LABEL: Record<string, string> = {
  notice: '공지사항', activity: '활동뉴스', seminar: '세미나·행사', member: '회원사 소식', policy: '정책·동향',
};

export async function NewsPreview() {
  const news = await listNews();

  return (
    <section className="section-shell pt-0">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow">Latest News</p>
          <h2 className="font-heading text-3xl font-bold lg:text-4xl">최신 뉴스</h2>
        </div>
        <Link href="/news" className="text-sm text-accent hover:text-accent-hover">
          전체 보기
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.slice(0, 3).map((item) => (
          <Card key={item.id} className="overflow-hidden p-0">
            {item.thumbnailUrl && (
              <div className="relative h-44 w-full">
                <Image src={item.thumbnailUrl} alt={item.titleKo} fill className="object-cover" />
              </div>
            )}
            <div className="space-y-3 p-6">
              <Badge>{CATEGORY_LABEL[item.category] ?? item.category}</Badge>
              <h3 className="text-lg font-semibold leading-snug">{item.titleKo}</h3>
              <Link href={`/news/${item.id}`} className="inline-block text-sm text-accent hover:text-accent-hover">
                자세히 보기
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
