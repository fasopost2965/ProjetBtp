/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, fmtMAD */
// =============================================================================
// ERP — Bibliothèque de rapports + Templates
// =============================================================================

// -----------------------------------------------------------------------------
// CATALOGUE de rapports
// -----------------------------------------------------------------------------
const REPORTS = {
  finance: {
    label: 'Rapports financiers',
    accent: TOKENS.ocre,
    items: [
      { id: 'F1', code: 'F1', title: 'Compte d\'exploitation par chantier', desc: 'Recettes, coûts directs et indirects, résultat. Document signé chef de projet + DAF.', freq: 'Mensuel', last: '02/05/2026', popular: true, hasTemplate: true },
      { id: 'F2', code: 'F2', title: 'Marge brute par chantier', desc: 'Marge prévue vs réelle, écarts par poste, alertes dépassement.', freq: 'Mensuel', last: '02/05/2026', popular: true, hasTemplate: true },
      { id: 'F3', code: 'F3', title: 'Situation financière globale', desc: 'CA, encaissements, créances, dettes fournisseurs, trésorerie consolidée.', freq: 'Mensuel', last: '01/05/2026', popular: true, hasTemplate: true },
      { id: 'F4', code: 'F4', title: 'Échéancier trésorerie 13 semaines', desc: 'Flux entrants et sortants projetés sur trimestre glissant.', freq: 'Hebdomadaire', last: '26/05/2026' },
      { id: 'F5', code: 'F5', title: 'Suivi des cautions bancaires', desc: 'Par banque, par chantier, échéances et coût mainlevée.', freq: 'Mensuel', last: '01/05/2026' },
      { id: 'F6', code: 'F6', title: 'Déclaration TVA mensuelle', desc: 'TVA collectée et déductible, prorata, formulaire ADM administration fiscale.', freq: 'Mensuel', last: '20/04/2026' },
      { id: 'F7', code: 'F7', title: 'Balance âgée clients', desc: 'Encours 0-30, 30-60, 60-90, 90+ jours. Liste relances à effectuer.', freq: 'Hebdomadaire', last: '24/05/2026' },
      { id: 'F8', code: 'F8', title: 'Engagements fournisseurs', desc: 'BC ouverts, livrés, facturés, restant à livrer.', freq: 'Mensuel', last: '02/05/2026' },
    ],
  },
  chantier: {
    label: 'Rapports chantier',
    accent: TOKENS.blue,
    items: [
      { id: 'C1', code: 'C1', title: 'Situation mensuelle (attachement)', desc: 'Document contractuel, signé par MOE et MOA. Existe dans le menu "Situations".', freq: 'Mensuel', last: '28/05/2026', popular: true, link: 'situations' },
      { id: 'C2', code: 'C2', title: 'Avancement physique vs budget', desc: 'Comparaison par poste BPU, courbe en S.', freq: 'Hebdomadaire', last: '24/05/2026' },
      { id: 'C3', code: 'C3', title: 'Décompte général définitif (DGD)', desc: 'Document de clôture de marché — toutes situations + révisions cumulées.', freq: 'À la demande', last: '—' },
      { id: 'C4', code: 'C4', title: 'Rapport hebdomadaire de chantier', desc: 'Météo, effectif, faits marquants, photos. Envoyé au MOE chaque vendredi.', freq: 'Hebdomadaire', last: '24/05/2026', popular: true },
      { id: 'C5', code: 'C5', title: 'Journal de chantier', desc: 'Entrées/sorties matériel, livraisons matériaux, visiteurs.', freq: 'Quotidien', last: '27/05/2026' },
      { id: 'C6', code: 'C6', title: 'Consommation matériaux', desc: 'Théorique BPU vs réel, écart, alerte de surconsommation.', freq: 'Mensuel', last: '02/05/2026' },
      { id: 'C7', code: 'C7', title: 'Sous-détail de prix', desc: 'Déboursé sec, frais chantier, frais généraux, marge — par poste BPU.', freq: 'À la demande', last: '—' },
      { id: 'C8', code: 'C8', title: 'Dépenses & charges chantier détaillées', desc: 'Toutes dépenses par poste · matériaux, MO, sous-traitance, matériel, frais — décomposé par mois. Cumul exercice.', freq: 'Mensuel', last: '02/05/2026', popular: true, hasTemplate: true },
      { id: 'C9', code: 'C9', title: 'Suivi fournisseurs par chantier', desc: 'Volume d\'affaires confié à chaque fournisseur sur ce chantier — top 10.', freq: 'Mensuel', last: '02/05/2026' },
    ],
  },
  rh: {
    label: 'Ressources & paie',
    accent: TOKENS.green,
    items: [
      { id: 'R1', code: 'R1', title: 'Bordereau de paie ouvriers chantier', desc: 'Net à payer par ouvrier, par chantier, ventilation primes.', freq: 'Mensuel', last: '28/04/2026', popular: true },
      { id: 'R2', code: 'R2', title: 'Déclaration CNSS (BDS)', desc: 'Bordereau de déclaration de salaires — format CNSS DAMANCOM.', freq: 'Mensuel', last: '08/05/2026' },
      { id: 'R3', code: 'R3', title: 'IR sur salaires', desc: 'Retenue à la source par salarié, total à reverser à la DGI.', freq: 'Mensuel', last: '08/05/2026' },
      { id: 'R4', code: 'R4', title: 'Heures pointées par chantier', desc: 'Total heures normales + heures supplémentaires par chantier.', freq: 'Hebdomadaire', last: '24/05/2026' },
      { id: 'R5', code: 'R5', title: 'Affectation parc matériel', desc: 'Engins affectés par chantier, taux d\'utilisation, gasoil consommé.', freq: 'Mensuel', last: '02/05/2026' },
      { id: 'R6', code: 'R6', title: 'Charges sociales mensuelles', desc: 'CNSS, AMO, IR, retenues, formation pro · part patronale + salariale, ventilation par chantier.', freq: 'Mensuel', last: '08/05/2026', popular: true, hasTemplate: true },
      { id: 'R7', code: 'R7', title: 'Productivité équipes chantier', desc: 'Heures pointées vs heures vendues — rendement par chantier et par équipe.', freq: 'Mensuel', last: '02/05/2026' },
    ],
  },
  conformite: {
    label: 'Conformité & réglementaire',
    accent: TOKENS.amber,
    items: [
      { id: 'L1', code: 'L1', title: 'Dossier appel d\'offres', desc: 'Pièces administratives + techniques pour soumission marché public.', freq: 'À la demande', last: '—' },
      { id: 'L2', code: 'L2', title: 'Liste attestations sous-traitants', desc: 'CNSS, fiscale, RC à jour pour chaque sous-traitant actif.', freq: 'Mensuel', last: '05/05/2026' },
      { id: 'L3', code: 'L3', title: 'Registre HSE', desc: 'Incidents, presque-accidents, formations sécurité.', freq: 'Mensuel', last: '02/05/2026' },
    ],
  },
};

// -----------------------------------------------------------------------------
function Rapports() {
  const [view, setView] = React.useState('hub');
  const [reportId, setReportId] = React.useState(null);

  // Certains "rapports" pointent vers un module dédié (ex: C1 → Situations)
  const LINKS = {};
  Object.values(REPORTS).forEach(g => g.items.forEach(it => { if (it.link) LINKS[it.id] = it.link; }));

  const open = (id) => {
    if (LINKS[id]) { window.location.hash = LINKS[id]; return; }
    setReportId(id); setView('template');
  };
  const back = () => setView('hub');

  if (view === 'template') {
    const extras = window.RAPPORT_TEMPLATES || {};
    if (extras[reportId]) {
      const Tpl = extras[reportId];
      return <Tpl onBack={back} />;
    }
    if (reportId === 'F1') return <ReportF1 onBack={back} />;
    if (reportId === 'F2') return <ReportF2 onBack={back} />;
    if (reportId === 'F3') return <ReportF3 onBack={back} />;
    if (reportId === 'C8') return <ReportC8 onBack={back} />;
    if (reportId === 'R6') return <ReportR6 onBack={back} />;
    // Moteur data-driven : tous les autres rapports (définitions + exports réels)
    const defs = window.RAPPORT_DEFS || {};
    if (defs[reportId] && window.RapportEngine) {
      const def = defs[reportId]();
      return <window.RapportEngine.ReportRenderer def={def} onBack={back} />;
    }
    return <ReportStub onBack={back} id={reportId} />;
  }
  return <RapportsHub onOpen={open} />;
}

// -----------------------------------------------------------------------------
// HUB — Library of reports
// -----------------------------------------------------------------------------
function RapportsHub({ onOpen }) {
  const [q, setQ] = React.useState('');
  const [scope, setScope] = React.useState('all');

  const all = Object.entries(REPORTS).flatMap(([cat, group]) =>
    group.items.map(it => ({ ...it, cat, catLabel: group.label, accent: group.accent }))
  );
  const popular = all.filter(r => r.popular);

  const sections = scope === 'all'
    ? Object.entries(REPORTS)
    : [[scope, REPORTS[scope]]];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Hero */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            RAPPORTS & ANALYSES · {all.length} TEMPLATES DISPONIBLES
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.15 }}>
            Bibliothèque de rapports. <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>Tous les documents dont vous avez besoin.</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<Icon name="settings" size={13} stroke={TOKENS.ink2} />}>Mes favoris</Button>
          <Button variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
            Rapport personnalisé
          </Button>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="erp-search" style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 14px', height: 40,
          background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6,
        }}>
          <Icon name="search" size={15} stroke={TOKENS.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Rechercher un rapport (compte d'exploitation, CNSS, TVA…)" 
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5 }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            ['all', 'Tous', null],
            ['finance', 'Finance', TOKENS.ocre],
            ['chantier', 'Chantier', TOKENS.blue],
            ['rh', 'RH & Paie', TOKENS.green],
            ['conformite', 'Conformité', TOKENS.amber],
          ].map(([id, label, color]) => (
            <button key={id} onClick={() => setScope(id)} className="erp-pill-btn" style={{
              padding: '8px 12px', borderRadius: 5, cursor: 'pointer',
              background: scope === id ? TOKENS.ink : TOKENS.bgWarm,
              color: scope === id ? TOKENS.bg : TOKENS.ink2,
              border: `1px solid ${scope === id ? TOKENS.ink : 'transparent'}`,
              fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {color && <span style={{ width: 7, height: 7, borderRadius: 999, background: color }} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular row */}
      {scope === 'all' && !q && (
        <Card padding={0} delay={60}>
          <div style={{ padding: '18px 22px 12px', borderBottom: `1px solid ${TOKENS.line}` }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 4 }}>
              ⭐ LES PLUS UTILISÉS
            </div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15 }}>
              Démarrer rapidement
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {popular.slice(0, 6).map((r, i) => (
              <button key={r.id} onClick={() => onOpen(r.id)} className="erp-row" style={{
                padding: '16px 22px', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                borderRight: (i + 1) % 3 !== 0 ? `1px solid ${TOKENS.line}` : 'none',
                borderBottom: i < 3 ? `1px solid ${TOKENS.line}` : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 5,
                  background: r.accent, color: TOKENS.paper,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600,
                  flexShrink: 0,
                }}>{r.code}</span>
                <div style={{ minWidth: 0, lineHeight: 1.3 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TOKENS.ink, marginBottom: 2 }}>{r.title}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
                    {r.freq} · dernier : {r.last}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Sections */}
      {sections.map(([catId, group], si) => {
        const items = q ? group.items.filter(it => (it.title + it.desc).toLowerCase().includes(q.toLowerCase())) : group.items;
        if (items.length === 0) return null;
        return (
          <div key={catId} className="erp-fade-in" style={{ animationDelay: `${120 + si * 60}ms` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: group.accent }} />
              <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, margin: 0, letterSpacing: '-0.015em' }}>
                {group.label}
              </h2>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, letterSpacing: '0.04em' }}>
                {items.length} rapports
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {items.map((r, i) => (
                <ReportCard key={r.id} report={r} accent={group.accent} onClick={() => onOpen(r.id)} delay={i * 30} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReportCard({ report, accent, onClick, delay }) {
  return (
    <Card hoverable padding={18} onClick={onClick} delay={delay} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 5,
          background: accent, color: TOKENS.paper,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600,
        }}>{report.code}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {report.popular && <Pill mono tone="ocre">★ Populaire</Pill>}
          {report.hasTemplate && <Pill mono>Template prêt</Pill>}
        </div>
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14.5, color: TOKENS.ink, marginBottom: 6, letterSpacing: '-0.01em' }}>
        {report.title}
      </div>
      <div style={{ fontSize: 12, color: TOKENS.ink2, lineHeight: 1.55, flex: 1, marginBottom: 14 }}>
        {report.desc}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${TOKENS.line}` }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
          {report.freq} {report.last !== '—' && `· ${report.last}`}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: TOKENS.ink, display: 'flex', alignItems: 'center', gap: 4 }}>
          Générer →
        </span>
      </div>
    </Card>
  );
}

// =============================================================================
// REPORT TEMPLATES — A4 portrait, printable
// =============================================================================

// -----------------------------------------------------------------------------
// Shared — A4 page wrapper, letterhead
// -----------------------------------------------------------------------------
function ReportShell({ onBack, code, category, title, children, period }) {
  // Exports réels via le moteur si une définition data existe pour ce code
  const exp = (fmt) => {
    const defs = window.RAPPORT_DEFS || {};
    if (defs[code] && window.RapportEngine) {
      window.RapportEngine.exportReport(defs[code](), fmt);
    } else if (fmt === 'pdf') {
      window.print();
    } else {
      window.toast('Export indisponible pour ce template', 'warn', `${code} · ${title}`);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="erp-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <button onClick={onBack} className="erp-pill-btn" style={{
          background: 'transparent', border: 'none', color: TOKENS.ink3,
          fontSize: 12, padding: '4px 8px', marginLeft: -8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, borderRadius: 4,
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13 }}>←</span>
          Bibliothèque
        </button>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => exp('csv')} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>CSV</Button>
          <Button onClick={() => exp('excel')} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Excel</Button>
          <Button onClick={() => { window.print(); }} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Imprimer</Button>
          <Button onClick={() => exp('pdf')} variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />}>
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div className="erp-fade-in" style={{
        background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 4,
        padding: '44px 52px', maxWidth: 820, margin: '0 auto',
        boxShadow: '0 12px 40px -16px rgba(26,24,20,0.18)',
        fontFamily: 'IBM Plex Sans', color: TOKENS.ink, width: '100%',
      }}>
        <Letterhead code={code} category={category} title={title} period={period} />
        {children}
        <ReportFooter />
      </div>
    </div>
  );
}

function Letterhead({ code, category, title, period }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${TOKENS.ink}`, paddingBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="22" height="22" viewBox="0 0 28 28">
              <rect x="2" y="14" width="10" height="12" fill={TOKENS.ink} />
              <rect x="14" y="8" width="8" height="18" fill={TOKENS.ink} />
              <rect x="6" y="4" width="4" height="8" fill={TOKENS.ocre} />
            </svg>
            <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
              ATLAS<span style={{ color: TOKENS.ocre }}>·</span>BTP
            </span>
          </div>
          <div style={{ fontSize: 9.5, color: TOKENS.ink2, lineHeight: 1.55 }}>
            <b>Atlas Constructions S.A.</b> · 78, Bd Mohammed V, Casablanca 20000<br/>
            ICE 002578946000093 · RC 145789 · IF 24578946 · CNSS 7845612
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px', borderRadius: 4,
            background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
            fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.1em',
            marginBottom: 6,
          }}>
            {code} · {category.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3 }}>
            Édité le 28/05/2026 · K. Benjelloun
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '22px 0 18px' }}>
        <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h2>
        {period && (
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 6, letterSpacing: '0.04em' }}>
            {period}
          </div>
        )}
      </div>
    </>
  );
}

function ReportFooter() {
  return (
    <div style={{
      marginTop: 32, paddingTop: 14, borderTop: `1px solid ${TOKENS.line}`,
      display: 'flex', justifyContent: 'space-between',
      fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.04em',
    }}>
      <span>Confidentiel · Atlas Constructions S.A.</span>
      <span>Généré par Atlas·BTP ERP · v4.2.1</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// F1 — Compte d'exploitation par chantier
// -----------------------------------------------------------------------------
function ReportF1({ onBack }) {
  // Data for CSB-114
  const recettes = [
    { label: 'Situation N°1 facturée — Janvier 2025', amount: 4_120_000 },
    { label: 'Situation N°2 facturée — Mars 2025', amount: 5_840_000 },
    { label: 'Situation N°3 facturée — Septembre 2025', amount: 7_650_000 },
    { label: 'Situation N°4 facturée — Avril 2026', amount: 6_240_000 },
    { label: 'Situation N°5 en cours — Mai 2026', amount: 6_188_400 },
    { label: 'Avenant N°1 facturé', amount: 1_440_000 },
  ];
  const totalRecettes = recettes.reduce((s, r) => s + r.amount, 0);

  const coutsDirects = [
    { label: 'Matériaux (béton, acier, agglos, étanchéité)', amount: 16_800_000, pct: 53 },
    { label: 'Main d\'œuvre directe (ouvriers chantier)', amount: 5_120_000, pct: 16 },
    { label: 'Sous-traitance', amount: 6_900_000, pct: 22 },
    { label: 'Location matériel & engins', amount: 2_810_000, pct: 9 },
  ];
  const totalDirects = coutsDirects.reduce((s, c) => s + c.amount, 0);

  const coutsIndirects = [
    { label: 'Frais de chantier (base-vie, eau, élec, gardiennage)', amount: 1_240_000 },
    { label: 'Encadrement (conducteur, chef de chantier, pointeur)', amount: 980_000 },
    { label: 'Quote-part frais généraux siège', amount: 1_870_000 },
  ];
  const totalIndirects = coutsIndirects.reduce((s, c) => s + c.amount, 0);

  const totalCouts = totalDirects + totalIndirects;
  const resultat = totalRecettes - totalCouts;
  const margePct = (resultat / totalRecettes * 100).toFixed(1);

  return (
    <ReportShell onBack={onBack} code="F1" category="Finance"
      title="Compte d'exploitation par chantier"
      period="CSB-114 · Marina Casablanca Lot 3 · cumul à fin mai 2026">

      {/* Identification chantier */}
      <div style={{
        background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 4,
        padding: 14, marginBottom: 18,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        {[
          ['CHANTIER', 'CSB-114'],
          ['MAÎTRE D\'OUVRAGE', 'Al Omrane'],
          ['MONTANT MARCHÉ', '84,5 M DH HT'],
          ['AVANCEMENT', '47% physique'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 12, color: TOKENS.ink, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* I — Recettes */}
      <ReportSection num="I" title="Recettes facturées et en cours" total={totalRecettes} totalLabel="Total recettes HT">
        <ReportTable
          headers={['Désignation', 'Montant (DH HT)']}
          rows={recettes.map(r => [r.label, r.amount])}
        />
      </ReportSection>

      {/* II — Coûts directs */}
      <ReportSection num="II" title="Coûts directs" total={totalDirects} totalLabel="Total coûts directs" deltaColor>
        <ReportTable
          headers={['Désignation', 'Montant', '% direct']}
          rows={coutsDirects.map(c => [c.label, c.amount, c.pct + '%'])}
        />
      </ReportSection>

      {/* III — Coûts indirects */}
      <ReportSection num="III" title="Coûts indirects et frais généraux" total={totalIndirects} totalLabel="Total coûts indirects" deltaColor>
        <ReportTable
          headers={['Désignation', 'Montant']}
          rows={coutsIndirects.map(c => [c.label, c.amount])}
        />
      </ReportSection>

      {/* Récap résultat */}
      <div style={{
        marginTop: 24, background: TOKENS.ink, color: TOKENS.bg,
        padding: 22, borderRadius: 6,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: 999, background: `radial-gradient(circle, ${TOKENS.ocre} 0%, transparent 70%)`,
          opacity: 0.35,
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.15em', marginBottom: 12 }}>
            RÉSULTAT D'EXPLOITATION CUMULÉ
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            <RecapKpi label="Recettes" value={totalRecettes} />
            <RecapKpi label="Coûts totaux" value={totalCouts} sign="−" />
            <RecapKpi label="Résultat brut" value={resultat} big highlight />
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, letterSpacing: '0.1em', marginBottom: 6 }}>MARGE %</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, color: resultat > 0 ? TOKENS.ocre : TOKENS.red, letterSpacing: '-0.02em' }}>
                {margePct}%
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, marginTop: 4 }}>cible 14,5% · écart −1,7 pts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 28 }}>
        {[
          ['CONDUCTEUR DE TRAVAUX', 'K. Benjelloun'],
          ['DIRECTION ADMIN. & FIN.', 'Mme F. Cherqaoui'],
          ['DIRECTION GÉNÉRALE', 'M. A. Lahlou'],
        ].map(([h, w], i) => (
          <div key={i} style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 12, minHeight: 90 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 4 }}>{h}</div>
            <div style={{ fontSize: 11, color: TOKENS.ink2, marginBottom: 28 }}>{w}</div>
            <div style={{ borderTop: `1px dashed ${TOKENS.line2}`, paddingTop: 4, fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3 }}>
              Date · Visa · Signature
            </div>
          </div>
        ))}
      </div>
    </ReportShell>
  );
}

// -----------------------------------------------------------------------------
// F2 — Marge brute par chantier (prévue vs réelle)
// -----------------------------------------------------------------------------
function ReportF2({ onBack }) {
  const sites = [
    { code: 'CSB-114', name: 'Marina Casablanca Lot 3', client: 'Al Omrane', ca: 31_478_400, cost: 27_700_000, prevMarge: 14.5 },
    { code: 'RBT-208', name: 'Tramway Rabat-Salé ext.', client: 'STRS', ca: 17_040_000, cost: 14_810_000, prevMarge: 13.5 },
    { code: 'TNG-061', name: 'Port Tanger Med digue', client: 'TMSA', ca: 59_897_000, cost: 49_700_000, prevMarge: 16.0 },
    { code: 'AGD-033', name: 'Hôtel Taghazout Bay', client: 'SAPST', ca: 24_896_000, cost: 22_900_000, prevMarge: 15.0 },
    { code: 'MEK-019', name: 'Échangeur A2 PK 142', client: 'ADM', ca: 17_577_000, cost: 14_650_000, prevMarge: 14.0 },
    { code: 'CSB-098', name: 'Centre commercial Sidi Maârouf', client: 'Aksal', ca: 118_026_000, cost: 99_900_000, prevMarge: 17.0 },
  ].map(s => {
    const margin = s.ca - s.cost;
    const realMarge = (margin / s.ca) * 100;
    const ecart = realMarge - s.prevMarge;
    return { ...s, margin, realMarge, ecart };
  });
  const totals = sites.reduce((s, r) => ({
    ca: s.ca + r.ca, cost: s.cost + r.cost, margin: s.margin + r.margin,
  }), { ca: 0, cost: 0, margin: 0 });
  const totalRealMarge = (totals.margin / totals.ca) * 100;

  return (
    <ReportShell onBack={onBack} code="F2" category="Finance"
      title="Marge brute par chantier"
      period="Tous chantiers actifs · cumul à fin mai 2026">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        <SmallStat label="CHIFFRE D'AFFAIRES CUMULÉ" value={fmtMAD(totals.ca)} unit="DH HT" />
        <SmallStat label="COÛTS CUMULÉS" value={fmtMAD(totals.cost)} unit="DH HT" />
        <SmallStat label="MARGE BRUTE MOYENNE" value={totalRealMarge.toFixed(1)} unit="%" highlight />
      </div>

      <ReportSectionTitle>Analyse par chantier</ReportSectionTitle>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left')}>Code</th>
            <th style={pCell('left')}>Chantier</th>
            <th style={pCell('right')}>CA</th>
            <th style={pCell('right')}>Coût</th>
            <th style={pCell('right')}>Marge brute</th>
            <th style={pCell('center')}>Prévue / Réelle</th>
            <th style={pCell('center')}>Écart</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s, i) => (
            <tr key={s.code} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left', { fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep })}>{s.code}</td>
              <td style={pCell('left')}>{s.name}<br/><span style={{ color: TOKENS.ink3, fontSize: 8.5 }}>{s.client}</span></td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{(s.ca / 1e6).toFixed(2)} M</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{(s.cost / 1e6).toFixed(2)} M</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 500 })}>{(s.margin / 1e6).toFixed(2)} M</td>
              <td style={pCell('center', { fontFamily: 'IBM Plex Mono' })}>{s.prevMarge.toFixed(1)}% / <b>{s.realMarge.toFixed(1)}%</b></td>
              <td style={{ ...pCell('center'), fontFamily: 'IBM Plex Mono', color: s.ecart >= 0 ? TOKENS.green : TOKENS.red, fontWeight: 600 }}>
                {s.ecart > 0 ? '+' : ''}{s.ecart.toFixed(1)} pts
              </td>
            </tr>
          ))}
          <tr style={{ background: TOKENS.bgWarm, borderTop: `2px solid ${TOKENS.ink}` }}>
            <td colSpan={2} style={pCell('left', { fontWeight: 600 })}>TOTAL CONSOLIDÉ</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{(totals.ca / 1e6).toFixed(2)} M</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{(totals.cost / 1e6).toFixed(2)} M</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{(totals.margin / 1e6).toFixed(2)} M</td>
            <td style={pCell('center', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}><b>{totalRealMarge.toFixed(1)}%</b></td>
            <td style={pCell('center')}>—</td>
          </tr>
        </tbody>
      </table>

      {/* Visual chart */}
      <ReportSectionTitle style={{ marginTop: 28 }}>Visualisation graphique des marges</ReportSectionTitle>
      <div style={{ marginTop: 12 }}>
        {sites.map((s, i) => {
          const targetX = s.prevMarge * 4;
          const realX = s.realMarge * 4;
          return (
            <div key={s.code} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 10, alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep }}>{s.code}</span>
              <div style={{ position: 'relative', height: 16, background: TOKENS.bgWarm, borderRadius: 3 }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${Math.min(100, realX)}%`,
                  background: s.ecart >= 0 ? TOKENS.green : TOKENS.red,
                  borderRadius: 3,
                }} />
                <div style={{
                  position: 'absolute', left: `${targetX}%`, top: -2, bottom: -2,
                  width: 2, background: TOKENS.ink,
                }} />
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600, textAlign: 'right' }}>{s.realMarge.toFixed(1)}%</span>
            </div>
          );
        })}
        <div style={{ marginTop: 8, fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3 }}>
          Repère noir = marge prévue · barre = marge réelle · échelle 0-25%
        </div>
      </div>
    </ReportShell>
  );
}

// -----------------------------------------------------------------------------
// F3 — Situation financière globale
// -----------------------------------------------------------------------------
function ReportF3({ onBack }) {
  return (
    <ReportShell onBack={onBack} code="F3" category="Finance"
      title="Situation financière globale"
      period="Atlas Constructions S.A. · arrêté au 28 mai 2026">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {/* Trésorerie */}
        <div>
          <ReportSectionTitle>Trésorerie disponible</ReportSectionTitle>
          <ReportTable
            headers={['Compte', 'Solde DH']}
            rows={[
              ['Compte courant BMCE Bank · CCB-7841', 12_840_000],
              ['Compte courant Attijariwafa · AWB-2104', 8_920_000],
              ['Compte d\'épargne CIH · CIH-4581', 4_200_000],
              ['Petite caisse siège', 145_000],
            ]}
          />
          <ReportTotalRow label="TOTAL TRÉSORERIE" value={26_105_000} />
        </div>

        {/* Créances clients */}
        <div>
          <ReportSectionTitle>Créances clients</ReportSectionTitle>
          <ReportTable
            headers={['Tranche d\'âge', 'Encours DH']}
            rows={[
              ['0 — 30 jours', 14_200_000],
              ['30 — 60 jours', 9_800_000],
              ['60 — 90 jours', 6_400_000],
              ['> 90 jours (relance contentieux)', 12_700_000, true],
            ]}
          />
          <ReportTotalRow label="TOTAL CRÉANCES" value={43_100_000} />
        </div>

        {/* Dettes fournisseurs */}
        <div>
          <ReportSectionTitle>Dettes fournisseurs</ReportSectionTitle>
          <ReportTable
            headers={['Tranche', 'Montant DH']}
            rows={[
              ['À régler sous 30 jours', 18_400_000],
              ['À régler 30-60 jours', 11_200_000],
              ['> 60 jours', 4_100_000],
            ]}
          />
          <ReportTotalRow label="TOTAL DETTES" value={33_700_000} />
        </div>

        {/* Cautions */}
        <div>
          <ReportSectionTitle>Cautions bancaires en cours</ReportSectionTitle>
          <ReportTable
            headers={['Type', 'Montant DH']}
            rows={[
              ['Cautions provisoires', 8_400_000],
              ['Cautions définitives', 14_280_000],
              ['Retenues de garantie restituables', 18_900_000],
            ]}
          />
          <ReportTotalRow label="TOTAL ENGAGEMENTS HORS BILAN" value={41_580_000} />
        </div>
      </div>

      {/* BFR consolidé */}
      <div style={{
        marginTop: 24, padding: 20, borderRadius: 6,
        background: TOKENS.bg, border: `1px solid ${TOKENS.line}`,
      }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 10 }}>
          ANALYSE BESOIN EN FONDS DE ROULEMENT
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <SmallStat label="CRÉANCES — DETTES" value="9,4" unit="M DH" sub="BFR opérationnel" />
          <SmallStat label="TRÉSORERIE NETTE" value="26,1" unit="M DH" sub="dette nette négative" />
          <SmallStat label="DSO MOYEN" value="58" unit="jours" sub="cible 45j" />
          <SmallStat label="DPO MOYEN" value="42" unit="jours" sub="condition standard" />
        </div>
      </div>

      {/* Risques */}
      <div style={{ marginTop: 24 }}>
        <ReportSectionTitle>Points d'attention</ReportSectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {[
            { tone: 'red', text: 'Créance > 90 jours sur Commune de Sidi Bernoussi (12,7 M DH) — relance contentieux engagée.' },
            { tone: 'amber', text: 'Caution définitive CSB-114 expire dans 18 jours — renouvellement à confirmer avec BMCE Bank.' },
            { tone: 'amber', text: 'BFR en hausse de 3,2 M DH sur le trimestre — anticiper besoin de mobilisation court terme.' },
            { tone: 'green', text: 'Trésorerie nette positive de 26,1 M DH — couverture confortable 2 mois de charges.' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 10.5, color: TOKENS.ink2, lineHeight: 1.5 }}>
              <span style={{
                width: 4, alignSelf: 'stretch', borderRadius: 2,
                background: p.tone === 'red' ? TOKENS.red : p.tone === 'amber' ? TOKENS.amber : TOKENS.green,
              }} />
              <span>{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </ReportShell>
  );
}

// -----------------------------------------------------------------------------
// C8 — Dépenses & charges chantier détaillées
// -----------------------------------------------------------------------------
function ReportC8({ onBack }) {
  const postes = [
    { label: 'Béton prêt à l\'emploi (CIMAR)',     ja: 720_000, fe: 980_000, ma: 1_240_000, av: 1_180_000, mai: 1_050_000 },
    { label: 'Aciers HA (Sonasid)',                ja: 520_000, fe: 740_000, ma: 890_000,   av: 920_000,   mai: 850_000 },
    { label: 'Agglos & briques',                   ja: 180_000, fe: 220_000, ma: 280_000,   av: 310_000,   mai: 290_000 },
    { label: 'Granulats & sable',                  ja: 145_000, fe: 168_000, ma: 195_000,   av: 210_000,   mai: 180_000 },
    { label: 'Étanchéité (SOTRAVO)',               ja: 0,       fe: 0,       ma: 480_000,   av: 720_000,   mai: 612_000 },
    { label: 'Main d\'œuvre directe (ouvriers)',   ja: 380_000, fe: 420_000, ma: 540_000,   av: 580_000,   mai: 562_000 },
    { label: 'Encadrement chantier',               ja: 95_000,  fe: 95_000,  ma: 98_000,    av: 102_000,   mai: 105_000 },
    { label: 'Location engins (TIM)',              ja: 165_000, fe: 180_000, ma: 195_000,   av: 168_000,   mai: 142_000 },
    { label: 'Gasoil & carburants',                ja: 42_000,  fe: 48_000,  ma: 56_000,    av: 61_000,    mai: 58_000 },
    { label: 'Frais base-vie (eau, élec, gardien)', ja: 38_000, fe: 38_000,  ma: 42_000,    av: 45_000,    mai: 44_000 },
    { label: 'HSE & EPI',                          ja: 18_000,  fe: 12_000,  ma: 22_000,    av: 19_000,    mai: 14_000 },
  ];
  const totalLine = (p) => p.ja + p.fe + p.ma + p.av + p.mai;
  const grandTotal = postes.reduce((s, p) => s + totalLine(p), 0);
  const byMonth = ['ja', 'fe', 'ma', 'av', 'mai'].map(m => postes.reduce((s, p) => s + p[m], 0));
  const maxLine = Math.max(...postes.map(totalLine));

  return (
    <ReportShell onBack={onBack} code="C8" category="Chantier"
      title="Dépenses & charges chantier détaillées"
      period="CSB-114 · Marina Casablanca Lot 3 · janvier → mai 2026">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        <SmallStat label="DÉPENSES CUMULÉES" value={(grandTotal / 1e6).toFixed(2)} unit="M DH" />
        <SmallStat label="MOYENNE MENSUELLE" value={(grandTotal / 5 / 1e6).toFixed(2)} unit="M DH" />
        <SmallStat label="POSTE PRINCIPAL" value="BPE" sub={fmtMAD(totalLine(postes[0])) + ' DH · 28%'} />
        <SmallStat label="VS BUDGET" value="+4,2" unit="%" highlight sub="dépassement modéré" />
      </div>

      <ReportSectionTitle>Décomposition par poste · 5 derniers mois</ReportSectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 10 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left')}>Poste de dépense</th>
            <th style={pCell('right')}>Jan</th>
            <th style={pCell('right')}>Fév</th>
            <th style={pCell('right')}>Mar</th>
            <th style={pCell('right')}>Avr</th>
            <th style={pCell('right')}>Mai</th>
            <th style={pCell('right')}>Cumul</th>
            <th style={pCell('center')}>Poids</th>
          </tr>
        </thead>
        <tbody>
          {postes.map((p, i) => {
            const total = totalLine(p);
            const pct = (total / grandTotal * 100);
            const intensity = total / maxLine;
            return (
              <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
                <td style={pCell('left', { fontWeight: 500 })}>{p.label}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(p.ja)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(p.fe)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(p.ma)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(p.av)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(p.mai)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{fmtMAD(total)}</td>
                <td style={pCell('center')}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 50, height: 8, background: TOKENS.bgWarm, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${intensity * 100}%`, height: '100%', background: TOKENS.ocre }} />
                    </div>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2, width: 36, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
          <tr style={{ background: TOKENS.bgWarm, borderTop: `2px solid ${TOKENS.ink}` }}>
            <td style={pCell('left', { fontWeight: 700 })}>TOTAL MENSUEL</td>
            {byMonth.map((m, i) => <td key={i} style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(m)}</td>)}
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.ocreDeep })}>{fmtMAD(grandTotal)}</td>
            <td style={pCell('center', { fontWeight: 700 })}>100%</td>
          </tr>
        </tbody>
      </table>

      <ReportSectionTitle style={{ marginTop: 28 }}>Répartition globale des dépenses</ReportSectionTitle>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 14, background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}` }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 10 }}>TOP 5 POSTES</div>
          {postes
            .map(p => ({ ...p, total: totalLine(p) }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 8, padding: '6px 0', borderBottom: i < 4 ? `1px dashed ${TOKENS.line}` : 'none', fontSize: 10.5 }}>
                <span style={{ color: TOKENS.ink2 }}>{p.label}</span>
                <span style={{ fontFamily: 'IBM Plex Mono', textAlign: 'right', color: TOKENS.ink, fontWeight: 600 }}>{fmtMAD(p.total)}</span>
              </div>
            ))
          }
        </div>
        <div style={{ padding: 14, background: TOKENS.ink, color: TOKENS.bg, borderRadius: 6 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ocre, letterSpacing: '0.08em', marginBottom: 10 }}>EXTRACTION SYNTHÉTIQUE</div>
          <div style={{ fontSize: 10.5, lineHeight: 1.7, color: TOKENS.bg }}>
            <div>• Matériaux : <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>53,4%</b></div>
            <div>• Main d'œuvre : <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>21,8%</b></div>
            <div>• Sous-traitance : <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>13,1%</b></div>
            <div>• Matériel & location : <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>8,2%</b></div>
            <div>• Frais & charges : <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>3,5%</b></div>
          </div>
        </div>
      </div>
    </ReportShell>
  );
}

// -----------------------------------------------------------------------------
// R6 — Charges sociales mensuelles
// -----------------------------------------------------------------------------
function ReportR6({ onBack }) {
  const sites = [
    { code: 'CSB-114', name: 'Marina Casa L3',       brut: 458_000, cnssSal: 20_518, cnssPat: 41_128, amoSal: 10_350, amoPat: 8_473, ir: 38_240, form: 7_328 },
    { code: 'RBT-208', name: 'Tramway Rabat-Salé',   brut: 184_000, cnssSal: 8_243,  cnssPat: 16_523, amoSal: 4_158,  amoPat: 3_404, ir: 14_720, form: 2_944 },
    { code: 'TNG-061', name: 'Port Tanger Med',      brut: 312_000, cnssSal: 13_978, cnssPat: 28_018, amoSal: 7_051,  amoPat: 5_772, ir: 24_960, form: 4_992 },
    { code: 'AGD-033', name: 'Taghazout Bay',        brut: 268_000, cnssSal: 12_006, cnssPat: 24_066, amoSal: 6_057,  amoPat: 4_958, ir: 21_440, form: 4_288 },
    { code: 'MEK-019', name: 'Échangeur A2',         brut: 142_000, cnssSal: 6_362,  cnssPat: 12_752, amoSal: 3_209,  amoPat: 2_627, ir: 11_360, form: 2_272 },
    { code: 'CSB-098', name: 'CC Sidi Maârouf',      brut: 196_000, cnssSal: 8_781,  cnssPat: 17_601, amoSal: 4_430,  amoPat: 3_626, ir: 15_680, form: 3_136 },
    { code: 'SIEGE',   name: 'Siège — encadrement',  brut: 412_000, cnssSal: 18_458, cnssPat: 37_008, amoSal: 9_311,  amoPat: 7_622, ir: 49_440, form: 6_592 },
  ];
  const sum = (k) => sites.reduce((s, x) => s + x[k], 0);
  const totBrut = sum('brut');
  const totSal  = sum('cnssSal') + sum('amoSal') + sum('ir');
  const totPat  = sum('cnssPat') + sum('amoPat') + sum('form');
  const net     = totBrut - totSal;
  const cout    = totBrut + totPat;

  return (
    <ReportShell onBack={onBack} code="R6" category="RH & Paie"
      title="Charges sociales mensuelles"
      period="Mai 2026 · Atlas Constructions S.A. · ventilation par chantier">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        <SmallStat label="MASSE SALARIALE BRUTE" value={fmtMAD(totBrut)} unit="DH" />
        <SmallStat label="CHARGES PATRONALES" value={fmtMAD(totPat)} unit="DH" sub={`${(totPat / totBrut * 100).toFixed(1)}% du brut`} />
        <SmallStat label="RETENUES SALARIALES" value={fmtMAD(totSal)} unit="DH" sub={`${(totSal / totBrut * 100).toFixed(1)}% du brut`} />
        <SmallStat label="COÛT TOTAL EMPLOYEUR" value={fmtMAD(cout)} unit="DH" highlight />
      </div>

      <ReportSectionTitle>Ventilation par chantier</ReportSectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left')}>Chantier</th>
            <th style={pCell('right')}>Brut</th>
            <th style={pCell('right')}>CNSS sal.</th>
            <th style={pCell('right')}>CNSS pat.</th>
            <th style={pCell('right')}>AMO sal.</th>
            <th style={pCell('right')}>AMO pat.</th>
            <th style={pCell('right')}>IR</th>
            <th style={pCell('right')}>Form.</th>
            <th style={pCell('right')}>Net à payer</th>
            <th style={pCell('right')}>Coût total</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((s, i) => {
            const netS = s.brut - s.cnssSal - s.amoSal - s.ir;
            const coutS = s.brut + s.cnssPat + s.amoPat + s.form;
            return (
              <tr key={s.code} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
                <td style={pCell('left', { fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep })}>{s.code}<br/><span style={{ color: TOKENS.ink3, fontSize: 8, fontFamily: 'IBM Plex Sans' }}>{s.name}</span></td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.brut)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.cnssSal)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.cnssPat)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.amoSal)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.amoPat)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.ir)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{fmtMAD(s.form)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{fmtMAD(netS)}</td>
                <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600, color: TOKENS.ocreDeep })}>{fmtMAD(coutS)}</td>
              </tr>
            );
          })}
          <tr style={{ background: TOKENS.bgWarm, borderTop: `2px solid ${TOKENS.ink}` }}>
            <td style={pCell('left', { fontWeight: 700 })}>TOTAL CONSOLIDÉ</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(totBrut)}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(sum('cnssSal'))}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(sum('cnssPat'))}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(sum('amoSal'))}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(sum('amoPat'))}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(sum('ir'))}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(sum('form'))}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{fmtMAD(net)}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.ocreDeep })}>{fmtMAD(cout)}</td>
          </tr>
        </tbody>
      </table>

      <ReportSectionTitle style={{ marginTop: 28 }}>Échéances des règlements</ReportSectionTitle>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'CNSS — DAMANCOM', date: '08/06/2026', montant: sum('cnssSal') + sum('cnssPat'), org: 'Caisse Nationale de Sécurité Sociale' },
          { label: 'IR sur salaires',   date: '30/06/2026', montant: sum('ir'),                       org: 'Direction Générale des Impôts' },
          { label: 'Taxe formation pro', date: '30/06/2026', montant: sum('form'),                    org: 'OFPPT' },
        ].map((e, i) => (
          <div key={i} style={{ padding: 14, background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 6, borderLeft: `3px solid ${TOKENS.ocre}` }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{e.label.toUpperCase()}</div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: TOKENS.ink, marginTop: 6 }}>{fmtMAD(e.montant)} <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>DH</span></div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.red, marginTop: 6 }}>échéance {e.date}</div>
            <div style={{ fontSize: 10, color: TOKENS.ink3, marginTop: 4 }}>{e.org}</div>
          </div>
        ))}
      </div>
    </ReportShell>
  );
}

// -----------------------------------------------------------------------------
// Stub for other reports
// -----------------------------------------------------------------------------
function ReportStub({ onBack, id }) {
  return (
    <ReportShell onBack={onBack} code={id} category="—"
      title="Template en construction"
      period="">
      <div style={{ textAlign: 'center', padding: 40, color: TOKENS.ink3 }}>
        Ce template arrive bientôt. Les trois rapports financiers prioritaires (F1, F2, F3) sont disponibles.
      </div>
    </ReportShell>
  );
}

// -----------------------------------------------------------------------------
// Shared report blocks
// -----------------------------------------------------------------------------
function ReportSection({ num, title, total, totalLabel, children, deltaColor }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 4,
          background: TOKENS.ink, color: TOKENS.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 600,
        }}>{num}</span>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h3>
      </div>
      {children}
      {total != null && (
        <div style={{
          marginTop: 8, padding: '8px 12px', background: TOKENS.bg, borderRadius: 4,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderLeft: `3px solid ${deltaColor ? TOKENS.red : TOKENS.ocre}`,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{totalLabel}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600 }}>{fmtMAD(total)} DH</span>
        </div>
      )}
    </div>
  );
}

function ReportSectionTitle({ children, style }) {
  return (
    <h3 style={{
      fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, margin: 0,
      letterSpacing: '-0.01em', paddingBottom: 4,
      borderBottom: `1px solid ${TOKENS.line}`, ...style,
    }}>
      {children}
    </h3>
  );
}

function ReportTable({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 6 }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${TOKENS.line2}` }}>
          {headers.map((h, i) => (
            <th key={i} style={{
              padding: '6px 4px', textAlign: i === 0 ? 'left' : 'right',
              fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3,
              letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
            {r.map((cell, j) => {
              const isFirst = j === 0;
              const isAlert = r[r.length - 1] === true && j === 1;
              if (j === r.length - 1 && cell === true) return null;
              return (
                <td key={j} style={{
                  padding: '6px 4px',
                  textAlign: isFirst ? 'left' : 'right',
                  fontFamily: isFirst ? 'IBM Plex Sans' : 'IBM Plex Mono',
                  fontSize: isFirst ? 10.5 : 11,
                  color: isAlert ? TOKENS.red : TOKENS.ink,
                  fontWeight: isAlert ? 600 : 400,
                }}>
                  {typeof cell === 'number' ? cell.toLocaleString('fr-FR') : cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReportTotalRow({ label, value }) {
  return (
    <div style={{
      marginTop: 4, padding: '8px 12px', background: TOKENS.ink, color: TOKENS.bg,
      borderRadius: 4,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600, color: TOKENS.ocre }}>{fmtMAD(value)} DH</span>
    </div>
  );
}

function SmallStat({ label, value, unit, sub, highlight }) {
  return (
    <div style={{
      padding: 14, background: highlight ? TOKENS.ink : TOKENS.bg,
      color: highlight ? TOKENS.bg : TOKENS.ink,
      borderRadius: 4, border: `1px solid ${highlight ? TOKENS.ink : TOKENS.line}`,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5,
        color: highlight ? TOKENS.ocre : TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em',
          color: highlight ? TOKENS.bg : TOKENS.ink }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10,
          color: highlight ? TOKENS.ink4 : TOKENS.ink3 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 9.5, marginTop: 4,
        color: highlight ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </div>
  );
}

function RecapKpi({ label, value, sign, big, highlight }) {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink4, letterSpacing: '0.1em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        {sign && <span style={{ color: TOKENS.ink4, fontFamily: 'IBM Plex Mono', fontSize: 16 }}>{sign}</span>}
        <span style={{
          fontFamily: 'Manrope', fontWeight: 700,
          fontSize: big ? 28 : 20, letterSpacing: '-0.02em',
          color: highlight ? TOKENS.ocre : TOKENS.bg,
        }}>
          {fmtMAD(value)}
        </span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4 }}>DH</span>
      </div>
    </div>
  );
}

function pCell(align, extra = {}) {
  return {
    padding: '6px 6px', textAlign: align,
    fontFamily: extra.fontFamily || 'IBM Plex Sans',
    fontWeight: extra.fontWeight || 400,
    color: extra.color || 'inherit',
    fontSize: 9.5,
    letterSpacing: '0.02em',
  };
}

Object.assign(window, {
  Rapports,
  ReportShell, ReportSection, ReportSectionTitle, ReportTable, ReportTotalRow,
  SmallStat, RecapKpi, reportPCell: pCell,
});
