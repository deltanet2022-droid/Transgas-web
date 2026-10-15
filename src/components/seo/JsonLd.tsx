/** Inserta datos estructurados (JSON-LD). Se escapa "<" para que el contenido nunca pueda cerrar la etiqueta. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
