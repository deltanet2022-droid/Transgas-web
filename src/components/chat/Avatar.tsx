import { useId } from 'react';

/** Nombre de la asistente virtual (cambiar acá si se prefiere otro). */
export const ASSISTANT_NAME = 'Lu';

/**
 * Avatar de la asistente virtual: Lu, una llamita celeste amistosa (como la llama del gas natural)
 * que pestañea, mira alrededor, saluda con la mano y tiene destellos a su alrededor. Si `talking`
 * está activo mueve la boca (se usa mientras "escribe" una respuesta).
 * Las animaciones están en motion.css (.lu-*) y se desactivan con prefers-reduced-motion.
 */
export function Avatar({
  size = 48,
  animated = true,
  talking = false,
  className = '',
}: {
  size?: number;
  animated?: boolean;
  talking?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `lu-${name}-${uid}`;
  return (
    <svg
      className={`avatar-svg${animated ? ' av-live' : ''}${talking ? ' is-talking' : ''} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${ASSISTANT_NAME}, asistente virtual de Transgas`}
    >
      <defs>
        <clipPath id={id('clip')}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
        <radialGradient id={id('bg')} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor="#2f86d6" />
          <stop offset="0.6" stopColor="#14508f" />
          <stop offset="1" stopColor="#0b2a4e" />
        </radialGradient>
        <linearGradient id={id('flame')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#c9f4ff" />
          <stop offset="0.45" stopColor="#55c9f0" />
          <stop offset="1" stopColor="#1a8fe3" />
        </linearGradient>
        <radialGradient id={id('belly')} cx="50%" cy="55%" r="55%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('glow')} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7fdcf7" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7fdcf7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('gold')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="1" stopColor="#ffb52e" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${id('clip')})`}>
        <rect width="120" height="120" fill={`url(#${id('bg')})`} />
        <circle className="lu-glow" cx="60" cy="66" r="52" fill={`url(#${id('glow')})`} />

        {/* destellos */}
        <path className="lu-spark s1" d="M20 30 l2.2 5.6 5.6 2.2 -5.6 2.2 -2.2 5.6 -2.2 -5.6 -5.6 -2.2 5.6 -2.2 z" fill="#ffe27a" />
        <path className="lu-spark s2" d="M101 26 l1.7 4.3 4.3 1.7 -4.3 1.7 -1.7 4.3 -1.7 -4.3 -4.3 -1.7 4.3 -1.7 z" fill="#ffffff" />
        <path className="lu-spark s3" d="M102 92 l1.9 4.8 4.8 1.9 -4.8 1.9 -1.9 4.8 -1.9 -4.8 -4.8 -1.9 4.8 -1.9 z" fill="#bff0fd" />
        <circle className="lu-spark s4" cx="16" cy="84" r="2.2" fill="#ffffff" />

        <g className="lu-bob">
          {/* brazo izquierdo (quieto) */}
          <path d="M37 84 Q27 87 25 96" stroke="#3bb7ec" strokeWidth="7.5" strokeLinecap="round" fill="none" />
          <circle cx="25" cy="97" r="4.8" fill="#8fe0fa" />

          {/* cuerpo: llama celeste */}
          <g className="lu-flame">
            <path
              d="M61 9 C64 26 92 40 92 71 C92 93 78 108 60 108 C42 108 28 93 28 71 C28 53 41 45 47 29 C50 37 55 40 58 38 C60 30 58 19 61 9 Z"
              fill={`url(#${id('flame')})`}
            />
            {/* destello del cuerpo y llama dorada del centro */}
            <path d="M40 60 C40 52 45 47 50 44" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="60" cy="88" rx="24" ry="17" fill={`url(#${id('belly')})`} />
            <path className="lu-core" d="M60 91 C57 96 55 98 55 101 A5 5 0 0 0 65 101 C65 98 63 96 60 91 Z" fill={`url(#${id('gold')})`} />

            {/* ojos */}
            <g className="lu-eye">
              <ellipse cx="50" cy="71" rx="6" ry="7" fill="#ffffff" />
              <g className="lu-pupil">
                <ellipse cx="50.5" cy="72" rx="3.7" ry="4.7" fill="#0b2a4e" />
                <circle cx="52" cy="70" r="1.5" fill="#ffffff" />
              </g>
            </g>
            <g className="lu-eye">
              <ellipse cx="70" cy="71" rx="6" ry="7" fill="#ffffff" />
              <g className="lu-pupil">
                <ellipse cx="70.5" cy="72" rx="3.7" ry="4.7" fill="#0b2a4e" />
                <circle cx="72" cy="70" r="1.5" fill="#ffffff" />
              </g>
            </g>

            {/* cejitas, mejillas y boca */}
            <path d="M44 61 Q50 57.5 56 60.5" stroke="#0b2a4e" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M64 60.5 Q70 57.5 76 61" stroke="#0b2a4e" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            <ellipse cx="41" cy="81" rx="5.2" ry="3.4" fill="#ff8fa3" opacity="0.55" />
            <ellipse cx="79" cy="81" rx="5.2" ry="3.4" fill="#ff8fa3" opacity="0.55" />
            <path className="lu-smile" d="M53 80.5 Q60 88.5 67 80.5" stroke="#0b2a4e" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <g className="lu-mouth">
              <path d="M53.5 80 Q60 80.5 66.5 80 Q65 90 60 90 Q55 90 53.5 80 Z" fill="#0b2a4e" />
              <ellipse cx="60" cy="86.6" rx="3.4" ry="2" fill="#ff7a90" />
            </g>
          </g>

          {/* brazo derecho: saluda */}
          <g className="lu-wave">
            <path d="M83 84 Q95 82 98 70" stroke="#3bb7ec" strokeWidth="7.5" strokeLinecap="round" fill="none" />
            <circle cx="98.5" cy="68" r="5" fill="#8fe0fa" />
          </g>
        </g>
      </g>
    </svg>
  );
}
