/**
 * Foto del sitio en formato moderno (AVIF, ~60% más liviano) con JPG de respaldo para navegadores viejos,
 * y dos tamaños (chico para celulares y grande para pantallas anchas).
 * Los archivos viven en /public/images: <base>.avif / <base>.jpg y <base>-<ancho chico>.avif / .jpg
 */
export function Photo({
  base,
  smallWidth,
  largeWidth,
  height,
  alt,
  sizes,
  priority = false,
}: {
  /** Ruta sin extensión, ej. "/images/about". */
  base: string;
  smallWidth: number;
  largeWidth: number;
  /** Alto de la versión grande (para reservar el espacio y evitar saltos de diseño). */
  height: number;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const avif = `${base}-${smallWidth}.avif ${smallWidth}w, ${base}.avif ${largeWidth}w`;
  const jpg = `${base}-${smallWidth}.jpg ${smallWidth}w, ${base}.jpg ${largeWidth}w`;
  return (
    <picture>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}.jpg`}
        srcSet={jpg}
        sizes={sizes}
        width={largeWidth}
        height={height}
        alt={alt}
        aria-hidden={alt === '' ? true : undefined}
        {...(priority ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
        decoding="async"
      />
    </picture>
  );
}
