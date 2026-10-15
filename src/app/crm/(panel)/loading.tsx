/** Esqueleto que aparece al instante al cambiar de sección en el CRM, mientras llegan los datos. */
export default function PanelLoading() {
  return (
    <div className="crm-skeleton" role="status" aria-label="Cargando">
      <div className="sk sk-title" />
      <div className="sk sk-line" />
      <div className="crm-card">
        <div className="sk sk-row" />
        <div className="sk sk-row" />
        <div className="sk sk-row" />
        <div className="sk sk-row short" />
      </div>
    </div>
  );
}
