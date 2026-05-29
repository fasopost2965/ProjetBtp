/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */
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

const artStatus = (a) => a.stock === 0 ? 'rupture' : a.stock <= a.seuil ? 'bas' : 'ok';

// =============================================================================
function Stock() {
  const [depot, setDepot] = React.useState('all');
  const [cat, setCat] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [q, setQ] = React.useState('');

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
  const movToday = MOUVEMENTS.filter(m => m.date.startsWith('28/05')).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
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
          <Button icon={<Icon name="refresh" size={13} stroke={TOKENS.ink2} />}>Inventaire</Button>
          <Button icon={<Icon name="truck" size={13} stroke={TOKENS.ink2} />}>Bon de sortie</Button>
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
        <MovementsFeed depot={depot} />
      </div>
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
function MovementsFeed({ depot }) {
  let movs = MOUVEMENTS.slice();
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

Object.assign(window, { Stock });
