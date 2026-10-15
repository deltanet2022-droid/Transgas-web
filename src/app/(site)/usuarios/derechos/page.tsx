import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('derechos');

export default function Page() {
  return <ContentPage slug="derechos" />;
}
