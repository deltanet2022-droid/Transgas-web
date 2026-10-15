import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('uso-eficiente');

export default function Page() {
  return <ContentPage slug="uso-eficiente" />;
}
