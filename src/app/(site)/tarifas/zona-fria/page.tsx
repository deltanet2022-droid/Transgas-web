import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('zona-fria');

export default function Page() {
  return <ContentPage slug="zona-fria" />;
}
