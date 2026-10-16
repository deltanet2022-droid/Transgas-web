/** Datos institucionales fijos (extraídos del sitio de referencia). */
export const site = {
  name: 'Transgas',
  legalName: 'Asoc. Cooperativa Transportadora de Gas del Sur de Cba. Ltda.',
  address: 'Ruta Nacional Nº 7 km 541 · General Levalle, Córdoba',
  addressShort: 'Ruta Nac. Nº 7 km 541 · General Levalle',
  phone: '3385-480021',
  phoneTel: '3385480021',
  supplyPhone: '3385-480200',
  supplyPhoneTel: '3385480200',
  emergencyPhone: '0800-777-8427',
  emergencyPhoneTel: '08007778427',
  schedule: 'Lunes a viernes · 07:00 a 14:00 hs',
  coopOnlineUrl: 'https://www.cooponlineweb.com.ar/TRANSGAS/Login',
  // Ubicación real de Transgas (enlace compartido por el cliente: https://maps.app.goo.gl/wpscjqnL3i4mgfZ76)
  lat: -34.0365779,
  lng: -63.9264781,
  mapsEmbed: 'https://www.google.com/maps?q=-34.0365779,-63.9264781&z=17&hl=es&output=embed',
  mapsLink: 'https://maps.app.goo.gl/wpscjqnL3i4mgfZ76',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

/** Imágenes de la home (las mismas del HTML de referencia). Reemplazar por archivos propios cuando estén disponibles. */
export const images = {
  hero: '/images/hero-gnc.jpg',
  hero800: '/images/hero-gnc-800.jpg',
  about: '/images/about.jpg',
  about560: '/images/about-560.jpg',
  infra: '/images/infra.jpg',
  infra560: '/images/infra-560.jpg',
  safety: '/images/safety.jpg',
  safety560: '/images/safety-560.jpg',
} as const;
