import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from '@/lib/supabase';

export interface Milestone {
  id: string;
  year: string;
  event: string;
  order: number;
}

function mapRow(row: Record<string, unknown>): Milestone {
  return {
    id: row.id as string,
    year: row.year as string,
    event: row.event as string,
    order: (row.order as number) ?? 0,
  };
}

export async function listMilestones(): Promise<Milestone[]> {
  noStore();
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .order('year', { ascending: false })
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function createMilestone(payload: Omit<Milestone, 'id'>): Promise<Milestone> {
  const { data, error } = await supabase
    .from('milestones')
    .insert({ year: payload.year, event: payload.event, order: payload.order ?? 0 })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateMilestone(id: string, payload: Partial<Omit<Milestone, 'id'>>): Promise<Milestone | null> {
  const updates: Record<string, unknown> = {};
  if (payload.year !== undefined) updates.year = payload.year;
  if (payload.event !== undefined) updates.event = payload.event;
  if (payload.order !== undefined) updates.order = payload.order;

  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data ? mapRow(data) : null;
}

export async function deleteMilestone(id: string): Promise<boolean> {
  const { error } = await supabase.from('milestones').delete().eq('id', id);
  return !error;
}
