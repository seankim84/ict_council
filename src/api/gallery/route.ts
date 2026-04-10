import type { GalleryItem } from '@/types/gallery';
import { supabase } from '@/lib/supabase';

function mapRow(row: Record<string, unknown>): GalleryItem {
  return {
    id: row.id as string,
    imageUrl: (row.image_url as string) ?? '',
    eventName: (row.event_name as string) ?? '',
    eventDate: (row.event_date as string) ?? '',
    order: (row.order as number) ?? 0,
    createdAt: row.created_at as string
  };
}

export async function listGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function createGallery(payload: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
  const { data, error } = await supabase
    .from('gallery')
    .insert({
      image_url: payload.imageUrl,
      event_name: payload.eventName,
      event_date: payload.eventDate,
      order: payload.order,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateGalleryEvent(
  oldEventName: string,
  newEventName: string,
  newEventDate: string
): Promise<boolean> {
  const { error } = await supabase
    .from('gallery')
    .update({ event_name: newEventName, event_date: newEventDate })
    .eq('event_name', oldEventName);
  return !error;
}

export async function deleteGallery(id: string): Promise<boolean> {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  return !error;
}
