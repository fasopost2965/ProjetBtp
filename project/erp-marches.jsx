/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Marchés publics (appels d'offres BTP Maroc)
// Veille AO → Préparation dossier → Soumission → Attribution → Exécution
// Maîtres d'ouvrage : ADM, ONCF, ONEE, communes, ministères
// =============================================================================

(function () {
const { Drawer } = window;

const moisCourt = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const fmtD = (iso) => { const [y, m, d] = iso.split('-'); return `${parseInt(d)} ${moisCourt[parseInt(m) - 1]}`; };
const joursRestants = (iso) => { const ref = new Date(2026, 4, 28); const d = new Date(iso); return Math.round((d - ref) / 86400000); };

// Appels d'offres en veille / préparation
const AO = [
  { num: 'AO 47/2026', mo: 'ADM — Autoroutes du Maroc', objet: 'Élargissement A1 — section Kénitra-Sidi Allal', lot: 'Terrassement & ouvrages d\'art', estimation: 86_000_000, remise: '2026-06-12', caution: 860_000, status: 'preparation', avancement: 65 },
  { num: 'AO 12/2026', mo: 'Commune de Casablanca', objet: 'Voirie & assainissement quartier Sidi Moumen', lot: 'Lot unique VRD', estimation: 24_500_000, remise: '2026-06-04', caution: 245_000, status: 'preparation', avancement: 40 },
  { num: 'AO 88/2026', mo: 'Min. de la Santé', objet: 'Hôpital régional Béni Mellal — 240 lits', lot: 'Gros œuvre & second œuvre', estimation: 142_000_000, remise: '2026-07-10', caution: 1_420_000, status: 'veille', avancement: 10 },
  { num: 'AO 31/2026', mo: 'ONCF', objet: 'Pôle d\'échange multimodal gare de Fès', lot: 'Bâtiment voyageurs', estimation: 58_000_000, remise: '2026-06-20', caution: 580_000, status: 'preparation', avancement: 25 },
  { num: 'AO 09/2026', mo: 'Université Mohammed VI', objet: 'Résidences étudiantes Benguerir — 600 lits', lot: 'TCE', estimation: 71_000_000, remise: '2026-05-30', caution: 710_000, status: 'soumis', avancement: 100 },
];

// Marchés attribués / en cours
const MARCHES = [
  { num: 'M-2025-114', mo: 'ADM', objet: 'Marina Casablanca Lot 3', montant: 184_000_000, attrib: '2025-08-22', avancement: 62, status: 'cours', delai: '24 mois', situations: 4 },
  { num: 'M-2026-208', mo: 'STRS', objet: 'Tramway Rabat-Salé — extension', montant: 96_000_000, attrib: '2026-01-15', avancement: 31, status: 'cours', delai: '18 mois', situations: 2 },
  { num: 'M-2025-061', mo: 'TMSA', objet: 'Port Tanger Med — quai conteneurs', montant: 128_000_000, attrib: '2025-11-02', avancement: 48, status: 'cours', delai: '20 mois', situations: 3 },
  { num: 'M-2024-142', mo: 'ADM', objet: 'Échangeur A2 PK 142', montant: 42_000_000, attrib: '2024-06-01', avancement: 96, status: 'reception', delai: '14 mois', situations: 7 },
];

const AO_STATUS = {
  veille:      { label: 'En veille', tone: 'neutral' },
  preparation: { label: 'Dossier en préparation', tone: 'ocre' },
  soumis:      { label: 'Soumis — en attente', tone: 'blue' },
};
const M_STATUS = {
  cours:     { label: 'En exécution', tone: 'green' },
  reception: { label: 'Réception en cours', tone: 'amber' },
};

// 2.1 — Pièces dossier AO
const PIECES_AO = [
  { id: 'caution', label: 'Caution provisoire', obligatoire: true },
  { id: 'cnss', label: 'Attestation CNSS en vigueur', obligatoire: true },
  { id: 'fiscal', label: 'Attestation fiscale', obligatoire: true },
  { id: 'rc', label: 'Registre de commerce (RC)', obligatoire: true },
  { id: 'ice', label: "Statuts & ICE de l'entreprise", obligatoire: true },
  { id: 'rc_pro', label: 'RC professionnelle', obligatoire: true },
  { id: 'note_tech', label: 'Note technique & méthodologie', obligatoire: true },
  { id: 'offre', label: 'Offre financière (BPU + détail)', obligatoire: true },
  { id: 'ref', label: 'Références similaires (3 chantiers)', obligatoire: false },
  { id: 'orgchrt', label: 'Organigramme & CV équipe clé', obligatoire: false },
];

// Seed piece statuses per AO
const PIECES_STATUS = {
  'AO 47/2026': { caution:'ok', cnss:'ok', fiscal:'ok', rc:'ok', ice:'ok', rc_pro:'ok', note_tech:'partial', offre:'missing', ref:'ok', orgchrt:'missing' },
  'AO 12/2026': { caution:'ok', cnss:'ok', fiscal:'partial', rc:'ok', ice:'ok', rc_pro:'missing', note_tech:'missing', offre:'missing', ref:'missing', orgchrt:'missing' },
  'AO 88/2026': { caution:'missing', cnss:'missing', fiscal:'missing', rc:'ok', ice:'ok', rc_pro:'missing', note_tech:'missing', offre:'missing', ref:'missing', orgchrt:'missing' },
  'AO 31/2026': { caution:'ok', cnss:'ok', fiscal:'ok', rc:'ok', ice:'missing', rc_pro:'missing', note_tech:'missing', offre:'missing', ref:'missing', orgchrt:'missing' },
  'AO 09/2026': { caution:'ok', cnss:'ok', fiscal:'ok', rc:'ok', ice:'ok', rc_pro:'ok', note_tech:'ok', offre:'ok', ref:'ok', orgchrt:'ok' },
};

// Post-attribution data
const OS_DATA = {
  'M-2025-114': { os: { date: '2025-08-22', desc: 'Ordre de service de démarrage — travaux Lot 3 Résidentiel' }, avenants: [{ num: 1, montant: 4_200_000, motif: 'Travaux supplémentaires fondations spéciales' }], penalites: [] },
  'M-2026-208': { os: { date: '2026-01-15', desc: 'OS de démarrage — études exécution et installation chantier' }, avenants: [], penalites: [] },
  'M-2025-061': { os: { date: '2025-11-02', desc: 'Ordre de service démarrage — travaux digue secondaire' }, avenants: [{ num: 1, montant: 2_800_000, motif: 'Terrassement complémentaire zone C' }], penalites: [{ jours: 12, montant: 96_000, motif: 'Retard mise en place installations' }] },
  'M-2024-142': { os: { date: '2024-06-01', desc: 'OS démarrage — Échangeur A2 PK 142' }, avenants: [], penalites: [] },
};

// 2.2 — Garanties table data
const GARANTIES = [
  { marche: 'M-2025-114', type: 'Retenue de garantie', montant: 1_500_000, status: 'active', echeance: '2026-12-30', banque: 'Attijariwafa' },
  { marche: 'M-2026-208', type: "Restitution d'avance", montant: 4_200_000, status: 'active', echeance: '2026-08-15', banque: 'Bank of Africa' },
  { marche: 'M-2025-061', type: 'Bonne exécution', montant: 980_000, status: 'echeance', echeance: '2026-06-18', banque: 'Attijariwafa' },
  { marche: 'M-2024-142', type: 'Retenue de garantie', montant: 720_000, status: 'liberable', echeance: '2026-05-31', banque: 'Attijariwafa' },
];
const GAR_TONE = { active: 'blue', echeance: 'amber', liberable: 'green' };
const GAR_LABEL = { active: 'Active', echeance: 'Échéance proche', liberable: 'Libérable' };

// -----------------------------------------------------------------------------
function Marches() {
  const [tab, setTab] = React.useState('ao'); // ao | marches | garanties
  const [selectedAO, setSelectedAO] = React.useState(null); // 2.1 drawer state

  const aoEnCours = AO.filter(a => a.status !== 'veille').length;
  const carnet = MARCHES.reduce((s, m) => s + m.montant * (1 - m.avancement / 100), 0);
  const pipelineAO = AO.reduce((s, a) => s + a.estimation, 0);
  const tauxReussite = 38; // %

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            MARCHÉS PUBLICS · COMMANDE PUBLIQUE
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Appels d'offres &amp; marchés
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
            Veille marchespublics.gov.ma · décret 2-22-431 sur la commande publique
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button icon={<Icon name="refresh" size={13} stroke={TOKENS.ink2} />}>Veille AO</Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Nouveau dossier</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <MarcheKpi label="AO EN PRÉPARATION" value={aoEnCours} unit="dossiers" sub={`${fmtMAD(pipelineAO)} DH de pipeline`} tone="ocre" delay={60} />
        <MarcheKpi label="CARNET DE COMMANDES" value={fmtMAD(carnet)} unit="DH" sub="reste à produire sur marchés en cours" tone="ink" delay={120} />
        <MarcheKpi label="TAUX DE RÉUSSITE" value={tauxReussite} unit="%" sub="sur 12 derniers mois (8 / 21)" tone="green" delay={180} />
        <MarcheKpi label="MARCHÉS EN EXÉCUTION" value={MARCHES.filter(m => m.status === 'cours').length} unit="chantiers" sub={`${fmtMAD(MARCHES.reduce((s,m)=>s+m.montant,0))} DH cumulés`} tone="blue" delay={240} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${TOKENS.line}` }} className="erp-fade-in">
        {[
          ['ao', `Appels d'offres (${AO.length})`],
          ['marches', `Marchés attribués (${MARCHES.length})`],
          ['garanties', `Garanties (${GARANTIES.length})`],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === id ? TOKENS.ink : 'transparent'}`,
            color: tab === id ? TOKENS.ink : TOKENS.ink3, cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === id ? 600 : 400, marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {tab === 'ao' && <AoList selectedAO={selectedAO} setSelectedAO={setSelectedAO} />}
      {tab === 'marches' && <MarchesList />}
      {tab === 'garanties' && <GarantiesTable />}

      {/* 2.1 — AO Dossier Drawer */}
      {selectedAO && (
        <AoDossierDrawer ao={selectedAO} onClose={() => setSelectedAO(null)} />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
function MarcheKpi({ label, value, unit, sub, tone, delay }) {
  const dark = tone === 'ink';
  const colors = { green: TOKENS.green, ocre: TOKENS.ocre, blue: TOKENS.blue };
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
// 2.1 — AoList with onClick to open drawer
function AoList({ selectedAO, setSelectedAO }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {AO.map((a, i) => {
        const st = AO_STATUS[a.status];
        const jr = joursRestants(a.remise);
        const urgent = jr <= 7 && a.status !== 'soumis';
        return (
          <Card key={a.num} delay={340 + i * 50} padding={0} hoverable onClick={() => setSelectedAO(a)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 0 }}>
              {/* left */}
              <div style={{ padding: 18, borderRight: `1px solid ${TOKENS.line}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{a.num}</span>
                  <Pill tone={st.tone} dot>{st.label}</Pill>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{a.mo}</span>
                </div>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: TOKENS.ink, letterSpacing: '-0.01em', marginBottom: 4 }}>{a.objet}</div>
                <div style={{ fontSize: 12.5, color: TOKENS.ink2, marginBottom: 14 }}>{a.lot}</div>
                <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                  <MiniStat label="Estimation administration" value={`${fmtMAD(a.estimation)} DH`} />
                  <MiniStat label="Caution provisoire" value={`${fmtMAD(a.caution)} DH`} />
                  <MiniStat label="Remise des plis" value={fmtD(a.remise) + ' 2026'} accent={urgent ? 'red' : null} />
                </div>
              </div>
              {/* right */}
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: TOKENS.bg }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>DOSSIER</span>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600, color: a.avancement === 100 ? TOKENS.green : TOKENS.ink }}>{a.avancement}%</span>
                  </div>
                  <Progress value={a.avancement} tone={a.avancement === 100 ? 'green' : 'ocre'} height={6} />
                  <div style={{ marginTop: 12 }}>
                    {a.status === 'soumis' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TOKENS.blue }}>
                        <Icon name="check" size={13} stroke={TOKENS.blue} strokeWidth={2.4} />
                        Pli déposé — ouverture {fmtD(a.remise)}
                      </div>
                    ) : urgent ? (
                      <div className="erp-pulse" style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: TOKENS.red, fontWeight: 500 }}>
                        <Icon name="warning" size={13} stroke={TOKENS.red} />
                        Plus que {jr} jours
                      </div>
                    ) : (
                      <div style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{jr} jours avant la remise</div>
                    )}
                  </div>
                </div>
                <Button size="sm" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }} iconRight={<Icon name="arrowRight" size={12} stroke={TOKENS.ink2} />}>
                  {a.status === 'soumis' ? 'Voir le pli' : 'Ouvrir le dossier'}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function MiniStat({ label, value, accent }) {
  const colors = { red: TOKENS.red };
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 5 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: colors[accent] || TOKENS.ink }}>{value}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2.1 — AO Dossier Drawer
function AoDossierDrawer({ ao, onClose }) {
  const [drawerTab, setDrawerTab] = React.useState('pieces');
  const st = AO_STATUS[ao.status];
  const piecesSt = PIECES_STATUS[ao.num] || {};
  const complete = PIECES_AO.filter(p => piecesSt[p.id] === 'ok').length;
  const total = PIECES_AO.length;
  const pct = Math.round((complete / total) * 100);

  const pieceIcon = (s) => {
    if (s === 'ok') return <Icon name="check" size={13} stroke={TOKENS.green} strokeWidth={2.4} />;
    if (s === 'partial') return <Icon name="warning" size={13} stroke={TOKENS.amber} strokeWidth={2} />;
    return <Icon name="x" size={13} stroke={TOKENS.ink4} strokeWidth={2} />;
  };
  const pieceBg = (s) => s === 'ok' ? TOKENS.greenSoft : s === 'partial' ? TOKENS.amberSoft : TOKENS.bg;

  const postMarche = MARCHES.find(m => m.num.replace('M-', '').includes(ao.num.replace('AO ', '').split('/')[0]));

  return (
    <Drawer open={true} onClose={onClose} title={ao.num} subtitle={ao.mo} width={560}
      footer={
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Fermer</Button>
          <Button variant={pct === 100 ? 'primary' : 'ocre'} icon={<Icon name={pct === 100 ? 'doc' : 'plus'} size={13} stroke={TOKENS.bg} />}>
            {pct === 100 ? 'Soumettre le dossier' : 'Compléter le dossier'}
          </Button>
        </div>
      }>
      {/* Header info */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: TOKENS.ink, marginBottom: 6, letterSpacing: '-0.01em' }}>{ao.objet}</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Pill tone={st.tone} dot>{st.label}</Pill>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>Lot: {ao.lot}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>Remise: {fmtD(ao.remise)} 2026</span>
        </div>
      </div>

      {/* Drawer tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 18 }}>
        {[['pieces', 'Pièces du dossier'], ['suivi', 'Suivi post-attribution']].map(([id, label]) => (
          <button key={id} onClick={() => setDrawerTab(id)} style={{
            padding: '8px 14px', background: 'transparent', border: 'none',
            borderBottom: `2px solid ${drawerTab === id ? TOKENS.ink : 'transparent'}`,
            color: drawerTab === id ? TOKENS.ink : TOKENS.ink3, cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 12.5, fontWeight: drawerTab === id ? 600 : 400, marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {drawerTab === 'pieces' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Progress bar */}
          <div style={{ padding: '12px 14px', background: TOKENS.bg, borderRadius: 7, border: `1px solid ${TOKENS.line}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>AVANCEMENT DOSSIER</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600, color: pct === 100 ? TOKENS.green : TOKENS.ink }}>{complete}/{total} pièces complètes</span>
            </div>
            <Progress value={pct} tone={pct === 100 ? 'green' : 'ocre'} height={7} />
          </div>

          {/* Pieces list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PIECES_AO.map(p => {
              const s = piecesSt[p.id] || 'missing';
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '10px 12px', borderRadius: 6,
                  background: pieceBg(s),
                  border: `1px solid ${s === 'ok' ? TOKENS.greenSoft : s === 'partial' ? TOKENS.amberSoft : TOKENS.line}`,
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                    background: s === 'ok' ? TOKENS.greenSoft : s === 'partial' ? TOKENS.amberSoft : TOKENS.bgWarm,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pieceIcon(s)}
                  </div>
                  <span style={{ flex: 1, fontSize: 12.5, color: TOKENS.ink, fontWeight: s === 'ok' ? 400 : 500 }}>{p.label}</span>
                  {p.obligatoire && (
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ocreDeep, background: TOKENS.ocreSoft,
                      padding: '2px 7px', borderRadius: 3, letterSpacing: '0.06em' }}>OBLIGATOIRE</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {drawerTab === 'suivi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(() => {
            const m = MARCHES.find(m => m.num === 'M-2025-114'); // link by ao context — demo
            const osD = OS_DATA['M-2025-114'];
            if (!osD) return <div style={{ fontSize: 13, color: TOKENS.ink3, padding: 20, textAlign: 'center' }}>Aucune donnée post-attribution disponible.</div>;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* OS */}
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 8 }}>ORDRE DE SERVICE</div>
                  <div style={{ padding: '12px 14px', background: TOKENS.greenSoft, borderRadius: 7, border: `1px solid ${TOKENS.line}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Icon name="doc" size={15} stroke={TOKENS.green} />
                    <div>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginBottom: 3 }}>{fmtD(osD.os.date)} 2025</div>
                      <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{osD.os.desc}</div>
                    </div>
                  </div>
                </div>
                {/* Avenants */}
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 8 }}>AVENANTS ({osD.avenants.length})</div>
                  {osD.avenants.length === 0 ? <div style={{ fontSize: 12, color: TOKENS.ink3 }}>Aucun avenant.</div> : osD.avenants.map(av => (
                    <div key={av.num} style={{ padding: '10px 14px', background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>Avenant n°{av.num}</div>
                        <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 2 }}>{av.motif}</div>
                      </div>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600, color: TOKENS.ink }}>+{fmtMAD(av.montant)} DH</span>
                    </div>
                  ))}
                </div>
                {/* Pénalités */}
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 8 }}>PÉNALITÉS</div>
                  {osD.penalites.length === 0 ? <div style={{ fontSize: 12, color: TOKENS.green }}>Aucune pénalité enregistrée.</div> : osD.penalites.map((pen, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: TOKENS.redSoft, borderRadius: 6, border: `1px solid ${TOKENS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{pen.jours} jours de retard</div>
                        <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 2 }}>{pen.motif}</div>
                      </div>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600, color: TOKENS.red }}>−{fmtMAD(pen.montant)} DH</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </Drawer>
  );
}

// -----------------------------------------------------------------------------
// 2.2 — MarchesList with action buttons
function MarchesList() {
  return (
    <Card padding={0} delay={340}>
      <div style={{
        display: 'grid', gridTemplateColumns: '130px 1fr 160px 150px 160px 180px',
        padding: '11px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Marché</span><span>Objet</span><span style={{ textAlign: 'right' }}>Montant</span><span>Avancement</span><span style={{ textAlign: 'right' }}>Statut</span><span style={{ textAlign: 'right' }}>Actions</span>
      </div>
      {MARCHES.map((m, i) => {
        const st = M_STATUS[m.status];
        return (
          <div key={m.num} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: '130px 1fr 160px 150px 160px 180px',
            padding: '15px 20px', borderBottom: i < MARCHES.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{m.num}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>{m.mo}</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500 }}>{m.objet}</div>
              <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 3 }}>
                attribué {fmtD(m.attrib)} · délai {m.delai} · {m.situations} situations émises
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{fmtMAD(m.montant)} <span style={{ color: TOKENS.ink3, fontWeight: 400, fontSize: 10 }}>DH</span></div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600, color: TOKENS.ink }}>{m.avancement}%</span>
              </div>
              <Progress value={m.avancement} tone={m.status === 'reception' ? 'amber' : 'green'} height={5} />
            </div>
            <div style={{ textAlign: 'right' }}><Pill tone={st.tone} dot>{st.label}</Pill></div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <a href="#situations" onClick={() => {}} style={{ textDecoration: 'none' }}>
                <Button size="sm" icon={<Icon name="invoice" size={11} stroke={TOKENS.ink2} />}>Situations</Button>
              </a>
              <a href="#tresorerie" style={{ textDecoration: 'none' }}>
                <Button size="sm" icon={<Icon name="shield" size={11} stroke={TOKENS.ink2} />}>Cautions</Button>
              </a>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// 2.2 — Garanties table (3rd tab)
function GarantiesTable() {
  const totalEnc = GARANTIES.filter(g => g.status !== 'liberable').reduce((s, g) => s + g.montant, 0);
  return (
    <Card padding={0} delay={340}>
      <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Garanties & cautions de marché</h3>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>Encours actif <strong style={{ color: TOKENS.ink }}>{fmtMAD(totalEnc)} DH</strong></span>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '140px 1fr 160px 160px 120px',
        padding: '10px 20px', background: TOKENS.ink, color: TOKENS.bg,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Marché</span><span>Type de garantie</span><span style={{ textAlign: 'right' }}>Montant</span><span>Banque · Échéance</span><span style={{ textAlign: 'right' }}>Statut</span>
      </div>
      {GARANTIES.map((g, i) => (
        <div key={i} className="erp-row" style={{
          display: 'grid', gridTemplateColumns: '140px 1fr 160px 160px 120px',
          padding: '14px 20px', borderBottom: i < GARANTIES.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
        }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{g.marche}</div>
          <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{g.type}</div>
          <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>
            {fmtMAD(g.montant)} <span style={{ color: TOKENS.ink3, fontSize: 10, fontWeight: 400 }}>DH</span>
          </div>
          <div>
            <div style={{ fontSize: 12, color: TOKENS.ink2, fontWeight: 500 }}>{g.banque}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: g.status === 'echeance' ? TOKENS.amber : TOKENS.ink3, marginTop: 2 }}>
              {fmtD(g.echeance)} {g.echeance.split('-')[0]}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Pill tone={GAR_TONE[g.status]} dot>{GAR_LABEL[g.status]}</Pill>
          </div>
        </div>
      ))}
    </Card>
  );
}

Object.assign(window, { Marches });
})();
