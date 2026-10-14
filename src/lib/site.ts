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
  mapsEmbed:
    'https://www.google.com/maps?q=Ruta%20Nacional%207%20km%20541,%20General%20Levalle,%20C%C3%B3rdoba,%20Argentina&output=embed',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Ruta%20Nacional%207%20km%20541%2C%20General%20Levalle%2C%20C%C3%B3rdoba%2C%20Argentina',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

/** Imágenes de la home (las mismas del HTML de referencia). Reemplazar por archivos propios cuando estén disponibles. */
export const images = {
  hero: 'https://media.puntal.com.ar/p/34636f281f119bbd0a014694fe3e71f/adjuntos/270/imagenes/001/576/0001576894/1200x0/smart/vaca-muerta-gasjpg.jpg',
  about: 'https://cloudfront-us-east-1.images.arcpublishing.com/artear/4J4SOS67GRGFNJTJ6CI4H7PJAM.jpg',
  infra: 'https://expansionweb.com.ar/images/RED_GAS_DOMICILIARIA.jpg',
  safety: 'https://www.tgn.com.ar/assets/media/2025/03/Ferreyra_10.jpg',
} as const;
