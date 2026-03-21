import type { NewsItem } from '@/types/news';
import { supabase } from '@/lib/supabase';

function mapRow(row: Record<string, unknown>): NewsItem {
  return {
    id: row.id as string,
    titleKo: row.title_ko as string,
    titleEn: row.title_en as string,
    category: row.category as NewsItem['category'],
    content: (row.content as string) ?? '',
    thumbnailUrl: (row.thumbnail_url as string) ?? '',
    imageUrls: (row.image_urls as string[]) ?? [],
    publishedAt: row.published_at as string,
    createdAt: row.created_at as string
  };
}

export async function listNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function createNews(payload: Omit<NewsItem, 'id' | 'createdAt'>): Promise<NewsItem> {
  const { data, error } = await supabase
    .from('news')
    .insert({
      title_ko: payload.titleKo,
      title_en: payload.titleEn,
      category: payload.category,
      content: payload.content,
      thumbnail_url: payload.thumbnailUrl,
      image_urls: payload.imageUrls ?? [],
      published_at: payload.publishedAt,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateNews(id: string, payload: Partial<NewsItem>): Promise<NewsItem | null> {
  const updates: Record<string, unknown> = {};
  if (payload.titleKo !== undefined) updates.title_ko = payload.titleKo;
  if (payload.titleEn !== undefined) updates.title_en = payload.titleEn;
  if (payload.category !== undefined) updates.category = payload.category;
  if (payload.content !== undefined) updates.content = payload.content;
  if (payload.thumbnailUrl !== undefined) updates.thumbnail_url = payload.thumbnailUrl;
  if (payload.imageUrls !== undefined) updates.image_urls = payload.imageUrls;
  if (payload.publishedAt !== undefined) updates.published_at = payload.publishedAt;

  const { data, error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function deleteNews(id: string): Promise<boolean> {
  const { error } = await supabase.from('news').delete().eq('id', id);
  return !error;
}
