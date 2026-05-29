/* global React, TOKENS, Icon, Pill, Card, Button, fmtMAD */
// =============================================================================
// ERP — GED — Audit complet HSE
// Conformité documentaire, indicateurs, incidents, formations, plan d'action
// =============================================================================

const HSE_KPIS = {
  joursSansAccident: 47,
  tf: 12.4,      // taux de fréquence (nb AT × 10⁶ / heures travaillées)
  tfCible: 18,
  tg: 0.34,      // taux de gravité (jours perdus × 10³ / heures travaillées)
  tgCible: 0.5,
  heuresFormation: 412,
  effectifFormé: 78, // %
  visitesHSE: 14,
  ncOuvertes: 7,
};

const HSE_DOCS = [
  { id: 'duer', code: 'DUER',  label: 'Document unique d\'évaluation des risques', freq: 'annuel', resp: 'DRH + HSE' },
  { id: 'ppsps', code: 'PPSPS', label: 'Plan particulier de sécurité et protection santé', freq: 'par chantier', resp: 'Coordonnateur SPS' },
  { id: 'piso', code: 'PISO',  label: 'Plan d\'installation & circulation chantier', freq: 'par chantier', resp: 'Conducteur' },
  { id: 'rcg',  code: 'RCG',   label: 'Registre de chantier & livre de sécurité', freq: 'permanent', resp: 'Chef chantier' },
  { id: 'reg',  code: 'RGI',   label: 'Registre général des incidents (AT/PI)', freq: 'permanent', resp: 'HSE' },
  { id: 'fic',  code: 'FDS',   label: 'Fiches de données de sécurité produits',  freq: 'permanent', resp: 'Magasinier' },
  { id: 'epi',  code: 'EPI',   label: 'Registre dotation EPI nominative',         freq: 'mensuel', resp: 'Magasinier' },
  { id: 'med',  code: 'MED',   label: 'Visites médicales aptitude',               freq: 'annuel', resp: 'DRH' },
];

// Matrix : chantier × document → statut (conforme | a_renouv | manquant | sans_objet)
const HSE_MATRIX = {
  'CSB-114': { duer: 'ok', ppsps: 'ok',   piso: 'ok',     rcg: 'ok',    reg: 'ok',   fic: 'renew', epi: 'ok',   med: 'ok'      },
  'RBT-208': { duer: 'ok', ppsps: 'ok',   piso: 'ok',     rcg: 'ok',    reg: 'ok',   fic: 'ok',    epi: 'ok',   med: 'renew'   },
  'TNG-061': { duer: 'ok', ppsps: 'ok',   piso: 'ok',     rcg: 'ok',    reg: 'ok',   fic: 'ok',    epi: 'ok',   med: 'ok'      },
  'AGD-033': { duer: 'ok', ppsps: 'renew',piso: 'missing',rcg: 'ok',    reg: 'ok',   fic: 'renew', epi: 'ok',   med: 'ok'      },
  'MEK-019': { duer: 'ok', ppsps: 'ok',   piso: 'ok',     rcg: 'ok',    reg: 'ok',   fic: 'ok',    epi: 'renew',med: 'ok'      },
  'CSB-098': { duer: 'ok', ppsps: 'ok',   piso: 'ok',     rcg: 'ok',    reg: 'ok',   fic: 'ok',    epi: 'ok',   med: 'ok'      },
  'OUJ-007': { duer: 'ok', ppsps: 'missing', piso: 'missing', rcg: 'missing', reg: 'missing', fic: 'missing', epi: 'missing', med: 'missing' },
};

const STATUS_META = {
  ok:      { label: 'Conforme',   tone: 'green',  color: TOKENS.green,  icon: 'check' },
  renew:   { label: 'À renouveler', tone: 'amber', color: TOKENS.amber, icon: 'refresh' },
  missing: { label: 'Manquant',   tone: 'red',    color: TOKENS.red,    icon: 'x' },
  na:      { label: 'Sans objet', tone: 'neutral', color: TOKENS.ink3,  icon: '' },
};

const HSE_HABILITATIONS = [
  { type: 'Travail en hauteur (R408)', requis: 86,  obtenu: 81,  perim: 4 },
  { type: 'Habilitation électrique B0/H0', requis: 24, obtenu: 22, perim: 2 },
  { type: 'Conduite engins CACES R482', requis: 18,  obtenu: 17,  perim: 1 },
  { type: 'Sauveteur Secouriste Travail (SST)', requis: 22,  obtenu: 14,  perim: 3 },
  { type: 'Échafaudages — montage R457', requis: 12, obtenu: 9, perim: 0 },
];

const HSE_INCIDENTS = [
  { id: 1, date: '27/05/2026', chantier: 'CSB-114', kind: 'PA', label: 'Presque-accident — chute matériau échafaudage R+3', gravite: 'mineur',  arret: 0, action: 'Filets périphériques renforcés, consignation', closed: true,  by: 'R. Bouhsina' },
  { id: 2, date: '22/05/2026', chantier: 'AGD-033', kind: 'AT', label: 'Coupure main droite avec disqueuse',                  gravite: 'modéré', arret: 5, action: 'Formation utilisation disqueuse, EPI complémentaires', closed: true,  by: 'S. Fassi' },
  { id: 3, date: '18/05/2026', chantier: 'RBT-208', kind: 'PA', label: 'Glissade sur dalle humide — pas de chute',             gravite: 'mineur', arret: 0, action: 'Signalisation zones humides, antidérapants', closed: true,  by: 'H. Alaoui' },
  { id: 4, date: '12/05/2026', chantier: 'TNG-061', kind: 'AT', label: 'Choc objet outil — entorse pied',                       gravite: 'modéré', arret: 8, action: 'Vérif. chaussures sécurité tout l\'effectif, sensibilisation', closed: true, by: 'M. El Mansouri' },
  { id: 5, date: '06/05/2026', chantier: 'CSB-114', kind: 'PA', label: 'Câble électrique sectionné par engin',                  gravite: 'majeur', arret: 0, action: 'Plan circulation engins revu, marquage câbles enterrés', closed: false, by: 'R. Bouhsina' },
  { id: 6, date: '02/05/2026', chantier: 'AGD-033', kind: 'AT', label: 'Brûlure cheville projection béton',                     gravite: 'mineur', arret: 2, action: 'Bottes hautes obligatoires zone coulage', closed: true,  by: 'S. Fassi' },
];

const HSE_ACTIONS = [
  { id: 1, label: 'Renouveler PPSPS chantier Taghazout — arrivée nouveau lot étanchéité', resp: 'S. Fassi',       echeance: '02/06/2026', priority: 'haute',  progress: 60 },
  { id: 2, label: 'Mise en place plan installation chantier OUJ-007 (démarrage)',         resp: 'Y. Tazi',        echeance: '15/06/2026', priority: 'haute',  progress: 20 },
  { id: 3, label: 'Renouveler FDS produits nouveau lot — Taghazout',                       resp: 'Magasinier',     echeance: '05/06/2026', priority: 'moyenne', progress: 0 },
  { id: 4, label: 'Visites médicales annuelles équipe Rabat (24 ouvriers)',                resp: 'DRH',            echeance: '20/06/2026', priority: 'moyenne', progress: 35 },
  { id: 5, label: 'Formation SST — 8 ouvriers manquants',                                  resp: 'HSE + OFPPT',    echeance: '30/06/2026', priority: 'moyenne', progress: 50 },
  { id: 6, label: 'Recyclage habilitation électrique 2 chefs équipe (CSB-114, MEK)',       resp: 'HSE',            echeance: '12/06/2026', priority: 'haute',  progress: 40 },
  { id: 7, label: 'Renouvellement EPI mensuel équipe MEK-019',                              resp: 'Magasinier',     echeance: '03/06/2026', priority: 'normale', progress: 80 },
  { id: 8, label: 'Cause-rootée incident #5 — câble sectionné CSB-114',                     resp: 'HSE + Cond.',   echeance: '10/06/2026', priority: 'haute',  progress: 50 },
];

// -----------------------------------------------------------------------------
function GedHseAudit({ onBack }) {
  const sites = Object.keys(HSE_MATRIX);
  const totalCells = sites.length * HSE_DOCS.length;
  const okCount = sites.reduce((s, c) => s + HSE_DOCS.filter(d => HSE_MATRIX[c][d.id] === 'ok').length, 0);
  const renewCount = sites.reduce((s, c) => s + HSE_DOCS.filter(d => HSE_MATRIX[c][d.id] === 'renew').length, 0);
  const missCount = sites.reduce((s, c) => s + HSE_DOCS.filter(d => HSE_MATRIX[c][d.id] === 'missing').length, 0);
  const conformite = (okCount / totalCells * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', color: TOKENS.ink3, fontSize: 12,
            padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10,
          }}>← GED documentaire</button>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            HSE · AUDIT COMPLET HYGIÈNE · SÉCURITÉ · ENVIRONNEMENT
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Audit HSE consolidé <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· Mai 2026</span>
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
            7 chantiers actifs · 168 ouvriers · 86 dossiers HSE
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Exporter audit</Button>
          <Button icon={<Icon name="warning" size={13} stroke={TOKENS.ink2} />}>Déclaration AT</Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Nouvelle inspection</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <HseKpi label="CONFORMITÉ DOCS"     value={conformite.toFixed(0)} unit="%" sub={`${okCount} / ${totalCells} pièces`} tone={conformite > 85 ? 'green' : 'amber'} delay={60} />
        <HseKpi label="JOURS SANS AT"        value={HSE_KPIS.joursSansAccident} unit="j" sub="meilleur run depuis 2025" tone="green" delay={120} />
        <HseKpi label="TAUX FRÉQUENCE"       value={HSE_KPIS.tf.toFixed(1)} unit="‰"  sub={`cible < ${HSE_KPIS.tfCible}`} tone={HSE_KPIS.tf < HSE_KPIS.tfCible ? 'green' : 'red'} delay={180} />
        <HseKpi label="TAUX GRAVITÉ"         value={HSE_KPIS.tg.toFixed(2)} sub={`cible < ${HSE_KPIS.tgCible}`} tone={HSE_KPIS.tg < HSE_KPIS.tgCible ? 'green' : 'red'} delay={240} />
        <HseKpi label="DOCS À TRAITER"       value={renewCount + missCount} unit="pièces" sub={`${missCount} manquantes`} tone="amber" delay={300} />
      </div>

      {/* Matrice de conformité */}
      <Card padding={0} delay={360}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, margin: 0 }}>
            Matrice de conformité documentaire HSE
          </h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
            Chantiers × documents obligatoires
          </span>
          <span style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10, fontSize: 11 }}>
            {[['ok','green'],['renew','amber'],['missing','red']].map(([k]) => {
              const s = STATUS_META[k];
              return (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, color: TOKENS.ink3 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color }} />
                  {s.label}
                </span>
              );
            })}
          </div>
        </div>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: `200px repeat(${HSE_DOCS.length}, 1fr)`,
          padding: '10px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em',
        }}>
          <span>CHANTIER</span>
          {HSE_DOCS.map(d => (
            <span key={d.id} style={{ textAlign: 'center' }} data-tip={d.label}>
              {d.code}
            </span>
          ))}
        </div>
        {sites.map((c, i) => (
          <div key={c} style={{
            display: 'grid', gridTemplateColumns: `200px repeat(${HSE_DOCS.length}, 1fr)`,
            padding: '12px 20px', alignItems: 'center', gap: 4,
            borderBottom: i < sites.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500 }}>{c}</span>
            {HSE_DOCS.map(d => {
              const status = HSE_MATRIX[c][d.id];
              const s = STATUS_META[status];
              return (
                <div key={d.id} data-tip={`${d.label} · ${s.label}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 28, borderRadius: 4,
                  background: status === 'ok' ? TOKENS.greenSoft : status === 'renew' ? TOKENS.amberSoft : status === 'missing' ? TOKENS.redSoft : TOKENS.bg,
                  color: s.color,
                  cursor: 'pointer',
                }}>
                  {s.icon && <Icon name={s.icon} size={13} stroke={s.color} strokeWidth={2.2} />}
                </div>
              );
            })}
          </div>
        ))}
        {/* Légende lignes */}
        <div style={{ padding: '14px 20px', background: TOKENS.bg, borderTop: `1px solid ${TOKENS.line}` }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 8 }}>
            DOCUMENTS OBLIGATOIRES
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {HSE_DOCS.map(d => (
              <div key={d.id} style={{ fontSize: 11, color: TOKENS.ink2 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', color: TOKENS.ocreDeep, marginRight: 6 }}>{d.code}</span>
                {d.label}
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>{d.freq} · {d.resp}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Habilitations + Formations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card padding={0} delay={420}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}` }}>
            <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, margin: 0 }}>
              Habilitations & certifications
            </h3>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 4 }}>
              Couverture par type · effectif requis vs obtenu
            </div>
          </div>
          {HSE_HABILITATIONS.map((h, i) => {
            const couv = (h.obtenu / h.requis) * 100;
            const alarm = h.perim > 0 || couv < 90;
            return (
              <div key={i} style={{
                padding: '14px 20px', borderBottom: i < HSE_HABILITATIONS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
                display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12, alignItems: 'center',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500, marginBottom: 6 }}>{h.type}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: TOKENS.bgWarm, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${couv}%`, height: '100%', background: couv >= 95 ? TOKENS.green : couv >= 80 ? TOKENS.ocre : TOKENS.red }} />
                    </div>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink2, minWidth: 70 }}>
                      {h.obtenu}/{h.requis}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, color: alarm ? TOKENS.red : TOKENS.ink }}>
                    {couv.toFixed(0)}%
                  </div>
                  {h.perim > 0 && (
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.amber, marginTop: 2 }}>
                      {h.perim} périmé{h.perim > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Card>

        <Card padding={20} delay={460}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 6 }}>
            FORMATIONS HSE — MAI 2026
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 36, lineHeight: 1, color: TOKENS.ink, letterSpacing: '-0.025em' }}>
            {HSE_KPIS.heuresFormation}
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: TOKENS.ink3, marginLeft: 6 }}>heures</span>
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 6 }}>
            {HSE_KPIS.effectifFormé}% de l'effectif formé sur l'année
          </div>

          <div style={{ marginTop: 18, borderTop: `1px solid ${TOKENS.line}`, paddingTop: 14 }}>
            {[
              { label: 'Accueil sécurité nouveaux ouvriers', n: 12, h: 24, by: 'HSE interne' },
              { label: 'Travail en hauteur — recyclage R408', n: 18, h: 144, by: 'OFPPT' },
              { label: 'Manipulation produits dangereux',     n: 6,  h: 24,  by: 'Fournisseur SOTRAVO' },
              { label: 'SST — Sauveteur secouriste',           n: 8,  h: 64,  by: 'CNSS Casa' },
              { label: 'Conduite engins CACES',                n: 4,  h: 80,  by: 'Centre agréé' },
              { label: 'Sensibilisation risques électriques',  n: 22, h: 76,  by: 'HSE interne' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 60px 70px', gap: 8, padding: '6px 0',
                borderTop: i > 0 ? `1px dashed ${TOKENS.line}` : 'none',
                fontSize: 11.5, color: TOKENS.ink2,
              }}>
                <div>
                  {f.label}
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>{f.by}</div>
                </div>
                <span style={{ fontFamily: 'IBM Plex Mono', textAlign: 'right', color: TOKENS.ink }}>{f.n}<span style={{ color: TOKENS.ink3, fontSize: 9.5 }}> pers.</span></span>
                <span style={{ fontFamily: 'IBM Plex Mono', textAlign: 'right', color: TOKENS.ink }}>{f.h}<span style={{ color: TOKENS.ink3, fontSize: 9.5 }}> h</span></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Registre incidents */}
      <Card padding={0} delay={500}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, margin: 0 }}>
            Registre incidents — 12 derniers mois
          </h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
            {HSE_INCIDENTS.filter(i => i.kind === 'AT').length} AT · {HSE_INCIDENTS.filter(i => i.kind === 'PA').length} presque-accidents · {HSE_INCIDENTS.reduce((s, i) => s + i.arret, 0)} jours d'arrêt cumulés
          </span>
          <span style={{ flex: 1 }} />
          <Button size="sm">Déclarer un incident</Button>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '80px 80px 100px 1fr 90px 70px 100px',
          padding: '10px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Date</span><span>Type</span><span>Chantier</span><span>Description</span><span>Gravité</span>
          <span style={{ textAlign: 'right' }}>Arrêt</span><span style={{ textAlign: 'center' }}>Clôture</span>
        </div>
        {HSE_INCIDENTS.map((it, i) => (
          <div key={it.id} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: '80px 80px 100px 1fr 90px 70px 100px',
            padding: '12px 20px', alignItems: 'center', gap: 4,
            borderBottom: i < HSE_INCIDENTS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          }}>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{it.date}</span>
            <Pill tone={it.kind === 'AT' ? 'red' : 'amber'} mono>{it.kind}</Pill>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep }}>{it.chantier}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</div>
              <div style={{ fontSize: 10.5, color: TOKENS.ink3, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Action : {it.action}
              </div>
            </div>
            <Pill tone={it.gravite === 'majeur' ? 'red' : it.gravite === 'modéré' ? 'amber' : 'neutral'} dot>{it.gravite}</Pill>
            <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: it.arret > 0 ? TOKENS.red : TOKENS.ink3 }}>
              {it.arret > 0 ? it.arret + ' j' : '—'}
            </span>
            <div style={{ textAlign: 'center' }}>
              <Pill tone={it.closed ? 'green' : 'amber'} dot>{it.closed ? 'Clôturé' : 'En cours'}</Pill>
            </div>
          </div>
        ))}
      </Card>

      {/* Plan d'actions correctives */}
      <Card padding={0} delay={540}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, margin: 0 }}>
            Plan d'actions correctives & préventives
          </h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
            {HSE_ACTIONS.length} actions ouvertes · {HSE_ACTIONS.filter(a => a.priority === 'haute').length} prioritaires
          </span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '36px 1fr 140px 110px 100px 130px',
          padding: '10px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>#</span><span>Action</span><span>Responsable</span><span>Priorité</span>
          <span style={{ textAlign: 'center' }}>Échéance</span>
          <span>Avancement</span>
        </div>
        {HSE_ACTIONS.map((a, i) => (
          <div key={a.id} className="erp-row" style={{
            display: 'grid', gridTemplateColumns: '36px 1fr 140px 110px 100px 130px',
            padding: '12px 20px', alignItems: 'center', gap: 8,
            borderBottom: i < HSE_ACTIONS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999, background: TOKENS.bgWarm,
              fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{a.id}</span>
            <span style={{ fontSize: 12.5, color: TOKENS.ink }}>{a.label}</span>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11.5, color: TOKENS.ink2 }}>{a.resp}</span>
            <Pill tone={a.priority === 'haute' ? 'red' : a.priority === 'moyenne' ? 'amber' : 'neutral'} dot>{a.priority}</Pill>
            <span style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2 }}>{a.echeance}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 5, background: TOKENS.bgWarm, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${a.progress}%`, height: '100%', background: a.progress >= 80 ? TOKENS.green : a.progress >= 40 ? TOKENS.ocre : TOKENS.amber }} />
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink2, minWidth: 28, textAlign: 'right' }}>{a.progress}%</span>
            </div>
          </div>
        ))}
      </Card>

      {/* Plan d'audit prévisionnel */}
      <Card padding={20} delay={580}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, margin: 0 }}>
            Calendrier des audits HSE — exercice 2026
          </h3>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>
            audits internes + visites OPP/CNSS
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {[
            { mois: 'Jan', count: 2, type: 'Interne' },
            { mois: 'Fév', count: 1, type: 'Interne' },
            { mois: 'Mar', count: 3, type: 'CNSS' },
            { mois: 'Avr', count: 2, type: 'Interne' },
            { mois: 'Mai', count: 4, type: 'En cours', active: true },
            { mois: 'Juin', count: 3, type: 'OPP prévu', upcoming: true },
            { mois: 'Juil', count: 2, type: 'Interne' },
            { mois: 'Août', count: 1, type: 'Interne' },
            { mois: 'Sept', count: 3, type: 'CNSS' },
            { mois: 'Oct', count: 2, type: 'Interne' },
            { mois: 'Nov', count: 2, type: 'Interne' },
            { mois: 'Déc', count: 3, type: 'Bilan annuel' },
          ].map((m, i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 6,
              background: m.active ? TOKENS.ink : m.upcoming ? TOKENS.ocreSoft : TOKENS.bg,
              color: m.active ? TOKENS.bg : TOKENS.ink,
              border: `1px solid ${m.active ? TOKENS.ink : m.upcoming ? TOKENS.ocre : TOKENS.line}`,
            }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, letterSpacing: '0.1em',
                color: m.active ? TOKENS.ocre : m.upcoming ? TOKENS.ocreDeep : TOKENS.ink3 }}>{m.mois.toUpperCase()}</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, marginTop: 4, lineHeight: 1 }}>
                {m.count}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, marginTop: 4, color: m.active ? TOKENS.ink4 : m.upcoming ? TOKENS.ocreDeep : TOKENS.ink3 }}>
                {m.type}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Signature DG */}
      <Card padding={18} delay={620} style={{ background: TOKENS.ink, color: TOKENS.bg, borderColor: TOKENS.ink, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 999, background: TOKENS.ocre,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="shield" size={20} stroke={TOKENS.ink} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ocre, letterSpacing: '0.12em', marginBottom: 4 }}>
            ENGAGEMENT DIRECTION
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: TOKENS.bg }}>
            « La sécurité de nos compagnons est un préalable non négociable à toute production. Aucun chantier ne démarre sans PPSPS validé.
            Cet audit est revu mensuellement en comité HSE et trimestriellement par la Direction Générale. »
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4, marginTop: 8 }}>
            Validé · A. Lahlou — Directeur Général · 28/05/2026
          </div>
        </div>
        <Button onClick={() => window.toast('Audit HSE exporté', 'success', 'PDF 12 pages')}
          icon={<Icon name="doc" size={13} stroke={TOKENS.bg} />}
          style={{ background: 'transparent', borderColor: TOKENS.ink4, color: TOKENS.bg }}>
          Télécharger l'audit
        </Button>
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
function HseKpi({ label, value, unit, sub, tone, delay }) {
  const colors = { green: TOKENS.green, amber: TOKENS.amber, red: TOKENS.red };
  const accent = colors[tone];
  return (
    <Card delay={delay} padding={16}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent }} />}
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: accent || TOKENS.ink3, letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 26, color: TOKENS.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, marginTop: 8, color: TOKENS.ink3 }}>{sub}</div>}
    </Card>
  );
}

Object.assign(window, { GedHseAudit });
