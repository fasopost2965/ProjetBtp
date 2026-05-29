/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, fmtMAD */
// =============================================================================
// ERP — Achats / Bons de commande
// Cycle : Demande d'achat → Validation conducteur → Validation chef centre →
//         Bon de commande émis → Réception magasin → Facture fournisseur
// =============================================================================

const FOURNISSEURS = {
  SON:  { name: 'Sonasid',                  cat: 'Acier',     ice: '001234567000089' },
  LAF:  { name: 'LafargeHolcim Maroc',      cat: 'Ciment',    ice: '000111222000033' },
  GRF:  { name: 'Granulats du Souss',       cat: 'Granulats', ice: '001498712000044' },
  ALB:  { name: 'Aluminium Berrechid',      cat: 'Menuis. alu', ice: '002344812000017' },
  SOTR: { name: 'SOTRAVO Étanchéité',       cat: 'Sous-traitant', ice: '001789444000012' },
  CIM:  { name: 'CIMAR Béton prêt à l\'emploi', cat: 'BPE', ice: '000556677000098' },
  ELC:  { name: 'Électrique du Maroc',      cat: 'Élec. CFO/CFA', ice: '001999777000056' },
  TIM:  { name: 'TIM Locations engins',     cat: 'Location matériel', ice: '002112233000088' },
  GAZ:  { name: 'Afriquia Gaz',             cat: 'Carburant',  ice: '000332211000071' },
};

const BCS = [
  { num: 'BC-2026/0142', date: '27/05/2026', site: 'CSB-114', siteName: 'Marina Casa L3', fournisseur: 'SON', items: 'TOR Ø12, Ø16, Ø20 — 28 t', montant: 482_000, status: 'attente-cond', delai: '03/06/2026', urgent: true, demandeur: 'H. Bouhsina' },
  { num: 'BC-2026/0141', date: '27/05/2026', site: 'CSB-114', siteName: 'Marina Casa L3', fournisseur: 'CIM', items: 'BPE C25/30 — 280 m³ sur 4 toupies', montant: 312_000, status: 'attente-centre', delai: '02/06/2026', demandeur: 'H. Bouhsina' },
  { num: 'BC-2026/0140', date: '27/05/2026', site: 'RBT-208', siteName: 'Tramway Rabat-Salé', fournisseur: 'TIM', items: 'Location pelle 30t + chauffeur — 4 sem.', montant: 168_000, status: 'attente-cond', delai: '05/06/2026', demandeur: 'H. Alaoui' },
  { num: 'BC-2026/0139', date: '26/05/2026', site: 'TNG-061', siteName: 'Port Tanger Med', fournisseur: 'GRF', items: 'Enrochement 1–3t — 850 t', montant: 215_000, status: 'attente-centre', delai: '04/06/2026', demandeur: 'M. El Mansouri' },
  { num: 'BC-2026/0138', date: '26/05/2026', site: 'AGD-033', siteName: 'Taghazout Bay', fournisseur: 'ALB', items: 'Menuiserie alu — façade R+2 (lot 4)', montant: 1_240_000, status: 'attente-dg', delai: '08/06/2026', urgent: true, demandeur: 'S. Fassi' },
  { num: 'BC-2026/0137', date: '25/05/2026', site: 'CSB-114', siteName: 'Marina Casa L3', fournisseur: 'LAF', items: 'Ciment CPJ45 — 60 t en sacs', montant: 92_400, status: 'emis', delai: '28/05/2026', demandeur: 'H. Bouhsina', emisLe: '25/05/2026' },
  { num: 'BC-2026/0136', date: '25/05/2026', site: 'MEK-019', siteName: 'Échangeur A2', fournisseur: 'GAZ', items: 'Gasoil chantier — 5 000 L', montant: 67_500, status: 'emis', delai: '27/05/2026', demandeur: 'Y. Tazi', emisLe: '25/05/2026' },
  { num: 'BC-2026/0135', date: '24/05/2026', site: 'CSB-114', siteName: 'Marina Casa L3', fournisseur: 'SON', items: 'Profilés laminés HEA — 6 t', montant: 142_000, status: 'recu', delai: '26/05/2026', demandeur: 'H. Bouhsina', emisLe: '24/05/2026', recuLe: '26/05/2026' },
  { num: 'BC-2026/0134', date: '23/05/2026', site: 'RBT-208', siteName: 'Tramway Rabat-Salé', fournisseur: 'ELC', items: 'Câbles HTA + accessoires de raccordement', montant: 388_000, status: 'recu', delai: '28/05/2026', demandeur: 'H. Alaoui', emisLe: '23/05/2026', recuLe: '27/05/2026' },
  { num: 'BC-2026/0133', date: '22/05/2026', site: 'TNG-061', siteName: 'Port Tanger Med', fournisseur: 'CIM', items: 'BPE marine C40/50 — 180 m³', montant: 248_000, status: 'facture', delai: '24/05/2026', demandeur: 'M. El Mansouri', emisLe: '22/05/2026', recuLe: '24/05/2026', factureLe: '26/05/2026' },
  { num: 'BC-2026/0132', date: '21/05/2026', site: 'CSB-098', siteName: 'CC Sidi Maârouf', fournisseur: 'SOTR', items: 'Étanchéité multicouche toiture — 1 800 m²', montant: 612_000, status: 'facture', delai: '15/06/2026', demandeur: 'K. Benjelloun', emisLe: '21/05/2026' },
  { num: 'BC-2026/0131', date: '20/05/2026', site: 'AGD-033', siteName: 'Taghazout Bay', fournisseur: 'GRF', items: 'Sable lavé 0/4 — 240 m³', montant: 36_800, status: 'rejete', delai: '—', demandeur: 'S. Fassi', motifRejet: 'Devis non conforme — relancer 2 fournisseurs supp.' },
];

const STATUS_MAP = {
  'attente-cond':   { label: 'Attente conducteur', tone: 'amber', step: 1, dot: TOKENS.amber },
  'attente-centre': { label: 'Attente chef centre', tone: 'amber', step: 2, dot: TOKENS.amber },
  'attente-dg':     { label: 'Attente direction',  tone: 'amber', step: 3, dot: TOKENS.amber },
  'emis':           { label: 'BC émis',            tone: 'blue',  step: 4, dot: TOKENS.blue },
  'recu':           { label: 'Reçu magasin',       tone: 'green', step: 5, dot: TOKENS.green },
  'facture':        { label: 'Facturé fournisseur',tone: 'neutral', step: 6, dot: TOKENS.ink3 },
  'rejete':         { label: 'Rejeté',             tone: 'red',   step: 0, dot: TOKENS.red },
};

const WORKFLOW_STEPS = [
  { id: 'demande',         label: 'Demande',         icon: 'doc' },
  { id: 'attente-cond',    label: 'Conducteur',      icon: 'helmet' },
  { id: 'attente-centre',  label: 'Chef centre',     icon: 'user' },
  { id: 'attente-dg',      label: 'Direction',       icon: 'shield' },
  { id: 'emis',            label: 'BC émis',         icon: 'purchase' },
  { id: 'recu',            label: 'Réception',       icon: 'truck' },
  { id: 'facture',         label: 'Facturé',         icon: 'invoice' },
];

// -----------------------------------------------------------------------------
function Achats() {
  const [tab, setTab]       = React.useState('valider'); // valider | tous | emis | livraisons
  const [siteFilter, setSiteFilter] = React.useState('all');
  const [q, setQ]           = React.useState('');
  const [selected, setSelected] = React.useState(null);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [newBC, setNewBC] = React.useState(false);
  const [receptionFor, setReceptionFor] = React.useState(null);

  // Expose fournisseur names for the reception modal
  React.useEffect(() => {
    window.FOURNISSEURS_NAMES = Object.fromEntries(
      Object.entries(FOURNISSEURS).map(([k, v]) => [k, v.name])
    );
  }, []);

  React.useEffect(() => {
    const h = (e) => { if (e.detail?.key === 'newBC') setNewBC(true); };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  let rows = BCS.slice();
  if (tab === 'valider')    rows = rows.filter(b => b.status.startsWith('attente-'));
  if (tab === 'emis')       rows = rows.filter(b => b.status === 'emis');
  if (tab === 'livraisons') rows = rows.filter(b => b.status === 'recu' || b.status === 'facture');
  // 'tous' = no filter

  if (siteFilter !== 'all') rows = rows.filter(b => b.site === siteFilter);
  if (q) {
    const Q = q.toLowerCase();
    rows = rows.filter(b => (b.num + ' ' + b.items + ' ' + (FOURNISSEURS[b.fournisseur]?.name || '')).toLowerCase().includes(Q));
  }

  // KPIs
  const attente = BCS.filter(b => b.status.startsWith('attente-')).length;
  const urgent  = BCS.filter(b => b.urgent && b.status.startsWith('attente-')).length;
  const emis    = BCS.filter(b => b.status === 'emis').length;
  const mois    = BCS.reduce((s, b) => s + (b.status !== 'rejete' ? b.montant : 0), 0);
  const ecart   = BCS.filter(b => b.status === 'attente-dg').length;

  // Distinct sites for filter
  const sites = [...new Set(BCS.map(b => b.site))].map(c => {
    const r = BCS.find(b => b.site === c);
    return [c, r.siteName];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            ACHATS · BONS DE COMMANDE
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Cycle d'approvisionnement <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· {BCS.length} BC actifs</span>
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6, letterSpacing: '0.02em' }}>
            Workflow de validation à 3 niveaux · plafonds : 200 K, 800 K, ≥ 800 K DH
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <Button onClick={() => setCompareOpen(true)} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Comparatif prix</Button>
          {window.ExportMenu ? <window.ExportMenu name="Bons de commande" /> : null}
          <Button onClick={() => setNewBC(true)} variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <Kpi label="À VALIDER" value={attente} sub={`dont ${urgent} urgent${urgent > 1 ? 's' : ''}`} delay={60} tone={urgent ? 'amber' : 'neutral'} active={tab === 'valider'} onClick={() => setTab('valider')} />
        <Kpi label="ATTENTE DIRECTION" value={ecart} sub="> 800 000 DH" delay={120} tone="red" />
        <Kpi label="BC ÉMIS — EN LIVRAISON" value={emis} sub="à recevoir cette semaine" delay={180} tone="blue" active={tab === 'emis'} onClick={() => setTab('emis')} />
        <Kpi label="RÉCEPTIONS / FACTURÉ" value={BCS.filter(b => b.status === 'recu' || b.status === 'facture').length} sub="ce mois" delay={240} tone="green" active={tab === 'livraisons'} onClick={() => setTab('livraisons')} />
        <Kpi label="ENGAGÉ — MAI 2026" value={fmtMAD(mois)} sub="DH HT · 9 chantiers" delay={300} tone="ink" />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }} className="erp-fade-in">
        <div style={{ display: 'flex', background: TOKENS.bgWarm, borderRadius: 6, padding: 2 }}>
          {[
            ['valider', `À valider · ${attente}`],
            ['tous', `Tous · ${BCS.length}`],
            ['emis', `Émis · ${emis}`],
            ['livraisons', `Reçus / facturés`],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: tab === id ? TOKENS.paper : 'transparent',
              color: tab === id ? TOKENS.ink : TOKENS.ink3,
              fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
              boxShadow: tab === id ? '0 1px 2px rgba(26,24,20,0.08)' : 'none',
            }}>{label}</button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 12px', height: 36,
          background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6,
        }}>
          <Icon name="search" size={14} stroke={TOKENS.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="N° BC, désignation, fournisseur…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} />
        </div>

        <SiteFilter value={siteFilter} onChange={setSiteFilter} sites={sites} />
      </div>

      {/* Main split : list + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0, 1fr) minmax(0, 380px)' : '1fr', gap: 16 }}>
        <BCList rows={rows} selected={selected} onSelect={setSelected} />
        {selected && <BCDetail bc={selected} onClose={() => setSelected(null)} onReception={() => setReceptionFor(selected)} />}
      </div>

      {/* Fournisseurs activity */}
      <FournisseursBlock />

      {compareOpen && <ComparatifPrix onClose={() => setCompareOpen(false)} />}
      {newBC && <NewBCModal onClose={() => setNewBC(false)} />}
      {receptionFor && window.ReceptionMagasinModal && <window.ReceptionMagasinModal bc={receptionFor} onClose={() => setReceptionFor(null)} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function Kpi({ label, value, sub, tone, delay, active, onClick }) {
  const dark = tone === 'ink';
  const toneColors = { amber: TOKENS.amber, red: TOKENS.red, blue: TOKENS.blue, green: TOKENS.green };
  const accent = toneColors[tone];
  return (
    <button onClick={onClick} className="erp-card erp-fade-in" style={{
      animationDelay: delay + 'ms',
      background: dark ? TOKENS.ink : (active ? TOKENS.bgWarm : TOKENS.paper),
      border: `1px solid ${active ? TOKENS.ink : (dark ? TOKENS.ink : TOKENS.line)}`,
      borderRadius: 8, padding: 16, textAlign: 'left',
      cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />}
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5,
          color: dark ? TOKENS.ocre : (accent || TOKENS.ink3),
          letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 24, letterSpacing: '-0.025em',
        color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, marginTop: 6,
        color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </button>
  );
}

// -----------------------------------------------------------------------------
function SiteFilter({ value, onChange, sites }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const current = value === 'all' ? 'Tous chantiers' : sites.find(s => s[0] === value)?.[1];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 36, padding: '0 12px',
        background: TOKENS.paper, border: `1px solid ${TOKENS.line2}`, borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer', fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink,
      }}>
        <Icon name="sites" size={13} stroke={TOKENS.ink3} />
        {current}
        <Icon name="chevronDown" size={12} stroke={TOKENS.ink3} />
      </button>
      {open && (
        <div className="erp-fade-in" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          minWidth: 240, background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`, borderRadius: 6,
          boxShadow: '0 12px 30px -12px rgba(26,24,20,0.18)', padding: 4, zIndex: 40,
        }}>
          {[['all', 'Tous chantiers'], ...sites].map(([id, lbl]) => (
            <button key={id} onClick={() => { onChange(id); setOpen(false); }} className="erp-nav-item" style={{
              width: '100%', padding: '7px 10px',
              background: value === id ? TOKENS.bgWarm : 'transparent',
              border: 'none', borderRadius: 4,
              fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink,
              textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>{lbl}</span>
              {id !== 'all' && (
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>{id}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
function BCList({ rows, selected, onSelect }) {
  if (rows.length === 0) return (
    <Card padding={48} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 8 }}>
        AUCUN BC
      </div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, margin: 0, color: TOKENS.ink }}>
        Aucun bon de commande ne correspond à ces filtres.
      </h3>
    </Card>
  );
  return (
    <Card padding={0} delay={360}>
      {rows.map((b, i) => {
        const s = STATUS_MAP[b.status];
        const f = FOURNISSEURS[b.fournisseur];
        const isSel = selected?.num === b.num;
        return (
          <button key={b.num} onClick={() => onSelect(b)} className="erp-row" style={{
            width: '100%', textAlign: 'left',
            border: 'none', background: isSel ? TOKENS.bgWarm : 'transparent',
            borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            padding: '12px 18px', cursor: 'pointer',
            display: 'grid', gridTemplateColumns: 'minmax(105px, 125px) minmax(0, 1fr) minmax(110px, 130px)', gap: 14, alignItems: 'center',
            borderLeft: isSel ? `3px solid ${TOKENS.ocreDeep}` : '3px solid transparent',
          }}>
            {/* Col 1 — num + date */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>
                  {b.num}
                </span>
                {b.urgent && (
                  <span style={{ padding: '1px 5px', fontSize: 9, fontFamily: 'IBM Plex Mono',
                    background: TOKENS.redSoft, color: TOKENS.red, borderRadius: 3, letterSpacing: '0.05em' }}>URG.</span>
                )}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>
                {b.date}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {b.demandeur}
              </div>
            </div>

            {/* Col 2 — designation, then status + site/fournisseur */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                {b.items}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
                <Pill tone={s.tone} dot>{s.label}</Pill>
                {b.status === 'attente-dg' && (
                  <span data-tip="Plafond direction" style={{ width: 16, height: 16, borderRadius: 999, background: TOKENS.redSoft, color: TOKENS.red,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 700 }}>!</span>
                )}
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep }}>{b.site}</span>
                <span style={{ fontSize: 11, color: TOKENS.ink3, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  · {f?.name}
                </span>
              </div>
            </div>

            {/* Col 3 — amount + delai */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>
                {fmtMAD(b.montant)}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>
                DH HT
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2, marginTop: 2 }}>
                {b.delai}
              </div>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function BCDetail({ bc, onClose, onReception }) {
  const f = FOURNISSEURS[bc.fournisseur];
  const s = STATUS_MAP[bc.status];
  const tva = bc.montant * 0.2;
  const ttc = bc.montant + tva;

  // Reconstruct workflow path
  const events = [];
  events.push({ step: 'demande', date: bc.date, who: bc.demandeur, done: true });
  events.push({ step: 'attente-cond', date: bc.date, who: 'K. Benjelloun', done: ['attente-centre', 'attente-dg', 'emis', 'recu', 'facture'].includes(bc.status) });
  events.push({ step: 'attente-centre', date: bc.date, who: 'M. Tahiri', done: ['attente-dg', 'emis', 'recu', 'facture'].includes(bc.status) });
  if (bc.montant >= 800_000) {
    events.push({ step: 'attente-dg', date: bc.emisLe || '—', who: 'DG · K. Bensaïd', done: ['emis', 'recu', 'facture'].includes(bc.status) });
  }
  events.push({ step: 'emis', date: bc.emisLe || '—', who: 'Service achats', done: ['emis', 'recu', 'facture'].includes(bc.status) });
  events.push({ step: 'recu', date: bc.recuLe || '—', who: 'Magasin', done: ['recu', 'facture'].includes(bc.status) });
  events.push({ step: 'facture', date: bc.factureLe || '—', who: 'Compta', done: bc.status === 'facture' });

  const canApprove = bc.status.startsWith('attente-');

  return (
    <Card padding={0} delay={420} style={{ alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
      {/* Detail header */}
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid ${TOKENS.line}`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10,
        background: TOKENS.bg,
      }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>
            {bc.num}
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink, marginTop: 4, lineHeight: 1.3 }}>
            {bc.items}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TOKENS.ink3, padding: 4, marginRight: -4 }}>
          <Icon name="x" size={14} />
        </button>
      </div>

      <div style={{ padding: 18 }}>
        {/* Status + alert */}
        <Pill tone={s.tone} dot>{s.label}</Pill>
        {bc.urgent && bc.status.startsWith('attente-') && (
          <div style={{ marginTop: 10, padding: '8px 10px',
            background: TOKENS.redSoft, border: `1px solid ${TOKENS.red}`, borderRadius: 5,
            fontSize: 11.5, color: TOKENS.red, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="alert" size={12} stroke={TOKENS.red} />
            Urgent — délai souhaité : {bc.delai}
          </div>
        )}
        {bc.motifRejet && (
          <div style={{ marginTop: 10, padding: '8px 10px',
            background: TOKENS.redSoft, borderRadius: 5,
            fontSize: 11.5, color: TOKENS.red, lineHeight: 1.5 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, letterSpacing: '0.1em', marginBottom: 3 }}>MOTIF DU REJET</div>
            {bc.motifRejet}
          </div>
        )}

        {/* Two-col data */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <DetailField label="Chantier" value={`${bc.site} · ${bc.siteName}`} />
          <DetailField label="Demandeur" value={bc.demandeur} />
          <DetailField label="Fournisseur" value={f.name} mono />
          <DetailField label="Catégorie" value={f.cat} />
          <DetailField label="ICE" value={f.ice} mono />
          <DetailField label="Délai" value={bc.delai} mono />
        </div>

        {/* Amounts */}
        <div style={{ marginTop: 16, padding: 12, background: TOKENS.bgWarm, borderRadius: 6 }}>
          <Row k="Montant HT"   v={fmtMAD(bc.montant) + ' DH'} />
          <Row k="TVA 20 %"     v={fmtMAD(tva) + ' DH'} />
          <Row k="Total TTC"    v={fmtMAD(ttc) + ' DH'} strong />
        </div>

        {/* Workflow timeline */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 10 }}>
            CYCLE D'APPROBATION
          </div>
          <Timeline events={events} status={bc.status} montant={bc.montant} />
        </div>

        {/* Actions */}
        {canApprove && (
          <div style={{ marginTop: 16, display: 'flex', gap: 6, flexDirection: 'column' }}>
            <Button variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
              Approuver et transmettre
            </Button>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" style={{ flex: 1 }}>Renvoyer pour modification</Button>
              <Button size="sm" style={{ flex: 1, color: TOKENS.red }}>Rejeter</Button>
            </div>
          </div>
        )}
        {bc.status === 'emis' && (
          <Button variant="primary" onClick={onReception} style={{ marginTop: 16, width: '100%' }}
            icon={<Icon name="truck" size={13} stroke={TOKENS.bg} />}>
            Enregistrer la réception
          </Button>
        )}
        {bc.status === 'recu' && (
          <Button variant="primary" style={{ marginTop: 16, width: '100%' }}
            icon={<Icon name="invoice" size={13} stroke={TOKENS.bg} />}>
            Rapprocher la facture
          </Button>
        )}
      </div>
    </Card>
  );
}

function DetailField({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 3 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans', fontSize: 12, color: TOKENS.ink, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function Row({ k, v, strong }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', padding: '4px 0',
      borderTop: strong ? `1px solid ${TOKENS.line2}` : 'none',
      marginTop: strong ? 4 : 0, paddingTop: strong ? 8 : 4,
    }}>
      <span style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{k}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: strong ? 13 : 12,
        color: TOKENS.ink, fontWeight: strong ? 600 : 400 }}>{v}</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
function Timeline({ events, status, montant }) {
  // hide direction step if <800K
  const visible = events.filter(e => !(e.step === 'attente-dg' && montant < 800_000));
  return (
    <div style={{ position: 'relative', paddingLeft: 18 }}>
      <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: TOKENS.line2 }} />
      {visible.map((ev, i) => {
        const cur = ev.step === status;
        const step = WORKFLOW_STEPS.find(s => s.id === ev.step);
        return (
          <div key={i} style={{ position: 'relative', paddingBottom: i < visible.length - 1 ? 12 : 0 }}>
            <div style={{
              position: 'absolute', left: -18, top: 1,
              width: 15, height: 15, borderRadius: 999,
              background: ev.done ? TOKENS.green : (cur ? TOKENS.amber : TOKENS.paper),
              border: `1.5px solid ${ev.done ? TOKENS.green : (cur ? TOKENS.amber : TOKENS.line2)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {ev.done && <Icon name="check" size={9} stroke={TOKENS.paper} strokeWidth={3} />}
              {cur && <span style={{ width: 5, height: 5, borderRadius: 999, background: TOKENS.amber }} className="erp-pulse" />}
            </div>
            <div style={{ fontSize: 12, color: cur ? TOKENS.ink : TOKENS.ink2, fontWeight: cur ? 600 : 400 }}>
              {step?.label || ev.step}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 1 }}>
              {ev.who} · {ev.date}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
function FournisseursBlock() {
  const top = [
    { key: 'SON',  ca: 2_840_000, bcs: 8,  delaiMoy: 4, qualite: 96 },
    { key: 'CIM',  ca: 2_180_000, bcs: 6,  delaiMoy: 2, qualite: 99 },
    { key: 'LAF',  ca: 1_640_000, bcs: 11, delaiMoy: 3, qualite: 94 },
    { key: 'GRF',  ca:   980_000, bcs: 14, delaiMoy: 5, qualite: 88 },
    { key: 'ELC',  ca:   880_000, bcs: 3,  delaiMoy: 8, qualite: 91 },
  ];
  return (
    <Card delay={500} padding={0}>
      <div style={{
        padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>
          Top fournisseurs — mai 2026
        </h3>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
          Performance livraison & qualité
        </span>
        <span style={{ flex: 1 }} />
        <Button size="sm">Voir tous les fournisseurs →</Button>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(170px,2fr) minmax(95px,130px) 50px minmax(70px,95px) minmax(110px,140px)', gap: 12,
        padding: '10px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        <span>Fournisseur</span>
        <span style={{ textAlign: 'right' }}>CA cumulé</span>
        <span style={{ textAlign: 'right' }}>BC</span>
        <span style={{ textAlign: 'right' }}>Délai</span>
        <span>Qualité</span>
      </div>
      {top.map((t, i) => {
        const f = FOURNISSEURS[t.key];
        return (
          <div key={t.key} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: 'minmax(170px,2fr) minmax(95px,130px) 50px minmax(70px,95px) minmax(110px,140px)', gap: 12,
            padding: '12px 20px',
            borderBottom: i < top.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            alignItems: 'center',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {f.cat} · ICE {f.ice}
              </div>
            </div>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>
              {fmtMAD(t.ca)} <span style={{ fontSize: 9.5, color: TOKENS.ink3 }}>DH</span>
            </span>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>{t.bcs}</span>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: t.delaiMoy > 6 ? TOKENS.amber : TOKENS.ink }}>
              {t.delaiMoy} j
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Progress value={t.qualite}
                  tone={t.qualite >= 95 ? 'green' : t.qualite >= 90 ? 'ocre' : 'amber'}
                  height={4} />
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink, fontWeight: 500, minWidth: 32, textAlign: 'right' }}>
                {t.qualite}%
              </span>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// =============================================================================
// COMPARATIF DE PRIX — workflow réel: appel d'offres → cotation → décision
// =============================================================================
const ITEM_CATALOG = [
  { id: 'tor12', label: 'Ferraille TOR Ø12', unit: 't',  ref: 'CIM-TOR12' },
  { id: 'bpe25', label: 'Béton C25/30',       unit: 'm³', ref: 'BPE-C25' },
  { id: 'cim45', label: 'Ciment CPJ45',       unit: 't',  ref: 'CIM-CPJ45' },
  { id: 'agg',   label: 'Agglos 20x20x40',    unit: 'u',  ref: 'AGG-2040' },
  { id: 'gas',   label: 'Gasoil chantier',    unit: 'L',  ref: 'GAZ-CHA' },
];

function ComparatifPrix({ onClose }) {
  const { Modal, FieldGroup, Select, TextInput, Button: Btn, Pill: P } = window;
  const [item, setItem]   = React.useState('tor12');
  const [qty, setQty]     = React.useState(28);
  const [site, setSite]   = React.useState('CSB-114');

  // dataset of supplier quotes — derived from item
  const baselines = {
    tor12: [
      { sup: 'Sonasid',           cat: 'A', pu: 17_200, delai: '5j',  cnss: true,  rabais: 2, note: 95, hist: 12 },
      { sup: 'Univers Métal',     cat: 'A', pu: 17_650, delai: '7j',  cnss: true,  rabais: 0, note: 88, hist: 6  },
      { sup: 'Maghreb Steel',     cat: 'B', pu: 16_980, delai: '4j',  cnss: true,  rabais: 3, note: 78, hist: 3  },
      { sup: 'ImporTOR Settat',   cat: 'C', pu: 16_750, delai: '8j',  cnss: false, rabais: 0, note: 62, hist: 1  },
    ],
    bpe25: [
      { sup: 'CIMAR',             cat: 'A', pu: 1_240, delai: '24h', cnss: true, rabais: 2, note: 96, hist: 18 },
      { sup: 'LafargeHolcim',     cat: 'A', pu: 1_280, delai: '24h', cnss: true, rabais: 0, note: 94, hist: 15 },
      { sup: 'BPE du Souss',      cat: 'B', pu: 1_180, delai: '36h', cnss: true, rabais: 4, note: 82, hist: 4  },
    ],
    cim45: [
      { sup: 'LafargeHolcim',     cat: 'A', pu: 1_540, delai: '3j',  cnss: true, rabais: 1, note: 92, hist: 22 },
      { sup: 'Asment Témara',     cat: 'A', pu: 1_590, delai: '3j',  cnss: true, rabais: 0, note: 89, hist: 11 },
      { sup: 'Ciments du Maroc',  cat: 'A', pu: 1_510, delai: '5j',  cnss: true, rabais: 2, note: 85, hist: 7  },
    ],
    agg: [
      { sup: 'Briqueterie Atlas',   cat: 'A', pu: 4.2, delai: '2j', cnss: true, rabais: 1, note: 86, hist: 8 },
      { sup: 'Agglos Settat',       cat: 'B', pu: 4.0, delai: '3j', cnss: true, rabais: 2, note: 78, hist: 4 },
    ],
    gas: [
      { sup: 'Afriquia Gaz',      cat: 'A', pu: 13.45, delai: '24h', cnss: true, rabais: 0.5, note: 94, hist: 24 },
      { sup: 'Total Maroc',       cat: 'A', pu: 13.50, delai: '24h', cnss: true, rabais: 0,   note: 92, hist: 18 },
      { sup: 'Shell Vivo',        cat: 'A', pu: 13.62, delai: '24h', cnss: true, rabais: 0,   note: 88, hist: 12 },
    ],
  };
  const offers = baselines[item] || [];
  const cur = ITEM_CATALOG.find(c => c.id === item);
  const sorted = [...offers].sort((a, b) => a.pu * (1 - a.rabais / 100) - b.pu * (1 - b.rabais / 100));
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const econ = (worst.pu - best.pu) * (1 - 0 / 100) * qty;

  const award = (sup) => {
    onClose();
    window.toast(`BC attribué à ${sup}`, 'success', `${cur.label} · ${qty} ${cur.unit} · ${site}`);
  };
  const exportComp = (fmt) => window.toast(`Comparatif exporté en ${fmt}`, 'info', `${cur.label} · ${offers.length} cotations`);

  return (
    <Modal open onClose={onClose}
      title="Comparatif fournisseurs"
      subtitle="Cotations comparées sur un même besoin · sélection du meilleur prix"
      width={920}
      footer={<>
        <Btn onClick={onClose}>Fermer</Btn>
        <Btn onClick={() => exportComp('Excel')}>Excel</Btn>
        <Btn onClick={() => exportComp('PDF')}>PDF</Btn>
        <Btn onClick={() => award(best.sup)} variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Attribuer à {best.sup}</Btn>
      </>}
    >
      {/* Need spec */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: 12, marginBottom: 18 }}>
        <FieldGroup label="Article / Référence">
          <Select value={item} onChange={(v) => setItem(v)}
            options={ITEM_CATALOG.map(c => [c.id, `${c.label}  (${c.ref})`])} />
        </FieldGroup>
        <FieldGroup label="Quantité">
          <TextInput value={qty} onChange={(v) => setQty(Number(v) || 0)} mono />
        </FieldGroup>
        <FieldGroup label="Chantier">
          <Select value={site} onChange={(v) => setSite(v)}
            options={['CSB-114', 'RBT-208', 'TNG-061', 'AGD-033', 'MEK-019']} />
        </FieldGroup>
      </div>

      {/* Synthèse */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
        <SynthCard label="MEILLEUR PRIX UNITAIRE" value={`${best.pu.toLocaleString('fr-FR')} DH`} sub={best.sup} tone="green" />
        <SynthCard label="ÉCART MAX" value={`+${((worst.pu - best.pu) / best.pu * 100).toFixed(1)}%`} sub={`${worst.sup}`} tone="red" />
        <SynthCard label="ÉCONOMIE POTENTIELLE" value={`${(econ / 1e3).toFixed(1)} k DH`} sub={`${qty} ${cur.unit}`} tone="ocre" />
        <SynthCard label="OFFRES" value={offers.length} sub="cotations reçues" />
      </div>

      {/* Comparison table */}
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 8 }}>COTATIONS · TRIÉES PAR PRIX</div>
      <div style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '40px 1fr 90px 110px 90px 80px 80px 120px',
          padding: '10px 14px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>#</span><span>Fournisseur</span><span>Cat.</span>
          <span style={{ textAlign: 'right' }}>PU HT</span>
          <span style={{ textAlign: 'right' }}>Rabais</span>
          <span style={{ textAlign: 'right' }}>Délai</span>
          <span style={{ textAlign: 'center' }}>CNSS</span>
          <span style={{ textAlign: 'right' }}>Total HT</span>
        </div>
        {sorted.map((o, i) => {
          const eff = o.pu * (1 - o.rabais / 100);
          const totalHT = eff * qty;
          const isBest = i === 0;
          return (
            <div key={o.sup} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 90px 110px 90px 80px 80px 120px',
              padding: '14px 14px', alignItems: 'center',
              borderBottom: i < sorted.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              background: isBest ? '#fdfaf3' : TOKENS.paper,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 4, fontFamily: 'IBM Plex Mono',
                fontSize: 11, fontWeight: 600,
                background: isBest ? TOKENS.ocre : TOKENS.bgWarm,
                color: isBest ? TOKENS.bg : TOKENS.ink3,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{o.sup}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>note {o.note}/100 · {o.hist} BC histo.</div>
              </div>
              <P tone={o.cat === 'A' ? 'green' : o.cat === 'B' ? 'amber' : 'neutral'} mono>{o.cat}</P>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink }}>{o.pu.toLocaleString('fr-FR')}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: o.rabais > 0 ? TOKENS.green : TOKENS.ink3 }}>
                {o.rabais > 0 ? '−' + o.rabais + '%' : '—'}
              </span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>{o.delai}</span>
              <span style={{ textAlign: 'center' }}>
                {o.cnss ? <Icon name="check" size={14} stroke={TOKENS.green} strokeWidth={2.5} /> : <Icon name="x" size={14} stroke={TOKENS.red} strokeWidth={2.5} />}
              </span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, color: isBest ? TOKENS.ocreDeep : TOKENS.ink, fontWeight: isBest ? 700 : 500 }}>
                {totalHT.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
              </span>
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div style={{
        marginTop: 18, padding: 16, background: TOKENS.ink, color: TOKENS.bg,
        borderRadius: 8, display: 'flex', gap: 14, alignItems: 'center',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999, flexShrink: 0,
          background: TOKENS.ocre, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={18} stroke={TOKENS.ink} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.1em', marginBottom: 3 }}>RECOMMANDATION</div>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            <b>{best.sup}</b> — meilleur prix après rabais, attestations CNSS à jour, délai compatible chantier.
            Économie estimée <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>{econ.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH</b> vs offre la plus haute.
          </div>
        </div>
      </div>
    </Modal>
  );
}

function SynthCard({ label, value, sub, tone }) {
  const colors = { green: TOKENS.green, red: TOKENS.red, ocre: TOKENS.ocre };
  const c = colors[tone];
  return (
    <div style={{
      padding: 12, background: TOKENS.paper,
      border: `1px solid ${TOKENS.line}`, borderRadius: 6,
      borderLeft: c ? `3px solid ${c}` : `1px solid ${TOKENS.line}`,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: c || TOKENS.ink, marginTop: 5, letterSpacing: '-0.01em' }}>{value}</div>
      <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 3 }}>{sub}</div>
    </div>
  );
}

// =============================================================================
// NEW BC — quick form
// =============================================================================
function NewBCModal({ onClose }) {
  const { Modal, FieldGroup, TextInput, Select, TextArea, Button: Btn } = window;
  const [form, setForm] = React.useState({ site: 'CSB-114', fournisseur: 'SON', items: '', montant: '', urgent: false });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.items.trim() || !form.montant) { window.toast('Désignation et montant requis', 'error'); return; }
    onClose();
    window.toast('Demande d\'achat créée', 'success', `BC-2026/0143 · ${Number(form.montant).toLocaleString('fr-FR')} DH`);
  };
  return (
    <Modal open onClose={onClose}
      title="Nouvelle demande d'achat"
      subtitle="Workflow : Demande → Conducteur → Chef centre → Direction (>800 K DH)"
      width={620}
      footer={<><Btn onClick={onClose}>Annuler</Btn><Btn variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Soumettre pour validation</Btn></>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FieldGroup label="Chantier"><Select value={form.site} onChange={(v) => upd('site', v)} options={['CSB-114', 'RBT-208', 'TNG-061', 'AGD-033', 'MEK-019', 'CSB-098']} /></FieldGroup>
        <FieldGroup label="Fournisseur"><Select value={form.fournisseur} onChange={(v) => upd('fournisseur', v)} options={Object.entries(FOURNISSEURS).map(([k, v]) => [k, v.name])} /></FieldGroup>
      </div>
      <FieldGroup label="Désignation / Articles" required><TextArea value={form.items} onChange={(v) => upd('items', v)} placeholder="TOR Ø12 — 28 t, TOR Ø16 — 10 t..." rows={3} /></FieldGroup>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FieldGroup label="Montant HT (DH)" required><TextInput value={form.montant} onChange={(v) => upd('montant', v)} mono type="number" /></FieldGroup>
        <FieldGroup label="Délai souhaité"><TextInput value={form.delai || ''} onChange={(v) => upd('delai', v)} placeholder="05/06/2026" /></FieldGroup>
      </div>
      <FieldGroup label="Justification / Note">
        <TextArea placeholder="Besoin chantier · alternative fournisseur..." rows={2} />
      </FieldGroup>
    </Modal>
  );
}

Object.assign(window, { Achats });
