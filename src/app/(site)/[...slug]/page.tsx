import { notFound } from 'next/navigation';

/**
 * Cualquier URL que no exista dentro del sitio público cae acá y muestra la 404 con el encabezado,
 * el pie y los teléfonos vigentes (el layout del sitio es dinámico: se arma en cada visita).
 */
export default function CatchAll() {
  notFound();
}
