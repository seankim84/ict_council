import { AboutSection } from '@/components/sections/AboutSection';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { HeroSection } from '@/components/sections/HeroSection';
import { NewsPreview } from '@/components/sections/NewsPreview';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <NewsPreview />
      <GalleryPreview />
    </>
  );
}
