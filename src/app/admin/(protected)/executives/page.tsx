'use client';

import { useEffect, useState } from 'react';
import type { Executive } from '@/types/executive';

interface EditState {
  id: string;
  roleKo: string;
  order: string;
}

export default function AdminExecutivesPage() {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [error, setError] = useState('');
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/executives')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Executive[]) => setExecutives(data))
      .catch(() => setError('임원진 목록을 불러오지 못했습니다.'));
  }

  useEffect(() => { load(); }, []);

  function startEdit(ex: Executive) {
    setEditState({ id: ex.id, roleKo: ex.roleKo, order: String(ex.order) });
  }

  async function handleUpdate() {
    if (!editState) return;
    if (!editState.roleKo.trim()) { alert('직책(한국어)을 입력해주세요.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/executives', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editState.id,
          roleKo: editState.roleKo.trim(),
          order: parseInt(editState.order) || 0,
        }),
      });
      if (!res.ok) throw new Error();
      setEditState(null);
      load();
    } catch {
      alert('수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 임원을 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/executives?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setExecutives((prev) => prev.filter((e) => e.id !== id));
    } else {
      alert('삭제에 실패했습니다.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">임원진 관리</h1>
        <p className="text-sm text-text-secondary">
          회원사 관리 페이지에서 &quot;임원진 지정&quot;으로 추가할 수 있습니다.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Mobile cards */}
      <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] md:hidden">
        {executives.length === 0 ? (
          <p className="p-8 text-center text-sm text-text-secondary">
            등록된 임원진이 없습니다. 회원사 관리에서 임원진을 지정해주세요.
          </p>
        ) : (
          executives.map((ex) => (
            <div key={ex.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{ex.nameKo}</p>
                  <p className="text-sm text-accent">{ex.roleKo}</p>
                  <p className="text-xs text-text-muted">{ex.company}</p>
                  <p className="text-xs text-text-muted">순서: {ex.order}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-3 text-sm">
                <button onClick={() => startEdit(ex)} className="text-accent hover:underline">수정</button>
                <button onClick={() => handleDelete(ex.id, ex.nameKo)} className="text-red-400 hover:underline">삭제</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--color-border)] md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="px-4 py-3">순서</th>
              <th className="px-4 py-3">직책</th>
              <th className="px-4 py-3">이름</th>
              <th className="px-4 py-3">소속</th>
              <th className="px-4 py-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {executives.map((ex) => (
              <tr key={ex.id} className="border-t border-[var(--color-border)]">
                {editState?.id === ex.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={editState.order}
                        onChange={(e) => setEditState({ ...editState, order: e.target.value })}
                        className="w-16 rounded border border-[var(--color-border)] bg-bg-primary px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2" colSpan={2}>
                      <input
                        type="text"
                        placeholder="직책"
                        value={editState.roleKo}
                        onChange={(e) => setEditState({ ...editState, roleKo: e.target.value })}
                        className="w-40 rounded border border-[var(--color-border)] bg-bg-primary px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">{ex.company}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdate}
                          disabled={saving}
                          className="text-accent hover:underline disabled:opacity-50"
                        >
                          저장
                        </button>
                        <button onClick={() => setEditState(null)} className="text-text-secondary hover:underline">
                          취소
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{ex.order}</td>
                    <td className="px-4 py-3">{ex.roleKo}</td>
                    <td className="px-4 py-3">{ex.nameKo}</td>
                    <td className="px-4 py-3">{ex.company}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => startEdit(ex)} className="text-accent hover:underline">
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(ex.id, ex.nameKo)}
                          className="text-red-400 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {executives.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-secondary">
                  등록된 임원진이 없습니다. 회원사 관리에서 임원진을 지정해주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
