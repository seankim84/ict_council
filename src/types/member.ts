export type MemberSector =
  | 'Software'
  | 'IT Services'
  | 'E-Commerce'
  | 'AI&Data'
  | 'Fintech'
  | 'Cloud'
  | 'Infrastructure'
  | 'Cybersecurity'
  | 'EdTech'
  | 'Contents'
  | '기타';

export const MEMBER_SECTORS: MemberSector[] = [
  'Software',
  'IT Services',
  'E-Commerce',
  'AI&Data',
  'Fintech',
  'Cloud',
  'Infrastructure',
  'Cybersecurity',
  'EdTech',
  'Contents',
  '기타'
];

export interface Member {
  id: string;
  nameKo: string;
  nameEn: string;
  sector: MemberSector;
  description: string;
  logoUrl: string;
  profilePhotoUrl: string;
  websiteUrl: string;
  createdAt: string;
  updatedAt: string;
}
