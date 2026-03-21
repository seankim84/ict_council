'use client';

import { useEffect, useState } from 'react';
import type { Milestone } from '@/api/milestones/route';

interface EditState {
  id: string;
  year: string;
  event: string;
}

const emptyNew = { year: '', event: '' };

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [error, setError] = useState('');
  const [editState, setEditState] = useState<EditState | null>(null);
  const [newItem, setNewItem] = useState(emptyNew);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/milestones')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Milestone[]) => setMilestones(data))
      .catch(() => setError('연혁 목록을 불러오지 못했습니다.'));
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!newItem.year.trim() || !newItem.event.trim()) {
      alert('연도와 내용을 모두 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: newItem.year.trim(), event: newItem.event.trim(), order: 0 }),
      });
      if (!res.ok) throw new Error();
      setNewItem(emptyNew);
      setShowAdd(false);
      load();
    } catch {
      alert('추가에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!editState) return;
    if (!editState.year.trim() || !editState.event.trim()) {
      alert('연도와 내용을 모두 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/milestones/${editState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: editState.year.trim(), event: editState.event.trim() }),
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

  async function handleDelete(id: string, label: string) {
    if (!confirm(`"${label}" 연혁을 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert('삭제에 실패했습니다.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">연혁 관리</h1>
        <button
          onClick={() => { setShowAdd(true); setEditState(null); }}
          className="rounded-lg bg-accent px-4 py-2 text-sm text-white"
        >
          + 연혁 추가
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* 추가 폼 */}
      {showAdd && (
        <div className="rounded-xl border border-accent/30 bg-bg-secondary p-5 space-y-4">
          <p className="font-semibold">새 연혁 추가</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="연도 (예: 2025)"
              value={newItem.year}
              onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
              className="w-32 rounded-lg border border-[var(--color-border)] bg-bg-primary px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="내용"
              value={newItem.event}
              onChange={(e) => setNewItem({ ...newItem, event: e.target.value })}
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-bg-primary px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowAdd(false); setNewItem(emptyNew); }}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? '추가 중...' : '추가'}
            </button>
          </div>
        </div>
      )}

      {/* 연혁 목록 */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-bg-secondary text-text-secondary">
            <tr>
              <th className="px-4 py-3 w-28">연도</th>
              <th className="px-4 py-3">내용</th>
              <th className="px-4 py-3 w-32">관리</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => (
              <tr key={m.id} className="border-t border-[var(--color-border)]">
                {editState?.id === m.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editState.year}
                        onChange={(e) => setEditState({ ...editState, year: e.target.value })}
                        className="w-24 rounded border border-[var(--color-border)] bg-bg-primary px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editState.event}
                        onChange={(e) => setEditState({ ...editState, event: e.target.value })}
                        className="w-full rounded border border-[var(--color-border)] bg-bg-primary px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-3">
                        <button onClick={handleUpdate} disabled={saving} className="text-accent hover:underline disabled:opacity-50">저장</button>
                        <button onClick={() => setEditState(null)} className="text-text-secondary hover:underline">취소</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-mono text-accent">{m.year}</td>
                    <td className="px-4 py-3">{m.event}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditState({ id: m.id, year: m.year, event: m.event })}
                          className="text-accent hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, `${m.year} - ${m.event}`)}
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
            {milestones.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-text-secondary">
                  등록된 연혁이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
