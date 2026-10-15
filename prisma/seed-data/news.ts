/**
 * Noticias iniciales del sitio. El HTML usa solo las etiquetas que permite el editor del CRM,
 * y los marcadores {{emergencia}}, {{telefono}}… se reemplazan por los datos vigentes al mostrarse.
 */
export const news = [
  {
    slug: 'bienvenidos-al-nuevo-sitio-de-transgas',
    title: 'Bienvenidos al nuevo sitio de Transgas',
    excerpt:
      'Renovamos nuestra web para que gestionar tu servicio, consultar tarifas y encontrar información de seguridad sea más simple, desde el celular o la computadora.',
    category: 'Institucional',
    coverImageUrl: '/news/bienvenida.jpg',
    daysAgo: 2,
    body:
      '<p>Estrenamos un sitio pensado para acompañarte en cada gestión: <strong>factura, trámites, tarifas, seguridad y emergencias</strong>, todo en un mismo lugar, con información clara y siempre actualizada.</p>' +
      '<p>Lo diseñamos escuchando las consultas más frecuentes de nuestros usuarios: cómo pagar, a dónde llamar ante una emergencia, qué categoría tarifaria me corresponde o dónde encuentro un gasista matriculado. Esta es una guía rápida de lo que vas a encontrar.</p>' +
      '<h2>Gestioná tu servicio sin hacer colas</h2>' +
      '<p>En la sección de <a href="/autogestion">Autogestión</a> podés informar un pago, cargar la lectura de tu medidor, pedir una nueva conexión o hacer cambios en tu servicio. Para consultar y descargar tus facturas, ingresá a tu cuenta de CoopOnline desde el botón <strong>Mi cuenta</strong>.</p>' +
      '<h2>Tarifas explicadas</h2>' +
      '<p>En <a href="/tarifas">Tarifas</a> publicamos el cuadro tarifario oficial vigente y el detalle de cada categoría con su rango de consumo anual, para que sepas en cuál estás y por qué. Si querés entender cada renglón de tu boleta, tenés una <a href="/ayuda/entender-tu-factura">guía para leer tu factura</a> paso a paso.</p>' +
      '<h2>Avisos de vencimiento en tu correo</h2>' +
      '<p>Podés suscribirte en <a href="/avisos">Avisos de vencimiento</a> para recibir un mail cuando se acerque la fecha de pago. Es gratuito, requiere confirmar tu correo y podés darte de baja cuando quieras con un clic.</p>' +
      '<h2>Estado del servicio y emergencias</h2>' +
      '<ul>' +
      '<li>En <a href="/estado-del-servicio">Estado del servicio</a> ves los cortes programados y los avisos por zona.</li>' +
      '<li>Ante olor a gas o una emergencia, llamá al <strong>{{emergencia}}</strong> (24 horas).</li>' +
      '<li>Si falta suministro, el número es <strong>{{suministro}}</strong>.</li>' +
      '</ul>' +
      '<h2>Directorios útiles</h2>' +
      '<p>Encontrás el listado de <a href="/profesionales/gasistas-matriculados">gasistas matriculados</a> por localidad y los datos de contacto y horarios de las <a href="/cooperativas">cooperativas</a> de la red, con su ubicación en el mapa.</p>' +
      '<h2>Lu, tu asistente virtual</h2>' +
      '<p>En el botón celeste de la esquina de la pantalla vive <strong>Lu</strong>, nuestra asistente virtual. Responde dudas frecuentes sobre facturas, tarifas, seguridad y trámites a cualquier hora, y si necesitás hablar con una persona te acerca los canales de atención. Por tu seguridad, nunca te pide datos sensibles como contraseñas o números de tarjeta.</p>' +
      '<h2>Tu privacidad, primero</h2>' +
      '<p>Cuidamos tus datos personales conforme a la Ley 25.326. En cada formulario te explicamos para qué los usamos, y en nuestra <a href="/privacidad">Política de Privacidad</a> detallamos cómo ejercer tus derechos de acceso, rectificación y supresión.</p>' +
      '<blockquote><strong>Tu opinión nos ayuda a mejorar.</strong> Si encontrás algo que se pueda hacer mejor, escribinos desde <a href="/contacto">contacto</a> o llamanos al {{telefono}} ({{horario}}).</blockquote>',
  },
  {
    slug: 'recomendaciones-para-el-uso-seguro-del-gas-en-invierno',
    title: 'Recomendaciones para el uso seguro del gas en invierno',
    excerpt:
      'Con el frío aumenta el uso de estufas, calefones y cocinas. Repasá estos consejos para cuidarte a vos y a tu familia, y qué hacer si sentís olor a gas.',
    category: 'Seguridad',
    coverImageUrl: '/news/invierno-seguro.jpg',
    daysAgo: 1,
    body:
      '<p>Cuando bajan las temperaturas, los artefactos a gas funcionan más horas y en ambientes más cerrados. El gas natural es un servicio seguro, pero necesita instalaciones en buen estado, ventilación y un poco de cuidado cotidiano. Estas son las recomendaciones que más ayudan a prevenir accidentes.</p>' +
      '<h2>1. Ventilá siempre</h2>' +
      '<p>Los artefactos necesitan aire para quemar bien el gas. Si no tienen suficiente, se produce <strong>monóxido de carbono</strong>, un gas sin olor, sin color y muy peligroso.</p>' +
      '<ul>' +
      '<li>Dejá una ventana o una rejilla de ventilación abierta, aunque haga frío.</li>' +
      '<li>No tapes ni selles las rejillas de ventilación, ni las de arriba ni las de abajo.</li>' +
      '<li>No cierres con trapos, cartón o cinta los conductos de salida de gases.</li>' +
      '</ul>' +
      '<h2>2. Mirá la llama</h2>' +
      '<p>Una combustión correcta produce una llama <strong>azul y estable</strong>. Si ves llama amarilla o anaranjada, manchas negras de hollín en el artefacto o en la pared, o notás que se apaga seguido, dejá de usarlo y pedí una revisión.</p>' +
      '<h2>3. No calefaccionés con la cocina ni con el horno</h2>' +
      '<p>Las hornallas y el horno no están diseñados para calentar ambientes: gastan mucho gas, agotan el oxígeno del lugar y pueden generar monóxido de carbono. Para calefaccionar usá estufas o calefactores aprobados, preferentemente de tiro balanceado.</p>' +
      '<h2>4. Calefones y termotanques en lugares adecuados</h2>' +
      '<ul>' +
      '<li>Los calefones deben estar en ambientes ventilados y con salida de gases al exterior.</li>' +
      '<li>Evitá instalarlos dentro del baño o en dormitorios.</li>' +
      '<li>Nunca uses un artefacto a gas dentro de un placard o un espacio cerrado.</li>' +
      '</ul>' +
      '<h2>5. Revisión anual con un profesional</h2>' +
      '<p>Antes de que empiece el frío, hacé revisar tus artefactos y tu instalación interna con un <a href="/profesionales/gasistas-matriculados">gasista matriculado</a>. Es la mejor inversión en seguridad. Desconfiá de arreglos caseros y de quienes no puedan acreditar su matrícula.</p>' +
      '<h2>Señales de alerta de monóxido de carbono</h2>' +
      '<p>Dolor de cabeza, mareos, náuseas, cansancio inusual o somnolencia, sobre todo si le pasa a varias personas de la casa a la vez o mejoran al salir al aire libre. Si lo sospechás:</p>' +
      '<ol>' +
      '<li>Abrí puertas y ventanas y salí al aire libre.</li>' +
      '<li>Apagá los artefactos si podés hacerlo sin demorar la salida.</li>' +
      '<li>Pedí ayuda médica de inmediato y avisá a emergencias.</li>' +
      '</ol>' +
      '<h2>Si sentís olor a gas</h2>' +
      '<ol>' +
      '<li>No enciendas fósforos, encendedores ni accionés interruptores o timbres.</li>' +
      '<li>Abrí puertas y ventanas para ventilar.</li>' +
      '<li>Cerrá la llave de paso del gas, si podés llegar a ella.</li>' +
      '<li>Salí del lugar y llamá desde afuera al <strong>{{emergencia}}</strong>, disponible las 24 horas.</li>' +
      '</ol>' +
      '<blockquote>Conocé más en nuestra guía de <a href="/seguridad/monoxido-de-carbono">prevención de monóxido de carbono</a> y en la sección de <a href="/seguridad">Seguridad</a>. Cuidarse es cosa de todos.</blockquote>',
  },
];
