import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import {
  About,
  Autogestion,
  ContactSection,
  Coops,
  InfoPortal,
  Infrastructure,
  ProfessionalsDocs,
  SafetySection,
  TariffSection,
} from '@/components/home/HomeSections';
import { Hero, QuickBar } from '@/components/home/Hero';
import { getActiveTariffs, getCooperatives, getCurrentTariffDocument, hasActiveServiceAlert } from '@/lib/queries';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Transgas',
    locale: 'es_AR',
    url: '/',
    images: [DEFAULT_OG_IMAGE],
    title: 'Transgas | Gas natural en el sur de Córdoba',
    description:
      'Transgas distribuye gas natural en el sur de Córdoba desde General Levalle. Pagá tu factura, consultá tarifas y categorías, seguridad y emergencias las 24 horas.',
  },
};

export default async function HomePage() {
  const [serviceAlert, tariffs, doc, coops] = await Promise.all([
    hasActiveServiceAlert(),
    getActiveTariffs(),
    getCurrentTariffDocument(),
    getCooperatives(),
  ]);

  return (
    <>
      <Hero serviceAlert={serviceAlert} />
      <QuickBar />
      <About />
      <Infrastructure />
      <Autogestion />
      <InfoPortal />
      <TariffSection tariffs={tariffs} doc={doc} />
      <Coops coops={coops} />
      <ProfessionalsDocs />
      <SafetySection />
      <ContactSection />
    </>
  );
}
