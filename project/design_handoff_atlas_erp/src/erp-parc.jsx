/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Parc matériel
// Engins & matériel · affectation chantier · taux d'utilisation ·
//   maintenance préventive / curative · VGP réglementaire · location externe
// =============================================================================

const ENGINS = [
  { code: 'GR-04', type: 'Grue à tour', marque: 'Potain MDT 219', immat: '—', status: 'service', site: 'CSB-114', siteName: 'Marina Casa L3', util: 88, compteur: '4 210 h', vgp: '12/06/2026', vgpJours: 15, coutJour: 3_200, cat: 'Levage' },
  { code: 'PE-12', type: 'Pelle sur chenilles 30 t', marque: 'Caterpillar 330', immat: '—', status: 'service', site: 'RBT-208', siteName: 'Tramway Rabat', util: 76, compteur: '9 840 h', vgp: '03/09/2026', vgpJours: 98, coutJour: 2_400, cat: 'Terrassement' },
  { code: 'PE-07', type: 'Pelle sur pneus 18 t', marque: 'Volvo EW180', immat: 'B-44521', status: 'maintenance', site: null, siteName: null, util: 0, compteur: '12 320 h', vgp: '21/07/2026', vgpJours: 54, coutJour: 1_900, cat: 'Terrassement', note: 'Révision 12 000 h — atelier Casa' },
  { code: 'CH-03', type: 'Chargeuse sur pneus', marque: 'Caterpillar 950', immat: 'B-38104', status: 'service', site: 'TNG-061', siteName: 'Port Tanger Med', util: 64, compteur: '7 110 h', vgp: '30/06/2026', vgpJours: 33, coutJour: 1_700, cat: 'Terrassement' },
  { code: 'CA-21', type: 'Camion benne 8×4', marque: 'Renault K440', immat: 'B-51220', status: 'service', site: 'MEK-019', siteName: 'Échangeur A2', util: 71, compteur: '184 500 km', vgp: '08/06/2026', vgpJours: 11, coutJour: 1_350, cat: 'Transport' },
  { code: 'CA-19', type: 'Camion benne 8×4', marque: 'Mercedes Arocs', immat: 'B-49883', status: 'panne', site: 'AGD-033', siteName: 'Taghazout Bay', util: 0, compteur: '212 040 km', vgp: '15/05/2026', vgpJours: -13, coutJour: 1_350, cat: 'Transport', note: 'Boîte de vitesses — immobilisé sur chantier', alerte: true },
  { code: 'TO-08', type: 'Toupie béton 8 m³', marque: 'Stetter / MAN', immat: 'B-40217', status: 'service', site: 'CSB-114', siteName: 'Marina Casa L3', util: 82, compteur: '96 320 km', vgp: '19/08/2026', vgpJours: 83, coutJour: 1_500, cat: 'Béton' },
  { code: 'CP-05', type: 'Compacteur monocylindre', marque: 'Bomag BW213', immat: 'B-37650', status: 'dispo', site: null, siteName: null, util: 0, compteur: '5 460 h', vgp: '11/10/2026', vgpJours: 136, coutJour: 1_100, cat: 'Compactage' },
  { code: 'NI-02', type: 'Niveleuse', marque: 'Caterpillar 140', immat: 'B-29014', status: 'loue', site: 'EXT', siteName: 'Loué — STRS Rabat', util: 90, compteur: '6 280 h', vgp: '24/07/2026', vgpJours: 57, coutJour: 2_100, cat: 'Terrassement', note: 'Location externe — 4 sem.' },
  { code: 'GE-11', type: 'Groupe électrogène 250 kVA', marque: 'SDMO', immat: '—', status: 'service', site: 'OUJ-007', siteName: 'STEP Oujda Nord', util: 58, compteur: '3 140 h', vgp: '02/12/2026', vgpJours: 188, coutJour: 600, cat: 'Énergie' },
  { code: 'NA-06', type: 'Nacelle élévatrice 16 m', marque: 'Haulotte HA16', immat: '—', status: 'dispo', site: null, siteName: null, util: 0, compteur: '1 920 h', vgp: '05/06/2026', vgpJours: 8, coutJour: 800, cat: 'Levage', alerte: true, note: 'VGP à programmer sous 8 j' },
  { code: 'PE-15', type: 'Mini-pelle 5 t', marque: 'Kubota KX080', immat: 'B-52771', status: 'service', site: 'CSB-176', siteName: 'Réhab. médina', util: 49, compteur: '2 640 h', vgp: '17/09/2026', vgpJours: 112, coutJour: 950, cat: 'Terrassement' },
];

const ENGIN_STATUS = {
  service:     { label: 'En service', tone: 'green' },
  dispo:       { label: 'Disponible', tone: 'blue' },
  maintenance: { label: 'En maintenance', tone: 'amber' },
  panne:       { label: 'En panne', tone: 'red' },
  loue:        { label: 'Loué (externe)', tone: 'ocre' },
};

const ENGIN_CATS = ['Levage', 'Terrassement', 'Transport', 'Béton', 'Compactage', 'Énergie'];

// =============================================================================
function Parc() {
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const [q, setQ] = React.useState('');

  let rows = ENGINS.slice();
  if (statusFilter !== 'all') rows = rows.filter(e => e.status === statusFilter);
  if (cat !== 'all') rows = rows.filter(e => e.cat === cat);
  if (q) { const Q = q.toLowerCase(); rows = rows.filter(e => (e.code + ' ' + e.type + ' ' + e.marque + ' ' + (e.immat || '')).toLowerCase().includes(Q)); }

  const total = ENGINS.length;
  const service = ENGINS.filter(e => e.status === 'service').length;
  const dispo = ENGINS.filter(e => e.status === 'dispo').length;
  const indispo = ENGINS.filter(e => e.status === 'maintenance' || e.status === 'panne').length;
  const utilMoy = Math.round(ENGINS.filter(e => e.status === 'service' || e.status === 'loue').reduce((s, e) => s + e.util, 0) / ENGINS.filter(e => e.status === 'service' || e.status === 'loue').length);

  // upcoming VGP / maintenance (sorted by days)
  const echeances = ENGINS.filter(e => e.vgpJours <= 60).sort((a, b) => a.vgpJours - b.vgpJours);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            PARC MATÉRIEL · ENGINS & AFFECTATIONS
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Parc matériel <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· {total} engins</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button icon={<Icon name="clock" size={13} stroke={TOKENS.ink2} />}>Planning matériel</Button>
          <Button icon={<Icon name="wrench" size={13} stroke={TOKENS.ink2} />}>Carnet d'entretien</Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Affecter un engin</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        <PcKpi label="PARC TOTAL" value={total} sub="engins suivis" delay={60} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
        <PcKpi label="EN SERVICE" value={service} sub="affectés chantier" tone="green" delay={120} active={statusFilter === 'service'} onClick={() => setStatusFilter('service')} />
        <PcKpi label="DISPONIBLES" value={dispo} sub="au parc" tone="blue" delay={180} active={statusFilter === 'dispo'} onClick={() => setStatusFilter('dispo')} />
        <PcKpi label="IMMOBILISÉS" value={indispo} sub="maint. / panne" tone="red" delay={240} active={statusFilter === 'panne'} onClick={() => setStatusFilter(statusFilter === 'panne' ? 'all' : 'panne')} />
        <PcKpi label="TAUX D'UTILISATION" value={utilMoy + '%'} sub="moy. engins actifs" delay={300} tone="ink" />
      </div>

      {/* Filters */}
      <div className="erp-fade-in" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 36,
          background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6 }}>
          <Icon name="search" size={14} stroke={TOKENS.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Code, type, marque, immatriculation…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[['all', 'Toutes'], ...ENGIN_CATS.map(c => [c, c])].map(([id, label]) => {
            const on = cat === id;
            return (
              <button key={id} onClick={() => setCat(on ? 'all' : id)} style={{
                height: 32, padding: '0 12px', borderRadius: 6, cursor: 'pointer',
                border: `1px solid ${on ? TOKENS.ocre : TOKENS.line2}`,
                background: on ? TOKENS.ocreSoft : TOKENS.paper, color: on ? TOKENS.ocreDeep : TOKENS.ink2,
                fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
              }}>{label}</button>
            );
          })}
        </div>
      </div>

      {/* Two-col: engins grid + maintenance schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,320px)', gap: 16, alignItems: 'start' }}>
        <EnginGrid rows={rows} />
        <MaintenancePanel echeances={echeances} />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function PcKpi({ label, value, sub, tone, delay, active, onClick }) {
  const dark = tone === 'ink';
  const toneColors = { green: TOKENS.green, blue: TOKENS.blue, red: TOKENS.red };
  const accent = toneColors[tone];
  return (
    <button onClick={onClick} className="erp-card erp-fade-in" style={{
      animationDelay: delay + 'ms',
      background: dark ? TOKENS.ink : (active ? TOKENS.bgWarm : TOKENS.paper),
      border: `1px solid ${active ? TOKENS.ink : (dark ? TOKENS.ink : TOKENS.line)}`,
      borderRadius: 8, padding: 16, textAlign: 'left', cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />}
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: dark ? TOKENS.ocre : (accent || TOKENS.ink3), letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 23, letterSpacing: '-0.025em', color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, marginTop: 6, color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </button>
  );
}

// -----------------------------------------------------------------------------
function EnginGrid({ rows }) {
  if (rows.length === 0) return (
    <Card padding={48} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 8 }}>AUCUN ENGIN</div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, margin: 0, color: TOKENS.ink }}>Aucun engin pour ces filtres.</h3>
    </Card>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
      {rows.map((e, i) => <EnginCard key={e.code} e={e} delay={i * 30} />)}
    </div>
  );
}

function EnginCard({ e, delay }) {
  const s = ENGIN_STATUS[e.status];
  const catIcon = { Levage: 'box', Terrassement: 'truck', Transport: 'truck', Béton: 'truck', Compactage: 'truck', Énergie: 'settings' }[e.cat] || 'truck';
  const vgpSoon = e.vgpJours <= 15;
  const vgpLate = e.vgpJours < 0;
  return (
    <Card hoverable padding={0} delay={delay} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* head */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 7, flexShrink: 0,
          background: e.status === 'panne' ? TOKENS.redSoft : e.status === 'maintenance' ? TOKENS.amberSoft : TOKENS.bgWarm,
          border: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={catIcon} size={19} stroke={e.status === 'panne' ? TOKENS.red : e.status === 'maintenance' ? 'oklch(0.45 0.10 75)' : TOKENS.ocreDeep} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{e.code}</span>
            {e.immat && e.immat !== '—' && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3 }}>· {e.immat}</span>}
          </div>
          <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.type}</div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill tone={s.tone} dot>{s.label}</Pill>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>{e.marque}</span>
        </div>

        {/* affectation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 20 }}>
          <Icon name="sites" size={13} stroke={TOKENS.ink3} />
          {e.site && e.site !== 'EXT' ? (
            <a href={`#fiche-${e.site}`} style={{ fontSize: 12, color: TOKENS.ink2, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep }}>{e.site}</span> · {e.siteName}
            </a>
          ) : (
            <span style={{ fontSize: 12, color: TOKENS.ink3 }}>{e.siteName || 'Non affecté — au parc'}</span>
          )}
        </div>

        {e.note && (
          <div style={{ padding: '7px 9px', borderRadius: 5, fontSize: 11, lineHeight: 1.4,
            background: e.alerte ? TOKENS.redSoft : TOKENS.bg, color: e.alerte ? TOKENS.red : TOKENS.ink2,
            border: `1px solid ${e.alerte ? TOKENS.red : TOKENS.line}` }}>
            {e.note}
          </div>
        )}

        {/* utilisation */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, color: TOKENS.ink2 }}>
            <span>Taux d'utilisation</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 500, color: TOKENS.ink }}>{e.util}%</span>
          </div>
          <Progress value={e.util} tone={e.util >= 80 ? 'green' : e.util >= 50 ? 'ocre' : e.util > 0 ? 'amber' : 'red'} height={5} />
        </div>

        {/* footer meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${TOKENS.line}` }}>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>COMPTEUR</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink, fontWeight: 500, marginTop: 2 }}>{e.compteur}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>PROCHAINE VGP</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, fontWeight: 500, marginTop: 2,
              color: vgpLate ? TOKENS.red : vgpSoon ? 'oklch(0.45 0.10 75)' : TOKENS.ink }}>
              {e.vgp} {vgpLate ? '⚠' : vgpSoon ? `· ${e.vgpJours}j` : ''}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function MaintenancePanel({ echeances }) {
  return (
    <Card padding={0} delay={420} style={{ position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 9 }}>
        <Icon name="wrench" size={15} stroke={TOKENS.ocreDeep} />
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 3 }}>ÉCHÉANCIER</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink }}>VGP & maintenances</div>
        </div>
      </div>
      <div style={{ maxHeight: 560, overflowY: 'auto' }}>
        {echeances.map((e, i) => {
          const late = e.vgpJours < 0;
          const soon = e.vgpJours <= 15;
          return (
            <div key={e.code} className="erp-row" style={{ padding: '12px 16px', borderBottom: i < echeances.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 38, flexShrink: 0, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, lineHeight: 1,
                  color: late ? TOKENS.red : soon ? 'oklch(0.45 0.10 75)' : TOKENS.ink }}>
                  {late ? '!' : Math.abs(e.vgpJours)}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3, marginTop: 2 }}>{late ? 'RETARD' : 'JOURS'}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep, fontSize: 11 }}>{e.code}</span> · {e.type}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>VGP · {e.vgp}</div>
              </div>
              <Pill tone={late ? 'red' : soon ? 'amber' : 'neutral'} mono>{e.vgp.slice(0, 5)}</Pill>
            </div>
          );
        })}
        {echeances.length === 0 && <div style={{ padding: 28, textAlign: 'center', fontSize: 12, color: TOKENS.ink3 }}>Aucune échéance sous 60 jours.</div>}
      </div>
      <div style={{ padding: '10px 16px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <Button size="sm" style={{ width: '100%', justifyContent: 'center' }} icon={<Icon name="plus" size={12} stroke={TOKENS.ink2} />}>
          Planifier une intervention
        </Button>
      </div>
    </Card>
  );
}

Object.assign(window, { Parc });
