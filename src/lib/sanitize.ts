import sanitizeHtml from 'sanitize-html';

/** Sanitiza el HTML del editor (noticias y páginas) antes de guardarlo y de mostrarlo. */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'a', 'hr'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: {
      // Solo los enlaces externos se abren en pestaña nueva; los internos (/contacto) navegan normal.
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? '');
        const { target: _t, rel: _r, ...rest } = attribs;
        return { tagName, attribs: external ? { ...rest, target: '_blank', rel: 'noopener noreferrer' } : rest };
      },
    },
  });
}
