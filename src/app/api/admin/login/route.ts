import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { id, password } = (await request.json()) as { id?: string; password?: string };

  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminId || !adminPassword || !adminSecret) {
    return NextResponse.json({ message: '서버 설정 오류입니다.' }, { status: 500 });
  }

  if (id !== adminId || password !== adminPassword) {
    return NextResponse.json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  // HttpOnly 쿠키 발급 — 브라우저 JS에서 접근 불가 (보안)
  response.cookies.set('cognito-token', adminSecret, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7일
  });

  return response;
}
