export type NewsCategory = 'notice' | 'activity' | 'seminar' | 'member' | 'policy';

export interface NewsItem {
  id: string;
  titleKo: string;
  titleEn: string;
  category: NewsCategory;
  content: string;
  thumbnailUrl: string;
  imageUrls: string[];
  publishedAt: string;
  createdAt: string;
}
