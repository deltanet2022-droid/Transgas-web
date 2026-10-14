import Link from 'next/link';

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: { href: string; label: string } | React.ReactNode }) {
  return (
    <div className="crm-top">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action && typeof action === 'object' && 'href' in action ? (
        <Link className="cbtn p" href={action.href}>
          {action.label}
        </Link>
      ) : (
        action
      )}
    </div>
  );
}

export function BackLink({ href, children = 'Volver' }: { href: string; children?: React.ReactNode }) {
  return (
    <p style={{ marginBottom: 12 }}>
      <Link href={href} style={{ color: 'var(--b)', fontWeight: 700, fontSize: '.84rem' }}>
        ← {children}
      </Link>
    </p>
  );
}

export function Badge({ tone, children }: { tone?: 'nuevo' | 'gest' | 'ok' | 'red' | 'draft' | 'pub' | 'prog' | 'warn'; children: React.ReactNode }) {
  return <span className={`b${tone ? ` ${tone}` : ''}`}>{children}</span>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'var(--muted)', padding: '22px 4px', fontSize: '.9rem' }}>{children}</p>;
}

export function Field({ label, htmlFor, help, children }: { label: string; htmlFor?: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="l" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {help && <p className="help">{help}</p>}
    </div>
  );
}

export function ConversationBadges({ c }: { c: { matchedFaq: boolean; whatsappHandoff: boolean; emergency: boolean } }) {
  return (
    <span style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap' }}>
      {c.emergency && <Badge tone="red">Emergencia</Badge>}
      {c.matchedFaq && <Badge tone="ok">Respondió FAQ</Badge>}
      {c.whatsappHandoff && <Badge tone="gest">Derivó a WhatsApp</Badge>}
      {!c.matchedFaq && !c.whatsappHandoff && !c.emergency && <Badge>Sin respuesta</Badge>}
    </span>
  );
}
