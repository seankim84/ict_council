'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export default function LoginForm() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!id.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim(), password })
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? '로그인에 실패했습니다.');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('서버와 통신에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl font-bold text-text-primary">Admin Login</h1>
        <p className="mt-2 text-sm text-text-secondary">관리자 계정으로 로그인하세요.</p>
        <form
          className="mt-6 space-y-4 rounded-xl border border-[var(--color-border)] bg-bg-secondary p-6"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            아이디
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              className="rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              className="rounded-lg border border-[var(--color-border)] bg-bg-tertiary px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>
          {error ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          ) : null}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> 로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
