import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('prevencion-danos');

export default function Page() {
  return <ContentPage slug="prevencion-danos" />;
}
