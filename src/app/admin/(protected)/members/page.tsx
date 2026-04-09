'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Member } from '@/types/member';

interface ExecutiveModal {
  member: Member;
  nameKo: string;
  roleKo: string;
  order: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ExecutiveModal | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  function load() {
    fetch('/api/members', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Member[]) => setMembers(data))
      .catch(() => setError('회원사 목록을 불러오지 못했습니다.'));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 회원사를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert('삭제에 실패했습니다.');
    }
  }

  function openExecutiveModal(member: Member) {
    setModal({ member, nameKo: '', roleKo: '', order: '' });
    setModalError('');
  }

  async function handleSetExecutive() {
    if (!modal) return;
    if (!modal.nameKo.trim()) {
      setModalError('성함을 입력해주세요.');
      return;
    }
    if (!modal.roleKo.trim()) {
      setModalError('직책을 입력해주세요.');
      return;
    }

    setSaving(true);
    setModalError('');
    try {
      const res = await fetch('/api/executives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameKo: modal.nameKo.trim(),
          nameEn: modal.nameKo.trim(),
          roleKo: modal.roleKo.trim(),
          roleEn: '',
          company: modal.member.nameKo,
          photoUrl: modal.member.profilePhotoUrl || modal.member.logoUrl || '',
          order: parseInt(modal.order, 10) || 0
        })
      });
      if (!res.ok) throw new Error();
      alert(`"${modal.member.nameKo}" 회원사를 임원진으로 등록했습니다.`);
      setModal(null);
    } catch {
      setModalError('임원진 등록에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">회원사 관리</h1>
        <Link href="/admin/members/new" className="rounded-lg bg-accent px-4 py-2 text-sm text-white">
          신규 등록
        </Link>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] md:hidden">
        {members.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-secondary">등록된 회원사가 없습니다.</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="p-4">
              <p className="font-medium text-text-primary">{member.nameKo}</p>
              <p className="mt-0.5 text-sm text-text-secondary">{member.sector}</p>
              <p className="mt-0.5 text-xs text-text-muted">{new Date(member.createdAt).toLocaleDateString('ko-KR')}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link href={`/admin/members/${member.id}/edit`} className="text-accent hover:underline">
                  수정
                </Link>
                <button onClick={() => openExecutiveModal(member)} className="text-emerald-500 hover:underline">
                  임원진 지정
                </button>
                <button onClick={() => handleDelete(member.id, member.nameKo)} className="text-red-400 hover:underline">
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-[var(--color-border)] md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="px-4 py-3">회사명</th>
              <th className="px-4 py-3">업종</th>
              <th className="px-4 py-3">등록일</th>
              <th className="px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {member.profilePhotoUrl || member.logoUrl ? (
                      <Image
                        src={member.profilePhotoUrl || member.logoUrl}
                        alt={member.nameKo}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : null}
                    <span>{member.nameKo}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{member.sector}</td>
                <td className="px-4 py-3">{new Date(member.createdAt).toLocaleDateString('ko-KR')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/members/${member.id}/edit`} className="text-accent hover:underline">
                      수정
                    </Link>
                    <button onClick={() => openExecutiveModal(member)} className="text-emerald-500 hover:underline">
                      임원진 지정
                    </button>
                    <button onClick={() => handleDelete(member.id, member.nameKo)} className="text-red-400 hover:underline">
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">
                  등록된 회원사가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-bg-secondary p-6 shadow-xl">
            <h2 className="mb-1 text-xl font-bold">임원진 지정</h2>
            <p className="mb-5 text-sm text-text-secondary">{modal.member.nameKo}</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  성함 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 홍길동"
                  value={modal.nameKo}
                  onChange={(e) => setModal({ ...modal, nameKo: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-bg-primary px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  직책 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 회장"
                  value={modal.roleKo}
                  onChange={(e) => setModal({ ...modal, roleKo: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-bg-primary px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">표시 순서</label>
                <input
                  type="number"
                  placeholder="0"
                  value={modal.order}
                  onChange={(e) => setModal({ ...modal, order: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-bg-primary px-3 py-2 text-sm"
                />
              </div>
            </div>

            {modalError && <p className="mt-3 text-sm text-red-400">{modalError}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm">
                취소
              </button>
              <button
                onClick={handleSetExecutive}
                disabled={saving}
                className="rounded-lg bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {saving ? '등록 중...' : '임원진 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
