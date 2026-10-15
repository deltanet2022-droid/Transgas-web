/**
 * Preguntas frecuentes públicas (página /preguntas-frecuentes). Cada respuesta es una oración
 * completa y autosuficiente: así los buscadores y los asistentes de IA pueden citarla tal cual.
 *
 * Marcadores: {{emergencia}} {{suministro}} {{telefono}} {{horario}} {{direccion}} {{localidades}}.
 * Las respuestas se escriben como texto plano; los enlaces se agregan en `links`.
 */
export interface PublicFaq {
  q: string;
  a: string;
  links?: { label: string; href: string }[];
}

export interface PublicFaqGroup {
  title: string;
  items: PublicFaq[];
}

export const PUBLIC_FAQ: PublicFaqGroup[] = [
  {
    title: 'Facturas, pagos y tarifas',
    items: [
      {
        q: '¿Cómo pago mi factura de gas de Transgas?',
        a: 'Podés consultar, descargar y pagar tu factura online ingresando a tu cuenta de CoopOnline, el sistema de gestión de usuarios de Transgas. Si tenés dudas sobre cómo pagar, llamá al {{telefono}} ({{horario}}).',
        links: [
          { label: 'Mi cuenta en CoopOnline', href: 'https://www.cooponlineweb.com.ar/TRANSGAS/Login' },
          { label: 'Entender tu factura', href: '/ayuda/entender-tu-factura' },
        ],
      },
      {
        q: '¿Cuándo vence mi factura de gas?',
        a: 'La fecha de vencimiento figura en tu factura. Además, el sitio muestra el vencimiento vigente en la franja superior y podés suscribirte gratis para recibir un aviso por correo electrónico antes de cada vencimiento.',
        links: [{ label: 'Avisos de vencimiento por mail', href: '/avisos' }],
      },
      {
        q: '¿En qué categoría tarifaria estoy?',
        a: 'Tu categoría figura en tu factura y se define según tu consumo de los últimos seis bimestres. En hogares, R1 llega hasta 500 m³ al año, R2 va de 501 a 1.000 m³ (R2-1, R2-2 y R2-3) y R3 supera los 1.000 m³ (R3-1 a R3-4). En comercios y pequeñas industrias, SGP1 llega hasta 12.000 m³ al año, SGP2 hasta 108.000 m³, SGP3-a hasta 180.000 m³ y SGP3-b lo supera.',
        links: [
          { label: 'Categorías de usuarios', href: '/tarifas/categorias' },
          { label: 'Tarifas y cuadro tarifario', href: '/tarifas' },
        ],
      },
      {
        q: '¿Dónde veo el cuadro tarifario vigente?',
        a: 'El cuadro tarifario oficial vigente de Transgas se publica en formato PDF en la página de Tarifas, junto con el detalle de las categorías residenciales y de servicio general.',
        links: [{ label: 'Ver tarifas', href: '/tarifas' }],
      },
      {
        q: '¿Qué es la tarifa social y cómo la tramito?',
        a: 'La tarifa social es un beneficio para usuarios que cumplen determinados requisitos. En la página de tarifa social explicamos quiénes pueden acceder y cómo tramitarla.',
        links: [{ label: 'Tarifa social', href: '/tarifas/tarifa-social' }],
      },
    ],
  },
  {
    title: 'Trámites y atención',
    items: [
      {
        q: '¿Cómo informo un pago que ya realicé?',
        a: 'Completá el formulario de «Informar un pago» de la sección Autogestión con los datos del comprobante, y Transgas lo acredita en tu cuenta.',
        links: [{ label: 'Informar un pago', href: '/autogestion/informar-pago' }],
      },
      {
        q: '¿Cómo informo la lectura de mi medidor de gas?',
        a: 'Podés informar la lectura de tu medidor, o una anomalía, desde el formulario «Informar estado de medidor» de la sección Autogestión.',
        links: [{ label: 'Informar estado de medidor', href: '/autogestion/informar-medidor' }],
      },
      {
        q: '¿Cómo me adhiero a la factura electrónica?',
        a: 'Completá el formulario de adhesión a la factura electrónica en la sección Autogestión y recibirás tu factura de gas por correo electrónico, sin papel.',
        links: [{ label: 'Factura electrónica', href: '/autogestion/factura-electronica' }],
      },
      {
        q: '¿Cómo solicito un nuevo servicio de gas natural?',
        a: 'Podés pedir la conexión de un nuevo servicio completando el formulario de «Nuevo servicio» de la sección Autogestión. El equipo de Transgas se comunica con vos para indicarte los pasos y requisitos.',
        links: [{ label: 'Solicitar un nuevo servicio', href: '/autogestion/nuevo-servicio' }],
      },
      {
        q: '¿Cómo hago una baja o un cambio de titularidad?',
        a: 'Las bajas, las modificaciones de datos y los cambios de titularidad se gestionan desde el formulario «Altas, bajas y modificaciones» de la sección Autogestión.',
        links: [{ label: 'Altas, bajas y modificaciones', href: '/autogestion/abm-servicio' }],
      },
      {
        q: '¿Dónde está Transgas y cuál es el horario de atención?',
        a: 'Transgas atiende en {{direccion}}. El horario de atención es {{horario}} y el teléfono de atención al cliente es {{telefono}}.',
        links: [{ label: 'Contacto y mapa', href: '/contacto' }],
      },
      {
        q: '¿En qué localidades presta servicio Transgas?',
        a: 'Transgas presta servicio en el sur de Córdoba junto a una red de cooperativas asociadas. Hoy la red incluye a {{localidades}}.',
        links: [{ label: 'Cooperativas asociadas', href: '/cooperativas' }],
      },
      {
        q: '¿Cómo presento un reclamo?',
        a: 'Podés escribir desde el formulario de contacto o llamar al {{telefono}} en el horario de atención. En la página de derechos de los usuarios explicamos cómo presentar un reclamo y a quién recurrir si no obtenés respuesta.',
        links: [
          { label: 'Contacto', href: '/contacto' },
          { label: 'Derechos de los usuarios', href: '/usuarios/derechos' },
        ],
      },
    ],
  },
  {
    title: 'Seguridad y emergencias',
    items: [
      {
        q: '¿Qué hago si siento olor a gas?',
        a: 'No enciendas fósforos ni encendedores y no accionés interruptores ni timbres. Abrí puertas y ventanas para ventilar, cerrá la llave de paso si podés llegar a ella, salí del lugar y llamá desde afuera a la línea de emergencias de Transgas al {{emergencia}}, disponible las 24 horas.',
        links: [{ label: 'Seguridad y emergencias', href: '/seguridad' }],
      },
      {
        q: '¿A qué número llamo si me falta gas?',
        a: 'Ante una falta de suministro llamá al {{suministro}}. Para una emergencia, como olor a gas, llamá al {{emergencia}}. También podés ver cortes programados y avisos por zona en el Estado del servicio.',
        links: [{ label: 'Estado del servicio', href: '/estado-del-servicio' }],
      },
      {
        q: '¿Cómo prevengo una intoxicación por monóxido de carbono?',
        a: 'El monóxido de carbono no tiene olor ni color. Para prevenirlo ventilá siempre los ambientes con artefactos encendidos, no tapes las rejillas de ventilación, no uses la cocina ni el horno para calefaccionar y hacé revisar tus artefactos todos los años con un gasista matriculado. Dolor de cabeza, mareos y náuseas pueden ser señales de alerta.',
        links: [{ label: 'Monóxido de carbono', href: '/seguridad/monoxido-de-carbono' }],
      },
      {
        q: '¿Cómo encuentro un gasista matriculado?',
        a: 'En la página de gasistas matriculados encontrás el listado por localidad, con número de matrícula, domicilio y teléfono. Pedí siempre que acrediten la matrícula antes de contratar una instalación o una revisión.',
        links: [{ label: 'Gasistas matriculados', href: '/profesionales/gasistas-matriculados' }],
      },
      {
        q: '¿Qué tengo que hacer antes de excavar o hacer una obra?',
        a: 'Antes de excavar, perforar o hacer una obra, consultá a Transgas por la ubicación de las redes de gas para no dañarlas. Un golpe a una cañería de gas puede provocar una fuga y un accidente grave.',
        links: [{ label: 'Prevención de daños', href: '/seguridad/prevencion-de-danos' }],
      },
    ],
  },
];
