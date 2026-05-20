import Nav from '@/components/Nav';
import PersistentLogo from '@/components/PersistentLogo';
import HeroSection from '@/components/HeroSection';
import WorkSection from '@/components/WorkSection';
import ProjectsSection from '@/components/ProjectsSection';
import NowSection from '@/components/NowSection';
import ContactFooter from '@/components/ContactFooter';

export default function Home() {
  return (
    <main>
      <Nav />
      <PersistentLogo />
      <HeroSection />
      <WorkSection />
      <ProjectsSection />
      <NowSection />
      <ContactFooter />
    </main>
  );
}
