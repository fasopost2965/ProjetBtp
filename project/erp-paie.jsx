/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
// =============================================================================
// ERP — Paie chantier
// Cycle : Pointage clôturé → Préparation paie → Validation → Virement → CNSS
// Barèmes Maroc : CNSS 4,48 % (plaf. 6 000) · AMO 2,26 % · IR barème · CIMR cadres
// =============================================================================

(function () {
const PAIE_PERIODE = 'Mai 2026';

// Employés — alignés sur le pointage chantier (matricules cohérents)
const EMPLOYES = [
  { id: 'M-001', name: 'Karim Benjelloun',    poste: 'Conducteur de travaux', cat: 'cadre',   chantier: 'Siège',   base: 18000, hSup: 0,  hSupMt: 0,    primes: 2500, status: 'valide' },
  { id: 'M-014', name: 'Rachid Bouhsina',     poste: 'Chef de chantier',      cat: 'maitrise', chantier: 'CSB-114', base: 11000, hSup: 14, hSupMt: 1925, primes: 1800, status: 'valide' },
  { id: 'M-022', name: 'Hicham Lahlou',       poste: "Chef d'équipe G.O.",    cat: 'maitrise', chantier: 'CSB-114', base: 8500,  hSup: 9,  hSupMt: 956,  primes: 1200, status: 'valide' },
  { id: 'O-101', name: 'Mohamed Aït Hssaine', poste: 'Coffreur',              cat: 'ouvrier',  chantier: 'CSB-114', base: 5200,  hSup: 22, hSupMt: 1788, primes: 600,  status: 'valide' },
  { id: 'O-102', name: 'Said Berrada',        poste: 'Coffreur',              cat: 'ouvrier',  chantier: 'CSB-114', base: 5200,  hSup: 18, hSupMt: 1463, primes: 600,  status: 'valide' },
  { id: 'O-201', name: 'Abdelaziz Boutaleb',  poste: 'Ferrailleur',           cat: 'ouvrier',  chantier: 'CSB-114', base: 5500,  hSup: 26, hSupMt: 2234, primes: 600,  status: 'attente' },
  { id: 'O-202', name: 'Khalid Mouline',      poste: 'Ferrailleur',           cat: 'ouvrier',  chantier: 'CSB-114', base: 5500,  hSup: 24, hSupMt: 2063, primes: 600,  status: 'attente' },
  { id: 'O-301', name: 'Rachid Bennani',      poste: 'Maçon',                 cat: 'ouvrier',  chantier: 'RBT-208', base: 4900,  hSup: 6,  hSupMt: 460,  primes: 800,  status: 'attente' },
  { id: 'O-302', name: 'Lhoucine Amrani',     poste: 'Maçon',                 cat: 'ouvrier',  chantier: 'RBT-208', base: 4900,  hSup: 4,  hSupMt: 307,  primes: 800,  status: 'attente' },
  { id: 'O-401', name: 'Hassan Touimi',       poste: 'Manœuvre',              cat: 'ouvrier',  chantier: 'TNG-061', base: 3200,  hSup: 0,  hSupMt: 0,    primes: 700,  status: 'attente' },
  { id: 'O-402', name: 'Najib Rachidi',       poste: 'Manœuvre',              cat: 'ouvrier',  chantier: 'TNG-061', base: 3200,  hSup: 0,  hSupMt: 0,    primes: 700,  status: 'attente' },
  { id: 'O-501', name: 'Abdellah Chikhi',     poste: 'Grutier',               cat: 'ouvrier',  chantier: 'CSB-114', base: 7200,  hSup: 8,  hSupMt: 738,  primes: 900,  status: 'attente' },
];

const CAT_LABELS = {
  cadre:    { label: 'Cadre',     tone: 'blue'  },
  maitrise: { label: 'Maîtrise',  tone: 'ocre'  },
  ouvrier:  { label: 'Ouvrier',   tone: 'neutral' },
};

// Calcul d'un bulletin
function calcBulletin(e) {
  const brut = e.base + e.hSupMt + e.primes;
  const plafCNSS = Math.min(brut, 6000);
  const cnss = plafCNSS * 0.0448;       // part salariale
  const amo = brut * 0.0226;
  const cimr = e.cat === 'cadre' ? brut * 0.03 : 0;
  const fraisPro = Math.min(brut * 0.20, 2500);
  const netImposable = brut - cnss - amo - cimr - fraisPro;
  // IR barème mensuel simplifié Maroc 2026
  let ir = 0;
  const ni = netImposable;
  if (ni > 15000) ir = ni * 0.38 - 3333;
  else if (ni > 6667) ir = ni * 0.34 - 2333;
  else if (ni > 5000) ir = ni * 0.30 - 1500;
  else if (ni > 4166) ir = ni * 0.20 - 833;
  else if (ni > 2500) ir = ni * 0.10 - 250;
  ir = Math.max(0, ir);
  const retenues = cnss + amo + cimr + ir;
  const net = brut - retenues;
  // charges patronales
  const cnssPatr = plafCNSS * 0.0898 + brut * 0.0185 + brut * 0.016; // CNSS + AMO patr + formation/PF approximé
  return { brut, cnss, amo, cimr, ir, fraisPro, netImposable, retenues, net, cnssPatr };
}

// -----------------------------------------------------------------------------
function Paie() {
  const [tab, setTab] = React.useState('bulletins'); // bulletins | cnss | charges
  const [selected, setSelected] = React.useState(null);

  const bulletins = EMPLOYES.map(e => ({ ...e, ...calcBulletin(e) }));
  const masseBrut = bulletins.reduce((s, b) => s + b.brut, 0);
  const masseNet  = bulletins.reduce((s, b) => s + b.net, 0);
  const totalCharges = bulletins.reduce((s, b) => s + b.cnssPatr, 0);
  const totalRetenues = bulletins.reduce((s, b) => s + b.retenues, 0);
  const nbValide = bulletins.filter(b => b.status === 'valide').length;
  const coutTotal = masseBrut + totalCharges;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <Header periode={PAIE_PERIODE} nbValide={nbValide} total={bulletins.length} />

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <PaieKpi label="MASSE SALARIALE BRUTE" value={fmtMAD(masseBrut)} unit="DH" sub={`${bulletins.length} salariés · ${PAIE_PERIODE}`} delay={60} tone="ink" />
        <PaieKpi label="NET À PAYER" value={fmtMAD(masseNet)} unit="DH" sub="à virer le 30/05" delay={120} tone="green" />
        <PaieKpi label="CHARGES PATRONALES" value={fmtMAD(totalCharges)} unit="DH" sub="CNSS · AMO · taxe form." delay={180} tone="amber" />
        <PaieKpi label="COÛT EMPLOYEUR TOTAL" value={fmtMAD(coutTotal)} unit="DH" sub="brut + charges patronales" delay={240} />
      </div>

      {/* Progress de validation */}
      <Card delay={300} padding={0}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>
                Préparation de la paie — {PAIE_PERIODE}
              </h3>
              <Pill tone={nbValide === bulletins.length ? 'green' : 'amber'} dot>
                {nbValide} / {bulletins.length} bulletins validés
              </Pill>
            </div>
            <Progress value={(nbValide / bulletins.length) * 100} tone="ocre" height={6} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => { window.location.hash = 'pointage'; setTimeout(() => window.toast('Heures pointées importées · 212 salariés', 'success', 'Période 01-31 mai 2026'), 400); }} icon={<Icon name="refresh" size={13} stroke={TOKENS.ink2} />}>Importer pointages</Button>
            <Button onClick={() => window.toast('Bulletins validés · virement programmé 30/05', 'success', `${bulletins.length} bulletins · ${fmtMAD(masseNet)} DH`)} variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Valider tout &amp; virer</Button>
          </div>
        </div>
        {/* étapes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderTop: `1px solid ${TOKENS.line}` }}>
          {[
            ['Pointages clôturés', 'check', 'done'],
            ['Heures supp. calculées', 'check', 'done'],
            ['Bulletins générés', 'check', 'done'],
            ['Validation direction', 'clock', 'wip'],
            ['Virement & DAMANCOM', 'arrowRight', 'todo'],
          ].map(([label, icon, st], i) => (
            <div key={i} style={{
              padding: '14px 16px',
              borderRight: i < 4 ? `1px solid ${TOKENS.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 999, flexShrink: 0,
                background: st === 'done' ? TOKENS.greenSoft : st === 'wip' ? TOKENS.amberSoft : TOKENS.bgWarm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={icon} size={12}
                  stroke={st === 'done' ? TOKENS.green : st === 'wip' ? TOKENS.amber : TOKENS.ink4}
                  strokeWidth={2.4} />
              </span>
              <span style={{ fontSize: 11.5, color: st === 'todo' ? TOKENS.ink4 : TOKENS.ink2, lineHeight: 1.3 }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${TOKENS.line}` }} className="erp-fade-in">
        {[
          ['bulletins', `Bulletins (${bulletins.length})`],
          ['charges', 'Charges & cotisations'],
          ['cnss', 'Déclaration CNSS'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); setSelected(null); }} style={tabStyle(tab === id)}>{label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0,1fr) minmax(0,360px)' : '1fr', gap: 16 }}>
        <div>
          {tab === 'bulletins' && <Bulletins rows={bulletins} selected={selected} onSelect={setSelected} />}
          {tab === 'charges'   && <ChargesView rows={bulletins} totalRetenues={totalRetenues} totalCharges={totalCharges} />}
          {tab === 'cnss'      && <CnssView rows={bulletins} />}
        </div>
        {selected && <BulletinDetail b={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function Header({ periode, nbValide, total }) {
  return (
    <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
          PAIE CHANTIER · {periode.toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
          Bulletins &amp; cotisations sociales
        </h1>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
          Alimentée par les pointages clôturés · échéance virement le 30 du mois
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Journal de paie</Button>
        <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Ordre de virement</Button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function PaieKpi({ label, value, unit, sub, tone, delay }) {
  const dark = tone === 'ink';
  const colors = { green: TOKENS.green, amber: TOKENS.amber };
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
function Bulletins({ rows, selected, onSelect }) {
  return (
    <Card padding={0} delay={380}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 130px 110px 120px 130px',
        padding: '11px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Salarié</span>
        <span style={{ textAlign: 'right' }}>Brut</span>
        <span style={{ textAlign: 'right' }}>Retenues</span>
        <span style={{ textAlign: 'right' }}>Net à payer</span>
        <span style={{ textAlign: 'right' }}>Statut</span>
      </div>
      {rows.map((b, i) => {
        const isSel = selected?.id === b.id;
        const cat = CAT_LABELS[b.cat];
        return (
          <button key={b.id} onClick={() => onSelect(b)} className="erp-row" style={{
            width: '100%', textAlign: 'left', border: 'none',
            background: isSel ? TOKENS.bgWarm : 'transparent',
            borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            borderLeft: isSel ? `3px solid ${TOKENS.ocreDeep}` : '3px solid transparent',
            padding: '13px 20px', cursor: 'pointer',
            display: 'grid', gridTemplateColumns: '1fr 130px 110px 120px 130px', gap: 12, alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, flexShrink: 0,
                background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Manrope', fontWeight: 700, fontSize: 11,
              }}>{b.name.split(' ').slice(0, 2).map(p => p[0]).join('')}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500 }}>{b.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>{b.id}</span>
                  <span style={{ color: TOKENS.line2 }}>·</span>
                  <span style={{ fontSize: 11, color: TOKENS.ink3 }}>{b.poste}</span>
                  <Pill tone={cat.tone}>{cat.label}</Pill>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink2 }}>
              {b.brut.toLocaleString('fr-FR')}
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.red }}>
              −{Math.round(b.retenues).toLocaleString('fr-FR')}
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13.5, color: TOKENS.ink, fontWeight: 600 }}>
              {Math.round(b.net).toLocaleString('fr-FR')}
            </div>
            <div style={{ textAlign: 'right' }}>
              <Pill tone={b.status === 'valide' ? 'green' : 'amber'} dot>
                {b.status === 'valide' ? 'Validé' : 'À valider'}
              </Pill>
            </div>
          </button>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function ChargesView({ rows, totalRetenues, totalCharges }) {
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0);
  const lignes = [
    { label: 'CNSS — part salariale', taux: '4,48 %', base: 'plaf. 6 000 DH', mt: sum('cnss'), part: 'sal' },
    { label: 'AMO — part salariale', taux: '2,26 %', base: 'salaire brut', mt: sum('amo'), part: 'sal' },
    { label: 'CIMR (cadres)', taux: '3,00 %', base: 'cadres uniquement', mt: sum('cimr'), part: 'sal' },
    { label: 'IR — impôt sur le revenu', taux: 'barème', base: 'net imposable', mt: sum('ir'), part: 'sal' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Card padding={0} delay={380}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Retenues salariales</h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.red, fontWeight: 500 }}>−{fmtMAD(totalRetenues)} DH</span>
        </div>
        {lignes.map((l, i) => (
          <div key={l.label} className="erp-row" style={{
            padding: '13px 20px', borderBottom: i < lignes.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            display: 'grid', gridTemplateColumns: '1fr 100px 160px 140px', gap: 12, alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{l.label}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ocreDeep }}>{l.taux}</span>
            <span style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{l.base}</span>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink, fontWeight: 600 }}>{fmtMAD(l.mt)} DH</span>
          </div>
        ))}
      </Card>

      <Card delay={440} style={{ background: TOKENS.ink, borderColor: TOKENS.ink, color: TOKENS.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.12em', marginBottom: 6 }}>
            CHARGES PATRONALES À VERSER
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 16, fontWeight: 600 }}>
            CNSS · AMO · taxe de formation professionnelle · prestations familiales
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink4, marginTop: 6 }}>
            Déclaration DAMANCOM avant le 10 juin 2026
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 30, color: TOKENS.ocre, letterSpacing: '-0.025em', lineHeight: 1 }}>
            {fmtMAD(totalCharges)}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink4, marginTop: 4 }}>DH · part employeur</div>
        </div>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
function CnssView({ rows }) {
  const totalBrut = rows.reduce((s, r) => s + r.brut, 0);
  const totalPlaf = rows.reduce((s, r) => s + Math.min(r.brut, 6000), 0);
  return (
    <Card padding={0} delay={380}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, background: TOKENS.bg, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="shield" size={16} stroke={TOKENS.ocreDeep} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Bordereau de déclaration CNSS</h3>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 3 }}>
            Affiliation 7785402 · télédéclaration DAMANCOM · période {PAIE_PERIODE}
          </div>
        </div>
        <Button size="sm" variant="primary" icon={<Icon name="arrowUp" size={12} stroke={TOKENS.bg} />}>Télédéclarer</Button>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 90px 130px 140px 130px',
        padding: '10px 20px', borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Salarié</span>
        <span style={{ textAlign: 'right' }}>Jours</span>
        <span style={{ textAlign: 'right' }}>Salaire brut</span>
        <span style={{ textAlign: 'right' }}>Base plafonnée</span>
        <span style={{ textAlign: 'right' }}>Cotisation</span>
      </div>
      {rows.map((b, i) => (
        <div key={b.id} className="erp-row" style={{
          display: 'grid', gridTemplateColumns: '1fr 90px 130px 140px 130px',
          padding: '11px 20px', borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{b.id}</span>
            <span style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{b.name}</span>
          </div>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>26</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>{b.brut.toLocaleString('fr-FR')}</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>{Math.min(b.brut, 6000).toLocaleString('fr-FR')}</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink, fontWeight: 600 }}>{Math.round(Math.min(b.brut, 6000) * 0.0448).toLocaleString('fr-FR')}</span>
        </div>
      ))}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 90px 130px 140px 130px',
        padding: '13px 20px', background: TOKENS.bgWarm, alignItems: 'center',
        fontFamily: 'IBM Plex Mono', fontWeight: 500,
      }}>
        <span style={{ fontSize: 11.5, color: TOKENS.ink, letterSpacing: '0.04em' }}>TOTAL — {rows.length} salariés</span>
        <span></span>
        <span style={{ textAlign: 'right', fontSize: 12, color: TOKENS.ink }}>{totalBrut.toLocaleString('fr-FR')}</span>
        <span style={{ textAlign: 'right', fontSize: 12, color: TOKENS.ink }}>{totalPlaf.toLocaleString('fr-FR')}</span>
        <span style={{ textAlign: 'right', fontSize: 13, color: TOKENS.ocreDeep }}>{Math.round(totalPlaf * 0.0448).toLocaleString('fr-FR')}</span>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function BulletinDetail({ b, onClose }) {
  const cat = CAT_LABELS[b.cat];
  const Line = ({ k, v, neg, strong, accent }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', gap: 12,
      borderTop: strong ? `1px solid ${TOKENS.line2}` : 'none', marginTop: strong ? 4 : 0, paddingTop: strong ? 9 : 5 }}>
      <span style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{k}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: strong ? 13.5 : 12,
        color: accent || (neg ? TOKENS.red : TOKENS.ink), fontWeight: strong ? 700 : 400 }}>
        {neg ? '−' : ''}{Math.round(v).toLocaleString('fr-FR')}
      </span>
    </div>
  );
  return (
    <Card padding={0} delay={420} style={{ alignSelf: 'flex-start', position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${TOKENS.line}`, background: TOKENS.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: TOKENS.ocreSoft, color: TOKENS.ocreDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 12 }}>
            {b.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
          </div>
          <div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink }}>{b.name}</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>{b.id} · {b.poste}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TOKENS.ink3, padding: 4 }}>
          <Icon name="x" size={14} />
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Pill tone={cat.tone}>{cat.label}</Pill>
          <Pill tone="neutral" mono>{b.chantier}</Pill>
          <Pill tone={b.status === 'valide' ? 'green' : 'amber'} dot>{b.status === 'valide' ? 'Validé' : 'À valider'}</Pill>
        </div>

        <div style={{ padding: 12, background: TOKENS.bgWarm, borderRadius: 6 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 4 }}>GAINS</div>
          <Line k="Salaire de base" v={b.base} />
          <Line k={`Heures supp. (${b.hSup} h × 1,25)`} v={b.hSupMt} />
          <Line k="Primes (panier, transport)" v={b.primes} />
          <Line k="Salaire brut" v={b.brut} strong />
        </div>

        <div style={{ padding: 12, background: TOKENS.redSoft, borderRadius: 6, marginTop: 10 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.red, letterSpacing: '0.1em', marginBottom: 4 }}>RETENUES</div>
          <Line k="CNSS 4,48 %" v={b.cnss} neg />
          <Line k="AMO 2,26 %" v={b.amo} neg />
          {b.cimr > 0 && <Line k="CIMR 3 %" v={b.cimr} neg />}
          <Line k="IR (barème)" v={b.ir} neg />
          <Line k="Total retenues" v={b.retenues} neg strong />
        </div>

        <div style={{ padding: '14px 16px', background: TOKENS.ink, borderRadius: 6, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: TOKENS.bg, fontWeight: 500 }}>Net à payer</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.ocre, letterSpacing: '-0.02em' }}>
            {Math.round(b.net).toLocaleString('fr-FR')} <span style={{ fontSize: 11, color: TOKENS.ink4, fontFamily: 'IBM Plex Mono' }}>DH</span>
          </span>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {b.status !== 'valide' && <Button variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Valider le bulletin</Button>}
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Bulletin PDF</Button>
        </div>
      </div>
    </Card>
  );
}

function tabStyle(active) {
  return {
    padding: '10px 16px', background: 'transparent', border: 'none',
    borderBottom: `2px solid ${active ? TOKENS.ink : 'transparent'}`,
    color: active ? TOKENS.ink : TOKENS.ink3, cursor: 'pointer',
    fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: -1,
  };
}

Object.assign(window, { Paie });
})();
