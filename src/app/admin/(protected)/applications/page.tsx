'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import type { Application, ApplicationStatus } from '@/types/application';

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '거절'
};

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-red-500/10 text-red-400'
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('pending');
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setError('');
    const url = filter === 'all' ? '/api/applications' : `/api/applications?status=${filter}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('목록을 불러오지 못했습니다.');
      const data = (await res.json()) as Application[];
      setApplications(data);
    } catch {
      setError('신청 목록을 불러오지 못했습니다.');
    }
  }, [filter]);

  useEffect(() => {
    void fetchApplications();
  }, [fetchApplications]);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setLoadingId(id);
    setError('');
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? '처리에 실패했습니다.');
      }
      await fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">회원사 신청 관리</h1>
        <div className="flex gap-2 text-sm">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                filter === s
                  ? 'bg-accent text-white'
                  : 'border border-[var(--color-border)] text-text-secondary hover:text-accent'
              }`}
            >
              {s === 'all' ? '전체' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p> : null}

      {applications.length === 0 && !error ? (
        <p className="py-16 text-center text-text-muted">신청 내역이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="space-y-4 rounded-xl border border-[var(--color-border)] bg-bg-secondary p-6">

              {/* 헤더 */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  {app.logoUrl ? (
                    <Image
                      src={app.logoUrl}
                      alt={app.nameKo}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg bg-bg-tertiary object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-tertiary text-xs text-text-muted">
                      로고 없음
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-text-primary">{app.nameKo}</p>
                    <p className="text-sm text-text-secondary">{app.nameEn}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[app.status]}`}>
                  {STATUS_LABEL[app.status]}
                </span>
              </div>

              {/* 상세 정보 */}
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-text-muted">신청자</dt>
                  <dd className="text-text-primary">{app.applicantName}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-text-muted">전화번호</dt>
                  <dd className="text-text-primary">{app.phone || '—'}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-text-muted">업종</dt>
                  <dd className="text-text-primary">{app.sector}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-text-muted">웹사이트</dt>
                  <dd className="text-text-primary">
                    {app.websiteUrl ? (
                      <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
                        {app.websiteUrl}
                      </a>
                    ) : '—'}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-text-muted">신청일</dt>
                  <dd className="text-text-primary">{new Date(app.createdAt).toLocaleDateString('ko-KR')}</dd>
                </div>
                {app.profilePhotoUrl ? (
                  <div className="flex items-center gap-2">
                    <dt className="w-16 shrink-0 text-text-muted">프로필</dt>
                    <dd>
                      <Image
                        src={app.profilePhotoUrl}
                        alt="프로필 사진"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </dd>
                  </div>
                ) : null}
              </dl>

              {app.description ? (
                <p className="border-t border-[var(--color-border)] pt-3 text-sm leading-relaxed text-text-secondary">
                  {app.description}
                </p>
              ) : null}

              {/* 승인 / 거절 버튼 (대기 상태만) */}
              {app.status === 'pending' ? (
                <div className="flex gap-3 border-t border-[var(--color-border)] pt-4">
                  <button
                    onClick={() => void handleAction(app.id, 'approve')}
                    disabled={loadingId === app.id}
                    className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {loadingId === app.id ? '처리 중...' : '✓ 승인'}
                  </button>
                  <button
                    onClick={() => void handleAction(app.id, 'reject')}
                    disabled={loadingId === app.id}
                    className="rounded-lg border border-red-500/40 px-5 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {loadingId === app.id ? '처리 중...' : '✕ 거절'}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
