/* global React, TOKENS, Icon, Pill, Card, Button, LogoUpload */
// =============================================================================
// ERP — Paramétrage
// Société · fiscalité (TVA, IS) · numérotation des pièces · paie · intégrations
// =============================================================================

const SECTIONS = [
  { id: 'societe',   label: 'Société',            icon: 'sites' },
  { id: 'fiscal',    label: 'Fiscalité & TVA',    icon: 'money' },
  { id: 'numero',    label: 'Numérotation',       icon: 'doc' },
  { id: 'paie',      label: 'Paramètres de paie',  icon: 'user' },
  { id: 'integr',    label: 'Intégrations',       icon: 'refresh' },
  { id: 'data',      label: 'Données & sauvegarde', icon: 'shield' },
];

// -----------------------------------------------------------------------------
function Settings() {
  const [section, setSection] = React.useState('societe');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in">
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
          ADMINISTRATION · PARAMÉTRAGE
        </div>
        <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
          Paramétrage de la société
        </h1>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
          Configuration applicable à Atlas Constructions S.A. · exercice 2026
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        {/* Section nav */}
        <Card padding={6} delay={60} style={{ alignSelf: 'flex-start' }}>
          {SECTIONS.map(s => {
            const active = section === s.id;
            return (
              <button key={s.id} className="erp-nav-item" onClick={() => setSection(s.id)} style={{
                width: '100%', padding: '10px 12px', borderRadius: 5, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: active ? TOKENS.ink : 'transparent', marginBottom: 2,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name={s.icon} size={15} stroke={active ? TOKENS.ocre : TOKENS.ink3} />
                <span style={{ fontSize: 13, color: active ? TOKENS.bg : TOKENS.ink2, fontWeight: active ? 500 : 400 }}>{s.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Section content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {section === 'societe' && <SocieteSection />}
          {section === 'fiscal'  && <FiscalSection />}
          {section === 'numero'  && <NumeroSection />}
          {section === 'paie'    && <PaieSection />}
          {section === 'integr'  && <IntegrSection />}
          {section === 'data'    && <DataSection />}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function Panel({ title, desc, children, delay = 100, footer }) {
  return (
    <Card padding={0} delay={delay}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${TOKENS.line}` }}>
        <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
        {desc && <div style={{ fontSize: 12, color: TOKENS.ink3, marginTop: 5 }}>{desc}</div>}
      </div>
      <div style={{ padding: 22 }}>{children}</div>
      {footer !== false && (
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={() => window.toast('Modifications annulées', 'info')}>Annuler</Button>
          <Button variant="primary" onClick={() => window.toast('Paramètres enregistrés', 'success', title)} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Enregistrer</Button>
        </div>
      )}
    </Card>
  );
}

function Field({ label, value, mono, hint, half }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 7, textTransform: 'uppercase' }}>{label}</label>
      <input defaultValue={value} style={{
        width: '100%', height: 38, padding: '0 12px',
        border: `1px solid ${TOKENS.line2}`, borderRadius: 6, background: TOKENS.paper,
        fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink, outline: 'none',
      }} />
      {hint && <div style={{ fontSize: 10.5, color: TOKENS.ink4, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 };

// -----------------------------------------------------------------------------
function ExercicePanel() {
  const years = ['2024', '2025', '2026'];
  const [year, setYear] = React.useState(window.ATLAS_EXERCICE || '2026');
  React.useEffect(() => {
    const onChange = (e) => setYear(e.detail.year);
    window.addEventListener('erp:exercice', onChange);
    return () => window.removeEventListener('erp:exercice', onChange);
  }, []);
  const choose = (y) => {
    window.ATLAS_EXERCICE = y;
    window.dispatchEvent(new CustomEvent('erp:exercice', { detail: { year: y } }));
    window.toast(`Exercice comptable ${y} activé`, 'success');
  };
  return (
    <Panel title="Exercice comptable" desc="Année fiscale active — appliquée à toute l'application (barre supérieure, situations, rapports)" delay={80}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {years.map(y => (
          <button key={y} onClick={() => choose(y)} style={{
            padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${y === year ? TOKENS.ink : TOKENS.line2}`,
            background: y === year ? TOKENS.ink : TOKENS.paper,
            color: y === year ? TOKENS.bg : TOKENS.ink,
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {y}
            {y === year && <Icon name="check" size={14} stroke={TOKENS.bg} />}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>
        Exercice courant : <span style={{ color: TOKENS.ocreDeep, fontWeight: 500 }}>{year}</span> · clôture au 31/12/{year}
      </div>
    </Panel>
  );
}

function SocieteSection() {
  const [logo, setLogo]       = React.useState(null);
  const [favicon, setFavicon] = React.useState(null);
  return (
    <>
      <ExercicePanel />
      <Panel title="Identité visuelle" desc="Logo de l'entreprise — utilisé sur les factures, devis, rapports PDF et le tableau de bord" delay={60} footer={false}>
        <LogoUpload value={logo} onChange={setLogo} label="Logo principal"
          help="Imprimé en entête des factures, devis et rapports — PNG ou SVG, fond transparent, 512×512 px" />
        <div style={{ height: 18 }} />
        <div style={{ borderTop: `1px solid ${TOKENS.line}`, paddingTop: 18 }}>
          <LogoUpload value={favicon} onChange={setFavicon} size={64} label="Favicon"
            help="Icône onglet navigateur · format ICO, PNG ou SVG · 32×32 px" />
        </div>
        {logo && (
          <div style={{ marginTop: 22, padding: 14, background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}` }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 10 }}>APERÇU SUR FACTURE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: TOKENS.paper, borderRadius: 4, border: `1px solid ${TOKENS.line}` }}>
              <img src={logo} alt="logo" style={{ height: 40, maxWidth: 140, objectFit: 'contain' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>Atlas Constructions S.A.</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>FACTURE FA-26-039 · 28/05/2026</div>
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Identité de la société" desc="Informations légales reprises sur les factures, devis et documents officiels" delay={100}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Raison sociale" value="Atlas Constructions S.A." />
          <div style={grid2}>
            <Field label="Forme juridique" value="Société Anonyme" />
            <Field label="Capital social" value="12 000 000 DH" mono />
          </div>
          <div style={grid2}>
            <Field label="ICE" value="002578946000093" mono hint="Identifiant Commun de l'Entreprise" />
            <Field label="Identifiant fiscal (IF)" value="40218756" mono />
          </div>
          <div style={grid2}>
            <Field label="Registre de commerce (RC)" value="Casablanca 284517" mono />
            <Field label="Patente / Taxe professionnelle" value="34218890" mono />
          </div>
          <div style={grid2}>
            <Field label="Affiliation CNSS" value="7785402" mono />
            <Field label="N° agrément BTP" value="Q4 / E5 — qualifié" />
          </div>
        </div>
      </Panel>

      <Panel title="Coordonnées" desc="Adresse du siège social et contacts" delay={160}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Adresse du siège" value="42, Bd Zerktouni, Quartier des Hôpitaux" />
          <div style={grid2}>
            <Field label="Ville" value="Casablanca" />
            <Field label="Code postal" value="20100" mono />
          </div>
          <div style={grid2}>
            <Field label="Téléphone" value="+212 522 48 19 60" mono />
            <Field label="Email" value="contact@atlas-btp.ma" mono />
          </div>
        </div>
      </Panel>
    </>
  );
}

// -----------------------------------------------------------------------------
function FiscalSection() {
  const taux = [
    { label: 'TVA normale', val: '20 %', use: 'Travaux BTP, prestations', actif: true },
    { label: 'TVA réduite', val: '14 %', use: 'Transport, certains travaux', actif: true },
    { label: 'TVA réduite', val: '10 %', use: 'Opérations spécifiques', actif: false },
    { label: 'TVA super-réduite', val: '7 %', use: 'Produits de première nécessité', actif: false },
    { label: 'Exonéré', val: '0 %', use: 'Export, marchés exonérés', actif: true },
  ];
  return (
    <>
      <Panel title="Régime fiscal" desc="Paramètres d'imposition de la société" delay={100}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={grid2}>
            <Field label="Régime TVA" value="Débit (encaissement)" />
            <Field label="Périodicité de déclaration" value="Mensuelle" />
          </div>
          <div style={grid2}>
            <Field label="Taux d'IS" value="31 %" mono hint="Impôt sur les sociétés — barème > 100 M DH" />
            <Field label="Acompte trimestriel IS" value="Activé" />
          </div>
        </div>
      </Panel>

      <Panel title="Taux de TVA" desc="Taux disponibles dans les devis et factures" delay={160} footer={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {taux.map((t, i) => (
            <div key={i} className="erp-row" style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 110px', gap: 14, alignItems: 'center',
              padding: '12px 4px', borderBottom: i < taux.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            }}>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: t.actif ? TOKENS.ink : TOKENS.ink4 }}>{t.val}</span>
              <div>
                <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 2 }}>{t.use}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Toggle on={t.actif} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

// -----------------------------------------------------------------------------
function NumeroSection() {
  const pieces = [
    { label: 'Devis / études', format: 'DV-{AA}-{NNN}', exemple: 'DV-26-015', next: 15 },
    { label: 'Factures client', format: 'FA-{AA}-{NNN}', exemple: 'FA-26-039', next: 39 },
    { label: 'Bons de commande', format: 'BC-{AA}-{NNN}', exemple: 'BC-26-112', next: 112 },
    { label: 'Situations de travaux', format: 'SIT-{CH}-{NN}', exemple: 'SIT-CSB114-05', next: 5 },
    { label: 'Cautions bancaires', format: 'CAU-{AA}-{NNN}', exemple: 'CAU-26-008', next: 8 },
  ];
  return (
    <Panel title="Numérotation des pièces" desc="Format et compteurs des documents générés — {AA} année, {NNN} séquence, {CH} code chantier" delay={100} footer={false}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 200px 150px 90px',
        padding: '0 4px 10px', borderBottom: `1px solid ${TOKENS.line}`,
        fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <span>Type de pièce</span><span>Format</span><span>Prochain numéro</span><span style={{ textAlign: 'right' }}>Séq.</span>
      </div>
      {pieces.map((p, i) => (
        <div key={i} className="erp-row" style={{
          display: 'grid', gridTemplateColumns: '1fr 200px 150px 90px', gap: 14, alignItems: 'center',
          padding: '13px 4px', borderBottom: i < pieces.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
        }}>
          <span style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{p.label}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2, background: TOKENS.bgWarm, padding: '4px 8px', borderRadius: 4, justifySelf: 'start' }}>{p.format}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ocreDeep, fontWeight: 500 }}>{p.exemple}</span>
          <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink3 }}>{String(p.next).padStart(3, '0')}</span>
        </div>
      ))}
    </Panel>
  );
}

// -----------------------------------------------------------------------------
function PaieSection() {
  const cotis = [
    { label: 'CNSS — part salariale', taux: '4,48 %', plaf: '6 000 DH' },
    { label: 'CNSS — part patronale', taux: '8,98 %', plaf: '6 000 DH' },
    { label: 'AMO — part salariale', taux: '2,26 %', plaf: '—' },
    { label: 'AMO — part patronale', taux: '1,85 %', plaf: '—' },
    { label: 'Taxe de formation prof.', taux: '1,60 %', plaf: '—' },
    { label: 'CIMR (cadres)', taux: '3,00 %', plaf: '—' },
  ];
  return (
    <>
      <Panel title="Paramètres de paie" desc="Valeurs appliquées au calcul des bulletins" delay={100}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={grid2}>
            <Field label="SMIG horaire" value="17,10 DH" mono hint="Salaire minimum garanti 2026" />
            <Field label="Durée légale hebdo." value="44 heures" />
          </div>
          <div style={grid2}>
            <Field label="Majoration heures supp. (jour)" value="25 %" mono />
            <Field label="Majoration heures supp. (nuit/férié)" value="50 %" mono />
          </div>
          <div style={grid2}>
            <Field label="Jour de virement des salaires" value="30 du mois" />
            <Field label="Frais professionnels (abattement)" value="20 % · plaf. 2 500 DH" mono />
          </div>
        </div>
      </Panel>

      <Panel title="Taux de cotisations" desc="Barème social en vigueur — Maroc 2026" delay={160} footer={false}>
        <div>
          {cotis.map((c, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 130px', gap: 14, alignItems: 'center',
              padding: '11px 4px', borderBottom: i < cotis.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            }}>
              <span style={{ fontSize: 13, color: TOKENS.ink }}>{c.label}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ocreDeep, fontWeight: 600 }}>{c.taux}</span>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3 }}>plaf. {c.plaf}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

// -----------------------------------------------------------------------------
function IntegrSection() {
  const apps = [
    { name: 'DAMANCOM', desc: 'Télédéclaration CNSS', connected: true, by: 'depuis le 12 jan. 2026' },
    { name: 'SIMPL — DGI', desc: 'Déclaration & paiement TVA en ligne', connected: true, by: 'depuis le 03 fév. 2026' },
    { name: 'Attijariwafa Bank', desc: 'Synchronisation des comptes & virements', connected: true, by: 'temps réel' },
    { name: 'Bank of Africa', desc: 'Synchronisation des comptes', connected: true, by: 'temps réel' },
    { name: 'marchespublics.gov.ma', desc: 'Veille appels d\'offres', connected: false, by: null },
    { name: 'Sage Comptabilité', desc: 'Export écritures comptables', connected: false, by: null },
  ];
  return (
    <Panel title="Intégrations & services" desc="Connexions aux services tiers et administrations" delay={100} footer={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {apps.map((a, i) => (
          <div key={i} className="erp-row" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 4px', borderBottom: i < apps.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 7, flexShrink: 0,
              background: a.connected ? TOKENS.ocreSoft : TOKENS.bgWarm,
              color: a.connected ? TOKENS.ocreDeep : TOKENS.ink4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Manrope', fontWeight: 700, fontSize: 13,
            }}>{a.name.slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500 }}>{a.name}</div>
              <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 2 }}>{a.desc}</div>
            </div>
            {a.connected ? (
              <>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{a.by}</span>
                <Pill tone="green" dot>Connecté</Pill>
              </>
            ) : (
              <Button size="sm">Connecter</Button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

// -----------------------------------------------------------------------------
function DataSection() {
  return (
    <>
      <Panel title="Sauvegarde & sécurité" desc="Protection et conservation des données de l'entreprise" delay={100} footer={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            ['Sauvegarde automatique quotidienne', 'Tous les jours à 02h00 — 30 dernières sauvegardes conservées', true],
            ['Authentification à deux facteurs', 'Obligatoire pour les rôles Direction et Comptabilité', true],
            ['Journal d\'audit', 'Traçabilité des actions sensibles (validation, virement, suppression)', true],
            ['Hébergement des données', 'Datacenter Maroc — conformité loi 09-08 (CNDP)', true],
          ].map(([label, desc, on], i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 4px', borderBottom: i < 3 ? `1px solid ${TOKENS.line}` : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 2 }}>{desc}</div>
              </div>
              <Toggle on={on} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Dernière sauvegarde" desc={false} delay={160} footer={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: TOKENS.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="check" size={18} stroke={TOKENS.green} strokeWidth={2.4} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500 }}>Aujourd'hui à 02h00 — 2,4 Go</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 2 }}>Sauvegarde complète réussie · chiffrée AES-256</div>
          </div>
          <Button icon={<Icon name="arrowDown" size={13} stroke={TOKENS.ink2} />}>Exporter mes données</Button>
        </div>
      </Panel>
    </>
  );
}

// -----------------------------------------------------------------------------
function Toggle({ on: initial }) {
  const [on, setOn] = React.useState(initial);
  return (
    <button onClick={() => setOn(o => !o)} style={{
      width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: on ? TOKENS.green : TOKENS.line2, position: 'relative', padding: 0,
      transition: 'background 160ms ease', flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: 999, background: TOKENS.paper,
        transition: 'left 160ms ease',
      }} />
    </button>
  );
}

Object.assign(window, { Settings });
