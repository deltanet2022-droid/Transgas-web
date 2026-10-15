import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('monoxido');

export default function Page() {
  return <ContentPage slug="monoxido" />;
}
