// Iconos SVG inline, para poder cambiar el color con CSS. Se usan en src/components/Player.jsx
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const Play = (p) => (
  <svg {...base} {...p}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const Pause = (p) => (
  <svg {...base} {...p}>
    <rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const Prev = (p) => (
  <svg {...base} {...p}>
    <path d="M18 5.5v13L9 12z" fill="currentColor" stroke="none" />
    <rect x="5" y="5.5" width="2.2" height="13" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const Next = (p) => (
  <svg {...base} {...p}>
    <path d="M6 5.5v13L15 12z" fill="currentColor" stroke="none" />
    <rect x="16.8" y="5.5" width="2.2" height="13" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const Shuffle = (p) => (
  <svg {...base} {...p}>
    <path d="M16 4l3 3-3 3" />
    <path d="M16 14l3 3-3 3" />
    <path d="M5 7h3.5c1.5 0 2.3.9 3.2 2.2l2.6 4.1c.9 1.3 1.7 2.2 3.2 2.2H19" />
    <path d="M5 17h3.5c1.5 0 2.3-.9 3.2-2.2" />
    <path d="M14.8 9.3c.9-1.4 1.7-2.3 3.2-2.3H19" />
  </svg>
);

export const Repeat = (p) => (
  <svg {...base} {...p}>
    <path d="M17 2.5l3 3-3 3" />
    <path d="M4 12V9.5A4 4 0 018 5.5h12" />
    <path d="M7 21.5l-3-3 3-3" />
    <path d="M20 12v2.5a4 4 0 01-4 4H4" />
  </svg>
);

export const RepeatOne = (p) => (
  <svg {...base} {...p}>
    <path d="M17 2.5l3 3-3 3" />
    <path d="M4 12V9.5A4 4 0 018 5.5h12" />
    <path d="M7 21.5l-3-3 3-3" />
    <path d="M20 12v2.5a4 4 0 01-4 4H4" />
    <path d="M11.2 10.4l1.4-.9v5" strokeWidth="1.6" />
  </svg>
);

export const Volume = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4z" fill="currentColor" stroke="none" />
    <path d="M15.5 9.2a4 4 0 010 5.6" />
    <path d="M18 6.8a7.5 7.5 0 010 10.4" />
  </svg>
);

export const VolumeMuted = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4z" fill="currentColor" stroke="none" />
    <path d="M16 9.5l5 5" />
    <path d="M21 9.5l-5 5" />
  </svg>
);

export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.1M12 19.3v2.1M4.4 4.4l1.5 1.5M18.1 18.1l1.5 1.5M2.6 12h2.1M19.3 12h2.1M4.4 19.6l1.5-1.5M18.1 5.9l1.5-1.5" />
  </svg>
);

export const Moon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 13.4A8 8 0 1110.6 4a6.4 6.4 0 009.4 9.4z" />
  </svg>
);
