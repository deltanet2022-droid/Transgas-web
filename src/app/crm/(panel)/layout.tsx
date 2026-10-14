import type { Metadata } from 'next';
import { Sidebar } from '@/components/crm/Sidebar';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: { default: 'CRM', template: '%s · CRM Transgas' }, robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="crm-shell">
      <Sidebar user={{ email: user.email, name: user.name, role: user.role }} />
      <main className="crm-main">{children}</main>
    </div>
  );
}
