import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Transgas',
    short_name: 'Transgas',
    description: 'Portal de Transgas: gas natural, autogestión, tarifas, seguridad y emergencias en el sur de Córdoba.',
    lang: 'es-AR',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F8FB',
    theme_color: '#0B2A4E',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
