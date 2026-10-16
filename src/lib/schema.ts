import type { Cooperative, News } from '@prisma/client';
import { absUrl, GEO, intlPhone } from '@/lib/seo';
import { site } from '@/lib/site';
import type { SiteSettings } from '@/lib/settings';

/** Datos estructurados (schema.org / JSON-LD) para buscadores y asistentes de IA. */

const ORG_ID = () => `${absUrl('/')}#organization`;

export function organizationGraph(s: SiteSettings, coops: Pick<Cooperative, 'name'>[]) {
  const localities = Array.from(new Set([GEO.place, ...coops.map((c) => c.name)]));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': ORG_ID(),
        name: 'Transgas',
        alternateName: 'Grupo Transgas',
        legalName: site.legalName,
        description: `Transgas distribuye gas natural en el ${GEO.areaLabel} y desarrolla redes de gas junto a una red de cooperativas asociadas. Atención al usuario, autogestión online, emergencias las 24 horas e información de seguridad.`,
        url: absUrl('/'),
        logo: { '@type': 'ImageObject', url: absUrl('/brand/logo-transgas.png'), width: 350, height: 100 },
        image: [absUrl('/opengraph-image.png'), absUrl('/images/hero-gnc.jpg')],
        telephone: intlPhone(s.attentionPhone),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ruta Nacional Nº 7 km 541',
          addressLocality: GEO.place,
          addressRegion: GEO.regionName,
          addressCountry: GEO.country,
        },
        geo: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng },
        hasMap: site.mapsLink,
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '14:00' },
        ],
        areaServed: localities.map((name) => ({ '@type': 'City', name, containedInPlace: { '@type': 'AdministrativeArea', name: GEO.regionName } })),
        knowsAbout: ['Gas natural', 'Distribución de gas natural', 'Redes de gas', 'Seguridad en instalaciones de gas', 'Tarifas de gas natural'],
        contactPoint: [
          { '@type': 'ContactPoint', contactType: 'customer service', telephone: intlPhone(s.attentionPhone), areaServed: GEO.country, availableLanguage: 'es', hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '14:00' } },
          { '@type': 'ContactPoint', contactType: 'emergency', telephone: intlPhone(s.emergencyPhone), areaServed: GEO.country, availableLanguage: 'es', hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' } },
          { '@type': 'ContactPoint', contactType: 'technical support', telephone: intlPhone(s.supplyPhone), areaServed: GEO.country, availableLanguage: 'es' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${absUrl('/')}#website`,
        url: absUrl('/'),
        name: 'Transgas',
        inLanguage: 'es-AR',
        publisher: { '@id': ORG_ID() },
      },
    ],
  };
}

export function breadcrumbList(crumbs: { label: string; href?: string }[]) {
  const items = [{ label: 'Inicio', href: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absUrl(c.href) } : {}),
    })),
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'es-AR',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
}

export function newsArticle(n: Pick<News, 'title' | 'slug' | 'excerpt' | 'coverImageUrl' | 'publishedAt' | 'updatedAt'>) {
  const url = absUrl(`/blog/${n.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: n.title.slice(0, 110),
    description: n.excerpt ?? undefined,
    image: n.coverImageUrl ? [n.coverImageUrl.startsWith('http') ? n.coverImageUrl : absUrl(n.coverImageUrl)] : [absUrl('/opengraph-image.png')],
    datePublished: n.publishedAt?.toISOString(),
    dateModified: (n.updatedAt ?? n.publishedAt)?.toISOString(),
    inLanguage: 'es-AR',
    author: { '@type': 'Organization', name: 'Transgas', url: absUrl('/') },
    publisher: { '@type': 'Organization', name: 'Transgas', logo: { '@type': 'ImageObject', url: absUrl('/brand/logo-transgas.png') } },
  };
}

export function cooperativesList(coops: Cooperative[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cooperativas asociadas a Transgas',
    itemListElement: coops.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Organization',
        name: c.legalName || c.name,
        alternateName: c.name,
        ...(c.address ? { address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: c.name, addressRegion: GEO.regionName, addressCountry: GEO.country } } : {}),
        ...(c.phone ? { telephone: c.phone.split('/')[0].trim() } : {}),
        ...(c.email ? { email: c.email } : {}),
        parentOrganization: { '@id': ORG_ID() },
      },
    })),
  };
}
