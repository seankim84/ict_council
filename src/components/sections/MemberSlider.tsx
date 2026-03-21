import Image from 'next/image';
import { listMembers } from '@/api/members/route';

export async function MemberSlider() {
  const members = await listMembers();
  const loop = [...members, ...members];

  if (loop.length === 0) return null;

  return (
    <section className="section-shell pt-0">
      <p className="eyebrow">Members</p>
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-bg-secondary/40 py-8">
        <div className="marquee-track flex min-w-max gap-8 px-6">
          {loop.map((member, index) => (
            <div key={`${member.id}-${index}`} className="flex min-w-44 items-center gap-3 rounded-lg border border-[var(--color-border)] bg-bg-tertiary/60 px-4 py-3">
              {member.logoUrl ? (
                <Image src={member.logoUrl} alt={member.nameKo} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              ) : null}
              <span className="text-sm text-text-primary">{member.nameKo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
