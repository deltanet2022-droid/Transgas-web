import { ChatLoader } from '@/components/chat/ChatLoader';
import { SiteSchema } from '@/components/seo/SiteSchema';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { SiteBanners } from '@/components/site/SiteBanners';
import { NavProgress } from '@/components/site/NavProgress';
import { PageViewTracker } from '@/components/site/PageViewTracker';
import { ScrollReveal } from '@/components/site/ScrollReveal';
import { TopBar } from '@/components/site/TopBar';

/** Estructura común del sitio público: barra superior, banners, header, contenido, footer y chat. */
export function SiteShell({ children, banners = true }: { children: React.ReactNode; banners?: boolean }) {
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <TopBar />
      {banners && <SiteBanners />}
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ChatLoader />
      <SiteSchema />
      <ScrollReveal />
      <NavProgress />
      {banners && <PageViewTracker />}
    </>
  );
}
