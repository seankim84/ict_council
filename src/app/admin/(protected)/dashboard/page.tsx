import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { listMembers } from '@/api/members/route';
import { listNews } from '@/api/news/route';
import { listGallery } from '@/api/gallery/route';
import { listApplications } from '@/api/applications/route';

export default async function AdminDashboardPage() {
  const [members, news, gallery, pendingApps] = await Promise.all([
    listMembers(),
    listNews(),
    listGallery(),
    listApplications('pending')
  ]);
  const recentNews = [...news].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-text-secondary">회원사 수</p>
          <p className="mt-2 text-3xl font-bold text-accent">{members.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">뉴스 수</p>
          <p className="mt-2 text-3xl font-bold text-accent">{news.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">갤러리 사진 수</p>
          <p className="mt-2 text-3xl font-bold text-accent">{gallery.length}</p>
        </Card>
        <Link href="/admin/applications">
          <Card className="cursor-pointer transition-colors hover:border-accent/60">
            <p className="text-sm text-text-secondary">대기 중인 신청</p>
            <p className={`mt-2 text-3xl font-bold ${pendingApps.length > 0 ? 'text-yellow-400' : 'text-accent'}`}>
              {pendingApps.length}
            </p>
            {pendingApps.length > 0 ? (
              <p className="mt-1 text-xs text-yellow-400">검토 필요</p>
            ) : null}
          </Card>
        </Link>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">최근 등록 뉴스</h2>
        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
          {recentNews.map((item) => (
            <li key={item.id}>{item.titleKo}</li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/members/new" className="rounded-lg bg-accent px-4 py-2 text-sm text-white">
          회원사 추가
        </Link>
        <Link href="/admin/news/new" className="rounded-lg bg-accent px-4 py-2 text-sm text-white">
          뉴스 작성
        </Link>
        <Link href="/admin/gallery" className="rounded-lg bg-accent px-4 py-2 text-sm text-white">
          사진 업로드
        </Link>
      </div>
    </div>
  );
}
