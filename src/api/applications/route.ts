import { supabase } from '@/lib/supabase';
import type { Application, ApplicationStatus } from '@/types/application';

function mapRow(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    nameKo: row.name_ko as string,
    nameEn: row.name_en as string,
    applicantName: row.applicant_name as string,
    applicantPosition: (row.applicant_position as string) ?? '',
    phone: (row.phone as string) ?? '',
    sector: row.sector as string,
    logoUrl: (row.logo_url as string) ?? '',
    profilePhotoUrl: (row.profile_photo_url as string) ?? '',
    description: (row.description as string) ?? '',
    websiteUrl: (row.website_url as string) ?? '',
    status: row.status as ApplicationStatus,
    adminNote: (row.admin_note as string) ?? '',
    createdAt: row.created_at as string
  };
}

export async function listApplications(status?: ApplicationStatus): Promise<Application[]> {
  let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

export async function createApplication(payload: {
  nameKo: string;
  nameEn: string;
  applicantName: string;
  applicantPosition: string;
  phone: string;
  sector: string;
  logoUrl: string;
  profilePhotoUrl: string;
  description: string;
  websiteUrl: string;
}): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      name_ko: payload.nameKo,
      name_en: payload.nameEn,
      applicant_name: payload.applicantName,
      applicant_position: payload.applicantPosition,
      phone: payload.phone,
      sector: payload.sector,
      logo_url: payload.logoUrl,
      profile_photo_url: payload.profilePhotoUrl,
      description: payload.description,
      website_url: payload.websiteUrl,
      status: 'pending'
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function updateApplicationStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminNote?: string
): Promise<void> {
  const { error } = await supabase
    .from('applications')
    .update({ status, admin_note: adminNote ?? '' })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
