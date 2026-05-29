/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, fmtMAD */
// =============================================================================
// ERP — Screen 06 — Situation mensuelle (Attachement)
// Document contractuel BTP marocain — sert aussi de rapport C1
// =============================================================================

const SIT_HEADER = {
  numero: 'SIT-05/26',
  chantier: 'CSB-114 — Marina Casablanca Lot 3',
  marche: 'AO-2024/14/AOMR',
  client: 'Al Omrane Régional Casa-Settat',
  moe: 'Cabinet El Mansouri Architectes',
  periode: 'Mai 2026',
  dateAttachement: '28/05/2026',
  conducteur: 'Karim Benjelloun',
  montantMarche: 84_500_000,
  status: 'Brouillon',
};

// BPU subset — postes du lot Gros œuvre + Étanchéité (le plus actif)
const BPU = [
  { id: '02.01', lot: 'Gros œuvre', des: 'Béton armé pour fondations Q300/B25', unit: 'm³', pu: 1850, qPrev: 320, qBudget: 320, qMonth: 0 },
  { id: '02.02', lot: 'Gros œuvre', des: 'Béton armé pour semelles isolées', unit: 'm³', pu: 1750, qPrev: 280, qBudget: 280, qMonth: 0 },
  { id: '02.03', lot: 'Gros œuvre', des: 'Béton armé pour poteaux Q350', unit: 'm³', pu: 2200, qPrev: 280, qBudget: 450, qMonth: 60 },
  { id: '02.04', lot: 'Gros œuvre', des: 'Béton armé pour poutres et chaînages', unit: 'm³', pu: 2350, qPrev: 220, qBudget: 380, qMonth: 50 },
  { id: '02.05', lot: 'Gros œuvre', des: 'Béton armé pour dalles pleines', unit: 'm³', pu: 2150, qPrev: 580, qBudget: 920, qMonth: 80 },
  { id: '02.06', lot: 'Gros œuvre', des: 'Acier à béton TOR HA Fe E500', unit: 'kg', pu: 18, qPrev: 158_000, qBudget: 245_000, qMonth: 22_000 },
  { id: '02.07', lot: 'Gros œuvre', des: 'Coffrage en bois rabotage soigné', unit: 'm²', pu: 95, qPrev: 4800, qBudget: 8500, qMonth: 720 },
  { id: '02.08', lot: 'Gros œuvre', des: 'Maçonnerie en agglos creux ép. 20cm', unit: 'm²', pu: 145, qPrev: 1100, qBudget: 4200, qMonth: 480 },
  { id: '02.09', lot: 'Gros œuvre', des: 'Maçonnerie en agglos creux ép. 15cm', unit: 'm²', pu: 125, qPrev: 380, qBudget: 2800, qMonth: 240 },
  { id: '03.01', lot: 'Étanchéité', des: 'Étanchéité multicouche bicouche bitumineux', unit: 'm²', pu: 285, qPrev: 0, qBudget: 1850, qMonth: 320 },
  { id: '03.02', lot: 'Étanchéité', des: 'Isolation thermique en polystyrène extrudé 60mm', unit: 'm²', pu: 165, qPrev: 0, qBudget: 1850, qMonth: 320 },
  { id: '03.03', lot: 'Étanchéité', des: 'Protection mécanique en dalettes béton 5cm', unit: 'm²', pu: 95, qPrev: 0, qBudget: 1850, qMonth: 280 },
];

// -----------------------------------------------------------------------------
function Situations() {
  const [view, setView] = React.useState('list'); // 'list' | 'edit' | 'preview'
  const [createOpen, setCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const h = (e) => { if (e.detail?.key === 'newSit') setCreateOpen(true); };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  return (
    <>
      {view === 'list'
        ? <SituationsList onOpen={() => setView('edit')} onNew={() => setCreateOpen(true)} />
        : view === 'preview'
          ? <SituationPreview onBack={() => setView('edit')} />
          : <SituationEditor onPreview={() => setView('preview')} onBack={() => setView('list')} />}
      {createOpen && <window.NewSituationModal onClose={() => setCreateOpen(false)} />}
    </>
  );
}

// -----------------------------------------------------------------------------
// LIST — Situations existantes
// -----------------------------------------------------------------------------
const SITUATIONS_LIST = [
  { num: 'SIT-05/26', chantier: 'CSB-114', label: 'Marina Casablanca · Mai 2026', brut: 6_840_000, net: 6_188_400, status: 'Brouillon', tone: 'neutral', date: '28/05' },
  { num: 'SIT-04/26', chantier: 'CSB-114', label: 'Marina Casablanca · Avril 2026', brut: 6_240_000, net: 5_645_280, status: 'Validée MOE', tone: 'green', date: '02/05' },
  { num: 'SIT-08/26', chantier: 'TNG-061', label: 'Port Tanger Med · Mai 2026', brut: 3_120_000, net: 2_822_640, status: 'Envoyée', tone: 'blue', date: '26/05' },
  { num: 'SIT-03/26', chantier: 'RBT-208', label: 'Tramway Rabat · Mars 2026', brut: 8_900_000, net: 8_051_300, status: 'Payée', tone: 'ocre', date: '15/04' },
  { num: 'SIT-11/26', chantier: 'AGD-033', label: 'Hôtel Taghazout · Mai 2026', brut: 2_780_000, net: 2_514_460, status: 'Brouillon', tone: 'neutral', date: '27/05' },
  { num: 'SIT-04/26b', chantier: 'CSB-114', label: 'Marina · Avenant N°2 Mai', brut: 1_200_000, net: 1_085_640, status: 'Contestée', tone: 'red', date: '24/05' },
];

function SituationsList({ onOpen, onNew }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="erp-fade-in">
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
          SITUATIONS MENSUELLES · DÉCOMPTES
        </div>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink }}>
          Attachements & décomptes <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· Mai 2026</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <Card padding={18} delay={60}>
          <Stat label="MONTANT BRUT DU MOIS" value="22,9" unit="M DH" sub="6 situations" />
        </Card>
        <Card padding={18} delay={120}>
          <Stat label="MONTANT NET À FACTURER" value="20,7" unit="M DH" sub="après retenues" />
        </Card>
        <Card padding={18} delay={180}>
          <Stat label="EN ATTENTE DE SIGNATURE MOE" value="2" unit="" sub="11,1 M DH" />
        </Card>
        <Card padding={18} delay={240}>
          <Stat label="EN CONTESTATION" value="1" unit="" sub="1,2 M DH — CSB-114" tone="red" />
        </Card>
      </div>

      <Card padding={0} delay={300}>
        <div style={{ padding: '20px 22px 14px', display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${TOKENS.line}` }}>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>
              {SITUATIONS_LIST.length} SITUATIONS · CYCLE EN COURS
            </div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
              Toutes les situations
            </div>
          </div>
          <Button variant="primary" onClick={onNew} icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>
            Nouvelle situation
          </Button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '110px 90px 1fr 140px 140px 120px 110px',
          padding: '10px 22px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <span>N°</span><span>Chantier</span><span>Période</span>
          <span style={{ textAlign: 'right' }}>Brut</span>
          <span style={{ textAlign: 'right' }}>Net à payer</span>
          <span style={{ textAlign: 'center' }}>Statut</span>
          <span style={{ textAlign: 'right' }}>Action</span>
        </div>
        {SITUATIONS_LIST.map((s, i) => (
          <div key={s.num} className="erp-row" onClick={onOpen} style={{
            display: 'grid', gridTemplateColumns: '110px 90px 1fr 140px 140px 120px 110px',
            padding: '14px 22px',
            borderBottom: i < SITUATIONS_LIST.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            alignItems: 'center', cursor: 'pointer',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep }}>{s.num}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>{s.chantier}</span>
            <span style={{ fontSize: 13, color: TOKENS.ink }}>{s.label}</span>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink2 }}>{fmtMAD(s.brut)}</span>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{fmtMAD(s.net)}</span>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Pill tone={s.tone} dot>{s.status}</Pill>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button size="sm">Ouvrir</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
// EDITOR — Saisie d'attachement (interactive)
// -----------------------------------------------------------------------------
function SituationEditor({ onPreview, onBack }) {
  const [rows, setRows] = React.useState(BPU);
  const [activeLot, setActiveLot] = React.useState('all');

  const update = (id, qMonth) => {
    setRows(r => r.map(x => x.id === id ? { ...x, qMonth: Math.max(0, qMonth) } : x));
  };

  const lots = [...new Set(BPU.map(b => b.lot))];
  const visible = activeLot === 'all' ? rows : rows.filter(r => r.lot === activeLot);

  // Calculations
  const totMonthBrut = rows.reduce((s, r) => s + r.pu * r.qMonth, 0);
  const totCumulBrut = rows.reduce((s, r) => s + r.pu * (r.qPrev + r.qMonth), 0);
  const totPrev      = rows.reduce((s, r) => s + r.pu * r.qPrev, 0);
  const totBudget    = rows.reduce((s, r) => s + r.pu * r.qBudget, 0);

  // Révision de prix (formule paramétrique simplifiée — 2,5%)
  const revision = totMonthBrut * 0.025;
  const sousTotal = totMonthBrut + revision;
  // Retenue de garantie 7% sur HT
  const retenueGarantie = sousTotal * 0.07;
  // Retenue à la source 1,5% (marchés publics)
  const retenueSource = sousTotal * 0.015;
  const netHT = sousTotal - retenueGarantie - retenueSource;
  const tva = netHT * 0.20;
  const netTTC = netHT + tva;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <button onClick={onBack} className="erp-pill-btn" style={{
            background: 'transparent', border: 'none', color: TOKENS.ink3,
            fontSize: 12, padding: '4px 8px', marginLeft: -8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, borderRadius: 4,
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13 }}>←</span>
            Toutes les situations
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Pill mono>{SIT_HEADER.numero}</Pill>
            <Pill tone="neutral" dot>{SIT_HEADER.status}</Pill>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
              Marché {SIT_HEADER.marche} · {SIT_HEADER.periode}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 26, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            Attachement — {SIT_HEADER.chantier}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button>Annuler</Button>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Sauver brouillon</Button>
          <Button onClick={onPreview} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Aperçu document</Button>
          <Button variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
            Envoyer pour signature
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <Card padding={18} delay={60}>
          <Stat label="TRAVAUX CE MOIS" value={fmtMAD(totMonthBrut)} unit="DH HT" sub={`${((totMonthBrut / totBudget) * 100).toFixed(1)}% du marché`} />
        </Card>
        <Card padding={18} delay={120}>
          <Stat label="CUMUL À LA DATE" value={fmtMAD(totCumulBrut)} unit="DH HT" sub={`${((totCumulBrut / totBudget) * 100).toFixed(1)}% avancement`} />
        </Card>
        <Card padding={18} delay={180}>
          <Stat label="RESTE À EXÉCUTER" value={fmtMAD(totBudget - totCumulBrut)} unit="DH HT" sub={`${(((totBudget - totCumulBrut) / totBudget) * 100).toFixed(1)}% du budget`} />
        </Card>
        <Card padding={18} delay={240} style={{ background: TOKENS.ink, color: TOKENS.bg, borderColor: TOKENS.ink }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.12em', marginBottom: 10 }}>NET À FACTURER · TTC</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, letterSpacing: '-0.025em', lineHeight: 1, color: TOKENS.bg }}>
              {fmtMAD(netTTC)}
            </span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink4 }}>DH</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: TOKENS.ink4 }}>après retenues + TVA 20%</div>
        </Card>
      </div>

      {/* Lot filter */}
      <Card padding={0} delay={300}>
        <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em' }}>FILTRE LOT</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', ...lots].map(l => (
                <button key={l} onClick={() => setActiveLot(l)} className="erp-pill-btn" style={{
                  padding: '5px 10px', borderRadius: 4, cursor: 'pointer',
                  background: activeLot === l ? TOKENS.ink : TOKENS.bgWarm,
                  color: activeLot === l ? TOKENS.bg : TOKENS.ink2,
                  border: `1px solid ${activeLot === l ? TOKENS.ink : 'transparent'}`,
                  fontFamily: 'IBM Plex Sans', fontSize: 11.5, fontWeight: 500,
                }}>
                  {l === 'all' ? 'Tous lots' : l}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
            <span style={{ color: TOKENS.ink2 }}>💡 Astuce :</span> cliquez dans la colonne "Ce mois" pour saisir les quantités exécutées
          </div>
        </div>

        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '70px 1fr 70px 110px 110px 110px 130px 1fr 130px',
          padding: '12px 22px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>N°</span>
          <span>Désignation</span>
          <span style={{ textAlign: 'center' }}>U</span>
          <span style={{ textAlign: 'right' }}>P.U. DH</span>
          <span style={{ textAlign: 'right' }}>Qté budget</span>
          <span style={{ textAlign: 'right' }}>Cumul N-1</span>
          <span style={{ textAlign: 'right', color: TOKENS.ocreDeep, fontWeight: 500 }}>Ce mois ✎</span>
          <span style={{ paddingLeft: 12 }}>% Avancement</span>
          <span style={{ textAlign: 'right' }}>Montant mois</span>
        </div>

        {visible.map((r, i) => {
          const qTot = r.qPrev + r.qMonth;
          const pct = r.qBudget > 0 ? (qTot / r.qBudget) * 100 : 0;
          const amount = r.pu * r.qMonth;
          return (
            <div key={r.id} className="erp-row" style={{
              display: 'grid', gridTemplateColumns: '70px 1fr 70px 110px 110px 110px 130px 1fr 130px',
              padding: '12px 22px',
              borderBottom: i < visible.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep }}>{r.id}</span>
              <span style={{ fontSize: 12.5, color: TOKENS.ink }}>{r.des}</span>
              <span style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{r.unit}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>{r.pu.toLocaleString('fr-FR')}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3 }}>{r.qBudget.toLocaleString('fr-FR')}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>{r.qPrev.toLocaleString('fr-FR')}</span>
              <input
                type="number"
                value={r.qMonth}
                onChange={e => update(r.id, +e.target.value || 0)}
                style={{
                  height: 30, padding: '0 10px',
                  border: `1px solid ${r.qMonth > 0 ? TOKENS.ocre : TOKENS.line2}`,
                  background: r.qMonth > 0 ? TOKENS.ocreSoft : TOKENS.paper,
                  borderRadius: 4,
                  fontFamily: 'IBM Plex Mono', fontSize: 12.5,
                  color: r.qMonth > 0 ? TOKENS.ocreDeep : TOKENS.ink,
                  fontWeight: r.qMonth > 0 ? 500 : 400,
                  textAlign: 'right', outline: 'none', width: '100%',
                }}
              />
              <div style={{ paddingLeft: 12, paddingRight: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
                  <span>{qTot.toLocaleString('fr-FR')} {r.unit}</span>
                  <span style={{ color: pct === 100 ? TOKENS.green : TOKENS.ink2 }}>{pct.toFixed(0)}%</span>
                </div>
                <Progress value={pct} tone={pct === 100 ? 'green' : 'ocre'} height={4} />
              </div>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5,
                color: amount > 0 ? TOKENS.ink : TOKENS.ink4, fontWeight: amount > 0 ? 500 : 400 }}>
                {amount > 0 ? fmtMAD(amount) : '—'}
              </span>
            </div>
          );
        })}
      </Card>

      {/* Totaux et retenues */}
      <Card delay={360} padding={0}>
        <CardHead
          eyebrow="DÉCOMPTE DU MOIS"
          title="Détail des retenues et montant à payer"
          right={<Button size="sm" icon={<Icon name="doc" size={12} stroke={TOKENS.ink2} />}>Détail formule de révision</Button>}
          style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
        />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { label: 'Travaux exécutés du mois (montant brut)', value: totMonthBrut, color: TOKENS.ink2 },
              { label: 'Révision de prix · formule paramétrique 2,5%', value: revision, color: TOKENS.ink3 },
              { label: 'SOUS-TOTAL', value: sousTotal, color: TOKENS.ink, bold: true, border: true },
              { label: 'Retenue de garantie 7% (CCAG)', value: -retenueGarantie, color: TOKENS.red },
              { label: 'Retenue à la source 1,5% (marché public)', value: -retenueSource, color: TOKENS.red },
              { label: 'NET HORS TAXES À PAYER', value: netHT, color: TOKENS.ink, bold: true, border: true },
              { label: 'TVA 20%', value: tva, color: TOKENS.ink3 },
              { label: 'NET TTC À FACTURER', value: netTTC, color: TOKENS.ocreDeep, bold: true, border: true, big: true },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: r.border ? `1px solid ${TOKENS.line}` : 'none' }}>
                <td style={{
                  padding: r.big ? '14px 22px' : '10px 22px',
                  fontSize: r.big ? 14 : 12.5, fontWeight: r.bold ? 600 : 400, color: r.color,
                }}>{r.label}</td>
                <td style={{
                  padding: r.big ? '14px 22px' : '10px 22px', textAlign: 'right',
                  fontFamily: 'IBM Plex Mono', fontSize: r.big ? 18 : 13,
                  fontWeight: r.bold ? 600 : 400, color: r.color,
                }}>{r.value < 0 ? '−' : ''}{fmtMAD(Math.abs(r.value))} DH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PREVIEW — Aperçu document imprimable (template)
// -----------------------------------------------------------------------------
function SituationPreview({ onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="erp-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} className="erp-pill-btn" style={{
          background: 'transparent', border: 'none', color: TOKENS.ink3,
          fontSize: 12, padding: '4px 8px', marginLeft: -8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4,
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13 }}>←</span>
          Retour à l'édition
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Télécharger PDF</Button>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Imprimer</Button>
          <Button variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
            Envoyer au MOE
          </Button>
        </div>
      </div>

      {/* A4 document */}
      <div style={{
        background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 4,
        padding: '48px 56px', maxWidth: 820, margin: '0 auto',
        boxShadow: '0 12px 40px -16px rgba(26,24,20,0.18)',
        fontFamily: 'IBM Plex Sans', color: TOKENS.ink,
      }}
      className="erp-fade-in">
        {/* Letterhead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${TOKENS.ink}`, paddingBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <svg width="24" height="24" viewBox="0 0 28 28" aria-hidden="true">
                <rect x="2" y="14" width="10" height="12" fill={TOKENS.ink} />
                <rect x="14" y="8" width="8" height="18" fill={TOKENS.ink} />
                <rect x="6" y="4" width="4" height="8" fill={TOKENS.ocre} />
              </svg>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
                ATLAS<span style={{ color: TOKENS.ocre }}>·</span>BTP
              </span>
            </div>
            <div style={{ fontSize: 10, color: TOKENS.ink2, lineHeight: 1.55 }}>
              <b>Atlas Constructions S.A.</b><br/>
              78, Boulevard Mohammed V, Casablanca 20000<br/>
              Tél. +212 5 22 00 00 00 · contact@atlasbtp.ma<br/>
              ICE 002578946000093 · RC 145789 · IF 24578946 · CNSS 7845612
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em' }}>
              DOCUMENT N°
            </div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.ocreDeep, letterSpacing: '-0.01em' }}>
              {SIT_HEADER.numero}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 6 }}>
              Établi le {SIT_HEADER.dateAttachement}
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.2em', marginBottom: 6 }}>
            DÉCOMPTE PROVISOIRE
          </div>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
            Situation des travaux — {SIT_HEADER.periode}
          </h2>
        </div>

        {/* Marché identification */}
        <div style={{
          margin: '20px 0',
          border: `1px solid ${TOKENS.line}`, borderRadius: 4,
          background: TOKENS.bg,
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0,
        }}>
          {[
            ['MARCHÉ', SIT_HEADER.marche],
            ['CHANTIER', SIT_HEADER.chantier],
            ['MAÎTRE D\'OUVRAGE', SIT_HEADER.client],
            ['MAÎTRE D\'ŒUVRE', SIT_HEADER.moe],
            ['PÉRIODE D\'EXÉCUTION', SIT_HEADER.periode],
            ['CONDUCTEUR', SIT_HEADER.conducteur],
          ].map(([k, v], i, arr) => (
            <div key={i} style={{
              padding: '10px 14px',
              borderRight: i % 2 === 0 ? `1px solid ${TOKENS.line}` : 'none',
              borderBottom: i < arr.length - 2 ? `1px solid ${TOKENS.line}` : 'none',
            }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 11.5, color: TOKENS.ink, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* BPU table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, fontSize: 9.5 }}>
          <thead>
            <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
              <th style={pCell('left', { width: 50 })}>N°</th>
              <th style={pCell('left')}>DÉSIGNATION DES TRAVAUX</th>
              <th style={pCell('center', { width: 40 })}>U</th>
              <th style={pCell('right', { width: 70 })}>P.U.</th>
              <th style={pCell('right', { width: 60 })}>Q. Cumul</th>
              <th style={pCell('right', { width: 80 })}>Montant cumul</th>
            </tr>
          </thead>
          <tbody>
            {BPU.filter(r => r.qPrev + r.qMonth > 0).map((r, i, arr) => {
              const qTot = r.qPrev + r.qMonth;
              const amount = r.pu * qTot;
              return (
                <tr key={r.id} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
                  <td style={pCell('left', { fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep })}>{r.id}</td>
                  <td style={pCell('left')}>{r.des}</td>
                  <td style={pCell('center', { fontFamily: 'IBM Plex Mono' })}>{r.unit}</td>
                  <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{r.pu.toLocaleString('fr-FR')}</td>
                  <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{qTot.toLocaleString('fr-FR')}</td>
                  <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 500 })}>{amount.toLocaleString('fr-FR')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Récap retenues */}
        <div style={{ marginTop: 24, marginLeft: '40%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.5 }}>
            <tbody>
              {(() => {
                const totCumulBrut = BPU.reduce((s, r) => s + r.pu * (r.qPrev + r.qMonth), 0);
                const totPrev = BPU.reduce((s, r) => s + r.pu * r.qPrev, 0);
                const totMonthBrut = totCumulBrut - totPrev;
                const revision = totMonthBrut * 0.025;
                const sousTotal = totMonthBrut + revision;
                const retenueGarantie = sousTotal * 0.07;
                const retenueSource = sousTotal * 0.015;
                const netHT = sousTotal - retenueGarantie - retenueSource;
                const tva = netHT * 0.20;
                const netTTC = netHT + tva;
                return [
                  { l: 'Montant brut cumulé à date', v: totCumulBrut },
                  { l: 'Montant cumulé précédent', v: totPrev, neg: true },
                  { l: 'TRAVAUX DU MOIS', v: totMonthBrut, bold: true, top: true },
                  { l: 'Révision de prix (2,5%)', v: revision },
                  { l: 'Sous-total', v: sousTotal, bold: true, top: true },
                  { l: 'Retenue de garantie 7%', v: retenueGarantie, neg: true },
                  { l: 'Retenue à la source 1,5%', v: retenueSource, neg: true },
                  { l: 'NET HT À PAYER', v: netHT, bold: true, top: true },
                  { l: 'TVA 20%', v: tva },
                  { l: 'NET TTC À FACTURER', v: netTTC, bold: true, top: true, big: true },
                ].map((r, i) => (
                  <tr key={i} style={{ borderTop: r.top ? `1px solid ${TOKENS.ink}` : 'none' }}>
                    <td style={{ padding: '5px 8px', fontWeight: r.bold ? 600 : 400, fontSize: r.big ? 12 : 10.5 }}>
                      {r.l}
                    </td>
                    <td style={{ padding: '5px 8px', textAlign: 'right', fontFamily: 'IBM Plex Mono',
                      fontWeight: r.bold ? 600 : 400, fontSize: r.big ? 13 : 10.5,
                      color: r.big ? TOKENS.ocreDeep : TOKENS.ink }}>
                      {r.neg ? '−' : ''}{r.v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>

        {/* Arrêté en lettres */}
        <div style={{ marginTop: 28, padding: 14, border: `1px solid ${TOKENS.line}`, borderRadius: 4, background: TOKENS.bg, fontSize: 11 }}>
          <b>Arrêté la présente situation à la somme de</b> : six millions huit cent quarante mille dirhams hors taxes,
          soit huit millions deux cent huit mille dirhams toutes taxes comprises.
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 36 }}>
          {[
            ['ENTREPRISE', 'Atlas Constructions S.A.\nLe Directeur de projet'],
            ['MAÎTRE D\'ŒUVRE', `${SIT_HEADER.moe}\nL'Architecte`],
            ['MAÎTRE D\'OUVRAGE', `${SIT_HEADER.client}\nLe Directeur des projets`],
          ].map(([h, w], i) => (
            <div key={i} style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 14, minHeight: 110 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 4 }}>{h}</div>
              <div style={{ fontSize: 10, color: TOKENS.ink2, whiteSpace: 'pre-line', marginBottom: 36 }}>{w}</div>
              <div style={{ borderTop: `1px dashed ${TOKENS.line2}`, paddingTop: 4, fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3 }}>
                Date · Signature · Cachet
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 28, paddingTop: 14, borderTop: `1px solid ${TOKENS.line}`,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.04em',
        }}>
          <span>Document confidentiel · usage contractuel</span>
          <span>Page 1 / 1 · Généré par Atlas·BTP ERP</span>
        </div>
      </div>
    </div>
  );
}

function pCell(align, extra = {}) {
  return {
    padding: '6px 8px',
    textAlign: align,
    fontFamily: extra.fontFamily || 'IBM Plex Sans',
    fontWeight: extra.fontWeight || 400,
    color: extra.color || 'inherit',
    width: extra.width,
    fontSize: 9.5,
  };
}

Object.assign(window, { Situations });
