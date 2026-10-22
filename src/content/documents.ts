/**
 * Documentos descargables (PDF) que se alojan en /public/docs.
 * Son los archivos que Transgas tenía en su sitio anterior: se conservan acá para que los enlaces no se rompan.
 * Para sumar uno nuevo: copiar el PDF a public/docs y agregarlo a esta lista.
 */
export interface DocFile {
  title: string;
  description: string;
  file: string;
  /** Tamaño aproximado, solo informativo. */
  size: string;
}

export interface DocGroup {
  title: string;
  intro: string;
  items: DocFile[];
}

export const DOCUMENTS: DocGroup[] = [
  {
    title: 'Tarifas',
    intro: 'El cuadro tarifario vigente y los anteriores, por si necesitás consultar una factura de un período pasado.',
    items: [
      { title: 'Cuadro tarifario — Enero 2026 (vigente)', description: 'Cargos fijos y precios por categoría de usuario.', file: '/docs/cuadro-tarifario-transgas-enero-2026.pdf', size: '154 KB' },
      { title: 'Cuadro tarifario — Agosto 2025', description: 'Vigente desde el 1 de agosto de 2025.', file: '/docs/cuadro-tarifario-transgas-agosto-2025.pdf', size: '360 KB' },
      { title: 'Cuadro tarifario — Resolución 364 (junio 2025)', description: 'Cuadro de junio de 2025.', file: '/docs/cuadro-tarifario-res-364-junio-2025.pdf', size: '145 KB' },
      { title: 'Cuadro tarifario — Resolución 260/25 (mayo 2025)', description: 'Cuadro de mayo de 2025.', file: '/docs/cuadro-tarifario-res-260-25-mayo-2025.pdf', size: '183 KB' },
    ],
  },
  {
    title: 'Seguridad y emergencias',
    intro: 'Qué hacer ante una emergencia o una falta de suministro.',
    items: [
      { title: 'Manual de emergencias y falta de suministro', description: 'Según la Resolución ENARGAS N° I-2796. Teléfonos y pasos a seguir.', file: '/docs/manual-de-emergencias-res-i-2796.pdf', size: '102 KB' },
    ],
  },
  {
    title: 'Guías para usuarios',
    intro: 'Instructivos para gestionar tu cuenta y pagar tus facturas.',
    items: [
      { title: 'Instructivo de adhesión y pago de facturas', description: 'Cómo adherirte a la factura electrónica y los medios para pagar.', file: '/docs/instructivo-adhesion-y-pago-de-facturas.pdf', size: '683 KB' },
      { title: 'Instructivo de CoopOnline', description: 'Paso a paso para usar el sistema de gestión de usuarios (consultar y pagar facturas).', file: '/docs/instructivo-cooponline.pdf', size: '958 KB' },
    ],
  },
  {
    title: 'Normativa',
    intro: 'Las reglas generales del servicio.',
    items: [
      { title: 'Reglamento del servicio de distribución', description: 'Anexo I de la Resolución ENARGAS N° I-4313/17 y sus modificaciones.', file: '/docs/reglamento-servicio-distribucion-2021.pdf', size: '375 KB' },
    ],
  },
];
