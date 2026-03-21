import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { listGallery } from '@/api/gallery/route';

const aboutCards = [
  {
    title: '네트워킹 · Networking',
    description: '정기 월례회와 비즈니스 매칭을 통해\n회원사 간 실질적인 협력 기회를 만듭니다.'
  },
  {
    title: '정보 공유 · Intelligence',
    description: '베트남 ICT 규제 변화, 시장 동향, 정부 정책을\n신속하게 공유합니다.'
  },
  {
    title: '대외 창구 · Liaison',
    description: 'KOCHAM 및 베트남 현지 기관과의 공식 채널로서\n회원사의 목소리를 전달합니다.'
  }
];

export async function AboutSection() {
  const gallery = await listGallery();

  // 이벤트별 대표 사진 1장씩, 날짜 내림차순, 최대 4개
  const seen = new Set<string>();
  const galleryCards = [...gallery]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .filter((item) => {
      if (seen.has(item.eventName)) return false;
      seen.add(item.eventName);
      return true;
    })
    .slice(0, 4);

  return (
    <section className="section-shell pt-0">
      <p className="eyebrow">ABOUT COUNCIL</p>
      <h2 className="font-heading text-3xl font-bold lg:text-4xl">
        협의회 소개
        <br />
        <span className="text-text-secondary">About the Council</span>
      </h2>

      <div className="mt-8 grid gap-6 rounded-xl border border-[var(--color-border)] bg-bg-secondary/70 p-4 md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xl md:text-2xl font-semibold leading-relaxed text-text-primary">
            베트남에서 일하는 한국 ICT 기업들이
            <br />
            더 잘 연결되고, 더 빠르게 성장할 수 있도록.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            So that Korean ICT companies in Vietnam
            <br />
            can connect better and grow faster.
          </p>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-text-secondary">
            <p>
              KOCHAM ICT 협의회는 베트남 호치민을 기반으로 활동하는
              <br />
              한국계 ICT 기업들의 공식 네트워크입니다.
            </p>
            <p>
              회원사 간 협업 촉진, 현지 시장 정보 공유,
              <br />
              그리고 KOCHAM 및 베트남 유관 기관과의 공식 창구 역할을 통해
              <br />
              베트남 ICT 생태계 내 한국 기업의 경쟁력을 높여갑니다.
            </p>
            <p>
              KOCHAM ICT Council is the official network for
              <br />
              Korean ICT companies operating in Ho Chi Minh City, Vietnam -
              <br />
              facilitating collaboration, sharing market intelligence,
              <br />
              and serving as a formal liaison with KOCHAM and local institutions.
            </p>
          </div>
        </div>

        {galleryCards.length > 0 && (
          <div className="grid grid-cols-2 gap-4 self-start">
            {galleryCards.map((item, index) => (
              <article key={`${item.id}-${index}`} className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-bg-tertiary/70">
                <Image src={item.imageUrl} alt={`${item.eventName} ${index + 1}`} width={520} height={360} className="h-40 w-full object-cover" />
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {aboutCards.map((card) => (
          <Card key={card.title} className="bg-bg-secondary/60">
            <p className="text-lg font-semibold">{card.title}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">{card.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/about" className="inline-block text-base font-medium text-accent hover:text-accent-hover">
          임원진 및 연혁 보기 →
        </Link>
        <p className="mt-2 text-sm text-text-secondary">Meet Our Leadership →</p>
      </div>
    </section>
  );
}
