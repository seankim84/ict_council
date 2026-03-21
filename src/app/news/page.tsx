'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { NewsItem } from '@/types/news';

const tabs = ['all', 'notice', 'activity', 'seminar', 'member', 'policy'] as const;

const tabLabels: Record<string, string> = {
  all: '전체',
  notice: '공지사항',
  activity: '활동뉴스',
  seminar: '세미나·행사',
  member: '회원사 소식',
  policy: '정책·동향',
};

export default function NewsPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [tab, setTab] = useState<(typeof tabs)[number]>('all');

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data: NewsItem[]) => setAllNews(data))
      .catch(() => {});
  }, []);

  const news = useMemo(() => {
    const sorted = [...allNews].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    if (tab === 'all') {
      return sorted;
    }
    return sorted.filter((item) => item.category === tab);
  }, [allNews, tab]);

  return (
    <div className="section-shell">
      <p className="eyebrow">News</p>
      <h1 className="font-heading text-4xl font-bold lg:text-5xl">뉴스</h1>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-lg border px-4 py-2 text-sm ${
              tab === item ? 'border-accent bg-accent-subtle text-accent' : 'border-[var(--color-border)] text-text-secondary'
            }`}
          >
            {tabLabels[item]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {news.map((item) => (
          <Link
            href={`/news/${item.id}`}
            key={item.id}
            className="grid gap-4 rounded-xl border border-[var(--color-border)] bg-bg-secondary p-4 transition-all hover:border-[var(--color-border-strong)] md:grid-cols-[220px_1fr]"
          >
            {item.thumbnailUrl && (
              <Image src={item.thumbnailUrl} alt={item.titleKo} width={220} height={130} className="h-32 w-full rounded-lg object-cover" />
            )}
            <div>
              <p className="text-xs uppercase tracking-wider text-accent">{tabLabels[item.category] ?? item.category}</p>
              <h2 className="mt-2 text-xl font-semibold">{item.titleKo}</h2>
              <p className="hidden sm:block text-sm text-text-secondary">{item.titleEn}</p>
              <p className="mt-2 text-sm text-text-secondary">{new Date(item.publishedAt).toLocaleDateString('ko-KR')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
