/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Sous-traitance
// Contrat ST → Agrément maître d'ouvrage (DC4) → Exécution → Situations ST →
//   Retenue de garantie / paiement direct → Réception → Mainlevée
// =============================================================================

const SOUS_TRAITANTS = {
  SOTR: { name: 'SOTRAVO Étanchéité', metier: 'Étanchéité / isolation', ice: '001789444000012', ville: 'Casablanca' },
  ELEC: { name: 'Électrique du Maroc', metier: 'Électricité CFO/CFA', ice: '001999777000056', ville: 'Casablanca' },
  CLIM: { name: 'Froid & Clim Atlas', metier: 'CVC / désenfumage', ice: '002455611000034', ville: 'Rabat' },
  ALUM: { name: 'Aluminium Berrechid', metier: 'Menuiserie alu / vitrage', ice: '002344812000017', ville: 'Berrechid' },
  PEINT:{ name: 'Décor Peinture Pro', metier: 'Peinture / revêtements', ice: '001622788000045', ville: 'Casablanca' },
  PIEUX:{ name: 'Géofondations Maroc', metier: 'Pieux & fondations spéciales', ice: '000877123000061', ville: 'Casablanca' },
  ASC:  { name: 'KONE Maroc', metier: 'Ascenseurs', ice: '000122455000088', ville: 'Casablanca' },
  VRD:  { name: 'Réseaux & VRD Souss', metier: 'VRD / réseaux divers', ice: '001533922000073', ville: 'Agadir' },
};

// Contrats de sous-traitance
const CONTRATS = [
  { num: 'ST-2026/041', st: 'PIEUX', lot: 'Pieux forés Ø800 + parois moulées', site: 'RBT-241', siteName: 'Pont Bouregreg PK 8', montant: 14_200_000, avancement: 35, paye: 28, status: 'cours', dc4: 'agree', retenue: 5, debut: '06/2025', fin: '04/2026', paiementDirect: true, conducteur: 'H. Alaoui' },
  { num: 'ST-2026/038', st: 'SOTR', lot: 'Étanchéité multicouche toiture-terrasse — 1 800 m²', site: 'CSB-098', siteName: 'CC Sidi Maârouf', montant: 2_180_000, avancement: 72, paye: 60, status: 'cours', dc4: 'agree', retenue: 7, debut: '01/2026', fin: '06/2026', paiementDirect: false, conducteur: 'K. Benjelloun' },
  { num: 'ST-2026/044', st: 'ALUM', lot: 'Façade rideau alu + vitrage VEC — R+2', site: 'AGD-033', siteName: 'Taghazout Bay', montant: 6_840_000, avancement: 8, paye: 0, status: 'cours', dc4: 'attente', retenue: 5, debut: '05/2026', fin: '12/2026', paiementDirect: false, conducteur: 'S. Fassi', alerte: 'DC4 non agréé — démarrage à risque' },
  { num: 'ST-2026/036', st: 'ELEC', lot: 'Courants forts & faibles — bâtiment principal', site: 'RBT-184', siteName: 'Université Med VI', montant: 3_920_000, avancement: 64, paye: 55, status: 'cours', dc4: 'agree', retenue: 5, debut: '11/2025', fin: '08/2026', paiementDirect: true, conducteur: 'H. Alaoui' },
  { num: 'ST-2026/048', st: 'CLIM', lot: 'CVC + désenfumage — blocs A/B/C', site: 'FES-022', siteName: 'Hôpital Fès', montant: 8_450_000, avancement: 0, paye: 0, status: 'agrement', dc4: 'depose', retenue: 5, debut: '07/2026', fin: '06/2027', paiementDirect: false, conducteur: 'Y. Tazi' },
  { num: 'ST-2026/031', st: 'PEINT', lot: 'Peinture & revêtements — 320 logements', site: 'TNG-118', siteName: 'Logements Mghogha', montant: 1_640_000, avancement: 100, paye: 93, status: 'reception', dc4: 'agree', retenue: 7, debut: '08/2025', fin: '02/2026', paiementDirect: false, conducteur: 'M. El Mansouri' },
  { num: 'ST-2026/045', st: 'ASC', lot: 'Fourniture & pose 4 ascenseurs', site: 'CSB-098', siteName: 'CC Sidi Maârouf', montant: 3_280_000, avancement: 45, paye: 30, status: 'cours', dc4: 'agree', retenue: 5, debut: '02/2026', fin: '05/2026', paiementDirect: false, conducteur: 'K. Benjelloun' },
  { num: 'ST-2026/029', st: 'VRD', lot: 'VRD primaires + assainissement', site: 'MEK-019', siteName: 'Échangeur A2', montant: 5_120_000, avancement: 58, paye: 50, status: 'cours', dc4: 'agree', retenue: 5, debut: '09/2025', fin: '07/2026', paiementDirect: true, conducteur: 'Y. Tazi' },
  { num: 'ST-2026/050', st: 'SOTR', lot: 'Étanchéité ouvrages enterrés — station', site: 'OUJ-007', siteName: 'STEP Oujda Nord', montant: 980_000, avancement: 0, paye: 0, status: 'agrement', dc4: 'depose', retenue: 5, debut: '08/2026', fin: '02/2027', paiementDirect: false, conducteur: 'Y. Tazi' },
  { num: 'ST-2026/022', st: 'PEINT', lot: 'Reprises peinture — litige malfaçons', site: 'AGD-033', siteName: 'Taghazout Bay', montant: 420_000, avancement: 80, paye: 40, status: 'litige', dc4: 'agree', retenue: 10, debut: '01/2026', fin: '04/2026', paiementDirect: false, conducteur: 'S. Fassi', alerte: 'Litige qualité — retenue conservatoire appliquée' },
];

const ST_STATUS = {
  cours:     { label: 'En cours', tone: 'green' },
  agrement:  { label: 'En agrément', tone: 'amber' },
  reception: { label: 'Réceptionné', tone: 'ocre' },
  litige:    { label: 'Litige', tone: 'red' },
};

const DC4_STATUS = {
  agree:   { label: 'Agréé', tone: 'green' },
  depose:  { label: 'DC4 déposé', tone: 'amber' },
  attente: { label: 'Non agréé', tone: 'red' },
};

// =============================================================================
function SousTraitance() {
  const [tab, setTab] = React.useState('actifs');
  const [q, setQ] = React.useState('');
  const [selected, setSelected] = React.useState(null);

  let rows = CONTRATS.slice();
  if (tab === 'actifs')    rows = rows.filter(c => c.status === 'cours');
  if (tab === 'agrement')  rows = rows.filter(c => c.status === 'agrement' || c.dc4 !== 'agree');
  if (tab === 'litige')    rows = rows.filter(c => c.status === 'litige');
  if (q) {
    const Q = q.toLowerCase();
    rows = rows.filter(c => (c.num + ' ' + c.lot + ' ' + (SOUS_TRAITANTS[c.st]?.name || '') + ' ' + c.site).toLowerCase().includes(Q));
  }

  const actifs   = CONTRATS.filter(c => c.status === 'cours').length;
  const agrement = CONTRATS.filter(c => c.dc4 !== 'agree').length;
  const litiges  = CONTRATS.filter(c => c.status === 'litige').length;
  const engage   = CONTRATS.reduce((s, c) => s + c.montant, 0);
  const retenues = CONTRATS.reduce((s, c) => s + c.montant * (c.avancement / 100) * (c.retenue / 100), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            SOUS-TRAITANCE · CONTRATS & AGRÉMENTS
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Contrats de sous-traitance <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· {CONTRATS.length} contrats</span>
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
            Agrément DC4 maître d'ouvrage · retenue de garantie · paiement direct (loi 13-83)
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Registre ST</Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Nouveau contrat</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <SstKpi label="CONTRATS ACTIFS" value={actifs} sub="en exécution" delay={60} active={tab === 'actifs'} onClick={() => setTab('actifs')} />
        <SstKpi label="EN ATTENTE D'AGRÉMENT" value={agrement} sub="DC4 à régulariser" tone="amber" delay={120} active={tab === 'agrement'} onClick={() => setTab('agrement')} />
        <SstKpi label="LITIGES OUVERTS" value={litiges} sub="action requise" tone="red" delay={180} active={tab === 'litige'} onClick={() => setTab('litige')} />
        <SstKpi label="RETENUES DE GARANTIE" value={fmtMAD(retenues)} sub="DH retenus" tone="ocre" delay={240} />
        <SstKpi label="MONTANT SOUS-TRAITÉ" value={fmtMAD(engage)} sub="DH HT engagés" delay={300} tone="ink" />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }} className="erp-fade-in">
        <div style={{ display: 'flex', background: TOKENS.bgWarm, borderRadius: 6, padding: 2 }}>
          {[
            ['actifs', `Actifs · ${actifs}`],
            ['tous', `Tous · ${CONTRATS.length}`],
            ['agrement', `À agréer · ${agrement}`],
            ['litige', `Litiges · ${litiges}`],
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
          padding: '0 12px', height: 36, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6 }}>
          <Icon name="search" size={14} stroke={TOKENS.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="N° contrat, lot, sous-traitant, chantier…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} />
        </div>
      </div>

      {/* List + detail */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0,1fr) minmax(0,400px)' : '1fr', gap: 16 }}>
        <STList rows={rows} selected={selected} onSelect={setSelected} />
        {selected && <STDetail c={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function SstKpi({ label, value, sub, tone, delay, active, onClick }) {
  const dark = tone === 'ink';
  const toneColors = { amber: TOKENS.amber, red: TOKENS.red, ocre: TOKENS.ocreDeep };
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
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: dark ? TOKENS.ocre : (accent || TOKENS.ink3), letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 23, letterSpacing: '-0.025em', color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, marginTop: 6, color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </button>
  );
}

// -----------------------------------------------------------------------------
function STList({ rows, selected, onSelect }) {
  if (rows.length === 0) return (
    <Card padding={48} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 8 }}>AUCUN CONTRAT</div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, margin: 0, color: TOKENS.ink }}>Aucun contrat ne correspond à ces filtres.</h3>
    </Card>
  );
  return (
    <Card padding={0} delay={360}>
      {rows.map((c, i) => {
        const st = SOUS_TRAITANTS[c.st];
        const ss = ST_STATUS[c.status];
        const dc = DC4_STATUS[c.dc4];
        const isSel = selected?.num === c.num;
        return (
          <button key={c.num} onClick={() => onSelect(c)} className="erp-row" style={{
            width: '100%', textAlign: 'left', border: 'none',
            background: isSel ? TOKENS.bgWarm : 'transparent',
            borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            borderLeft: isSel ? `3px solid ${TOKENS.ocreDeep}` : '3px solid transparent',
            padding: '13px 18px', cursor: 'pointer',
            display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 150px minmax(120px,150px)', gap: 16, alignItems: 'center',
          }}>
            {/* lot + st */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, fontWeight: 500 }}>{c.num}</span>
                {c.paiementDirect && <span data-tip="Paiement direct au sous-traitant" style={{ padding: '1px 5px', fontSize: 9, fontFamily: 'IBM Plex Mono', background: TOKENS.blueSoft, color: TOKENS.blue, borderRadius: 3 }}>PAIE. DIRECT</span>}
                {c.alerte && <span data-tip={c.alerte} style={{ width: 15, height: 15, borderRadius: 999, background: TOKENS.redSoft, color: TOKENS.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 700 }}>!</span>}
              </div>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lot}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, color: TOKENS.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{st.name}</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>· {st.metier}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Pill tone={ss.tone} dot>{ss.label}</Pill>
                <Pill tone={dc.tone}>{dc.label}</Pill>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep }}>{c.site}</span>
              </div>
            </div>
            {/* avancement */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginBottom: 4 }}>
                <span style={{ color: TOKENS.ink }}>{c.avancement}%</span>
                <span>payé {c.paye}%</span>
              </div>
              <Progress value={c.avancement} target={c.paye} tone={c.status === 'litige' ? 'red' : 'ocre'} height={5} />
            </div>
            {/* montant */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{fmtMAD(c.montant)}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>DH HT</div>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function STDetail({ c, onClose }) {
  const st = SOUS_TRAITANTS[c.st];
  const ss = ST_STATUS[c.status];
  const valExec = c.montant * (c.avancement / 100);
  const retenuMontant = valExec * (c.retenue / 100);
  const payeMontant = c.montant * (c.paye / 100);
  const reste = c.montant - payeMontant;

  const dc4Steps = [
    { label: 'Contrat ST signé', who: 'Atlas BTP', done: true },
    { label: 'DC4 transmis au MOA', who: c.conducteur, done: c.dc4 !== 'attente' },
    { label: 'Agrément maître d\'ouvrage', who: 'MOA', done: c.dc4 === 'agree' },
    { label: 'Démarrage des travaux', who: c.conducteur, done: c.avancement > 0 },
  ];

  return (
    <Card padding={0} delay={420} style={{ alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${TOKENS.line}`, background: TOKENS.bg, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, fontWeight: 500 }}>{c.num}</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink, marginTop: 4, lineHeight: 1.3 }}>{c.lot}</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TOKENS.ink3, padding: 4, marginRight: -4, height: 'fit-content' }}>
          <Icon name="x" size={14} />
        </button>
      </div>

      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Pill tone={ss.tone} dot>{ss.label}</Pill>
          <Pill tone={DC4_STATUS[c.dc4].tone}>{DC4_STATUS[c.dc4].label}</Pill>
          {c.paiementDirect && <Pill tone="blue">Paiement direct</Pill>}
        </div>

        {c.alerte && (
          <div style={{ marginTop: 12, padding: '8px 10px', background: TOKENS.redSoft, border: `1px solid ${TOKENS.red}`, borderRadius: 5, fontSize: 11.5, color: TOKENS.red, display: 'flex', alignItems: 'center', gap: 7, lineHeight: 1.4 }}>
            <Icon name="alert" size={13} stroke={TOKENS.red} />
            {c.alerte}
          </div>
        )}

        {/* ST identity */}
        <div style={{ marginTop: 16, padding: 12, background: TOKENS.bgWarm, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="subcontract" size={18} stroke={TOKENS.ocreDeep} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{st.name}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>{st.metier} · {st.ville} · ICE {st.ice}</div>
          </div>
        </div>

        {/* fields */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <STField label="Chantier" value={`${c.site} · ${c.siteName}`} />
          <STField label="Conducteur" value={c.conducteur} />
          <STField label="Début" value={c.debut} mono />
          <STField label="Fin prévue" value={c.fin} mono />
        </div>

        {/* situation financière */}
        <div style={{ marginTop: 16, padding: 12, background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}` }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 10 }}>SITUATION FINANCIÈRE</div>
          <FinRow k="Marché ST (HT)" v={fmtMAD(c.montant) + ' DH'} />
          <FinRow k={`Travaux exécutés · ${c.avancement}%`} v={fmtMAD(valExec) + ' DH'} />
          <FinRow k={`Retenue garantie · ${c.retenue}%`} v={'– ' + fmtMAD(retenuMontant) + ' DH'} tone="amber" />
          <FinRow k="Déjà payé" v={fmtMAD(payeMontant) + ' DH'} />
          <FinRow k="Reste à payer" v={fmtMAD(reste) + ' DH'} strong />
        </div>

        {/* DC4 workflow */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 10 }}>PROCÉDURE D'AGRÉMENT (DC4)</div>
          <div style={{ position: 'relative', paddingLeft: 18 }}>
            <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: TOKENS.line2 }} />
            {dc4Steps.map((s, i) => (
              <div key={i} style={{ position: 'relative', paddingBottom: i < dc4Steps.length - 1 ? 12 : 0 }}>
                <div style={{ position: 'absolute', left: -18, top: 1, width: 15, height: 15, borderRadius: 999,
                  background: s.done ? TOKENS.green : TOKENS.paper, border: `1.5px solid ${s.done ? TOKENS.green : TOKENS.line2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.done && <Icon name="check" size={9} stroke={TOKENS.paper} strokeWidth={3} />}
                </div>
                <div style={{ fontSize: 12, color: TOKENS.ink2, fontWeight: s.done ? 500 : 400 }}>{s.label}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 1 }}>{s.who}</div>
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {c.dc4 !== 'agree' && <Button variant="primary" icon={<Icon name="shield" size={13} stroke={TOKENS.bg} />}>Relancer l'agrément DC4</Button>}
          {c.status === 'cours' && <Button variant="primary" icon={<Icon name="invoice" size={13} stroke={TOKENS.bg} />}>Établir situation ST</Button>}
          <div style={{ display: 'flex', gap: 6 }}>
            <a href={`#fiche-${c.site}`} style={{ flex: 1, textDecoration: 'none' }}>
              <Button size="sm" style={{ width: '100%', justifyContent: 'center' }} icon={<Icon name="sites" size={12} stroke={TOKENS.ink2} />}>Voir le chantier</Button>
            </a>
            <Button size="sm" style={{ flex: 1, justifyContent: 'center' }}>Contrat PDF</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function STField({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans', fontSize: 12, color: TOKENS.ink, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function FinRow({ k, v, strong, tone }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0',
      borderTop: strong ? `1px solid ${TOKENS.line2}` : 'none', marginTop: strong ? 4 : 0, paddingTop: strong ? 8 : 4 }}>
      <span style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{k}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: strong ? 13 : 12, fontWeight: strong ? 600 : 400,
        color: tone === 'amber' ? 'oklch(0.45 0.10 75)' : TOKENS.ink }}>{v}</span>
    </div>
  );
}

Object.assign(window, { SousTraitance });
