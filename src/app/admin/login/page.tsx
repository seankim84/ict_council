import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default function AdminLoginPage() {
  const token = cookies().get('cognito-token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  // 이미 로그인된 경우 대시보드로 즉시 이동
  if (token && adminSecret && token === adminSecret) {
    redirect('/admin/dashboard');
  }

  return <LoginForm />;
}
