import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('tarifa-social');

export default function Page() {
  return <ContentPage slug="tarifa-social" />;
}
