/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, Sparkline, fmtMAD */
// =============================================================================
// ERP — Screen 03 — Fiche chantier (Site detail)
// =============================================================================

// Static data — would come from URL param in real app
const SITE = {
  code: 'CSB-114',
  name: 'Marina Casablanca — Lot 3 résidentiel',
  client: 'Al Omrane Régional Casa-Settat',
  clientContact: 'M. Rachid Bennani · Directeur projets',
  city: 'Casablanca · Marina',
  marche: 'Marché public N° AO-2024/14/AOMR',
  ice: '001789623000054',
  conducteur: 'Karim Benjelloun',
  chef: 'Hicham Alaoui',
  moe: 'Cabinet El Mansouri Architectes',
  bureau: 'BET Atlantis Ingénierie',
  status: 'En cours',
  statusTone: 'green',
  montant: 84_500_000,
  signatureDate: '2024-09-12',
  startDate: '2024-11-04',
  endDate: '2027-03-15',
  physique: 47,
  budget: 52,
  margePrevue: 14.5,
  margeReelle: 12.8,
};

const LOTS = [
  { code: '01', name: 'Terrassements & VRD', budget: 6_200_000, realise: 6_180_000, physique: 100, status: 'Soldé' },
  { code: '02', name: 'Gros œuvre — structure béton armé', budget: 32_400_000, realise: 19_440_000, physique: 60, status: 'En cours' },
  { code: '03', name: 'Étanchéité & isolation', budget: 4_100_000, realise: 1_230_000, physique: 30, status: 'En cours' },
  { code: '04', name: 'Menuiserie aluminium', budget: 8_600_000, realise: 0, physique: 0, status: 'À démarrer' },
  { code: '05', name: 'Électricité courants forts & faibles', budget: 7_200_000, realise: 1_080_000, physique: 15, status: 'En cours' },
  { code: '06', name: 'Plomberie sanitaire & CVC', budget: 6_800_000, realise: 1_020_000, physique: 15, status: 'En cours' },
  { code: '07', name: 'Revêtements & faux plafonds', budget: 9_400_000, realise: 0, physique: 0, status: 'À démarrer' },
  { code: '08', name: 'Peinture & finitions', budget: 5_300_000, realise: 0, physique: 0, status: 'À démarrer' },
  { code: '09', name: 'Espaces verts & voirie finale', budget: 4_500_000, realise: 0, physique: 0, status: 'À démarrer' },
];

const JALONS = [
  { label: 'Notification marché',       date: '12/09/2024', done: true,  tone: 'green' },
  { label: 'Démarrage travaux (OS N°1)', date: '04/11/2024', done: true,  tone: 'green' },
  { label: 'Terrassement achevé',        date: '28/02/2025', done: true,  tone: 'green' },
  { label: 'R+0 dalle haute coulée',     date: '15/05/2025', done: true,  tone: 'green' },
  { label: 'Hors d\'eau / hors d\'air',   date: '10/12/2025', done: true,  tone: 'green' },
  { label: 'Second œuvre — phase 1',     date: '30/06/2026', done: false, tone: 'amber', current: true },
  { label: 'Pré-réception',              date: '15/01/2027', done: false },
  { label: 'Réception définitive',       date: '15/03/2027', done: false },
];

const SST_ACTIVE = [
  { name: 'SOTRAVO Étanchéité SARL', lot: 'Étanchéité', amount: 3_800_000, cnss: 'valid', fiscal: 'valid' },
  { name: 'Électrique du Maroc',     lot: 'Électricité', amount: 6_900_000, cnss: 'expire', fiscal: 'valid' },
  { name: 'Plomberie El Andaloussi', lot: 'Plomberie',   amount: 6_200_000, cnss: 'valid', fiscal: 'valid' },
];

const RECENT_DOCS = [
  { name: 'OS N°23 — Modification phase coffrage R+5', date: '26/05/2026', size: '412 Ko', who: 'MOE', tone: 'ocre' },
  { name: 'PV de chantier — réunion hebdo S21',         date: '23/05/2026', size: '1,2 Mo', who: 'K. Benjelloun' },
  { name: 'Constat trimestriel d\'avancement',          date: '20/05/2026', size: '3,8 Mo', who: 'BET Atlantis' },
  { name: 'Bon de livraison — 28t TOR Sonasid',          date: '19/05/2026', size: '189 Ko', who: 'Magasin' },
];

const TEAM_ACTIVITY = [
  { time: '10:14', who: 'H. Alaoui', what: 'a saisi pointage du jour · 142 ouvriers présents', tone: 'green' },
  { time: '09:42', who: 'H. Alaoui', what: 'a validé situation N°4 — montant brut 6 240 000 DH', tone: 'ocre' },
  { time: '08:58', who: 'K. Benjelloun', what: 'a téléversé PV de réunion S21' },
  { time: 'hier',  who: 'MOE', what: 'a émis OS N°23 — modification phase coffrage R+5' },
  { time: 'hier',  who: 'BMCE Bank', what: 'a confirmé prolongation caution définitive', tone: 'green' },
];

// S-curve data — planned vs actual, 18 months
const S_PLANNED = [0, 1, 3, 6, 10, 16, 23, 31, 40, 49, 58, 66, 73, 80, 86, 92, 97, 100];
const S_ACTUAL  = [0, 1, 3, 5, 9, 13, 19, 26, 33, 41, 47];

// -----------------------------------------------------------------------------
function FicheChantier() {
  const [tab, setTab] = React.useState('overview');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Header />
      <KpiStrip />
      <TabBar tab={tab} onTab={setTab} />
      {tab === 'overview' && <Overview />}
      {tab !== 'overview' && <TabStub label={tab} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function Header() {
  return (
    <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <button onClick={() => window.location.hash = 'sites'} className="erp-pill-btn" style={{
          background: 'transparent', border: 'none', color: TOKENS.ink3,
          fontSize: 12, padding: '4px 8px', marginLeft: -8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
          borderRadius: 4,
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13 }}>←</span>
          Retour aux chantiers
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Pill mono>{SITE.code}</Pill>
          <Pill tone={SITE.statusTone} dot>{SITE.status}</Pill>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, letterSpacing: '0.04em' }}>
            {SITE.marche}
          </span>
        </div>
        <h1 style={{
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: '0 0 8px',
          letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.15,
        }}>
          {SITE.name}
        </h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: TOKENS.ink2, flexWrap: 'wrap' }}>
          <span><Icon name="pin" size={12} stroke={TOKENS.ink3} /> &nbsp;{SITE.city}</span>
          <span style={{ color: TOKENS.line2 }}>·</span>
          <span>Client : <b style={{ color: TOKENS.ink, fontWeight: 500 }}>{SITE.client}</b></span>
          <span style={{ color: TOKENS.line2 }}>·</span>
          <span>Conducteur : <b style={{ color: TOKENS.ink, fontWeight: 500 }}>{SITE.conducteur}</b></span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <Button icon={<Icon name="warning" size={13} stroke={TOKENS.amber} />}>Signaler</Button>
        <Button icon={<Icon name="folder" size={13} stroke={TOKENS.ink2} />}>Documents</Button>
        <Button variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
          Lancer situation N°5
        </Button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function KpiStrip() {
  const remainDays = Math.round((new Date(SITE.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const margeDelta = (SITE.margeReelle - SITE.margePrevue).toFixed(1);
  const items = [
    { label: 'MONTANT MARCHÉ', value: '84,5', unit: 'M DH', sub: 'HT · révisable' },
    { label: 'AVANCEMENT', value: SITE.physique, unit: '%', sub: `${SITE.budget}% prévu · -${SITE.budget - SITE.physique} pts` },
    { label: 'MARGE BRUTE RÉELLE', value: SITE.margeReelle, unit: '%', delta: -1.7, deltaLabel: `cible ${SITE.margePrevue}%` },
    { label: 'LIVRAISON', value: `J−${remainDays}`, sub: `15 mars 2027` },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {items.map((kpi, i) => (
        <Card key={i} padding={18} delay={60 * i}>
          <Stat {...kpi} />
        </Card>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
function TabBar({ tab, onTab }) {
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'etudes',   label: 'Études · BPU' },
    { id: 'planning', label: 'Planning' },
    { id: 'pointage', label: 'Pointage' },
    { id: 'achats',   label: 'Achats' },
    { id: 'sst',      label: 'Sous-traitance' },
    { id: 'sit',      label: 'Situations' },
    { id: 'docs',     label: 'Documents' },
  ];
  return (
    <div className="erp-fade-in" style={{
      display: 'flex', gap: 0,
      borderBottom: `1px solid ${TOKENS.line}`,
      animationDelay: '120ms',
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            padding: '10px 16px',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${active ? TOKENS.ink : 'transparent'}`,
            color: active ? TOKENS.ink : TOKENS.ink3,
            cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: active ? 600 : 400,
            marginBottom: -1,
            transition: 'border-color 140ms ease, color 140ms ease',
          }}>{t.label}</button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
function Overview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SCurve />
        <LotsTable />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <TeamCard />
        <JalonsCard />
        <SstCard />
        <DocsCard />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function SCurve() {
  const W = 520, H = 200, pad = { l: 40, r: 16, t: 16, b: 32 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const n = S_PLANNED.length;
  const x = (i) => pad.l + (i / (n - 1)) * innerW;
  const y = (v) => pad.t + (1 - v / 100) * innerH;

  const planPath = S_PLANNED.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const actPath  = S_ACTUAL.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const actFill  = `${actPath} L${x(S_ACTUAL.length - 1).toFixed(1)} ${y(0)} L${x(0)} ${y(0)} Z`;

  const months = ['N24','D24','J25','F25','M25','A25','M25','J25','J25','A25','S25','O25','N25','D25','J26','F26','M26','A26'];

  return (
    <Card delay={80}>
      <CardHead
        eyebrow="COURBE D'AVANCEMENT"
        title="Physique réel vs planifié"
        right={
          <div style={{ display: 'flex', gap: 14, fontSize: 11, color: TOKENS.ink2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 2, background: TOKENS.ink, display: 'inline-block' }} />
              Planifié
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 2, background: TOKENS.ocre, display: 'inline-block' }} />
              Réel
            </span>
          </div>
        }
      />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {/* gridlines */}
        {[0, 25, 50, 75, 100].map(g => (
          <g key={g}>
            <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke={TOKENS.line} strokeWidth="1" strokeDasharray={g === 0 || g === 100 ? '0' : '2 3'} />
            <text x={pad.l - 8} y={y(g) + 3} textAnchor="end" fontFamily="IBM Plex Mono" fontSize="9" fill={TOKENS.ink3}>{g}%</text>
          </g>
        ))}
        {/* x labels */}
        {months.map((m, i) => i % 3 === 0 && (
          <text key={i} x={x(i)} y={H - pad.b + 14} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill={TOKENS.ink3}>{m}</text>
        ))}
        {/* fill */}
        <path d={actFill} fill={`color-mix(in oklch, ${TOKENS.ocre} 12%, transparent)`} />
        {/* lines */}
        <path d={planPath} fill="none" stroke={TOKENS.ink} strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={actPath} fill="none" stroke={TOKENS.ocre} strokeWidth="2" />
        {/* current point */}
        <circle cx={x(S_ACTUAL.length - 1)} cy={y(S_ACTUAL[S_ACTUAL.length - 1])} r="4" fill={TOKENS.ocre} stroke="#fff" strokeWidth="2" />
        <text x={x(S_ACTUAL.length - 1)} y={y(S_ACTUAL[S_ACTUAL.length - 1]) - 10} textAnchor="middle"
          fontFamily="IBM Plex Mono" fontSize="11" fontWeight="500" fill={TOKENS.ocreDeep}>
          47%
        </text>
      </svg>
      <div style={{
        marginTop: 12, padding: 12,
        background: TOKENS.amberSoft, borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 12.5, color: 'oklch(0.40 0.10 75)',
      }}>
        <Icon name="warning" size={14} stroke={TOKENS.amber} />
        Retard cumulé de <b style={{ color: TOKENS.ink }}>5 points</b> sur le planning initial — récupérable avec accélération du lot étanchéité.
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function LotsTable() {
  return (
    <Card padding={0} delay={140}>
      <CardHead
        eyebrow="DÉCOMPOSITION PAR LOT"
        title={`${LOTS.length} lots · ${fmtMAD(LOTS.reduce((s, l) => s + l.budget, 0))} DH HT`}
        right={<Button size="sm" icon={<Icon name="plus" size={12} stroke={TOKENS.ink2} />}>Ajouter un lot</Button>}
        style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '50px 1fr 110px 110px 1fr 90px',
        padding: '10px 22px',
        background: TOKENS.bg,
        borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span>N°</span>
        <span>Lot</span>
        <span style={{ textAlign: 'right' }}>Budget</span>
        <span style={{ textAlign: 'right' }}>Réalisé</span>
        <span style={{ paddingLeft: 14 }}>Avancement</span>
        <span style={{ textAlign: 'right' }}>Statut</span>
      </div>
      {LOTS.map((l, i) => (
        <div key={l.code} className="erp-row" style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 110px 110px 1fr 90px',
          padding: '12px 22px',
          borderBottom: i < LOTS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{l.code}</span>
          <span style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{l.name}</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink }}>{fmtMAD(l.budget)}</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>{fmtMAD(l.realise)}</span>
          <div style={{ paddingLeft: 14, paddingRight: 14 }}>
            <Progress value={l.physique} tone={l.physique === 100 ? 'green' : l.physique > 0 ? 'ocre' : 'amber'} height={5} />
          </div>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, letterSpacing: '0.04em' }}>{l.status}</span>
        </div>
      ))}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function TeamCard() {
  const team = [
    { role: 'Conducteur de travaux', name: SITE.conducteur, init: 'KB', tone: 'ocre' },
    { role: 'Chef de chantier',      name: SITE.chef,       init: 'HA' },
    { role: 'Maître d\'œuvre',       name: SITE.moe,        init: 'EM' },
    { role: 'Bureau d\'études',      name: SITE.bureau,     init: 'AI' },
  ];
  return (
    <Card delay={100}>
      <CardHead eyebrow="ÉQUIPE PROJET" title="Intervenants" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {team.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: t.tone === 'ocre' ? TOKENS.ocreSoft : TOKENS.bgWarm,
              color: t.tone === 'ocre' ? TOKENS.ocreDeep : TOKENS.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 11,
            }}>{t.init}</div>
            <div style={{ flex: 1, lineHeight: 1.3 }}>
              <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 1, letterSpacing: '0.04em' }}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${TOKENS.line}`, fontSize: 12, color: TOKENS.ink2, lineHeight: 1.55 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 6 }}>CLIENT</div>
        <div style={{ fontWeight: 500, color: TOKENS.ink }}>{SITE.client}</div>
        <div style={{ color: TOKENS.ink3, marginTop: 3 }}>{SITE.clientContact}</div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 4 }}>ICE · {SITE.ice}</div>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function JalonsCard() {
  return (
    <Card delay={160}>
      <CardHead eyebrow="JALONS" title="Étapes contractuelles" />
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 7, top: 4, bottom: 4,
          width: 1, background: TOKENS.line,
        }} />
        {JALONS.map((j, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            paddingBottom: i < JALONS.length - 1 ? 12 : 0,
            position: 'relative',
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: 999, flexShrink: 0,
              marginTop: 2, position: 'relative', zIndex: 1,
              background: j.done ? TOKENS.green : (j.current ? TOKENS.ocre : TOKENS.paper),
              border: `2px solid ${j.done ? TOKENS.green : (j.current ? TOKENS.ocre : TOKENS.line2)}`,
              boxShadow: j.current ? `0 0 0 4px color-mix(in oklch, ${TOKENS.ocre} 20%, transparent)` : 'none',
            }} />
            <div style={{ flex: 1, lineHeight: 1.3, paddingTop: 1 }}>
              <div style={{
                fontSize: 12.5,
                color: j.done ? TOKENS.ink3 : TOKENS.ink,
                fontWeight: j.current ? 600 : 400,
                textDecoration: j.done ? 'none' : 'none',
              }}>{j.label}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.04em' }}>
                {j.date}{j.current && ' · en cours'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function SstCard() {
  return (
    <Card padding={0} delay={220}>
      <CardHead
        eyebrow={`SOUS-TRAITANTS · ${SST_ACTIVE.length} ACTIFS`}
        title="Conformité administrative"
        style={{ padding: '20px 22px 12px', marginBottom: 0 }}
      />
      {SST_ACTIVE.map((s, i) => (
        <div key={i} style={{
          padding: '12px 22px',
          borderTop: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{s.name}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.02em' }}>
              {s.lot} · {fmtMAD(s.amount)} DH
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span data-tip="CNSS" style={{
              width: 22, height: 22, borderRadius: 4,
              background: s.cnss === 'valid' ? TOKENS.greenSoft : TOKENS.amberSoft,
              color: s.cnss === 'valid' ? TOKENS.green : TOKENS.amber,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 500,
            }}>{s.cnss === 'valid' ? '✓' : '!'}</span>
            <span data-tip="Attestation fiscale" style={{
              width: 22, height: 22, borderRadius: 4,
              background: s.fiscal === 'valid' ? TOKENS.greenSoft : TOKENS.amberSoft,
              color: s.fiscal === 'valid' ? TOKENS.green : TOKENS.amber,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 500,
            }}>{s.fiscal === 'valid' ? '✓' : '!'}</span>
          </div>
        </div>
      ))}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function DocsCard() {
  return (
    <Card padding={0} delay={280}>
      <CardHead
        eyebrow="DOCUMENTS RÉCENTS"
        title="Derniers téléversements"
        right={<a style={{ fontSize: 11, color: TOKENS.ocreDeep, textDecoration: 'none' }}>Tout voir →</a>}
        style={{ padding: '20px 22px 12px', marginBottom: 0 }}
      />
      {RECENT_DOCS.map((d, i) => (
        <div key={i} className="erp-row" style={{
          padding: '12px 22px',
          borderTop: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer',
        }}>
          <Icon name="doc" size={15} stroke={d.tone === 'ocre' ? TOKENS.ocre : TOKENS.ink3} />
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
            <div style={{ fontSize: 12.5, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.02em' }}>
              {d.date} · {d.size} · {d.who}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function TabStub({ label }) {
  return (
    <div className="erp-fade-in" style={{
      border: `1px dashed ${TOKENS.line2}`,
      borderRadius: 8, padding: 60, textAlign: 'center', background: TOKENS.paper,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 10 }}>
        ONGLET — À CONSTRUIRE
      </div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, margin: 0 }}>
        {label}
      </h3>
      <p style={{ color: TOKENS.ink3, fontSize: 13, marginTop: 8 }}>
        L'onglet "Vue d'ensemble" est l'écran principal. Les autres onglets se construisent à la demande.
      </p>
    </div>
  );
}

Object.assign(window, { FicheChantier });
