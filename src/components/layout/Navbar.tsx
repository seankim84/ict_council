'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/members', label: 'Members' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[rgba(10,14,26,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 md:h-20 w-full max-w-7xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="inline-flex items-center" onClick={() => setOpen(false)}>
          <Image
            src="/kict-logo.png"
            alt="KICT - KOCHAM ICT Company Council"
            width={220}
            height={95}
            className="h-8 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm text-text-secondary">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/apply"
            className="rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            회원사 신청하기
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
        >
          <span
            className={`block h-0.5 w-6 bg-white/90 transition-transform duration-200 ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white/90 transition-opacity duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white/90 transition-transform duration-200 ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[rgba(10,14,26,0.97)] px-4 pb-6 pt-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-text-secondary transition-colors hover:bg-white/5 hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-[var(--color-border)] pt-4">
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="block rounded-full border border-accent px-4 py-3 text-center text-sm font-medium text-accent"
            >
              회원사 신청하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
