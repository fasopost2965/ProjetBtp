/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, Sparkline, fmtMAD */
// =============================================================================
// ERP — Screen 02 — Liste des chantiers
// =============================================================================

const CHANTIERS = [
  { code: 'CSB-114', name: 'Marina Casablanca — Lot 3 résidentiel', client: 'Al Omrane Régional', city: 'Casablanca', region: 'Casa-Settat', type: 'Bâtiment', conducteur: 'K. Benjelloun', physique: 47, budget: 52, marge: 12.0, montant: 84_500_000, debut: '01/2025', fin: '03/2027', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'RBT-208', name: 'Tramway Rabat-Salé — Extension ligne 2', client: 'STRS', city: 'Rabat', region: 'Rabat-Salé-Kénitra', type: 'TP / VRD', conducteur: 'H. Alaoui', physique: 12, budget: 18, marge: 13.1, montant: 142_000_000, debut: '11/2025', fin: '06/2028', status: 'Démarrage', tone: 'blue', alert: 1 },
  { code: 'TNG-061', name: 'Port Tanger Med — Digue secondaire', client: 'TMSA', city: 'Tanger', region: 'Tanger-Tétouan', type: 'Génie civil', conducteur: 'M. El Mansouri', physique: 89, budget: 84, marge: 17.0, montant: 67_300_000, debut: '03/2024', fin: '07/2026', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'AGD-033', name: 'Hôtel Taghazout Bay — Gros œuvre', client: 'SAPST', city: 'Agadir', region: 'Souss-Massa', type: 'Bâtiment', conducteur: 'S. Fassi', physique: 64, budget: 71, marge: 8.0, montant: 38_900_000, debut: '06/2024', fin: '11/2026', status: 'En retard', tone: 'amber', alert: 2 },
  { code: 'MEK-019', name: 'Échangeur autoroute A2 — PK 142', client: 'ADM', city: 'Meknès', region: 'Fès-Meknès', type: 'TP / VRD', conducteur: 'Y. Tazi', physique: 31, budget: 29, marge: 14.0, montant: 56_700_000, debut: '04/2025', fin: '01/2027', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'CSB-098', name: 'Centre commercial Sidi Maârouf', client: 'Aksal Group', city: 'Casablanca', region: 'Casa-Settat', type: 'Bâtiment', conducteur: 'K. Benjelloun', physique: 95, budget: 92, marge: 17.0, montant: 124_200_000, debut: '02/2023', fin: '06/2026', status: 'Réception', tone: 'ocre', alert: 0 },
  { code: 'CSB-201', name: 'Résidence Anfa Place tour B', client: 'Yamed Capital', city: 'Casablanca', region: 'Casa-Settat', type: 'Bâtiment', conducteur: 'K. Benjelloun', physique: 22, budget: 25, marge: 11.5, montant: 78_400_000, debut: '09/2025', fin: '12/2027', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'RBT-184', name: 'Université Med VI — Bibliothèque', client: 'Min. Éducation', city: 'Rabat', region: 'Rabat-Salé-Kénitra', type: 'Bâtiment', conducteur: 'H. Alaoui', physique: 78, budget: 76, marge: 12.8, montant: 42_100_000, debut: '07/2024', fin: '09/2026', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'OUJ-007', name: 'Station d\'épuration Oujda Nord', client: 'ONEE Branche Eau', city: 'Oujda', region: 'Oriental', type: 'Génie civil', conducteur: 'Y. Tazi', physique: 4, budget: 6, marge: 13.5, montant: 31_500_000, debut: '03/2026', fin: '08/2027', status: 'Démarrage', tone: 'blue', alert: 0 },
  { code: 'TNG-118', name: 'Logements sociaux Mghogha', client: 'Al Omrane', city: 'Tanger', region: 'Tanger-Tétouan', type: 'Bâtiment', conducteur: 'M. El Mansouri', physique: 100, budget: 100, marge: 9.2, montant: 28_700_000, debut: '01/2024', fin: '04/2026', status: 'Livré', tone: 'neutral', alert: 0 },
  { code: 'CSB-176', name: 'Réhabilitation médina — Tranche 2', client: 'Casa Aménagement', city: 'Casablanca', region: 'Casa-Settat', type: 'Réhab.', conducteur: 'S. Fassi', physique: 53, budget: 58, marge: 7.4, montant: 18_900_000, debut: '02/2025', fin: '10/2026', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'AGD-052', name: 'Lycée Dakhla — Bloc administratif', client: 'AREF Souss', city: 'Dakhla', region: 'Dakhla-Oued Eddahab', type: 'Bâtiment', conducteur: 'S. Fassi', physique: 41, budget: 45, marge: 10.8, montant: 22_400_000, debut: '08/2025', fin: '03/2027', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'FES-022', name: 'Hôpital régional Fès — Extension', client: 'Min. Santé', city: 'Fès', region: 'Fès-Meknès', type: 'Bâtiment', conducteur: 'Y. Tazi', physique: 67, budget: 70, marge: 12.0, montant: 91_500_000, debut: '05/2024', fin: '12/2026', status: 'En cours', tone: 'green', alert: 1 },
  { code: 'CSB-130', name: 'Pôle logistique Mediouna', client: 'Marsa Maroc', city: 'Casablanca', region: 'Casa-Settat', type: 'Industriel', conducteur: 'K. Benjelloun', physique: 88, budget: 91, marge: 15.5, montant: 54_300_000, debut: '11/2024', fin: '07/2026', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'RBT-241', name: 'Pont sur Bouregreg PK 8', client: 'ADM', city: 'Rabat', region: 'Rabat-Salé-Kénitra', type: 'Génie civil', conducteur: 'H. Alaoui', physique: 38, budget: 33, marge: 14.2, montant: 88_600_000, debut: '06/2025', fin: '11/2027', status: 'En cours', tone: 'green', alert: 0 },
  { code: 'TET-014', name: 'Marché de gros Tétouan', client: 'Commune Tétouan', city: 'Tétouan', region: 'Tanger-Tétouan', type: 'Bâtiment', conducteur: 'M. El Mansouri', physique: 0, budget: 0, marge: 11.0, montant: 19_800_000, debut: '07/2026', fin: '02/2028', status: 'À démarrer', tone: 'neutral', alert: 0 },
];

const REGIONS  = ['Casa-Settat', 'Rabat-Salé-Kénitra', 'Tanger-Tétouan', 'Fès-Meknès', 'Souss-Massa', 'Oriental', 'Dakhla-Oued Eddahab'];
const TYPES    = ['Bâtiment', 'TP / VRD', 'Génie civil', 'Industriel', 'Réhab.'];
const STATUSES = ['En cours', 'Démarrage', 'En retard', 'Réception', 'À démarrer', 'Livré'];

// -----------------------------------------------------------------------------
function Chantiers() {
  const [view, setView]       = React.useState('list'); // list | grid
  const [filter, setFilter]   = React.useState('all');  // all | actifs | retard | reception | demarrage
  const [region, setRegion]   = React.useState('all');
  const [type, setType]       = React.useState('all');
  const [q, setQ]             = React.useState('');
  const [sort, setSort]       = React.useState('avancement'); // avancement | montant | fin
  const [createOpen, setCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const h = (e) => { if (e.detail?.key === 'newSite') setCreateOpen(true); };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  let rows = CHANTIERS.slice();
  if (filter === 'actifs')    rows = rows.filter(r => ['En cours', 'Démarrage'].includes(r.status));
  if (filter === 'retard')    rows = rows.filter(r => r.status === 'En retard');
  if (filter === 'reception') rows = rows.filter(r => r.status === 'Réception');
  if (filter === 'demarrage') rows = rows.filter(r => ['Démarrage', 'À démarrer'].includes(r.status));
  if (filter === 'livres')    rows = rows.filter(r => r.status === 'Livré');
  if (region !== 'all') rows = rows.filter(r => r.region === region);
  if (type   !== 'all') rows = rows.filter(r => r.type === type);
  if (q) {
    const Q = q.toLowerCase();
    rows = rows.filter(r => (r.code + ' ' + r.name + ' ' + r.client + ' ' + r.conducteur).toLowerCase().includes(Q));
  }
  if (sort === 'avancement') rows.sort((a, b) => b.physique - a.physique);
  if (sort === 'montant')    rows.sort((a, b) => b.montant  - a.montant);
  if (sort === 'fin')        rows.sort((a, b) => a.fin.split('/').reverse().join('') < b.fin.split('/').reverse().join('') ? -1 : 1);

  // Header KPIs
  const total      = CHANTIERS.length;
  const actifs     = CHANTIERS.filter(c => ['En cours', 'Démarrage'].includes(c.status)).length;
  const retard     = CHANTIERS.filter(c => c.status === 'En retard').length;
  const reception  = CHANTIERS.filter(c => c.status === 'Réception').length;
  const montantTot = CHANTIERS.reduce((s, c) => s + c.montant, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            CHANTIERS · PORTEFEUILLE ACTIF
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.15 }}>
            Tous les chantiers <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· exercice 2026</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Exporter</Button>
          <Button icon={<Icon name="pin" size={13} stroke={TOKENS.ink2} />}>Vue carte</Button>
          <Button variant="primary" onClick={() => setCreateOpen(true)} icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>
            Nouveau chantier
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <KpiTile label="PORTEFEUILLE TOTAL" value={total} unit="chantiers" delay={60} active={filter === 'all'} onClick={() => setFilter('all')} />
        <KpiTile label="ACTIFS" value={actifs} unit="en exécution" delay={120} active={filter === 'actifs'} onClick={() => setFilter('actifs')} />
        <KpiTile label="EN RETARD" value={retard} unit="alerte planning" tone="amber" delay={180} active={filter === 'retard'} onClick={() => setFilter('retard')} />
        <KpiTile label="EN RÉCEPTION" value={reception} unit="finalisation" tone="ocre" delay={240} active={filter === 'reception'} onClick={() => setFilter('reception')} />
        <KpiTile label="CARNET DE COMMANDES" value={fmtMAD(montantTot)} unit="DH" delay={300} tone="ink" />
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }} className="erp-fade-in">
        <div className="erp-search" style={{
          flex: '1 1 240px', minWidth: 200, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px', height: 36,
          background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6,
        }}>
          <Icon name="search" size={14} stroke={TOKENS.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Rechercher code, nom, client, conducteur…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} />
          {q && (
            <button onClick={() => setQ('')} style={{ border: 'none', background: 'transparent', color: TOKENS.ink3, cursor: 'pointer', padding: 2 }}>
              <Icon name="x" size={12} />
            </button>
          )}
        </div>

        <Dropdown
          label="Région"
          value={region}
          onChange={setRegion}
          options={[['all', 'Toutes régions'], ...REGIONS.map(r => [r, r])]}
        />
        <Dropdown
          label="Type"
          value={type}
          onChange={setType}
          options={[['all', 'Tous types'], ...TYPES.map(t => [t, t])]}
        />
        <Dropdown
          label="Tri"
          value={sort}
          onChange={setSort}
          options={[
            ['avancement', 'Avancement ↓'],
            ['montant',    'Montant ↓'],
            ['fin',        'Date de fin ↑'],
          ]}
        />

        <div style={{ display: 'flex', background: TOKENS.bgWarm, borderRadius: 6, padding: 2 }}>
          {[['list', 'Liste'], ['grid', 'Cartes']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{
              padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: view === id ? TOKENS.paper : 'transparent',
              color: view === id ? TOKENS.ink : TOKENS.ink3,
              fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
              boxShadow: view === id ? '0 1px 2px rgba(26,24,20,0.08)' : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, letterSpacing: '0.04em', marginTop: -8 }}>
        {rows.length} chantier{rows.length > 1 ? 's' : ''} affiché{rows.length > 1 ? 's' : ''}
        {(region !== 'all' || type !== 'all' || filter !== 'all' || q) && (
          <button onClick={() => { setFilter('all'); setRegion('all'); setType('all'); setQ(''); }}
            style={{ marginLeft: 12, background: 'transparent', border: 'none', color: TOKENS.ocreDeep, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
            ✕ Réinitialiser les filtres
          </button>
        )}
      </div>

      {view === 'list' ? <ListView rows={rows} /> : <GridView rows={rows} />}

      {createOpen && <window.NewChantierModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
// KPI tile (clickable as a filter)
// -----------------------------------------------------------------------------
function KpiTile({ label, value, unit, tone, delay, active, onClick }) {
  const dark = tone === 'ink';
  return (
    <button onClick={onClick} className="erp-card erp-fade-in" style={{
      animationDelay: delay + 'ms',
      background: dark ? TOKENS.ink : (active ? TOKENS.bgWarm : TOKENS.paper),
      border: `1px solid ${active ? TOKENS.ink : (dark ? TOKENS.ink : TOKENS.line)}`,
      borderRadius: 8, padding: 16,
      cursor: onClick ? 'pointer' : 'default', textAlign: 'left',
      fontFamily: 'inherit',
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5,
        color: dark ? TOKENS.ocre : (tone === 'amber' ? TOKENS.amber : tone === 'ocre' ? TOKENS.ocreDeep : TOKENS.ink3),
        letterSpacing: '0.12em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 24, letterSpacing: '-0.025em',
          color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10,
          color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{unit}</span>}
      </div>
    </button>
  );
}

// -----------------------------------------------------------------------------
// Dropdown
// -----------------------------------------------------------------------------
function Dropdown({ label, value, onChange, options }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const current = options.find(o => o[0] === value)?.[1] || options[0][1];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 36, padding: '0 12px',
        background: TOKENS.paper, border: `1px solid ${TOKENS.line2}`, borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink,
      }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>
          {label.toUpperCase()}
        </span>
        <span>{current}</span>
        <Icon name="chevronDown" size={12} stroke={TOKENS.ink3} />
      </button>
      {open && (
        <div className="erp-fade-in" style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          minWidth: 200, background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`, borderRadius: 6,
          boxShadow: '0 12px 30px -12px rgba(26,24,20,0.18)',
          padding: 4, zIndex: 40,
        }}>
          {options.map(([id, lbl]) => (
            <button key={id} onClick={() => { onChange(id); setOpen(false); }} className="erp-nav-item" style={{
              width: '100%', padding: '7px 10px',
              background: value === id ? TOKENS.bgWarm : 'transparent',
              border: 'none', borderRadius: 4,
              fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink,
              textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>{lbl}</span>
              {value === id && <Icon name="check" size={12} stroke={TOKENS.ocreDeep} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// LIST VIEW — table
// -----------------------------------------------------------------------------
function ListView({ rows }) {
  if (rows.length === 0) return <EmptyState />;
  const cols = '120px 110px 1fr 160px 130px 200px 130px 110px';
  return (
    <Card padding={0} delay={360}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: cols, gap: 12,
        padding: '12px 22px', background: TOKENS.bg,
        borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span>Code</span>
        <span>Statut</span>
        <span>Chantier</span>
        <span>Client</span>
        <span>Conducteur</span>
        <span>Avancement</span>
        <span style={{ textAlign: 'right' }}>Montant HT</span>
        <span style={{ textAlign: 'right' }}>Échéance</span>
      </div>
      {rows.map((c, i) => (
        <a key={c.code} href={`#fiche-${c.code}`} className="erp-row" style={{
          display: 'grid', gridTemplateColumns: cols, gap: 12,
          padding: '14px 22px',
          borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          alignItems: 'center', textDecoration: 'none', color: 'inherit',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{c.code}</span>
            {c.alert > 0 && (
              <span data-tip={`${c.alert} alerte${c.alert > 1 ? 's' : ''} ouverte${c.alert > 1 ? 's' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 16, height: 16, borderRadius: 999, background: TOKENS.redSoft, color: TOKENS.red,
                  fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 600 }}>
                {c.alert}
              </span>
            )}
          </div>
          <div><Pill tone={c.tone} dot>{c.status}</Pill></div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>
              {c.type} · {c.city}
            </div>
          </div>
          <div style={{ fontSize: 12, color: TOKENS.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.client}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 999,
              background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 9.5,
            }}>{c.conducteur.split('. ')[1]?.[0] || c.conducteur[0]}</div>
            <span style={{ fontSize: 12, color: TOKENS.ink2 }}>{c.conducteur}</span>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
              <span style={{ color: TOKENS.ink }}>{c.physique}%</span>
              <span>cible {c.budget}%</span>
            </div>
            <Progress value={c.physique} target={c.budget}
              tone={c.physique < c.budget - 5 ? 'red' : c.physique > c.budget + 2 ? 'green' : 'ocre'}
              height={5} />
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>
            {fmtMAD(c.montant)}
            <div style={{ fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>DH HT</div>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>
            {c.fin}
          </div>
        </a>
      ))}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// GRID VIEW — cards
// -----------------------------------------------------------------------------
function GridView({ rows }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
      {rows.map((c, i) => (
        <a key={c.code} href={`#fiche-${c.code}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card hoverable padding={0} delay={i * 30} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Placeholder photo */}
            <div style={{
              height: 110, position: 'relative', overflow: 'hidden',
              background: `repeating-linear-gradient(135deg, ${TOKENS.bgWarm}, ${TOKENS.bgWarm} 6px, ${TOKENS.bg} 6px, ${TOKENS.bg} 12px)`,
              borderTopLeftRadius: 7, borderTopRightRadius: 7,
              borderBottom: `1px solid ${TOKENS.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                <Pill mono>{c.code}</Pill>
                <Pill tone={c.tone} dot>{c.status}</Pill>
              </div>
              {c.alert > 0 && (
                <div style={{ position: 'absolute', top: 10, right: 10 }}>
                  <Pill tone="red" dot>{c.alert} alerte{c.alert > 1 ? 's' : ''}</Pill>
                </div>
              )}
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.1em' }}>
                PHOTO CHANTIER
              </span>
            </div>
            <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14.5, color: TOKENS.ink, lineHeight: 1.3, marginBottom: 4, letterSpacing: '-0.01em' }}>
                {c.name}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginBottom: 14 }}>
                {c.client} · {c.city}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, color: TOKENS.ink2 }}>
                  <span>Avancement physique</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 500, color: TOKENS.ink }}>{c.physique}%</span>
                </div>
                <Progress value={c.physique} target={c.budget}
                  tone={c.physique < c.budget - 5 ? 'red' : c.physique > c.budget + 2 ? 'green' : 'ocre'}
                  height={5} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 'auto',
                paddingTop: 14, borderTop: `1px solid ${TOKENS.line}` }}>
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>MONTANT HT</div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink, fontWeight: 500, marginTop: 2 }}>
                    {fmtMAD(c.montant)} <span style={{ color: TOKENS.ink3 }}>DH</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>LIVRAISON</div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink, fontWeight: 500, marginTop: 2 }}>
                    {c.fin}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
function EmptyState() {
  return (
    <Card padding={48} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 8 }}>
        AUCUN RÉSULTAT
      </div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, margin: 0, color: TOKENS.ink }}>
        Aucun chantier ne correspond à ces filtres.
      </h3>
      <p style={{ color: TOKENS.ink3, fontSize: 13, marginTop: 8 }}>
        Essayez d'élargir les critères ou de réinitialiser la recherche.
      </p>
    </Card>
  );
}

Object.assign(window, { Chantiers });
