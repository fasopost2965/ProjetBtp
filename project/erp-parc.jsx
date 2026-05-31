/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD, Modal, Drawer, FieldGroup, TextInput, TextArea, Select */
// =============================================================================
// ERP — Parc matériel
// Engins & matériel · affectation chantier · taux d'utilisation ·
//   maintenance préventive / curative · VGP réglementaire · location externe
// =============================================================================

const ENGINS_SEED = [
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

// Fake affectation history per engin (code → array of past sites)
const ENGIN_HISTORY = {
  'GR-04': [
    { site: 'CSB-114', siteName: 'Marina Casa L3', debut: '15/01/2026', fin: null, conducteur: 'K. Benjelloun' },
    { site: 'RBT-208', siteName: 'Tramway Rabat', debut: '01/06/2025', fin: '12/01/2026', conducteur: 'H. Alaoui' },
    { site: 'TNG-061', siteName: 'Port Tanger Med', debut: '10/02/2025', fin: '28/05/2025', conducteur: 'M. El Mansouri' },
  ],
  'PE-12': [
    { site: 'RBT-208', siteName: 'Tramway Rabat', debut: '05/03/2026', fin: null, conducteur: 'H. Alaoui' },
    { site: 'CSB-114', siteName: 'Marina Casa L3', debut: '10/09/2025', fin: '02/03/2026', conducteur: 'K. Benjelloun' },
  ],
  'PE-07': [
    { site: null, siteName: 'Atelier Casa (maintenance)', debut: '10/05/2026', fin: null, conducteur: '—' },
    { site: 'MEK-019', siteName: 'Échangeur A2', debut: '01/11/2025', fin: '07/05/2026', conducteur: 'Y. Tazi' },
    { site: 'AGD-033', siteName: 'Taghazout Bay', debut: '14/04/2025', fin: '28/10/2025', conducteur: 'S. Fassi' },
  ],
  'CH-03': [
    { site: 'TNG-061', siteName: 'Port Tanger Med', debut: '20/02/2026', fin: null, conducteur: 'M. El Mansouri' },
    { site: 'OUJ-007', siteName: 'STEP Oujda Nord', debut: '03/07/2025', fin: '16/02/2026', conducteur: 'Y. Tazi' },
  ],
  'CA-21': [
    { site: 'MEK-019', siteName: 'Échangeur A2', debut: '12/04/2026', fin: null, conducteur: 'S. Fassi' },
    { site: 'CSB-114', siteName: 'Marina Casa L3', debut: '01/10/2025', fin: '10/04/2026', conducteur: 'K. Benjelloun' },
  ],
  'CA-19': [
    { site: 'AGD-033', siteName: 'Taghazout Bay', debut: '22/03/2026', fin: null, conducteur: '—' },
    { site: 'TNG-061', siteName: 'Port Tanger Med', debut: '05/08/2025', fin: '19/03/2026', conducteur: 'H. Alaoui' },
  ],
  'TO-08': [
    { site: 'CSB-114', siteName: 'Marina Casa L3', debut: '01/01/2026', fin: null, conducteur: 'K. Benjelloun' },
  ],
  'CP-05': [
    { site: null, siteName: 'Parc Casa (disponible)', debut: '01/04/2026', fin: null, conducteur: '—' },
    { site: 'RBT-208', siteName: 'Tramway Rabat', debut: '11/11/2025', fin: '28/03/2026', conducteur: 'H. Alaoui' },
  ],
  'NI-02': [
    { site: 'EXT', siteName: 'Loué — STRS Rabat', debut: '10/04/2026', fin: null, conducteur: '—' },
    { site: 'OUJ-007', siteName: 'STEP Oujda Nord', debut: '01/08/2025', fin: '07/04/2026', conducteur: 'Y. Tazi' },
  ],
  'GE-11': [
    { site: 'OUJ-007', siteName: 'STEP Oujda Nord', debut: '01/03/2026', fin: null, conducteur: 'M. El Mansouri' },
    { site: 'MEK-019', siteName: 'Échangeur A2', debut: '15/09/2025', fin: '27/02/2026', conducteur: 'S. Fassi' },
  ],
  'NA-06': [
    { site: null, siteName: 'Parc Casa (VGP à prévoir)', debut: '01/05/2026', fin: null, conducteur: '—' },
  ],
  'PE-15': [
    { site: 'CSB-176', siteName: 'Réhab. médina', debut: '01/02/2026', fin: null, conducteur: 'S. Fassi' },
    { site: 'AGD-033', siteName: 'Taghazout Bay', debut: '10/08/2025', fin: '28/01/2026', conducteur: 'Y. Tazi' },
  ],
};

// Document checklist per engin
const ENGIN_DOCS = {
  'GR-04': [
    { label: 'Carte grise', status: 'valid', date: '15/03/2025', expire: '15/03/2030' },
    { label: 'Assurance tous risques', status: 'valid', date: '01/01/2026', expire: '31/12/2026' },
    { label: 'Rapport VGP', status: 'amber', date: '12/06/2025', expire: '12/06/2026', note: 'À renouveler avant 12/06/2026' },
    { label: 'Certificat de conformité', status: 'valid', date: '15/03/2024', expire: '15/03/2027' },
    { label: 'Carnet d\'entretien à jour', status: 'valid', date: '28/04/2026', expire: null },
  ],
  'CA-19': [
    { label: 'Carte grise', status: 'valid', date: '08/07/2023', expire: '08/07/2028' },
    { label: 'Assurance tous risques', status: 'expired', date: '01/01/2025', expire: '31/12/2025', note: 'EXPIRÉE — renouveler immédiatement' },
    { label: 'Rapport VGP', status: 'expired', date: '15/05/2025', expire: '15/05/2026', note: 'EXPIRÉE depuis 13 jours' },
    { label: 'Carnet d\'entretien à jour', status: 'amber', date: '10/01/2026', expire: null, note: 'Révision boîte de vitesses en cours' },
  ],
  'NA-06': [
    { label: 'Carte grise', status: 'valid', date: '22/09/2022', expire: '22/09/2027' },
    { label: 'Assurance tous risques', status: 'valid', date: '01/01/2026', expire: '31/12/2026' },
    { label: 'Rapport VGP', status: 'amber', date: '05/06/2025', expire: '05/06/2026', note: 'Expire dans 8 jours — urgent' },
    { label: 'Carnet d\'entretien à jour', status: 'valid', date: '18/02/2026', expire: null },
  ],
};

const DEFAULT_DOCS = [
  { label: 'Carte grise', status: 'valid', date: '01/01/2024', expire: '01/01/2029' },
  { label: 'Assurance tous risques', status: 'valid', date: '01/01/2026', expire: '31/12/2026' },
  { label: 'Rapport VGP', status: 'valid', date: '01/06/2025', expire: '01/06/2026' },
  { label: 'Carnet d\'entretien à jour', status: 'valid', date: '15/03/2026', expire: null },
];

const ENGIN_STATUS = {
  service:     { label: 'En service', tone: 'green' },
  dispo:       { label: 'Disponible', tone: 'blue' },
  maintenance: { label: 'En maintenance', tone: 'amber' },
  panne:       { label: 'En panne', tone: 'red' },
  loue:        { label: 'Loué (externe)', tone: 'ocre' },
};

const ENGIN_CATS = ['Levage', 'Terrassement', 'Transport', 'Béton', 'Compactage', 'Énergie'];

const CHANTIERS_OPTIONS = [
  ['CSB-114', 'CSB-114 · Marina Casa L3'],
  ['RBT-208', 'RBT-208 · Tramway Rabat'],
  ['TNG-061', 'TNG-061 · Port Tanger Med'],
  ['AGD-033', 'AGD-033 · Taghazout Bay'],
  ['MEK-019', 'MEK-019 · Échangeur A2'],
  ['OUJ-007', 'OUJ-007 · STEP Oujda Nord'],
];

const CHANTIER_NAMES = {
  'CSB-114': 'Marina Casa L3',
  'RBT-208': 'Tramway Rabat',
  'TNG-061': 'Port Tanger Med',
  'AGD-033': 'Taghazout Bay',
  'MEK-019': 'Échangeur A2',
  'OUJ-007': 'STEP Oujda Nord',
};

// =============================================================================
function Parc() {
  const [engins, setEngins] = React.useState(ENGINS_SEED);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const [q, setQ] = React.useState('');

  // Drawer state
  const [ficheEngin, setFicheEngin] = React.useState(null); // engin object

  // Modal states
  const [maintenanceOpen, setMaintenanceOpen] = React.useState(false);
  const [affectationOpen, setAffectationOpen] = React.useState(false);

  let rows = engins.slice();
  if (statusFilter !== 'all') rows = rows.filter(e => e.status === statusFilter);
  if (cat !== 'all') rows = rows.filter(e => e.cat === cat);
  if (q) { const Q = q.toLowerCase(); rows = rows.filter(e => (e.code + ' ' + e.type + ' ' + e.marque + ' ' + (e.immat || '')).toLowerCase().includes(Q)); }

  const total = engins.length;
  const service = engins.filter(e => e.status === 'service').length;
  const dispo = engins.filter(e => e.status === 'dispo').length;
  const indispo = engins.filter(e => e.status === 'maintenance' || e.status === 'panne').length;
  const utilMoy = Math.round(engins.filter(e => e.status === 'service' || e.status === 'loue').reduce((s, e) => s + e.util, 0) / engins.filter(e => e.status === 'service' || e.status === 'loue').length);

  // upcoming VGP / maintenance (sorted by days)
  const echeances = engins.filter(e => e.vgpJours <= 60).sort((a, b) => a.vgpJours - b.vgpJours);

  const handleAffectation = (code, chantier, conducteur) => {
    setEngins(prev => prev.map(e =>
      e.code === code
        ? { ...e, site: chantier, siteName: CHANTIER_NAMES[chantier] || chantier, status: 'service' }
        : e
    ));
  };

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
          <Button onClick={() => setMaintenanceOpen(true)} icon={<Icon name="wrench" size={13} stroke={TOKENS.ink2} />}>Carnet d'entretien</Button>
          <Button variant="primary" onClick={() => setAffectationOpen(true)} icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Affecter un engin</Button>
        </div>
      </div>

      {/* KPI strip — refonte UX : 4 indicateurs (le total passe en sous-titre) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <PcKpi label="EN SERVICE" value={service} sub={`affectés chantier · ${total} au parc`} tone="green" delay={60} active={statusFilter === 'service'} onClick={() => setStatusFilter(statusFilter === 'service' ? 'all' : 'service')} />
        <PcKpi label="DISPONIBLES" value={dispo} sub="au parc" tone="blue" delay={120} active={statusFilter === 'dispo'} onClick={() => setStatusFilter(statusFilter === 'dispo' ? 'all' : 'dispo')} />
        <PcKpi label="IMMOBILISÉS" value={indispo} sub="maint. / panne" tone="red" delay={180} active={statusFilter === 'panne'} onClick={() => setStatusFilter(statusFilter === 'panne' ? 'all' : 'panne')} />
        <PcKpi label="TAUX D'UTILISATION" value={utilMoy + '%'} sub="moy. engins actifs" delay={240} tone="ink" />
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
        <EnginGrid rows={rows} onCardClick={setFicheEngin} />
        <MaintenancePanel echeances={echeances} />
      </div>

      {/* Fiche engin drawer */}
      {ficheEngin && (
        <FicheEnginDrawer
          engin={ficheEngin}
          onClose={() => setFicheEngin(null)}
        />
      )}

      {/* Maintenance modal */}
      {maintenanceOpen && (
        <MaintenanceModal
          engins={engins}
          onClose={() => setMaintenanceOpen(false)}
        />
      )}

      {/* Affectation modal */}
      {affectationOpen && (
        <AffectationModal
          engins={engins}
          onClose={() => setAffectationOpen(false)}
          onConfirm={handleAffectation}
        />
      )}
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
function EnginGrid({ rows, onCardClick }) {
  if (rows.length === 0) return (
    <Card padding={48} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 8 }}>AUCUN ENGIN</div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, margin: 0, color: TOKENS.ink }}>Aucun engin pour ces filtres.</h3>
    </Card>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
      {rows.map((e, i) => <EnginCard key={e.code} e={e} delay={i * 30} onClick={() => onCardClick(e)} />)}
    </div>
  );
}

function EnginCard({ e, delay, onClick }) {
  const s = ENGIN_STATUS[e.status];
  const catIcon = { Levage: 'box', Terrassement: 'truck', Transport: 'truck', Béton: 'truck', Compactage: 'truck', Énergie: 'settings' }[e.cat] || 'truck';
  const vgpSoon = e.vgpJours <= 15;
  const vgpLate = e.vgpJours < 0;
  return (
    <Card hoverable padding={0} delay={delay} onClick={onClick} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
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
            <a href={`#fiche-${e.site}`} onClick={ev => ev.stopPropagation()} style={{ fontSize: 12, color: TOKENS.ink2, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
// FICHE ENGIN DRAWER
// -----------------------------------------------------------------------------
function FicheEnginDrawer({ engin, onClose }) {
  const [tab, setTab] = React.useState('apercu');
  const s = ENGIN_STATUS[engin.status];
  const catIcon = { Levage: 'box', Terrassement: 'truck', Transport: 'truck', Béton: 'truck', Compactage: 'truck', Énergie: 'settings' }[engin.cat] || 'truck';
  const vgpSoon = engin.vgpJours <= 15;
  const vgpLate = engin.vgpJours < 0;

  const history = ENGIN_HISTORY[engin.code] || [];
  const docs = ENGIN_DOCS[engin.code] || DEFAULT_DOCS;

  const tabs = [
    { id: 'apercu', label: 'Aperçu' },
    { id: 'historique', label: 'Historique' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <Drawer
      open={true}
      onClose={onClose}
      title={engin.code + ' · ' + engin.type}
      subtitle={engin.marque + (engin.immat && engin.immat !== '—' ? ' · ' + engin.immat : '')}
      width={480}
    >
      {/* Photo placeholder */}
      <div style={{
        width: '100%', height: 160, borderRadius: 8, marginBottom: 20,
        background: TOKENS.bgWarm, border: `1px solid ${TOKENS.line}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <Icon name={catIcon} size={40} stroke={TOKENS.ink4} strokeWidth={1} />
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink4, letterSpacing: '0.12em' }}>PHOTO ENGIN</span>
      </div>

      {/* Status + affectation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Pill tone={s.tone} dot>{s.label}</Pill>
        {engin.site && engin.site !== 'EXT' && (
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep }}>{engin.site} · {engin.siteName}</span>
        )}
        {(!engin.site || engin.site === 'EXT') && (
          <span style={{ fontSize: 12, color: TOKENS.ink3 }}>{engin.siteName || 'Non affecté'}</span>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '9px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? TOKENS.ink : TOKENS.ink3,
            borderBottom: tab === t.id ? `2px solid ${TOKENS.ocre}` : '2px solid transparent',
            marginBottom: -1,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Aperçu */}
      {tab === 'apercu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FicheField label="CATÉGORIE" value={engin.cat} />
            <FicheField label="COMPTEUR" value={engin.compteur} mono />
            <FicheField label="COÛT / JOUR" value={fmtMAD(engin.coutJour) + ' DH'} mono />
            <FicheField label="TAUX UTILISATION" value={engin.util + '%'} mono />
          </div>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 6 }}>PROCHAINE VGP</div>
            <div style={{
              padding: '10px 14px', borderRadius: 7,
              background: vgpLate ? TOKENS.redSoft : vgpSoon ? TOKENS.amberSoft : TOKENS.greenSoft,
              border: `1px solid ${vgpLate ? TOKENS.red : vgpSoon ? TOKENS.amber : TOKENS.green}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: vgpLate ? TOKENS.red : vgpSoon ? 'oklch(0.45 0.10 75)' : TOKENS.green, fontWeight: 500 }}>
                {engin.vgp}
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: vgpLate ? TOKENS.red : vgpSoon ? 'oklch(0.45 0.10 75)' : TOKENS.green }}>
                {vgpLate ? `RETARD — ${Math.abs(engin.vgpJours)} j` : `dans ${engin.vgpJours} j`}
              </span>
            </div>
          </div>
          {engin.note && (
            <div style={{
              padding: '10px 14px', borderRadius: 7, fontSize: 12, lineHeight: 1.5,
              background: engin.alerte ? TOKENS.redSoft : TOKENS.bg,
              color: engin.alerte ? TOKENS.red : TOKENS.ink2,
              border: `1px solid ${engin.alerte ? TOKENS.red : TOKENS.line}`,
            }}>
              <strong>Note :</strong> {engin.note}
            </div>
          )}
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 8 }}>TAUX D'UTILISATION</div>
            <Progress value={engin.util} tone={engin.util >= 80 ? 'green' : engin.util >= 50 ? 'ocre' : engin.util > 0 ? 'amber' : 'red'} height={8} showLabel />
          </div>
        </div>
      )}

      {/* Tab: Historique affectation */}
      {tab === 'historique' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {history.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: TOKENS.ink3, fontSize: 13 }}>
              Aucun historique disponible.
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
              {/* Timeline line */}
              {i < history.length - 1 && (
                <div style={{ position: 'absolute', left: 14, top: 28, bottom: 0, width: 2, background: TOKENS.line }} />
              )}
              {/* Dot */}
              <div style={{
                width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                background: h.fin === null ? TOKENS.greenSoft : TOKENS.bgWarm,
                border: `2px solid ${h.fin === null ? TOKENS.green : TOKENS.line2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                <Icon name="sites" size={12} stroke={h.fin === null ? TOKENS.green : TOKENS.ink3} />
              </div>
              <div style={{ flex: 1, paddingTop: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  {h.site && h.site !== 'EXT' && (
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, fontWeight: 500 }}>{h.site}</span>
                  )}
                  <span style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{h.siteName}</span>
                  {h.fin === null && <Pill tone="green" dot>En cours</Pill>}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginBottom: 4 }}>
                  {h.debut} → {h.fin || 'aujourd\'hui'}
                </div>
                <div style={{ fontSize: 11, color: TOKENS.ink3 }}>
                  <Icon name="user" size={11} stroke={TOKENS.ink3} /> {h.conducteur}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Documents */}
      {tab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: TOKENS.ink3, marginBottom: 4 }}>
            Checklist documentaire — {docs.filter(d => d.status === 'valid').length}/{docs.length} document(s) valide(s)
          </div>
          {docs.map((doc, i) => {
            const colors = {
              valid:   { bg: TOKENS.greenSoft, border: TOKENS.green, icon: 'check', iconColor: TOKENS.green, labelColor: TOKENS.green },
              expired: { bg: TOKENS.redSoft,   border: TOKENS.red,   icon: 'x',     iconColor: TOKENS.red,   labelColor: TOKENS.red },
              amber:   { bg: TOKENS.amberSoft, border: TOKENS.amber, icon: 'warning', iconColor: TOKENS.amber, labelColor: 'oklch(0.45 0.10 75)' },
            };
            const c = colors[doc.status] || colors.valid;
            return (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 7,
                background: c.bg, border: `1px solid ${c.border}`,
                display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: 'rgba(255,255,255,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={c.icon} size={14} stroke={c.iconColor} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.ink, marginBottom: 3 }}>{doc.label}</div>
                  {doc.date && (
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
                      Délivré : {doc.date}{doc.expire ? ` · Expire : ${doc.expire}` : ''}
                    </div>
                  )}
                  {doc.note && (
                    <div style={{ fontSize: 11, color: c.labelColor, marginTop: 4, fontWeight: 500 }}>{doc.note}</div>
                  )}
                </div>
                <Pill tone={doc.status === 'valid' ? 'green' : doc.status === 'expired' ? 'red' : 'amber'} mono>
                  {doc.status === 'valid' ? 'Valide' : doc.status === 'expired' ? 'Expiré' : 'À renouveler'}
                </Pill>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}

function FicheField({ label, value, mono }) {
  return (
    <div style={{ padding: '10px 12px', background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}` }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// MAINTENANCE MODAL
// -----------------------------------------------------------------------------
function MaintenanceModal({ engins, onClose }) {
  const [form, setForm] = React.useState({
    engin: engins[0]?.code || '',
    type: 'Préventive',
    date: '',
    prestataire: '',
    cout: '',
    duree: '',
    pieces: '',
    observations: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleConfirm = () => {
    if (!form.engin || !form.date) {
      window.toast('Engin et date requis', 'error');
      return;
    }
    window.toast('Intervention enregistrée', 'success');
    onClose();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Carnet d'entretien — Nouvelle intervention"
      subtitle="Enregistrer une opération de maintenance"
      width={560}
      footer={
        <>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={handleConfirm}>Enregistrer</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldGroup label="Engin" required>
            <Select
              value={form.engin}
              onChange={v => set('engin', v)}
              options={engins.map(e => [e.code, e.code + ' · ' + e.type])}
            />
          </FieldGroup>
          <FieldGroup label="Type d'intervention" required>
            <Select
              value={form.type}
              onChange={v => set('type', v)}
              options={['Préventive', 'Curative', 'VGP']}
            />
          </FieldGroup>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldGroup label="Date" required>
            <TextInput type="date" value={form.date} onChange={v => set('date', v)} mono />
          </FieldGroup>
          <FieldGroup label="Prestataire">
            <TextInput value={form.prestataire} onChange={v => set('prestataire', v)} placeholder="Nom atelier / société" />
          </FieldGroup>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldGroup label="Coût (DH)">
            <TextInput value={form.cout} onChange={v => set('cout', v)} placeholder="0" mono type="number" />
          </FieldGroup>
          <FieldGroup label="Durée immobilisation (jours)">
            <TextInput value={form.duree} onChange={v => set('duree', v)} placeholder="0" mono type="number" />
          </FieldGroup>
        </div>
        <FieldGroup label="Pièces remplacées">
          <TextArea value={form.pieces} onChange={v => set('pieces', v)} placeholder="Lister les pièces remplacées…" rows={2} />
        </FieldGroup>
        <FieldGroup label="Observations">
          <TextArea value={form.observations} onChange={v => set('observations', v)} placeholder="Observations, recommandations…" rows={3} />
        </FieldGroup>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// AFFECTATION MODAL
// -----------------------------------------------------------------------------
function AffectationModal({ engins, onClose, onConfirm }) {
  const [form, setForm] = React.useState({
    engin: engins.find(e => e.status === 'dispo')?.code || engins[0]?.code || '',
    chantier: 'CSB-114',
    dateDebut: '',
    dateFin: '',
    conducteur: '',
    tauxHoraire: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleConfirm = () => {
    if (!form.engin || !form.chantier || !form.dateDebut) {
      window.toast('Engin, chantier et date début requis', 'error');
      return;
    }
    onConfirm(form.engin, form.chantier, form.conducteur);
    window.toast('Engin affecté au chantier', 'success');
    onClose();
  };

  const conducteurs = ['K. Benjelloun', 'H. Alaoui', 'M. El Mansouri', 'S. Fassi', 'Y. Tazi'];

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Affecter un engin"
      subtitle="Assigner un engin à un chantier"
      width={520}
      footer={
        <>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={handleConfirm}>Confirmer l'affectation</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldGroup label="Engin" required>
            <Select
              value={form.engin}
              onChange={v => set('engin', v)}
              options={engins.map(e => [e.code, e.code + ' · ' + e.type])}
            />
          </FieldGroup>
          <FieldGroup label="Chantier" required>
            <Select
              value={form.chantier}
              onChange={v => set('chantier', v)}
              options={CHANTIERS_OPTIONS}
            />
          </FieldGroup>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldGroup label="Date début" required>
            <TextInput type="date" value={form.dateDebut} onChange={v => set('dateDebut', v)} mono />
          </FieldGroup>
          <FieldGroup label="Date fin prévisionnelle">
            <TextInput type="date" value={form.dateFin} onChange={v => set('dateFin', v)} mono />
          </FieldGroup>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldGroup label="Conducteur attitré">
            <Select
              value={form.conducteur}
              onChange={v => set('conducteur', v)}
              options={[['', '— Non assigné —'], ...conducteurs.map(c => [c, c])]}
            />
          </FieldGroup>
          <FieldGroup label="Taux horaire facturé (DH/h)">
            <TextInput value={form.tauxHoraire} onChange={v => set('tauxHoraire', v)} placeholder="0" mono type="number" />
          </FieldGroup>
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// MAINTENANCE PANEL — Enriched VGP Calendar
// -----------------------------------------------------------------------------
function MaintenancePanel({ echeances }) {
  return (
    <Card padding={0} delay={420} style={{ position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 9 }}>
        <Icon name="wrench" size={15} stroke={TOKENS.ocreDeep} />
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 3 }}>ÉCHÉANCIER</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink }}>Calendrier VGP</div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: '8px 16px', borderBottom: `1px solid ${TOKENS.line}`, background: TOKENS.bg, display: 'flex', gap: 12 }}>
        {[
          { color: TOKENS.red, label: 'En retard' },
          { color: TOKENS.amber, label: '≤ 15 j' },
          { color: TOKENS.green, label: '> 15 j' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.06em' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ maxHeight: 500, overflowY: 'auto' }}>
        {echeances.map((e, i) => {
          const late = e.vgpJours < 0;
          const soon = e.vgpJours <= 15;
          const urgencyColor = late ? TOKENS.red : soon ? TOKENS.amber : TOKENS.green;
          const urgencyBg = late ? TOKENS.redSoft : soon ? TOKENS.amberSoft : TOKENS.greenSoft;

          return (
            <div key={e.code} className="erp-row" style={{
              padding: '11px 16px',
              borderBottom: i < echeances.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 11,
              borderLeft: `3px solid ${urgencyColor}`,
            }}>
              {/* Days badge */}
              <div style={{
                width: 44, height: 40, flexShrink: 0,
                borderRadius: 6,
                background: urgencyBg,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, lineHeight: 1,
                  color: late ? TOKENS.red : soon ? 'oklch(0.45 0.10 75)' : TOKENS.green,
                }}>
                  {late ? '!' : Math.abs(e.vgpJours)}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: urgencyColor, marginTop: 2, letterSpacing: '0.04em' }}>
                  {late ? 'RETARD' : 'J'}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep, fontSize: 11 }}>{e.code}</span>
                  {' · '}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.type}</span>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3 }}>VGP · {e.vgp}</div>
              </div>

              <Pill tone={late ? 'red' : soon ? 'amber' : 'green'} mono>
                {late ? 'Retard' : soon ? 'Urgent' : 'OK'}
              </Pill>
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
