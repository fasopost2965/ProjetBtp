/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Sparkline, fmtMAD */
// =============================================================================
// ERP — Trésorerie & cautions bancaires
// Comptes multi-banques · prévisionnel 12 semaines · cautions de marché (CCAG)
// =============================================================================

(function () {
const moisCourt = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const fmtD = (iso) => { const [y, m, d] = iso.split('-'); return `${parseInt(d)} ${moisCourt[parseInt(m) - 1]} ${y.slice(2)}`; };

const COMPTES = [
  { banque: 'Attijariwafa Bank', label: 'Compte courant principal', rib: '007 780 0001234567890 12', solde: 4_280_000, decouvert: 2_000_000, tone: 'ocre', trend: [3.1, 3.4, 3.0, 3.8, 4.2, 3.9, 4.28] },
  { banque: 'Bank of Africa',    label: 'Compte marchés publics',   rib: '011 450 0009876543210 88', solde: 1_640_000, decouvert: 1_000_000, tone: 'blue', trend: [2.2, 1.9, 2.1, 1.7, 1.5, 1.8, 1.64] },
  { banque: 'Banque Populaire',  label: 'Compte salaires & charges', rib: '021 810 0004455667788 03', solde: 890_000,  decouvert: 500_000,  tone: 'green', trend: [1.2, 1.1, 0.9, 1.0, 0.95, 0.92, 0.89] },
];

// Prévisionnel 8 semaines — entrées / sorties (kDH)
const PREVI = [
  { sem: 'S-22', from: '25 mai', enc: 1850, dec: 1620 },
  { sem: 'S-23', from: '1 juin', enc: 980,  dec: 2240 },
  { sem: 'S-24', from: '8 juin', enc: 2680, dec: 1180 },
  { sem: 'S-25', from: '15 juin', enc: 640,  dec: 1960 },
  { sem: 'S-26', from: '22 juin', enc: 3120, dec: 1340 },
  { sem: 'S-27', from: '29 juin', enc: 1240, dec: 2080 },
  { sem: 'S-28', from: '6 juil', enc: 2240, dec: 1120 },
  { sem: 'S-29', from: '13 juil', enc: 1680, dec: 1880 },
];

const FLUX = [
  { date: '2026-06-02', label: 'Paie & charges sociales mai', sens: 'out', mt: 1_240_000, cat: 'Paie', sur: 'Banque Populaire', certain: true },
  { date: '2026-06-05', label: 'Décompte n°4 — Marina CSB-114 (ADM)', sens: 'in', mt: 2_680_000, cat: 'Situation', sur: 'Bank of Africa', certain: true },
  { date: '2026-06-08', label: 'Fournisseur Lafarge — BC ciment', sens: 'out', mt: 620_000, cat: 'Achat', sur: 'Attijariwafa', certain: true },
  { date: '2026-06-10', label: 'Déclaration CNSS / DAMANCOM', sens: 'out', mt: 380_000, cat: 'Social', sur: 'Banque Populaire', certain: true },
  { date: '2026-06-15', label: 'Facture FA-26-038 Résidence El Manar', sens: 'in', mt: 1_704_000, cat: 'Client', sur: 'Attijariwafa', certain: false },
  { date: '2026-06-18', label: 'Échéance traite matériel — SOMACA', sens: 'out', mt: 240_000, cat: 'Crédit-bail', sur: 'Attijariwafa', certain: true },
  { date: '2026-06-22', label: 'Décompte Tramway RBT-208', sens: 'in', mt: 3_120_000, cat: 'Situation', sur: 'Bank of Africa', certain: false },
];

const CAUTIONS = [
  { ref: 'CAU-26-007', type: 'Retenue de garantie', marche: 'Marina Casablanca Lot 3', mo: 'ADM', banque: 'Attijariwafa', montant: 1_500_000, taux: '5 %', emise: '2025-09-12', echeance: '2026-12-30', status: 'active' },
  { ref: 'CAU-26-006', type: "Restitution d'avance", marche: 'Tramway Rabat-Salé', mo: 'STRS', banque: 'Bank of Africa', montant: 4_200_000, taux: '10 %', emise: '2026-01-20', echeance: '2026-08-15', status: 'active' },
  { ref: 'CAU-26-005', type: 'Bonne exécution', marche: 'Port Tanger Med', mo: 'TMSA', banque: 'Attijariwafa', montant: 980_000, taux: '3 %', emise: '2025-11-04', echeance: '2026-06-18', status: 'echeance' },
  { ref: 'CAU-26-004', type: 'Soumission', marche: 'Hôpital régional Béni Mellal', mo: 'Min. Santé', banque: 'Bank of Africa', montant: 350_000, taux: '1,5 %', emise: '2026-04-28', echeance: '2026-07-10', status: 'active' },
  { ref: 'CAU-26-002', type: 'Retenue de garantie', marche: 'Échangeur A2 PK 142', mo: 'ADM', banque: 'Attijariwafa', montant: 720_000, taux: '5 %', emise: '2024-06-01', echeance: '2026-05-31', status: 'liberable' },
];

const CAUTION_TONE = {
  active:    { label: 'Active', tone: 'blue' },
  echeance:  { label: 'Échéance proche', tone: 'amber' },
  liberable: { label: 'Libérable', tone: 'green' },
};

// Budget 12 mois — données
const BUDGET_12M = [
  { mois: 'Juin 26',  budget_enc: 8200,  real_enc: null, budget_dec: 7100, real_dec: null, note: null },
  { mois: 'Juil 26', budget_enc: 9100,  real_enc: null, budget_dec: 7800, real_dec: null, note: null },
  { mois: 'Août 26', budget_enc: 6800,  real_enc: null, budget_dec: 6400, real_dec: null, note: null },
  { mois: 'Sep 26',  budget_enc: 11200, real_enc: null, budget_dec: 8900, real_dec: null, note: null },
  { mois: 'Oct 26',  budget_enc: 9800,  real_enc: null, budget_dec: 7500, real_dec: null, note: null },
  { mois: 'Nov 26',  budget_enc: 8400,  real_enc: null, budget_dec: 8100, real_dec: null, note: null },
  { mois: 'Déc 26',  budget_enc: 7200,  real_enc: null, budget_dec: 6800, real_dec: null, note: 'Congés annuels' },
  { mois: 'Jan 27',  budget_enc: 10100, real_enc: null, budget_dec: 8400, real_dec: null, note: null },
  { mois: 'Fév 27',  budget_enc: 9400,  real_enc: null, budget_dec: 7900, real_dec: null, note: null },
  { mois: 'Mar 27',  budget_enc: 12100, real_enc: null, budget_dec: 9200, real_dec: null, note: null },
  { mois: 'Avr 27',  budget_enc: 11400, real_enc: null, budget_dec: 8800, real_dec: null, note: null },
  { mois: 'Mai 27',  budget_enc: 10200, real_enc: null, budget_dec: 8100, real_dec: null, note: null },
];

// Effets de commerce
const EFFETS = [
  { ref: 'EFF-26-014', benef: 'Sonasid', montant: 840_000, echeance: '2026-06-15', status: 'portefeuille', banque: 'Attijariwafa' },
  { ref: 'EFF-26-015', benef: 'LafargeHolcim', montant: 620_000, echeance: '2026-06-28', status: 'encaissement', banque: 'Bank of Africa' },
  { ref: 'EFF-26-012', benef: 'Granulats du Souss', montant: 285_000, echeance: '2026-05-20', status: 'impaye', banque: 'Attijariwafa' },
  { ref: 'EFF-26-016', benef: 'CIMAR Béton', montant: 420_000, echeance: '2026-07-10', status: 'portefeuille', banque: 'Banque Populaire' },
];

const EFFET_STATUS = {
  portefeuille: { label: 'En portefeuille', tone: 'neutral' },
  encaissement: { label: "Remis à l'encaissement", tone: 'blue' },
  impaye:       { label: 'Impayé', tone: 'red' },
};

// Rapprochement bancaire
const RAPPROCHEMENT = [
  { date: '2026-05-26', libelle: 'VIR STRS — Situation 4/2026', mt: 3_120_000, compte: 'Bank of Africa', statut: 'rapproche', ecriture: 'FAC-26-042' },
  { date: '2026-05-24', libelle: 'PRELEVEMENT ATTIJARIWAFA — Crédit mat.', mt: -420_000, compte: 'Attijariwafa', statut: 'rapproche', ecriture: 'BC-26-124' },
  { date: '2026-05-22', libelle: 'VIR ADM — Décompte CSB-114', mt: 2_680_000, compte: 'Attijariwafa', statut: 'rapproche', ecriture: 'FAC-26-041' },
  { date: '2026-05-20', libelle: 'PRELEVEMENT CNSS DAMANCOM', mt: -380_000, compte: 'Banque Populaire', statut: 'rapproche', ecriture: 'PAI-26-05' },
  { date: '2026-05-19', libelle: 'Remise chèque — client Bennani', mt: 840_000, compte: 'Attijariwafa', statut: 'non_rapproche', ecriture: null },
  { date: '2026-05-15', libelle: 'Virement sortant — réf inconnue', mt: -125_000, compte: 'Bank of Africa', statut: 'ecart', ecriture: null },
];

// -----------------------------------------------------------------------------
function Tresorerie() {
  const [tab, setTab] = React.useState('flux'); // flux | cautions | budget | rapprochement

  const soldeTotal = COMPTES.reduce((s, c) => s + c.solde, 0);
  const ligneTotal = COMPTES.reduce((s, c) => s + c.decouvert, 0);
  const totalEnc = FLUX.filter(f => f.sens === 'in').reduce((s, f) => s + f.mt, 0);
  const totalDec = FLUX.filter(f => f.sens === 'out').reduce((s, f) => s + f.mt, 0);
  const cautionsEngagees = CAUTIONS.filter(c => c.status !== 'liberable').reduce((s, c) => s + c.montant, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            TRÉSORERIE · POSITION AU 28 MAI 2026
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Trésorerie &amp; cautions bancaires
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
            3 comptes · {CAUTIONS.length} cautions de marché en cours
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button icon={<Icon name="refresh" size={13} stroke={TOKENS.ink2} />}>Synchroniser banques</Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Demander une caution</Button>
        </div>
      </div>

      {/* KPI strip — 4 chiffres (refonte UX : DSO/DPO déplacés en Compta) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <TresoKpi label="SOLDE DISPONIBLE" value={fmtMAD(soldeTotal)} unit="DH" sub={`+ ${fmtMAD(ligneTotal)} de lignes autorisées`} tone="ink" delay={60} />
        <TresoKpi label="ENCAISSEMENTS PRÉVUS" value={fmtMAD(totalEnc)} unit="DH" sub="sous 4 semaines" tone="green" delay={120} />
        <TresoKpi label="DÉCAISSEMENTS PRÉVUS" value={fmtMAD(totalDec)} unit="DH" sub="paie, achats, traites" tone="amber" delay={180} />
        <TresoKpi label="CAUTIONS ENGAGÉES" value={fmtMAD(cautionsEngagees)} unit="DH" sub={`${CAUTIONS.filter(c => c.status !== 'liberable').length} cautions actives`} tone="blue" delay={240} />
      </div>

      {/* Comptes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {COMPTES.map((c, i) => (
          <Card key={c.rib} delay={420 + i * 60} padding={18} hoverable>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: TOKENS.ink }}>{c.banque}</div>
                <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 3 }}>{c.label}</div>
              </div>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: { ocre: TOKENS.ocre, blue: TOKENS.blue, green: TOKENS.green }[c.tone], marginTop: 4 }} />
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4, marginTop: 10, letterSpacing: '0.02em' }}>RIB {c.rib}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
              <div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 24, color: TOKENS.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>
                  {fmtMAD(c.solde)}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 5 }}>DH disponible</div>
              </div>
              <Sparkline data={c.trend} width={92} height={34} color={{ ocre: TOKENS.ocre, blue: TOKENS.blue, green: TOKENS.green }[c.tone]} fill={`${({ ocre: TOKENS.ocre, blue: TOKENS.blue, green: TOKENS.green }[c.tone])}14`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Prévisionnel 8 semaines */}
      <PreviChart soldeStart={soldeTotal} />

      {/* Tabs — refonte UX : l'opérationnel d'abord, la compta regroupée */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${TOKENS.line}` }} className="erp-fade-in">
        {[
          ['flux', 'Échéancier de trésorerie'],
          ['cautions', `Cautions bancaires (${CAUTIONS.length})`],
          ['compta', 'Compta »'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === id ? TOKENS.ink : 'transparent'}`,
            color: tab === id ? TOKENS.ink : TOKENS.ink3, cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === id ? 600 : 400, marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {tab === 'flux'     && <FluxTable />}
      {tab === 'cautions' && <CautionsSection />}
      {tab === 'compta'   && <ComptaSection />}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Refonte UX — onglet « Compta » : regroupe budget 12 mois, rapprochement
// et ratios DSO/DPO/BFR (vocabulaire DAF isolé de la vue patron)
function ComptaSection() {
  const [sub, setSub] = React.useState('budget'); // budget | rapprochement
  const ratios = [
    { label: 'DSO CLIENTS', value: '68', unit: 'jours', sub: 'délai moyen encaissement', tone: 'ocre' },
    { label: 'DPO FOURNISSEURS', value: '45', unit: 'jours', sub: 'délai moyen paiement', tone: 'neutral' },
    { label: 'BFR ESTIMÉ', value: '9,4', unit: 'M DH', sub: 'créances − dettes', tone: 'blue' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Ratios financiers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {ratios.map((r, i) => <TresoKpi key={r.label} {...r} delay={i * 60} />)}
      </div>
      {/* Sub-toggle budget / rapprochement */}
      <div style={{ display: 'flex', gap: 4, background: TOKENS.bgWarm, borderRadius: 6, padding: 2, alignSelf: 'flex-start' }}>
        {[['budget', 'Budget 12 mois'], ['rapprochement', 'Rapprochement bancaire']].map(([id, label]) => {
          const active = sub === id;
          return (
            <button key={id} onClick={() => setSub(id)} style={{
              padding: '7px 14px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: active ? TOKENS.paper : 'transparent',
              color: active ? TOKENS.ink : TOKENS.ink3,
              fontFamily: 'IBM Plex Sans', fontSize: 12.5, fontWeight: active ? 600 : 400,
              boxShadow: active ? '0 1px 2px rgba(26,24,20,0.08)' : 'none',
            }}>{label}</button>
          );
        })}
      </div>
      {sub === 'budget' && <BudgetTable />}
      {sub === 'rapprochement' && <RapprochementView />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function TresoKpi({ label, value, unit, sub, tone, delay }) {
  const dark = tone === 'ink';
  const colors = { green: TOKENS.green, amber: TOKENS.amber, blue: TOKENS.blue, ocre: TOKENS.ocre };
  const accent = colors[tone];
  return (
    <Card delay={delay} padding={18} style={{ background: dark ? TOKENS.ink : TOKENS.paper, borderColor: dark ? TOKENS.ink : TOKENS.line }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />}
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: dark ? TOKENS.ocre : (accent || TOKENS.ink3), letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 26, letterSpacing: '-0.025em', color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 11, marginTop: 8, color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function PreviChart({ soldeStart }) {
  const maxVal = Math.max(...PREVI.flatMap(p => [p.enc, p.dec]));
  // running balance
  let running = soldeStart / 1000;
  const balances = PREVI.map(p => { running += p.enc - p.dec; return running; });

  return (
    <Card delay={480} padding={0}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 14 }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Prévisionnel de trésorerie · 8 semaines</h3>
        <span style={{ flex: 1 }} />
        <Legend color={TOKENS.green} label="Encaissements" />
        <Legend color={TOKENS.ocreDeep} label="Décaissements" />
        <Legend color={TOKENS.ink} label="Solde projeté" line />
      </div>
      <div style={{ padding: '22px 20px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PREVI.length}, 1fr)`, gap: 10, alignItems: 'end', height: 150 }}>
          {PREVI.map((p, i) => {
            const encH = (p.enc / maxVal) * 100;
            const decH = (p.dec / maxVal) * 100;
            const low = balances[i] < 1000;
            return (
              <div key={p.sem} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ display: 'flex', gap: 3, alignItems: 'end', height: '100%', width: '100%', justifyContent: 'center' }}>
                  <div className="erp-progress-fill" style={{ width: 11, height: `${encH}%`, background: TOKENS.green, borderRadius: '2px 2px 0 0', transformOrigin: 'bottom', animationName: 'erpGrowY' }} />
                  <div className="erp-progress-fill" style={{ width: 11, height: `${decH}%`, background: TOKENS.ocreDeep, borderRadius: '2px 2px 0 0', transformOrigin: 'bottom', animationName: 'erpGrowY' }} />
                </div>
              </div>
            );
          })}
        </div>
        {/* projected balance line overlay (text values) */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PREVI.length}, 1fr)`, gap: 10, marginTop: 8 }}>
          {PREVI.map((p, i) => {
            const low = balances[i] < 1000;
            return (
              <div key={p.sem} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600, color: low ? TOKENS.red : TOKENS.ink }}>
                  {balances[i].toFixed(0)}k
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 3 }}>{p.sem}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink4, marginTop: 1 }}>{p.from}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: '10px 12px', background: TOKENS.bgWarm, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: TOKENS.ink2 }}>
          <Icon name="gauge" size={14} stroke={TOKENS.ocreDeep} />
          Point bas projeté en <strong style={{ color: TOKENS.ink }}>S-25 (15 juin)</strong> — prévoir la mobilisation d'une partie de la ligne Bank of Africa avant le décompte du 22 juin.
        </div>
      </div>
    </Card>
  );
}

function Legend({ color, label, line }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>
      <span style={{ width: line ? 14 : 9, height: line ? 2 : 9, borderRadius: line ? 0 : 2, background: color }} />
      {label}
    </span>
  );
}

// -----------------------------------------------------------------------------
function FluxTable() {
  return (
    <Card padding={0} delay={520}>
      <div style={{
        display: 'grid', gridTemplateColumns: '110px 1fr 150px 130px 140px',
        padding: '11px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Date</span><span>Opération</span><span>Compte</span><span>Type</span><span style={{ textAlign: 'right' }}>Montant</span>
      </div>
      {FLUX.map((f, i) => (
        <div key={i} className="erp-row" style={{
          display: 'grid', gridTemplateColumns: '110px 1fr 150px 130px 140px',
          padding: '13px 20px', borderBottom: i < FLUX.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>{fmtD(f.date)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            <span style={{
              width: 26, height: 26, borderRadius: 6, flexShrink: 0,
              background: f.sens === 'in' ? TOKENS.greenSoft : TOKENS.ocreSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={f.sens === 'in' ? 'arrowDown' : 'arrowUp'} size={12} stroke={f.sens === 'in' ? TOKENS.green : TOKENS.ocreDeep} strokeWidth={2.4} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.label}</div>
              {!f.certain && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.amber }}>prévision · non confirmé</span>}
            </div>
          </div>
          <span style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{f.sur}</span>
          <span><Pill tone="neutral">{f.cat}</Pill></span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: f.sens === 'in' ? TOKENS.green : TOKENS.ink }}>
            {f.sens === 'in' ? '+' : '−'}{fmtMAD(f.mt)}
          </span>
        </div>
      ))}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function CautionsTable() {
  const total = CAUTIONS.reduce((s, c) => s + c.montant, 0);
  return (
    <Card padding={0} delay={520}>
      <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Engagements par signature</h3>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>Encours total <strong style={{ color: TOKENS.ink }}>{fmtMAD(total)} DH</strong></span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '120px 1fr 130px 130px 150px',
        padding: '10px 20px', borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Référence</span><span>Marché / type</span><span>Échéance</span><span style={{ textAlign: 'right' }}>Montant</span><span style={{ textAlign: 'right' }}>Statut</span>
      </div>
      {CAUTIONS.map((c, i) => {
        const st = CAUTION_TONE[c.status];
        return (
          <div key={c.ref} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 130px 130px 150px',
            padding: '14px 20px', borderBottom: i < CAUTIONS.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{c.ref}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>{c.banque}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{c.type}</div>
              <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 3 }}>{c.marche} <span style={{ color: TOKENS.line2 }}>·</span> MO : {c.mo} <span style={{ color: TOKENS.line2 }}>·</span> {c.taux}</div>
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: c.status === 'echeance' ? TOKENS.amber : TOKENS.ink2 }}>{fmtD(c.echeance)}</div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{fmtMAD(c.montant)}</div>
            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <Pill tone={st.tone} dot>{st.label}</Pill>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Cautions + Effets de commerce (combined cautions tab)
function CautionsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <CautionsTable />
      <EffetsTable />
    </div>
  );
}

// -----------------------------------------------------------------------------
function EffetsTable() {
  const total = EFFETS.reduce((s, e) => s + e.montant, 0);
  return (
    <Card padding={0} delay={600}>
      <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Effets de commerce</h3>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>Total <strong style={{ color: TOKENS.ink }}>{fmtMAD(total)} DH</strong></span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '120px 1fr 120px 150px 130px 160px',
        padding: '10px 20px', background: TOKENS.ink, borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.bg, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Réf</span><span>Bénéficiaire</span><span>Échéance</span><span>Banque</span><span style={{ textAlign: 'right' }}>Montant</span><span style={{ textAlign: 'right' }}>Statut</span>
      </div>
      {EFFETS.map((e, i) => {
        const st = EFFET_STATUS[e.status];
        return (
          <div key={e.ref} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: '120px 1fr 120px 150px 130px 160px',
            padding: '13px 20px', borderBottom: i < EFFETS.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{e.ref}</div>
            <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{e.benef}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: e.status === 'impaye' ? TOKENS.red : TOKENS.ink2 }}>{fmtD(e.echeance)}</div>
            <div style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{e.banque}</div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{fmtMAD(e.montant)}</div>
            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
              <Pill tone={st.tone} dot>{st.label}</Pill>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function BudgetTable() {
  const totEnc = BUDGET_12M.reduce((s, r) => s + r.budget_enc, 0);
  const totDec = BUDGET_12M.reduce((s, r) => s + r.budget_dec, 0);
  const totExc = totEnc - totDec;

  // Mini SVG cash flow curve
  const svgW = 560, svgH = 72;
  const excedents = BUDGET_12M.map(r => r.budget_enc - r.budget_dec);
  const minE = Math.min(...excedents);
  const maxE = Math.max(...excedents);
  const range = maxE - minE || 1;
  const pts = excedents.map((e, i) => {
    const x = (i / (excedents.length - 1)) * (svgW - 20) + 10;
    const y = svgH - 10 - ((e - minE) / range) * (svgH - 20);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const zeroY = svgH - 10 - ((0 - minE) / range) * (svgH - 20);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Mini chart */}
      <Card padding={16} delay={520}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em' }}>EXCÉDENT DE TRÉSORERIE · COURBE 12 MOIS (kDH)</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Legend color={TOKENS.green} label="Enc. budget" />
            <Legend color={TOKENS.red} label="Déc. budget" />
            <Legend color={TOKENS.ink} label="Excédent" line />
          </div>
        </div>
        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible' }}>
          {/* Zero line */}
          {minE < 0 && (
            <line x1="10" y1={zeroY} x2={svgW - 10} y2={zeroY}
              stroke={TOKENS.line2} strokeWidth={1} strokeDasharray="4,3" />
          )}
          {/* Area fill */}
          <polyline
            points={`10,${svgH - 10} ${polyline} ${svgW - 10},${svgH - 10}`}
            fill={`${TOKENS.green}22`} stroke="none"
          />
          {/* Curve */}
          <polyline points={polyline} fill="none" stroke={TOKENS.ink} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {/* Points */}
          {pts.map((pt, i) => {
            const [x, y] = pt.split(',').map(Number);
            const exc = excedents[i];
            return (
              <circle key={i} cx={x} cy={y} r={3.5}
                fill={exc >= 0 ? TOKENS.green : TOKENS.red}
                stroke={TOKENS.paper} strokeWidth={1.5} />
            );
          })}
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BUDGET_12M.length}, 1fr)`, marginTop: 6 }}>
          {BUDGET_12M.map((r, i) => (
            <div key={i} style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4 }}>{r.mois.split(' ')[0]}</div>
          ))}
        </div>
      </Card>

      {/* Table */}
      <Card padding={0} delay={580}>
        <div style={{
          display: 'grid', gridTemplateColumns: '100px 120px 120px 130px 80px',
          padding: '10px 20px', background: TOKENS.ink, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.bg, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Mois</span>
          <span style={{ textAlign: 'right' }}>Enc. budget</span>
          <span style={{ textAlign: 'right' }}>Déc. budget</span>
          <span style={{ textAlign: 'right' }}>Excédent budget</span>
          <span>Notes</span>
        </div>
        {BUDGET_12M.map((r, i) => {
          const exc = r.budget_enc - r.budget_dec;
          const excPos = exc >= 0;
          return (
            <div key={i} className="erp-row" style={{
              display: 'grid', gridTemplateColumns: '100px 120px 120px 130px 80px',
              padding: '11px 20px', borderBottom: i < BUDGET_12M.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink, fontWeight: 500 }}>{r.mois}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.green }}>{r.budget_enc.toLocaleString('fr-FR')} k</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>{r.budget_dec.toLocaleString('fr-FR')} k</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, fontWeight: 600, color: excPos ? TOKENS.green : TOKENS.red }}>
                {excPos ? '+' : ''}{exc.toLocaleString('fr-FR')} k
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3 }}>{r.note || '—'}</span>
            </div>
          );
        })}
        {/* Total row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '100px 120px 120px 130px 80px',
          padding: '12px 20px', background: TOKENS.bgWarm, borderTop: `2px solid ${TOKENS.line2}`, alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, color: TOKENS.ink }}>TOTAL</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, fontWeight: 600, color: TOKENS.green }}>{totEnc.toLocaleString('fr-FR')} k</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, fontWeight: 600, color: TOKENS.ink2 }}>{totDec.toLocaleString('fr-FR')} k</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, color: totExc >= 0 ? TOKENS.green : TOKENS.red }}>
            {totExc >= 0 ? '+' : ''}{totExc.toLocaleString('fr-FR')} k
          </span>
          <span />
        </div>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
function RapprochementView() {
  const nbRapproche   = RAPPROCHEMENT.filter(r => r.statut === 'rapproche').length;
  const nbNonRapproche = RAPPROCHEMENT.filter(r => r.statut === 'non_rapproche').length;
  const nbEcart       = RAPPROCHEMENT.filter(r => r.statut === 'ecart').length;

  const statutConf = {
    rapproche:     { label: 'Rapproché', tone: 'green' },
    non_rapproche: { label: 'Non rapproché', tone: 'amber' },
    ecart:         { label: 'Écart', tone: 'red' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <Card padding={16} delay={520} style={{ borderLeft: `3px solid ${TOKENS.green}` }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>RAPPROCHÉS</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: TOKENS.green }}>{nbRapproche}</div>
          <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 4 }}>lignes reconciliées</div>
        </Card>
        <Card padding={16} delay={570} style={{ borderLeft: `3px solid ${TOKENS.amber}` }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>NON RAPPROCHÉS</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: TOKENS.amber }}>{nbNonRapproche}</div>
          <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 4 }}>à identifier</div>
        </Card>
        <Card padding={16} delay={620} style={{ borderLeft: `3px solid ${TOKENS.red}` }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>ÉCARTS</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: TOKENS.red }}>{nbEcart}</div>
          <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 4 }}>à investiguer</div>
        </Card>
      </div>

      {/* Table */}
      <Card padding={0} delay={660}>
        <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Relevé bancaire vs écritures comptables</h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>Période · Mai 2026</span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '100px minmax(0,1fr) 120px 140px 140px 130px',
          padding: '10px 20px', background: TOKENS.ink, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.bg, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Date</span><span>Libellé</span><span style={{ textAlign: 'right' }}>Montant</span><span>Compte</span><span>Écriture</span><span style={{ textAlign: 'right' }}>Statut</span>
        </div>
        {RAPPROCHEMENT.map((r, i) => {
          const st = statutConf[r.statut];
          const pos = r.mt >= 0;
          return (
            <div key={i} className="erp-row" style={{
              display: 'grid', gridTemplateColumns: '100px minmax(0,1fr) 120px 140px 140px 130px',
              padding: '13px 20px', borderBottom: i < RAPPROCHEMENT.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>{fmtD(r.date)}</span>
              <span style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.libelle}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, fontWeight: 600, color: pos ? TOKENS.green : TOKENS.red }}>
                {pos ? '+' : ''}{fmtMAD(Math.abs(r.mt))}
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{r.compte}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: r.ecriture ? TOKENS.ocreDeep : TOKENS.amber, fontWeight: r.ecriture ? 500 : 400 }}>
                {r.ecriture || '— À identifier'}
              </span>
              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                <Pill tone={st.tone} dot>{st.label}</Pill>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

Object.assign(window, { Tresorerie });
})();
