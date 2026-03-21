import type { ReactNode } from 'react';

export const MEMBER_FILTERS = [
  '전체',
  'Software',
  'IT Services',
  'E-Commerce',
  'AI&Data',
  'Fintech',
  'Cloud',
  'Infrastructure',
  'Cybersecurity',
  'EdTech',
  '기타'
] as const;

export type MemberFilter = (typeof MEMBER_FILTERS)[number];

interface MembersHeroProps {
  activeFilter: MemberFilter;
  onFilterChange: (filter: MemberFilter) => void;
  totalCount: number;
  actions?: ReactNode;
}

export function MembersHero({ activeFilter, onFilterChange, totalCount, actions }: MembersHeroProps) {
  return (
    <section className="section-shell pb-8 pt-14 lg:pt-18">
      <p className="eyebrow">MEMBERS DIRECTORY</p>
      <h1 className="font-heading text-4xl font-bold leading-tight lg:text-6xl">
        KOCHAM
        <br />
        <span className="text-text-secondary">ICT Council Members</span>
      </h1>

      <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-secondary lg:text-lg">
        KOCHAM ICT 협의회 회원사를 업종별로 확인하고,
        <br />
        베트남 ICT 생태계에서 함께 협력할 파트너를 찾아보세요.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <span className="rounded-full border border-[var(--color-border)] bg-bg-secondary px-4 py-2">
          Total Members: <strong className="text-text-primary">{totalCount}</strong>
        </span>
        {actions}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {MEMBER_FILTERS.map((filter) => {
          const active = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-all duration-300',
                active
                  ? 'border-accent bg-accent-subtle text-accent'
                  : 'border-[rgba(59,130,246,0.15)] bg-bg-secondary text-text-secondary hover:border-[rgba(59,130,246,0.4)] hover:text-text-primary'
              ].join(' ')}
              aria-pressed={active}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </section>
  );
}
