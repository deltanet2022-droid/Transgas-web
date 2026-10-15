import Link from 'next/link';
import { PageBody, PageHeader } from '@/components/site/PageParts';

export default function SiteNotFound() {
  return (
    <>
      <PageHeader kicker="Error 404" title="No encontramos esa página" sub="Puede que el enlace haya cambiado o que la página ya no exista." />
      <PageBody>
        <div className="actions" style={{ marginTop: 0 }}>
          <Link className="btn primary" href="/">
            Ir al inicio
          </Link>
          <Link className="btn soft" href="/contacto">
            Contacto
          </Link>
        </div>
      </PageBody>
    </>
  );
}
