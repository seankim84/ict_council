import { NextRequest, NextResponse } from 'next/server';
import { createNews, listNews } from '@/api/news/route';

export async function GET() {
  try {
    const news = await listNews();
    return NextResponse.json(news);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[GET /api/news]', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const created = await createNews(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[POST /api/news]', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
