import { ApplicationForm } from '@/components/apply/ApplicationForm';

export const metadata = {
  title: '회원사 신청 | KICT'
};

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-[52rem] px-6 py-12 md:py-20 md:px-12">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">Membership</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">회원사 신청</h1>
        <p className="text-text-secondary leading-relaxed">
          KOCHAM ICT Company Council 가입을 환영합니다.<br />
          아래 양식을 작성하시면 관리자 검토 후 순차적으로 안내드리겠습니다.
        </p>
      </div>
      <ApplicationForm />
    </main>
  );
}
