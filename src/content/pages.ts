import { PRIVACY_LEGEND } from '@/lib/privacy';

/**
 * Páginas informativas cuyo texto se puede editar desde el CRM → Páginas.
 * Este archivo guarda el contenido ORIGINAL (se usa mientras nadie lo edite y para «Restaurar original»).
 *
 * Marcadores disponibles en el texto: {{emergencia}} {{suministro}} {{telefono}} {{horario}}
 * {{direccion}} {{privacidad_email}} (se completan con los datos de CRM → Configuración).
 */

export type AsideKind = 'users' | 'safety';

export interface PageDef {
  slug: string;
  path: string;
  title: string;
  kicker: string;
  sub: string;
  description: string;
  crumbs: { label: string; href?: string }[];
  aside: AsideKind;
  /** Barra roja con el teléfono de emergencias, arriba de todo ('header') o al inicio del contenido ('body'). */
  sos?: { placement: 'header' | 'body'; title: string; text: string };
  html: string;
}

const COOP = 'https://www.cooponlineweb.com.ar/TRANSGAS/Login';

export const PAGE_DEFS: PageDef[] = [
  {
    slug: 'tarifa-social',
    path: '/tarifas/tarifa-social',
    title: 'Tarifa social',
    kicker: 'Beneficio',
    sub: 'Un beneficio para los hogares que más lo necesitan. Te contamos quiénes pueden acceder y cómo se tramita.',
    description: 'Quiénes pueden acceder a la tarifa social de gas natural, requisitos y cómo tramitarla.',
    crumbs: [{ label: 'Tarifas', href: '/tarifas' }, { label: 'Tarifa social' }],
    aside: 'users',
    html: `<h2>¿Qué es?</h2>
<p>La tarifa social es un régimen de bonificación sobre el consumo de gas natural para usuarios residenciales que cumplen ciertas condiciones socioeconómicas. Se aplica directamente en tu factura una vez aprobada la solicitud.</p>
<h2>¿Quiénes pueden acceder?</h2>
<p>Por lo general, pueden solicitarla hogares que se encuentren en alguna de estas situaciones:</p>
<ul><li>Titulares de programas sociales o jubilaciones y pensiones por debajo de los topes establecidos.</li><li>Personas con certificado de discapacidad o con necesidades especiales de consumo.</li><li>Hogares inscriptos en los registros de beneficiarios correspondientes.</li></ul>
<blockquote><strong>Los requisitos pueden cambiar.</strong> Las condiciones se actualizan según la normativa vigente. Antes de iniciar el trámite, confirmalas con nuestro equipo.</blockquote>
<h2>¿Cómo se tramita?</h2>
<ol><li><strong>Reuní la documentación</strong><br>DNI del titular, última factura de gas y la constancia que acredite el beneficio que corresponda.</li><li><strong>Presentá la solicitud</strong><br>Acercate a la oficina de tu cooperativa o a Transgas, o consultá por <a href="/contacto">contacto</a>.</li><li><strong>Esperá la confirmación</strong><br>Verificamos los datos y, si se aprueba, el beneficio se aplica en tus próximas facturas.</li></ol>
<p>¿Tenés dudas? Escribinos desde <a href="/contacto">contacto</a> o consultá el <a href="/tarifas/categorias">detalle de categorías</a>.</p>`,
  },
  {
    slug: 'zona-fria',
    path: '/tarifas/zona-fria',
    title: 'Régimen de zona fría',
    kicker: 'Normativa',
    sub: 'Información sobre el régimen que alcanza a distintas localidades del país por sus condiciones climáticas.',
    description: 'Información sobre el régimen de zona fría y cómo puede alcanzar a los usuarios de Transgas.',
    crumbs: [{ label: 'Tarifas', href: '/tarifas' }, { label: 'Zona fría' }],
    aside: 'users',
    html: `<h2>¿De qué se trata?</h2>
<p>El régimen de zona fría establece condiciones especiales para el consumo de gas natural en localidades con temperaturas bajas durante gran parte del año. Su objetivo es que el costo de la calefacción no pese de manera desigual entre regiones.</p>
<h2>¿Me alcanza?</h2>
<p>Depende de la localidad donde esté el servicio y de la normativa vigente en cada momento. En tu factura vas a ver reflejado el beneficio si corresponde a tu domicilio.</p>
<blockquote><strong>Consultá antes de dar nada por hecho.</strong> La normativa puede modificarse. Para saber si tu domicilio está alcanzado, escribinos desde <a href="/contacto">contacto</a> o llamá al {{telefono}}.</blockquote>
<h2>Recursos útiles</h2>
<ul><li><a href="/ayuda/entender-tu-factura">Cómo leer tu factura</a> y encontrar los conceptos asociados.</li><li><a href="/tarifas">Cuadro tarifario vigente</a>.</li><li><a href="/usuarios/derechos">Tus derechos como usuario</a>.</li></ul>`,
  },
  {
    slug: 'categorias',
    path: '/tarifas/categorias',
    title: 'Categorías de usuarios',
    kicker: 'Tarifas',
    sub: 'Tu categoría define qué cuadro tarifario se aplica a tu factura y depende de tu consumo anual.',
    description: 'Cómo se agrupan los usuarios residenciales y SGP según su consumo anual.',
    crumbs: [{ label: 'Tarifas', href: '/tarifas' }, { label: 'Categorías' }],
    aside: 'users',
    html: `<h2>¿Cómo se asigna una categoría?</h2>
<p>Los usuarios del servicio de gas natural se agrupan en categorías según el tipo de uso (residencial o servicio general) y su consumo durante el último año. Cada categoría tiene su propio cargo fijo y precio por consumo, que se detallan en el <a href="/tarifas">cuadro tarifario vigente</a>.</p>
<blockquote><strong>¿Cómo sé cuál es la mía?</strong> La categoría figura en tu factura. Si tenés dudas o creés que no te corresponde, escribinos desde <a href="/contacto">contacto</a>.</blockquote>
<h2>Categorías residenciales</h2>
<p>Para hogares. Se subdividen según el consumo anual (en metros cúbicos, m³):</p>
<ul><li><strong>R1:</strong> hasta 500 m³ (los consumos más bajos).</li><li><strong>R2-1:</strong> de 501 a 650 m³.</li><li><strong>R2-2:</strong> de 651 a 800 m³.</li><li><strong>R2-3:</strong> de 801 a 1.000 m³.</li><li><strong>R3-1:</strong> de 1.001 a 1.250 m³.</li><li><strong>R3-2:</strong> de 1.251 a 1.500 m³.</li><li><strong>R3-3:</strong> de 1.501 a 1.800 m³.</li><li><strong>R3-4:</strong> más de 1.800 m³ (los consumos más altos).</li></ul>
<h2>Servicio General P (SGP)</h2>
<p>Para comercios, oficinas y pequeñas industrias. También se define por el consumo anual:</p>
<ul><li><strong>SGP1:</strong> hasta 12.000 m³.</li><li><strong>SGP2:</strong> de 12.001 a 108.000 m³.</li><li><strong>SGP3-a:</strong> de 108.001 a 180.000 m³.</li><li><strong>SGP3-b:</strong> más de 180.000 m³.</li></ul>
<h2>¿Y por bimestre?</h2>
<p>Las facturas son bimestrales. La categoría se calcula con el consumo acumulado de los <strong>últimos seis bimestres</strong>, así que como referencia aproximada podés dividir los valores anuales por seis (por ejemplo, R1 equivale a hasta unos 83 m³ por bimestre). En <a href="/tarifas">Tarifas</a> ves esa equivalencia para cada categoría.</p>
<h2>¿Puede cambiar mi categoría?</h2>
<p>Sí. Como la categoría depende del consumo acumulado de los últimos seis bimestres, puede actualizarse si tu consumo cambia de manera sostenida. El cambio se refleja en tus próximas facturas.</p>`,
  },
  {
    slug: 'entender-factura',
    path: '/ayuda/entender-tu-factura',
    title: 'Entender tu factura',
    kicker: 'Guía de usuario',
    sub: 'Una guía simple para leer cada parte de tu factura de gas y saber qué estás pagando.',
    description: 'Guía para leer tu factura de gas natural: consumos, períodos, cargos y vencimientos.',
    crumbs: [{ label: 'Ayuda' }, { label: 'Entender tu factura' }],
    aside: 'users',
    html: `<h2>Las partes de tu factura</h2>
<ol><li><strong>Datos del usuario</strong><br>Nombre del titular, domicilio del servicio, número de cliente y categoría tarifaria.</li><li><strong>Período y lecturas</strong><br>Fechas que abarca la factura y las lecturas del medidor (anterior y actual). La diferencia es tu consumo en m³.</li><li><strong>Cargo fijo y cargo por consumo</strong><br>El cargo fijo se paga aunque no consumas; el cargo por consumo depende de los m³ usados y de tu categoría.</li><li><strong>Impuestos y tasas</strong><br>Conceptos que se suman al servicio según la normativa nacional, provincial y municipal.</li><li><strong>Fecha de vencimiento y total a pagar</strong><br>El importe final y la fecha límite para abonarlo.</li></ol>
<h2>¿Dónde veo y pago mi factura?</h2>
<p>Desde <a href="${COOP}">CoopOnline</a> podés consultar el detalle, descargar el comprobante y pagar. También podés recibirla por correo con la <a href="/autogestion/factura-electronica">factura electrónica</a>.</p>
<blockquote><strong>Si el consumo te parece raro.</strong> Una lectura estimada o un cambio de estación pueden explicar un importe más alto. Podés <a href="/autogestion/informar-medidor">informar la lectura real de tu medidor</a> para que se tenga en cuenta.</blockquote>
<h2>¿Pagaste y no figura?</h2>
<p>Informá el pago desde <a href="/autogestion/informar-pago">Informar pago</a> con la fecha, el monto y el comprobante, y lo acreditamos.</p>
<h2>¿Algo no cierra?</h2>
<p>Revisá el <a href="/tarifas">cuadro tarifario</a> y tu <a href="/tarifas/categorias">categoría</a>. Si la duda continúa, escribinos desde <a href="/contacto">contacto</a>.</p>`,
  },
  {
    slug: 'inquilinos',
    path: '/ayuda/inquilinos',
    title: 'Información para inquilinos',
    kicker: 'Ayuda',
    sub: 'Si alquilás, estos son los puntos clave sobre el servicio de gas, la titularidad y tus responsabilidades.',
    description: 'Qué tienen que saber los inquilinos sobre el servicio de gas natural: titularidad, trámites y seguridad.',
    crumbs: [{ label: 'Ayuda' }, { label: 'Inquilinos' }],
    aside: 'users',
    html: `<h2>¿A nombre de quién está el servicio?</h2>
<p>El servicio de gas es del domicilio y queda registrado a nombre de un titular. Cuando cambia el inquilino, conviene actualizar la titularidad para que las facturas y los avisos lleguen a quien realmente usa el servicio.</p>
<h2>Cambio de titularidad paso a paso</h2>
<ol><li><strong>Pedí el cambio</strong><br>Completá el formulario de <a href="/autogestion/abm-servicio">altas, bajas y modificaciones</a> eligiendo «Cambio de titularidad».</li><li><strong>Presentá la documentación</strong><br>DNI del nuevo titular y documentación que acredite la ocupación del inmueble (por ejemplo, el contrato de alquiler).</li><li><strong>Verificá las deudas</strong><br>Antes de mudarte, confirmá que no queden facturas pendientes del período anterior.</li></ol>
<h2>Seguridad en una vivienda alquilada</h2>
<p>Pedile al propietario que las instalaciones de gas estén revisadas por un <a href="/profesionales/gasistas-matriculados">gasista matriculado</a> y que haya ventilación adecuada para los artefactos. Leé la guía de <a href="/seguridad/monoxido-de-carbono">prevención de monóxido de carbono</a>.</p>
<blockquote><strong>¿Dudas sobre quién paga qué?</strong> Eso se define en tu contrato de alquiler. Si necesitás aclarar un dato de la factura, escribinos desde <a href="/contacto">contacto</a>.</blockquote>`,
  },
  {
    slug: 'derechos',
    path: '/usuarios/derechos',
    title: 'Derechos de usuarios',
    kicker: 'Usuarios',
    sub: 'Como usuario del servicio de gas natural tenés derechos que conviene conocer.',
    description: 'Derechos de los usuarios del servicio de gas natural y cómo presentar un reclamo.',
    crumbs: [{ label: 'Usuarios' }, { label: 'Derechos' }],
    aside: 'users',
    html: `<h2>Tus derechos</h2>
<ul><li>Recibir un servicio seguro, continuo y de calidad, en las condiciones previstas por la normativa.</li><li>Recibir información clara, completa y veraz sobre el servicio, las tarifas y la facturación.</li><li>Ser atendido con trato digno y respetuoso en todos los canales de contacto.</li><li>Reclamar ante errores de facturación, interrupciones o cualquier incumplimiento, y obtener una respuesta.</li><li>Ser informado con anticipación de cortes programados por mantenimiento u obras.</li><li>Acceder, si cumplís los requisitos, a beneficios como la <a href="/tarifas/tarifa-social">tarifa social</a>.</li><li>Que tus datos personales sean tratados con cuidado, según nuestra <a href="/privacidad">Política de Privacidad</a>.</li></ul>
<h2>Cómo presentar un reclamo</h2>
<ol><li><strong>Contactanos</strong><br>Escribinos desde <a href="/contacto">el formulario de contacto</a> o llamá al {{telefono}} ({{horario}}).</li><li><strong>Detallá tu caso</strong><br>Indicá tu número de cliente, el motivo del reclamo y, si podés, adjuntá los datos de la factura o del hecho.</li><li><strong>Conservá tu número de consulta</strong><br>Te lo damos al enviar el formulario; sirve para hacer el seguimiento.</li></ol>
<h2>Reglamento del servicio</h2>
<p>El <a href="https://transgas.com.ar/wp-content/uploads/2023/08/reglamento-servicio-distribucion-2021_compressed.pdf">reglamento de servicio de distribución</a> establece las condiciones generales del servicio.</p>`,
  },
  {
    slug: 'uso-eficiente',
    path: '/seguridad/uso-eficiente',
    title: 'Uso eficiente del gas natural',
    kicker: 'Seguridad',
    sub: 'Pequeños hábitos que reducen el consumo, cuidan tu bolsillo y el ambiente.',
    description: 'Consejos para consumir gas natural de manera eficiente y segura.',
    crumbs: [{ label: 'Seguridad', href: '/seguridad' }, { label: 'Uso eficiente' }],
    aside: 'safety',
    html: `<h2>En la calefacción</h2>
<ul><li>Regulá la temperatura: unos grados menos hacen una diferencia grande en el consumo.</li><li>Calefaccioná solo los ambientes que usás y cerrá las puertas de los que no.</li><li>Evitá que se escape el calor: burletes en puertas y ventanas, cortinas gruesas de noche.</li><li>Aprovechá el sol durante el día: abrí cortinas y cerralas al atardecer.</li><li>Apagá o bajá la calefacción cuando salgas o te vayas a dormir.</li></ul>
<h2>En la cocina y el agua caliente</h2>
<ul><li>Usá ollas con tapa y del tamaño de la hornalla.</li><li>No abras el horno innecesariamente mientras cocina.</li><li>Regulá la temperatura del termotanque o calefón y arreglá las canillas que gotean.</li></ul>
<h2>Mantenimiento</h2>
<p>Artefactos limpios y bien regulados consumen menos y son más seguros. Pedí una revisión periódica a un <a href="/profesionales/gasistas-matriculados">gasista matriculado</a>.</p>
<blockquote><strong>Eficiencia sin descuidar la seguridad.</strong> Ahorrar nunca debe significar tapar rejillas de ventilación ni cerrar del todo los ambientes con artefactos encendidos. Leé la guía de <a href="/seguridad/monoxido-de-carbono">prevención de monóxido de carbono</a>.</blockquote>
<h2>Controlá tu consumo</h2>
<p>Revisá tu factura para ver cuánto consumís en cada período: <a href="/ayuda/entender-tu-factura">guía para entenderla</a>.</p>`,
  },
  {
    slug: 'monoxido',
    path: '/seguridad/monoxido-de-carbono',
    title: 'El monóxido de carbono mata. Se previene.',
    kicker: 'Seguridad',
    sub: 'No tiene olor, color ni sabor. Conocé cómo prevenir una intoxicación y cómo actuar.',
    description: 'El monóxido de carbono no se ve ni se huele. Cómo prevenir una intoxicación y qué hacer si sospechás una.',
    crumbs: [{ label: 'Seguridad', href: '/seguridad' }, { label: 'Monóxido de carbono' }],
    aside: 'safety',
    sos: {
      placement: 'header',
      title: 'Ante una emergencia llamá YA al',
      text: 'Si hay síntomas de intoxicación, salí al aire libre y pedí ayuda médica de inmediato. Luego avisá a Transgas.',
    },
    html: `<h2>¿Qué es y por qué es peligroso?</h2>
<p>El monóxido de carbono (CO) es un gas tóxico que se produce cuando los artefactos a gas, a leña o a carbón no queman bien el combustible. No se ve ni se huele, por eso es tan peligroso: puede intoxicar a una persona sin que lo note.</p>
<h2>Síntomas de intoxicación</h2>
<ul><li>Dolor de cabeza, mareos y somnolencia.</li><li>Náuseas, vómitos y debilidad.</li><li>Confusión, dificultad para respirar o pérdida del conocimiento en casos graves.</li></ul>
<blockquote><strong>Si varias personas se sienten mal a la vez.</strong> Salí de inmediato al aire libre con quienes estén con vos, llamá a emergencias médicas (911) y avisá a Transgas. No vuelvas a entrar hasta que un profesional revise la instalación.</blockquote>
<h2>Cómo prevenirlo</h2>
<ul><li><strong>Ventilá siempre.</strong> Mantené rejillas de ventilación abiertas y no las tapes.</li><li><strong>Revisá tus artefactos</strong> con un <a href="/profesionales/gasistas-matriculados">gasista matriculado</a>, especialmente antes del invierno.</li><li><strong>Mirá la llama.</strong> Debe ser azul y estable. Una llama amarilla o anaranjada indica mala combustión.</li><li><strong>No uses hornallas ni el horno para calefaccionar</strong> ni braseros dentro de ambientes cerrados.</li><li><strong>Evitá los calefones y estufas sin salida al exterior</strong> en baños y dormitorios.</li><li><strong>Chimeneas y conductos limpios</strong> y sin obstrucciones.</li></ul>
<h2>Si sospechás que hay monóxido</h2>
<ol><li><strong>Salí al aire libre</strong><br>Abrí puertas y ventanas al salir, si es posible.</li><li><strong>Pedí ayuda médica</strong><br>Aunque los síntomas parezcan leves, hacete atender.</li><li><strong>Llamá a Transgas</strong><br>Desde afuera, al número de emergencias. No vuelvas a usar el artefacto hasta que lo revise un profesional.</li></ol>`,
  },
  {
    slug: 'prevencion-danos',
    path: '/seguridad/prevencion-de-danos',
    title: 'Plan de prevención de daños',
    kicker: 'Seguridad',
    sub: 'Las cañerías de gas están bajo tierra. Antes de excavar, consultá.',
    description: 'Cómo proteger las redes e instalaciones de gas natural antes de excavar, perforar u obrar.',
    crumbs: [{ label: 'Seguridad', href: '/seguridad' }, { label: 'Prevención de daños' }],
    aside: 'safety',
    sos: {
      placement: 'body',
      title: 'Si dañaste una cañería de gas, llamá YA al',
      text: 'Alejate del lugar, no uses fuego ni equipos eléctricos y avisá desde un lugar seguro.',
    },
    html: `<h2>¿Por qué es importante?</h2>
<p>Un golpe con una pala, una retroexcavadora o una perforadora puede dañar una cañería de gas aunque no se note a simple vista. Las consecuencias pueden ser fugas, interrupciones del servicio a toda una zona y accidentes graves.</p>
<h2>Antes de excavar u obrar</h2>
<ol><li><strong>Consultá la ubicación de las redes</strong><br>Comunicate con Transgas desde <a href="/contacto">contacto</a> indicando el domicilio y el tipo de obra.</li><li><strong>Respetá las señalizaciones</strong><br>Mojones, placas y cintas de advertencia indican la presencia de cañerías.</li><li><strong>Excavá con cuidado</strong><br>Cerca de la red, hacelo a mano y no uses maquinaria pesada.</li><li><strong>Protegé la instalación</strong><br>No dejes cañerías expuestas ni apoyes cargas sobre ellas.</li></ol>
<blockquote><strong>Una obra, un aviso.</strong> Empresas constructoras, municipios, contratistas y vecinos: avisar antes de excavar evita riesgos y costos.</blockquote>
<h2>Si hay un daño</h2>
<ul><li>No intentes taparlo ni repararlo vos.</li><li>Alejá a las personas, evitá chispas y llamas.</li><li>Llamá de inmediato a emergencias, aunque el daño parezca menor.</li></ul>`,
  },
  {
    slug: 'privacidad',
    path: '/privacidad',
    title: 'Política de Privacidad',
    kicker: 'Datos personales',
    sub: 'Cómo tratamos tus datos personales, en cumplimiento de la Ley N.º 25.326 de Protección de los Datos Personales.',
    description: 'Política de privacidad de Transgas: qué datos personales recopilamos, para qué los usamos y cómo ejercer tus derechos (Ley 25.326).',
    crumbs: [{ label: 'Política de Privacidad' }],
    aside: 'users',
    html: `<p>Esta política explica cómo la <strong>Asoc. Cooperativa Transportadora de Gas del Sur de Cba. Ltda.</strong> («Transgas») trata los datos personales que recibe a través de este sitio web, sus formularios, el asistente virtual y las suscripciones a avisos. La usamos como aviso previo y para obtener tu consentimiento libre, expreso e informado (art. 5, Ley 25.326).</p>
<p><em>Última actualización: octubre de 2026.</em></p>
<h2>1. Responsable del tratamiento</h2>
<p>Asoc. Cooperativa Transportadora de Gas del Sur de Cba. Ltda.<br>Domicilio: {{direccion}}<br>Teléfono: {{telefono}} ({{horario}})<br>Correo para consultas sobre datos personales: {{privacidad_email}}</p>
<h2>2. Qué datos recopilamos</h2>
<ul><li><strong>Formularios de autogestión y contacto:</strong> nombre y apellido, correo electrónico, teléfono, y según el trámite: DNI o CUIT, domicilio, localidad, número de cliente, número de medidor y lecturas, datos de pagos informados (fecha, monto, medio de pago y comprobante) y el mensaje que escribas.</li><li><strong>Asistente virtual (chat):</strong> el texto de la conversación. El chat <strong>nunca</strong> pide ni debe recibir contraseñas, datos de tarjetas ni CBU; si se escriben, se descartan y no se guardan.</li><li><strong>Avisos de vencimiento por mail:</strong> tu correo electrónico y, si querés, tu número de cliente.</li><li><strong>Estadísticas de visitas:</strong> páginas visitadas, tipo de dispositivo y sitio de origen, de forma anónima (ver punto 9). No guardamos tu dirección IP.</li></ul>
<h2>3. Para qué usamos tus datos</h2>
<ul><li>Gestionar tu solicitud, consulta o reclamo y comunicarnos con vos.</li><li>Enviarte avisos de vencimiento, solo si te suscribiste.</li><li>Mejorar la atención y el funcionamiento del asistente virtual y del sitio.</li><li>Cumplir obligaciones legales y atender requerimientos de autoridades competentes.</li></ul>
<p>No usamos tus datos para fines distintos de los indicados ni los vendemos a terceros.</p>
<h2>4. Consentimiento y carácter facultativo</h2>
<p>Al marcar la casilla de aceptación de cada formulario (o al suscribirte), prestás tu consentimiento para el tratamiento descripto en esta política. Dar tus datos es voluntario, pero sin los datos obligatorios del formulario no podemos gestionar la solicitud. Podés <strong>retirar tu consentimiento</strong> en cualquier momento escribiéndonos (punto 7); y darte de baja de los avisos con el enlace que figura en cada mail.</p>
<p>Guardamos constancia de tu aceptación: fecha, hora y versión de esta política.</p>
<h2>5. A quién podemos comunicar tus datos</h2>
<ul><li><strong>Cooperativas asociadas y personal de Transgas</strong>, cuando sea necesario para gestionar tu trámite.</li><li><strong>Proveedores de servicios</strong> que tratan datos por cuenta de Transgas y bajo su responsabilidad (alojamiento del sitio, base de datos y envío de correos).</li><li><strong>Autoridades</strong>, cuando una ley u orden judicial lo exija.</li></ul>
<h2>6. Transferencia internacional de datos</h2>
<p>Los servicios de alojamiento y base de datos que usamos pueden estar ubicados fuera de la Argentina. Al aceptar esta política prestás tu consentimiento informado para esa transferencia, que se realiza solo con la finalidad de prestar los servicios descriptos y con medidas de seguridad razonables.</p>
<h2>7. Tus derechos y cómo ejercerlos</h2>
<p>Como titular de los datos tenés derecho a <strong>acceder</strong> a ellos, <strong>rectificarlos</strong>, <strong>actualizarlos</strong> y solicitar su <strong>supresión</strong> (arts. 14 a 16, Ley 25.326). Para ejercerlos escribinos a {{privacidad_email}}, usá el <a href="/contacto">formulario de contacto</a> o presentate en nuestro domicilio, acreditando tu identidad.</p>
<ul><li>El pedido de <strong>acceso</strong> se responde dentro de los 10 días corridos de recibido.</li><li>La <strong>rectificación, actualización o supresión</strong> se realiza dentro de los 5 días hábiles de recibido el reclamo.</li></ul>
<blockquote>${PRIVACY_LEGEND}</blockquote>
<h2>8. Seguridad y conservación</h2>
<p>Adoptamos medidas técnicas y organizativas razonables para proteger tus datos: conexión cifrada (HTTPS), acceso restringido al panel de gestión con usuario y contraseña, y control de permisos por rol. Conservamos los datos durante el tiempo necesario para cumplir la finalidad para la que fueron recibidos y las obligaciones legales aplicables; luego se eliminan o se anonimizan.</p>
<h2>9. Cookies y tecnologías similares</h2>
<ul><li>El sitio público <strong>no usa cookies publicitarias ni de seguimiento</strong>.</li><li>Medimos las visitas con un sistema propio y anónimo: no usa cookies, no guarda tu IP y solo conserva un identificador irreversible que cambia cada día.</li><li>El asistente virtual guarda un identificador de la conversación en la memoria temporal de tu navegador (se borra al cerrarlo).</li><li>El panel de gestión interno usa cookies técnicas de sesión, solo para el personal autorizado.</li></ul>
<h2>10. Cambios en esta política</h2>
<p>Si modificamos esta política de forma sustancial, lo informaremos en esta página y, cuando corresponda, volveremos a pedir tu consentimiento.</p>`,
  },
];

export const PAGE_BY_SLUG = new Map(PAGE_DEFS.map((p) => [p.slug, p]));
export const getPageDef = (slug: string) => PAGE_BY_SLUG.get(slug);
