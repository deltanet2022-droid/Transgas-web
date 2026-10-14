// Datos reales entregados por Transgas (info-cooperativas.txt y gasistas-matriculados.txt).
// Se cargan con `npm run db:seed` y después se mantienen desde el CRM (agregar, editar, eliminar).

export interface SeedCoop {
  name: string; // localidad (clave para el seed y para el chatbot)
  legalName: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  /** Razones sociales que cargó el seed anterior, para poder actualizarlas sin pisar ediciones del CRM. */
  oldLegalName?: string;
}

const HORARIO = 'Lunes a viernes de 07:00 a 14:00 hs';

export const cooperatives: SeedCoop[] = [
  { name: 'Jovita', legalName: 'Cooperativa Eléctrica Jovita Limitada', oldLegalName: 'Cooperativa Eléctrica Jovita Limitada', address: 'Roque Sáenz Peña 283', phone: '03385-498420 / 498165', email: 'gerencia@celjo.com.ar', schedule: HORARIO },
  { name: 'Ítalo', legalName: 'Cooperativa de Provisión de Electricidad y Obras y Servicios Públicos de Ítalo Ltda.', oldLegalName: 'Cooperativa de Provisión de Electricidad y Obras y Servicios Públicos', address: 'Manuel Belgrano 379', phone: '03387-498072', email: 'cespil@coopitalo.com.ar', schedule: HORARIO },
  { name: 'Pueblo Italiano', legalName: 'Cooperativa de Servicios Públicos de Pueblo Italiano Limitada', oldLegalName: 'Cooperativa de Servicios Públicos', address: 'Santa Fe 193', phone: '03463-497233 / 03463-497079', email: 'cooppuebloitaliano@yahoo.com.ar', schedule: HORARIO },
  { name: 'Serrano', legalName: 'Cooperativa de Servicios Públicos y Sociales de Serrano Limitada', oldLegalName: 'Cooperativa de Servicios Públicos y Sociales', address: 'Oostendorp 99', phone: '03385-495056 / 495176', email: 'coopserranocba@gmail.com', schedule: HORARIO },
  { name: 'La Cesira', legalName: 'Cooperativa de Electricidad, Vivienda y Anexos de La Cesira Limitada', oldLegalName: 'Cooperativa de Electricidad, Vivienda y Anexos', address: 'Lavalle 117', phone: '03382-491243', email: 'administracion@cooplacesira.com.ar', schedule: HORARIO },
  { name: 'Mattaldi', legalName: 'Cooperativa de Electricidad y Servicios Públicos de Mattaldi Ltda.', oldLegalName: 'Cooperativa de Electricidad y Servicios Públicos', address: 'Salta 146', phone: '03583-481500 / 481503', email: 'coopmattaldi@mattaldinet.com.ar', schedule: HORARIO },
  { name: 'Viamonte', legalName: 'Cooperativa Limitada de Consumo Popular de Electricidad y Servicios Anexos de Viamonte', oldLegalName: 'Cooperativa de Consumo Popular de Electricidad y Servicios Anexos', address: 'Córdoba 145', phone: '03463-498065 / 498266', email: 'copel@viamonte-net.com.ar', schedule: HORARIO },
  { name: 'Villa Valeria', legalName: 'Cooperativa de Electricidad Ltda. de Villa Valeria', oldLegalName: 'Cooperativa de Electricidad Ltda.', address: 'Güemes 1137', phone: '03583-497227 / 03583-15647719', email: 'gerencia@villa-valeria.com.ar', schedule: HORARIO },
];

export interface SeedInstaller {
  name: string; // Apellido Nombre (como en el listado original)
  license: string;
  address?: string;
  phone?: string;
  locality: string;
}

// Se unificó un duplicado del listado original (Machado Alejandro, matrícula 9078, figuraba dos veces con
// el teléfono 3385-435368 y 3385-45368: se conservó el de 6 dígitos, igual que el resto de los teléfonos).
export const installers: SeedInstaller[] = [
  { name: 'Bongiovani Martín', license: '6137', address: 'Juan B. Justo', phone: '233-6472216', locality: 'Huinca Renancó' },
  { name: 'Sánchez Nicolás', license: '1000000959', phone: '2302-449047', locality: 'Ítalo' },
  { name: 'Arro Ismael', license: '7843', address: 'Avellaneda 561', phone: '3385-540872', locality: 'Jovita' },
  { name: 'Giovanoni Alejandro', license: '5883', address: 'A. del Valle 402', phone: '3385-590045', locality: 'Jovita' },
  { name: 'Gravino José Santiago', license: '5881', address: 'Ayacucho 470', phone: '3385-683847', locality: 'Jovita' },
  { name: 'Ratto Néstor', license: '5885', address: 'Los Algarrobos 337', phone: '3385-596835', locality: 'Jovita' },
  { name: 'Rodríguez Julio', license: '5837', address: 'Sarmiento 257', phone: '3385-599068', locality: 'Jovita' },
  { name: 'Rojas Teófilo', license: '6012', address: 'Avellaneda 351', phone: '3385-405165', locality: 'Jovita' },
  { name: 'Ros Pablo', license: '6488', address: 'Córdoba 327', phone: '3385-449735', locality: 'Jovita' },
  { name: 'Trejo Julián', license: '8789', address: 'Catamarca 559', phone: '3382-675679', locality: 'La Cesira' },
  { name: 'Morales Ariel', license: '8388', address: 'Sarmiento 614', phone: '3385-464351', locality: 'Laboulaye' },
  { name: 'Bruno David Antonio', license: '8435', address: 'San Esteban 142', phone: '3583-485074', locality: 'Mattaldi' },
  { name: 'Renaudo Néstor', license: '7171', address: 'Ruta Prov. N.º 27', phone: '3583-410046', locality: 'Mattaldi' },
  { name: 'Córdoba José Luis', license: '9206', address: 'Corrientes 527', phone: '3463-462653', locality: 'Pueblo Italiano' },
  { name: 'Maipach José', license: '9137', address: 'Entre Ríos 207', phone: '3463-646608', locality: 'Pueblo Italiano' },
  { name: 'Valdés Ilain Mauricio', license: '6367', address: 'Misiones 336', locality: 'Pueblo Italiano' },
  { name: 'Chiaramello Omar', license: '3327', address: '1.º de Guevara 149', phone: '3581-54191168', locality: 'Río Cuarto' },
  { name: 'Monje Jorge', license: '5794', address: 'Río Colorado 727', phone: '358-5090731', locality: 'Río Cuarto' },
  { name: 'Costa Amadeo', license: '6134', address: 'J. M. Estrada 159', phone: '3385-431200', locality: 'Serrano' },
  { name: 'Fino Ariel', license: '9322', address: 'Maipú y Las Malvinas', phone: '3385-400901', locality: 'Serrano' },
  { name: 'Machado Alejandro', license: '9078', address: 'Pje. José Lerda', phone: '3385-435368', locality: 'Serrano' },
  { name: 'Martínez Washington', license: '1000000120', address: 'Pje. Eva Perón 35', phone: '3385-592220', locality: 'Serrano' },
  { name: 'Rosa Rubén', license: '7865', address: 'Arist. del Valle 45', phone: '358-4280535', locality: 'Villa Valeria' },
  { name: 'Speranza Sergio', license: '1000001105', address: 'San Juan 57', phone: '3463-407554', locality: 'Viamonte' },
];
