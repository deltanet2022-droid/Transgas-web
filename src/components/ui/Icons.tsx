import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true } as const;
const stroke = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const FlameIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2C9 7 6 9.5 6 13.5A6 6 0 0 0 18 13.5C18 9.5 15 7 12 2Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.5 15a2.5 2.5 0 0 0 5 0" stroke="#54C6ED" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const ReceiptIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2.5" {...stroke} />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4.5" {...stroke} />
  </svg>
);
export const BuildingIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20h16M6 20V9h12v11M8 9V5h8v4M9.5 12h1M13.5 12h1M9.5 15.5h1M13.5 15.5h1" {...stroke} />
  </svg>
);
export const ChartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 19V5M6 19h13M10 15l3-4 3 2 3-6" {...stroke} />
  </svg>
);
export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 3.6v4.8c0 4.8-3 8-8 9.6-5-1.6-8-4.8-8-9.6V6.6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 8v4m0 3h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s6-6.1 6-11A6 6 0 0 0 6 10c0 4.9 6 11 6 11Z" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 3H4.8A1.8 1.8 0 0 0 3 4.8C3 13.75 10.25 21 19.2 21A1.8 1.8 0 0 0 21 19.2V17l-4.8-2-2.4 2.9a14.5 14.5 0 0 1-6.6-5.9L10.1 9.6 7 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const MailIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.8" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
export const AlertIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 21 19H3L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 9v4m0 3h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);
export const ListIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const BotIcon = ({ light, ...p }: P & { light?: boolean }) => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden {...p}>
    <rect x="16" y="22" width="32" height="26" rx="10" fill={light ? '#fff' : '#0B6FB8'} />
    {light && <rect x="24" y="10" width="16" height="14" rx="7" fill="#fff" />}
    <circle cx="25" cy="33" r="3" fill={light ? '#0B2A4E' : '#fff'} />
    <circle cx="39" cy="33" r="3" fill={light ? '#0B2A4E' : '#fff'} />
    <path d="M26 41q6 4 12 0" stroke={light ? '#0B2A4E' : '#fff'} strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
