// Base de conocimiento del chatbot (Fase 1). Se edita desde el CRM → Preguntas frecuentes.
//
// Cómo está pensada la charla:
//  • Cada mensaje del usuario recibe UNA sola respuesta (se elige una variante al azar entre
//    redacciones equivalentes, nunca dos respuestas distintas a la misma pregunta).
//  • `followUps` son los botones que aparecen después de la respuesta y guían la conversación al
//    siguiente tema lógico. Cada texto de botón tiene que disparar otra FAQ (hay un test que lo verifica).
//  • Los marcadores {{localidad:X}} y {{vencimiento}} se completan al responder con datos reales del CRM.

export interface SeedFaq {
  question: string;
  category: string;
  palabrasClave: string[];
  respuestas: string[];
  followUps?: string[];
}

const COOP = 'https://www.cooponlineweb.com.ar/TRANSGAS/Login';
const MAPS = 'https://maps.app.goo.gl/wpscjqnL3i4mgfZ76';

/** Menú principal: se ofrece al saludar, en «Menú principal» y después de agradecer. */
export const MENU = [
  'Mi factura',
  'Trámites',
  'Tarifas',
  'Me quedé sin gas',
  'Seguridad',
  'Cooperativas y gasistas',
  'Contacto y horarios',
  'Emergencia',
  'Hablar con una persona',
];

const LOCALITIES: { name: string; extra?: string[] }[] = [
  { name: 'Jovita' },
  { name: 'Ítalo' },
  { name: 'Pueblo Italiano' },
  { name: 'Serrano' },
  { name: 'La Cesira' },
  { name: 'Mattaldi' },
  { name: 'Viamonte' },
  { name: 'Villa Valeria' },
  { name: 'Huinca Renancó', extra: ['huinca', 'renanco'] },
  { name: 'Laboulaye' },
  { name: 'Río Cuarto', extra: ['rio cuarto'] },
];
const LOCALITY_CHIPS = LOCALITIES.slice(0, 8).map((l) => l.name);

const localityFaqs: SeedFaq[] = LOCALITIES.map(({ name, extra = [] }) => ({
  question: `Localidad: ${name}`,
  category: 'Cooperativas',
  palabrasClave: [name, `cooperativa de ${name}`, `gasista en ${name}`, `gasistas de ${name}`, `oficina en ${name}`, ...extra],
  respuestas: [`📍 Esto es lo que tengo cargado para ${name}:\n\n{{localidad:${name}}}\n\n¿Necesitás algo más de tu zona?`],
  followUps: ['Cooperativas y gasistas', 'Contacto y horarios'],
}));

export const faqs: SeedFaq[] = [
  // ───────────────────────── Conversación ─────────────────────────
  {
    question: 'Saludo',
    category: 'Conversación',
    palabrasClave: ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'que tal', 'hey'],
    respuestas: [
      '¡Hola! 👋 Soy Lu, la asistente virtual de Transgas. Estoy para ayudarte con tu factura, trámites, tarifas, cortes de servicio, seguridad y emergencias, las 24 horas. ¿Sobre qué querés hablar?',
      '¡Hola, qué gusto! 😊 Soy Lu, la asistente virtual de Transgas. Te puedo orientar con facturas, trámites, tarifas, seguridad y más. ¿Por dónde empezamos?',
    ],
    followUps: MENU,
  },
  {
    question: 'Menú principal',
    category: 'Conversación',
    palabrasClave: ['menu', 'menu principal', 'opciones', 'ayuda', 'que podes hacer', 'en que me ayudas', 'que sabes hacer', 'necesito ayuda', 'volver al inicio'],
    respuestas: [
      'Puedo orientarte sobre:\n🧾 facturas y pagos\n📝 trámites online\n💲 tarifas y beneficios\n🔥 cortes y falta de gas\n🛡️ seguridad y emergencias\n🏢 cooperativas y gasistas de tu localidad\n\nElegí un tema o escribime tu consulta con tus palabras.',
    ],
    followUps: MENU,
  },
  {
    question: '¿Quién sos?',
    category: 'Conversación',
    palabrasClave: ['quien sos', 'como te llamas', 'tu nombre', 'con quien hablo', 'quien eres'],
    respuestas: [
      'Me llamo Lu y soy la asistente virtual de Transgas 🤖 Respondo consultas frecuentes las 24 horas. Si necesitás que te atienda una persona, también te puedo derivar.',
      '¡Soy Lu, la asistente virtual de Transgas! Estoy acá para orientarte con tu servicio de gas, a cualquier hora. Y si preferís hablar con alguien del equipo, te derivo.',
    ],
    followUps: ['¿Sos una persona?', 'Hablar con una persona'],
  },
  {
    question: '¿Sos una persona o un robot?',
    category: 'Conversación',
    palabrasClave: ['sos un robot', 'sos una persona', 'sos humana', 'sos real', 'sos un bot', 'eres un robot', 'eres humana', 'hablo con una maquina'],
    respuestas: [
      'Soy una asistente virtual: respondo de forma automática con la información que cargó el equipo de Transgas. No soy una persona, pero si preferís hablar con alguien del equipo te derivo por WhatsApp 💬',
    ],
    followUps: ['Hablar con una persona'],
  },
  {
    question: '¿Cómo estás?',
    category: 'Conversación',
    palabrasClave: ['como estas', 'como andas', 'como te va', 'todo bien'],
    respuestas: ['¡Muy bien, gracias por preguntar! 😊 ¿En qué te puedo ayudar hoy?', '¡Todo bien por acá! Gracias por preguntar 😊 Contame, ¿qué necesitás?'],
    followUps: MENU,
  },
  {
    question: 'Agradecimiento',
    category: 'Conversación',
    palabrasClave: ['gracias', 'muchas gracias', 'te agradezco', 'mil gracias'],
    respuestas: ['¡De nada! 😊 ¿Puedo ayudarte con algo más?', 'Un gusto ayudarte 😊 ¿Hay algo más en lo que pueda orientarte?'],
    followUps: ['No, eso es todo', 'Mi factura', 'Trámites', 'Tarifas'],
  },
  {
    question: 'Despedida',
    category: 'Conversación',
    palabrasClave: ['chau', 'adios', 'hasta luego', 'hasta pronto', 'nos vemos', 'eso es todo', 'nada mas', 'no gracias'],
    respuestas: [
      '¡Hasta luego! 👋 Gracias por comunicarte con Transgas. Ante una emergencia, recordá que podés llamar al 0800-777-8427 las 24 horas.',
      '¡Chau, que tengas un lindo día! 👋 Si necesitás algo más, acá estoy. Y ante una emergencia: 0800-777-8427, las 24 horas.',
    ],
  },
  {
    question: 'La respuesta no me sirvió',
    category: 'Conversación',
    palabrasClave: ['no me sirve', 'no me sirvio', 'no entendi la respuesta', 'no es lo que busco', 'otra cosa', 'no me ayudo', 'no era eso', 'no es eso'],
    respuestas: [
      'Perdón por no haberte ayudado bien 🙏 Probá escribirme tu consulta con otras palabras, elegí un tema del menú, o si preferís te derivo con una persona del equipo.',
    ],
    followUps: ['Hablar con una persona'],
  },
  {
    question: '¿Es seguro este chat?',
    category: 'Conversación',
    palabrasClave: ['es seguro este chat', 'mis datos', 'privacidad', 'guardan mis datos', 'datos personales', 'es confiable'],
    respuestas: [
      'Cuidamos tu información 🔒 Este asistente nunca te pide contraseñas, datos de tarjeta ni CBU: no los escribas acá. Guardamos las conversaciones para que el equipo de Transgas pueda mejorar la atención.',
    ],
    followUps: ['Hablar con una persona'],
  },

  // ───────────────────────── Facturación ─────────────────────────
  {
    question: '¿Cómo veo y pago mi factura?',
    category: 'Facturación',
    palabrasClave: ['factura', 'mi factura', 'ver factura', 'pagar factura', 'descargar factura', 'cooponline', 'mi cuenta', 'donde pago', 'como pago', 'pago online'],
    respuestas: [
      `Podés ver, descargar y pagar tu factura desde CoopOnline: ${COOP}\nIngresá con tu usuario y contraseña. Importante: no compartas tus claves con nadie, ni por este chat.\n\n¿Qué más necesitás saber sobre tu factura?`,
      `Tu factura está disponible en CoopOnline (${COOP}). Ahí consultás el consumo, descargás el comprobante y gestionás el pago.\n\n¿Querés saber algo más sobre tu factura?`,
      `Entrá a CoopOnline (${COOP}) para ver y pagar tu factura. Si todavía no tenés usuario, consultanos en atención al cliente: 3385-480021.\n\n¿Te ayudo con algo más de tu factura?`,
    ],
    followUps: ['Cómo leer mi factura', 'Mi factura vino más alta', '¿Cuándo vence mi factura?', 'Pagué y no figura', 'No me llegó la factura', 'Factura electrónica'],
  },
  {
    question: '¿Cómo leo mi factura?',
    category: 'Facturación',
    palabrasClave: ['entender factura', 'leer factura', 'que dice mi factura', 'conceptos factura', 'como se calcula', 'detalle factura', 'cargo fijo', 'no entiendo mi factura', 'consumo factura'],
    respuestas: [
      'Armamos una guía para leer tu factura paso a paso: consumos, períodos y conceptos. Mirala acá: /ayuda/entender-tu-factura',
      'Si algo de tu factura no te cierra, en /ayuda/entender-tu-factura te explicamos cada concepto. Y si sigue la duda, escribinos por /contacto.',
    ],
    followUps: ['Mi factura vino más alta', 'Ver y pagar mi factura', '¿En qué categoría estoy?'],
  },
  {
    question: '¿Por qué mi factura es más alta?',
    category: 'Facturación',
    palabrasClave: ['factura alta', 'factura cara', 'factura mas cara', 'subio la factura', 'consumo alto', 'vino mucho'],
    respuestas: [
      'Una factura más alta suele deberse a más consumo en el período (por ejemplo, en invierno por la calefacción), a actualizaciones del cuadro tarifario o a lecturas estimadas. Repasá la guía en /ayuda/entender-tu-factura y, si creés que hay un error, informá la lectura de tu medidor en /autogestion/informar-medidor.',
      'Puede ser por mayor consumo, un cambio tarifario o una lectura estimada. Te recomiendo revisar /ayuda/entender-tu-factura y cargar la lectura real en /autogestion/informar-medidor. Si persiste, escribinos desde /contacto.',
    ],
    followUps: ['Cómo leer mi factura', 'Informar la lectura del medidor', 'Hablar con una persona'],
  },
  {
    question: '¿Cuándo vence mi factura?',
    category: 'Facturación',
    palabrasClave: ['cuando vence mi factura', 'vencimiento', 'fecha de vencimiento', 'hasta cuando puedo pagar', 'cuando vence'],
    respuestas: [`{{vencimiento}}\nPodés confirmarlo también en CoopOnline: ${COOP}`],
    followUps: ['Ver y pagar mi factura', 'Pagué y no figura'],
  },
  {
    question: 'No me llegó la factura / necesito un duplicado',
    category: 'Facturación',
    palabrasClave: ['no me llego la factura', 'duplicado de factura', 'perdi la factura', 'necesito una copia de mi factura', 'copia de factura', 'no encuentro mi factura'],
    respuestas: [
      `Podés descargar tu factura (o una copia) cuando quieras desde CoopOnline: ${COOP}\nPara no depender del papel, también podés adherirte a la factura electrónica: /autogestion/factura-electronica. Si no podés ingresar o no la encontrás, escribinos desde /contacto.`,
    ],
    followUps: ['Factura electrónica', 'No puedo ingresar a CoopOnline'],
  },
  {
    question: 'No puedo ingresar a CoopOnline',
    category: 'Facturación',
    palabrasClave: ['olvide contrasena', 'no puedo ingresar', 'no puedo entrar', 'clave cooponline', 'usuario cooponline', 'recuperar clave', 'no me deja entrar'],
    respuestas: [
      `Para recuperar el acceso usá las opciones de CoopOnline (${COOP}). Si no te funciona, comunicate con atención al cliente al 3385-480021 (lunes a viernes de 07:00 a 14:00). Recordá: nunca compartas tu contraseña por este chat.`,
      `Probá recuperar tu clave desde la pantalla de ingreso de CoopOnline (${COOP}). Si el problema sigue, llamá al 3385-480021 en horario de atención. Por seguridad, no me envíes tus claves por acá.`,
    ],
    followUps: ['Hablar con una persona', 'Contacto y horarios'],
  },
  {
    question: '¿Dónde veo mi número de cliente?',
    category: 'Facturación',
    palabrasClave: ['numero de cliente', 'numero de socio', 'donde veo mi numero de cliente', 'no se mi numero de cliente', 'nro de cliente'],
    respuestas: [
      'Tu número de cliente / socio figura en tu factura, junto a tus datos y al domicilio del servicio. Lo vas a necesitar para informar pagos, lecturas y otros trámites.',
    ],
    followUps: ['Informar un pago', 'Informar la lectura del medidor'],
  },
  {
    question: '¿Cómo me adhiero a la factura electrónica?',
    category: 'Trámites',
    palabrasClave: ['factura electronica', 'factura por mail', 'factura por correo', 'factura sin papel', 'adherir factura', 'recibir factura email'],
    respuestas: [
      'Podés adherirte a la factura electrónica completando un formulario corto: /autogestion/factura-electronica. Desde ahí recibís tu factura por correo.',
      'Es muy simple: completá tus datos en /autogestion/factura-electronica y empezás a recibir la factura por mail, sin papel.',
    ],
    followUps: ['Ver y pagar mi factura', '¿Dónde veo mi número de cliente?'],
  },
  {
    question: 'Pagué y no se ve reflejado',
    category: 'Trámites',
    palabrasClave: ['informar pago', 'ya pague', 'pague y no figura', 'pago no se acredito', 'no se ve mi pago', 'pago no figura', 'comprobante de pago', 'pago no impacto'],
    respuestas: [
      'Si ya pagaste y no figura, informalo en /autogestion/informar-pago con la fecha, el monto y el medio de pago. Lo verificamos y lo acreditamos.',
      'Cargá los datos del pago en /autogestion/informar-pago (fecha, monto y comprobante si lo tenés) y lo revisamos para acreditarlo.',
    ],
    followUps: ['¿Dónde veo mi número de cliente?', 'Ver y pagar mi factura'],
  },

  // ───────────────────────── Trámites ─────────────────────────
  {
    question: '¿Qué trámites puedo hacer online?',
    category: 'Trámites',
    palabrasClave: ['tramite', 'gestion', 'autogestion', 'que puedo gestionar', 'que tramites hay'],
    respuestas: [
      'Desde Autogestión podés hacer, sin moverte de tu casa:\n• Factura electrónica → /autogestion/factura-electronica\n• Informar un pago → /autogestion/informar-pago\n• Informar el medidor → /autogestion/informar-medidor\n• Altas, bajas y modificaciones → /autogestion/abm-servicio\n• Pedir un nuevo servicio → /autogestion/nuevo-servicio\n\n¿Cuál necesitás?',
    ],
    followUps: ['Quiero un nuevo servicio', 'Baja o cambio de titular', 'Factura electrónica', 'Informar un pago', 'Informar la lectura del medidor'],
  },
  {
    question: '¿Cómo solicito un nuevo servicio de gas?',
    category: 'Trámites',
    palabrasClave: ['nuevo servicio', 'alta servicio', 'conectar gas', 'instalar gas', 'quiero gas natural', 'contratar gas', 'conexion de gas', 'solicitar servicio'],
    respuestas: [
      'Para pedir un nuevo servicio completá el formulario en /autogestion/nuevo-servicio. Revisamos la factibilidad (si hay red en tu calle) y te contactamos para los próximos pasos. Para la instalación interna vas a necesitar un gasista matriculado.\n\n¿Qué querés saber del trámite?',
      'Podés iniciar el trámite en /autogestion/nuevo-servicio. Contanos dónde lo necesitás y te guiamos con la factibilidad y los pasos a seguir.\n\n¿Qué querés saber del trámite?',
    ],
    followUps: ['¿Qué requisitos hay para un nuevo servicio?', '¿Cuánto tarda el alta?', '¿Cuánto cuesta conectarme?', '¿Hay red de gas en mi calle?', 'Gasistas matriculados'],
  },
  {
    question: '¿Qué requisitos hay para un nuevo servicio?',
    category: 'Trámites',
    palabrasClave: ['requisitos nuevo servicio', 'documentacion nuevo servicio', 'papeles para nuevo servicio', 'que datos piden para el alta'],
    respuestas: [
      'En el formulario de /autogestion/nuevo-servicio te pedimos: nombre y DNI del solicitante, datos de contacto, localidad, domicilio donde se necesita el servicio, tipo de usuario (residencial, comercial o industrial) y si hay red de gas en tu calle. Después el equipo revisa la factibilidad y te indica la documentación y los pasos que correspondan.',
    ],
    followUps: ['¿Hay red de gas en mi calle?', '¿Cuánto tarda el alta?'],
  },
  {
    question: '¿Cuánto tarda el alta de un servicio?',
    category: 'Trámites',
    palabrasClave: ['cuanto tarda alta', 'cuanto tarda nuevo servicio', 'cuanto tarda conexion', 'plazo alta', 'cuando me conectan', 'cuanto demora la conexion'],
    respuestas: [
      'Los tiempos dependen de cada caso: si hay red en tu calle, de la documentación y de la instalación interna a cargo de un gasista matriculado. Una vez que envíes la solicitud en /autogestion/nuevo-servicio, el equipo te informa los plazos estimados. También podés consultar al 3385-480021.',
      'No hay un plazo único: varía según la factibilidad de red y los trámites de cada usuario. Si ya enviaste la solicitud, te van a contactar con una estimación; si no, empezá en /autogestion/nuevo-servicio o llamá al 3385-480021.',
    ],
    followUps: ['¿Cuánto cuesta conectarme?', 'Gasistas matriculados'],
  },
  {
    question: '¿Cuánto cuesta conectarme a la red?',
    category: 'Trámites',
    palabrasClave: ['cuanto cuesta conexion', 'costo conexion', 'costo alta', 'precio conectar gas', 'cuanto sale conectar', 'cuanto sale el alta'],
    respuestas: [
      'El costo depende de cada caso (distancia a la red, obra necesaria y trámites). Solicitá el servicio en /autogestion/nuevo-servicio y te informamos los importes aplicables. También podés consultar por teléfono: 3385-480021.',
      'No hay un valor único: se calcula según la situación de cada domicilio. Iniciá la consulta en /autogestion/nuevo-servicio y el equipo te pasa el detalle.',
    ],
    followUps: ['¿Cuánto tarda el alta?', 'Gasistas matriculados'],
  },
  {
    question: '¿Hay red de gas en mi calle?',
    category: 'Trámites',
    palabrasClave: ['hay red de gas en mi calle', 'llega el gas a mi calle', 'factibilidad', 'hay gas natural en mi zona', 'hay red en mi calle'],
    respuestas: [
      'En el formulario de nuevo servicio hay una pregunta sobre si hay red en tu calle: si no lo sabés, elegí «No lo sé» y el equipo verifica la factibilidad. También podés consultar en la cooperativa de tu localidad o desde /contacto.',
    ],
    followUps: ['Quiero un nuevo servicio', 'Cooperativas y gasistas'],
  },
  {
    question: 'Baja, modificación o cambio de titularidad',
    category: 'Trámites',
    palabrasClave: ['baja servicio', 'dar de baja', 'cambio de titular', 'cambiar titularidad', 'modificar datos', 'abm', 'cambiar nombre factura', 'cancelar servicio'],
    respuestas: [
      'Para bajas, modificaciones de datos o cambio de titularidad completá el formulario de /autogestion/abm-servicio. Un representante te contacta para confirmar la documentación necesaria.',
      'Esas gestiones se inician en /autogestion/abm-servicio. Tené a mano tu número de cliente y el domicilio del servicio.',
    ],
    followUps: ['¿Dónde veo mi número de cliente?', 'Soy inquilino'],
  },
  {
    question: '¿Cómo informo la lectura o un problema del medidor?',
    category: 'Trámites',
    palabrasClave: ['informar medidor', 'lectura medidor', 'estado del medidor', 'medidor roto', 'anomalia medidor', 'mi medidor', 'cargar lectura', 'problema medidor'],
    respuestas: [
      'Podés informar la lectura o una anomalía de tu medidor desde /autogestion/informar-medidor. Necesitamos tu número de cliente y, si es posible, el número de medidor.',
      'Para avisar el estado de tu medidor o cargar una lectura usá /autogestion/informar-medidor. El equipo técnico te contacta si hace falta.',
    ],
    followUps: ['¿Dónde veo mi número de cliente?', 'Mi factura vino más alta'],
  },
  {
    question: 'Soy inquilino, ¿qué tengo que saber?',
    category: 'Información',
    palabrasClave: ['inquilino', 'soy inquilino', 'alquilo', 'alquiler', 'contrato de alquiler', 'titular alquiler'],
    respuestas: [
      'Si alquilás, en /ayuda/inquilinos explicamos cómo manejar el servicio, la titularidad y la documentación. Para cambios de titular usá /autogestion/abm-servicio.',
      'Tenemos una guía para inquilinos en /ayuda/inquilinos. Cualquier trámite sobre el servicio se inicia en /autogestion/abm-servicio.',
    ],
    followUps: ['Baja o cambio de titular', 'Monóxido de carbono'],
  },

  // ───────────────────────── Servicio ─────────────────────────
  {
    question: 'Me quedé sin gas / falta de suministro',
    category: 'Servicio',
    palabrasClave: ['sin gas', 'falta de gas', 'no tengo gas', 'sin suministro', 'corte de gas', 'se corto el gas', 'no hay gas', 'falta suministro'],
    respuestas: [
      'Para reportar falta de suministro comunicate al 3385-480200. Antes, revisá si hay un aviso en /estado-del-servicio: puede ser un corte programado o una tarea en tu zona.',
      'Si te quedaste sin gas llamá al 3385-480200 (falta de suministro). Podés ver si hay cortes o trabajos en tu zona en /estado-del-servicio.',
    ],
    followUps: ['¿Hay cortes programados?', '¿Cuánto dura un corte?', 'Llega poca presión de gas', 'Tengo olor a gas'],
  },
  {
    question: '¿Hay cortes programados?',
    category: 'Servicio',
    palabrasClave: ['cortes programados', 'aviso de corte', 'trabajos programados', 'estado del servicio', 'hay cortes', 'mantenimiento', 'obras corte'],
    respuestas: [
      'Publicamos los cortes programados y avisos por zona en /estado-del-servicio, ordenados por estado y fecha. Ahí ves si hay algo en tu localidad.',
      'Mirá /estado-del-servicio: están los avisos en curso y los cortes programados, con zona y horarios estimados.',
    ],
    followUps: ['Me quedé sin gas', '¿Cuánto dura un corte?'],
  },
  {
    question: '¿Cuánto dura un corte?',
    category: 'Servicio',
    palabrasClave: ['cuanto dura un corte', 'cuanto dura el corte', 'hasta cuando no hay gas', 'cuando se arregla', 'cuando se normaliza'],
    respuestas: [
      'Los avisos de /estado-del-servicio indican el inicio y el fin estimado de cada corte o trabajo. Si no hay un aviso para tu zona, reportá la falta de suministro al 3385-480200.',
    ],
    followUps: ['¿Hay cortes programados?', 'Me quedé sin gas'],
  },
  {
    question: 'Llega poca presión de gas',
    category: 'Servicio',
    palabrasClave: ['poca presion', 'llega poco gas', 'la llama es baja', 'poco gas', 'presion baja', 'baja presion', 'llama debil'],
    respuestas: [
      'Si el gas llega con poca presión o la llama sale débil, reportalo al 3385-480200 (falta de suministro) para que lo revisen. Si además sentís olor a gas, es una emergencia: salí del lugar y llamá al 0800-777-8427.',
    ],
    followUps: ['Me quedé sin gas', 'Gasistas matriculados'],
  },
  {
    question: 'Volvió el gas después de un corte',
    category: 'Servicio',
    palabrasClave: ['volvio el gas', 'vuelve el gas que hago', 'despues de un corte de gas', 'volvio el servicio', 'reencender artefactos'],
    respuestas: [
      'Cuando vuelve el servicio después de un corte: ventilá los ambientes y verificá que no haya olor a gas antes de reencender los artefactos. Encendelos de a uno y con cuidado. Si notás olor a gas o algo raro, no uses fuego ni interruptores, salí del lugar y llamá al 0800-777-8427.',
    ],
    followUps: ['Seguridad', 'Me quedé sin gas'],
  },
  {
    question: 'Obras y redes de gas',
    category: 'Información',
    palabrasClave: ['obras', 'redes', 'red de gas', 'llega el gas a mi localidad', 'ampliacion de red', 'infraestructura', 'gasoducto', 'extension de red', 'obras y redes'],
    respuestas: [
      'Transgas desarrolla redes de distribución de gas natural y trabaja con cooperativas y comunidades. Podés conocer más en la sección Obras y redes de la home (/#infraestructura) o consultar tu caso en /contacto.',
      'Si querés saber si la red llega a tu localidad o proyectar una obra, escribinos desde /contacto y el equipo te asesora. Más información en /#infraestructura.',
    ],
    followUps: ['Quiero un nuevo servicio', 'Contacto y horarios'],
  },

  // ───────────────────────── Emergencias y seguridad ─────────────────────────
  {
    question: 'Emergencias',
    category: 'Emergencias',
    palabrasClave: ['emergencia', 'emergencias', 'urgencia', 'numero de emergencia', 'telefono de emergencia', 'guardia'],
    respuestas: [
      'Si hay riesgo, alejate del lugar y llamá desde un sitio seguro. Ese es el canal oficial de emergencias de Transgas. Si es por falta de suministro (sin riesgo), el número es 3385-480200.',
      'No esperes: si sentís olor a gas o hay peligro, salí del lugar y llamá desde afuera. Para falta de suministro sin riesgo, comunicate al 3385-480200.',
    ],
  },
  {
    question: 'Olor a gas / fuga',
    category: 'Emergencias',
    palabrasClave: ['olor a gas', 'fuga de gas', 'fuga', 'huele a gas', 'perdida de gas', 'escape de gas'],
    respuestas: [
      'No accionés llaves de luz ni aparatos eléctricos, no uses fuego, ventilá abriendo puertas y ventanas, cerrá la llave de corte si es seguro hacerlo y salí del lugar. Llamá desde afuera.',
      'Ante una fuga: nada de chispas (no enciendas ni apagues luces), abrí puertas y ventanas, cerrá la llave de paso si podés hacerlo con seguridad y alejate. Llamá desde un lugar abierto.',
    ],
  },
  {
    question: 'Seguridad',
    category: 'Seguridad',
    palabrasClave: ['seguridad', 'consejos de seguridad', 'prevencion', 'como cuidarme', 'recomendaciones de seguridad', 'seguridad del gas'],
    respuestas: [
      'La seguridad es lo primero 🛡️ Puedo contarte sobre qué hacer ante una fuga, cómo prevenir el monóxido de carbono, el uso eficiente del gas, cómo evitar daños en las redes y cómo encontrar un gasista matriculado. Todo está también en /seguridad.',
    ],
    followUps: ['Qué hago si hay olor a gas', 'Monóxido de carbono', 'Uso eficiente del gas', 'Prevención de daños a la red', 'Gasistas matriculados', 'Revisión de artefactos'],
  },
  {
    question: 'Monóxido de carbono',
    category: 'Seguridad',
    palabrasClave: ['monoxido de carbono', 'monoxido', 'intoxicacion', 'mareos gas', 'sintomas monoxido', 'calefon', 'estufa sin tiro', 'artefacto'],
    respuestas: [
      'El monóxido de carbono no tiene olor ni color. Para prevenirlo: ventilá los ambientes, no uses hornallas ni hornos para calefaccionar y revisá tus artefactos con un gasista matriculado. Si hay dolor de cabeza, mareos o náuseas, salí al aire libre y buscá atención médica. Más info: /seguridad/monoxido-de-carbono',
      'Se previene con buena ventilación y artefactos revisados por un gasista matriculado (/profesionales/gasistas-matriculados). Si sospechás una intoxicación, salí a tomar aire y pedí ayuda médica de inmediato. Guía completa: /seguridad/monoxido-de-carbono',
    ],
    followUps: ['Gasistas matriculados', 'Revisión de artefactos', 'Uso eficiente del gas'],
  },
  {
    question: '¿Cómo encuentro un gasista matriculado?',
    category: 'Seguridad',
    palabrasClave: ['gasista', 'gasista matriculado', 'matricula gasista', 'necesito un gasista', 'instalador matriculado'],
    respuestas: [
      'Podés consultar el listado completo de gasistas matriculados, con matrícula, localidad y contacto, en /profesionales/gasistas-matriculados. Si me decís tu localidad, te muestro los de tu zona 😉',
      'Los gasistas habilitados están en /profesionales/gasistas-matriculados. Siempre elegí un profesional matriculado. Decime tu localidad y te paso los de tu zona.',
    ],
    followUps: ['Cooperativas y gasistas', 'Monóxido de carbono'],
  },
  {
    question: 'Revisión periódica de artefactos',
    category: 'Seguridad',
    palabrasClave: ['revision de artefactos', 'cada cuanto revisar', 'revision periodica', 'revisar la instalacion', 'antes del invierno', 'mantenimiento de artefactos'],
    respuestas: [
      'Conviene que un gasista matriculado revise tus artefactos e instalación periódicamente, sobre todo antes del invierno, y que mantengas la ventilación libre. Así prevenís fugas y monóxido de carbono.',
    ],
    followUps: ['Gasistas matriculados', 'Monóxido de carbono'],
  },
  {
    question: 'Uso eficiente del gas',
    category: 'Seguridad',
    palabrasClave: ['uso eficiente', 'ahorrar gas', 'consumir menos gas', 'ahorro de gas', 'consejos de ahorro', 'calefaccion eficiente', 'gastar menos'],
    respuestas: [
      'Algunos consejos: evitá fugas de calor (burletes y cierres), mantené los artefactos limpios y revisados, regulá la calefacción y aprovechá el sol. Todo el detalle está en /seguridad/uso-eficiente.',
      'Usar el gas de forma eficiente baja tu factura y cuida el ambiente. Tenés consejos concretos en /seguridad/uso-eficiente.',
    ],
    followUps: ['Mi factura vino más alta', 'Revisión de artefactos'],
  },
  {
    question: 'Prevención de daños a la red',
    category: 'Seguridad',
    palabrasClave: ['prevencion de danos', 'dano a la red', 'excavar', 'obra en la via publica', 'caneria enterrada', 'excavadora', 'antes de excavar', 'rotura de caneria'],
    respuestas: [
      'Antes de excavar o hacer obras, consultá por la ubicación de las redes de gas para evitar daños y accidentes. Todo el plan de prevención está en /seguridad/prevencion-de-danos.',
      'Si vas a hacer una excavación, avisá antes: dañar una cañería de gas es muy peligroso. Mirá las recomendaciones en /seguridad/prevencion-de-danos. Si ya hubo un daño, llamá al 0800-777-8427.',
    ],
    followUps: ['Contacto y horarios', 'Seguridad'],
  },

  // ───────────────────────── Tarifas ─────────────────────────
  {
    question: '¿Dónde veo las tarifas?',
    category: 'Tarifas',
    palabrasClave: ['tarifa', 'cuadro tarifario', 'cuanto cuesta el gas', 'costo del gas', 'tarifa vigente', 'precio del gas'],
    respuestas: [
      'El cuadro tarifario vigente (PDF) y las categorías están en /tarifas. Publicamos el documento oficial para que nunca veas importes desactualizados.\n\n¿Qué más querés saber sobre tarifas?',
      'Podés descargar el cuadro tarifario oficial en /tarifas. Ahí también ves las categorías residenciales y SGP.\n\n¿Querés saber algo más sobre tarifas?',
    ],
    followUps: ['¿En qué categoría estoy?', 'Tarifa social', 'Zona fría', '¿Por qué aumentó el gas?', 'Mi factura vino más alta'],
  },
  {
    question: '¿En qué categoría estoy?',
    category: 'Tarifas',
    palabrasClave: ['categoria', 'categorias', 'categoria residencial', 'r1', 'r2', 'r3', 'sgp', 'en que categoria estoy', 'categoria de usuario'],
    respuestas: [
      'Las categorías (residenciales R1 a R3 y SGP) dependen del consumo anual. Las explicamos en /tarifas/categorias. Tu categoría figura también en tu factura.',
      'Tu categoría se define según tu consumo anual. Mirá la explicación en /tarifas/categorias y el detalle en el cuadro tarifario de /tarifas.',
    ],
    followUps: ['Tarifa social', 'Cómo leer mi factura'],
  },
  {
    question: '¿Qué es la tarifa social y cómo la tramito?',
    category: 'Tarifas',
    palabrasClave: ['tarifa social', 'subsidio', 'beneficio', 'descuento gas', 'requisitos tarifa social', 'rase'],
    respuestas: [
      'La tarifa social es un beneficio para quienes cumplen ciertos requisitos. Te contamos quiénes pueden acceder y cómo se tramita en /tarifas/tarifa-social.',
      'Los requisitos y el paso a paso de la tarifa social están en /tarifas/tarifa-social. Si te queda alguna duda, escribinos desde /contacto.',
    ],
    followUps: ['¿En qué categoría estoy?', 'Zona fría'],
  },
  {
    question: 'Régimen de zona fría',
    category: 'Tarifas',
    palabrasClave: ['zona fria', 'regimen zona fria', 'ley zona fria', 'beneficio zona fria'],
    respuestas: [
      'El régimen de zona fría es una normativa que alcanza a distintas localidades. Tenés la información en /tarifas/zona-fria.',
      'Para saber cómo te afecta el régimen de zona fría, mirá /tarifas/zona-fria.',
    ],
    followUps: ['Tarifa social', 'Hablar con una persona'],
  },
  {
    question: '¿Por qué aumentó el gas?',
    category: 'Tarifas',
    palabrasClave: ['por que aumento el gas', 'aumento del gas', 'aumentaron la tarifa', 'por que sube', 'aumento de tarifa', 'por que esta mas caro'],
    respuestas: [
      'Las tarifas se aplican según el cuadro tarifario vigente que publicamos en /tarifas, con el detalle de cada categoría. Si querés entender cómo se compone tu factura, mirá /ayuda/entender-tu-factura.',
    ],
    followUps: ['Cómo leer mi factura', '¿En qué categoría estoy?'],
  },

  // ───────────────────────── Información ─────────────────────────
  {
    question: 'Derechos de usuarios y reclamos',
    category: 'Información',
    palabrasClave: ['derechos', 'derechos de usuarios', 'reclamo', 'reclamos', 'quiero reclamar', 'defensa del consumidor', 'queja'],
    respuestas: [
      'Los derechos de los usuarios del servicio están publicados en /usuarios/derechos. Para presentar un reclamo escribinos desde /contacto o llamá al 3385-480021.',
      'Podés consultar tus derechos como usuario en /usuarios/derechos. Si querés hacer un reclamo, usá el formulario de /contacto.',
    ],
    followUps: ['Hablar con una persona', 'Contacto y horarios'],
  },
  {
    question: 'Cooperativas asociadas',
    category: 'Cooperativas',
    palabrasClave: ['cooperativas y gasistas', 'cooperativas', 'cooperativa', 'coop asociada', 'donde atienden', 'centro de atencion', 'oficina de mi localidad'],
    respuestas: [
      'Transgas trabaja con 8 cooperativas asociadas y una red de gasistas matriculados. Decime tu localidad y te paso los datos: dirección, teléfono, horario y gasistas de tu zona 📍 También está todo en /cooperativas.',
    ],
    followUps: LOCALITY_CHIPS,
  },
  ...localityFaqs,
  {
    question: 'Datos de contacto y horario',
    category: 'Contacto',
    palabrasClave: ['contacto', 'contacto y horarios', 'telefono', 'telefono de atencion', 'horario', 'horario de atencion', 'mail', 'correo', 'sabado', 'domingo', 'fin de semana', 'atienden hoy'],
    respuestas: [
      'Atención al cliente: 3385-480021, de lunes a viernes de 07:00 a 14:00 hs. Para emergencias, 0800-777-8427 las 24 horas, y para falta de suministro 3385-480200. También podés escribir desde /contacto.',
      'Podés comunicarte al 3385-480021 (lunes a viernes, 07:00 a 14:00) o escribirnos desde /contacto. Emergencias: 0800-777-8427, las 24 horas.',
    ],
    followUps: ['Cómo llegar', 'Hablar con una persona', 'Cooperativas y gasistas'],
  },
  {
    question: '¿Cómo llego a Transgas?',
    category: 'Contacto',
    palabrasClave: ['como llegar', 'mapa', 'donde queda', 'ubicacion', 'direccion de transgas', 'donde estan', 'oficina de transgas', 'donde esta transgas'],
    respuestas: [
      `Estamos en Ruta Nacional Nº 7 km 541, General Levalle (Córdoba) 📍 Mirá el mapa en /contacto o abrilo directo en Google Maps: ${MAPS}`,
    ],
    followUps: ['Contacto y horarios'],
  },
  {
    question: '¿Tienen WhatsApp?',
    category: 'Contacto',
    palabrasClave: ['tienen whatsapp', 'numero de whatsapp', 'whatsapp', 'escribir por whatsapp', 'mandar whatsapp'],
    respuestas: ['Sí, podés escribirnos por WhatsApp desde este chat 💬 Elegí «Hablar con una persona» y se abre la conversación con tu consulta ya escrita.'],
    followUps: ['Hablar con una persona'],
  },
  {
    question: '¿Quiénes son Transgas?',
    category: 'Información',
    palabrasClave: ['que es transgas', 'quienes son', 'quienes somos', 'sobre transgas', 'quien es transgas'],
    respuestas: [
      'Transgas es una asociación cooperativa que presta el servicio de gas natural en el sur de Córdoba, junto con el desarrollo de redes de distribución y una red de cooperativas asociadas.',
      'Somos la Asoc. Cooperativa Transportadora de Gas del Sur de Cba. Ltda.: servicio de gas natural, infraestructura y trabajo conjunto con cooperativas de la región.',
    ],
    followUps: ['Obras y redes de gas', 'Cooperativas y gasistas'],
  },
  {
    question: 'Noticias y novedades',
    category: 'Información',
    palabrasClave: ['novedades', 'noticias', 'blog', 'comunicados', 'que hay de nuevo'],
    respuestas: ['Las novedades, obras y comunicados de Transgas están en /blog.', 'Podés leer las últimas noticias en /blog.'],
    followUps: ['¿Hay cortes programados?'],
  },
];
