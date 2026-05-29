/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD, Modal, FieldGroup, TextInput, Select, TextArea */
// =============================================================================
// ERP — Stock / Magasin
// Dépôt central + magasins de chantier · seuils de réappro · mouvements
//   Entrée (BR lié au BC) · Sortie (bon de sortie → chantier) · Transfert · Inventaire
// =============================================================================

const DEPOTS = {
  CASA:  { name: 'Magasin central Casablanca', short: 'Central Casa', type: 'central' },
  'CSB-114': { name: 'Magasin chantier — Marina Casa L3', short: 'Marina Casa', type: 'chantier' },
  'TNG-061': { name: 'Magasin chantier — Port Tanger Med', short: 'Tanger Med', type: 'chantier' },
  'RBT-208': { name: 'Magasin chantier — Tramway Rabat', short: 'Tramway Rabat', type: 'chantier' },
  'AGD-033': { name: 'Magasin chantier — Taghazout Bay', short: 'Taghazout', type: 'chantier' },
};

const CATS = ['Acier', 'Ciment & liants', 'Granulats', 'Quincaillerie', 'EPI & sécurité', 'Consommables', 'Électricité', 'Étanchéité'];

const ARTICLES = [
  { ref: 'ACR-T12', design: 'Acier TOR Ø12 — nuance Fe E500', cat: 'Acier', depot: 'CASA', stock: 42.5, unite: 't', seuil: 15, pu: 9_800, four: 'Sonasid' },
  { ref: 'ACR-T16', design: 'Acier TOR Ø16 — nuance Fe E500', cat: 'Acier', depot: 'CSB-114', stock: 8.2, unite: 't', seuil: 12, pu: 9_650, four: 'Sonasid' },
  { ref: 'ACR-T20', design: 'Acier TOR Ø20 — nuance Fe E500', cat: 'Acier', depot: 'CSB-114', stock: 0, unite: 't', seuil: 8, pu: 9_500, four: 'Sonasid' },
  { ref: 'CIM-CPJ45', design: 'Ciment CPJ 45 — sacs 50 kg', cat: 'Ciment & liants', depot: 'CASA', stock: 1240, unite: 'sac', seuil: 400, pu: 78, four: 'LafargeHolcim' },
  { ref: 'CIM-CPA55', design: 'Ciment CPA 55 — vrac', cat: 'Ciment & liants', depot: 'TNG-061', stock: 6.4, unite: 't', seuil: 10, pu: 1_320, four: 'LafargeHolcim' },
  { ref: 'GRA-04', design: 'Sable lavé 0/4', cat: 'Granulats', depot: 'CSB-114', stock: 185, unite: 'm³', seuil: 60, pu: 145, four: 'Granulats du Souss' },
  { ref: 'GRA-1525', design: 'Gravette 15/25', cat: 'Granulats', depot: 'AGD-033', stock: 38, unite: 'm³', seuil: 50, pu: 165, four: 'Granulats du Souss' },
  { ref: 'QUI-FIL18', design: 'Fil de ligature recuit Ø1,8', cat: 'Quincaillerie', depot: 'CASA', stock: 320, unite: 'kg', seuil: 100, pu: 14, four: 'Sonasid' },
  { ref: 'QUI-CLOU', design: 'Pointes acier 70 mm — caisse 25 kg', cat: 'Quincaillerie', depot: 'CASA', stock: 14, unite: 'caisse', seuil: 8, pu: 380, four: 'Quincaillerie Atlas' },
  { ref: 'EPI-CASQ', design: 'Casque de chantier — norme EN 397', cat: 'EPI & sécurité', depot: 'CASA', stock: 28, unite: 'u', seuil: 40, pu: 65, four: 'Sécurama' },
  { ref: 'EPI-GANT', design: 'Gants manutention cuir — paire', cat: 'EPI & sécurité', depot: 'RBT-208', stock: 6, unite: 'paire', seuil: 30, pu: 32, four: 'Sécurama' },
  { ref: 'EPI-CHAUS', design: 'Chaussures de sécurité S3', cat: 'EPI & sécurité', depot: 'CASA', stock: 52, unite: 'paire', seuil: 25, pu: 280, four: 'Sécurama' },
  { ref: 'CON-DISQ', design: 'Disque à tronçonner Ø230', cat: 'Consommables', depot: 'CSB-114', stock: 145, unite: 'u', seuil: 50, pu: 18, four: 'Quincaillerie Atlas' },
  { ref: 'CON-COFF', design: 'Contreplaqué coffrage 18 mm — 2,5×1,25', cat: 'Consommables', depot: 'CASA', stock: 22, unite: 'plaque', seuil: 60, pu: 240, four: 'Bois & Panneaux' },
  { ref: 'ELE-CABLE', design: 'Câble U1000 R2V 3G2,5 — couronne 100 m', cat: 'Électricité', depot: 'RBT-208', stock: 0, unite: 'cour.', seuil: 5, pu: 1_150, four: 'Électrique du Maroc' },
  { ref: 'ETA-MEMB', design: 'Membrane bitumineuse SBS 4 mm — rouleau', cat: 'Étanchéité', depot: 'TNG-061', stock: 64, unite: 'rouleau', seuil: 30, pu: 420, four: 'SOTRAVO Étanchéité' },
];

const MOUVEMENTS = [
  { type: 'sortie', ref: 'ACR-T16', design: 'Acier TOR Ø16', qte: 4.8, unite: 't', depot: 'CSB-114', dest: 'Lot voiles R+3', doc: 'BS-2026/318', date: '28/05 · 09:12', who: 'H. Bouhsina' },
  { type: 'entree', ref: 'CIM-CPJ45', design: 'Ciment CPJ 45', qte: 600, unite: 'sac', depot: 'CASA', dest: 'BC-2026/0137', doc: 'BR-2026/204', date: '28/05 · 08:40', who: 'Magasin central' },
  { type: 'sortie', ref: 'EPI-GANT', design: 'Gants manutention', qte: 24, unite: 'paire', depot: 'RBT-208', dest: 'Équipe VRD', doc: 'BS-2026/317', date: '27/05 · 16:55', who: 'M. Idrissi' },
  { type: 'transfert', ref: 'GRA-04', design: 'Sable lavé 0/4', qte: 40, unite: 'm³', depot: 'CASA', dest: '→ CSB-114', doc: 'BT-2026/061', date: '27/05 · 14:20', who: 'Logistique' },
  { type: 'entree', ref: 'ETA-MEMB', design: 'Membrane SBS 4 mm', qte: 80, unite: 'rouleau', depot: 'TNG-061', dest: 'BC-2026/0133', doc: 'BR-2026/203', date: '27/05 · 11:05', who: 'Magasin Tanger' },
  { type: 'sortie', ref: 'CON-DISQ', design: 'Disque tronçonner Ø230', qte: 60, unite: 'u', depot: 'CSB-114', dest: 'Atelier ferraillage', doc: 'BS-2026/316', date: '27/05 · 10:30', who: 'H. Bouhsina' },
  { type: 'inventaire', ref: 'ACR-T20', design: 'Acier TOR Ø20', qte: -2.1, unite: 't', depot: 'CSB-114', dest: 'Écart inventaire', doc: 'INV-2026/12', date: '26/05 · 17:00', who: 'Contrôle gestion' },
];

const MOV_TONE = {
  entree:     { label: 'Entrée', tone: 'green', sign: '+' },
  sortie:     { label: 'Sortie', tone: 'ocre', sign: '–' },
  transfert:  { label: 'Transfert', tone: 'blue', sign: '±' },
  inventaire: { label: 'Inventaire', tone: 'red', sign: 'Δ' },
};

const CHANTIER_CODES = ['CSB-114', 'RBT-208', 'TNG-061', 'AGD-033', 'MEK-019', 'OUJ-007'];

const MOTIF_ECART = ['Erreur de comptage', 'Vol', 'Casse', 'Perte', 'Erreur de saisie', 'Autre'];

const artStatus = (a) => a.stock === 0 ? 'rupture' : a.stock <= a.seuil ? 'bas' : 'ok';

// =============================================================================
function Stock() {
  const [depot, setDepot] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [mouvements, setMouvements] = React.useState(MOUVEMENTS.slice());

  // Modal open states
  const [bsSortieOpen, setBsSortieOpen] = React.useState(false);
  const [transfertOpen, setTransfertOpen] = React.useState(false);
  const [inventaireOpen, setInventaireOpen] = React.useState(false);

  let rows = ARTICLES.slice();
  if (depot !== 'all') rows = rows.filter(a => a.depot === depot);
  if (cat !== 'all') rows = rows.filter(a => a.cat === cat);
  if (statusFilter !== 'all') rows = rows.filter(a => artStatus(a) === statusFilter);
  if (q) { const Q = q.toLowerCase(); rows = rows.filter(a => (a.ref + ' ' + a.design + ' ' + a.four).toLowerCase().includes(Q)); }
  rows.sort((a, b) => {
    const order = { rupture: 0, bas: 1, ok: 2 };
    return order[artStatus(a)] - order[artStatus(b)];
  });

  const base = depot === 'all' ? ARTICLES : ARTICLES.filter(a => a.depot === depot);
  const valeur = base.reduce((s, a) => s + a.stock * a.pu, 0);
  const sousSeuil = base.filter(a => artStatus(a) === 'bas').length;
  const ruptures = base.filter(a => artStatus(a) === 'rupture').length;
  const movToday = mouvements.filter(m => m.date.startsWith('28/05')).length;

  // Articles en rupture pour la bannière d'alerte
  const alertArticles = base.filter(a => artStatus(a) === 'rupture');
  const alertBas = base.filter(a => artStatus(a) === 'bas');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ── Alertes banner (visible seulement si ruptures ou sous-seuil) ── */}
      {(alertArticles.length > 0 || alertBas.length > 0) && (
        <div className="erp-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alertArticles.length > 0 && (
            <div style={{
              padding: '12px 18px',
              background: TOKENS.redSoft,
              border: `1px solid ${TOKENS.red}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="alert" size={16} stroke={TOKENS.red} />
                <div>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: TOKENS.red }}>
                    {alertArticles.length} article{alertArticles.length > 1 ? 's' : ''} en rupture de stock
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.red, marginLeft: 10, opacity: 0.8 }}>
                    {alertArticles.map(a => a.ref).join(' · ')}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ocre"
                icon={<Icon name="purchase" size={12} stroke={TOKENS.ocreDeep} />}
                onClick={() => window.toast('Bon de commande généré', 'success', `${alertArticles.length} référence${alertArticles.length > 1 ? 's' : ''} en rupture`)}
              >
                Générer BC
              </Button>
            </div>
          )}
          {alertBas.length > 0 && (
            <div style={{
              padding: '10px 18px',
              background: TOKENS.amberSoft,
              border: `1px solid ${TOKENS.amber}`,
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="warning" size={15} stroke={TOKENS.amber} />
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 500, color: 'oklch(0.45 0.10 75)' }}>
                  {alertBas.length} article{alertBas.length > 1 ? 's' : ''} sous le seuil de réapprovisionnement
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => window.toast('Bon de commande généré', 'success', `${alertBas.length} référence${alertBas.length > 1 ? 's' : ''} sous seuil`)}
                icon={<Icon name="purchase" size={12} stroke={TOKENS.ink2} />}
              >
                Générer BC
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            STOCK · GESTION DES MAGASINS
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Inventaire & mouvements <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· {Object.keys(DEPOTS).length} dépôts</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            icon={<Icon name="refresh" size={13} stroke={TOKENS.ink2} />}
            onClick={() => setInventaireOpen(true)}
          >
            Inventaire
          </Button>
          <Button
            icon={<Icon name="arrowRight" size={13} stroke={TOKENS.ink2} />}
            onClick={() => setTransfertOpen(true)}
          >
            Transfert
          </Button>
          <Button
            icon={<Icon name="truck" size={13} stroke={TOKENS.ink2} />}
            onClick={() => setBsSortieOpen(true)}
          >
            Bon de sortie
          </Button>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>Réceptionner</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <StKpi label="VALEUR DU STOCK" value={fmtMAD(valeur)} sub={`DH · ${depot === 'all' ? 'tous dépôts' : DEPOTS[depot].short}`} delay={60} tone="ink" />
        <StKpi label="SOUS LE SEUIL" value={sousSeuil} sub="à réapprovisionner" tone="amber" delay={120} active={statusFilter === 'bas'} onClick={() => setStatusFilter(statusFilter === 'bas' ? 'all' : 'bas')} />
        <StKpi label="EN RUPTURE" value={ruptures} sub="commande urgente" tone="red" delay={180} active={statusFilter === 'rupture'} onClick={() => setStatusFilter(statusFilter === 'rupture' ? 'all' : 'rupture')} />
        <StKpi label="MOUVEMENTS — AUJOURD'HUI" value={movToday} sub="entrées / sorties" delay={240} />
        <StKpi label="RÉFÉRENCES SUIVIES" value={base.length} sub="articles actifs" delay={300} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
      </div>

      {/* Dépôt tabs */}
      <div className="erp-fade-in" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginRight: 2 }}>DÉPÔT</span>
        {[['all', 'Tous'], ...Object.entries(DEPOTS).map(([id, d]) => [id, d.short])].map(([id, label]) => {
          const on = depot === id;
          const isChantier = id !== 'all' && DEPOTS[id].type === 'chantier';
          return (
            <button key={id} onClick={() => setDepot(id)} style={{
              height: 32, padding: '0 12px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${on ? TOKENS.ink : TOKENS.line2}`,
              background: on ? TOKENS.ink : TOKENS.paper, color: on ? TOKENS.bg : TOKENS.ink2,
              fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name={isChantier ? 'sites' : 'box'} size={12} stroke={on ? TOKENS.ocre : TOKENS.ink3} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Two-col: articles + movements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,340px)', gap: 16, alignItems: 'start' }}>
        {/* Articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* filters */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 36,
              background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6 }}>
              <Icon name="search" size={14} stroke={TOKENS.ink3} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Référence, désignation, fournisseur…"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13 }} />
            </div>
            <CatChips value={cat} onChange={setCat} />
          </div>

          <ArticleTable rows={rows} />
        </div>

        {/* Movements feed */}
        <MovementsFeed depot={depot} mouvements={mouvements} />
      </div>

      {/* ── Modals ── */}
      <BonSortieModal
        open={bsSortieOpen}
        onClose={() => setBsSortieOpen(false)}
        onConfirm={(mouv) => {
          setMouvements(prev => [mouv, ...prev]);
          setBsSortieOpen(false);
        }}
      />
      <TransfertModal
        open={transfertOpen}
        onClose={() => setTransfertOpen(false)}
        onConfirm={() => setTransfertOpen(false)}
      />
      <InventaireModal
        open={inventaireOpen}
        onClose={() => setInventaireOpen(false)}
        onConfirm={(mouvs) => {
          setMouvements(prev => [...mouvs, ...prev]);
          setInventaireOpen(false);
        }}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
function StKpi({ label, value, sub, tone, delay, active, onClick }) {
  const dark = tone === 'ink';
  const toneColors = { amber: TOKENS.amber, red: TOKENS.red };
  const accent = toneColors[tone];
  return (
    <button onClick={onClick} className="erp-card erp-fade-in" style={{
      animationDelay: delay + 'ms',
      background: dark ? TOKENS.ink : (active ? TOKENS.bgWarm : TOKENS.paper),
      border: `1px solid ${active ? TOKENS.ink : (dark ? TOKENS.ink : TOKENS.line)}`,
      borderRadius: 8, padding: 16, textAlign: 'left', cursor: onClick ? 'pointer' : 'default', fontFamily: 'inherit',
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
function CatChips({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {[['all', 'Toutes'], ...CATS.map(c => [c, c])].map(([id, label]) => {
        const on = value === id;
        return (
          <button key={id} onClick={() => onChange(on ? 'all' : id)} style={{
            height: 30, padding: '0 11px', borderRadius: 6, cursor: 'pointer',
            border: `1px solid ${on ? TOKENS.ocre : TOKENS.line2}`,
            background: on ? TOKENS.ocreSoft : TOKENS.paper, color: on ? TOKENS.ocreDeep : TOKENS.ink2,
            fontFamily: 'IBM Plex Sans', fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap',
          }}>{label}</button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
function ArticleTable({ rows }) {
  const cols = 'minmax(0,1fr) 110px 130px minmax(110px,140px)';
  if (rows.length === 0) return (
    <Card padding={40} style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 8 }}>AUCUN ARTICLE</div>
      <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, margin: 0, color: TOKENS.ink }}>Aucune référence pour ces filtres.</h3>
    </Card>
  );
  return (
    <Card padding={0} delay={360}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 12, padding: '11px 18px', background: TOKENS.bg,
        borderBottom: `1px solid ${TOKENS.line}`, fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span>Article</span>
        <span style={{ textAlign: 'right' }}>Stock</span>
        <span>Niveau / seuil</span>
        <span style={{ textAlign: 'right' }}>Valeur</span>
      </div>
      {rows.map((a, i) => {
        const status = artStatus(a);
        const ratio = a.seuil > 0 ? Math.min(150, (a.stock / a.seuil) * 100) : 100;
        const tone = status === 'rupture' ? 'red' : status === 'bas' ? 'amber' : 'green';
        const statusPill = { rupture: ['Rupture', 'red'], bas: ['Sous seuil', 'amber'], ok: ['En stock', 'green'] }[status];
        return (
          <div key={a.ref} className="erp-row" style={{ display: 'grid', gridTemplateColumns: cols, gap: 12,
            padding: '12px 18px', borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.design}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep }}>{a.ref}</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>· {a.cat} · {DEPOTS[a.depot].short}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 500, color: status === 'rupture' ? TOKENS.red : TOKENS.ink }}>
                {a.stock.toLocaleString('fr-FR')}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 1 }}>{a.unite}</div>
            </div>
            <div>
              <div style={{ marginBottom: 5 }}><Pill tone={statusPill[1]} dot>{statusPill[0]}</Pill></div>
              <div style={{ position: 'relative' }}>
                <Progress value={ratio > 100 ? 100 : ratio} tone={tone} height={5} />
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, marginTop: 3 }}>seuil {a.seuil} {a.unite}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{fmtMAD(a.stock * a.pu)}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>DH</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
function MovementsFeed({ depot, mouvements }) {
  const allMovs = mouvements || MOUVEMENTS;
  let movs = allMovs.slice();
  if (depot !== 'all') movs = movs.filter(m => m.depot === depot);
  return (
    <Card padding={0} delay={420} style={{ position: 'sticky', top: 80 }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 4 }}>JOURNAL</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink }}>Mouvements récents</div>
        </div>
        <Pill mono>{movs.length}</Pill>
      </div>
      <div style={{ maxHeight: 540, overflowY: 'auto' }}>
        {movs.length === 0 && (
          <div style={{ padding: 28, textAlign: 'center', fontSize: 12, color: TOKENS.ink3 }}>Aucun mouvement sur ce dépôt.</div>
        )}
        {movs.map((m, i) => {
          const mt = MOV_TONE[m.type];
          const linksBC = m.type === 'entree' && m.dest.startsWith('BC-');
          return (
            <div key={i} className="erp-row" style={{ padding: '12px 16px', borderBottom: i < movs.length - 1 ? `1px solid ${TOKENS.line}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <Pill tone={mt.tone} dot>{mt.label}</Pill>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600,
                  color: m.type === 'entree' ? TOKENS.green : m.type === 'inventaire' ? TOKENS.red : TOKENS.ink }}>
                  {mt.sign}{Math.abs(m.qte).toLocaleString('fr-FR')} {m.unite}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{m.design}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 3 }}>
                {m.ref} · {DEPOTS[m.depot].short}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: linksBC ? TOKENS.ocreDeep : TOKENS.ink2, fontWeight: linksBC ? 500 : 400 }}>
                  {m.dest}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3 }}>{m.date}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '10px 16px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg }}>
        <a href="#achats" style={{ textDecoration: 'none' }}>
          <Button size="sm" style={{ width: '100%', justifyContent: 'center' }} iconRight={<Icon name="arrowRight" size={12} stroke={TOKENS.ink2} />}>
            Voir les bons de commande
          </Button>
        </a>
      </div>
    </Card>
  );
}

// =============================================================================
// MODAL — Bon de sortie
// =============================================================================
function BonSortieModal({ open, onClose, onConfirm }) {
  const [depotSrc, setDepotSrc] = React.useState('CASA');
  const [chantierDest, setChantierDest] = React.useState(CHANTIER_CODES[0]);
  const [lignes, setLignes] = React.useState([{ ref: '', qte: 1 }]);
  const [motif, setMotif] = React.useState('');
  const [demandeur, setDemandeur] = React.useState('');
  const [date, setDate] = React.useState('');
  const [bsNum] = React.useState(() => String(Math.floor(Math.random() * 900) + 319));

  const addLigne = () => setLignes(prev => [...prev, { ref: '', qte: 1 }]);
  const removeLigne = (i) => setLignes(prev => prev.filter((_, idx) => idx !== i));
  const updateLigne = (i, field, val) => setLignes(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));

  const handleConfirm = () => {
    const firstRef = lignes[0]?.ref;
    const art = ARTICLES.find(a => a.ref === firstRef);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const mouv = {
      type: 'sortie',
      ref: firstRef || '—',
      design: art ? art.design : firstRef,
      qte: Number(lignes[0]?.qte) || 1,
      unite: art ? art.unite : 'u',
      depot: depotSrc,
      dest: chantierDest + (motif ? ' · ' + motif : ''),
      doc: 'BS-2026/' + bsNum,
      date: `${dd}/${mm} · ${String(today.getHours()).padStart(2,'0')}:${String(today.getMinutes()).padStart(2,'0')}`,
      who: demandeur || 'Magasin',
    };
    onConfirm(mouv);
    window.toast('Bon de sortie BS-' + bsNum + ' enregistré', 'success', `${lignes.length} article${lignes.length > 1 ? 's' : ''} · ${DEPOTS[depotSrc]?.short} → ${chantierDest}`);
  };

  const depotOptions = Object.entries(DEPOTS).map(([id, d]) => [id, d.short]);
  const articleOptions = [['', '— Sélectionner —'], ...ARTICLES.map(a => [a.ref, `${a.ref} · ${a.design.slice(0, 35)}`])];
  const chantierOptions = CHANTIER_CODES;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bon de sortie"
      subtitle={`BS-2026/${bsNum} · Sortie de stock vers chantier`}
      width={640}
      footer={
        <>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={handleConfirm} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
            Enregistrer le bon
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FieldGroup label="Dépôt source" required>
            <Select value={depotSrc} onChange={setDepotSrc} options={depotOptions} />
          </FieldGroup>
          <FieldGroup label="Chantier destination" required>
            <Select value={chantierDest} onChange={setChantierDest} options={chantierOptions} />
          </FieldGroup>
        </div>

        <FieldGroup label="Articles" required>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 28px',
              gap: 8, fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3,
              letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 4px', marginBottom: 4,
            }}>
              <span>Article</span><span>Quantité</span><span />
            </div>
            {lignes.map((l, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 28px', gap: 8, alignItems: 'center' }}>
                <Select value={l.ref} onChange={v => updateLigne(i, 'ref', v)} options={articleOptions} />
                <input
                  type="number"
                  min={1}
                  value={l.qte}
                  onChange={e => updateLigne(i, 'qte', e.target.value)}
                  style={{
                    height: 38, padding: '0 10px',
                    border: `1px solid ${TOKENS.line2}`, borderRadius: 6,
                    fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink,
                    background: TOKENS.paper, textAlign: 'right', outline: 'none', width: '100%',
                  }}
                />
                <button
                  onClick={() => removeLigne(i)}
                  disabled={lignes.length === 1}
                  style={{
                    width: 28, height: 28, borderRadius: 5,
                    background: 'transparent', border: `1px solid ${TOKENS.line2}`,
                    cursor: lignes.length === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: lignes.length === 1 ? 0.3 : 1,
                  }}
                >
                  <Icon name="x" size={12} stroke={TOKENS.ink3} />
                </button>
              </div>
            ))}
            <button
              onClick={addLigne}
              style={{
                height: 34, border: `1px dashed ${TOKENS.line2}`, borderRadius: 6,
                background: 'transparent', cursor: 'pointer',
                fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Icon name="plus" size={12} stroke={TOKENS.ink3} />
              Ajouter un article
            </button>
          </div>
        </FieldGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FieldGroup label="Demandeur" required>
            <TextInput value={demandeur} onChange={setDemandeur} placeholder="Nom du demandeur" />
          </FieldGroup>
          <FieldGroup label="Date">
            <TextInput value={date} onChange={setDate} type="date" />
          </FieldGroup>
        </div>

        <FieldGroup label="Motif / destination">
          <TextInput value={motif} onChange={setMotif} placeholder="Ex: Lot voiles R+3, ferraillage dalle…" />
        </FieldGroup>
      </div>
    </Modal>
  );
}

// =============================================================================
// MODAL — Transfert inter-dépôts
// =============================================================================
function TransfertModal({ open, onClose, onConfirm }) {
  const [depotSrc,  setDepotSrc]  = React.useState('CASA');
  const [depotDest, setDepotDest] = React.useState('CSB-114');
  const [article,   setArticle]   = React.useState('');
  const [qte,       setQte]       = React.useState(1);
  const [motif,     setMotif]     = React.useState('');
  const [btNum] = React.useState(() => String(Math.floor(Math.random() * 900) + 62));

  const depotOptions = Object.entries(DEPOTS).map(([id, d]) => [id, d.short]);
  const articleOptions = [['', '— Sélectionner —'], ...ARTICLES.map(a => [a.ref, `${a.ref} · ${a.design.slice(0, 35)}`])];

  const handleConfirm = () => {
    onConfirm();
    const srcLabel = DEPOTS[depotSrc]?.short || depotSrc;
    const destLabel = DEPOTS[depotDest]?.short || depotDest;
    window.toast(`Transfert BT-2026/${btNum} enregistré`, 'success', `${srcLabel} → ${destLabel}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transfert inter-dépôts"
      subtitle={`BT-2026/${btNum} · Mouvement entre magasins`}
      width={560}
      footer={
        <>
          <Button onClick={onClose}>Annuler</Button>
          <Button variant="primary" onClick={handleConfirm} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
            Confirmer le transfert
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FieldGroup label="Dépôt source" required>
            <Select value={depotSrc} onChange={setDepotSrc} options={depotOptions} />
          </FieldGroup>
          <FieldGroup label="Dépôt destination" required>
            <Select value={depotDest} onChange={setDepotDest} options={depotOptions} />
          </FieldGroup>
        </div>

        {depotSrc === depotDest && (
          <div style={{
            padding: '10px 14px', background: TOKENS.amberSoft,
            border: `1px solid ${TOKENS.amber}`, borderRadius: 6,
            fontSize: 12, color: 'oklch(0.45 0.10 75)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="warning" size={13} stroke={TOKENS.amber} />
            Le dépôt source et destination sont identiques.
          </div>
        )}

        <FieldGroup label="Article" required>
          <Select value={article} onChange={setArticle} options={articleOptions} />
        </FieldGroup>

        <FieldGroup label="Quantité" required>
          <input
            type="number"
            min={1}
            value={qte}
            onChange={e => setQte(e.target.value)}
            style={{
              width: '100%', height: 38, padding: '0 12px',
              border: `1px solid ${TOKENS.line2}`, borderRadius: 6,
              fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink,
              background: TOKENS.paper, outline: 'none',
            }}
          />
        </FieldGroup>

        <FieldGroup label="Motif du transfert">
          <TextInput value={motif} onChange={setMotif} placeholder="Ex: Réallocation besoins chantier, rupture de stock…" />
        </FieldGroup>

        {depotSrc && depotDest && depotSrc !== depotDest && (
          <div style={{
            padding: '12px 14px', background: TOKENS.blueSoft,
            border: `1px solid ${TOKENS.blue}`, borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: TOKENS.blue,
          }}>
            <Icon name="arrowRight" size={14} stroke={TOKENS.blue} />
            <span>
              <b>{DEPOTS[depotSrc]?.short}</b> → <b>{DEPOTS[depotDest]?.short}</b>
              {qte > 0 && <span style={{ fontFamily: 'IBM Plex Mono', marginLeft: 8, fontSize: 11 }}>· {qte} unité{qte > 1 ? 's' : ''}</span>}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}

// =============================================================================
// MODAL — Inventaire physique
// =============================================================================
function InventaireModal({ open, onClose, onConfirm }) {
  const [lignes, setLignes] = React.useState(() =>
    ARTICLES.map(a => ({ ref: a.ref, design: a.design, theorique: a.stock, reel: a.stock, motif: '', unite: a.unite, depot: a.depot }))
  );
  const [invNum] = React.useState(() => String(Math.floor(Math.random() * 900) + 13));

  const updateReel = (ref, val) =>
    setLignes(prev => prev.map(l => l.ref === ref ? { ...l, reel: val === '' ? '' : Number(val) } : l));
  const updateMotif = (ref, val) =>
    setLignes(prev => prev.map(l => l.ref === ref ? { ...l, motif: val } : l));

  const lignesAvecEcart = lignes.filter(l => Number(l.reel) !== l.theorique);

  const handleConfirm = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dateStr = `${dd}/${mm} · ${String(today.getHours()).padStart(2,'0')}:${String(today.getMinutes()).padStart(2,'0')}`;

    const mouvements = lignesAvecEcart.map(l => {
      const ecart = Number(l.reel) - l.theorique;
      return {
        type: 'inventaire',
        ref: l.ref,
        design: l.design,
        qte: ecart,
        unite: l.unite,
        depot: l.depot,
        dest: `Écart inventaire${l.motif ? ' · ' + l.motif : ''}`,
        doc: 'INV-2026/' + invNum,
        date: dateStr,
        who: 'Contrôle gestion',
      };
    });

    onConfirm(mouvements);
    window.toast(
      `Inventaire INV-2026/${invNum} validé`,
      'success',
      `${lignesAvecEcart.length} écart${lignesAvecEcart.length > 1 ? 's' : ''} constaté${lignesAvecEcart.length > 1 ? 's' : ''}`
    );
  };

  const cols = '80px 1fr 70px 90px 90px 80px 1fr';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Inventaire physique"
      subtitle={`INV-2026/${invNum} · Comptage et régularisation des stocks`}
      width={900}
      footer={
        <>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}
          >
            Valider l'inventaire ({lignesAvecEcart.length} écart{lignesAvecEcart.length > 1 ? 's' : ''})
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: cols, gap: 10,
          padding: '10px 14px', background: TOKENS.ink,
          borderRadius: '6px 6px 0 0',
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.bg,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>Réf.</span>
          <span>Désignation</span>
          <span style={{ textAlign: 'center' }}>Unité</span>
          <span style={{ textAlign: 'right' }}>Théorique</span>
          <span style={{ textAlign: 'right', color: TOKENS.ocre }}>Réel ✎</span>
          <span style={{ textAlign: 'right' }}>Écart</span>
          <span>Motif d'écart</span>
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto', border: `1px solid ${TOKENS.line}`, borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
          {lignes.map((l, i) => {
            const reelVal = l.reel === '' ? 0 : Number(l.reel);
            const ecart = reelVal - l.theorique;
            const hasEcart = ecart !== 0;
            return (
              <div key={l.ref} className="erp-row" style={{
                display: 'grid', gridTemplateColumns: cols, gap: 10,
                padding: '10px 14px', alignItems: 'center',
                borderBottom: i < lignes.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
                background: hasEcart ? (ecart < 0 ? TOKENS.redSoft : TOKENS.greenSoft) : 'transparent',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ocreDeep }}>{l.ref}</span>
                <span style={{ fontSize: 12.5, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {l.design}
                </span>
                <span style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{l.unite}</span>
                <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12.5, color: TOKENS.ink2 }}>
                  {l.theorique.toLocaleString('fr-FR')}
                </span>
                <input
                  type="number"
                  value={l.reel}
                  onChange={e => updateReel(l.ref, e.target.value)}
                  style={{
                    height: 32, padding: '0 8px',
                    border: `1px solid ${hasEcart ? (ecart < 0 ? TOKENS.red : TOKENS.green) : TOKENS.line2}`,
                    borderRadius: 4, background: TOKENS.paper, outline: 'none',
                    fontFamily: 'IBM Plex Mono', fontSize: 12.5,
                    color: hasEcart ? (ecart < 0 ? TOKENS.red : TOKENS.green) : TOKENS.ink,
                    fontWeight: hasEcart ? 600 : 400,
                    textAlign: 'right', width: '100%',
                  }}
                />
                <span style={{
                  textAlign: 'right',
                  fontFamily: 'IBM Plex Mono', fontSize: 12.5, fontWeight: 600,
                  color: !hasEcart ? TOKENS.ink3 : (ecart < 0 ? TOKENS.red : TOKENS.green),
                }}>
                  {!hasEcart ? '—' : (ecart > 0 ? '+' : '') + ecart.toLocaleString('fr-FR')}
                </span>
                <div>
                  {hasEcart ? (
                    <select
                      value={l.motif}
                      onChange={e => updateMotif(l.ref, e.target.value)}
                      style={{
                        width: '100%', height: 32, padding: '0 8px',
                        border: `1px solid ${TOKENS.line2}`, borderRadius: 4,
                        background: TOKENS.paper, fontFamily: 'IBM Plex Sans', fontSize: 11.5,
                        color: TOKENS.ink, outline: 'none', appearance: 'none',
                      }}
                    >
                      <option value="">— Motif —</option>
                      {MOTIF_ECART.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <span style={{ fontSize: 11, color: TOKENS.ink4, fontFamily: 'IBM Plex Mono' }}>Pas d'écart</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lignesAvecEcart.length > 0 && (
          <div style={{
            marginTop: 14, padding: '12px 14px',
            background: TOKENS.amberSoft, border: `1px solid ${TOKENS.amber}`, borderRadius: 6,
            fontSize: 12.5, color: 'oklch(0.45 0.10 75)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="warning" size={14} stroke={TOKENS.amber} />
            <span>
              <b>{lignesAvecEcart.length} article{lignesAvecEcart.length > 1 ? 's' : ''}</b> avec écart — des mouvements d'inventaire seront générés automatiquement.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}

Object.assign(window, { Stock });
