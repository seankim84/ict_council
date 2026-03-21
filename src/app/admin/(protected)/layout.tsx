import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('cognito-token')?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!token || !adminSecret || token !== adminSecret) {
    redirect('/admin/login');
  }

  return (
    <div className="lg:flex">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
