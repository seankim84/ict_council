import { notFound } from 'next/navigation';
import { getNewsById } from '@/api/news/route';
import { NewsForm } from '@/components/admin/NewsForm';

interface Props {
  params: { id: string };
}

export default async function EditNewsPage({ params }: Props) {
  const news = await getNewsById(params.id);
  if (!news) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">뉴스 수정</h1>
      <NewsForm initialData={news} />
    </div>
  );
}
