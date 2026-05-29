/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Marchés publics (appels d'offres BTP Maroc)
// Veille AO → Préparation dossier → Soumission → Attribution → Exécution
// Maîtres d'ouvrage : ADM, ONCF, ONEE, communes, ministères
// =============================================================================

(function () {
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

// -----------------------------------------------------------------------------
function Marches() {
  const [tab, setTab] = React.useState('ao'); // ao | marches

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
        {[['ao', `Appels d'offres (${AO.length})`], ['marches', `Marchés attribués (${MARCHES.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '10px 16px', background: 'transparent', border: 'none',
            borderBottom: `2px solid ${tab === id ? TOKENS.ink : 'transparent'}`,
            color: tab === id ? TOKENS.ink : TOKENS.ink3, cursor: 'pointer',
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === id ? 600 : 400, marginBottom: -1,
          }}>{label}</button>
        ))}
      </div>

      {tab === 'ao' && <AoList />}
      {tab === 'marches' && <MarchesList />}
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
function AoList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {AO.map((a, i) => {
        const st = AO_STATUS[a.status];
        const jr = joursRestants(a.remise);
        const urgent = jr <= 7 && a.status !== 'soumis';
        return (
          <Card key={a.num} delay={340 + i * 50} padding={0} hoverable>
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
function MarchesList() {
  return (
    <Card padding={0} delay={340}>
      <div style={{
        display: 'grid', gridTemplateColumns: '130px 1fr 160px 150px 160px',
        padding: '11px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Marché</span><span>Objet</span><span style={{ textAlign: 'right' }}>Montant</span><span>Avancement</span><span style={{ textAlign: 'right' }}>Statut</span>
      </div>
      {MARCHES.map((m, i) => {
        const st = M_STATUS[m.status];
        return (
          <div key={m.num} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: '130px 1fr 160px 150px 160px',
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
          </div>
        );
      })}
    </Card>
  );
}

Object.assign(window, { Marches });
})();
