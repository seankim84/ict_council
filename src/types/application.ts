export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
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
  status: ApplicationStatus;
  adminNote: string;
  createdAt: string;
}
