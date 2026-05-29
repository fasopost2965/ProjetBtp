/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, Sparkline, fmtMAD */
// =============================================================================
// ERP — Screen 01 — Dashboard / Tableau de bord multi-chantiers
// =============================================================================

const ACTIVE_SITES = [
  { code: 'CSB-114', name: 'Marina Casablanca — Lot 3 résidentiel', client: 'Al Omrane', city: 'Casablanca',
    conducteur: 'K. Benjelloun', physique: 47, budget: 52, montant: 84_500_000, fin: '2027-03-15',
    status: 'En cours', tone: 'green' },
  { code: 'RBT-208', name: 'Tramway Rabat-Salé — Extension ligne 2', client: 'STRS', city: 'Rabat',
    conducteur: 'H. Alaoui', physique: 12, budget: 18, montant: 142_000_000, fin: '2028-06-30',
    status: 'Démarrage', tone: 'blue' },
  { code: 'TNG-061', name: 'Port Tanger Med — Digue secondaire', client: 'TMSA', city: 'Tanger',
    conducteur: 'M. El Mansouri', physique: 89, budget: 84, montant: 67_300_000, fin: '2026-07-20',
    status: 'En cours', tone: 'green' },
  { code: 'AGD-033', name: 'Hôtel Taghazout Bay — Gros œuvre', client: 'SAPST', city: 'Agadir',
    conducteur: 'S. Fassi', physique: 64, budget: 71, montant: 38_900_000, fin: '2026-11-10',
    status: 'En retard', tone: 'amber' },
  { code: 'MEK-019', name: 'Échangeur autoroute A2 — PK 142', client: 'ADM', city: 'Meknès',
    conducteur: 'Y. Tazi', physique: 31, budget: 29, montant: 56_700_000, fin: '2027-01-25',
    status: 'En cours', tone: 'green' },
  { code: 'CSB-098', name: 'Centre commercial Sidi Maârouf', client: 'Aksal Group', city: 'Casablanca',
    conducteur: 'K. Benjelloun', physique: 95, budget: 92, montant: 124_200_000, fin: '2026-06-15',
    status: 'Réception', tone: 'ocre' },
];

const ALERTS = [
  { level: 'red',    code: 'AGD-033', text: 'Dépassement budget gros œuvre +7% — étanchéité non chiffrée', age: 'il y a 2 h' },
  { level: 'amber',  code: 'CSB-114', text: 'Caution définitive expire dans 18 jours — BMCE Bank', age: 'il y a 4 h' },
  { level: 'amber',  code: 'TNG-061', text: 'Attestation CNSS sous-traitant SOTRAVO à renouveler', age: 'hier' },
  { level: 'red',    code: 'RBT-208', text: 'Ordre de service N°14 non signé — démarrage lot étanchéité bloqué', age: 'hier' },
];

const VALIDATIONS = [
  { kind: 'BC', code: 'BC-2026-0847', label: 'Achat ferraille TOR — 28t', amount: 412_300, site: 'CSB-114', requester: 'H. Alaoui' },
  { kind: 'DA', code: 'DA-2026-1124', label: 'Location grue à tour 60m', amount: 89_500, site: 'RBT-208', requester: 'M. El Mansouri' },
  { kind: 'SIT', code: 'SIT-08/26', label: 'Situation N°8 — gros œuvre', amount: 6_240_000, site: 'TNG-061', requester: 'S. Fassi' },
  { kind: 'SST', code: 'SST-2026-039', label: 'Contrat sous-trait. électricité', amount: 2_180_000, site: 'AGD-033', requester: 'Y. Tazi' },
];

const ACTIVITY = [
  { time: '09:42', who: 'H. Alaoui', what: 'a validé la situation N°4 sur ', target: 'CSB-114', tone: 'green' },
  { time: '09:18', who: 'S. Fassi', what: 'a saisi le pointage du jour (87 ouvriers) sur ', target: 'AGD-033' },
  { time: '08:54', who: 'Système', what: 'a généré 12 factures clients · échéance 30/06', target: '' },
  { time: '08:31', who: 'Y. Tazi', what: 'a clôturé l\'OS N°23 sur ', target: 'MEK-019', tone: 'ocre' },
  { time: 'hier',  who: 'M. El Mansouri', what: 'a téléversé le PV de réception partielle de ', target: 'TNG-061' },
  { time: 'hier',  who: 'Direction', what: 'a transféré 4,2 M DH de la trésorerie centrale vers ', target: 'RBT-208' },
];

const CAUTIONS = [
  { type: 'Définitive', bank: 'BMCE', site: 'CSB-114', amount: 4_225_000, days: 18, tone: 'red' },
  { type: 'Provisoire', bank: 'AWB', site: 'RBT-208', amount: 2_840_000, days: 42, tone: 'amber' },
  { type: 'Retenue gar.', bank: 'CIH', site: 'TNG-061', amount: 1_910_000, days: 67, tone: 'amber' },
  { type: 'Définitive', bank: 'BP', site: 'AGD-033', amount: 1_550_000, days: 124, tone: 'green' },
];

const POINTAGE_TODAY = [
  { code: 'CSB-114', present: 142, absent: 8,  total: 150 },
  { code: 'RBT-208', present: 56,  absent: 4,  total: 60 },
  { code: 'TNG-061', present: 78,  absent: 12, total: 90 },
  { code: 'AGD-033', present: 87,  absent: 3,  total: 90 },
  { code: 'MEK-019', present: 41,  absent: 5,  total: 46 },
];

// Cash flow last 12 weeks
const CASH = [4.2, 3.8, 4.1, 5.2, 4.9, 5.7, 6.1, 5.4, 5.9, 6.8, 7.2, 7.6];

// -----------------------------------------------------------------------------
function Dashboard() {
  const [hebdo, setHebdo] = React.useState(false);
  const [tournee, setTournee] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <DashHeader onHebdo={() => setHebdo(true)} onTournee={() => setTournee(true)} />
      <KpiRow />
      <AlertsStrip />
      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 24 }}>
        <SitesTable />
        <Validations />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        <Cautions />
        <Pointage />
        <Activity />
      </div>
      <HebdoModal open={hebdo} onClose={() => setHebdo(false)} />
      <TourneeModal open={tournee} onClose={() => setTournee(false)} />
    </div>
  );
}

// -----------------------------------------------------------------------------
function DashHeader({ onHebdo, onTournee }) {
  return (
    <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 4 }}>
      <div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
          JEUDI 28 MAI 2026 · S22
        </div>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.15 }}>
          Bonjour Karim. <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>34 chantiers actifs · 6 demandent votre attention.</span>
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={onHebdo} icon={<Icon name="doc" size={14} stroke={TOKENS.ink2} />}>Rapport hebdo</Button>
        <Button onClick={onTournee} variant="primary" iconRight={<Icon name="arrowRight" size={14} stroke={TOKENS.bg} />}>Tournée chantiers</Button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function KpiRow() {
  const items = [
    { label: 'CHIFFRE D\'AFFAIRES · MAI', value: '47,8', unit: 'M DH', delta: 12, deltaLabel: 'vs avril', spark: [3,3.2,3.5,3.4,3.8,4.1,4.0,4.3,4.5,4.7,4.6,4.78], sparkColor: TOKENS.green },
    { label: 'ENGAGEMENTS EN COURS', value: '198,4', unit: 'M DH', delta: -3, deltaLabel: '5 BC à valider', spark: [6,5.8,6.1,5.9,5.7,5.5,5.2,5.0,5.1,4.9,4.8,4.85], sparkColor: TOKENS.amber },
    { label: 'MARGE BRUTE MOYENNE', value: '14,2', unit: '%', delta: 2, deltaLabel: 'cible 13%', spark: [11,11.5,12,12.3,12.8,13,13.4,13.6,13.9,14.0,14.1,14.2], sparkColor: TOKENS.ocre },
    { label: 'CRÉANCES > 60J', value: '23,1', unit: 'M DH', delta: 8, deltaLabel: 'à relancer', spark: [18,19,20,20.5,21,21.5,22,22.3,22.8,22.9,23.0,23.1], sparkColor: TOKENS.red },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {items.map((kpi, i) => (
        <Card key={i} padding={20} hoverable delay={60 * i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Stat label={kpi.label} value={kpi.value} unit={kpi.unit} delta={kpi.delta} deltaLabel={kpi.deltaLabel} />
            <Sparkline data={kpi.spark} color={kpi.sparkColor} fill={`color-mix(in oklch, ${kpi.sparkColor} 12%, transparent)`} width={88} height={40} />
          </div>
        </Card>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
function AlertsStrip() {
  return (
    <Card padding={0} style={{ overflow: 'hidden' }} delay={80}>
      <div style={{
        display: 'flex', alignItems: 'stretch',
        borderBottom: `1px solid ${TOKENS.line}`,
      }}>
        <div style={{
          padding: '12px 18px',
          background: TOKENS.ink, color: TOKENS.bg,
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.12em',
        }}>
          <Icon name="warning" size={14} stroke={TOKENS.ocre} />
          ALERTES · 4
        </div>
        <div style={{ flex: 1 }} />
        <button style={{
          padding: '0 18px', background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'IBM Plex Sans', fontSize: 12, color: TOKENS.ink2,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Voir toutes les alertes <Icon name="arrowRight" size={12} stroke={TOKENS.ink2} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {ALERTS.map((a, i) => (
          <div key={i} style={{
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            borderRight: i % 2 === 0 ? `1px solid ${TOKENS.line}` : 'none',
            borderBottom: i < 2 ? `1px solid ${TOKENS.line}` : 'none',
          }}>
            <span style={{
              width: 4, alignSelf: 'stretch', borderRadius: 2,
              background: a.level === 'red' ? TOKENS.red : TOKENS.amber,
            }} />
            <Pill tone="neutral" mono>{a.code}</Pill>
            <span style={{ flex: 1, fontSize: 13, color: TOKENS.ink }}>{a.text}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>{a.age}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function SitesTable() {
  return (
    <Card padding={0} delay={100}>
      <div style={{ padding: '20px 22px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${TOKENS.line}` }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>
            MES CHANTIERS · 6 DE 34
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: TOKENS.ink, letterSpacing: '-0.01em' }}>
            Avancement physique vs budgétaire
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill tone="ink" dot>Tous</Pill>
          <Pill>Mes affectations</Pill>
          <Pill>En retard</Pill>
          <Pill>Réception</Pill>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr 110px 90px 1fr 90px',
        gap: 0,
        padding: '10px 20px',
        background: TOKENS.bg,
        borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span>Code</span>
        <span>Chantier</span>
        <span>Statut</span>
        <span style={{ textAlign: 'right' }}>Montant</span>
        <span style={{ paddingLeft: 12 }}>Avancement · physique / budget</span>
        <span style={{ textAlign: 'right' }}>Livraison</span>
      </div>

      {ACTIVE_SITES.map((s, i) => {
        const diff = s.physique - s.budget;
        const diffTone = diff >= -2 ? 'green' : diff >= -8 ? 'amber' : 'red';
        return (
          <div key={s.code} className="erp-row" onClick={() => window.location.hash = 'fiche-' + s.code} style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr 110px 90px 1fr 90px',
            gap: 0,
            padding: '16px 22px',
            borderBottom: i < ACTIVE_SITES.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ocreDeep, fontWeight: 500 }}>{s.code}</span>
            <div style={{ minWidth: 0, paddingRight: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.name}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 3, letterSpacing: '0.02em' }}>
                {s.client} · {s.city} · {s.conducteur}
              </div>
            </div>
            <Pill tone={s.tone} dot>{s.status}</Pill>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink }}>
              {fmtMAD(s.montant)}
              <div style={{ fontSize: 9.5, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.04em' }}>DH HT</div>
            </div>
            <div style={{ paddingLeft: 12, paddingRight: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink2, marginBottom: 6 }}>
                <span>{s.physique}% / {s.budget}%</span>
                <span style={{ color: diff < 0 ? TOKENS.red : TOKENS.green }}>
                  {diff > 0 ? '+' : ''}{diff} pts
                </span>
              </div>
              <Progress value={s.physique} target={s.budget} tone={diffTone} />
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>
              {new Date(s.fin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        );
      })}

      <div style={{ padding: '12px 20px', borderTop: `1px solid ${TOKENS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>
          Repère noir = avancement budgétaire prévu · barre = avancement physique constaté
        </span>
        <Button size="sm" iconRight={<Icon name="arrowRight" size={12} stroke={TOKENS.ink2} />}>
          Voir les 34 chantiers
        </Button>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function Validations() {
  const [items, setItems] = React.useState(VALIDATIONS);
  const [toast, setToast] = React.useState(null);

  const handle = (code, action) => {
    setItems(list => list.filter(v => v.code !== code));
    setToast({ code, action });
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <Card padding={0} delay={120}>
      <CardHead
        eyebrow={`À VALIDER PAR VOUS · ${items.length}`}
        title="File de validation"
        right={items.length > 0 ? <Pill tone="ocre" dot>Bloque la production</Pill> : <Pill tone="green" dot>Tout validé</Pill>}
        style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
      />
      {items.length === 0 && (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 999,
            background: TOKENS.greenSoft, color: TOKENS.green,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Icon name="check" size={20} stroke={TOKENS.green} strokeWidth={2} />
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: TOKENS.ink, marginBottom: 4 }}>
            Boite vide. Bon travail.
          </div>
          <div style={{ fontSize: 12, color: TOKENS.ink3 }}>
            Toutes les validations sont à jour.
          </div>
        </div>
      )}
      {items.map((v, i) => (
        <div key={v.code} className="erp-row erp-fade-in" style={{
          padding: '14px 22px',
          borderBottom: i < items.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          display: 'flex', alignItems: 'center', gap: 12,
          animationDelay: 60 * i + 'ms',
        }}>
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: TOKENS.bg,
            border: `1px solid ${TOKENS.line}`,
            borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 500, color: TOKENS.ocreDeep,
            letterSpacing: '0.04em',
          }}>{v.kind}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: TOKENS.ink, marginBottom: 3 }}>{v.label}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, letterSpacing: '0.02em' }}>
              {v.code} · {v.site} · {v.requester}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>
              {fmtMAD(v.amount)}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.04em' }}>DH HT</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="erp-icon-btn" data-tip="Approuver" onClick={() => handle(v.code, 'approuvé')} style={iconBtn}>
              <Icon name="check" size={14} stroke={TOKENS.green} />
            </button>
            <button className="erp-icon-btn" data-tip="Refuser" onClick={() => handle(v.code, 'refusé')} style={iconBtn}>
              <Icon name="x" size={14} stroke={TOKENS.red} />
            </button>
          </div>
        </div>
      ))}

      {toast && (
        <div className="erp-fade-in" style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: TOKENS.ink, color: TOKENS.bg,
          padding: '10px 14px', borderRadius: 6,
          fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 12px 32px -12px rgba(0,0,0,0.4)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: toast.action === 'approuvé' ? TOKENS.green : TOKENS.red }} />
          <span style={{ fontFamily: 'IBM Plex Mono', color: TOKENS.ocre }}>{toast.code}</span>
          <span>{toast.action}</span>
        </div>
      )}
    </Card>
  );
}

const iconBtn = {
  width: 28, height: 28,
  background: TOKENS.paper, border: `1px solid ${TOKENS.line2}`, borderRadius: 4,
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

// -----------------------------------------------------------------------------
function Cautions() {
  return (
    <Card padding={0} delay={180}>
      <CardHead
        eyebrow="CAUTIONS BANCAIRES"
        title="Échéances à 90 jours"
        right={<span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink }}>10,5 M DH</span>}
        style={{ padding: '18px 20px 12px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
      />
      {CAUTIONS.map((c, i) => (
        <div key={i} style={{
          padding: '12px 20px',
          borderBottom: i < CAUTIONS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 38, textAlign: 'center',
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 16,
            color: c.tone === 'red' ? TOKENS.red : c.tone === 'amber' ? TOKENS.amber : TOKENS.ink,
            letterSpacing: '-0.02em',
          }}>
            {c.days}<span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.04em', display: 'block', marginTop: 0 }}>JOURS</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: TOKENS.ink }}>
              {c.type} <span style={{ color: TOKENS.ink3, fontWeight: 400 }}>· {c.bank}</span>
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>
              {c.site}
            </div>
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink }}>
            {fmtMAD(c.amount)}
          </div>
        </div>
      ))}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function Pointage() {
  const totalPresent = POINTAGE_TODAY.reduce((s, p) => s + p.present, 0);
  const totalAbsent = POINTAGE_TODAY.reduce((s, p) => s + p.absent, 0);
  const totalAll = POINTAGE_TODAY.reduce((s, p) => s + p.total, 0);
  const rate = ((totalPresent / totalAll) * 100).toFixed(1);

  return (
    <Card padding={0} delay={240}>
      <CardHead
        eyebrow="POINTAGE · AUJOURD'HUI 28/05"
        title="Présence ouvriers"
        right={<Pill tone="green" dot mono>{rate}%</Pill>}
        style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
      />
      <div style={{
        padding: '14px 20px',
        background: TOKENS.bg,
        borderBottom: `1px solid ${TOKENS.line}`,
        display: 'flex', gap: 24,
      }}>
        <div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.ink, letterSpacing: '-0.02em', lineHeight: 1 }}>{totalPresent}</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 4, letterSpacing: '0.08em' }}>PRÉSENTS</div>
        </div>
        <div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.red, letterSpacing: '-0.02em', lineHeight: 1 }}>{totalAbsent}</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 4, letterSpacing: '0.08em' }}>ABSENTS</div>
        </div>
        <div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.ink3, letterSpacing: '-0.02em', lineHeight: 1 }}>{totalAll}</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 4, letterSpacing: '0.08em' }}>EFFECTIF</div>
        </div>
      </div>
      {POINTAGE_TODAY.map((p, i) => {
        const pct = (p.present / p.total) * 100;
        return (
          <div key={p.code} style={{
            padding: '11px 20px',
            borderBottom: i < POINTAGE_TODAY.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, width: 64 }}>{p.code}</span>
            <div style={{ flex: 1 }}>
              <Progress value={pct} tone={pct > 90 ? 'green' : pct > 80 ? 'amber' : 'red'} height={5} />
            </div>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink, width: 56, textAlign: 'right' }}>
              {p.present} / {p.total}
            </span>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function Activity() {
  return (
    <Card padding={0} delay={300}>
      <CardHead
        eyebrow="ACTIVITÉ"
        title="Journal en temps réel"
        right={<Pill mono dot tone="green">● Live</Pill>}
        style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
      />
      <div style={{ padding: '4px 0' }}>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{
            padding: '10px 20px',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, width: 38, paddingTop: 1, letterSpacing: '0.02em' }}>
              {a.time}
            </span>
            <span style={{
              width: 6, height: 6, borderRadius: 999, marginTop: 7,
              background: a.tone === 'green' ? TOKENS.green : a.tone === 'ocre' ? TOKENS.ocre : TOKENS.ink4,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, fontSize: 12.5, color: TOKENS.ink2, lineHeight: 1.45 }}>
              <span style={{ color: TOKENS.ink, fontWeight: 500 }}>{a.who}</span> {a.what}
              {a.target && (
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep }}>
                  {a.target}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// =============================================================================
// HEBDO REPORT MODAL — preview before download
// =============================================================================
function HebdoModal({ open, onClose }) {
  const { Modal, Button, Pill } = window;
  const [period, setPeriod] = React.useState('S22');
  const [sites, setSites] = React.useState(['CSB-114', 'RBT-208', 'TNG-061', 'AGD-033']);
  const allSites = ['CSB-114', 'RBT-208', 'TNG-061', 'AGD-033', 'MEK-019', 'CSB-098'];
  const toggle = (c) => setSites(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c]);

  const send = () => {
    onClose();
    window.toast('Rapport hebdo S22 généré', 'success', `${sites.length} chantiers · 14 pages`);
  };
  const download = () => {
    window.toast('Téléchargement du PDF', 'info', 'rapport-hebdo-S22.pdf');
  };

  if (!Modal) return null;
  return (
    <Modal open={open} onClose={onClose}
      title="Rapport hebdomadaire de chantier"
      subtitle="Document destiné au MOE — récap météo, effectif, faits marquants, photos"
      width={780}
      footer={<>
        <Button onClick={onClose}>Fermer</Button>
        <Button onClick={download} icon={<Icon name="arrowDown" size={13} stroke={TOKENS.ink2} />}>Télécharger PDF</Button>
        <Button onClick={send} variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>Envoyer au MOE</Button>
      </>}
    >
      {/* period + scope */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 7, textTransform: 'uppercase' }}>SEMAINE</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['S20', 'S21', 'S22', 'S23'].map(s => (
              <button key={s} onClick={() => setPeriod(s)} style={{
                padding: '8px 14px', borderRadius: 5, cursor: 'pointer',
                background: period === s ? TOKENS.ink : TOKENS.bgWarm,
                color: period === s ? TOKENS.bg : TOKENS.ink2, border: 'none',
                fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 500,
              }}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 7, textTransform: 'uppercase' }}>CHANTIERS · {sites.length} SÉLECTIONNÉS</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {allSites.map(c => (
              <button key={c} onClick={() => toggle(c)} style={{
                padding: '5px 10px', borderRadius: 4, cursor: 'pointer',
                background: sites.includes(c) ? TOKENS.ocreDeep : TOKENS.bgWarm,
                color: sites.includes(c) ? TOKENS.bg : TOKENS.ink2, border: 'none',
                fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.02em',
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 8 }}>APERÇU</div>
      <div style={{
        border: `1px solid ${TOKENS.line}`, borderRadius: 6, overflow: 'hidden',
        background: TOKENS.paper,
      }}>
        <div style={{ background: TOKENS.ink, color: TOKENS.bg, padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>Rapport hebdomadaire — {period} · 28/05/2026</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4, marginTop: 3, letterSpacing: '0.04em' }}>Atlas Constructions · K. Benjelloun</div>
          </div>
          <Pill mono tone="ocre">{sites.length} CHANTIERS</Pill>
        </div>
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            ['MÉTÉO', '☀ 26°', TOKENS.amber],
            ['EFFECTIF MOYEN', '317 ouvriers', TOKENS.green],
            ['HEURES POINTÉES', '11 240 h', TOKENS.ocre],
            ['INCIDENTS HSE', '0', TOKENS.green],
          ].map(([l, v, c]) => (
            <div key={l} style={{ padding: 10, background: TOKENS.bg, borderRadius: 5, borderLeft: `3px solid ${c}` }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{l}</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: TOKENS.ink, marginTop: 4, letterSpacing: '-0.01em' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 8 }}>FAITS MARQUANTS</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: TOKENS.ink2, lineHeight: 1.7 }}>
            <li>CSB-114 — coulage dalle haute R+3 finalisé mardi 26/05 · 380 m³</li>
            <li>TNG-061 — réception partielle digue Est, lot 1 — PV signé MOE</li>
            <li>AGD-033 — retard étanchéité 4 jours · sous-traitant SOTRAVO relancé</li>
            <li>RBT-208 — démarrage terrassement station Hassan + 2 — 18/05</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

// =============================================================================
// TOURNÉE CHANTIERS MODAL — planning visite chantiers
// =============================================================================
function TourneeModal({ open, onClose }) {
  const { Modal, Button, Pill } = window;
  const [date, setDate] = React.useState('29/05/2026');
  const sites = [
    { code: 'CSB-114', name: 'Marina Casablanca L3', city: 'Casablanca',  km: 12,  duration: '1h45', priority: 'high',   reason: 'Validation béton dalle R+3' },
    { code: 'CSB-098', name: 'CC Sidi Maârouf',     city: 'Casablanca',  km: 8,   duration: '0h45', priority: 'normal', reason: 'Réception partielle lot 2' },
    { code: 'RBT-208', name: 'Tramway Rabat-Salé',  city: 'Rabat',       km: 95,  duration: '2h00', priority: 'normal', reason: 'Réunion MOE STRS' },
    { code: 'MEK-019', name: 'Échangeur A2',        city: 'Meknès',      km: 145, duration: '1h15', priority: 'low',    reason: 'Audit avancement' },
  ];
  const totalKm = sites.reduce((s, x) => s + x.km, 0);
  const lance = () => {
    onClose();
    window.toast('Tournée planifiée — 4 chantiers', 'success', `${totalKm} km · départ 06:30`);
  };
  const navi = () => window.toast('Itinéraire envoyé sur Waze', 'info', '4 étapes · 5h45 cumulé');

  if (!Modal) return null;
  return (
    <Modal open={open} onClose={onClose}
      title="Tournée des chantiers"
      subtitle="Planification des visites · itinéraire optimisé"
      width={720}
      footer={<>
        <Button onClick={onClose}>Fermer</Button>
        <Button onClick={navi} icon={<Icon name="pin" size={13} stroke={TOKENS.ink2} />}>Ouvrir dans Waze</Button>
        <Button onClick={lance} variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>Démarrer la tournée</Button>
      </>}
    >
      {/* Date strip */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
        <div style={{
          padding: '10px 14px', background: TOKENS.ink, color: TOKENS.bg,
          borderRadius: 7, fontFamily: 'IBM Plex Mono', fontSize: 13, letterSpacing: '0.04em',
        }}>{date}</div>
        <div style={{ display: 'flex', gap: 16, flex: 1, justifyContent: 'flex-end', fontSize: 12 }}>
          <div><span style={{ color: TOKENS.ink3 }}>Distance</span> <b style={{ fontFamily: 'IBM Plex Mono' }}>{totalKm} km</b></div>
          <div><span style={{ color: TOKENS.ink3 }}>Durée</span> <b style={{ fontFamily: 'IBM Plex Mono' }}>5h45</b></div>
          <div><span style={{ color: TOKENS.ink3 }}>Visites</span> <b style={{ fontFamily: 'IBM Plex Mono' }}>{sites.length}</b></div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 18 }}>
        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: TOKENS.line2 }} />
        {sites.map((s, i) => {
          const tone = s.priority === 'high' ? TOKENS.red : s.priority === 'normal' ? TOKENS.ocre : TOKENS.ink3;
          return (
            <div key={s.code} style={{ position: 'relative', paddingBottom: 14 }}>
              <span style={{
                position: 'absolute', left: -18, top: 14, width: 16, height: 16, borderRadius: 999,
                background: tone, border: `3px solid ${TOKENS.paper}`,
                boxShadow: `0 0 0 1px ${tone}`,
              }} />
              <div style={{
                background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 7,
                padding: 14, marginLeft: 8,
                display: 'grid', gridTemplateColumns: '70px 1fr 90px 90px', gap: 12, alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.ink, fontWeight: 600 }}>
                    {String(7 + i * 2).padStart(2, '0')}:00
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>{s.duration}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, fontWeight: 600 }}>{s.code}</span>
                    <Pill tone={s.priority === 'high' ? 'red' : 'neutral'} mono>{s.priority === 'high' ? 'PRIORITÉ' : s.city}</Pill>
                  </div>
                  <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 2 }}>{s.reason}</div>
                </div>
                <div style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>
                  {s.km} km
                </div>
                <Button size="sm" onClick={() => window.toast(`Fiche ${s.code} ouverte`)}>Détails</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

Object.assign(window, { Dashboard });
