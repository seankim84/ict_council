import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { listMembers } from '@/api/members/route';
import { listNews } from '@/api/news/route';

const quickLinks = [
  {
    title: '네트워킹',
    description: '회원사 간 정기 밋업과 협업 프로젝트 연계를 지원합니다.',
    href: '/news'
  },
  {
    title: '시장 정보',
    description: '베트남 ICT 산업 동향과 정책/규제 업데이트를 공유합니다.',
    href: '/about'
  },
  {
    title: '공식 채널',
    description: '협의회 공지, 행사 소식, 주요 자료를\n공식 채널로 안내합니다.',
    href: '/news'
  }
];

export async function HeroSection() {
  const [news, members] = await Promise.all([listNews(), listMembers()]);

  const latestNews = [...news].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];
  const sortedMembers = [...members].sort((a, b) => a.nameKo.localeCompare(b.nameKo, 'ko'));
  const memberLoop = [...sortedMembers, ...sortedMembers];

  return (
    <section className="section-shell pt-16 md:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">KOCHAM ICT COUNCIL</p>
          <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            ICT Network,
            <br />
            베트남에서 연결되는
            <br />
            한국 ICT의 힘
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary lg:text-lg">
            KOCHAM ICT 협의회는 베트남 내
            <br />
            ICT 산업 협력, 정보 교류, 비즈니스 확장을 위한
            <br />
            실무 중심 커뮤니티입니다.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[400px] sm:max-w-[560px] rounded-[1.6rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%),#1f232d] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
          <div className="mx-auto h-3 w-64 rounded-full bg-gradient-to-b from-[#f0f3f8] to-[#aeb6c5]" />

          <div className="mt-2 rounded-[1.9rem] border-2 border-[rgba(235,240,250,0.85)] bg-[#06090f] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
            <div className="relative overflow-hidden rounded-[1.2rem] border border-slate-300/20 bg-[#0d1421]">
              <div className="flex items-center justify-between border-b border-slate-500/30 bg-[#e9edf4] px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="h-2 w-2 rounded-full bg-slate-400/80" />
                  <span className="h-2 w-2 rounded-full bg-slate-400/60" />
                </div>
                <span className="text-[11px] font-medium tracking-wide text-slate-500">KICT UPDATE</span>
                <div className="h-2 w-10 rounded-full bg-slate-300" />
              </div>

              <div className="relative">
                {latestNews ? (
                  <div>
                    <div className="relative h-52 w-full">
                      <Image src={latestNews.thumbnailUrl} alt={latestNews.titleKo} fill className="object-cover" />
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-accent">
                        Latest News · {latestNews.category}
                      </p>
                      <p className="text-lg font-semibold text-text-primary">{latestNews.titleKo}</p>
                      <Link href={`/news/${latestNews.id}`} className="inline-block text-sm text-accent hover:text-accent-hover">
                        뉴스 상세 보기
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-sm text-text-secondary">최신 뉴스가 아직 등록되지 않았습니다.</div>
                )}
                <div className="pointer-events-none absolute inset-y-0 right-[16%] w-20 -skew-x-[23deg] bg-white/10 blur-[1px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {quickLinks.map((item) => (
          <Card key={item.title} className="bg-bg-secondary/70">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{item.title}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">{item.description}</p>
          </Card>
        ))}
      </div>

      {sortedMembers.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border)] bg-bg-secondary/40 py-6">
          <div className="marquee-track flex min-w-max gap-6 px-5">
            {memberLoop.map((member, index) => (
              <div
                key={`${member.id}-${index}`}
                className="flex min-w-44 items-center gap-3 rounded-lg border border-[var(--color-border)] bg-bg-tertiary/60 px-4 py-3"
              >
                {member.logoUrl ? (
                  <Image
                    src={member.logoUrl}
                    alt={member.nameKo}
                    width={72}
                    height={72}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : null}
                <span className="text-sm text-text-primary">{member.nameKo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
