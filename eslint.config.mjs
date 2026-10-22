import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    rules: {
      // Reglas nuevas de React 19 pensadas para el compilador de React: marcan patrones que acá son correctos
      // (hora actual en páginas del servidor, cerrar un menú al cambiar de ruta, descargas de CSV con <a>).
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];

export default config;
