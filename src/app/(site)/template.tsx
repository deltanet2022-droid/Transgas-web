/** Se vuelve a montar en cada navegación: da la entrada suave de cada página. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="pagein">{children}</div>;
}
