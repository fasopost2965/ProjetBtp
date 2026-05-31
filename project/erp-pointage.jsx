/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, Stat, fmtMAD */
// =============================================================================
// ERP — Pointage quotidien (terrain)
// Saisie des présences ouvriers, heures normales + supp, par chantier
// =============================================================================

const POINTAGE_SITES = [
  { code: 'CSB-114', name: 'Marina Casablanca Lot 3', city: 'Casablanca', total: 150 },
  { code: 'RBT-208', name: 'Tramway Rabat-Salé',      city: 'Rabat',      total: 60 },
  { code: 'TNG-061', name: 'Port Tanger Med',          city: 'Tanger',     total: 90 },
  { code: 'AGD-033', name: 'Hôtel Taghazout Bay',      city: 'Agadir',     total: 90 },
  { code: 'MEK-019', name: 'Échangeur A2 PK 142',      city: 'Meknès',     total: 46 },
];

// Equipe sur CSB-114
const TEAM_CSB114 = [
  // Encadrement
  { id: 'M-001', name: 'Karim Benjelloun', poste: 'Conducteur travaux', metier: 'encadr', salaire: 0, present: true, h: 9, hSup: 0 },
  { id: 'M-014', name: 'Rachid Bouhsina', poste: 'Chef de chantier', metier: 'encadr', salaire: 0, present: true, h: 10, hSup: 1 },
  { id: 'M-022', name: 'Hicham Lahlou', poste: 'Chef d\'équipe gros œuvre', metier: 'encadr', salaire: 0, present: true, h: 9, hSup: 0 },
  // Coffreurs
  { id: 'O-101', name: 'Mohamed Aït Hssaine', poste: 'Coffreur', metier: 'coffrage', salaire: 95, present: true, h: 9, hSup: 1 },
  { id: 'O-102', name: 'Said Berrada', poste: 'Coffreur', metier: 'coffrage', salaire: 95, present: true, h: 9, hSup: 1 },
  { id: 'O-103', name: 'Younes El Idrissi', poste: 'Coffreur', metier: 'coffrage', salaire: 95, present: true, h: 9, hSup: 0 },
  { id: 'O-104', name: 'Brahim Ouazzani', poste: 'Aide coffreur', metier: 'coffrage', salaire: 70, present: true, h: 9, hSup: 0 },
  { id: 'O-105', name: 'Driss Tahiri', poste: 'Aide coffreur', metier: 'coffrage', salaire: 70, present: false, h: 0, hSup: 0, motif: 'maladie' },
  // Ferrailleurs
  { id: 'O-201', name: 'Abdelaziz Boutaleb', poste: 'Ferrailleur', metier: 'ferraillage', salaire: 100, present: true, h: 9, hSup: 2 },
  { id: 'O-202', name: 'Khalid Mouline', poste: 'Ferrailleur', metier: 'ferraillage', salaire: 100, present: true, h: 9, hSup: 2 },
  { id: 'O-203', name: 'Omar Benkirane', poste: 'Ferrailleur', metier: 'ferraillage', salaire: 100, present: true, h: 9, hSup: 1 },
  { id: 'O-204', name: 'Issam Ghazali', poste: 'Aide ferrailleur', metier: 'ferraillage', salaire: 70, present: true, h: 9, hSup: 1 },
  { id: 'O-205', name: 'Hamid Sebti', poste: 'Aide ferrailleur', metier: 'ferraillage', salaire: 70, present: false, h: 0, hSup: 0, motif: 'congé' },
  // Maçons
  { id: 'O-301', name: 'Rachid Bennani', poste: 'Maçon', metier: 'maconnerie', salaire: 90, present: true, h: 9, hSup: 0 },
  { id: 'O-302', name: 'Lhoucine Amrani', poste: 'Maçon', metier: 'maconnerie', salaire: 90, present: true, h: 9, hSup: 0 },
  { id: 'O-303', name: 'Mustapha Chraibi', poste: 'Maçon', metier: 'maconnerie', salaire: 90, present: true, h: 9, hSup: 0 },
  { id: 'O-304', name: 'Aziz Berrada', poste: 'Aide maçon', metier: 'maconnerie', salaire: 65, present: false, h: 0, hSup: 0, motif: 'absent injustifié' },
  // Manœuvres
  { id: 'O-401', name: 'Hassan Touimi', poste: 'Manœuvre', metier: 'manoeuvre', salaire: 55, present: true, h: 9, hSup: 0 },
  { id: 'O-402', name: 'Najib Rachidi', poste: 'Manœuvre', metier: 'manoeuvre', salaire: 55, present: true, h: 9, hSup: 0 },
  { id: 'O-403', name: 'Tarik Filali', poste: 'Manœuvre', metier: 'manoeuvre', salaire: 55, present: true, h: 9, hSup: 0 },
  // Conducteur engin
  { id: 'O-501', name: 'Abdellah Chikhi', poste: 'Conducteur grue à tour', metier: 'engin', salaire: 130, present: true, h: 9, hSup: 1 },
  { id: 'O-502', name: 'Said Bakkali', poste: 'Conducteur pelle', metier: 'engin', salaire: 110, present: true, h: 9, hSup: 1 },
];

const METIER_LABELS = {
  encadr:     { label: 'Encadrement',        color: TOKENS.blue   },
  coffrage:   { label: 'Coffrage',           color: TOKENS.ocre   },
  ferraillage:{ label: 'Ferraillage',        color: TOKENS.ocreDeep },
  maconnerie: { label: 'Maçonnerie',         color: TOKENS.amber  },
  manoeuvre:  { label: 'Manœuvres',          color: TOKENS.ink3   },
  engin:      { label: 'Conducteurs d\'engins', color: TOKENS.green },
};

// Motifs d'absence saisissables (refonte UX — saisie réelle du motif)
const MOTIFS = ['maladie', 'congé', 'absent injustifié', 'accident travail'];

// -----------------------------------------------------------------------------
function Pointage() {
  const [siteCode, setSiteCode] = React.useState('CSB-114');
  const [date, setDate]         = React.useState('Jeudi 28 mai 2026');
  const [team, setTeam]         = React.useState(TEAM_CSB114);
  const [filter, setFilter]     = React.useState('all'); // all | present | absent | metier
  const [activeMetier, setActiveMetier] = React.useState(null);
  const [locked, setLocked]     = React.useState(false);

  const site = POINTAGE_SITES.find(s => s.code === siteCode);
  const bp = window.useBreakpoint ? window.useBreakpoint() : { mobile: false, tablet: false, desktop: true };

  const toggle = (id) => {
    if (locked) return;
    setTeam(t => t.map(o => o.id === id ? { ...o, present: !o.present, h: !o.present ? 9 : 0, hSup: !o.present ? 0 : 0, motif: !o.present ? null : 'maladie' } : o));
  };
  const updateH = (id, key, value) => {
    if (locked) return;
    setTeam(t => t.map(o => o.id === id ? { ...o, [key]: Math.max(0, +value || 0) } : o));
  };
  const setMotif = (id, motif) => {
    if (locked) return;
    setTeam(t => t.map(o => o.id === id ? { ...o, motif } : o));
  };

  // Filtering
  let visible = team;
  if (filter === 'present') visible = team.filter(o => o.present);
  if (filter === 'absent')  visible = team.filter(o => !o.present);
  if (filter === 'metier' && activeMetier) visible = team.filter(o => o.metier === activeMetier);

  // KPIs
  const present = team.filter(o => o.present).length;
  const absent  = team.length - present;
  const tauxAbsent = ((absent / team.length) * 100).toFixed(1);
  const hTotalN = team.reduce((s, o) => s + o.h, 0);
  const hTotalS = team.reduce((s, o) => s + o.hSup, 0);
  const coutJour = team.reduce((s, o) => s + (o.h * o.salaire) + (o.hSup * o.salaire * 1.25), 0);

  // Refonte UX — sur mobile/tablette, vue terrain simplifiée (présence par défaut)
  if (bp.mobile) {
    return (
      <MobilePointage
        site={site} date={date} team={team} present={present} absent={absent}
        locked={locked} onToggle={toggle} onMotif={setMotif} onLock={() => setLocked(true)} onUnlock={() => setLocked(false)}
      />
    );
  }

  // Group by métier
  const grouped = {};
  for (const m of Object.keys(METIER_LABELS)) {
    const list = visible.filter(o => o.metier === m);
    if (list.length) grouped[m] = list;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            POINTAGE QUOTIDIEN · OUVRIERS CHANTIER
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Pointage du jour <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· {date}</span>
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6, letterSpacing: '0.02em' }}>
            Saisie par le chef de chantier · à clôturer avant 18h00
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Historique</Button>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Exporter BDS</Button>
          {locked ? (
            <Button variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />} onClick={() => setLocked(false)}>
              Pointage clôturé
            </Button>
          ) : (
            <Button variant="primary" iconRight={<Icon name="arrowRight" size={13} stroke={TOKENS.bg} />} onClick={() => setLocked(true)}>
              Clôturer le pointage
            </Button>
          )}
        </div>
      </div>

      {/* Site selector + date */}
      <Card padding={0} delay={60}>
        <div style={{
          padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em' }}>
              CHANTIER
            </span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {POINTAGE_SITES.map(s => (
                <button key={s.code} onClick={() => setSiteCode(s.code)} style={{
                  padding: '6px 11px', borderRadius: 5, cursor: 'pointer',
                  background: siteCode === s.code ? TOKENS.ink : TOKENS.bgWarm,
                  color: siteCode === s.code ? TOKENS.bg : TOKENS.ink2,
                  border: `1px solid ${siteCode === s.code ? TOKENS.ink : 'transparent'}`,
                  fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10,
                    color: siteCode === s.code ? TOKENS.ocre : TOKENS.ocreDeep }}>{s.code}</span>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <DateSelector value={date} onChange={setDate} />
        </div>
      </Card>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <KpiCount label="EFFECTIF DU JOUR" value={team.length} unit="ouvriers" delay={120}
          sub={`sur ${site.total} affectés au chantier`} />
        <KpiCount label="PRÉSENTS" value={present} unit="" delay={180} tone="green"
          sub={`${((present / team.length) * 100).toFixed(0)}% de l'équipe`} />
        <KpiCount label="ABSENTS" value={absent} unit="" delay={240} tone={absent > team.length * 0.15 ? 'red' : 'amber'}
          sub={`taux ${tauxAbsent}%`} />
        <KpiCount label="HEURES PRESTÉES" value={hTotalN} unit={`h + ${hTotalS} h sup`} delay={300}
          sub={`${(hTotalN + hTotalS).toFixed(0)} h totales`} />
        <KpiCount label="COÛT DE LA JOURNÉE" value={fmtMAD(coutJour)} unit="DH" delay={360} tone="ink"
          sub="MO directe HT" />
      </div>

      {/* Filter chips — refonte UX : filtres métier retirés de la saisie (usage RH only) */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            ['all', 'Tous'],
            ['present', `Présents · ${present}`],
            ['absent', `Absents · ${absent}`],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: '7px 12px', borderRadius: 5, cursor: 'pointer',
              background: filter === id ? TOKENS.ink : TOKENS.bgWarm,
              color: filter === id ? TOKENS.bg : TOKENS.ink2,
              border: 'none', fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Team grouped by métier */}
      {locked && <LockedBanner onUnlock={() => setLocked(false)} />}
      {Object.entries(grouped).map(([metier, list], gi) => (
        <Card key={metier} padding={0} delay={400 + gi * 60}>
          <div style={{
            padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`,
            display: 'flex', alignItems: 'center', gap: 10,
            background: TOKENS.bg,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: METIER_LABELS[metier].color }} />
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0, letterSpacing: '-0.005em' }}>
              {METIER_LABELS[metier].label}
            </h3>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
              {list.filter(o => o.present).length} / {list.length} présents
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>
              {list.reduce((s, o) => s + o.h + o.hSup, 0)} h prestées · {fmtMAD(list.reduce((s, o) => s + o.h * o.salaire + o.hSup * o.salaire * 1.25, 0))} DH
            </span>
          </div>

          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '80px 1fr 180px 100px 130px 130px 130px',
            padding: '10px 20px', background: TOKENS.paper, borderBottom: `1px solid ${TOKENS.line}`,
            fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <span>Matric.</span>
            <span>Ouvrier</span>
            <span>Poste</span>
            <span style={{ textAlign: 'center' }}>Présent</span>
            <span style={{ textAlign: 'right' }}>Heures (8h base)</span>
            <span style={{ textAlign: 'right' }}>Sup ×1,25</span>
            <span style={{ textAlign: 'right' }}>Coût jour DH</span>
          </div>

          {list.map((o, i) => {
            const isAbs = !o.present;
            const cout = o.h * o.salaire + o.hSup * o.salaire * 1.25;
            return (
              <div key={o.id} className="erp-row" style={{
                display: 'grid', gridTemplateColumns: '80px 1fr 180px 100px 130px 130px 130px',
                padding: '12px 20px',
                borderBottom: i < list.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
                alignItems: 'center', opacity: isAbs ? 0.55 : 1,
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{o.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                    background: METIER_LABELS[o.metier].color, color: TOKENS.paper,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Manrope', fontWeight: 700, fontSize: 10.5,
                  }}>
                    {o.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{o.name}</div>
                    {isAbs && o.motif && (
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.red, marginTop: 2 }}>
                        motif : {o.motif}
                      </div>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: TOKENS.ink2 }}>{o.poste}</span>

                {/* Presence toggle */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button onClick={() => toggle(o.id)} disabled={locked} style={{
                    width: 50, height: 26, borderRadius: 999,
                    background: o.present ? TOKENS.green : TOKENS.line2,
                    border: 'none', position: 'relative', cursor: locked ? 'not-allowed' : 'pointer',
                    padding: 0, transition: 'background 160ms ease',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: o.present ? 26 : 3,
                      width: 20, height: 20, borderRadius: 999,
                      background: TOKENS.paper, transition: 'left 160ms ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {o.present ? <Icon name="check" size={11} stroke={TOKENS.green} strokeWidth={2.5} /> : <Icon name="x" size={11} stroke={TOKENS.ink3} strokeWidth={2.5} />}
                    </span>
                  </button>
                </div>

                {/* Hours */}
                <input type="number" min={0} max={12} disabled={!o.present || locked}
                  value={o.h} onChange={e => updateH(o.id, 'h', e.target.value)}
                  style={hourInputStyle(o.h > 0)} />
                <input type="number" min={0} max={6} disabled={!o.present || locked}
                  value={o.hSup} onChange={e => updateH(o.id, 'hSup', e.target.value)}
                  style={hourInputStyle(o.hSup > 0, 'ocre')} />

                <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5,
                  color: cout > 0 ? TOKENS.ink : TOKENS.ink4, fontWeight: cout > 0 ? 500 : 400 }}>
                  {cout > 0 ? cout.toFixed(0) : '—'}
                </span>
              </div>
            );
          })}
        </Card>
      ))}

      {/* Total footer */}
      <Card delay={700} style={{
        background: TOKENS.ink, color: TOKENS.bg, borderColor: TOKENS.ink,
        display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 32, alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.12em', marginBottom: 6 }}>
            TOTAL POINTAGE — {siteCode} — {date}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 17, fontWeight: 600 }}>
            {present} ouvriers présents · {hTotalN + hTotalS} heures prestées
          </div>
        </div>
        <FooterStat label="Heures normales" value={hTotalN} unit="h" />
        <FooterStat label="Heures supp." value={hTotalS} unit="h" />
        <FooterStat label="Coût total HT" value={fmtMAD(coutJour)} unit="DH" big />
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
function hourInputStyle(active, tone) {
  return {
    height: 30, padding: '0 10px',
    border: `1px solid ${active ? (tone === 'ocre' ? TOKENS.ocre : TOKENS.line2) : TOKENS.line2}`,
    background: active ? (tone === 'ocre' ? TOKENS.ocreSoft : TOKENS.paper) : TOKENS.bg,
    borderRadius: 4, fontFamily: 'IBM Plex Mono', fontSize: 12.5,
    color: active ? (tone === 'ocre' ? TOKENS.ocreDeep : TOKENS.ink) : TOKENS.ink4,
    fontWeight: active ? 500 : 400,
    textAlign: 'right', outline: 'none', width: '100%',
    marginLeft: 'auto', display: 'block',
  };
}

// -----------------------------------------------------------------------------
function KpiCount({ label, value, unit, sub, tone, delay }) {
  const dark = tone === 'ink';
  const accentMap = { green: TOKENS.green, red: TOKENS.red, amber: TOKENS.amber, ink: TOKENS.ocre };
  const accent = accentMap[tone] || TOKENS.ink3;
  return (
    <Card delay={delay} padding={16} style={{
      background: dark ? TOKENS.ink : TOKENS.paper,
      borderColor: dark ? TOKENS.ink : TOKENS.line,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5,
        color: dark ? TOKENS.ocre : accent, letterSpacing: '0.12em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em',
          color: dark ? TOKENS.bg : TOKENS.ink, lineHeight: 1 }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5,
          color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 10.5, marginTop: 6,
        color: dark ? TOKENS.ink4 : TOKENS.ink3 }}>{sub}</div>}
    </Card>
  );
}

function FooterStat({ label, value, unit, big }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink4, letterSpacing: '0.1em', marginBottom: 4 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: big ? 24 : 18,
          color: big ? TOKENS.ocre : TOKENS.bg, letterSpacing: '-0.02em' }}>
          {value}
        </span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4 }}>{unit}</span>
      </div>
    </div>
  );
}

function DateSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button className="erp-pill-btn" style={pillBtn}>
        <Icon name="chevronDown" size={11} stroke={TOKENS.ink3} style={{ transform: 'rotate(90deg)' }} />
      </button>
      <div style={{
        padding: '7px 14px', background: TOKENS.bgWarm, borderRadius: 5,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'IBM Plex Sans', fontSize: 12.5, fontWeight: 500, color: TOKENS.ink,
      }}>
        <Icon name="clock" size={13} stroke={TOKENS.ocreDeep} />
        {value}
      </div>
      <button className="erp-pill-btn" style={pillBtn}>
        <Icon name="chevronRight" size={11} stroke={TOKENS.ink3} />
      </button>
    </div>
  );
}

const pillBtn = {
  width: 28, height: 28, borderRadius: 5,
  background: TOKENS.bgWarm, border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function LockedBanner({ onUnlock }) {
  return (
    <div className="erp-fade-in" style={{
      padding: '12px 18px', background: TOKENS.greenSoft,
      border: `1px solid ${TOKENS.green}`, borderRadius: 6,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <Icon name="check" size={16} stroke={TOKENS.green} strokeWidth={2.5} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>
          Pointage clôturé et envoyé à la paie
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>
          Verrouillé pour modification — déverrouillage par direction des travaux uniquement
        </div>
      </div>
      <Button size="sm" onClick={onUnlock}>Déverrouiller</Button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Refonte UX — vue terrain mobile : présence par défaut, marquer les absents
function MobilePointage({ site, date, team, present, absent, locked, onToggle, onMotif, onLock, onUnlock }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingBottom: 80 }}>
      {/* En-tête compact */}
      <div className="erp-fade-in" style={{
        position: 'sticky', top: 0, zIndex: 2, background: TOKENS.paper,
        borderBottom: `1px solid ${TOKENS.line}`, padding: '14px 16px', margin: '-4px -4px 0',
      }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em' }}>
          POINTAGE DU JOUR
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 19, margin: 0, letterSpacing: '-0.02em' }}>{site.code}</h1>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{date}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.green, letterSpacing: '-0.02em' }}>{present}</span>
          <span style={{ fontSize: 13, color: TOKENS.ink3 }}>/ {team.length} présents</span>
          {absent > 0 && <span style={{ marginLeft: 'auto' }}><Pill tone="red" dot>{absent} absent{absent > 1 ? 's' : ''}</Pill></span>}
        </div>
      </div>

      {locked && (
        <div style={{ margin: '14px 0 4px' }}><LockedBanner onUnlock={onUnlock} /></div>
      )}

      <div style={{ fontSize: 11.5, color: TOKENS.ink3, padding: '12px 4px 8px', lineHeight: 1.4 }}>
        Tout le monde est <b style={{ color: TOKENS.green }}>présent</b> par défaut — marquez seulement les absents.
      </div>

      {/* Cartes ouvriers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {team.map((o) => {
          const abs = !o.present;
          return (
            <div key={o.id} className="erp-fade-in" style={{
              background: TOKENS.paper, border: `1px solid ${abs ? TOKENS.redSoft : TOKENS.line}`,
              borderLeft: `4px solid ${abs ? TOKENS.red : TOKENS.green}`, borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 999, flexShrink: 0,
                  background: abs ? TOKENS.redSoft : TOKENS.ocreSoft, color: abs ? TOKENS.red : TOKENS.ocreDeep,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Manrope', fontWeight: 700, fontSize: 13,
                }}>
                  {o.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</div>
                  <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 1 }}>{o.poste}</div>
                </div>
                <button onClick={() => onToggle(o.id)} disabled={locked} style={{
                  border: 'none', borderRadius: 999, padding: '9px 15px', flexShrink: 0,
                  cursor: locked ? 'not-allowed' : 'pointer', opacity: locked ? 0.5 : 1,
                  background: abs ? TOKENS.redSoft : TOKENS.greenSoft, color: abs ? TOKENS.red : TOKENS.green,
                  fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  {abs ? '✗ Absent' : '✓ Présent'}
                </button>
              </div>
              {abs && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.06em' }}>MOTIF</span>
                  <select value={o.motif || 'maladie'} disabled={locked}
                    onChange={(e) => onMotif(o.id, e.target.value)}
                    style={{
                      flex: 1, height: 34, padding: '0 10px', borderRadius: 6,
                      border: `1px solid ${TOKENS.line2}`, background: TOKENS.bg,
                      fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink, outline: 'none',
                    }}>
                    {MOTIFS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA collant */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, padding: '12px 16px',
        background: `linear-gradient(transparent, ${TOKENS.bg} 35%)`, zIndex: 5,
      }}>
        {locked ? (
          <button onClick={onUnlock} style={ctaStyle(TOKENS.green)}>✓ Pointage clôturé — déverrouiller</button>
        ) : (
          <button onClick={onLock} style={ctaStyle(TOKENS.ink)}>
            CLÔTURER{absent > 0 ? ` · ${absent} absent${absent > 1 ? 's' : ''}` : ''}
          </button>
        )}
      </div>
    </div>
  );
}

function ctaStyle(bg) {
  return {
    width: '100%', padding: '15px', border: 'none', borderRadius: 12,
    background: bg, color: TOKENS.bg, cursor: 'pointer',
    fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, letterSpacing: '0.01em',
    boxShadow: '0 8px 24px -8px rgba(26,24,20,0.4)',
  };
}

Object.assign(window, { Pointage });
