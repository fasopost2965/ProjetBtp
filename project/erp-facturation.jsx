/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Facturation (PME)
// Cycle simplifié : Devis → Facture → Relance → Encaissé
// Calibré pour un patron qui suit son cash, pas pour une DAF
// =============================================================================

// Format date court FR : "12 mai"
const moisCourt = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} ${moisCourt[parseInt(m) - 1]}`;
};
const daysAgo = (iso) => {
  const ref = new Date(2026, 4, 28); // 28 mai 2026
  const d = new Date(iso);
  return Math.round((ref - d) / (1000 * 60 * 60 * 24));
};

const DEVIS = [
  { num: 'DV-26-014', date: '2026-05-26', client: 'Résidence El Manar',     chantier: 'Réhab. immeuble Bd Zerktouni', montantHT: 142_000, status: 'envoye', validite: '2026-06-15' },
  { num: 'DV-26-013', date: '2026-05-22', client: 'M. Belhaj (particulier)', chantier: 'Villa Souissi — gros œuvre',    montantHT: 680_000, status: 'envoye', validite: '2026-06-10' },
  { num: 'DV-26-012', date: '2026-05-18', client: 'Café Chichaoua SARL',    chantier: 'Aménagement intérieur 180 m²',   montantHT:  84_500, status: 'accepte', validite: '2026-06-05' },
  { num: 'DV-26-011', date: '2026-05-10', client: 'Mme Tazi',                chantier: 'Rénovation salle de bain',        montantHT:  46_800, status: 'refuse',   validite: '2026-05-30' },
];

const FACTURES = [
  { num: 'FA-26-038', date: '2026-05-27', client: 'Résidence El Manar',     chantier: 'Réhab. immeuble Bd Zerktouni', montantHT: 142_000, echeance: '2026-06-26', status: 'emise',     mode: 'virement' },
  { num: 'FA-26-037', date: '2026-05-20', client: 'STÉ Maroc Distribution', chantier: 'Local commercial Hay Riad',     montantHT: 218_000, echeance: '2026-06-19', status: 'emise',     mode: 'virement' },
  { num: 'FA-26-036', date: '2026-05-15', client: 'M. Belhaj',               chantier: 'Villa Souissi — situation 3',   montantHT: 168_000, echeance: '2026-06-14', status: 'emise',     mode: 'cheque' },
  { num: 'FA-26-035', date: '2026-04-28', client: 'Pharma Atlas SARL',      chantier: 'Aménagement pharmacie',           montantHT:  96_400, echeance: '2026-05-28', status: 'relance1',  mode: 'virement', joursRetard: 0 },
  { num: 'FA-26-034', date: '2026-04-22', client: 'Résidence Al Andalous', chantier: 'Maintenance trim. ascenseurs',   montantHT:  38_900, echeance: '2026-05-22', status: 'relance2',  mode: 'virement', joursRetard: 6 },
  { num: 'FA-26-033', date: '2026-04-12', client: 'M. Idrissi',              chantier: 'Travaux divers villa',            montantHT:  72_000, echeance: '2026-05-12', status: 'relance3',  mode: 'cheque',   joursRetard: 16, alert: true },
  { num: 'FA-26-032', date: '2026-04-05', client: 'Café Bab Sebta',          chantier: 'Réfection terrasse',              montantHT:  54_300, echeance: '2026-05-05', status: 'encaisse',  mode: 'cheque',   encaisseLe: '2026-05-12' },
  { num: 'FA-26-031', date: '2026-03-28', client: 'STÉ Maroc Distribution', chantier: 'Local commercial — sit. 2',     montantHT: 186_000, echeance: '2026-04-27', status: 'encaisse',  mode: 'virement', encaisseLe: '2026-04-30' },
  { num: 'FA-26-030', date: '2026-03-15', client: 'Résidence El Manar',     chantier: 'Étanchéité toiture',              montantHT: 124_500, echeance: '2026-04-14', status: 'encaisse',  mode: 'virement', encaisseLe: '2026-04-22' },
];

const STATUS_DEVIS = {
  envoye:  { label: 'Envoyé',  tone: 'blue'    },
  accepte: { label: 'Accepté', tone: 'green'   },
  refuse:  { label: 'Refusé',  tone: 'neutral' },
};
const STATUS_FACT = {
  emise:    { label: 'À échoir',         tone: 'blue'  },
  relance1: { label: 'Relance 1',        tone: 'amber' },
  relance2: { label: 'Relance 2',        tone: 'amber' },
  relance3: { label: 'Mise en demeure',  tone: 'red'   },
  encaisse: { label: 'Encaissée',        tone: 'green' },
};

// -----------------------------------------------------------------------------
function Facturation() {
  const [tab, setTab] = React.useState('factures'); // factures | devis | encaisse
  const [filter, setFilter] = React.useState('all'); // all | retards | aechoir
  const [selected, setSelected] = React.useState(null);
  const [newDevis, setNewDevis] = React.useState(false);
  const [newFact, setNewFact]   = React.useState(false);
  const [previewFact, setPreviewFact] = React.useState(null);

  React.useEffect(() => {
    const h = (e) => {
      if (e.detail?.key === 'newInvoice') setNewFact(true);
      if (e.detail?.key === 'newQuote')   setNewDevis(true);
    };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  // KPIs — patron-friendly
  const encaisseMois = FACTURES.filter(f => f.status === 'encaisse' && f.encaisseLe?.startsWith('2026-05')).reduce((s, f) => s + f.montantHT * 1.2, 0);
  const enAttente    = FACTURES.filter(f => f.status !== 'encaisse').reduce((s, f) => s + f.montantHT * 1.2, 0);
  const enRetard     = FACTURES.filter(f => (f.status === 'relance2' || f.status === 'relance3')).reduce((s, f) => s + f.montantHT * 1.2, 0);
  const aEchoir7j    = FACTURES.filter(f => f.status === 'emise' && daysAgo(f.echeance) > -7 && daysAgo(f.echeance) <= 0).reduce((s, f) => s + f.montantHT * 1.2, 0);

  const nbRetard = FACTURES.filter(f => f.status === 'relance2' || f.status === 'relance3').length;
  const nbAEchoir = FACTURES.filter(f => f.status === 'emise' && daysAgo(f.echeance) > -7 && daysAgo(f.echeance) <= 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Header onNouveauDevis={() => setNewDevis(true)} onNouvelleFacture={() => setNewFact(true)} />

      {/* KPI strip — 4 chiffres clés pour le patron */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <BigKpi label="ENCAISSÉ — MAI 2026"  value={fmtMAD(encaisseMois)} unit="DH TTC" sub={`${FACTURES.filter(f => f.status === 'encaisse' && f.encaisseLe?.startsWith('2026-05')).length} règlements reçus`} delay={60} tone="green" />
        <BigKpi label="EN ATTENTE D'ENCAISSEMENT" value={fmtMAD(enAttente)} unit="DH TTC" sub={`${FACTURES.filter(f => f.status !== 'encaisse').length} factures en cours`} delay={120} tone="ink" />
        <BigKpi label="EN RETARD DE PAIEMENT"  value={fmtMAD(enRetard)}  unit="DH TTC" sub={`${nbRetard} facture${nbRetard > 1 ? 's' : ''} à relancer`} delay={180} tone={nbRetard ? 'red' : 'neutral'} alert={nbRetard > 0} onClick={() => { setTab('factures'); setFilter('retards'); }} />
        <BigKpi label="À ENCAISSER SOUS 7 J"  value={fmtMAD(aEchoir7j)} unit="DH TTC" sub={`${nbAEchoir} échéance${nbAEchoir > 1 ? 's' : ''} cette semaine`} delay={240} tone="amber" onClick={() => { setTab('factures'); setFilter('aechoir'); }} />
      </div>

      {/* Pipeline visuel */}
      <Pipeline />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${TOKENS.line}` }} className="erp-fade-in">
        {[
          ['factures', `Factures (${FACTURES.length})`],
          ['devis',    `Devis (${DEVIS.length})`],
          ['encaisse', `Encaissements`],
        ].map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); setFilter('all'); setSelected(null); }} style={{
            padding: '10px 16px',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === id ? TOKENS.ink : 'transparent'}`,
            color: tab === id ? TOKENS.ink : TOKENS.ink3,
            cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === id ? 600 : 400,
            marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0, 1fr) minmax(0, 340px)' : '1fr', gap: 16 }}>
        <div>
          {tab === 'factures' && <FacturesList filter={filter} setFilter={setFilter} selected={selected} onSelect={setSelected} />}
          {tab === 'devis'    && <DevisList />}
          {tab === 'encaisse' && <EncaissementsView />}
        </div>
        {selected && <FactureDetail facture={selected} onClose={() => setSelected(null)} onPreview={() => setPreviewFact(selected)} />}
      </div>

      {newDevis && <window.NewDevisModal onClose={() => setNewDevis(false)} />}
      {newFact && <window.NewFactureModal onClose={() => setNewFact(false)} />}
      {previewFact && <window.FactureDocPreview facture={previewFact} onClose={() => setPreviewFact(null)} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function Header({ onNouveauDevis, onNouvelleFacture }) {
  return (
    <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
          FACTURATION · CASH FLOW
        </div>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
          Devis, factures &amp; encaissements
        </h1>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6, letterSpacing: '0.02em' }}>
          Bonjour Karim — voici où en est votre trésorerie aujourd'hui
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
        <Button onClick={onNouveauDevis} icon={<Icon name="plus" size={13} stroke={TOKENS.ink2} />}>
          Nouveau devis
        </Button>
        <Button variant="primary" onClick={onNouvelleFacture} icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>
          Nouvelle facture
        </Button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function BigKpi({ label, value, unit, sub, tone, delay, alert, onClick }) {
  const dark = tone === 'ink';
  const colors = { green: TOKENS.green, red: TOKENS.red, amber: TOKENS.amber };
  const accent = colors[tone];
  return (
    <button onClick={onClick} disabled={!onClick} className="erp-card erp-fade-in" style={{
      animationDelay: delay + 'ms',
      background: dark ? TOKENS.ink : TOKENS.paper,
      border: `1px solid ${dark ? TOKENS.ink : TOKENS.line}`,
      borderRadius: 8, padding: 18, textAlign: 'left',
      cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit',
      position: 'relative',
    }}>
      {alert && (
        <span className="erp-pulse" style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: 999, background: TOKENS.red,
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />}
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5,
          color: dark ? TOKENS.ocre : (accent || TOKENS.ink3),
          letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 26, letterSpacing: '-0.025em',
          color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5,
          color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 11, marginTop: 8,
        color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </button>
  );
}

// -----------------------------------------------------------------------------
function Pipeline() {
  const nbDevis    = DEVIS.filter(d => d.status === 'envoye').length;
  const nbAccepte  = DEVIS.filter(d => d.status === 'accepte').length;
  const nbEmise    = FACTURES.filter(f => f.status === 'emise').length;
  const nbRelance  = FACTURES.filter(f => f.status?.startsWith('relance')).length;
  const nbEnc      = FACTURES.filter(f => f.status === 'encaisse').length;

  const totalDevis    = DEVIS.filter(d => d.status === 'envoye').reduce((s, d) => s + d.montantHT * 1.2, 0);
  const totalEmises   = FACTURES.filter(f => f.status === 'emise').reduce((s, f) => s + f.montantHT * 1.2, 0);
  const totalRelances = FACTURES.filter(f => f.status?.startsWith('relance')).reduce((s, f) => s + f.montantHT * 1.2, 0);
  const totalEnc      = FACTURES.filter(f => f.status === 'encaisse').reduce((s, f) => s + f.montantHT * 1.2, 0);

  const steps = [
    { label: 'Devis envoyés',    count: nbDevis,   amount: totalDevis,    tone: TOKENS.blue,    icon: 'doc' },
    { label: 'Factures à échoir', count: nbEmise,   amount: totalEmises,   tone: TOKENS.ocre,    icon: 'invoice' },
    { label: 'À relancer',       count: nbRelance, amount: totalRelances, tone: TOKENS.amber,   icon: 'alert' },
    { label: 'Encaissées',       count: nbEnc,     amount: totalEnc,      tone: TOKENS.green,   icon: 'check' },
  ];

  return (
    <Card delay={300} padding={0}>
      <div style={{
        padding: '12px 18px', borderBottom: `1px solid ${TOKENS.line}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>
          Pipeline du cash
        </h3>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>
          Où en est l'argent · TTC
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{
            padding: 18, position: 'relative',
            borderRight: i < steps.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: 6,
                background: s.tone + '20', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={s.icon} size={11} stroke={s.tone} strokeWidth={2.2} />
              </span>
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: TOKENS.ink2 }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: TOKENS.ink }}>
                {s.count}
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>doc.</span>
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: s.tone, marginTop: 4, fontWeight: 500 }}>
              {fmtMAD(s.amount)} <span style={{ color: TOKENS.ink3, fontWeight: 400 }}>DH</span>
            </div>
            {i < steps.length - 1 && (
              <Icon name="chevronRight" size={14} stroke={TOKENS.ink4}
                style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', background: TOKENS.paper, padding: '0 2px' }} />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function FacturesList({ filter, setFilter, selected, onSelect }) {
  let rows = FACTURES.slice();
  if (filter === 'retards')  rows = rows.filter(f => f.status === 'relance2' || f.status === 'relance3');
  if (filter === 'aechoir')  rows = rows.filter(f => f.status === 'emise');
  if (filter === 'encaisse') rows = rows.filter(f => f.status === 'encaisse');

  return (
    <Card padding={0} delay={400}>
      {/* Filter chips */}
      <div style={{
        padding: '12px 18px', borderBottom: `1px solid ${TOKENS.line}`,
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      }}>
        {[
          ['all',      `Toutes · ${FACTURES.length}`],
          ['aechoir',  `À échoir · ${FACTURES.filter(f => f.status === 'emise').length}`],
          ['retards',  `Retards · ${FACTURES.filter(f => f.status === 'relance2' || f.status === 'relance3').length}`],
          ['encaisse', `Encaissées · ${FACTURES.filter(f => f.status === 'encaisse').length}`],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding: '5px 11px', borderRadius: 4, border: 'none', cursor: 'pointer',
            background: filter === id ? TOKENS.ink : TOKENS.bgWarm,
            color: filter === id ? TOKENS.bg : TOKENS.ink2,
            fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
          }}>{label}</button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div style={{ padding: 36, textAlign: 'center' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 6 }}>AUCUNE FACTURE</div>
          <div style={{ fontSize: 13, color: TOKENS.ink2 }}>Aucune facture ne correspond à ce filtre.</div>
        </div>
      ) : rows.map((f, i) => {
        const s = STATUS_FACT[f.status];
        const isSel = selected?.num === f.num;
        const isLate = f.status === 'relance1' || f.status === 'relance2' || f.status === 'relance3';
        const isDueSoon = f.status === 'emise' && daysAgo(f.echeance) > -7;
        return (
          <button key={f.num} onClick={() => onSelect(f)} className="erp-row" style={{
            width: '100%', textAlign: 'left', border: 'none',
            background: isSel ? TOKENS.bgWarm : 'transparent',
            borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            borderLeft: isSel ? `3px solid ${TOKENS.ocreDeep}` : '3px solid transparent',
            padding: '14px 18px', cursor: 'pointer',
            display: 'grid', gridTemplateColumns: 'minmax(100px, 120px) minmax(0, 1fr) minmax(120px, 150px)', gap: 14, alignItems: 'center',
          }}>
            {/* Col 1: num + date */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>
                {f.num}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 4 }}>
                émise {fmtDate(f.date)}
              </div>
            </div>
            {/* Col 2: client + chantier + status */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                {f.client}
              </div>
              <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {f.chantier}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Pill tone={s.tone} dot>{s.label}</Pill>
                {f.status === 'encaisse' && (
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.green }}>
                    ✓ reçu {fmtDate(f.encaisseLe)}
                  </span>
                )}
                {isLate && (
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.red }}>
                    +{f.joursRetard} j de retard
                  </span>
                )}
                {isDueSoon && !isLate && (
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.amber }}>
                    échoit {fmtDate(f.echeance)}
                  </span>
                )}
              </div>
            </div>
            {/* Col 3: montant */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.ink, fontWeight: 600 }}>
                {fmtMAD(f.montantHT * 1.2)}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>
                DH TTC
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4, marginTop: 1 }}>
                HT {fmtMAD(f.montantHT)}
              </div>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function DevisList() {
  return (
    <Card padding={0} delay={400}>
      {DEVIS.map((d, i) => {
        const s = STATUS_DEVIS[d.status];
        return (
          <div key={d.num} className="erp-row" style={{
            borderBottom: i < DEVIS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            padding: '14px 18px',
            display: 'grid', gridTemplateColumns: 'minmax(100px, 120px) minmax(0, 1fr) minmax(120px, 150px)', gap: 14, alignItems: 'center',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>
                {d.num}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 4 }}>
                {fmtDate(d.date)}
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                {d.client}
              </div>
              <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.chantier}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Pill tone={s.tone} dot>{s.label}</Pill>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
                  valide jusqu'au {fmtDate(d.validite)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.ink, fontWeight: 600 }}>
                {fmtMAD(d.montantHT * 1.2)}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>
                DH TTC
              </div>
              {d.status === 'accepte' && (
                <div style={{ marginTop: 8 }}>
                  <Button size="sm">Convertir en facture →</Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function EncaissementsView() {
  const encaisses = FACTURES.filter(f => f.status === 'encaisse').sort((a, b) => b.encaisseLe.localeCompare(a.encaisseLe));
  const total = encaisses.reduce((s, f) => s + f.montantHT * 1.2, 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card padding={0} delay={400}>
        <div style={{
          padding: '14px 18px', borderBottom: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>
            Derniers règlements reçus
          </h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.green, fontWeight: 500 }}>
            {fmtMAD(total)} DH encaissés
          </span>
        </div>
        {encaisses.map((f, i) => (
          <div key={f.num} className="erp-row" style={{
            padding: '12px 18px',
            borderBottom: i < encaisses.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) minmax(110px, 130px)', gap: 12, alignItems: 'center',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 999,
              background: TOKENS.greenSoft, color: TOKENS.green,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="check" size={14} stroke={TOKENS.green} strokeWidth={2.5} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{f.client}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>
                {f.num} · {f.mode} · reçu {fmtDate(f.encaisseLe)}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 600 }}>
              +{fmtMAD(f.montantHT * 1.2)} <span style={{ color: TOKENS.ink3, fontWeight: 400, fontSize: 10 }}>DH</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
function FactureDetail({ facture: f, onClose, onPreview }) {
  const s = STATUS_FACT[f.status];
  const tva = f.montantHT * 0.2;
  const ttc = f.montantHT + tva;
  const isLate = f.status === 'relance1' || f.status === 'relance2' || f.status === 'relance3';

  return (
    <Card padding={0} delay={420} style={{ alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
      <div style={{
        padding: '14px 18px', borderBottom: `1px solid ${TOKENS.line}`,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10,
        background: TOKENS.bg,
      }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{f.num}</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink, marginTop: 4 }}>
            {f.client}
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TOKENS.ink3, padding: 4, marginRight: -4 }}>
          <Icon name="x" size={14} />
        </button>
      </div>

      <div style={{ padding: 18 }}>
        <Pill tone={s.tone} dot>{s.label}</Pill>
        {isLate && (
          <div style={{ marginTop: 10, padding: '8px 10px',
            background: TOKENS.redSoft, borderRadius: 5,
            fontSize: 11.5, color: TOKENS.red, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="alert" size={12} stroke={TOKENS.red} />
            <span>Retard de paiement — {f.joursRetard} jour{f.joursRetard > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Infos */}
        <div style={{ marginTop: 16, padding: 12, background: TOKENS.bgWarm, borderRadius: 6 }}>
          <Row k="Chantier"    v={f.chantier} />
          <Row k="Émise le"    v={fmtDate(f.date)} />
          <Row k="Échéance"    v={fmtDate(f.echeance)} />
          <Row k="Mode"        v={f.mode === 'virement' ? 'Virement bancaire' : 'Chèque'} />
        </div>

        {/* Montants */}
        <div style={{ marginTop: 12, padding: 12, background: TOKENS.paper, border: `1px solid ${TOKENS.line2}`, borderRadius: 6 }}>
          <Row k="Montant HT" v={`${fmtMAD(f.montantHT)} DH`} />
          <Row k="TVA 20 %"   v={`${fmtMAD(tva)} DH`} />
          <Row k="Total TTC"  v={`${fmtMAD(ttc)} DH`} strong />
        </div>

        {/* Actions */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {f.status === 'encaisse' ? (
            <>
              <div style={{ padding: '10px 12px', background: TOKENS.greenSoft, borderRadius: 5,
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: TOKENS.green }}>
                <Icon name="check" size={13} stroke={TOKENS.green} strokeWidth={2.5} />
                Encaissée le {fmtDate(f.encaisseLe)}
              </div>
              <Button>Télécharger le reçu</Button>
            </>
          ) : (
            <>
              <Button variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
                Marquer comme encaissée
              </Button>
              {isLate ? (
                <Button icon={<Icon name="alert" size={13} stroke={TOKENS.ink2} />}>
                  Envoyer une relance
                </Button>
              ) : (
                <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>
                  Envoyer par email
                </Button>
              )}
              <Button onClick={onPreview} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Aperçu A4</Button>
              <Button>Télécharger PDF</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function Row({ k, v, strong }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', padding: '4px 0',
      borderTop: strong ? `1px solid ${TOKENS.line2}` : 'none',
      marginTop: strong ? 4 : 0, paddingTop: strong ? 8 : 4,
      gap: 12,
    }}>
      <span style={{ fontSize: 11.5, color: TOKENS.ink3, flexShrink: 0 }}>{k}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: strong ? 13 : 12,
        color: TOKENS.ink, fontWeight: strong ? 600 : 400, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

Object.assign(window, { Facturation });
