/* global React, TOKENS, Icon, Pill, fmtMAD */
// =============================================================================
// ERP — Rapports additionnels
// C4 : Rapport hebdomadaire de chantier (envoyé au MOE chaque vendredi)
// R1 : Bordereau de paie ouvriers chantier
// F4 : Échéancier trésorerie 13 semaines
// =============================================================================

const _Shell = () => window.ReportShell;
const _Title = () => window.ReportSectionTitle;
const _Table = () => window.ReportTable;
const _Stat  = () => window.SmallStat;
const _pCell = () => window.reportPCell;

// =============================================================================
// C4 — RAPPORT HEBDOMADAIRE CHANTIER
// =============================================================================
function ReportC4({ onBack }) {
  const Shell = _Shell();
  const SmallStat = _Stat();
  const SectionTitle = _Title();
  const pCell = _pCell();

  const semaine = 'Semaine 22 · du lundi 26 mai au samedi 31 mai 2026';
  const meteo = [
    { jour: 'Lun 26/05', desc: 'Ensoleillé', tmin: 18, tmax: 27, pluie: 0, vent: 12, ok: true },
    { jour: 'Mar 27/05', desc: 'Ensoleillé', tmin: 19, tmax: 28, pluie: 0, vent: 14, ok: true },
    { jour: 'Mer 28/05', desc: 'Nuageux',    tmin: 18, tmax: 25, pluie: 0, vent: 18, ok: true },
    { jour: 'Jeu 29/05', desc: 'Pluie',      tmin: 16, tmax: 21, pluie: 12, vent: 28, ok: false },
    { jour: 'Ven 30/05', desc: 'Éclaircies', tmin: 17, tmax: 24, pluie: 2, vent: 16, ok: true },
    { jour: 'Sam 31/05', desc: 'Ensoleillé', tmin: 19, tmax: 26, pluie: 0, vent: 10, ok: true },
  ];
  const effectif = [
    { cat: 'Encadrement (cond. + chef chantier + pointeur)', e: 3,  s: 0,  st: 0 },
    { cat: 'Maçons qualifiés',                                e: 14, s: 1,  st: 4 },
    { cat: 'Aides maçons',                                    e: 22, s: 2,  st: 0 },
    { cat: 'Ferrailleurs',                                    e: 9,  s: 0,  st: 6 },
    { cat: 'Coffreurs',                                       e: 8,  s: 1,  st: 0 },
    { cat: 'Manœuvres',                                       e: 18, s: 3,  st: 0 },
    { cat: 'Étanchéité (SOTRAVO sous-traitant)',              e: 0,  s: 0,  st: 8 },
    { cat: 'Conducteurs d\'engins',                           e: 4,  s: 0,  st: 0 },
  ];
  const totalE  = effectif.reduce((s, x) => s + x.e, 0);
  const totalS  = effectif.reduce((s, x) => s + x.s, 0);
  const totalSt = effectif.reduce((s, x) => s + x.st, 0);

  const taches = [
    { lot: 'Gros œuvre',  desc: 'Coulage dalle haute R+3 — zone B (320 m²)',          avance: 100, status: 'fait' },
    { lot: 'Gros œuvre',  desc: 'Ferraillage et coffrage poutres R+4 — zone A',       avance: 75,  status: 'cours' },
    { lot: 'Gros œuvre',  desc: 'Maçonnerie agglos étage R+2 — zone C (480 m²)',      avance: 60,  status: 'cours' },
    { lot: 'Étanchéité',  desc: 'Étanchéité multicouche toiture bloc 1 (320 m²)',     avance: 100, status: 'fait' },
    { lot: 'Étanchéité',  desc: 'Pose isolation thermique XPS bloc 2',                avance: 40,  status: 'cours' },
    { lot: 'Coordination', desc: 'Réunion hebdomadaire MOE — visite chantier 28/05', avance: 100, status: 'fait' },
  ];
  const incidents = [
    { kind: 'HSE',    label: 'Presqu\'accident chute matériau (gabarit non sécurisé)', date: '27/05', niveau: 'mineur',  action: 'Rappel consigne, harnais imposé' },
    { kind: 'Météo',  label: 'Arrêt 4 h jeudi 29/05 — orage et vent > 25 km/h',         date: '29/05', niveau: 'modéré',  action: 'Bâchage zones acier, reprise vendredi' },
  ];
  const livraisons = [
    { four: 'CIMAR',       prod: 'BPE C25/30 — 80 m³ sur 2 toupies',            date: '27/05', conf: true },
    { four: 'Sonasid',     prod: 'TOR HA Ø12/Ø16 — 14 t',                       date: '28/05', conf: true },
    { four: 'LafargeHolcim', prod: 'Ciment CPJ45 — 30 t en sacs',               date: '30/05', conf: true },
  ];
  const visiteurs = [
    { date: '28/05 10:30', nom: 'Cabinet El Mansouri', motif: 'Visite hebdo MOE', acc: 'K. Benjelloun' },
    { date: '28/05 14:00', nom: 'BMCE — chargé compte', motif: 'Levée caution provisoire', acc: 'K. Benjelloun' },
    { date: '30/05 11:00', nom: 'Inspection CNSS', motif: 'Contrôle pointage ouvriers', acc: 'R. Bouhsina' },
  ];

  return (
    <Shell onBack={onBack} code="C4" category="Chantier"
      title="Rapport hebdomadaire de chantier"
      period={`CSB-114 · Marina Casablanca Lot 3 · ${semaine}`}>

      {/* Identification */}
      <div style={{
        background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 4,
        padding: 14, marginBottom: 18,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        {[
          ['CHANTIER', 'CSB-114'],
          ['DESTINATAIRE', 'Cabinet El Mansouri'],
          ['CONDUCTEUR', 'K. Benjelloun'],
          ['AVANCEMENT PHYSIQUE', '47 % · cible 52 %'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 3 }}>{k}</div>
            <div style={{ fontSize: 12, color: TOKENS.ink, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Météo */}
      <SectionTitle>1. Conditions météorologiques de la semaine</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left')}>Jour</th>
            <th style={pCell('left')}>Conditions</th>
            <th style={pCell('right')}>T° min</th>
            <th style={pCell('right')}>T° max</th>
            <th style={pCell('right')}>Pluie</th>
            <th style={pCell('right')}>Vent</th>
            <th style={pCell('center')}>Travaux possibles</th>
          </tr>
        </thead>
        <tbody>
          {meteo.map((m, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left', { fontFamily: 'IBM Plex Mono', fontWeight: 500 })}>{m.jour}</td>
              <td style={pCell('left')}>{m.desc}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{m.tmin}°C</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{m.tmax}°C</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: m.pluie > 5 ? TOKENS.red : TOKENS.ink })}>{m.pluie} mm</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: m.vent > 25 ? TOKENS.amber : TOKENS.ink })}>{m.vent} km/h</td>
              <td style={pCell('center')}>
                <Pill tone={m.ok ? 'green' : 'red'} dot>{m.ok ? 'Oui' : 'Arrêt'}</Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Effectif */}
      <SectionTitle style={{ marginTop: 22 }}>2. Effectif présent sur site</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10, marginBottom: 12 }}>
        <SmallStat label="EFFECTIF DIRECT" value={totalE} unit="ouvriers" highlight />
        <SmallStat label="SOUS-TRAITANTS" value={totalSt} unit="ouvriers" />
        <SmallStat label="ABSENCES (CP / MA)" value={totalS} unit="personnes" />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
        <thead>
          <tr style={{ background: TOKENS.bg, color: TOKENS.ink }}>
            <th style={pCell('left')}>Catégorie</th>
            <th style={pCell('right')}>Effectif</th>
            <th style={pCell('right')}>Absents</th>
            <th style={pCell('right')}>Sous-traitants</th>
            <th style={pCell('right')}>Total présent</th>
          </tr>
        </thead>
        <tbody>
          {effectif.map((c, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left')}>{c.cat}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{c.e}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: c.s > 0 ? TOKENS.amber : TOKENS.ink3 })}>{c.s || '—'}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{c.st || '—'}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{c.e - c.s + c.st}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tâches exécutées */}
      <SectionTitle style={{ marginTop: 22 }}>3. Tâches exécutées et avancement</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left', { width: 90 })}>Lot</th>
            <th style={pCell('left')}>Tâche</th>
            <th style={pCell('left', { width: 180 })}>Avancement</th>
            <th style={pCell('center', { width: 70 })}>État</th>
          </tr>
        </thead>
        <tbody>
          {taches.map((t, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left', { fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep, fontWeight: 500 })}>{t.lot}</td>
              <td style={pCell('left')}>{t.desc}</td>
              <td style={pCell('left')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: TOKENS.bgWarm, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${t.avance}%`, height: '100%', background: t.avance === 100 ? TOKENS.green : TOKENS.ocre }} />
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fontWeight: 500, minWidth: 32 }}>{t.avance}%</span>
                </div>
              </td>
              <td style={pCell('center')}>
                <Pill tone={t.status === 'fait' ? 'green' : 'blue'} dot>{t.status === 'fait' ? 'Fait' : 'En cours'}</Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Incidents / observations */}
      <SectionTitle style={{ marginTop: 22 }}>4. Incidents, observations, faits marquants</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {incidents.map((it, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '70px 90px 1fr 200px', gap: 10, alignItems: 'flex-start',
            padding: 10, background: it.niveau === 'mineur' ? TOKENS.bg : TOKENS.amberSoft,
            border: `1px solid ${TOKENS.line}`, borderRadius: 4,
          }}>
            <Pill tone={it.kind === 'HSE' ? 'red' : 'amber'} mono>{it.kind}</Pill>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>{it.date}</span>
            <div style={{ fontSize: 11, color: TOKENS.ink, lineHeight: 1.5 }}>
              {it.label}
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 4 }}>
                Action : {it.action}
              </div>
            </div>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2 }}>
              Niveau : <b>{it.niveau}</b>
            </span>
          </div>
        ))}
      </div>

      {/* Livraisons */}
      <SectionTitle style={{ marginTop: 22 }}>5. Livraisons & approvisionnements</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.bg }}>
            <th style={pCell('left')}>Date</th>
            <th style={pCell('left')}>Fournisseur</th>
            <th style={pCell('left')}>Produit / Quantité</th>
            <th style={pCell('center')}>Conformité</th>
          </tr>
        </thead>
        <tbody>
          {livraisons.map((l, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left', { fontFamily: 'IBM Plex Mono' })}>{l.date}</td>
              <td style={pCell('left', { fontWeight: 500 })}>{l.four}</td>
              <td style={pCell('left')}>{l.prod}</td>
              <td style={pCell('center')}>
                <Pill tone={l.conf ? 'green' : 'red'} dot>{l.conf ? 'Conforme' : 'Écart'}</Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Visiteurs */}
      <SectionTitle style={{ marginTop: 22 }}>6. Visites & contrôles</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.bg }}>
            <th style={pCell('left')}>Date / Heure</th>
            <th style={pCell('left')}>Visiteur</th>
            <th style={pCell('left')}>Motif</th>
            <th style={pCell('left')}>Accompagné par</th>
          </tr>
        </thead>
        <tbody>
          {visiteurs.map((v, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left', { fontFamily: 'IBM Plex Mono' })}>{v.date}</td>
              <td style={pCell('left', { fontWeight: 500 })}>{v.nom}</td>
              <td style={pCell('left')}>{v.motif}</td>
              <td style={pCell('left')}>{v.acc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Plan semaine prochaine */}
      <SectionTitle style={{ marginTop: 22 }}>7. Programme prévisionnel — semaine 23</SectionTitle>
      <div style={{ marginTop: 8, padding: 14, background: TOKENS.ocreSoft, border: `1px solid ${TOKENS.ocre}`, borderRadius: 4, fontSize: 10.5, color: TOKENS.ink2, lineHeight: 1.7 }}>
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          <li>Finaliser ferraillage et couler poutres R+4 zone A (jeudi 04/06).</li>
          <li>Démarrer voiles de séparation R+3 zone C — coulage prévu vendredi 05/06.</li>
          <li>Réception étanchéité bloc 1 par MOE — visite contradictoire mardi 02/06.</li>
          <li>Livraison ascenseurs (Schindler) — réception magasin lundi 02/06 14h.</li>
          <li>Formation HSE travail en hauteur — vendredi 05/06 matin (effectif complet).</li>
        </ol>
      </div>

      {/* Signatures */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
        {[
          ['CONDUCTEUR', 'K. Benjelloun'],
          ['CHEF CHANTIER', 'R. Bouhsina'],
          ['VISA MOE', 'Cabinet El Mansouri'],
        ].map(([h, w], i) => (
          <div key={i} style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 10, minHeight: 80 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 3 }}>{h}</div>
            <div style={{ fontSize: 10.5, color: TOKENS.ink2, marginBottom: 24 }}>{w}</div>
            <div style={{ borderTop: `1px dashed ${TOKENS.line2}`, paddingTop: 3, fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3 }}>
              Date · Signature
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// =============================================================================
// R1 — BORDEREAU DE PAIE OUVRIERS CHANTIER
// =============================================================================
function ReportR1({ onBack }) {
  const Shell = _Shell();
  const SmallStat = _Stat();
  const SectionTitle = _Title();
  const pCell = _pCell();

  const ouvriers = [
    { mat: '0245', nom: 'AÏT BENALI Mohamed',    cat: 'Maçon chef équipe',  cnss: '789456321', hN: 184, hS: 12, txN: 32, txS: 48, primes: 1500, avance: 800,  ch: 'CSB-114' },
    { mat: '0312', nom: 'BOUDRAA Aziz',           cat: 'Maçon qualifié',     cnss: '798452310', hN: 184, hS: 8,  txN: 28, txS: 42, primes: 800,  avance: 500,  ch: 'CSB-114' },
    { mat: '0398', nom: 'EL HASSANI Khalid',      cat: 'Coffreur',           cnss: '845321124', hN: 176, hS: 14, txN: 30, txS: 45, primes: 1200, avance: 1000, ch: 'CSB-114' },
    { mat: '0421', nom: 'KETTANI Rachid',         cat: 'Ferrailleur',        cnss: '812304556', hN: 184, hS: 10, txN: 30, txS: 45, primes: 800,  avance: 0,    ch: 'CSB-114' },
    { mat: '0455', nom: 'ZRIOUIL Said',           cat: 'Aide maçon',         cnss: '855412309', hN: 184, hS: 4,  txN: 22, txS: 33, primes: 400,  avance: 600,  ch: 'CSB-114' },
    { mat: '0478', nom: 'TAHIRI Younès',          cat: 'Manœuvre',           cnss: '871245038', hN: 184, hS: 0,  txN: 18, txS: 27, primes: 0,    avance: 400,  ch: 'CSB-114' },
    { mat: '0512', nom: 'BENMOUSSA Karim',        cat: 'Conducteur engin',   cnss: '887523014', hN: 184, hS: 8,  txN: 35, txS: 52, primes: 1800, avance: 1200, ch: 'CSB-114' },
    { mat: '0589', nom: 'LAHMER Driss',           cat: 'Maçon qualifié',     cnss: '901447258', hN: 168, hS: 6,  txN: 28, txS: 42, primes: 600,  avance: 0,    ch: 'CSB-114' },
  ];

  const lignes = ouvriers.map(o => {
    const brutN = o.hN * o.txN;
    const brutS = o.hS * o.txS;
    const brut  = brutN + brutS + o.primes;
    const cnssS = brut * 0.0448;
    const amoS  = brut * 0.0226;
    const ir    = Math.max(0, (brut - cnssS - amoS - 500) * 0.10);
    const netAv = brut - cnssS - amoS - ir;
    const net   = netAv - o.avance;
    return { ...o, brutN, brutS, brut, cnssS, amoS, ir, net };
  });

  const sum = (k) => lignes.reduce((s, x) => s + x[k], 0);

  return (
    <Shell onBack={onBack} code="R1" category="RH & Paie"
      title="Bordereau de paie ouvriers chantier"
      period="Mai 2026 · CSB-114 Marina Casablanca · à régler le 28 mai 2026">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
        <SmallStat label="OUVRIERS PAYÉS" value={lignes.length} unit="bulletins" />
        <SmallStat label="HEURES NORMALES" value={sum('hN').toLocaleString('fr-FR')} unit="h" />
        <SmallStat label="HEURES SUPPL." value={sum('hS')} unit="h" sub={(sum('hS') / sum('hN') * 100).toFixed(1) + '% du normal'} />
        <SmallStat label="NET À PAYER TOTAL" value={fmtMAD(sum('net'))} unit="DH" highlight />
      </div>

      <SectionTitle>Détail par ouvrier</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 8.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left')}>Mat.</th>
            <th style={pCell('left')}>Nom / Catégorie</th>
            <th style={pCell('right')}>H norm.</th>
            <th style={pCell('right')}>H sup.</th>
            <th style={pCell('right')}>Tx N.</th>
            <th style={pCell('right')}>Brut N.</th>
            <th style={pCell('right')}>Brut S.</th>
            <th style={pCell('right')}>Primes</th>
            <th style={pCell('right')}>Brut</th>
            <th style={pCell('right')}>CNSS</th>
            <th style={pCell('right')}>AMO</th>
            <th style={pCell('right')}>IR</th>
            <th style={pCell('right')}>Avance</th>
            <th style={pCell('right')}>Net</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((o, i) => (
            <tr key={o.mat} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left', { fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep })}>{o.mat}</td>
              <td style={pCell('left')}>
                <div style={{ fontWeight: 500 }}>{o.nom}</div>
                <div style={{ fontSize: 7.5, color: TOKENS.ink3 }}>{o.cat} · CNSS {o.cnss}</div>
              </td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{o.hN}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: o.hS > 0 ? TOKENS.amber : TOKENS.ink3 })}>{o.hS || '—'}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{o.txN}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{o.brutN.toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{o.brutS.toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{o.primes ? o.primes.toLocaleString('fr-FR') : '—'}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>{Math.round(o.brut).toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: TOKENS.red })}>{Math.round(o.cnssS).toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: TOKENS.red })}>{Math.round(o.amoS).toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', color: TOKENS.red })}>{Math.round(o.ir).toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono' })}>{o.avance ? o.avance.toLocaleString('fr-FR') : '—'}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.ocreDeep })}>{Math.round(o.net).toLocaleString('fr-FR')}</td>
            </tr>
          ))}
          <tr style={{ background: TOKENS.bgWarm, borderTop: `2px solid ${TOKENS.ink}` }}>
            <td colSpan={2} style={pCell('left', { fontWeight: 700 })}>TOTAUX MAI 2026</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{sum('hN')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{sum('hS')}</td>
            <td style={pCell('right')}>—</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{Math.round(sum('brutN')).toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{Math.round(sum('brutS')).toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{sum('primes').toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{Math.round(sum('brut')).toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.red })}>{Math.round(sum('cnssS')).toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.red })}>{Math.round(sum('amoS')).toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.red })}>{Math.round(sum('ir')).toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700 })}>{sum('avance').toLocaleString('fr-FR')}</td>
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.ocreDeep })}>{Math.round(sum('net')).toLocaleString('fr-FR')}</td>
          </tr>
        </tbody>
      </table>

      {/* Mode de règlement */}
      <SectionTitle style={{ marginTop: 22 }}>Mode de règlement</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
        {[
          { mode: 'Virement bancaire', n: 5, m: Math.round(sum('net') * 0.62), c: TOKENS.green },
          { mode: 'Chèque',            n: 2, m: Math.round(sum('net') * 0.24), c: TOKENS.blue },
          { mode: 'Espèces (caisse)',  n: 1, m: Math.round(sum('net') * 0.14), c: TOKENS.amber },
        ].map((p, i) => (
          <div key={i} style={{ padding: 12, background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 4, borderLeft: `3px solid ${p.c}` }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{p.mode.toUpperCase()}</div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, marginTop: 4, color: TOKENS.ink }}>{p.m.toLocaleString('fr-FR')} <span style={{ fontSize: 10, color: TOKENS.ink3 }}>DH</span></div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>{p.n} bulletins</div>
          </div>
        ))}
      </div>

      {/* Récap charges */}
      <div style={{ marginTop: 22, padding: 14, background: TOKENS.ink, color: TOKENS.bg, borderRadius: 6 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ocre, letterSpacing: '0.12em', marginBottom: 10 }}>
          DÉCLARATIONS À TRANSMETTRE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, fontSize: 11 }}>
          <div>
            <div style={{ color: TOKENS.ink4, fontSize: 10 }}>CNSS — bordereau DAMANCOM</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: 14, color: TOKENS.bg, marginTop: 4 }}>{Math.round(sum('brut') * 0.0648).toLocaleString('fr-FR')} DH</div>
            <div style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono', fontSize: 10, marginTop: 2 }}>échéance 08/06/2026</div>
          </div>
          <div>
            <div style={{ color: TOKENS.ink4, fontSize: 10 }}>AMO obligatoire</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: 14, color: TOKENS.bg, marginTop: 4 }}>{Math.round(sum('brut') * 0.0411).toLocaleString('fr-FR')} DH</div>
            <div style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono', fontSize: 10, marginTop: 2 }}>échéance 08/06/2026</div>
          </div>
          <div>
            <div style={{ color: TOKENS.ink4, fontSize: 10 }}>IR sur salaires (DGI)</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: 14, color: TOKENS.bg, marginTop: 4 }}>{Math.round(sum('ir')).toLocaleString('fr-FR')} DH</div>
            <div style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono', fontSize: 10, marginTop: 2 }}>échéance 30/06/2026</div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 22 }}>
        {[
          ['POINTEUR', 'A. Lahmer'],
          ['CONDUCTEUR', 'K. Benjelloun'],
          ['DAF', 'F. Cherqaoui'],
        ].map(([h, w], i) => (
          <div key={i} style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 10, minHeight: 80 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 3 }}>{h}</div>
            <div style={{ fontSize: 10.5, color: TOKENS.ink2, marginBottom: 24 }}>{w}</div>
            <div style={{ borderTop: `1px dashed ${TOKENS.line2}`, paddingTop: 3, fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3 }}>
              Date · Signature · Cachet
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// =============================================================================
// F4 — ÉCHÉANCIER TRÉSORERIE 13 SEMAINES
// =============================================================================
function ReportF4({ onBack }) {
  const Shell = _Shell();
  const SmallStat = _Stat();
  const SectionTitle = _Title();
  const pCell = _pCell();

  // 13 semaines à partir de S22 (semaine actuelle)
  const weeks = Array.from({ length: 13 }, (_, i) => `S${22 + i}`);

  // Soldes initiaux
  const soldeInitial = 26_105_000;

  // Lignes d'entrées (encaissements)
  const entrees = [
    { lbl: 'Encaissements clients — FA-26-037 STÉ Maroc Dist.',  w: 0, mt: 261_600,   ch: 'CSB-114' },
    { lbl: 'Encaissements clients — FA-26-038 Résidence El Manar', w: 1, mt: 170_400, ch: 'CSB-114' },
    { lbl: 'Décompte SIT-04/26 — Marina (validé MOE)',           w: 2, mt: 5_645_280, ch: 'CSB-114' },
    { lbl: 'Décompte SIT-08/26 — Port Tanger Med',               w: 3, mt: 2_822_640, ch: 'TNG-061' },
    { lbl: 'FA-26-036 M. Belhaj (chèque)',                       w: 2, mt: 201_600,   ch: 'AGD-' },
    { lbl: 'FA-26-035 Pharma Atlas',                             w: 4, mt: 115_680,   ch: 'CSB-' },
    { lbl: 'Décompte SIT-03/26 Tramway Rabat (reliquat)',        w: 5, mt: 8_051_300, ch: 'RBT-208' },
    { lbl: 'Nouvelle facture FA-26-040 prévisionnelle',          w: 6, mt: 480_000,   ch: 'TNG-061' },
    { lbl: 'Décompte SIT-05/26 Marina (estimé)',                 w: 7, mt: 6_188_400, ch: 'CSB-114' },
    { lbl: 'Mainlevée caution provisoire AO Hôtel Fès',          w: 8, mt: 1_800_000, ch: 'FES-022' },
    { lbl: 'Encaissement FA-26-034 Résidence Al Andalous',       w: 4, mt: 46_680,    ch: 'CSB-' },
    { lbl: 'Décompte SIT-09/26 Port Tanger Med',                 w: 9, mt: 3_120_000, ch: 'TNG-061' },
    { lbl: 'Avance commande Aksal — Sidi Maârouf',               w: 10, mt: 2_400_000,ch: 'CSB-098' },
    { lbl: 'Décompte SIT-06/26 Marina',                          w: 11, mt: 6_500_000,ch: 'CSB-114' },
    { lbl: 'Décompte SIT-10/26 Port Tanger Med',                 w: 12, mt: 3_300_000,ch: 'TNG-061' },
  ];
  // Lignes de sorties
  const sorties = [
    { lbl: 'Paie ouvriers mai (R1) — virements + chèques',       w: 0, mt: 1_972_000, ch: 'multi' },
    { lbl: 'CNSS / AMO mai (DAMANCOM)',                          w: 1, mt: 481_400,   ch: 'multi' },
    { lbl: 'BC Sonasid — TOR 28 t',                              w: 1, mt: 482_000,   ch: 'CSB-114' },
    { lbl: 'BC CIMAR — BPE 280 m³',                              w: 0, mt: 312_000,   ch: 'CSB-114' },
    { lbl: 'IR sur salaires — DGI',                              w: 4, mt: 175_280,   ch: 'multi' },
    { lbl: 'Loyer siège + bureaux',                              w: 1, mt: 84_000,    ch: 'siège' },
    { lbl: 'Sous-traitance SOTRAVO étanchéité',                  w: 2, mt: 612_000,   ch: 'CSB-098' },
    { lbl: 'TVA trimestrielle Q2',                               w: 5, mt: 2_840_000, ch: 'multi' },
    { lbl: 'Échéance leasing parc engins (TIM, BMCE Leasing)',   w: 3, mt: 295_000,   ch: 'multi' },
    { lbl: 'Paie ouvriers juin (estim.)',                        w: 4, mt: 2_080_000, ch: 'multi' },
    { lbl: 'BC Aluminium Berrechid — façade Taghazout',          w: 3, mt: 1_240_000, ch: 'AGD-033' },
    { lbl: 'CNSS / AMO juin',                                    w: 5, mt: 504_000,   ch: 'multi' },
    { lbl: 'Caution définitive CSB-114 — renouvellement BMCE',   w: 2, mt: 420_000,   ch: 'CSB-114' },
    { lbl: 'BC Granulats du Souss',                              w: 6, mt: 215_000,   ch: 'TNG-061' },
    { lbl: 'Paie ouvriers juillet (estim.)',                     w: 8, mt: 2_160_000, ch: 'multi' },
    { lbl: 'Sous-traitance Électrique du Maroc — tramway',       w: 4, mt: 388_000,   ch: 'RBT-208' },
    { lbl: 'Acompte impôt sur sociétés',                         w: 10, mt: 1_400_000,ch: 'siège' },
    { lbl: 'Remboursement échéance trim. — Attijariwafa',        w: 8, mt: 650_000,   ch: 'siège' },
    { lbl: 'BC LafargeHolcim — ciment juin',                     w: 5, mt: 92_400,    ch: 'CSB-114' },
    { lbl: 'Paie ouvriers août (estim.)',                        w: 12, mt: 2_240_000,ch: 'multi' },
    { lbl: 'Quote-part frais généraux siège (juin)',             w: 6, mt: 380_000,   ch: 'siège' },
    { lbl: 'Quote-part frais généraux siège (juillet)',          w: 10, mt: 380_000,  ch: 'siège' },
  ];

  // Construire matrices par semaine
  const entreesWeek = weeks.map((_, wi) => entrees.filter(e => e.w === wi).reduce((s, e) => s + e.mt, 0));
  const sortiesWeek = weeks.map((_, wi) => sorties.filter(e => e.w === wi).reduce((s, e) => s + e.mt, 0));
  const netWeek = weeks.map((_, wi) => entreesWeek[wi] - sortiesWeek[wi]);
  const cumulWeek = weeks.reduce((acc, _, wi) => {
    const prev = wi === 0 ? soldeInitial : acc[wi - 1];
    acc.push(prev + netWeek[wi]);
    return acc;
  }, []);

  const totEntrees = entreesWeek.reduce((s, x) => s + x, 0);
  const totSorties = sortiesWeek.reduce((s, x) => s + x, 0);
  const soldeFinal = cumulWeek[cumulWeek.length - 1];
  const minCumul = Math.min(...cumulWeek);
  const minWeek = weeks[cumulWeek.indexOf(minCumul)];

  // Chart helpers
  const allValues = [...cumulWeek, soldeInitial];
  const maxV = Math.max(...allValues) * 1.1;
  const minV = Math.min(...allValues, 0) * 1.05;
  const range = maxV - minV;
  const chartH = 140;
  const colW = 100 / weeks.length;
  const xPos = (i) => i * colW + colW / 2;
  const yPos = (v) => chartH - ((v - minV) / range) * chartH;

  return (
    <Shell onBack={onBack} code="F4" category="Finance"
      title="Échéancier trésorerie 13 semaines"
      period="Atlas Constructions S.A. · S22 → S34 · arrêté au 28 mai 2026">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
        <SmallStat label="SOLDE INITIAL" value={(soldeInitial / 1e6).toFixed(1)} unit="M DH" />
        <SmallStat label="ENCAISSEMENTS 13 SEM." value={(totEntrees / 1e6).toFixed(1)} unit="M DH" sub={`${entrees.length} flux entrants`} />
        <SmallStat label="DÉCAISSEMENTS 13 SEM." value={(totSorties / 1e6).toFixed(1)} unit="M DH" sub={`${sorties.length} flux sortants`} />
        <SmallStat label="SOLDE FIN S34" value={(soldeFinal / 1e6).toFixed(1)} unit="M DH" highlight />
      </div>

      {/* Alert tension trésorerie */}
      {minCumul < soldeInitial * 0.5 && (
        <div style={{ padding: 12, background: TOKENS.amberSoft, border: `1px solid ${TOKENS.amber}`, borderRadius: 4, marginBottom: 18, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="warning" size={14} stroke={TOKENS.amber} strokeWidth={2} />
          <div style={{ fontSize: 10.5, color: TOKENS.ink, lineHeight: 1.5 }}>
            <b>Point bas prévu en {minWeek}</b> : {(minCumul / 1e6).toFixed(1)} M DH (soit −{((soldeInitial - minCumul) / 1e6).toFixed(1)} M DH vs aujourd'hui).
            Anticiper mobilisation court terme ou décaler décaissements non critiques.
          </div>
        </div>
      )}

      {/* Chart */}
      <SectionTitle>Courbe de trésorerie prévisionnelle</SectionTitle>
      <div style={{ marginTop: 12, padding: '16px 8px 4px', border: `1px solid ${TOKENS.line}`, borderRadius: 4, background: TOKENS.bg }}>
        <svg viewBox={`0 0 100 ${chartH + 24}`} width="100%" height={chartH + 32} preserveAspectRatio="none" style={{ overflow: 'visible', fontFamily: 'IBM Plex Mono' }}>
          {/* Zero line */}
          <line x1="0" y1={yPos(0)} x2="100" y2={yPos(0)} stroke={TOKENS.line2} strokeWidth="0.15" strokeDasharray="0.4 0.4" />
          {/* Min line */}
          <line x1="0" y1={yPos(minCumul)} x2="100" y2={yPos(minCumul)} stroke={TOKENS.amber} strokeWidth="0.2" strokeDasharray="0.5 0.5" />
          {/* Bars: entrées / sorties per week */}
          {weeks.map((_, i) => {
            const x = i * colW + colW * 0.18;
            const w = colW * 0.32;
            const hE = (entreesWeek[i] / range) * chartH;
            const hS = (sortiesWeek[i] / range) * chartH;
            return (
              <g key={i}>
                <rect x={x} y={yPos(0) - hE} width={w} height={hE} fill={TOKENS.green} opacity="0.5" />
                <rect x={x + w + 0.3} y={yPos(0)} width={w} height={hS} fill={TOKENS.red} opacity="0.5" />
              </g>
            );
          })}
          {/* Cumul line */}
          <polyline points={cumulWeek.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')} fill="none" stroke={TOKENS.ink} strokeWidth="0.4" />
          {cumulWeek.map((v, i) => (
            <circle key={i} cx={xPos(i)} cy={yPos(v)} r="0.7" fill={v < soldeInitial * 0.5 ? TOKENS.amber : TOKENS.ocre} />
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, marginTop: 6, padding: '0 8px' }}>
          {weeks.map(w => <span key={w} style={{ width: colW + '%', textAlign: 'center' }}>{w}</span>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10, fontSize: 9.5, color: TOKENS.ink3 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: TOKENS.green, opacity: 0.5 }} /> Entrées
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: TOKENS.red, opacity: 0.5 }} /> Sorties
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 14, height: 2, background: TOKENS.ink }} /> Trésorerie cumulée
          </span>
        </div>
      </div>

      {/* Table 13 weeks */}
      <SectionTitle style={{ marginTop: 22 }}>Détail hebdomadaire (DH)</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left', { width: 140 })}>Flux</th>
            {weeks.map(w => <th key={w} style={pCell('right', { width: 50 })}>{w}</th>)}
            <th style={pCell('right', { width: 70 })}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: TOKENS.greenSoft }}>
            <td style={pCell('left', { fontWeight: 600 })}>Entrées</td>
            {entreesWeek.map((v, i) => (
              <td key={i} style={pCell('right', { fontFamily: 'IBM Plex Mono', color: v > 0 ? TOKENS.green : TOKENS.ink3 })}>
                {v ? (v / 1000).toFixed(0) + 'k' : '—'}
              </td>
            ))}
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.green })}>{(totEntrees / 1e6).toFixed(2)} M</td>
          </tr>
          <tr style={{ background: TOKENS.redSoft }}>
            <td style={pCell('left', { fontWeight: 600 })}>Sorties</td>
            {sortiesWeek.map((v, i) => (
              <td key={i} style={pCell('right', { fontFamily: 'IBM Plex Mono', color: v > 0 ? TOKENS.red : TOKENS.ink3 })}>
                {v ? '−' + (v / 1000).toFixed(0) + 'k' : '—'}
              </td>
            ))}
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.red })}>−{(totSorties / 1e6).toFixed(2)} M</td>
          </tr>
          <tr style={{ borderTop: `1px solid ${TOKENS.ink}` }}>
            <td style={pCell('left', { fontWeight: 600 })}>Net hebdo</td>
            {netWeek.map((v, i) => (
              <td key={i} style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600, color: v >= 0 ? TOKENS.green : TOKENS.red })}>
                {v >= 0 ? '+' : '−'}{(Math.abs(v) / 1000).toFixed(0) + 'k'}
              </td>
            ))}
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: (totEntrees - totSorties) >= 0 ? TOKENS.green : TOKENS.red })}>
              {((totEntrees - totSorties) / 1e6).toFixed(2)} M
            </td>
          </tr>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <td style={pCell('left', { fontWeight: 700, color: TOKENS.bg })}>Solde cumulé</td>
            {cumulWeek.map((v, i) => (
              <td key={i} style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600, color: v === minCumul ? TOKENS.amber : TOKENS.bg })}>
                {(v / 1e6).toFixed(1)}
              </td>
            ))}
            <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 700, color: TOKENS.ocre })}>{(soldeFinal / 1e6).toFixed(1)} M</td>
          </tr>
        </tbody>
      </table>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, marginTop: 4 }}>
        Montants en k DH (k = milliers) sauf totaux et solde cumulé en M DH (millions).
      </div>

      {/* Flux entrants détaillés */}
      <SectionTitle style={{ marginTop: 22 }}>Flux entrants prévisionnels (top 10)</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.bg }}>
            <th style={pCell('center', { width: 50 })}>Sem.</th>
            <th style={pCell('left')}>Désignation</th>
            <th style={pCell('center', { width: 100 })}>Chantier</th>
            <th style={pCell('right', { width: 100 })}>Montant DH</th>
          </tr>
        </thead>
        <tbody>
          {entrees.slice().sort((a, b) => b.mt - a.mt).slice(0, 10).map((e, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('center', { fontFamily: 'IBM Plex Mono', color: TOKENS.green, fontWeight: 600 })}>S{22 + e.w}</td>
              <td style={pCell('left')}>{e.lbl}</td>
              <td style={pCell('center', { fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ocreDeep })}>{e.ch}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600 })}>+{e.mt.toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Flux sortants détaillés */}
      <SectionTitle style={{ marginTop: 18 }}>Décaissements prévisionnels (top 10)</SectionTitle>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.bg }}>
            <th style={pCell('center', { width: 50 })}>Sem.</th>
            <th style={pCell('left')}>Désignation</th>
            <th style={pCell('center', { width: 100 })}>Chantier</th>
            <th style={pCell('right', { width: 100 })}>Montant DH</th>
          </tr>
        </thead>
        <tbody>
          {sorties.slice().sort((a, b) => b.mt - a.mt).slice(0, 10).map((e, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('center', { fontFamily: 'IBM Plex Mono', color: TOKENS.red, fontWeight: 600 })}>S{22 + e.w}</td>
              <td style={pCell('left')}>{e.lbl}</td>
              <td style={pCell('center', { fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ocreDeep })}>{e.ch}</td>
              <td style={pCell('right', { fontFamily: 'IBM Plex Mono', fontWeight: 600, color: TOKENS.red })}>−{e.mt.toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hypothèses */}
      <div style={{ marginTop: 22, padding: 14, background: TOKENS.bgWarm, borderRadius: 4, fontSize: 9.5, color: TOKENS.ink2, lineHeight: 1.6 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 6 }}>
          HYPOTHÈSES DE CONSTRUCTION
        </div>
        Délais d'encaissement : situations validées MOE = 21 jours, factures clients privés = 30 j, marchés publics ADM/Min. = 45 j typique.
        Décaissements paie : 28 du mois (R1) — CNSS/AMO : 8 du mois suivant — IR : 30 du mois suivant — TVA : trimestrielle.
        Cautions : pas de mainlevée prévue avant S30. Réserve de sécurité interne : <b>15 M DH</b> (limite plancher).
      </div>
    </Shell>
  );
}

// =============================================================================
// REGISTER
// =============================================================================
window.RAPPORT_TEMPLATES = {
  ...(window.RAPPORT_TEMPLATES || {}),
  C4: ReportC4,
  R1: ReportR1,
  F4: ReportF4,
};
