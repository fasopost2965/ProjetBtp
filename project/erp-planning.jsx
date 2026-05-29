/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Screen — Planning multi-chantiers (Gantt + charge des équipes + ressources)
// =============================================================================

// Timeline domain
const T0 = 2024.0;          // start of axis
const T1 = 2029.0;          // end of axis
const SPAN = T1 - T0;       // 5 years
const TODAY = 2026 + 4.9 / 12; // ~ fin mai 2026

const parseMY = (s) => { const [m, y] = s.split('/').map(Number); return y + (m - 1) / 12; };
const pct = (v) => ((v - T0) / SPAN) * 100;

const MONTHS_FR = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
const fmtMY = (v) => { const y = Math.floor(v); const m = Math.round((v - y) * 12); return `${MONTHS_FR[m] || 'déc'} ${String(y).slice(2)}`; };

// Project dataset — debut/fin + phase segments + key milestone
const PROJETS = [
  { code: 'TNG-061', name: 'Port Tanger Med — Digue secondaire', conducteur: 'M. El Mansouri', region: 'Tanger-Tétouan', type: 'Génie civil', debut: '03/2024', fin: '07/2026', physique: 89, status: 'En cours', tone: 'green',
    phases: [['Terrassement', '03/2024', '11/2024'], ['Génie civil', '11/2024', '02/2026'], ['Finitions', '02/2026', '07/2026']], jalon: ['Réception digue', '06/2026'] },
  { code: 'CSB-098', name: 'Centre commercial Sidi Maârouf', conducteur: 'K. Benjelloun', region: 'Casa-Settat', type: 'Bâtiment', debut: '02/2023', fin: '06/2026', physique: 95, status: 'Réception', tone: 'ocre',
    phases: [['Gros œuvre', '02/2023', '04/2025'], ['Second œuvre', '04/2025', '03/2026'], ['Réception', '03/2026', '06/2026']], jalon: ['Livraison', '06/2026'] },
  { code: 'CSB-130', name: 'Pôle logistique Mediouna', conducteur: 'K. Benjelloun', region: 'Casa-Settat', type: 'Industriel', debut: '11/2024', fin: '07/2026', physique: 88, status: 'En cours', tone: 'green',
    phases: [['Fondations', '11/2024', '05/2025'], ['Charpente', '05/2025', '01/2026'], ['Bardage', '01/2026', '07/2026']], jalon: ['Mise hors d\'eau', '01/2026'] },
  { code: 'RBT-184', name: 'Université Med VI — Bibliothèque', conducteur: 'H. Alaoui', region: 'Rabat-Salé-Kénitra', type: 'Bâtiment', debut: '07/2024', fin: '09/2026', physique: 78, status: 'En cours', tone: 'green',
    phases: [['Gros œuvre', '07/2024', '06/2025'], ['Second œuvre', '06/2025', '06/2026'], ['Finitions', '06/2026', '09/2026']], jalon: ['Réception', '09/2026'] },
  { code: 'AGD-033', name: 'Hôtel Taghazout Bay — Gros œuvre', conducteur: 'S. Fassi', region: 'Souss-Massa', type: 'Bâtiment', debut: '06/2024', fin: '11/2026', physique: 64, status: 'En retard', tone: 'amber',
    phases: [['Fondations', '06/2024', '02/2025'], ['Structure', '02/2025', '05/2026'], ['Finitions', '05/2026', '11/2026']], jalon: ['Alerte planning', '03/2026'] },
  { code: 'FES-022', name: 'Hôpital régional Fès — Extension', conducteur: 'Y. Tazi', region: 'Fès-Meknès', type: 'Bâtiment', debut: '05/2024', fin: '12/2026', physique: 67, status: 'En cours', tone: 'green',
    phases: [['Gros œuvre', '05/2024', '08/2025'], ['Lots techniques', '08/2025', '08/2026'], ['Finitions', '08/2026', '12/2026']], jalon: ['Essais techniques', '09/2026'] },
  { code: 'CSB-176', name: 'Réhabilitation médina — Tranche 2', conducteur: 'S. Fassi', region: 'Casa-Settat', type: 'Réhab.', debut: '02/2025', fin: '10/2026', physique: 53, status: 'En cours', tone: 'green',
    phases: [['Confortement', '02/2025', '11/2025'], ['Réhabilitation', '11/2025', '07/2026'], ['Finitions', '07/2026', '10/2026']], jalon: null },
  { code: 'CSB-114', name: 'Marina Casablanca — Lot 3 résidentiel', conducteur: 'K. Benjelloun', region: 'Casa-Settat', type: 'Bâtiment', debut: '01/2025', fin: '03/2027', physique: 47, status: 'En cours', tone: 'green',
    phases: [['Fondations', '01/2025', '09/2025'], ['Structure', '09/2025', '09/2026'], ['Second œuvre', '09/2026', '03/2027']], jalon: ['Mise hors d\'eau', '09/2026'] },
  { code: 'AGD-052', name: 'Lycée Dakhla — Bloc administratif', conducteur: 'S. Fassi', region: 'Dakhla-Oued Eddahab', type: 'Bâtiment', debut: '08/2025', fin: '03/2027', physique: 41, status: 'En cours', tone: 'green',
    phases: [['Gros œuvre', '08/2025', '06/2026'], ['Second œuvre', '06/2026', '01/2027'], ['Finitions', '01/2027', '03/2027']], jalon: null },
  { code: 'RBT-241', name: 'Pont sur Bouregreg PK 8', conducteur: 'H. Alaoui', region: 'Rabat-Salé-Kénitra', type: 'Génie civil', debut: '06/2025', fin: '11/2027', physique: 38, status: 'En cours', tone: 'green',
    phases: [['Fondations spéciales', '06/2025', '04/2026'], ['Tablier', '04/2026', '06/2027'], ['Équipements', '06/2027', '11/2027']], jalon: ['Lancement tablier', '04/2026'] },
  { code: 'MEK-019', name: 'Échangeur autoroute A2 — PK 142', conducteur: 'Y. Tazi', region: 'Fès-Meknès', type: 'TP / VRD', debut: '04/2025', fin: '01/2027', physique: 31, status: 'En cours', tone: 'green',
    phases: [['Terrassement', '04/2025', '01/2026'], ['Ouvrages d\'art', '01/2026', '09/2026'], ['Chaussées', '09/2026', '01/2027']], jalon: null },
  { code: 'CSB-201', name: 'Résidence Anfa Place tour B', conducteur: 'K. Benjelloun', region: 'Casa-Settat', type: 'Bâtiment', debut: '09/2025', fin: '12/2027', physique: 22, status: 'En cours', tone: 'green',
    phases: [['Fondations', '09/2025', '05/2026'], ['Structure', '05/2026', '06/2027'], ['Second œuvre', '06/2027', '12/2027']], jalon: ['Mise hors d\'eau', '06/2027'] },
  { code: 'RBT-208', name: 'Tramway Rabat-Salé — Extension L2', conducteur: 'H. Alaoui', region: 'Rabat-Salé-Kénitra', type: 'TP / VRD', debut: '11/2025', fin: '06/2028', physique: 12, status: 'Démarrage', tone: 'blue',
    phases: [['Études exé.', '11/2025', '04/2026'], ['Infrastructure', '04/2026', '08/2027'], ['Voie & systèmes', '08/2027', '06/2028']], jalon: ['Démarrage travaux', '04/2026'] },
  { code: 'OUJ-007', name: 'Station d\'épuration Oujda Nord', conducteur: 'Y. Tazi', region: 'Oriental', type: 'Génie civil', debut: '03/2026', fin: '08/2027', physique: 4, status: 'Démarrage', tone: 'blue',
    phases: [['Installation', '03/2026', '06/2026'], ['Génie civil', '06/2026', '03/2027'], ['Process', '03/2027', '08/2027']], jalon: ['OS travaux', '03/2026'] },
  { code: 'TET-014', name: 'Marché de gros Tétouan', conducteur: 'M. El Mansouri', region: 'Tanger-Tétouan', type: 'Bâtiment', debut: '07/2026', fin: '02/2028', physique: 0, status: 'À démarrer', tone: 'neutral',
    phases: [['Préparation', '07/2026', '10/2026'], ['Gros œuvre', '10/2026', '09/2027'], ['Finitions', '09/2027', '02/2028']], jalon: ['Notification', '07/2026'] },
];

const CONDUCTEURS = ['K. Benjelloun', 'H. Alaoui', 'M. El Mansouri', 'S. Fassi', 'Y. Tazi'];
const PHASE_TONES = ['ink3', 'ocre', 'ink']; // phase index → shade

// 1.1 — Region filter constant
const REGIONS = ['Casa-Settat', 'Rabat-Salé-Kénitra', 'Tanger-Tétouan', 'Souss-Massa', 'Fès-Meknès', 'Oriental', 'Dakhla-Oued Eddahab'];

// 1.3 — Resources histogram data
const RESSOURCES = [
  { sem: 'S-22', semaine: '26 mai', total: 148, sites: [{code:'CSB-114',n:42},{code:'RBT-208',n:18},{code:'TNG-061',n:31},{code:'AGD-033',n:22},{code:'MEK-019',n:19},{code:'OUJ-007',n:16}] },
  { sem: 'S-23', semaine: '2 juin', total: 152, sites: [{code:'CSB-114',n:45},{code:'RBT-208',n:22},{code:'TNG-061',n:28},{code:'AGD-033',n:24},{code:'MEK-019',n:18},{code:'OUJ-007',n:15}] },
  { sem: 'S-24', semaine: '9 juin', total: 161, sites: [{code:'CSB-114',n:48},{code:'RBT-208',n:25},{code:'TNG-061',n:30},{code:'AGD-033',n:26},{code:'MEK-019',n:17},{code:'OUJ-007',n:15}] },
  { sem: 'S-25', semaine: '16 juin', total: 145, sites: [{code:'CSB-114',n:44},{code:'RBT-208',n:20},{code:'TNG-061',n:28},{code:'AGD-033',n:22},{code:'MEK-019',n:16},{code:'OUJ-007',n:15}] },
  { sem: 'S-26', semaine: '23 juin', total: 158, sites: [{code:'CSB-114',n:46},{code:'RBT-208',n:24},{code:'TNG-061',n:32},{code:'AGD-033',n:24},{code:'MEK-019',n:18},{code:'OUJ-007',n:14}] },
  { sem: 'S-27', semaine: '30 juin', total: 163, sites: [{code:'CSB-114',n:50},{code:'RBT-208',n:26},{code:'TNG-061',n:29},{code:'AGD-033',n:25},{code:'MEK-019',n:19},{code:'OUJ-007',n:14}] },
  { sem: 'S-28', semaine: '7 juil', total: 171, sites: [{code:'CSB-114',n:52},{code:'RBT-208',n:28},{code:'TNG-061',n:31},{code:'AGD-033',n:26},{code:'MEK-019',n:20},{code:'OUJ-007',n:14}] },
  { sem: 'S-29', semaine: '14 juil', total: 168, sites: [{code:'CSB-114',n:51},{code:'RBT-208',n:27},{code:'TNG-061',n:30},{code:'AGD-033',n:26},{code:'MEK-019',n:20},{code:'OUJ-007',n:14}] },
];
const SITE_COLORS = { 'CSB-114': TOKENS.ink, 'RBT-208': TOKENS.blue, 'TNG-061': TOKENS.ocre, 'AGD-033': TOKENS.amber, 'MEK-019': TOKENS.green, 'OUJ-007': TOKENS.ink3 };

// =============================================================================
// 1.2 — Alerts panel
// =============================================================================
function AlertsPanel() {
  const enRetard = PROJETS.filter(p => p.status === 'En retard');
  const jalons30 = PROJETS.filter(p => p.jalon && Math.abs(parseMY(p.jalon[1]) - TODAY) < 0.083 * 2); // ~2 months ≈ 30+ days window

  if (enRetard.length === 0 && jalons30.length === 0) return null;

  return (
    <div className="erp-fade-in" style={{
      borderLeft: `4px solid ${TOKENS.amber}`,
      background: TOKENS.amberSoft,
      borderRadius: '0 8px 8px 0',
      padding: '14px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="warning" size={15} stroke={TOKENS.amber} strokeWidth={2} />
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ocreDeep, letterSpacing: '0.1em', fontWeight: 600 }}>
          ALERTES PLANNING — ACTION REQUISE
        </span>
      </div>

      {enRetard.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em' }}>PROJETS EN RETARD</div>
          {enRetard.map(p => (
            <div key={p.code} style={{ display: 'flex', alignItems: 'center', gap: 12, background: TOKENS.paper, borderRadius: 6, padding: '10px 14px', border: `1px solid ${TOKENS.line}` }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, fontWeight: 600, flexShrink: 0 }}>{p.code}</span>
              <span style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              <Pill tone="amber" dot>{p.status}</Pill>
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11.5, color: TOKENS.amber, fontWeight: 600, flexShrink: 0 }}>Retard planning — action requise</span>
            </div>
          ))}
        </div>
      )}

      {jalons30.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em' }}>JALONS DANS LES 30 JOURS</div>
          {jalons30.map(p => (
            <div key={p.code} style={{ display: 'flex', alignItems: 'center', gap: 12, background: TOKENS.paper, borderRadius: 6, padding: '10px 14px', border: `1px solid ${TOKENS.line}` }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, fontWeight: 600, flexShrink: 0 }}>{p.code}</span>
              <span style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              <svg width="11" height="11" viewBox="0 0 10 10"><rect x="1" y="1" width="6" height="6" transform="rotate(45 5 5)" fill={TOKENS.ocreDeep} /></svg>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, flexShrink: 0 }}>{p.jalon[0]} · {fmtMY(parseMY(p.jalon[1]))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// 1.3 — Resource histogram (SVG stacked bars)
// =============================================================================
function RessourcesHistogram() {
  const BAR_H = 200;
  const MAX_CAP = 180;
  const BAR_W = 54;
  const GAP = 18;
  const LABEL_H = 40;
  const svgW = RESSOURCES.length * (BAR_W + GAP) + GAP;
  const svgH = BAR_H + LABEL_H + 4;

  return (
    <Card delay={120} padding={0} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${TOKENS.line}` }}>
        <CardHead eyebrow="RESSOURCES HUMAINES" title="Ressources par semaine"
          right={<span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>8 semaines · ouvriers par chantier</span>}
          style={{ marginBottom: 0 }} />
      </div>

      <div style={{ padding: '20px 22px', overflowX: 'auto' }}>
        <svg width={svgW} height={svgH} style={{ display: 'block' }}>
          {/* capacity max line */}
          {(() => {
            const capY = BAR_H - (MAX_CAP / MAX_CAP) * BAR_H;
            return (
              <g>
                <line x1={0} y1={capY} x2={svgW} y2={capY}
                  stroke={TOKENS.red} strokeWidth={1.5} strokeDasharray="5,4" opacity={0.7} />
                <text x={svgW - 4} y={capY - 5} textAnchor="end"
                  fontFamily="IBM Plex Mono" fontSize={9} fill={TOKENS.red} opacity={0.85}>
                  Capacité max conseillée: 180 ouvriers
                </text>
              </g>
            );
          })()}

          {/* Bars */}
          {RESSOURCES.map((week, wi) => {
            const x = GAP + wi * (BAR_W + GAP);
            let yOffset = BAR_H;

            return (
              <g key={week.sem}>
                {/* stacked segments bottom-up */}
                {week.sites.map((site) => {
                  const segH = (site.n / MAX_CAP) * BAR_H;
                  yOffset -= segH;
                  const color = SITE_COLORS[site.code] || TOKENS.ink3;
                  const y = yOffset;
                  return (
                    <rect key={site.code} x={x} y={y} width={BAR_W} height={segH}
                      fill={color} opacity={0.88} rx={site === week.sites[week.sites.length - 1] ? 2 : 0} />
                  );
                })}

                {/* total label above bar */}
                <text x={x + BAR_W / 2} y={yOffset - 6} textAnchor="middle"
                  fontFamily="Manrope" fontWeight="700" fontSize={11} fill={TOKENS.ink}>
                  {week.total}
                </text>

                {/* week label below */}
                <text x={x + BAR_W / 2} y={BAR_H + 16} textAnchor="middle"
                  fontFamily="IBM Plex Mono" fontSize={8.5} fill={TOKENS.ink3}>
                  {week.sem}
                </text>
                <text x={x + BAR_W / 2} y={BAR_H + 30} textAnchor="middle"
                  fontFamily="IBM Plex Sans" fontSize={9.5} fill={TOKENS.ink3}>
                  {week.semaine}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
        padding: '12px 22px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>CHANTIERS</span>
        {Object.entries(SITE_COLORS).map(([code, color]) => (
          <span key={code} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: TOKENS.ink2 }}>
            <span style={{ width: 14, height: 10, borderRadius: 2, background: color, opacity: 0.88 }} />
            {code}
          </span>
        ))}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: TOKENS.ink2, marginLeft: 8 }}>
          <svg width="20" height="10"><line x1="0" y1="5" x2="20" y2="5" stroke={TOKENS.red} strokeWidth="1.5" strokeDasharray="4,3" /></svg>
          Max conseillé (180)
        </span>
      </div>
    </Card>
  );
}

// =============================================================================
// Main Planning component
// =============================================================================
function Planning() {
  const [view, setView] = React.useState('gantt'); // gantt | charge | ressources
  const [cond, setCond] = React.useState('all');
  const [region, setRegion] = React.useState('all'); // 1.1 region filter
  const [hover, setHover] = React.useState(null);

  let rows = PROJETS.slice().sort((a, b) => parseMY(a.debut) - parseMY(b.debut));
  if (cond !== 'all') rows = rows.filter(r => r.conducteur === cond);
  if (region !== 'all') rows = rows.filter(r => r.region === region); // 1.1

  const enRetard = PROJETS.filter(p => p.status === 'En retard').length;
  const jalons30 = PROJETS.filter(p => p.jalon && Math.abs(parseMY(p.jalon[1]) - TODAY) < 0.17).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1.2 — Alerts panel (before Gantt/Charge) */}
      <AlertsPanel />

      {/* Hero */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            PLANNING · ORDONNANCEMENT GÉNÉRAL
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.15 }}>
            Planning multi-chantiers <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· 2024 — 2028</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Exporter le planning</Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Ajouter un jalon</Button>
        </div>
      </div>

      {/* Controls */}
      <div className="erp-fade-in" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* View toggle — now 3 options */}
        <div style={{ display: 'flex', background: TOKENS.bgWarm, borderRadius: 6, padding: 2 }}>
          {[['gantt', 'Diagramme de Gantt'], ['charge', 'Charge des équipes'], ['ressources', 'Ressources hebdomadaires']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: '7px 14px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: view === id ? TOKENS.paper : 'transparent',
              color: view === id ? TOKENS.ink : TOKENS.ink3,
              fontFamily: 'IBM Plex Sans', fontSize: 12.5, fontWeight: 500,
              boxShadow: view === id ? '0 1px 2px rgba(26,24,20,0.08)' : 'none',
            }}>{label}</button>
          ))}
        </div>

        <CondFilter value={cond} onChange={setCond} />

        {/* 1.1 — Region select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>RÉGION</span>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            style={{
              height: 32, padding: '0 10px',
              border: `1px solid ${region !== 'all' ? TOKENS.ocre : TOKENS.line2}`,
              borderRadius: 6,
              background: region !== 'all' ? TOKENS.ocreSoft : TOKENS.paper,
              color: region !== 'all' ? TOKENS.ocreDeep : TOKENS.ink2,
              fontFamily: 'IBM Plex Sans', fontSize: 12.5,
              cursor: 'pointer', outline: 'none',
              appearance: 'none', paddingRight: 26,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238a8378' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
            }}
          >
            <option value="all">Toutes les régions</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        {/* Inline alerts */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {enRetard > 0 && <Pill tone="amber" dot>{enRetard} en retard</Pill>}
          {jalons30 > 0 && <Pill tone="ocre" dot>{jalons30} jalon{jalons30 > 1 ? 's' : ''} ce mois-ci</Pill>}
          <Pill mono>{rows.length} chantiers</Pill>
        </div>
      </div>

      {view === 'gantt' && <Gantt rows={rows} hover={hover} setHover={setHover} />}
      {view === 'charge' && <Charge cond={cond} />}
      {view === 'ressources' && <RessourcesHistogram />}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Conductor filter (segmented avatars)
// -----------------------------------------------------------------------------
function CondFilter({ value, onChange }) {
  const initials = (n) => n.split('. ')[1]?.[0] || n[0];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>CONDUCTEUR</span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => onChange('all')} className="erp-pill-btn" style={{
          height: 30, padding: '0 12px', borderRadius: 999,
          border: `1px solid ${value === 'all' ? TOKENS.ink : TOKENS.line2}`,
          background: value === 'all' ? TOKENS.ink : TOKENS.paper,
          color: value === 'all' ? TOKENS.bg : TOKENS.ink2,
          fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>Tous</button>
        {CONDUCTEURS.map(c => {
          const on = value === c;
          return (
            <button key={c} onClick={() => onChange(on ? 'all' : c)} data-tip={c} style={{
              width: 30, height: 30, borderRadius: 999,
              border: `1px solid ${on ? TOKENS.ocre : TOKENS.line2}`,
              background: on ? TOKENS.ocreSoft : TOKENS.paper,
              color: on ? TOKENS.ocreDeep : TOKENS.ink3,
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, cursor: 'pointer',
            }}>{initials(c)}</button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// GANTT VIEW
// =============================================================================
const LABEL_W = 270;

function Gantt({ rows, hover, setHover }) {
  // year columns
  const years = [2024, 2025, 2026, 2027, 2028];
  const quarters = [];
  years.forEach(y => [1, 2, 3, 4].forEach(q => quarters.push({ y, q, v: y + (q - 1) * 0.25 })));

  return (
    <Card padding={0} delay={120} style={{ overflow: 'hidden' }}>
      {/* Timeline header */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <div style={{ width: LABEL_W, flexShrink: 0, padding: '10px 22px', borderRight: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', display: 'flex', alignItems: 'flex-end' }}>
          CHANTIER · CONDUCTEUR
        </div>
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          {/* year row */}
          <div style={{ display: 'flex', height: 22 }}>
            {years.map(y => (
              <div key={y} style={{ flex: 1, borderLeft: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', paddingLeft: 8,
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: TOKENS.ink2, letterSpacing: '-0.01em' }}>
                {y}
              </div>
            ))}
          </div>
          {/* quarter row */}
          <div style={{ display: 'flex', height: 20 }}>
            {quarters.map((qq, i) => (
              <div key={i} style={{ flex: 1, borderLeft: `1px solid ${qq.q === 1 ? TOKENS.line : TOKENS.line}`,
                fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink4, paddingLeft: 6, display: 'flex', alignItems: 'center',
                opacity: qq.q === 1 ? 1 : 0.7 }}>
                T{qq.q}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      <div style={{ position: 'relative' }}>
        {/* gridlines + today line layer */}
        <div style={{ position: 'absolute', inset: 0, left: LABEL_W, pointerEvents: 'none' }}>
          {years.map((y, i) => (
            <div key={y} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i / 5) * 100}%`, width: 1, background: TOKENS.line }} />
          ))}
          {/* today */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct(TODAY)}%`, width: 2, background: TOKENS.ocre, zIndex: 3 }}>
            <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
              background: TOKENS.ocre, color: TOKENS.paper, fontFamily: 'IBM Plex Mono', fontSize: 8.5, fontWeight: 600,
              padding: '2px 5px', borderRadius: 3, whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              28 MAI
            </div>
          </div>
        </div>

        {rows.map((p, i) => (
          <GanttRow key={p.code} p={p} last={i === rows.length - 1} delay={150 + i * 22}
            hovered={hover === p.code} onHover={setHover} />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        padding: '12px 22px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>LÉGENDE</span>
        <LegSwatch color={TOKENS.ink} label="Réalisé" />
        <LegSwatch color={TOKENS.line2} label="Reste à faire" />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TOKENS.ink2 }}>
          <svg width="11" height="11" viewBox="0 0 10 10"><rect x="1" y="1" width="6" height="6" transform="rotate(45 5 5)" fill={TOKENS.ocreDeep} /></svg>
          Jalon clé
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TOKENS.ink2 }}>
          <span style={{ width: 2, height: 12, background: TOKENS.ocre }} /> Aujourd'hui
        </span>
      </div>
    </Card>
  );
}

function LegSwatch({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TOKENS.ink2 }}>
      <span style={{ width: 16, height: 9, borderRadius: 2, background: color }} /> {label}
    </span>
  );
}

function GanttRow({ p, last, delay, hovered, onHover }) {
  const start = parseMY(p.debut), end = parseMY(p.fin);
  const rawLeft = pct(start);
  const left = Math.max(0, rawLeft);
  const right = Math.min(100, pct(end));
  const width = right - left;
  const clippedStart = rawLeft < 0; // bar begins before the visible axis
  const initials = p.conducteur.split('. ')[1]?.[0] || p.conducteur[0];
  const jalonV = p.jalon ? parseMY(p.jalon[1]) : null;
  const dur = ((end - start) * 12).toFixed(0);

  return (
    <a href={`#fiche-${p.code}`} className="erp-row erp-fade-in" style={{
      display: 'flex', alignItems: 'stretch', textDecoration: 'none', color: 'inherit',
      borderBottom: last ? 'none' : `1px solid ${TOKENS.line}`,
      animationDelay: delay + 'ms', background: hovered ? '#faf8f3' : 'transparent',
    }} onMouseEnter={() => onHover(p.code)} onMouseLeave={() => onHover(null)}>
      {/* Label */}
      <div style={{ width: LABEL_W, flexShrink: 0, padding: '12px 22px', borderRight: `1px solid ${TOKENS.line}`,
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 999, flexShrink: 0,
          background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 10.5 }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>{p.code} · {p.conducteur}</div>
        </div>
      </div>

      {/* Track */}
      <div style={{ flex: 1, position: 'relative', minWidth: 0, minHeight: 52, overflow: 'hidden' }}>
        {/* Bar */}
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          left: `${left}%`, width: `${width}%`, height: 22,
          borderRadius: clippedStart ? '0 5px 5px 0' : 5, background: TOKENS.line2, overflow: 'hidden',
          border: `1px solid ${p.status === 'En retard' ? TOKENS.amber : 'transparent'}`,
          boxShadow: hovered ? '0 4px 12px -6px rgba(26,24,20,0.4)' : 'none', transition: 'box-shadow 160ms ease' }}>
          {/* done fill */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p.physique}%`,
            background: p.status === 'En retard' ? TOKENS.amber : p.status === 'Réception' ? TOKENS.ocreDeep : TOKENS.ink }} />
          {/* label inside bar */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 8px', fontFamily: 'IBM Plex Mono', fontSize: 9.5, fontWeight: 500,
            color: p.physique > 55 ? TOKENS.bg : TOKENS.ink2, mixBlendMode: 'normal', pointerEvents: 'none' }}>
            <span>{p.physique}%</span>
            <span style={{ opacity: 0.8 }}>{dur} mois</span>
          </div>
        </div>

        {/* phase ticks under bar (subtle) */}
        {p.phases.map((ph, k) => {
          const ps = pct(parseMY(ph[1]));
          if (k === 0) return null;
          return <div key={k} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: `${ps}%`, width: 1, height: 22, background: 'rgba(255,255,255,0.35)', zIndex: 2, pointerEvents: 'none' }} />;
        })}

        {/* milestone diamond */}
        {jalonV != null && (
          <div data-tip={`${p.jalon[0]} · ${fmtMY(jalonV)}`} style={{ position: 'absolute', top: '50%',
            left: `${pct(jalonV)}%`, transform: 'translate(-50%,-50%)', zIndex: 4 }}>
            <svg width="13" height="13" viewBox="0 0 12 12">
              <rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)"
                fill={p.status === 'En retard' ? TOKENS.amber : TOKENS.ocreDeep} stroke={TOKENS.paper} strokeWidth="1.2" />
            </svg>
          </div>
        )}
      </div>
    </a>
  );
}

// =============================================================================
// CHARGE DES ÉQUIPES — heatmap of active sites per conductor per quarter
// =============================================================================
function Charge({ cond }) {
  const years = [2024, 2025, 2026, 2027, 2028];
  const quarters = [];
  years.forEach(y => [1, 2, 3, 4].forEach(q => quarters.push({ y, q, v: y + (q - 1) * 0.25, mid: y + (q - 1) * 0.25 + 0.125 })));

  const conducteurs = cond === 'all' ? CONDUCTEURS : [cond];
  const CAP = 3; // capacité confortable

  const load = (c, qmid) => PROJETS.filter(p => p.conducteur === c && parseMY(p.debut) <= qmid && parseMY(p.fin) >= qmid).length;

  const cellColor = (n) => {
    if (n === 0) return { bg: TOKENS.bg, fg: TOKENS.ink4 };
    if (n <= 2) return { bg: TOKENS.greenSoft, fg: 'oklch(0.42 0.08 150)' };
    if (n === 3) return { bg: TOKENS.ocreSoft, fg: TOKENS.ocreDeep };
    return { bg: TOKENS.redSoft, fg: TOKENS.red };
  };

  return (
    <Card padding={0} delay={120} style={{ overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${TOKENS.line}` }}>
        <CardHead eyebrow="PLAN DE CHARGE" title="Chantiers actifs par conducteur de travaux"
          right={<span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>capacité confortable · {CAP} chantiers</span>}
          style={{ marginBottom: 0 }} />
      </div>

      {/* header */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${TOKENS.line}` }} />
        {years.map(y => (
          <div key={y} style={{ flex: 1, padding: '8px 0 6px', textAlign: 'center', borderLeft: `1px solid ${TOKENS.line}`,
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: TOKENS.ink2 }}>{y}</div>
        ))}
      </div>

      {conducteurs.map((c, ri) => {
        const initials = c.split('. ')[1]?.[0] || c[0];
        const peak = Math.max(...quarters.map(q => load(c, q.mid)));
        return (
          <div key={c} className="erp-fade-in" style={{ display: 'flex', alignItems: 'stretch',
            borderBottom: ri === conducteurs.length - 1 ? 'none' : `1px solid ${TOKENS.line}`, animationDelay: 100 + ri * 40 + 'ms' }}>
            <div style={{ width: 200, flexShrink: 0, padding: '10px 16px', borderRight: `1px solid ${TOKENS.line}`,
              display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                background: peak > CAP ? TOKENS.redSoft : TOKENS.ocreSoft, color: peak > CAP ? TOKENS.red : TOKENS.ocreDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 11 }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: TOKENS.ink, whiteSpace: 'nowrap' }}>{c}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: peak > CAP ? TOKENS.red : TOKENS.ink3, marginTop: 2 }}>
                  pic · {peak} chantiers{peak > CAP ? ' ⚠' : ''}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
              {quarters.map((q, i) => {
                const n = load(c, q.mid);
                const col = cellColor(n);
                const yearStart = q.q === 1;
                return (
                  <div key={i} data-tip={n === 0 ? 'aucun chantier' : `${n} chantier${n > 1 ? 's' : ''} · T${q.q} ${q.y}`}
                    style={{ flex: 1, height: 46, background: col.bg,
                      borderLeft: `1px solid ${yearStart ? TOKENS.line : TOKENS.line}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: col.fg, cursor: 'default',
                      opacity: yearStart ? 1 : 0.96 }}>
                    {n > 0 ? n : ''}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        padding: '12px 22px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>CHARGE</span>
        {[['1–2', TOKENS.greenSoft, 'oklch(0.42 0.08 150)'], ['3', TOKENS.ocreSoft, TOKENS.ocreDeep], ['4+', TOKENS.redSoft, TOKENS.red]].map(([l, bg, fg]) => (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TOKENS.ink2 }}>
            <span style={{ width: 18, height: 14, borderRadius: 3, background: bg, color: fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 9 }}>{l}</span>
            {l === '1–2' ? 'optimal' : l === '3' ? 'plein' : 'surcharge'}
          </span>
        ))}
      </div>
    </Card>
  );
}

Object.assign(window, { Planning });
