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

// -----------------------------------------------------------------------------
function Tresorerie() {
  const [tab, setTab] = React.useState('flux'); // flux | cautions

  const soldeTotal = COMPTES.reduce((s, c) => s + c.solde, 0);
  const ligneTotal = COMPTES.reduce((s, c) => s + c.decouvert, 0);
  const totalEnc = FLUX.filter(f => f.sens === 'in').reduce((s, f) => s + f.mt, 0);
  const totalDec = FLUX.filter(f => f.sens === 'out').reduce((s, f) => s + f.mt, 0);
  const cautionsEngagees = CAUTIONS.filter(c => c.status !== 'liberable').reduce((s, c) => s + c.montant, 0);
  const position = soldeTotal + totalEnc - totalDec;

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

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <TresoKpi label="SOLDE DISPONIBLE" value={fmtMAD(soldeTotal)} unit="DH" sub={`+ ${fmtMAD(ligneTotal)} de lignes autorisées`} tone="ink" delay={60} />
        <TresoKpi label="ENCAISSEMENTS PRÉVUS" value={fmtMAD(totalEnc)} unit="DH" sub="sous 4 semaines" tone="green" delay={120} />
        <TresoKpi label="DÉCAISSEMENTS PRÉVUS" value={fmtMAD(totalDec)} unit="DH" sub="paie, achats, traites" tone="amber" delay={180} />
        <TresoKpi label="CAUTIONS ENGAGÉES" value={fmtMAD(cautionsEngagees)} unit="DH" sub={`${CAUTIONS.filter(c => c.status !== 'liberable').length} cautions actives`} tone="blue" delay={240} />
      </div>

      {/* Comptes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {COMPTES.map((c, i) => (
          <Card key={c.rib} delay={300 + i * 60} padding={18} hoverable>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${TOKENS.line}` }} className="erp-fade-in">
        {[['flux', 'Échéancier de trésorerie'], ['cautions', `Cautions bancaires (${CAUTIONS.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === id ? TOKENS.ink : 'transparent'}`,
            color: tab === id ? TOKENS.ink : TOKENS.ink3, cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === id ? 600 : 400, marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {tab === 'flux' && <FluxTable />}
      {tab === 'cautions' && <CautionsTable />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function TresoKpi({ label, value, unit, sub, tone, delay }) {
  const dark = tone === 'ink';
  const colors = { green: TOKENS.green, amber: TOKENS.amber, blue: TOKENS.blue };
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
  const minBal = Math.min(...balances, soldeStart / 1000);
  const maxBal = Math.max(...balances, soldeStart / 1000);

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
              <div key={p.sem} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }} data-tip={`Solde projeté : ${balances[i].toFixed(0)} kDH`}>
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

Object.assign(window, { Tresorerie });
})();
