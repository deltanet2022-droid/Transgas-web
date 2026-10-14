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
