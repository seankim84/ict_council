import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  const token = cookies().get('cognito-token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!token || !adminSecret || token !== adminSecret) {
    redirect('/admin/login');
  }

  redirect('/admin/dashboard');
}
