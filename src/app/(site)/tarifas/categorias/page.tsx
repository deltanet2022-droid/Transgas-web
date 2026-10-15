import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('categorias');

export default function Page() {
  return <ContentPage slug="categorias" />;
}
