/* global React, TOKENS, Icon, Pill, Card, Button, Modal, FieldGroup, TextInput, Select, Radio, LogoUpload, EmptyState, ExportMenu */
// =============================================================================
// ERP — Clients
// Types: entreprise · particulier · collectivité (commune, état, public)
// Avec gestion logo + interconnexion chantiers/factures/devis
// =============================================================================

const CLIENT_TYPES = {
  entreprise:    { label: 'Entreprise',   tone: 'blue',  icon: 'sites' },
  collectivite:  { label: 'Collectivité', tone: 'ocre',  icon: 'shield' },
  particulier:   { label: 'Particulier',  tone: 'green', icon: 'user' },
  administration:{ label: 'Administration', tone: 'amber', icon: 'doc' },
};

const SEED_CLIENTS = [
  { id: 1, type: 'entreprise',  name: 'Al Omrane',                     code: 'AO',  ice: '000123456000078', city: 'Rabat',     contact: 'M. R. Bouchaib',  email: 'r.bouchaib@alomrane.ma',  phone: '+212 537 28 19 45',  ca: 84_500_000, chantiers: 1, factures: 12, statut: 'actif', encours: 2_140_000, logo: null, accent: TOKENS.ocre },
  { id: 2, type: 'entreprise',  name: 'STRS — Société Tramway Rabat-Salé', code: 'STR', ice: '000564789000056', city: 'Rabat',     contact: 'Mme N. Kabbaj',   email: 'n.kabbaj@strs.ma',         phone: '+212 537 28 88 00',  ca: 142_000_000, chantiers: 1, factures: 4, statut: 'actif', encours: 6_240_000, logo: null, accent: TOKENS.blue },
  { id: 3, type: 'entreprise',  name: 'TMSA — Tanger Med',             code: 'TMS', ice: '001874512000017', city: 'Tanger',    contact: 'M. M. Tazi',      email: 'tazi@tmsa.ma',            phone: '+212 539 39 41 00',  ca: 67_300_000, chantiers: 1, factures: 8, statut: 'actif', encours: 1_840_000, logo: null, accent: TOKENS.green },
  { id: 4, type: 'entreprise',  name: 'Aksal Group',                   code: 'AKS', ice: '002214785000044', city: 'Casablanca', contact: 'M. K. Berrada',   email: 'k.berrada@aksal.ma',      phone: '+212 522 48 77 00',  ca: 124_200_000, chantiers: 1, factures: 18, statut: 'actif', encours: 4_120_000, logo: null, accent: TOKENS.ocre },
  { id: 5, type: 'collectivite', name: 'Commune de Sidi Bernoussi',     code: 'CSB', ice: '000098765000033', city: 'Casablanca', contact: 'M. le Président', email: 'president@csb.gov.ma',    phone: '+212 522 35 12 00',  ca: 28_900_000, chantiers: 2, factures: 9, statut: 'attention', encours: 12_700_000, logo: null, accent: TOKENS.amber },
  { id: 6, type: 'administration', name: 'ADM — Autoroutes du Maroc',  code: 'ADM', ice: '000222111000058', city: 'Rabat',     contact: 'Mme F. Chraïbi',  email: 'f.chraibi@adm.gov.ma',    phone: '+212 537 71 71 00',  ca: 56_700_000, chantiers: 1, factures: 5, statut: 'actif', encours: 980_000,   logo: null, accent: TOKENS.blue },
  { id: 7, type: 'entreprise',  name: 'SAPST Hôtels',                  code: 'SAP', ice: '001845712000022', city: 'Agadir',    contact: 'M. H. Lakhdar',   email: 'h.lakhdar@sapst.ma',      phone: '+212 528 84 12 00',  ca: 38_900_000, chantiers: 1, factures: 6, statut: 'actif', encours: 720_000,   logo: null, accent: TOKENS.green },
  { id: 8, type: 'particulier', name: 'Famille Bennani',               code: 'BEN', ice: '—',              city: 'Marrakech', contact: 'M. & Mme Bennani', email: 'a.bennani@gmail.com',     phone: '+212 661 24 18 90',  ca: 4_800_000,  chantiers: 1, factures: 3, statut: 'actif', encours: 0,         logo: null, accent: TOKENS.ink3 },
  { id: 9, type: 'collectivite', name: 'Région Casablanca-Settat',     code: 'RCS', ice: '000345678000091', city: 'Casablanca', contact: 'Direction technique', email: 'travaux@cs-region.ma',phone: '+212 522 45 80 00',  ca: 21_400_000, chantiers: 1, factures: 2, statut: 'actif', encours: 2_840_000, logo: null, accent: TOKENS.ocre },
];

// -----------------------------------------------------------------------------
function Clients() {
  const store = window.useStore ? window.useStore() : null;
  const [list, setList]     = React.useState(SEED_CLIENTS);
  const [filter, setFilter] = React.useState('all');
  const [q, setQ]           = React.useState('');
  const [open, setOpen]     = React.useState(null);  // detail panel id
  const [createOpen, setCreateOpen] = React.useState(false);

  React.useEffect(() => {
    const h = (e) => { if (e.detail?.key === 'newClient') setCreateOpen(true); };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  const counts = Object.fromEntries(Object.keys(CLIENT_TYPES).map(t => [t, list.filter(c => c.type === t).length]));
  const totalCA      = list.reduce((s, c) => s + c.ca, 0);
  const totalEncours = list.reduce((s, c) => s + c.encours, 0);

  let rows = list;
  if (filter !== 'all') rows = rows.filter(c => c.type === filter);
  if (q) rows = rows.filter(c => (c.name + c.code + c.city).toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            CLIENTS · {list.length} EN BASE
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Annuaire clients <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· entreprises, collectivités, particuliers</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportMenu name="Annuaire clients" />
          <Button variant="primary" onClick={() => setCreateOpen(true)} icon={<Icon name="plus" size={14} stroke={TOKENS.bg} />}>
            Nouveau client
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <Card padding={16} delay={60}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 8 }}>CLIENTS ACTIFS</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 24, color: TOKENS.ink, letterSpacing: '-0.02em' }}>{list.filter(c => c.statut === 'actif').length}</div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 6 }}>{list.filter(c => c.statut === 'attention').length} en surveillance</div>
        </Card>
        <Card padding={16} delay={120}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 8 }}>CA CUMULÉ</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 24, color: TOKENS.ink, letterSpacing: '-0.02em' }}>{(totalCA / 1e6).toFixed(0)} <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink3 }}>M DH</span></div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.green, marginTop: 6 }}>+12% vs 2025</div>
        </Card>
        <Card padding={16} delay={180}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 8 }}>ENCOURS</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 24, color: TOKENS.amber, letterSpacing: '-0.02em' }}>{(totalEncours / 1e6).toFixed(1)} <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: TOKENS.ink3 }}>M DH</span></div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 6 }}>à relancer · 12,7 M en contentieux</div>
        </Card>
        <Card padding={16} delay={240}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 8 }}>RÉPARTITION</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {Object.entries(CLIENT_TYPES).map(([id, t]) => {
              const pct = counts[id] / list.length * 100;
              const colors = { blue: TOKENS.blue, ocre: TOKENS.ocre, green: TOKENS.green, amber: TOKENS.amber };
              return <div key={id} title={`${t.label} · ${counts[id]}`} style={{ height: 26, width: `${pct}%`, background: colors[t.tone], borderRadius: 3 }} />;
            })}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(CLIENT_TYPES).map(([id, t]) => <span key={id}>{counts[id]} {t.label.slice(0, 4).toLowerCase()}.</span>)}
          </div>
        </Card>
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="erp-search" style={{
          flex: 1, minWidth: 280, display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 14px', height: 40, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6,
        }}>
          <Icon name="search" size={15} stroke={TOKENS.ink3} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un client par nom, code, ville…"
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13.5 }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['all', 'Tous', list.length], ...Object.entries(CLIENT_TYPES).map(([id, t]) => [id, t.label, counts[id]])].map(([id, label, n]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: '8px 12px', borderRadius: 5, cursor: 'pointer',
              background: filter === id ? TOKENS.ink : TOKENS.bgWarm,
              color: filter === id ? TOKENS.bg : TOKENS.ink2, border: 'none',
              fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {label} <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, opacity: 0.7 }}>{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {rows.length === 0 ? (
        <Card padding={0}><EmptyState icon="user" title="Aucun client trouvé" desc="Essayez d'élargir vos filtres ou ajoutez un nouveau client." /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {rows.map((c, i) => <ClientCard key={c.id} client={c} delay={i * 30} onOpen={() => setOpen(c.id)} />)}
        </div>
      )}

      {/* Detail drawer */}
      {open && <ClientDetailModal client={list.find(c => c.id === open)} onClose={() => setOpen(null)}
        onSave={(updated) => {
          setList(l => l.map(c => c.id === updated.id ? updated : c));
          window.toast('Client mis à jour', 'success', updated.name);
          setOpen(null);
        }}
      />}

      {/* Create modal */}
      {createOpen && <NewClientModal onClose={() => setCreateOpen(false)} onCreate={(c) => {
        const newClient = { ...c, id: Date.now() };
        setList(l => [newClient, ...l]);
        store?.addClient?.(newClient);
        window.toast('Client créé', 'success', c.name);
        setCreateOpen(false);
      }} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function ClientCard({ client, delay, onOpen }) {
  const t = CLIENT_TYPES[client.type];
  return (
    <Card hoverable padding={0} delay={delay} onClick={onOpen} style={{ overflow: 'hidden' }}>
      <div style={{ padding: 16, borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: client.logo ? TOKENS.paper : `color-mix(in oklch, ${client.accent} 18%, white)`,
          color: client.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Manrope', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em',
          overflow: 'hidden', border: `1px solid ${TOKENS.line}`,
        }}>
          {client.logo ? <img src={client.logo} style={{ maxWidth: '85%', maxHeight: '85%' }} alt="" /> : client.code}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.name}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
            <Pill tone={t.tone} dot>{t.label}</Pill>
            {client.statut === 'attention' && <Pill tone="red" mono>SUIVI</Pill>}
          </div>
        </div>
      </div>
      <div style={{ padding: 16, fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink2, lineHeight: 1.7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: TOKENS.ink3 }}>Ville</span><span>{client.city}</span></div>
        {client.ice !== '—' && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: TOKENS.ink3 }}>ICE</span><span>{client.ice}</span></div>}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: TOKENS.ink3 }}>Chantiers</span><span>{client.chantiers}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: TOKENS.ink3 }}>Factures</span><span>{client.factures}</span></div>
      </div>
      <div style={{ padding: '10px 16px', background: TOKENS.bg, borderTop: `1px solid ${TOKENS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>CA CUMULÉ</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink }}>{window.fmtMAD(client.ca)} <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>DH</span></div>
        </div>
        {client.encours > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>ENCOURS</div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: client.encours > 5e6 ? TOKENS.red : TOKENS.amber }}>{window.fmtMAD(client.encours)} <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>DH</span></div>
          </div>
        )}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function ClientDetailModal({ client, onClose, onSave }) {
  const [logo, setLogo] = React.useState(client.logo);
  const [name, setName] = React.useState(client.name);
  const t = CLIENT_TYPES[client.type];
  const canHaveLogo = client.type !== 'particulier';

  return (
    <Modal open onClose={onClose}
      title={client.name}
      subtitle={`${t.label} · ${client.city} · ${client.code}`}
      width={760}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />} onClick={() => window.toast('Aperçu PDF du dossier client', 'info')}>Aperçu fiche</Button>
        <Button variant="primary" onClick={() => onSave({ ...client, logo, name })} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Enregistrer</Button>
      </>}
    >
      {canHaveLogo ? (
        <div style={{ marginBottom: 22, padding: 18, background: TOKENS.bg, borderRadius: 8, border: `1px solid ${TOKENS.line}` }}>
          <LogoUpload value={logo} onChange={setLogo} label="Logo du client" help={`Apparaîtra automatiquement sur les devis, factures et rapports adressés à ${client.name}.`} />
        </div>
      ) : (
        <div style={{ marginBottom: 22, padding: 14, background: TOKENS.bg, borderRadius: 8, border: `1px solid ${TOKENS.line}`, fontSize: 12, color: TOKENS.ink3 }}>
          <Icon name="user" size={14} stroke={TOKENS.ink3} /> Client particulier — pas de logo personnalisé.
        </div>
      )}

      <FieldGroup label="Raison sociale / Nom"><TextInput value={name} onChange={setName} /></FieldGroup>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FieldGroup label="ICE"><TextInput value={client.ice} mono /></FieldGroup>
        <FieldGroup label="Ville"><TextInput value={client.city} /></FieldGroup>
        <FieldGroup label="Contact"><TextInput value={client.contact} /></FieldGroup>
        <FieldGroup label="Téléphone"><TextInput value={client.phone} mono /></FieldGroup>
        <FieldGroup label="Email"><TextInput value={client.email} mono /></FieldGroup>
        <FieldGroup label="Statut">
          <Pill tone={client.statut === 'actif' ? 'green' : 'red'} dot>{client.statut === 'actif' ? 'Actif' : 'Surveillance'}</Pill>
        </FieldGroup>
      </div>

      <div style={{ borderTop: `1px solid ${TOKENS.line}`, marginTop: 18, paddingTop: 18 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 12 }}>INTERCONNEXIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Chantiers', val: client.chantiers, hash: 'sites' },
            { label: 'Factures',  val: client.factures, hash: 'factures' },
            { label: 'CA cumulé', val: window.fmtMAD(client.ca) + ' DH' },
            { label: 'Encours',   val: window.fmtMAD(client.encours) + ' DH', warn: client.encours > 5e6 },
          ].map((x, i) => (
            <button key={i} onClick={() => x.hash && (onClose(), window.location.hash = x.hash)} className="erp-card hoverable" style={{
              padding: 14, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 6,
              textAlign: 'left', cursor: x.hash ? 'pointer' : 'default',
            }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{x.label.toUpperCase()}</div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: x.warn ? TOKENS.red : TOKENS.ink, marginTop: 6 }}>{x.val}</div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
function NewClientModal({ onClose, onCreate }) {
  const [type, setType] = React.useState('entreprise');
  const [form, setForm] = React.useState({ name: '', ice: '', city: '', contact: '', email: '', phone: '', logo: null });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const t = CLIENT_TYPES[type];
  const canLogo = type !== 'particulier';
  const submit = () => {
    if (!form.name.trim()) { window.toast('Le nom du client est requis', 'error'); return; }
    onCreate({
      ...form, type, statut: 'actif',
      code: form.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'CL',
      ca: 0, encours: 0, chantiers: 0, factures: 0, accent: TOKENS.ocre,
      ice: form.ice || (type === 'particulier' ? '—' : ''),
    });
  };

  return (
    <Modal open onClose={onClose}
      title="Nouveau client"
      subtitle="Enregistrer un client dans l'annuaire — adressable depuis devis, factures, situations"
      width={680}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Créer le client</Button>
      </>}
    >
      <FieldGroup label="Type de client" required>
        <Radio value={type} onChange={setType} options={[
          ['entreprise',    'Entreprise',    'SARL · SA'],
          ['collectivite',  'Collectivité',  'Commune · région'],
          ['administration','Administration','Ministère · établissement public'],
          ['particulier',   'Particulier',   'Personne physique'],
        ]} />
      </FieldGroup>

      {canLogo && (
        <div style={{ marginBottom: 16, padding: 14, background: TOKENS.bg, borderRadius: 8, border: `1px solid ${TOKENS.line}` }}>
          <LogoUpload value={form.logo} onChange={(v) => upd('logo', v)} size={72}
            label="Logo (optionnel)"
            help="Apparaîtra sur les devis et factures destinés à ce client." />
        </div>
      )}

      <FieldGroup label={type === 'particulier' ? 'Nom complet' : 'Raison sociale'} required>
        <TextInput value={form.name} onChange={(v) => upd('name', v)} placeholder={type === 'particulier' ? 'M. Karim Bennani' : 'Société Atlas Hôtels SARL'} />
      </FieldGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {type !== 'particulier' && (
          <FieldGroup label="ICE" hint="15 chiffres"><TextInput value={form.ice} onChange={(v) => upd('ice', v)} mono placeholder="000000000000000" /></FieldGroup>
        )}
        <FieldGroup label="Ville"><TextInput value={form.city} onChange={(v) => upd('city', v)} placeholder="Casablanca" /></FieldGroup>
        <FieldGroup label="Contact"><TextInput value={form.contact} onChange={(v) => upd('contact', v)} placeholder="M./Mme · fonction" /></FieldGroup>
        <FieldGroup label="Téléphone"><TextInput value={form.phone} onChange={(v) => upd('phone', v)} mono placeholder="+212 5 22 00 00 00" /></FieldGroup>
        <FieldGroup label="Email"><TextInput value={form.email} onChange={(v) => upd('email', v)} mono placeholder="contact@..." /></FieldGroup>
      </div>
    </Modal>
  );
}

Object.assign(window, { Clients });
