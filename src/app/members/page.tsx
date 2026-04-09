'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MembersHero, type MemberFilter } from '@/components/sections/MembersHero';
import { MembersJoinCTA } from '@/components/sections/MembersJoinCTA';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Member } from '@/types/member';

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-bg-secondary p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text-primary"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 헤더 */}
        <div className="mb-5 flex items-center gap-4">
          {member.profilePhotoUrl || member.logoUrl ? (
            <Image
              src={member.profilePhotoUrl || member.logoUrl}
              alt={member.nameKo}
              width={64}
              height={64}
              quality={100}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-primary text-2xl text-text-muted">
              {member.nameKo[0]}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{member.nameKo}</h2>
            {member.nameEn && <p className="text-sm text-text-secondary">{member.nameEn}</p>}
          </div>
        </div>

        <Badge>{member.sector}</Badge>

        {/* 소개 */}
        {member.description && (
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">{member.description}</p>
        )}

        {/* 웹사이트 */}
        {member.websiteUrl && (
          <a
            href={member.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            웹사이트 방문
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function MembersPage() {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedSector, setSelectedSector] = useState<MemberFilter>('전체');
  const [query, setQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    fetch('/api/members', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: Member[]) => setAllMembers(data))
      .catch(() => {});
  }, []);

  const filteredMembers = useMemo(() => {
    return allMembers.filter((member) => {
      const bySector = selectedSector === '전체' || member.sector === (selectedSector as typeof member.sector);
      const byQuery = member.nameKo.toLowerCase().includes(query.toLowerCase());
      return bySector && byQuery;
    });
  }, [allMembers, query, selectedSector]);

  return (
    <>
      <MembersHero
        activeFilter={selectedSector}
        onFilterChange={setSelectedSector}
        totalCount={filteredMembers.length}
        actions={
          <input
            className="w-full max-w-xs rounded-lg border border-[var(--color-border)] bg-bg-secondary px-4 py-2 text-text-primary placeholder:text-text-muted"
            placeholder="회원사명 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        }
      />

      <section className="section-shell pt-2">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="cursor-pointer transition-transform hover:-translate-y-1 hover:border-accent/40"
              onClick={() => setSelectedMember(member)}
            >
              <div className="mb-4 flex items-center gap-3">
                {member.profilePhotoUrl || member.logoUrl ? (
                  <Image
                    src={member.profilePhotoUrl || member.logoUrl}
                    alt={member.nameKo}
                    width={96}
                    height={96}
                    quality={100}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-semibold">{member.nameKo}</p>
                  <p className="text-sm text-text-secondary">{member.nameEn}</p>
                </div>
              </div>
              <Badge>{member.sector}</Badge>
              <p className="mt-4 text-sm text-text-secondary">
                {member.description && member.description.length > 100
                  ? member.description.slice(0, 100) + '...'
                  : member.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <MembersJoinCTA />

      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </>
  );
}
