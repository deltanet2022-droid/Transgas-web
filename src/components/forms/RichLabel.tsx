import type { ReactNode } from 'react';

/**
 * Convierte "[[texto|/ruta]]" en un enlace (se abre en pestaña nueva para no perder lo que la persona
 * ya completó en el formulario).
 */
export function RichLabel({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[\[(.+?)\|(.+?)\]\]/g;
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)', fontWeight: 700, textDecoration: 'underline' }}>
        {m[1]}
      </a>,
    );
    last = start + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
