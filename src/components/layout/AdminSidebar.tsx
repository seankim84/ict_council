'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/applications', label: '신청 관리' },
  { href: '/admin/members', label: '회원사 관리' },
  { href: '/admin/news', label: '뉴스 관리' },
  { href: '/admin/gallery', label: '갤러리 관리' },
  { href: '/admin/executives', label: '임원진 관리' },
  { href: '/admin/milestones', label: '연혁 관리' },
];

export function AdminSidebar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="border-b border-[var(--color-border)] bg-bg-secondary lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r lg:p-6">
      {/* Desktop title */}
      <p className="hidden lg:block mb-6 text-lg font-semibold">Admin Panel</p>

      {/* Mobile: horizontal scrollable nav */}
      <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 lg:hidden">
        {adminLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-shrink-0 rounded-lg px-3 py-2 text-sm text-text-secondary whitespace-nowrap transition-all hover:bg-accent-subtle hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex-shrink-0 rounded-lg px-3 py-2 text-sm text-red-400 whitespace-nowrap hover:bg-red-500/10"
        >
          로그아웃
        </button>
      </div>

      {/* Desktop: vertical nav */}
      <nav className="hidden lg:flex lg:flex-1 flex-col space-y-2 text-sm text-text-secondary">
        {adminLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 transition-all hover:bg-accent-subtle hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="hidden lg:block mt-6 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm text-text-secondary transition-all hover:border-red-500/40 hover:text-red-400"
      >
        로그아웃
      </button>
    </aside>
  );
}
