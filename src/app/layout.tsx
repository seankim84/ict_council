import type { Metadata } from 'next';
import { DM_Mono, DM_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700']
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['300', '400', '500']
});

export const metadata: Metadata = {
  title: 'KOCHAM ICT Council',
  description: 'KOCHAM ICT 협의회 공식 웹사이트',
  openGraph: {
    title: 'KOCHAM ICT Council',
    description: 'KOCHAM ICT 협의회 공식 웹사이트',
    images: ['/og-image.svg']
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${dmSans.variable} ${dmMono.variable}`}>
        <Navbar />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
