'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MembersHero, type MemberFilter } from '@/components/sections/MembersHero';
import { MembersJoinCTA } from '@/components/sections/MembersJoinCTA';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Member } from '@/types/member';

export default function MembersPage() {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [selectedSector, setSelectedSector] = useState<MemberFilter>('전체');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/members')
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
            <Card key={member.id}>
              <div className="mb-4 flex items-center gap-3">
                {member.logoUrl ? (
                  <Image
                    src={member.logoUrl}
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
              <p className="mt-4 text-sm text-text-secondary">{member.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <MembersJoinCTA />
    </>
  );
}
