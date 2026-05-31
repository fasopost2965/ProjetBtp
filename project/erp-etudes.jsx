/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, fmtMAD */
// =============================================================================
// ERP — Screen — Études de prix & Devis (with Simulator Express)
// =============================================================================

const DEVIS_LIST = [
  { code: 'DV-2026-0142', name: 'Villa R+1 — M. Lahlou', client: 'Particulier · M. Lahlou', surface: 320, total: 2_780_000, status: 'Brouillon', tone: 'neutral', date: '24/05/2026' },
  { code: 'DV-2026-0141', name: 'Immeuble R+4 Bouskoura', client: 'SCI Atlas Habitat', surface: 1850, total: 18_900_000, status: 'Envoyé', tone: 'blue', date: '20/05/2026' },
  { code: 'DV-2026-0139', name: 'Réhabilitation école primaire', client: 'Commune Sidi Bernoussi', surface: 1200, total: 4_650_000, status: 'Accepté', tone: 'green', date: '15/05/2026' },
  { code: 'DV-2026-0138', name: 'Hangar logistique Aïn Sebaa', client: 'TransLog Maroc', surface: 2400, total: 9_200_000, status: 'Converti', tone: 'ocre', date: '12/05/2026', convertedTo: 'CSB-119' },
  { code: 'DV-2026-0135', name: 'Voirie résidence Hay Riad', client: 'Al Omrane Rabat', surface: 850, total: 3_400_000, status: 'Refusé', tone: 'red', date: '08/05/2026' },
  { code: 'DV-2026-0133', name: 'Mosquée de quartier — Nouaceur', client: 'Habous Casablanca', surface: 680, total: 5_120_000, status: 'Envoyé', tone: 'blue', date: '04/05/2026' },
];

// -----------------------------------------------------------------------------
// Ratios DH/m² par type de projet — barème indicatif marché marocain 2026
// -----------------------------------------------------------------------------
const PROJECT_TYPES = [
  { id: 'villa-r0', label: 'Villa R+0', icon: '🏠', base: { gros: 3000, sec: 2200, finit: 1600 }, unit: 'm²' },
  { id: 'villa-r1', label: 'Villa R+1', icon: '🏡', base: { gros: 3500, sec: 2500, finit: 1800 }, unit: 'm²' },
  { id: 'villa-r2', label: 'Villa R+2', icon: '🏘️', base: { gros: 3800, sec: 2700, finit: 2000 }, unit: 'm²' },
  { id: 'imm-r4',   label: 'Immeuble R+4', icon: '🏢', base: { gros: 3600, sec: 2400, finit: 1700 }, unit: 'm²' },
  { id: 'imm-r8',   label: 'Immeuble R+8', icon: '🏬', base: { gros: 4200, sec: 2800, finit: 1900 }, unit: 'm²' },
  { id: 'hangar',   label: 'Hangar / Industriel', icon: '🏭', base: { gros: 2200, sec: 1400, finit: 700 }, unit: 'm²' },
  { id: 'ecole',    label: 'Équipement public', icon: '🏛️', base: { gros: 3300, sec: 2200, finit: 1600 }, unit: 'm²' },
  { id: 'voirie',   label: 'Voirie & VRD', icon: '🛣️', base: { gros: 2200, sec: 800, finit: 400 }, unit: 'ml' },
];

const REGIONS = [
  { id: 'casa',  label: 'Casablanca',  factor: 1.00 },
  { id: 'rabat', label: 'Rabat-Salé',  factor: 1.05 },
  { id: 'tanger',label: 'Tanger',      factor: 1.00 },
  { id: 'mar',   label: 'Marrakech',   factor: 0.95 },
  { id: 'agadir',label: 'Agadir',      factor: 0.95 },
  { id: 'autre', label: 'Autre région',factor: 0.90 },
];

const FINITIONS = [
  { id: 'eco',  label: 'Économique', sub: 'Promoteur · social', factor: 0.85 },
  { id: 'std',  label: 'Standard',   sub: 'Moyen / haut standing',factor: 1.00 },
  { id: 'hdg',  label: 'Haut de gamme', sub: 'Premium · sur-mesure', factor: 1.40 },
];

const LOT_DEFINITIONS = [
  { id: 'terr',  label: 'Terrassements & VRD', share: 0.06, group: 'gros' },
  { id: 'go',    label: 'Gros œuvre — structure', share: 0.42, group: 'gros' },
  { id: 'etan',  label: 'Étanchéité & isolation', share: 0.05, group: 'gros' },
  { id: 'menui', label: 'Menuiserie aluminium', share: 0.09, group: 'sec' },
  { id: 'elec',  label: 'Électricité', share: 0.08, group: 'sec' },
  { id: 'plomb', label: 'Plomberie & sanitaire', share: 0.07, group: 'sec' },
  { id: 'rev',   label: 'Revêtements (sols, murs)', share: 0.10, group: 'finit' },
  { id: 'peint', label: 'Peinture & finitions', share: 0.06, group: 'finit' },
  { id: 'vert',  label: 'Espaces verts & voirie', share: 0.07, group: 'finit' },
];

// -----------------------------------------------------------------------------
function Etudes() {
  const [view, setView] = React.useState('hub'); // 'hub' | 'simulator'
  const [createOpen, setCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const h = (e) => { if (e.detail?.key === 'newQuote') setCreateOpen(true); };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  return (
    <>
      {view === 'simulator'
        ? <Simulator onBack={() => setView('hub')} />
        : <DevisHub onSimulate={() => setView('simulator')} onNew={() => setCreateOpen(true)} />}
      {createOpen && <window.NewDevisModal onClose={() => setCreateOpen(false)} />}
    </>
  );
}

// -----------------------------------------------------------------------------
// HUB — Devis list + entry points
// -----------------------------------------------------------------------------
function DevisHub({ onSimulate, onNew }) {
  const [filter, setFilter] = React.useState('all');
  const [preview, setPreview] = React.useState(null);
  const [convertTarget, setConvertTarget] = React.useState(null);
  const [devisList, setDevisList] = React.useState(DEVIS_LIST);
  const filtered = filter === 'all' ? devisList : devisList.filter(d => d.status.toLowerCase() === filter);

  const handleConvert = (devis) => {
    const newCode = 'CSB-' + (Math.floor(Math.random() * 50) + 200);
    setDevisList(prev => prev.map(d => d.code === devis.code
      ? { ...d, status: 'Converti', tone: 'ocre', convertedTo: newCode }
      : d
    ));
    setConvertTarget(null);
    window.toast(`Chantier ${newCode} ouvert depuis ${devis.code}`, 'success', devis.name);
    setTimeout(() => { window.location.hash = 'sites'; }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            ÉTUDES DE PRIX · DEVIS
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink }}>
            Du devis au chantier <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· en un flux continu.</span>
          </h1>
        </div>
      </div>

      {/* Entry points */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <EntryCard
          onClick={onSimulate}
          tone="ocre"
          eyebrow="MÉTHODE RAPIDE · 2 MIN"
          title="Simulateur Express"
          desc="Estimez le coût d'un projet en répondant à 5 questions. Idéal en réunion client ou pour qualifier un appel d'offres."
          cta="Lancer le simulateur"
          delay={60}
        />
        <EntryCard
          eyebrow="MÉTHODE COMPLÈTE"
          title="Nouveau devis BPU"
          desc="Bordereau de prix unitaire détaillé poste par poste avec sous-détail (déboursé, FC, FG, marge)."
          cta="Créer un devis"
          delay={120}
          onClick={onNew}
        />
        <EntryCard
          eyebrow="DEPUIS UN EXISTANT"
          title="Importer / Dupliquer"
          desc="Repartez d'un devis précédent, d'un fichier Excel BPU ou d'un modèle de bibliothèque."
          cta="Choisir une source"
          delay={180}
          onClick={onNew}
        />
      </div>

      {/* Devis table */}
      <Card padding={0} delay={240}>
        <div style={{ padding: '20px 22px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${TOKENS.line}` }}>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>
              {filtered.length} DEVIS · TOTAL {fmtMAD(filtered.reduce((s, d) => s + d.total, 0))} DH HT
            </div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
              Devis récents
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              ['all', 'Tous', null],
              ['brouillon', 'Brouillons', 'neutral'],
              ['envoyé', 'Envoyés', 'blue'],
              ['accepté', 'Acceptés', 'green'],
              ['converti', 'Convertis', 'ocre'],
              ['refusé', 'Refusés', 'red'],
            ].map(([id, label, tone]) => (
              <button key={id} onClick={() => setFilter(id)} className="erp-pill-btn" style={{
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                background: filter === id ? TOKENS.ink : TOKENS.bgWarm,
                color: filter === id ? TOKENS.bg : TOKENS.ink2,
                border: `1px solid ${filter === id ? TOKENS.ink : 'transparent'}`,
                fontFamily: 'IBM Plex Sans', fontSize: 11, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 100px 130px 100px 110px 140px',
          padding: '10px 22px',
          background: TOKENS.bg,
          borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <span>Code</span>
          <span>Projet</span>
          <span style={{ textAlign: 'right' }}>Surface</span>
          <span style={{ textAlign: 'right' }}>Montant HT</span>
          <span style={{ textAlign: 'center' }}>Date</span>
          <span style={{ textAlign: 'center' }}>Statut</span>
          <span style={{ textAlign: 'right' }}>Action</span>
        </div>

        {filtered.map((d, i) => (
          <div key={d.code} className="erp-row" style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 100px 130px 100px 110px 140px',
            padding: '14px 22px',
            borderBottom: i < filtered.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep }}>{d.code}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.name}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>
                {d.client}
              </div>
            </div>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>
              {d.surface} m²
            </span>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>
              {fmtMAD(d.total)}
            </span>
            <span style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
              {d.date}
            </span>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Pill tone={d.tone} dot>{d.status}</Pill>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); setPreview(d); }}
                icon={<Icon name="doc" size={11} stroke={TOKENS.ink2} />}>Aperçu</Button>
              {d.status === 'Accepté' && (
                <Button size="sm" variant="ocre" onClick={(e) => { e.stopPropagation(); setConvertTarget(d); }} iconRight={<Icon name="arrowRight" size={11} stroke={TOKENS.ocreDeep} />}>
                  → Chantier
                </Button>
              )}
              {d.status === 'Converti' && (
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, display: 'flex', alignItems: 'center', gap: 4 }}>
                  → {d.convertedTo}
                </span>
              )}
              {(d.status === 'Brouillon' || d.status === 'Envoyé' || d.status === 'Refusé') && (
                <Button size="sm">Ouvrir</Button>
              )}
            </div>
          </div>
        ))}
      </Card>

      <ConversionFlow />
      {preview && <window.DevisDocPreview devis={preview} onClose={() => setPreview(null)} />}
      {convertTarget && (
        <window.Modal open title="Convertir en chantier" subtitle={convertTarget.code + ' — ' + convertTarget.name}
          width={480} onClose={() => setConvertTarget(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => setConvertTarget(null)}>Annuler</Button>
              <Button variant="primary" onClick={() => handleConvert(convertTarget)}
                icon={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
                Ouvrir le chantier
              </Button>
            </div>
          }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
            <div style={{ padding: '14px 16px', background: TOKENS.ocreSoft, borderRadius: 6, border: `1px solid ${TOKENS.ocre}` }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 6 }}>DEVIS ACCEPTÉ</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: TOKENS.ink }}>{convertTarget.name}</div>
              <div style={{ fontSize: 12, color: TOKENS.ink3, marginTop: 4 }}>{convertTarget.client}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ocreDeep, fontWeight: 600, marginTop: 8 }}>
                {fmtMAD(convertTarget.total)} DH HT · {convertTarget.surface} m²
              </div>
            </div>
            <div style={{ fontSize: 13, color: TOKENS.ink2, lineHeight: 1.6 }}>
              Un nouveau chantier va être créé avec les données du devis pré-remplies. Le devis sera marqué <strong>Converti</strong>. Vous pourrez ensuite ouvrir des situations et émettre des factures depuis la fiche chantier.
            </div>
          </div>
        </window.Modal>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
function EntryCard({ tone, eyebrow, title, desc, cta, onClick, delay }) {
  const isOcre = tone === 'ocre';
  return (
    <Card hoverable onClick={onClick} delay={delay} style={{
      background: isOcre ? TOKENS.ink : TOKENS.paper,
      color: isOcre ? TOKENS.bg : TOKENS.ink,
      borderColor: isOcre ? TOKENS.ink : TOKENS.line,
      position: 'relative', overflow: 'hidden',
      padding: 22,
    }}>
      {isOcre && (
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 140, height: 140,
          borderRadius: 999, background: `radial-gradient(circle, ${TOKENS.ocre} 0%, transparent 70%)`,
          opacity: 0.6, pointerEvents: 'none',
        }} />
      )}
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: 10,
          color: isOcre ? TOKENS.ocre : TOKENS.ocreDeep,
          letterSpacing: '0.12em', marginBottom: 12,
        }}>{eyebrow}</div>
        <h3 style={{
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 20,
          margin: '0 0 10px', letterSpacing: '-0.02em',
          color: isOcre ? TOKENS.bg : TOKENS.ink,
        }}>{title}</h3>
        <p style={{
          fontSize: 12.5, lineHeight: 1.55, margin: '0 0 18px',
          color: isOcre ? TOKENS.ink4 : TOKENS.ink2,
        }}>{desc}</p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600,
          color: isOcre ? TOKENS.ocre : TOKENS.ink,
        }}>
          {cta} <Icon name="arrowRight" size={13} stroke={isOcre ? TOKENS.ocre : TOKENS.ink} />
        </div>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function ConversionFlow() {
  const steps = [
    { kind: 'SIM', label: 'Simulation', desc: 'Estimer en 2 min' },
    { kind: 'DV',  label: 'Devis BPU',  desc: 'Détailler les postes' },
    { kind: 'CH',  label: 'Chantier',   desc: 'Ouvrir le projet' },
    { kind: 'SIT', label: 'Situation',  desc: 'Attachement mensuel' },
    { kind: 'FA',  label: 'Facture',    desc: 'Émettre · encaisser' },
  ];
  return (
    <Card delay={300}>
      <CardHead
        eyebrow="CYCLE DE VIE COMMERCIAL"
        title="De l'estimation à l'encaissement"
        right={<span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>Chaque étape produit la suivante sans ressaisie.</span>}
      />
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginTop: 4 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.kind}>
            <div style={{
              flex: 1, padding: '16px 18px',
              background: TOKENS.bg, borderRadius: 6,
              border: `1px solid ${TOKENS.line}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{
                width: 36, height: 36, borderRadius: 6,
                background: TOKENS.paper, color: TOKENS.ocreDeep,
                border: `1px solid ${TOKENS.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 500,
                flexShrink: 0,
              }}>{s.kind}</span>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{s.label}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px', color: TOKENS.ink4 }}>
                <Icon name="arrowRight" size={14} stroke={TOKENS.ink4} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

// =============================================================================
// SIMULATOR EXPRESS — 2-minute project cost estimator
// =============================================================================

function Simulator({ onBack }) {
  const [project, setProject] = React.useState('villa-r1');
  const [surface, setSurface] = React.useState(280);
  const [region, setRegion] = React.useState('casa');
  const [finit, setFinit] = React.useState('std');
  const [lots, setLots] = React.useState(LOT_DEFINITIONS.map(l => l.id));
  const [margin, setMargin] = React.useState(15);
  const [duration, setDuration] = React.useState(14);
  const [mode, setMode] = React.useState('express'); // refonte UX : express | detaille

  const pType = PROJECT_TYPES.find(p => p.id === project);
  const rFactor = REGIONS.find(r => r.id === region).factor;
  const fFactor = FINITIONS.find(f => f.id === finit).factor;

  // Calculations
  const baseCost = (pType.base.gros + pType.base.sec + pType.base.finit) * surface * rFactor * fFactor;

  const lotBreakdown = LOT_DEFINITIONS.map(lot => {
    const included = lots.includes(lot.id);
    const cost = baseCost * lot.share;
    return { ...lot, cost, included };
  });

  const directCost = lotBreakdown.filter(l => l.included).reduce((s, l) => s + l.cost, 0);
  const fc = directCost * 0.08; // frais de chantier 8%
  const fg = directCost * 0.06; // frais généraux 6%
  const totalCost = directCost + fc + fg;
  const marginAmount = totalCost * (margin / 100);
  const ht = totalCost + marginAmount;
  const tva = ht * 0.20;
  const ttc = ht + tva;
  const dhPerUnit = ht / surface;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SimHeader onBack={onBack} ht={ht} />
      <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <SimForm
          mode={mode} setMode={setMode}
          project={project} setProject={setProject}
          surface={surface} setSurface={setSurface}
          region={region} setRegion={setRegion}
          finit={finit} setFinit={setFinit}
          lots={lots} setLots={setLots}
          margin={margin} setMargin={setMargin}
          duration={duration} setDuration={setDuration}
          unit={pType.unit}
        />
        <SimResult
          pType={pType} surface={surface} region={region} finit={finit}
          lotBreakdown={lotBreakdown}
          directCost={directCost} fc={fc} fg={fg}
          totalCost={totalCost} marginAmount={marginAmount} margin={margin}
          ht={ht} tva={tva} ttc={ttc}
          dhPerUnit={dhPerUnit} duration={duration}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function SimHeader({ onBack, ht }) {
  return (
    <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: TOKENS.ink3,
          fontSize: 12, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10,
        }}>
          ← Retour aux devis
        </button>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 8 }}>
          SIMULATEUR EXPRESS · ESTIMATION RAPIDE
        </div>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em' }}>
          Combien va coûter ce projet ?
        </h1>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button>Réinitialiser</Button>
        <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Sauver brouillon</Button>
        <Button variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
          Convertir en BPU détaillé
        </Button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function SimForm({ mode, setMode, project, setProject, surface, setSurface, region, setRegion, finit, setFinit, lots, setLots, margin, setMargin, duration, setDuration, unit }) {
  const detaille = mode === 'detaille';
  return (
    <Card padding={0} delay={60} style={{ position: 'sticky', top: 80 }}>
      <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 4 }}>
            {detaille ? 'PARAMÈTRES DÉTAILLÉS' : '3 QUESTIONS · MISE À JOUR EN DIRECT'}
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16 }}>
            Décrivez votre projet
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, background: TOKENS.bgWarm, borderRadius: 6, padding: 2 }}>
          {[['express', 'Express'], ['detaille', 'Détaillé']].map(([id, label]) => (
            <button key={id} onClick={() => setMode(id)} style={{
              padding: '5px 11px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: mode === id ? TOKENS.paper : 'transparent',
              color: mode === id ? TOKENS.ink : TOKENS.ink3,
              fontFamily: 'IBM Plex Sans', fontSize: 11.5, fontWeight: mode === id ? 600 : 400,
              boxShadow: mode === id ? '0 1px 2px rgba(26,24,20,0.08)' : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Q1 — Type de projet */}
        <FormSection num="1" label="Type de projet">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {PROJECT_TYPES.map(p => (
              <button key={p.id} onClick={() => setProject(p.id)} style={{
                padding: '10px 12px',
                background: project === p.id ? TOKENS.ink : TOKENS.bg,
                color: project === p.id ? TOKENS.bg : TOKENS.ink,
                border: `1px solid ${project === p.id ? TOKENS.ink : TOKENS.line}`,
                borderRadius: 5,
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Q2 — Surface */}
        <FormSection num="2" label={`Surface du projet (${unit})`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={50} max={5000} step={10} value={surface} onChange={e => setSurface(+e.target.value)}
              style={{ flex: 1, accentColor: TOKENS.ocre }} />
            <input type="number" value={surface} onChange={e => setSurface(+e.target.value || 0)}
              style={{
                width: 90, height: 32, padding: '0 10px',
                border: `1px solid ${TOKENS.line2}`, borderRadius: 5,
                fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink,
                textAlign: 'right', outline: 'none', background: TOKENS.paper,
              }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{unit}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 4 }}>
            <span>50</span><span>1000</span><span>2500</span><span>5000</span>
          </div>
        </FormSection>

        {/* Q3 — Région */}
        <FormSection num="3" label="Région">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {REGIONS.map(r => (
              <button key={r.id} onClick={() => setRegion(r.id)} className="erp-pill-btn" style={{
                padding: '6px 10px',
                background: region === r.id ? TOKENS.ink : TOKENS.bgWarm,
                color: region === r.id ? TOKENS.bg : TOKENS.ink,
                border: `1px solid ${region === r.id ? TOKENS.ink : 'transparent'}`,
                borderRadius: 4, fontSize: 11.5, fontWeight: 500,
                cursor: 'pointer',
              }}>
                {r.label}
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, opacity: 0.7, marginLeft: 6 }}>
                  ×{r.factor.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </FormSection>

        {detaille && <>
        {/* Q4 — Finition */}
        <FormSection num="4" label="Niveau de finition">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {FINITIONS.map(f => (
              <button key={f.id} onClick={() => setFinit(f.id)} style={{
                padding: '10px 8px',
                background: finit === f.id ? TOKENS.ocreSoft : TOKENS.bg,
                color: finit === f.id ? TOKENS.ocreDeep : TOKENS.ink,
                border: `1px solid ${finit === f.id ? TOKENS.ocre : TOKENS.line}`,
                borderRadius: 5, cursor: 'pointer', textAlign: 'center',
                lineHeight: 1.3,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, marginTop: 3 }}>
                  ×{f.factor.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </FormSection>

        {/* Q5 — Lots inclus */}
        <FormSection num="5" label={`Lots à inclure (${lots.length}/${LOT_DEFINITIONS.length})`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {LOT_DEFINITIONS.map(l => {
              const on = lots.includes(l.id);
              return (
                <button key={l.id} onClick={() => setLots(on ? lots.filter(x => x !== l.id) : [...lots, l.id])} style={{
                  padding: '5px 10px',
                  background: on ? TOKENS.ink : 'transparent',
                  color: on ? TOKENS.bg : TOKENS.ink3,
                  border: `1px solid ${on ? TOKENS.ink : TOKENS.line2}`,
                  borderRadius: 999, fontSize: 11, cursor: 'pointer',
                  fontWeight: 500,
                }}>
                  {on ? '✓ ' : '+ '}{l.label}
                </button>
              );
            })}
          </div>
        </FormSection>

        <div style={{ height: 1, background: TOKENS.line }} />

        {/* Marge */}
        <FormSection label="Marge cible">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={5} max={30} step={1} value={margin} onChange={e => setMargin(+e.target.value)}
              style={{ flex: 1, accentColor: TOKENS.ocre }} />
            <div style={{
              padding: '4px 10px', background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
              borderRadius: 4, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 500,
              width: 56, textAlign: 'center',
            }}>{margin}%</div>
          </div>
        </FormSection>

        {/* Durée */}
        <FormSection label="Délai d'exécution">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={2} max={36} step={1} value={duration} onChange={e => setDuration(+e.target.value)}
              style={{ flex: 1, accentColor: TOKENS.ocre }} />
            <div style={{
              padding: '4px 10px', background: TOKENS.bgWarm, color: TOKENS.ink,
              borderRadius: 4, fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 500,
              width: 56, textAlign: 'center',
            }}>{duration} m</div>
          </div>
        </FormSection>
        </>}

      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function FormSection({ num, label, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {num && (
          <span style={{
            width: 18, height: 18, borderRadius: 999,
            background: TOKENS.ink, color: TOKENS.bg,
            fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{num}</span>
        )}
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12.5, fontWeight: 600, color: TOKENS.ink }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
function SimResult({ pType, surface, region, finit, lotBreakdown, directCost, fc, fg, totalCost, marginAmount, margin, ht, tva, ttc, dhPerUnit, duration }) {
  const regionLabel = REGIONS.find(r => r.id === region).label;
  const finitLabel = FINITIONS.find(f => f.id === finit).label;
  const monthlyBurn = directCost / duration;

  // Cost/m² benchmark
  const benchmarkLow = 6000, benchmarkHigh = 14000;
  const benchPct = Math.min(100, Math.max(0, ((dhPerUnit - benchmarkLow) / (benchmarkHigh - benchmarkLow)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Big number */}
      <Card delay={120} style={{ background: TOKENS.ink, color: TOKENS.bg, borderColor: TOKENS.ink, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 999,
          background: `radial-gradient(circle, ${TOKENS.ocre} 0%, transparent 70%)`,
          opacity: 0.35, pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.15em', marginBottom: 12 }}>
              ESTIMATION HT · {pType.label.toUpperCase()} · {surface} {pType.unit} · {regionLabel.toUpperCase()} · {finitLabel.toUpperCase()}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 56, letterSpacing: '-0.035em', lineHeight: 1, color: TOKENS.bg }}>
                {fmtMAD(ht)}
              </span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 16, color: TOKENS.ink4 }}>DH HT</span>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
              <div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, letterSpacing: '0.1em' }}>TTC (TVA 20%)</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.bg, marginTop: 3 }}>{fmtMAD(ttc)} DH</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, letterSpacing: '0.1em' }}>DH / {pType.unit}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.bg, marginTop: 3 }}>
                  {dhPerUnit.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH
                </div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, letterSpacing: '0.1em' }}>MARGE</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.bg, marginTop: 3 }}>{fmtMAD(marginAmount)} DH</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />
              <div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, letterSpacing: '0.1em' }}>BURN MENSUEL</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.bg, marginTop: 3 }}>{fmtMAD(monthlyBurn)} DH</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Benchmark */}
      <Card delay={180} padding={20}>
        <CardHead
          eyebrow="POSITIONNEMENT MARCHÉ"
          title={`${dhPerUnit.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} DH/${pType.unit}`}
          right={<Pill tone={benchPct < 30 ? 'green' : benchPct > 70 ? 'red' : 'ocre'} dot mono>
            {benchPct < 30 ? 'Compétitif' : benchPct > 70 ? 'Élevé' : 'Dans la fourchette'}
          </Pill>}
        />
        <div style={{ position: 'relative', height: 32 }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 14, height: 4,
            background: `linear-gradient(to right, ${TOKENS.green} 0%, ${TOKENS.ocre} 50%, ${TOKENS.red} 100%)`,
            borderRadius: 2, opacity: 0.5,
          }} />
          <div style={{
            position: 'absolute', left: `${benchPct}%`, top: 6, transform: 'translateX(-50%)',
            width: 4, height: 20, background: TOKENS.ink, borderRadius: 2,
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 4 }}>
          <span>6 000 DH/{pType.unit} <span style={{ color: TOKENS.green }}>· éco</span></span>
          <span>10 000 DH/{pType.unit} · marché</span>
          <span>14 000 DH/{pType.unit} <span style={{ color: TOKENS.red }}>· HDG</span></span>
        </div>
      </Card>

      {/* Breakdown by lot */}
      <Card delay={240} padding={0}>
        <CardHead
          eyebrow="DÉCOMPOSITION PAR LOT"
          title="Postes de coût direct"
          right={<span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>Direct {fmtMAD(directCost)} DH</span>}
          style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${TOKENS.line}`, marginBottom: 0 }}
        />
        {lotBreakdown.filter(l => l.included).map((l, i, arr) => {
          const pct = (l.cost / directCost) * 100;
          return (
            <div key={l.id} style={{
              padding: '12px 22px',
              borderBottom: i < arr.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              display: 'grid', gridTemplateColumns: '1fr 80px 1.2fr 110px', gap: 14, alignItems: 'center',
            }}>
              <span style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{l.label}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
                {pct.toFixed(1)}%
              </span>
              <Progress value={pct} tone="ocre" height={5} />
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>
                {fmtMAD(l.cost)} DH
              </span>
            </div>
          );
        })}
      </Card>

      {/* Cost stack */}
      <Card delay={300}>
        <CardHead eyebrow="STRUCTURE DE COÛT" title="Du déboursé sec à la facture" />
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              { label: 'Déboursé sec (matériaux + main d\'œuvre)', value: directCost, color: TOKENS.ink2 },
              { label: 'Frais de chantier (FC) · 8% du direct', value: fc, color: TOKENS.ink3 },
              { label: 'Frais généraux (FG) · 6% du direct', value: fg, color: TOKENS.ink3 },
              { label: 'Prix de revient total', value: totalCost, color: TOKENS.ink, bold: true, border: true },
              { label: `Marge bénéficiaire · ${margin}%`, value: marginAmount, color: TOKENS.ocreDeep },
              { label: 'MONTANT HT', value: ht, color: TOKENS.ink, bold: true, border: true, big: true },
              { label: 'TVA 20%', value: tva, color: TOKENS.ink3 },
              { label: 'MONTANT TTC', value: ttc, color: TOKENS.ink, bold: true, border: true, big: true },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: r.border ? `1px solid ${TOKENS.line}` : 'none' }}>
                <td style={{
                  padding: '8px 0',
                  fontSize: r.big ? 13 : 12.5,
                  fontWeight: r.bold ? 600 : 400,
                  color: r.color,
                }}>{r.label}</td>
                <td style={{
                  padding: '8px 0', textAlign: 'right',
                  fontFamily: 'IBM Plex Mono', fontSize: r.big ? 14 : 12.5,
                  fontWeight: r.bold ? 600 : 400, color: r.color,
                }}>{fmtMAD(r.value)} DH</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <ActionTile
          delay={360}
          kind="DV"
          title="Sauvegarder en brouillon"
          desc="Conserver cette simulation pour la finaliser plus tard."
        />
        <ActionTile
          delay={400}
          kind="BPU"
          title="Convertir en BPU détaillé"
          desc="Détailler ligne par ligne avec sous-détail de prix."
          ocre
        />
        <ActionTile
          delay={440}
          kind="CH"
          title="Lancer en chantier"
          desc="Ouvrir directement un chantier avec ce budget."
        />
      </div>

      {/* Hypothèses */}
      <Card delay={500} padding={16} style={{ background: TOKENS.bgWarm, borderColor: TOKENS.line }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="warning" size={14} stroke={TOKENS.ink3} />
          <div style={{ fontSize: 11.5, color: TOKENS.ink2, lineHeight: 1.55 }}>
            <b style={{ color: TOKENS.ink }}>Hypothèses du barème</b> · Ratios indicatifs marché marocain 2026. FC inclut amenée d'eau, électricité, gardiennage, base-vie. FG inclut direction de travaux, encadrement, frais de siège. <b style={{ color: TOKENS.ink }}>Affiner en BPU détaillé</b> pour soumissionner à un appel d'offres.
          </div>
        </div>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
function ActionTile({ kind, title, desc, ocre, delay }) {
  return (
    <Card hoverable delay={delay} padding={18} style={{
      background: ocre ? TOKENS.ink : TOKENS.paper,
      borderColor: ocre ? TOKENS.ink : TOKENS.line,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 6, marginBottom: 12,
        background: ocre ? TOKENS.ocre : TOKENS.bgWarm,
        color: ocre ? TOKENS.ink : TOKENS.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600,
      }}>{kind}</div>
      <div style={{
        fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginBottom: 6,
        color: ocre ? TOKENS.bg : TOKENS.ink, letterSpacing: '-0.01em',
      }}>{title}</div>
      <div style={{
        fontSize: 11.5, lineHeight: 1.5,
        color: ocre ? TOKENS.ink4 : TOKENS.ink3,
      }}>{desc}</div>
    </Card>
  );
}

Object.assign(window, { Etudes });
