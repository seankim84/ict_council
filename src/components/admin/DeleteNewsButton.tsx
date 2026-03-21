'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
}

export function DeleteNewsButton({ id }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!confirm('이 뉴스를 삭제하시겠습니까?')) return;
    setIsPending(true);
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="ml-3 text-red-400 disabled:opacity-50"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  );
}
