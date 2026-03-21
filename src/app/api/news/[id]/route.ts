import { NextRequest, NextResponse } from 'next/server';
import { deleteNews, getNewsById, updateNews } from '@/api/news/route';

interface RouteParams {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const news = await getNewsById(params.id);
    if (!news) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(news);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[GET /api/news/[id]]', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = await request.json();
    const updated = await updateNews(params.id, payload);
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[PUT /api/news/[id]]', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  try {
    const deleted = await deleteNews(params.id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[DELETE /api/news/[id]]', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
