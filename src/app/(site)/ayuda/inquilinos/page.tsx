import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('inquilinos');

export default function Page() {
  return <ContentPage slug="inquilinos" />;
}
