import type { Member } from '@/types/member';
import { supabase } from '@/lib/supabase';

function mapRow(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    sector: row.sector as Member['sector'],
    description: (row.description as string) ?? '',
    logoUrl: (row.logo_url as string) ?? '',
    profilePhotoUrl: (row.profile_photo_url as string) ?? '',
    websiteUrl: (row.website_url as string) ?? '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

export async function listMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function getMemberById(id: string): Promise<Member | null> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function createMember(payload: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('members')
    .insert({
      name_ko: payload.nameKo,
      name_en: payload.nameEn,
      sector: payload.sector,
      description: payload.description,
      logo_url: payload.logoUrl,
      profile_photo_url: payload.profilePhotoUrl || null,
      website_url: payload.websiteUrl,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateMember(id: string, payload: Partial<Member>): Promise<Member | null> {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (payload.nameKo !== undefined) updates.name_ko = payload.nameKo;
  if (payload.nameEn !== undefined) updates.name_en = payload.nameEn;
  if (payload.sector !== undefined) updates.sector = payload.sector;
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.logoUrl !== undefined) updates.logo_url = payload.logoUrl;
  if (payload.profilePhotoUrl !== undefined) updates.profile_photo_url = payload.profilePhotoUrl || null;
  if (payload.websiteUrl !== undefined) updates.website_url = payload.websiteUrl;

  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function deleteMember(id: string): Promise<boolean> {
  const { error } = await supabase.from('members').delete().eq('id', id);
  return !error;
}
