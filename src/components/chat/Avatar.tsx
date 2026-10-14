/** Nombre de la asistente virtual (cambiar acá si se prefiere otro). */
export const ASSISTANT_NAME = 'Lu';

/**
 * Avatar ilustrado de la asistente virtual: persona sonriente con auricular, pestañeo y
 * movimiento suave de cabeza. Las animaciones están en globals.css (.av-*) y se desactivan
 * con prefers-reduced-motion.
 */
export function Avatar({ size = 48, animated = true, className = '' }: { size?: number; animated?: boolean; className?: string }) {
  return (
    <svg
      className={`avatar-svg${animated ? ' av-live' : ''} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${ASSISTANT_NAME}, asistente virtual de Transgas`}
    >
      <defs>
        <clipPath id="av-clip">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
        <linearGradient id="av-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fdcf7" />
          <stop offset="1" stopColor="#1279c4" />
        </linearGradient>
        <linearGradient id="av-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d0ae" />
          <stop offset="1" stopColor="#eab88f" />
        </linearGradient>
      </defs>
      <g clipPath="url(#av-clip)">
        <rect width="120" height="120" fill="url(#av-bg)" />
        <circle cx="96" cy="24" r="22" fill="#fff" opacity=".12" />
        <g className="av-body">
          {/* torso: blazer azul marino con camisa */}
          <path d="M8 122 C10 94 34 86 60 86 C86 86 110 94 112 122 Z" fill="#0b2a4e" />
          <path d="M47 87 L60 108 L73 87 Z" fill="#ffffff" />
          <path d="M44 88 L60 112 L42 122 L30 122 Z" fill="#12395f" />
          <path d="M76 88 L60 112 L78 122 L90 122 Z" fill="#12395f" />
          {/* pin con llama dorada */}
          <path d="M84 102 C82 106 80.5 107.5 80.5 110 A3.5 3.5 0 0 0 87.5 110 C87.5 107.5 86 106 84 102 Z" fill="#f7c21f" />
          <g className="av-head">
            {/* pelo (parte de atrás) */}
            <path d="M30 60 C27 30 46 14 62 14 C84 14 95 32 90 62 C92 78 85 88 78 90 L42 90 C35 88 28 78 30 60 Z" fill="#3a2a22" />
            {/* cuello y cara */}
            <rect x="51" y="72" width="18" height="18" rx="7" fill="#e3a97f" />
            <ellipse cx="60" cy="58" rx="24" ry="27" fill="url(#av-skin)" />
            {/* flequillo */}
            <path d="M35 54 C34 34 50 26 62 27 C78 27 87 38 85 54 C79 45 69 40 58 40 C48 40 40 45 35 54 Z" fill="#3a2a22" />
            {/* cejas */}
            <path d="M43 50 Q49 46.5 55 49.5" stroke="#3a2a22" strokeWidth="2.3" strokeLinecap="round" fill="none" />
            <path d="M65 49.5 Q71 46.5 77 50" stroke="#3a2a22" strokeWidth="2.3" strokeLinecap="round" fill="none" />
            {/* ojos */}
            <g className="av-eye">
              <ellipse cx="50" cy="59" rx="3.4" ry="4.2" fill="#2a1d17" />
              <circle cx="51.2" cy="57.4" r="1.2" fill="#fff" />
            </g>
            <g className="av-eye">
              <ellipse cx="70" cy="59" rx="3.4" ry="4.2" fill="#2a1d17" />
              <circle cx="71.2" cy="57.4" r="1.2" fill="#fff" />
            </g>
            {/* mejillas y sonrisa */}
            <circle cx="42.5" cy="68.5" r="4.5" fill="#f08b86" opacity=".38" />
            <circle cx="77.5" cy="68.5" r="4.5" fill="#f08b86" opacity=".38" />
            <path d="M49.5 70 Q60 82 70.5 70 Q60 74 49.5 70 Z" fill="#fff" stroke="#b5483a" strokeWidth="2.2" strokeLinejoin="round" />
            {/* auricular con micrófono */}
            <path d="M31.5 58 C30 28 90 28 88.5 58" stroke="#0b2a4e" strokeWidth="4.2" fill="none" strokeLinecap="round" />
            <rect x="26.5" y="52" width="9" height="17" rx="4.5" fill="#0b2a4e" />
            <rect x="84.5" y="52" width="9" height="17" rx="4.5" fill="#0b2a4e" />
            <circle cx="31" cy="60.5" r="2.2" fill="#54c6ed" />
            <circle cx="89" cy="60.5" r="2.2" fill="#54c6ed" />
            <path d="M89 68 C92 80 84 84 71 81.5" stroke="#0b2a4e" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <ellipse cx="69" cy="81.2" rx="4.2" ry="3" fill="#0b2a4e" />
          </g>
        </g>
      </g>
    </svg>
  );
}
