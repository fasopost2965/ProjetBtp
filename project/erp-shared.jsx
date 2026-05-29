/* global React */
// =============================================================================
// ERP — Shared design primitives
// Palette terre marocaine — Atlas·BTP
// =============================================================================

const TOKENS = {
  bg: '#f6f3ee',
  bgWarm: '#efe9df',
  paper: '#ffffff',
  ink: '#1a1814',
  ink2: '#46423b',
  ink3: '#8a8378',
  ink4: '#bdb5a6',
  line: '#e4ddd1',
  line2: '#d6cebf',
  ocre: 'oklch(0.62 0.12 50)',
  ocreDeep: 'oklch(0.50 0.13 45)',
  ocreSoft: 'oklch(0.94 0.04 70)',
  green: 'oklch(0.55 0.08 150)',
  greenSoft: 'oklch(0.95 0.04 150)',
  red: 'oklch(0.55 0.18 25)',
  redSoft: 'oklch(0.95 0.04 25)',
  amber: 'oklch(0.72 0.13 75)',
  amberSoft: 'oklch(0.95 0.05 80)',
  blue: 'oklch(0.50 0.10 240)',
  blueSoft: 'oklch(0.94 0.03 240)',
};

// -----------------------------------------------------------------------------
// Icons — minimal stroke set, kept hand-drawn feel
// -----------------------------------------------------------------------------
const Icon = ({ name, size = 16, stroke = 'currentColor', strokeWidth = 1.5 }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>,
    sites: <><path d="M3 21h18" /><path d="M5 21V9l5-4 5 4v12" /><path d="M15 21V13h4v8" /><path d="M8 13h2M8 17h2" /></>,
    purchase: <><path d="M3 5h2l2.5 11h10L20 8H6" /><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></>,
    subcontract: <><circle cx="8" cy="9" r="3" /><circle cx="17" cy="13" r="2.5" /><path d="M2 20c0-3 2.5-5 6-5s6 2 6 5" /><path d="M13 20c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    money: <><rect x="2" y="6" width="20" height="12" rx="1" /><circle cx="12" cy="12" r="3" /><path d="M5 9v6M19 9v6" /></>,
    invoice: <><path d="M5 3h11l3 3v15H5z" /><path d="M16 3v3h3" /><path d="M8 11h8M8 15h8M8 19h5" /></>,
    folder: <><path d="M3 6a1 1 0 011-1h5l2 2h9a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z" /></>,
    bell: <><path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 21a2 2 0 004 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    chevronDown: <><path d="m6 9 6 6 6-6" /></>,
    chevronRight: <><path d="m9 6 6 6-6 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <><path d="M5 12l5 5 9-11" /></>,
    x: <><path d="M5 5l14 14M19 5L5 19" /></>,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7" /></>,
    arrowDown: <><path d="M12 5v14M5 12l7 7 7-7" /></>,
    arrowRight: <><path d="M5 12h14M13 5l7 7-7 7" /></>,
    truck: <><path d="M1 17V5h13v12" /><path d="M14 9h4l3 3v5h-7" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    helmet: <><path d="M4 17c0-5 3.5-9 8-9s8 4 8 9" /><path d="M3 17h18v2H3z" /><path d="M12 8V5" /></>,
    doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /></>,
    pin: <><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
    warning: <><path d="M12 3 1 21h22z" /><path d="M12 10v5M12 18v.5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></>,
    logout: <><path d="M10 17l-5-5 5-5" /><path d="M5 12h12" /><path d="M14 4h5v16h-5" /></>,
    box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
    wrench: <><path d="M15.5 8.5a4 4 0 01-5.2 5.2L5 19l-.5-.5L4 18l4.3-5.3a4 4 0 015.2-5.2l-2.3 2.3 1.5 1.5 2.3-2.3z" /></>,
    shield: <><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" /></>,
    alert: <><path d="M12 3 1 21h22z" /><path d="M12 10v5M12 18v.5" /></>,
    gauge: <><path d="M5 18a9 9 0 1114 0" /><path d="M12 18l4-5" /><circle cx="12" cy="18" r="1.4" /></>,
    refresh: <><path d="M20 12a8 8 0 10-2.3 5.6" /><path d="M20 6v5h-5" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

// -----------------------------------------------------------------------------
// Logo
// -----------------------------------------------------------------------------
const Logo = ({ tone = 'ink', compact }) => {
  const color = tone === 'ink' ? TOKENS.ink : TOKENS.bg;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width="22" height="22" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="2" y="14" width="10" height="12" fill={color} />
        <rect x="14" y="8" width="8" height="18" fill={color} />
        <rect x="6" y="4" width="4" height="8" fill={TOKENS.ocre} />
      </svg>
      {!compact && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 13, color, letterSpacing: '-0.01em' }}>
            ATLAS<span style={{ color: TOKENS.ocre }}>·</span>BTP
          </span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3, marginTop: 3, letterSpacing: '0.08em' }}>
            ERP / CASABLANCA
          </span>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Pill / status badges
// -----------------------------------------------------------------------------
const Pill = ({ children, tone = 'neutral', dot, mono }) => {
  const tones = {
    neutral: { bg: TOKENS.bgWarm, fg: TOKENS.ink2, dot: TOKENS.ink3 },
    ocre:    { bg: TOKENS.ocreSoft, fg: TOKENS.ocreDeep, dot: TOKENS.ocre },
    green:   { bg: TOKENS.greenSoft, fg: TOKENS.green, dot: TOKENS.green },
    red:     { bg: TOKENS.redSoft, fg: TOKENS.red, dot: TOKENS.red },
    amber:   { bg: TOKENS.amberSoft, fg: 'oklch(0.45 0.10 75)', dot: TOKENS.amber },
    blue:    { bg: TOKENS.blueSoft, fg: TOKENS.blue, dot: TOKENS.blue },
    ink:     { bg: TOKENS.ink, fg: TOKENS.bg, dot: TOKENS.ocre },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 8px', borderRadius: 4,
      background: t.bg, color: t.fg,
      fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans',
      fontSize: 11, fontWeight: mono ? 400 : 500,
      letterSpacing: mono ? '0.04em' : '0',
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }} />}
      {children}
    </span>
  );
};

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------
const Card = ({ children, padding = 20, style, hoverable, delay = 0, onClick }) => (
  <div
    onClick={onClick}
    className={`erp-card erp-fade-in${hoverable ? ' hoverable' : ''}`}
    style={{
      background: TOKENS.paper,
      border: `1px solid ${TOKENS.line}`,
      borderRadius: 8,
      padding,
      cursor: onClick ? 'pointer' : 'default',
      animationDelay: delay + 'ms',
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHead = ({ eyebrow, title, right, style }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, ...style }}>
    <div>
      {eyebrow && (
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>
          {eyebrow}
        </div>
      )}
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: TOKENS.ink, letterSpacing: '-0.01em' }}>
        {title}
      </div>
    </div>
    {right}
  </div>
);

// -----------------------------------------------------------------------------
// Progress bar
// -----------------------------------------------------------------------------
const Progress = ({ value, target, tone = 'ocre', height = 6, showLabel }) => {
  const pct = Math.min(100, Math.max(0, value));
  const tgt = target != null ? Math.min(100, Math.max(0, target)) : null;
  const colors = {
    ocre: TOKENS.ocre, ink: TOKENS.ink, green: TOKENS.green, red: TOKENS.red, amber: TOKENS.amber,
  };
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        height, width: '100%',
        background: TOKENS.bgWarm,
        borderRadius: height,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div className="erp-progress-fill" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: colors[tone],
        }} />
        {tgt != null && (
          <div style={{
            position: 'absolute', top: -2, bottom: -2,
            left: `${tgt}%`, width: 2,
            background: TOKENS.ink,
          }} />
        )}
      </div>
      {showLabel && (
        <div style={{ position: 'absolute', right: 0, top: -18, fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2 }}>
          {pct.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------------
const Button = ({ children, variant = 'default', size = 'md', icon, iconRight, onClick, style }) => {
  const sizes = {
    sm: { h: 28, px: 10, fs: 12, gap: 6 },
    md: { h: 34, px: 12, fs: 13, gap: 7 },
    lg: { h: 42, px: 16, fs: 14, gap: 8 },
  };
  const variants = {
    primary: { bg: TOKENS.ink, fg: TOKENS.bg, border: TOKENS.ink },
    default: { bg: TOKENS.paper, fg: TOKENS.ink, border: TOKENS.line2 },
    ghost:   { bg: 'transparent', fg: TOKENS.ink2, border: 'transparent' },
    ocre:    { bg: TOKENS.ocreSoft, fg: TOKENS.ocreDeep, border: 'transparent' },
  };
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: `0 ${s.px}px`,
      background: v.bg, color: v.fg,
      border: `1px solid ${v.border}`, borderRadius: 6,
      fontFamily: 'IBM Plex Sans', fontWeight: 500, fontSize: s.fs,
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      cursor: 'pointer', whiteSpace: 'nowrap',
      letterSpacing: '-0.005em',
      ...style,
    }}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
};

// -----------------------------------------------------------------------------
// Stat block — large KPI
// -----------------------------------------------------------------------------
const Stat = ({ label, value, unit, delta, deltaLabel, tone, sub }) => {
  const deltaTone = delta == null ? null : (delta > 0 ? 'green' : delta < 0 ? 'red' : 'neutral');
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, color: tone === 'ocre' ? TOKENS.ocreDeep : TOKENS.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink3 }}>{unit}</span>}
      </div>
      {(delta != null || sub) && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: TOKENS.ink2 }}>
          {delta != null && (
            <Pill tone={deltaTone} mono>
              {delta > 0 ? '+' : ''}{delta}%
            </Pill>
          )}
          {(deltaLabel || sub) && <span style={{ color: TOKENS.ink3 }}>{deltaLabel || sub}</span>}
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Tiny sparkline (SVG)
// -----------------------------------------------------------------------------
const Sparkline = ({ data, width = 120, height = 32, color, fill }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - 2 - ((v - min) / range) * (height - 4)]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const fillD = `${d} L${width} ${height} L0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && <path d={fillD} fill={fill} />}
      <path d={d} fill="none" stroke={color || TOKENS.ocre} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// Money / number formatters
// -----------------------------------------------------------------------------
const fmtMAD = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1e6) return (n / 1e6).toFixed(2).replace('.', ',') + ' M';
  if (abs >= 1e3) return (n / 1e3).toFixed(0) + ' k';
  return n.toLocaleString('fr-FR');
};

Object.assign(window, {
  TOKENS, Icon, Logo, Pill, Card, CardHead, Progress, Button, Stat, Sparkline, fmtMAD,
});
