import { unstable_noStore as noStore } from 'next/cache';
import type { Executive } from '@/types/executive';
import { supabase } from '@/lib/supabase';

function mapRow(row: Record<string, unknown>): Executive {
  return {
    id: row.id as string,
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    roleKo: row.role_ko as string,
    roleEn: row.role_en as string,
    company: (row.company as string) ?? '',
    photoUrl: (row.photo_url as string) ?? '',
    order: (row.order as number) ?? 0
  };
}

export async function listExecutives(): Promise<Executive[]> {
  noStore();
  const { data, error } = await supabase
    .from('executives')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function createExecutive(payload: Omit<Executive, 'id'>): Promise<Executive> {
  const { data, error } = await supabase
    .from('executives')
    .insert({
      name_ko: payload.nameKo,
      name_en: payload.nameEn,
      role_ko: payload.roleKo,
      role_en: payload.roleEn,
      company: payload.company,
      photo_url: payload.photoUrl,
      order: payload.order
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateExecutive(id: string, payload: Partial<Executive>): Promise<Executive | null> {
  const updates: Record<string, unknown> = {};
  if (payload.nameKo !== undefined) updates.name_ko = payload.nameKo;
  if (payload.nameEn !== undefined) updates.name_en = payload.nameEn;
  if (payload.roleKo !== undefined) updates.role_ko = payload.roleKo;
  if (payload.roleEn !== undefined) updates.role_en = payload.roleEn;
  if (payload.company !== undefined) updates.company = payload.company;
  if (payload.photoUrl !== undefined) updates.photo_url = payload.photoUrl;
  if (payload.order !== undefined) updates.order = payload.order;

  const { data, error } = await supabase
    .from('executives')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function deleteExecutive(id: string): Promise<boolean> {
  const { error } = await supabase.from('executives').delete().eq('id', id);
  return !error;
}
