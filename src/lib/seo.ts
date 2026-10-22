import type { Metadata } from 'next';
import { site } from '@/lib/site';

/** Zona de influencia para SEO local (aparece en títulos, descripciones y datos estructurados). */
export const GEO = {
  region: 'AR-X', // Córdoba
  regionName: 'Córdoba',
  place: 'General Levalle',
  country: 'AR',
  areaLabel: 'sur de Córdoba',
} as const;

/** URL absoluta de una ruta del sitio (para datos estructurados, sitemap y llms.txt). */
export const absUrl = (path = '/') => `${site.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

/** Teléfono argentino en formato internacional (E.164) para datos estructurados. */
export function intlPhone(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (digits.startsWith('0800')) return `+54${digits.slice(1)}`;
  if (digits.startsWith('54')) return `+${digits}`;
  return `+54${digits.replace(/^0/, '')}`;
}

/** Imagen para redes sociales cuando la página no tiene una propia (1200×630). */
export const DEFAULT_OG_IMAGE = { url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Transgas — gas natural en el sur de Córdoba' };

interface PageMetaInput {
  /** Título corto (el sitio le agrega « | Transgas »). */
  title: string;
  description: string;
  /** Ruta canónica, ej. "/tarifas". */
  path: string;
  /** Imagen para redes sociales (si falta se usa la general del sitio). */
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

/** Metadatos completos de una página: título, descripción, URL canónica, Open Graph y Twitter Cards. */
export function pageMeta({ title, description, path, image, type = 'website', noindex, publishedTime, modifiedTime }: PageMetaInput): Metadata {
  const fullTitle = `${title} | Transgas`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: 'Transgas',
      locale: 'es_AR',
      url: path,
      title: fullTitle,
      description,
      images: image ? [{ url: image, alt: title }] : [DEFAULT_OG_IMAGE],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image ?? DEFAULT_OG_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * Título y descripción de cada página del sitio (una sola fuente para ajustar el posicionamiento).
 * Títulos: hasta ~50 caracteres (el sitio agrega « | Transgas »). Descripciones: 120 a 160 caracteres.
 */
export const SEO: Record<string, { title: string; description: string }> = {
  '/tarifas': {
    title: 'Tarifas y cuadro tarifario de gas natural',
    description: 'Cuadro tarifario vigente de Transgas y rangos de consumo de cada categoría residencial (R1 a R4) y de servicio general (SGP). Descargá el documento oficial.',
  },
  '/tarifas/categorias': {
    title: 'Categorías de usuarios de gas: R1 a R4 y SGP',
    description: 'Rangos de consumo anual de cada categoría tarifaria de Transgas (R1 a R4 y SGP1 a SGP3-b) y cómo se calcula con los últimos seis bimestres.',
  },
  '/tarifas/tarifa-social': {
    title: 'Tarifa social de gas natural',
    description: 'Quiénes pueden acceder a la tarifa social de gas natural en el sur de Córdoba, qué requisitos hay y cómo tramitarla con Transgas.',
  },
  '/tarifas/zona-fria': {
    title: 'Régimen de zona fría',
    description: 'Qué es el régimen de zona fría, cómo puede alcanzar a los usuarios de gas natural de Transgas y dónde consultar si te corresponde.',
  },
  '/ayuda/entender-tu-factura': {
    title: 'Cómo entender tu factura de gas',
    description: 'Guía paso a paso para leer tu factura de gas natural de Transgas: consumos, períodos, cargos, impuestos y fechas de vencimiento.',
  },
  '/ayuda/inquilinos': {
    title: 'Gas natural para inquilinos',
    description: 'Qué tienen que saber los inquilinos sobre el servicio de gas natural: titularidad, trámites, facturas y seguridad de la instalación.',
  },
  '/usuarios/derechos': {
    title: 'Derechos de los usuarios de gas natural',
    description: 'Derechos de los usuarios del servicio de gas natural de Transgas, cómo presentar un reclamo y a quién recurrir si no te responden.',
  },
  '/seguridad': {
    title: 'Seguridad y emergencias con gas natural',
    description: 'Qué hacer ante olor a gas, cómo prevenir el monóxido de carbono y cuidar tus instalaciones. Línea de emergencias de Transgas las 24 horas.',
  },
  '/seguridad/uso-eficiente': {
    title: 'Uso eficiente y seguro del gas natural',
    description: 'Consejos para consumir menos gas natural sin perder confort: calefacción, cocina, agua caliente y mantenimiento de artefactos.',
  },
  '/seguridad/monoxido-de-carbono': {
    title: 'Monóxido de carbono: cómo prevenirlo',
    description: 'El monóxido de carbono no se ve ni se huele. Cómo prevenir una intoxicación, qué señales mirar y qué hacer si sospechás una.',
  },
  '/seguridad/prevencion-de-danos': {
    title: 'Prevención de daños en redes de gas',
    description: 'Cómo proteger las redes e instalaciones de gas natural antes de excavar, perforar u obrar, y a quién avisar para evitar accidentes.',
  },
  '/profesionales/gasistas-matriculados': {
    title: 'Gasistas matriculados en el sur de Córdoba',
    description: 'Listado de gasistas matriculados por localidad, con matrícula, domicilio y teléfono, para instalaciones y revisiones seguras de gas natural.',
  },
  '/cooperativas': {
    title: 'Cooperativas asociadas y localidades',
    description: 'Red de cooperativas asociadas a Transgas en el sur de Córdoba: dirección, teléfono, correo y horario de atención de cada localidad.',
  },
  '/autogestion': {
    title: 'Autogestión online del servicio de gas',
    description: 'Gestioná tu servicio de gas online: factura electrónica, informar pagos y medidor, altas, bajas, cambios de titularidad y nuevos servicios.',
  },
  '/autogestion/factura-electronica': {
    title: 'Adherirse a la factura electrónica',
    description: 'Adherite a la factura electrónica de Transgas y recibí tu factura de gas por correo, sin papel y sin demoras.',
  },
  '/autogestion/informar-pago': {
    title: 'Informar un pago de gas',
    description: 'Informá un pago realizado a Transgas para que lo acreditemos en tu cuenta. Completá el formulario con los datos del comprobante.',
  },
  '/autogestion/informar-medidor': {
    title: 'Informar la lectura del medidor de gas',
    description: 'Informá la lectura de tu medidor de gas natural o una anomalía para que tu factura refleje tu consumo real.',
  },
  '/autogestion/abm-servicio': {
    title: 'Altas, bajas y cambios de titularidad',
    description: 'Gestioná bajas, modificaciones de datos y cambios de titularidad de tu servicio de gas natural con Transgas, sin hacer filas.',
  },
  '/autogestion/nuevo-servicio': {
    title: 'Solicitar un nuevo servicio de gas natural',
    description: 'Solicitá la conexión de un nuevo servicio de gas natural en el sur de Córdoba: pasos, requisitos y formulario de pedido.',
  },
  '/contacto': {
    title: 'Contacto, teléfonos y ubicación',
    description: 'Contactá a Transgas en General Levalle, Córdoba: formulario, teléfonos de atención y emergencias, horario, dirección y mapa.',
  },
  '/estado-del-servicio': {
    title: 'Estado del servicio de gas por zona',
    description: 'Cortes programados, trabajos en curso y avisos del servicio de gas natural por localidad y zona en el sur de Córdoba.',
  },
  '/blog': {
    title: 'Novedades y noticias',
    description: 'Noticias, obras, recomendaciones de seguridad y comunicados de Transgas para usuarios y cooperativas del sur de Córdoba.',
  },
  '/avisos': {
    title: 'Avisos de vencimiento por mail',
    description: 'Suscribite gratis y recibí por correo un recordatorio antes de cada vencimiento de tu factura de gas natural. Baja con un clic.',
  },
  '/preguntas-frecuentes': {
    title: 'Preguntas frecuentes sobre el servicio de gas',
    description: 'Respuestas claras sobre facturas, pagos, categorías, trámites, olor a gas, monóxido de carbono, gasistas y atención de Transgas.',
  },
  '/documentos': {
    title: 'Documentos y manuales en PDF',
    description: 'Cuadros tarifarios vigente y anteriores, reglamento del servicio, manual de emergencias e instructivos de CoopOnline y de pago, para descargar.',
  },
  '/privacidad': {
    title: 'Política de Privacidad',
    description: 'Qué datos personales recopila Transgas, para qué los usamos y cómo ejercer tus derechos de acceso, rectificación y supresión (Ley 25.326).',
  },
};

/** Metadatos de una página estática del sitio a partir de la tabla SEO. */
export function staticMeta(path: string): Metadata {
  const s = SEO[path];
  if (!s) throw new Error(`Falta la entrada SEO para ${path}`);
  return pageMeta({ title: s.title, description: s.description, path });
}
