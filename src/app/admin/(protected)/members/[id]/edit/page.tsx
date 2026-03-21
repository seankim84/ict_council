import { notFound } from 'next/navigation';
import { getMemberById } from '@/api/members/route';
import { MemberForm } from '@/components/admin/MemberForm';

export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const member = await getMemberById(params.id);
  if (!member) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">회원사 수정</h1>
      <MemberForm member={member} />
    </div>
  );
}
