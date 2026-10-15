/** Mientras llega la página siguiente se muestra una barra de carga (el encabezado y el pie no se mueven). */
export default function SiteLoading() {
  return (
    <div className="navbar-loading" role="status" aria-label="Cargando">
      <span />
    </div>
  );
}
