'use client';

// 어드민 API 호출 시 cognito-token 쿠키를 x-admin-token 헤더로 함께 전송하는 헬퍼
function getAdminToken(): string {
  if (typeof document === 'undefined') return '';
  return (
    document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('cognito-token='))
      ?.split('=')[1]
      ?.trim() ?? ''
  );
}

export function adminFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('x-admin-token', getAdminToken());
  return fetch(url, { ...init, headers });
}
