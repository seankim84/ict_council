import { MemberForm } from '@/components/admin/MemberForm';

export default function NewMemberPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">회원사 신규 등록</h1>
      <MemberForm />
    </div>
  );
}
