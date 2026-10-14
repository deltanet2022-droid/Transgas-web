// FAQ de ejemplo para el chatbot (Fase 1). Se editan desde el CRM → Preguntas frecuentes.
// Las palabras clave se normalizan solas (tildes, mayúsculas, plurales y sinónimos simples),
// así que alcanza con escribirlas de forma natural.

export interface SeedFaq {
  question: string;
  category: string;
  palabrasClave: string[];
  respuestas: string[];
}

const COOP = 'https://www.cooponlineweb.com.ar/TRANSGAS/Login';

export const faqs: SeedFaq[] = [
  // ───────── Conversación ─────────
  {
    question: 'Saludo',
    category: 'Conversación',
    palabrasClave: ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'que tal', 'hey'],
    respuestas: [
      '¡Hola! Soy el asistente de Transgas. Puedo orientarte sobre facturas, trámites, tarifas, seguridad y emergencias. ¿En qué te ayudo?',
      '¡Hola, qué bueno verte por acá! Contame qué necesitás: factura, trámites, tarifas, cortes de servicio o seguridad.',
      '¡Buenas! Estoy para orientarte con tu servicio de gas. ¿Qué querés consultar?',
    ],
  },
  {
    question: 'Agradecimiento',
    category: 'Conversación',
    palabrasClave: ['gracias', 'muchas gracias', 'te agradezco', 'mil gracias'],
    respuestas: [
      '¡De nada! Si necesitás algo más, acá estoy.',
      'Un gusto ayudarte. Cualquier otra consulta, escribime.',
      '¡Gracias a vos! Ante cualquier duda volvé a escribirme.',
    ],
  },
  {
    question: 'Despedida',
    category: 'Conversación',
    palabrasClave: ['chau', 'adios', 'hasta luego', 'hasta pronto', 'nos vemos'],
    respuestas: [
      '¡Hasta luego! Recordá que ante una emergencia podés llamar al 0800-777-8427, las 24 horas.',
      '¡Chau! Que tengas un lindo día. Si necesitás algo más, acá estoy.',
    ],
  },

  // ───────── Facturación ─────────
  {
    question: '¿Cómo veo y pago mi factura?',
    category: 'Facturación',
    palabrasClave: ['factura', 'ver factura', 'pagar factura', 'descargar factura', 'cooponline', 'mi cuenta', 'donde pago', 'como pago', 'pago online'],
    respuestas: [
      `Podés ver, descargar y pagar tu factura desde CoopOnline: ${COOP}\nIngresá con tu usuario y contraseña. Importante: no compartas tus claves con nadie, ni por este chat.`,
      `Tu factura está disponible en CoopOnline (${COOP}). Ahí consultás el consumo, descargás el comprobante y gestionás el pago.`,
      `Entrá a CoopOnline (${COOP}) para ver y pagar tu factura. Si todavía no tenés usuario, consultanos en atención al cliente: 3385-480021.`,
    ],
  },
  {
    question: '¿Cómo leo mi factura?',
    category: 'Facturación',
    palabrasClave: ['entender factura', 'leer factura', 'que dice mi factura', 'conceptos factura', 'como se calcula', 'detalle factura', 'cargo fijo', 'no entiendo mi factura', 'consumo factura'],
    respuestas: [
      'Armamos una guía para leer tu factura paso a paso: consumos, períodos y conceptos. Mirala acá: /ayuda/entender-tu-factura',
      'Si algo de tu factura no te cierra, en /ayuda/entender-tu-factura te explicamos cada concepto. Y si sigue la duda, escribinos por /contacto.',
    ],
  },
  {
    question: '¿Por qué mi factura es más alta?',
    category: 'Facturación',
    palabrasClave: ['factura alta', 'factura cara', 'factura mas cara', 'subio la factura', 'aumento factura', 'consumo alto', 'vino mucho'],
    respuestas: [
      'Una factura más alta suele deberse a más consumo en el período (por ejemplo, en invierno por la calefacción), a actualizaciones del cuadro tarifario o a lecturas estimadas. Repasá la guía en /ayuda/entender-tu-factura y, si creés que hay un error, informá la lectura de tu medidor en /autogestion/informar-medidor.',
      'Puede ser por mayor consumo, un cambio tarifario o una lectura estimada. Te recomiendo revisar /ayuda/entender-tu-factura y cargar la lectura real en /autogestion/informar-medidor. Si persiste, escribinos desde /contacto.',
    ],
  },
  {
    question: 'No puedo ingresar a CoopOnline',
    category: 'Facturación',
    palabrasClave: ['olvide contrasena', 'no puedo ingresar', 'no puedo entrar', 'clave cooponline', 'usuario cooponline', 'recuperar clave', 'no me deja entrar'],
    respuestas: [
      `Para recuperar el acceso usá las opciones de CoopOnline (${COOP}). Si no te funciona, comunicate con atención al cliente al 3385-480021 (lunes a viernes de 07:00 a 14:00). Recordá: nunca compartas tu contraseña por este chat.`,
      `Probá recuperar tu clave desde la pantalla de ingreso de CoopOnline (${COOP}). Si el problema sigue, llamá al 3385-480021 en horario de atención. Por seguridad, no me envíes tus claves por acá.`,
    ],
  },

  // ───────── Trámites ─────────
  {
    question: '¿Cómo me adhiero a la factura electrónica?',
    category: 'Trámites',
    palabrasClave: ['factura electronica', 'factura por mail', 'factura por correo', 'factura sin papel', 'adherir factura', 'recibir factura email'],
    respuestas: [
      'Podés adherirte a la factura electrónica completando un formulario corto: /autogestion/factura-electronica. Desde ahí recibís tu factura por correo.',
      'Es muy simple: completá tus datos en /autogestion/factura-electronica y empezás a recibir la factura por mail, sin papel.',
    ],
  },
  {
    question: 'Pagué y no se ve reflejado',
    category: 'Trámites',
    palabrasClave: ['informar pago', 'ya pague', 'pague y no figura', 'pago no se acredito', 'no se ve mi pago', 'pago no figura', 'comprobante de pago', 'pago no impacto'],
    respuestas: [
      'Si ya pagaste y no figura, informalo en /autogestion/informar-pago con la fecha, el monto y el medio de pago. Lo verificamos y lo acreditamos.',
      'Cargá los datos del pago en /autogestion/informar-pago (fecha, monto y comprobante si lo tenés) y lo revisamos para acreditarlo.',
    ],
  },
  {
    question: '¿Cómo informo la lectura o un problema del medidor?',
    category: 'Trámites',
    palabrasClave: ['informar medidor', 'lectura medidor', 'estado del medidor', 'medidor roto', 'anomalia medidor', 'mi medidor', 'cargar lectura', 'problema medidor'],
    respuestas: [
      'Podés informar la lectura o una anomalía de tu medidor desde /autogestion/informar-medidor. Necesitamos tu número de cliente y, si es posible, el número de medidor.',
      'Para avisar el estado de tu medidor o cargar una lectura usá /autogestion/informar-medidor. El equipo técnico te contacta si hace falta.',
    ],
  },
  {
    question: '¿Cómo solicito un nuevo servicio de gas?',
    category: 'Trámites',
    palabrasClave: ['nuevo servicio', 'alta servicio', 'conectar gas', 'instalar gas', 'quiero gas natural', 'contratar gas', 'conexion de gas', 'solicitar servicio'],
    respuestas: [
      'Para pedir un nuevo servicio completá el formulario en /autogestion/nuevo-servicio. Revisamos la factibilidad (si hay red en tu calle) y te contactamos para los próximos pasos. Para la instalación interna vas a necesitar un gasista matriculado: /profesionales/gasistas-matriculados.',
      'Podés iniciar el trámite en /autogestion/nuevo-servicio. Contanos dónde lo necesitás y te guiamos con la factibilidad y los pasos a seguir.',
    ],
  },
  {
    question: '¿Cuánto tarda el alta de un servicio?',
    category: 'Trámites',
    palabrasClave: ['cuanto tarda alta', 'cuanto tarda nuevo servicio', 'cuanto tarda conexion', 'plazo alta', 'cuando me conectan', 'cuanto demora la conexion'],
    respuestas: [
      'Los tiempos dependen de cada caso: si hay red en tu calle, de la documentación y de la instalación interna a cargo de un gasista matriculado. Una vez que envíes la solicitud en /autogestion/nuevo-servicio, el equipo te informa los plazos estimados. También podés consultar al 3385-480021.',
      'No hay un plazo único: varía según la factibilidad de red y los trámites de cada usuario. Si ya enviaste la solicitud, te van a contactar con una estimación; si no, empezá en /autogestion/nuevo-servicio o llamá al 3385-480021.',
    ],
  },
  {
    question: '¿Cuánto cuesta conectarme a la red?',
    category: 'Trámites',
    palabrasClave: ['cuanto cuesta conexion', 'costo conexion', 'costo alta', 'precio conectar gas', 'cuanto sale conectar', 'cuanto sale el alta'],
    respuestas: [
      'El costo depende de cada caso (distancia a la red, obra necesaria y trámites). Solicitá el servicio en /autogestion/nuevo-servicio y te informamos los importes aplicables. También podés consultar por teléfono: 3385-480021.',
      'No hay un valor único: se calcula según la situación de cada domicilio. Iniciá la consulta en /autogestion/nuevo-servicio y el equipo te pasa el detalle.',
    ],
  },
  {
    question: 'Baja, modificación o cambio de titularidad',
    category: 'Trámites',
    palabrasClave: ['baja servicio', 'dar de baja', 'cambio de titular', 'cambiar titularidad', 'modificar datos', 'abm', 'cambiar nombre factura', 'cancelar servicio'],
    respuestas: [
      'Para bajas, modificaciones de datos o cambio de titularidad completá el formulario de /autogestion/abm-servicio. Un representante te contacta para confirmar la documentación necesaria.',
      'Esas gestiones se inician en /autogestion/abm-servicio. Tené a mano tu número de cliente y el domicilio del servicio.',
    ],
  },
  {
    question: '¿Qué trámites puedo hacer online?',
    category: 'Trámites',
    palabrasClave: ['tramite', 'gestion', 'autogestion', 'que puedo gestionar', 'que tramites hay'],
    respuestas: [
      'Desde Autogestión podés: adherirte a la factura electrónica (/autogestion/factura-electronica), informar un pago (/autogestion/informar-pago), informar el medidor (/autogestion/informar-medidor), hacer altas, bajas y modificaciones (/autogestion/abm-servicio) y pedir un nuevo servicio (/autogestion/nuevo-servicio). ¿Cuál necesitás?',
      'Los trámites online son: factura electrónica, informar pago, informar medidor, ABM de servicio y nuevo servicio. Los encontrás todos en /autogestion. ¿Sobre cuál querés más información?',
    ],
  },

  // ───────── Servicio ─────────
  {
    question: 'Me quedé sin gas / falta de suministro',
    category: 'Servicio',
    palabrasClave: ['sin gas', 'falta de gas', 'no tengo gas', 'sin suministro', 'corte de gas', 'se corto el gas', 'no hay gas', 'falta suministro'],
    respuestas: [
      'Para reportar falta de suministro comunicate al 3385-480200. Antes, revisá si hay un aviso en /estado-del-servicio: puede ser un corte programado o una tarea en tu zona.',
      'Si te quedaste sin gas llamá al 3385-480200 (falta de suministro). Podés ver si hay cortes o trabajos en tu zona en /estado-del-servicio.',
    ],
  },
  {
    question: '¿Hay cortes programados?',
    category: 'Servicio',
    palabrasClave: ['cortes programados', 'aviso de corte', 'trabajos programados', 'estado del servicio', 'hay cortes', 'mantenimiento', 'obras corte'],
    respuestas: [
      'Publicamos los cortes programados y avisos por zona en /estado-del-servicio, ordenados por estado y fecha. Ahí ves si hay algo en tu localidad.',
      'Mirá /estado-del-servicio: están los avisos en curso y los cortes programados, con zona y horarios estimados.',
    ],
  },
  {
    question: 'Obras y redes de gas',
    category: 'Información',
    palabrasClave: ['obras', 'redes', 'red de gas', 'llega el gas a mi localidad', 'ampliacion de red', 'infraestructura', 'gasoducto', 'extension de red', 'obras y redes'],
    respuestas: [
      'Transgas desarrolla redes de distribución de gas natural y trabaja con cooperativas y comunidades. Podés conocer más en la sección Obras y redes de la home (/#infraestructura) o consultar tu caso en /contacto.',
      'Si querés saber si la red llega a tu localidad o proyectar una obra, escribinos desde /contacto y el equipo te asesora. Más información en /#infraestructura.',
    ],
  },

  // ───────── Emergencias y seguridad ─────────
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
    question: 'Monóxido de carbono',
    category: 'Seguridad',
    palabrasClave: ['monoxido de carbono', 'monoxido', 'intoxicacion', 'mareos gas', 'sintomas monoxido', 'calefon', 'estufa sin tiro', 'artefacto'],
    respuestas: [
      'El monóxido de carbono no tiene olor ni color. Para prevenirlo: ventilá los ambientes, no uses hornallas ni hornos para calefaccionar y revisá tus artefactos con un gasista matriculado. Si hay dolor de cabeza, mareos o náuseas, salí al aire libre y buscá atención médica. Más info: /seguridad/monoxido-de-carbono',
      'Se previene con buena ventilación y artefactos revisados por un gasista matriculado (/profesionales/gasistas-matriculados). Si sospechás una intoxicación, salí a tomar aire y pedí ayuda médica de inmediato. Guía completa: /seguridad/monoxido-de-carbono',
    ],
  },
  {
    question: '¿Cómo encuentro un gasista matriculado?',
    category: 'Seguridad',
    palabrasClave: ['gasista', 'gasista matriculado', 'matricula gasista', 'necesito un gasista', 'instalador matriculado', 'revisar artefactos', 'revision de gas'],
    respuestas: [
      'Podés consultar el listado de gasistas matriculados, con matrícula, localidad y contacto, en /profesionales/gasistas-matriculados.',
      'Los gasistas habilitados están en /profesionales/gasistas-matriculados. Siempre elegí un profesional matriculado para instalaciones y revisiones.',
    ],
  },
  {
    question: 'Uso eficiente del gas',
    category: 'Seguridad',
    palabrasClave: ['uso eficiente', 'ahorrar gas', 'consumir menos gas', 'ahorro de gas', 'consejos de ahorro', 'calefaccion eficiente', 'gastar menos'],
    respuestas: [
      'Algunos consejos: evitá fugas de calor (burletes y cierres), mantené los artefactos limpios y revisados, regulá la calefacción y aprovechá el sol. Todo el detalle está en /seguridad/uso-eficiente.',
      'Usar el gas de forma eficiente baja tu factura y cuida el ambiente. Tenés consejos concretos en /seguridad/uso-eficiente.',
    ],
  },
  {
    question: 'Prevención de daños a la red',
    category: 'Seguridad',
    palabrasClave: ['prevencion de danos', 'dano a la red', 'excavar', 'obra en la via publica', 'caneria enterrada', 'excavadora', 'antes de excavar', 'rotura de caneria'],
    respuestas: [
      'Antes de excavar o hacer obras, consultá por la ubicación de las redes de gas para evitar daños y accidentes. Todo el plan de prevención está en /seguridad/prevencion-de-danos.',
      'Si vas a hacer una excavación, avisá antes: dañar una cañería de gas es muy peligroso. Mirá las recomendaciones en /seguridad/prevencion-de-danos. Si ya hubo un daño, llamá al 0800-777-8427.',
    ],
  },

  // ───────── Tarifas ─────────
  {
    question: '¿Dónde veo las tarifas?',
    category: 'Tarifas',
    palabrasClave: ['tarifa', 'cuadro tarifario', 'cuanto cuesta el gas', 'costo del gas', 'tarifa vigente', 'aumento de tarifa', 'precio del gas'],
    respuestas: [
      'El cuadro tarifario vigente (PDF) y las categorías están en /tarifas. Publicamos el documento oficial para que nunca veas importes desactualizados.',
      'Podés descargar el cuadro tarifario oficial en /tarifas. Ahí también ves las categorías residenciales y SGP.',
    ],
  },
  {
    question: '¿En qué categoría estoy?',
    category: 'Tarifas',
    palabrasClave: ['categoria', 'categorias', 'categoria residencial', 'r1', 'r2', 'r3', 'sgp', 'en que categoria estoy', 'categoria de usuario'],
    respuestas: [
      'Las categorías (residenciales R1 a R3 y SGP) dependen del consumo anual. Las explicamos en /tarifas/categorias. Tu categoría figura también en tu factura.',
      'Tu categoría se define según tu consumo anual. Mirá la explicación en /tarifas/categorias y el detalle en el cuadro tarifario de /tarifas.',
    ],
  },
  {
    question: '¿Qué es la tarifa social y cómo la tramito?',
    category: 'Tarifas',
    palabrasClave: ['tarifa social', 'subsidio', 'beneficio', 'descuento gas', 'requisitos tarifa social', 'rase'],
    respuestas: [
      'La tarifa social es un beneficio para quienes cumplen ciertos requisitos. Te contamos quiénes pueden acceder y cómo se tramita en /tarifas/tarifa-social.',
      'Los requisitos y el paso a paso de la tarifa social están en /tarifas/tarifa-social. Si te queda alguna duda, escribinos desde /contacto.',
    ],
  },
  {
    question: 'Régimen de zona fría',
    category: 'Tarifas',
    palabrasClave: ['zona fria', 'regimen zona fria', 'ley zona fria', 'beneficio zona fria'],
    respuestas: [
      'El régimen de zona fría es una normativa que alcanza a distintas localidades. Tenés la información en /tarifas/zona-fria.',
      'Para saber cómo te afecta el régimen de zona fría, mirá /tarifas/zona-fria.',
    ],
  },

  // ───────── Información ─────────
  {
    question: 'Soy inquilino, ¿qué tengo que saber?',
    category: 'Información',
    palabrasClave: ['inquilino', 'soy inquilino', 'alquilo', 'alquiler', 'contrato de alquiler', 'titular alquiler'],
    respuestas: [
      'Si alquilás, en /ayuda/inquilinos explicamos cómo manejar el servicio, la titularidad y la documentación. Para cambios de titular usá /autogestion/abm-servicio.',
      'Tenemos una guía para inquilinos en /ayuda/inquilinos. Cualquier trámite sobre el servicio se inicia en /autogestion/abm-servicio.',
    ],
  },
  {
    question: 'Derechos de usuarios y reclamos',
    category: 'Información',
    palabrasClave: ['derechos', 'derechos de usuarios', 'reclamo', 'reclamos', 'quiero reclamar', 'defensa del consumidor', 'queja'],
    respuestas: [
      'Los derechos de los usuarios del servicio están publicados en /usuarios/derechos. Para presentar un reclamo escribinos desde /contacto o llamá al 3385-480021.',
      'Podés consultar tus derechos como usuario en /usuarios/derechos. Si querés hacer un reclamo, usá el formulario de /contacto.',
    ],
  },
  {
    question: 'Cooperativas asociadas',
    category: 'Cooperativas',
    palabrasClave: ['cooperativas', 'cooperativa', 'coop asociada', 'oficina de mi localidad', 'donde atienden', 'centro de atencion', 'italo', 'jovita', 'la cesira', 'mattaldi', 'pueblo italiano', 'serrano', 'viamonte', 'villa valeria'],
    respuestas: [
      'Transgas trabaja con ocho cooperativas asociadas: Ítalo, Jovita, La Cesira, Mattaldi, Pueblo Italiano, Serrano, Viamonte y Villa Valeria. El directorio con datos de cada una está en /cooperativas.',
      'Encontrá la cooperativa de tu localidad (con dirección, teléfono y horario) en /cooperativas.',
    ],
  },
  {
    question: 'Datos de contacto y horario',
    category: 'Contacto',
    palabrasClave: ['contacto', 'telefono', 'telefono de atencion', 'horario', 'horario de atencion', 'direccion', 'donde estan', 'ubicacion', 'oficina', 'mail', 'correo'],
    respuestas: [
      'Atención al cliente: 3385-480021, de lunes a viernes de 07:00 a 14:00 hs. Estamos en Ruta Nacional Nº 7 km 541, General Levalle (Córdoba). También podés escribir desde /contacto.',
      'Nos encontrás en Ruta Nac. Nº 7 km 541, General Levalle. Teléfono 3385-480021 (lunes a viernes, 07:00 a 14:00). Formulario online: /contacto.',
    ],
  },
  {
    question: '¿Quiénes son Transgas?',
    category: 'Información',
    palabrasClave: ['que es transgas', 'quienes son', 'quienes somos', 'sobre transgas', 'quien es transgas'],
    respuestas: [
      'Transgas es una asociación cooperativa que presta el servicio de gas natural en el sur de Córdoba, junto con el desarrollo de redes de distribución y una red de cooperativas asociadas.',
      'Somos la Asoc. Cooperativa Transportadora de Gas del Sur de Cba. Ltda.: servicio de gas natural, infraestructura y trabajo conjunto con cooperativas de la región.',
    ],
  },
  {
    question: 'Noticias y novedades',
    category: 'Información',
    palabrasClave: ['novedades', 'noticias', 'blog', 'comunicados', 'que hay de nuevo'],
    respuestas: [
      'Las novedades, obras y comunicados de Transgas están en /blog.',
      'Podés leer las últimas noticias en /blog.',
    ],
  },
];
