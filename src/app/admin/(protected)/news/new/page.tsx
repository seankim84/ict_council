import { NewsForm } from '@/components/admin/NewsForm';

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">뉴스 신규 작성</h1>
      <NewsForm />
    </div>
  );
}
