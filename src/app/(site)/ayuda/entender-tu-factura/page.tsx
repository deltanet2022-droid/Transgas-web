import { ContentPage, contentMetadata } from '@/components/site/ContentPage';

export const generateMetadata = () => contentMetadata('entender-factura');

export default function Page() {
  return <ContentPage slug="entender-factura" />;
}
