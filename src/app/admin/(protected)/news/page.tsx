import Link from 'next/link';
import { listNews } from '@/api/news/route';
import { DeleteNewsButton } from '@/components/admin/DeleteNewsButton';

export default async function AdminNewsPage() {
  const news = await listNews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">뉴스 관리</h1>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm text-white"
        >
          신규 작성
        </Link>
      </div>
      {/* Mobile card list */}
      <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] md:hidden">
        {news.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-secondary">등록된 뉴스가 없습니다.</p>
        ) : (
          news.map((item) => (
            <div key={item.id} className="p-4">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  item.category === 'notice'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-green-500/10 text-green-400'
                }`}
              >
                {item.category === 'notice' ? '공지사항' : item.category === 'activity' ? '활동뉴스' : item.category === 'seminar' ? '세미나·행사' : item.category === 'member' ? '회원사 소식' : '정책·동향'}
              </span>
              <p className="mt-2 font-medium text-text-primary">{item.titleKo}</p>
              <p className="mt-1 text-xs text-text-muted">
                {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ko-KR') : '-'}
              </p>
              <div className="mt-3 flex gap-3 text-sm">
                <Link href={`/admin/news/${item.id}/edit`} className="text-accent hover:underline">수정</Link>
                <DeleteNewsButton id={item.id} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--color-border)] md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="px-4 py-3">제목</th>
              <th className="px-4 py-3">카테고리</th>
              <th className="px-4 py-3">날짜</th>
              <th className="px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-text-secondary">
                  등록된 뉴스가 없습니다.
                </td>
              </tr>
            )}
            {news.map((item) => (
              <tr key={item.id} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3 font-medium">{item.titleKo}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      item.category === 'notice'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-green-500/10 text-green-400'
                    }`}
                  >
                    {item.category === 'notice' ? '공지사항' : item.category === 'activity' ? '활동뉴스' : item.category === 'seminar' ? '세미나·행사' : item.category === 'member' ? '회원사 소식' : '정책·동향'}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString('ko-KR')
                    : '-'}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/news/${item.id}/edit`} className="text-accent">
                    수정
                  </Link>
                  <DeleteNewsButton id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
