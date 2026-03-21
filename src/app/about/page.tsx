export const revalidate = 0;

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { listExecutives } from '@/api/executives/route';
import { listMilestones } from '@/api/milestones/route';
import { OrgChart } from '@/components/sections/OrgChart';

export default async function AboutPage() {
  const [executives, milestones] = await Promise.all([listExecutives(), listMilestones()]);

  return (
    <div className="section-shell space-y-16">
      <section>
        <p className="eyebrow">Mission</p>
        <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">협의회 미션 & 설립 배경</h1>
        <p className="mt-6 max-w-4xl text-text-secondary">
          한국 ICT 기업의 베트남 시장 안착을 돕기 위해 설립되었으며, 실질적인 프로젝트 연계와 정보 교류를 중심으로 운영됩니다.
        </p>
      </section>

      <section>
        <p className="eyebrow">Organization</p>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">조직도</h2>
        <div className="mt-8">
          <OrgChart executives={executives} />
        </div>
      </section>

      <section>
        <p className="eyebrow">Executives</p>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">임원진</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {executives.map((executive) => (
            <Card key={executive.id} className="flex items-center gap-4">
              <Image
                src={executive.photoUrl || '/blank_profile.png'}
                alt={executive.nameKo}
                width={160}
                height={160}
                quality={100}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{executive.nameKo}</p>
                <p className="mt-1 text-sm text-accent">{executive.roleKo}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <p className="eyebrow">History</p>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl lg:text-4xl">연혁</h2>
        <div className="mt-8 space-y-4">
          {milestones.length === 0 && (
            <p className="text-text-secondary">등록된 연혁이 없습니다.</p>
          )}
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-xl border border-[var(--color-border)] bg-bg-secondary p-5">
              <p className="font-mono text-sm text-accent">{milestone.year}</p>
              <p className="mt-1 text-text-primary">{milestone.event}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
