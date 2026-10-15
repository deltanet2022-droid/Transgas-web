import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('privacidad');

export default function Page() {
  return <ContentPage slug="privacidad" />;
}
