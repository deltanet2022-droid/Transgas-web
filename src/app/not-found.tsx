import Link from 'next/link';

// 404 global de último recurso (fuera del sitio público): simple y sin consultar la base de datos.
export default function NotFound() {
  return (
    <div className="loginwrap">
      <div className="logincard" style={{ textAlign: 'center' }}>
        <h1>No encontramos esa página</h1>
        <p>Puede que el enlace haya cambiado o que la página ya no exista.</p>
        <Link className="btn primary" href="/">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
