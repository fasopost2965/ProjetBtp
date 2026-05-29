/* global React, TOKENS, Icon, Pill, Card, Button, Modal, FieldGroup, TextInput, Select, Radio, DEFAULT_PERMS, PERMISSION_MODULES, PERMISSION_ACTIONS */
// =============================================================================
// ERP — Utilisateurs & droits
// Rôles métier BTP · affectation chantiers · invitations · accès
// =============================================================================

const moisCourt = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const fmtD = (iso) => { const [y, m, d] = iso.split('-'); return `${parseInt(d)} ${moisCourt[parseInt(m) - 1]}`; };

const ROLES = {
  direction:  { label: 'Direction',           tone: 'ink',     desc: 'Accès total · validation' },
  conducteur: { label: 'Conducteur travaux',   tone: 'ocre',    desc: 'Chantiers · achats · situations' },
  chef:       { label: 'Chef de chantier',     tone: 'blue',    desc: 'Pointage · rapports terrain' },
  compta:     { label: 'Comptabilité',         tone: 'green',   desc: 'Facturation · paie · trésorerie' },
  acheteur:   { label: 'Acheteur',             tone: 'amber',   desc: 'Achats · fournisseurs · stock' },
  lecture:    { label: 'Lecture seule',        tone: 'neutral', desc: 'Consultation uniquement' },
};

const USERS = [
  { id: 1, name: 'Karim Benjelloun',   email: 'k.benjelloun@atlas-btp.ma', role: 'conducteur', chantiers: ['CSB-114', 'RBT-208'], status: 'actif',    last: 'il y a 12 min', online: true },
  { id: 2, name: 'Nadia El Fassi',     email: 'n.elfassi@atlas-btp.ma',    role: 'direction',  chantiers: ['Tous'],               status: 'actif',    last: 'il y a 2 h',   online: true },
  { id: 3, name: 'Rachid Bouhsina',    email: 'r.bouhsina@atlas-btp.ma',   role: 'chef',       chantiers: ['CSB-114'],            status: 'actif',    last: 'il y a 40 min', online: true },
  { id: 4, name: 'Salma Ouazzani',     email: 's.ouazzani@atlas-btp.ma',   role: 'compta',     chantiers: ['Siège'],              status: 'actif',    last: 'il y a 1 h',   online: false },
  { id: 5, name: 'Younes Tahiri',      email: 'y.tahiri@atlas-btp.ma',     role: 'acheteur',   chantiers: ['Tous'],               status: 'actif',    last: 'hier',         online: false },
  { id: 6, name: 'Hicham Lahlou',      email: 'h.lahlou@atlas-btp.ma',     role: 'chef',       chantiers: ['TNG-061'],            status: 'actif',    last: 'il y a 3 h',   online: false },
  { id: 7, name: 'Fatima Zahra Idrissi', email: 'fz.idrissi@atlas-btp.ma', role: 'compta',     chantiers: ['Siège'],              status: 'suspendu', last: 'il y a 18 j',  online: false },
  { id: 8, name: 'Omar Sebti',         email: 'o.sebti@atlas-btp.ma',      role: 'lecture',    chantiers: ['RBT-208'],            status: 'actif',    last: 'il y a 5 j',   online: false },
];

const INVITES = [
  { email: 'a.bennani@atlas-btp.ma', role: 'chef',     by: 'Karim Benjelloun', date: '2026-05-26' },
  { email: 'cabinet.tazi@bet.ma',    role: 'lecture',  by: 'Nadia El Fassi',   date: '2026-05-24' },
];

// -----------------------------------------------------------------------------
function Users() {
  const [filter, setFilter] = React.useState('all');
  const [tab, setTab]       = React.useState('users'); // users | matrix
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editUser, setEditUser]     = React.useState(null);
  const [users, setUsers]   = React.useState(USERS);
  const [perms, setPerms]   = React.useState(DEFAULT_PERMS);

  React.useEffect(() => {
    const h = (e) => { if (e.detail?.key === 'newUser') setCreateOpen(true); };
    window.addEventListener('erp:new', h);
    return () => window.removeEventListener('erp:new', h);
  }, []);

  const actifs = users.filter(u => u.status === 'actif').length;
  const online = users.filter(u => u.online).length;

  let rows = users;
  if (filter !== 'all') rows = users.filter(u => u.role === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            ADMINISTRATION · UTILISATEURS
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Utilisateurs, rôles &amp; privilèges
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
            {users.length} comptes · {online} en ligne · licence 15 postes
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => setTab(tab === 'users' ? 'matrix' : 'users')}
            icon={<Icon name={tab === 'users' ? 'shield' : 'user'} size={13} stroke={TOKENS.ink2} />}>
            {tab === 'users' ? 'Matrice des privilèges' : 'Liste des utilisateurs'}
          </Button>
          <Button variant="primary" onClick={() => setCreateOpen(true)} icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>
            Nouveau utilisateur
          </Button>
        </div>
      </div>

      {tab === 'matrix' ? (
        <PermissionMatrix perms={perms} setPerms={setPerms} />
      ) : (
        <UsersListView
          users={users} rows={rows} filter={filter} setFilter={setFilter}
          actifs={actifs} online={online} onEdit={setEditUser}
        />
      )}

      {createOpen && <NewUserModal onClose={() => setCreateOpen(false)} onCreate={(u) => {
        setUsers(list => [{ ...u, id: Date.now(), online: false, last: 'jamais' }, ...list]);
        window.toast('Utilisateur créé', 'success', `Invitation envoyée à ${u.email}`);
        setCreateOpen(false);
      }} />}

      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)}
        onSave={(u) => { setUsers(list => list.map(x => x.id === u.id ? u : x)); window.toast('Privilèges mis à jour', 'success', u.name); setEditUser(null); }}
        onSuspend={(u) => { setUsers(list => list.map(x => x.id === u.id ? { ...x, status: 'suspendu' } : x)); window.toast('Compte suspendu', 'warn', u.name); setEditUser(null); }}
      />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function UsersListView({ users, rows, filter, setFilter, actifs, online, onEdit }) {
  return (
    <>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        <UserKpi label="COMPTES ACTIFS" value={actifs} unit={`/ ${users.length}`} sub="1 compte suspendu" delay={60} tone="ink" />
        <UserKpi label="EN LIGNE" value={online} unit="utilisateurs" sub="connectés maintenant" delay={120} tone="green" />
        <UserKpi label="INVITATIONS" value={INVITES.length} unit="en attente" sub="non encore acceptées" delay={180} tone="amber" />
        <UserKpi label="POSTES DISPONIBLES" value={15 - users.length} unit="sur 15" sub="licence Atlas BTP Pro" delay={240} />
      </div>

      {/* Rôles */}
      <Card padding={0} delay={300}>
        <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}` }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Rôles &amp; périmètres</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {Object.entries(ROLES).map(([id, r], i) => {
            const count = users.filter(u => u.role === id).length;
            return (
              <div key={id} style={{
                padding: 16,
                borderRight: (i % 3 !== 2) ? `1px solid ${TOKENS.line}` : 'none',
                borderBottom: i < 3 ? `1px solid ${TOKENS.line}` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <Pill tone={r.tone} dot>{r.label}</Pill>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{count} compte{count > 1 ? 's' : ''}</span>
                </div>
                <div style={{ fontSize: 11.5, color: TOKENS.ink3 }}>{r.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter chips */}
      <div className="erp-fade-in" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[['all', 'Tous'], ...Object.entries(ROLES).map(([id, r]) => [id, r.label])].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            padding: '7px 12px', borderRadius: 5, cursor: 'pointer',
            background: filter === id ? TOKENS.ink : TOKENS.bgWarm,
            color: filter === id ? TOKENS.bg : TOKENS.ink2, border: 'none',
            fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
          }}>{label}</button>
        ))}
      </div>

      {/* Users table */}
      <Card padding={0} delay={360}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 180px 200px 130px 60px',
          padding: '10px 20px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Utilisateur</span><span>Rôle</span><span>Chantiers</span><span>Dernière activité</span><span></span>
        </div>
        {rows.map((u, i) => {
          const r = ROLES[u.role];
          return (
            <div key={u.id} className="erp-row" style={{
              display: 'grid', gridTemplateColumns: '1fr 180px 200px 130px 60px',
              padding: '13px 20px', borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
              opacity: u.status === 'suspendu' ? 0.6 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 999, background: TOKENS.ocreSoft, color: TOKENS.ocreDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Manrope', fontWeight: 700, fontSize: 11.5 }}>
                    {u.name.split(' ').slice(0, 2).map(p => p[0]).join('')}
                  </div>
                  {u.online && <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 999, background: TOKENS.green, border: `2px solid ${TOKENS.paper}` }} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, color: TOKENS.ink, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
                    {u.name}
                    {u.status === 'suspendu' && <Pill tone="red">Suspendu</Pill>}
                  </div>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>{u.email}</div>
                </div>
              </div>
              <div><Pill tone={r.tone} dot>{r.label}</Pill></div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {u.chantiers.map(c => <Pill key={c} tone="neutral" mono>{c}</Pill>)}
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: u.online ? TOKENS.green : TOKENS.ink3 }}>{u.last}</span>
              <div style={{ textAlign: 'right' }}>
                <button onClick={() => onEdit(u)} className="erp-icon-btn" data-tip="Gérer l'accès" style={{
                  width: 30, height: 30, borderRadius: 5, border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="settings" size={14} stroke={TOKENS.ink3} />
                </button>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Invitations en attente */}
      <Card padding={0} delay={420}>
        <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Invitations en attente</h3>
          <Pill tone="amber" dot>{INVITES.length}</Pill>
        </div>
        {INVITES.map((inv, i) => {
          const r = ROLES[inv.role];
          return (
            <div key={inv.email} className="erp-row" style={{
              padding: '13px 20px', borderBottom: i < INVITES.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 999, border: `1.5px dashed ${TOKENS.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="user" size={15} stroke={TOKENS.ink4} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{inv.email}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginTop: 2 }}>invité par {inv.by} · {fmtD(inv.date)}</div>
              </div>
              <Pill tone={r.tone} dot>{r.label}</Pill>
              <Button size="sm" onClick={() => window.toast('Invitation renvoyée à ' + inv.email, 'info')}>Relancer</Button>
              <button onClick={() => window.toast('Invitation annulée', 'warn')} className="erp-icon-btn" data-tip="Annuler l'invitation" style={{ width: 30, height: 30, borderRadius: 5, border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={13} stroke={TOKENS.ink3} />
              </button>
            </div>
          );
        })}
      </Card>
    </>
  );
}

// -----------------------------------------------------------------------------
// PERMISSION MATRIX — rôles × modules × actions (CRUD + Export + Validate)
// -----------------------------------------------------------------------------
function PermissionMatrix({ perms, setPerms }) {
  const [role, setRole] = React.useState('conducteur');
  const rp = perms[role] || {};
  const isAll = rp.all;

  const has = (mod, act) => {
    if (isAll) return true;
    const code = rp[mod] || '';
    return code.includes(act.code);
  };
  const toggle = (mod, act) => {
    if (isAll) return;
    setPerms(p => {
      const code = p[role]?.[mod] || '';
      const letter = act.code;
      const next = code.includes(letter) ? code.replace(letter, '') : code + letter;
      return { ...p, [role]: { ...p[role], [mod]: next } };
    });
    window.toast(`${ROLES[role].label} · ${has(mod, act) ? 'privilège retiré' : 'privilège accordé'}`, 'info');
  };

  return (
    <Card padding={0} delay={60}>
      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 6 }}>
            MATRICE DES PRIVILÈGES · {role.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16 }}>Cliquez une case pour accorder ou retirer un privilège</div>
          <div style={{ fontSize: 12, color: TOKENS.ink3, marginTop: 4 }}>Les modifications s'appliquent à tous les comptes du rôle.</div>
        </div>
        <Button onClick={() => { setPerms(DEFAULT_PERMS); window.toast('Privilèges réinitialisés', 'info'); }}>Réinitialiser</Button>
      </div>

      {/* role tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${TOKENS.line}`, padding: '0 12px', background: TOKENS.bg, overflowX: 'auto' }}>
        {Object.entries(ROLES).map(([id, r]) => (
          <button key={id} onClick={() => setRole(id)} style={{
            padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
            borderBottom: role === id ? `2px solid ${TOKENS.ink}` : `2px solid transparent`,
            fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: role === id ? 600 : 400,
            color: role === id ? TOKENS.ink : TOKENS.ink3,
            display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: r.tone === 'ink' ? TOKENS.ink : r.tone === 'ocre' ? TOKENS.ocre : r.tone === 'blue' ? TOKENS.blue : r.tone === 'green' ? TOKENS.green : r.tone === 'amber' ? TOKENS.amber : TOKENS.ink3 }} />
            {r.label}
          </button>
        ))}
      </div>

      {isAll && (
        <div style={{ padding: 16, background: '#fdfaf3', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="shield" size={16} stroke={TOKENS.ocreDeep} />
          <span style={{ fontSize: 13, color: TOKENS.ink2 }}>
            <b>{ROLES[role].label}</b> bénéficie de tous les privilèges sur tous les modules. Pour modifier, créez un rôle personnalisé.
          </span>
        </div>
      )}

      {/* Matrix */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: TOKENS.paper, borderBottom: `1px solid ${TOKENS.line}` }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, width: 200 }}>Module</th>
              {PERMISSION_ACTIONS.map(a => (
                <th key={a.id} style={{ padding: '12px 8px', fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Icon name={a.icon} size={13} stroke={TOKENS.ink3} />
                    {a.label}
                  </div>
                </th>
              ))}
              <th style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>Accordés</th>
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MODULES.map((m, i) => {
              const granted = PERMISSION_ACTIONS.filter(a => has(m.id, a)).length;
              return (
                <tr key={m.id} style={{ borderBottom: i < PERMISSION_MODULES.length - 1 ? `1px solid ${TOKENS.line}` : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: TOKENS.ink, fontWeight: 500 }}>{m.label}</td>
                  {PERMISSION_ACTIONS.map(a => {
                    const on = has(m.id, a);
                    return (
                      <td key={a.id} style={{ textAlign: 'center', padding: '8px 4px' }}>
                        <button onClick={() => toggle(m.id, a)} className={`perm-cell ${isAll ? 'disabled' : ''}`} style={{
                          width: 36, height: 36, borderRadius: 6, border: 'none', cursor: isAll ? 'default' : 'pointer',
                          background: on ? (a.id === 'suppr' ? TOKENS.redSoft : a.id === 'valid' ? TOKENS.ocreSoft : TOKENS.greenSoft) : TOKENS.bg,
                          color: on ? (a.id === 'suppr' ? TOKENS.red : a.id === 'valid' ? TOKENS.ocreDeep : TOKENS.green) : TOKENS.ink4,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {on ? <Icon name="check" size={16} strokeWidth={2.5} /> : <span style={{ width: 7, height: 7, borderRadius: 999, background: TOKENS.line2 }} />}
                        </button>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink2 }}>
                    {granted} / {PERMISSION_ACTIONS.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '12px 22px', borderTop: `1px solid ${TOKENS.line}`, background: TOKENS.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, letterSpacing: '0.04em' }}>
          Légende : <span style={{ color: TOKENS.green }}>● accordé</span> · <span style={{ color: TOKENS.red }}>● suppression</span> · <span style={{ color: TOKENS.ocreDeep }}>● validation</span>
        </div>
        <Button variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />} onClick={() => window.toast('Privilèges enregistrés', 'success', `Rôle ${ROLES[role].label}`)}>
          Enregistrer
        </Button>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
function NewUserModal({ onClose, onCreate }) {
  const [form, setForm] = React.useState({ name: '', email: '', role: 'chef', chantiers: 'Tous' });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) { window.toast('Nom et email requis', 'error'); return; }
    if (!form.email.includes('@')) { window.toast('Email invalide', 'error'); return; }
    onCreate({ ...form, chantiers: form.chantiers.split(',').map(s => s.trim()), status: 'actif' });
  };
  return (
    <Modal open onClose={onClose}
      title="Inviter un nouvel utilisateur"
      subtitle="L'utilisateur recevra un email pour définir son mot de passe"
      width={560}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Envoyer l'invitation</Button>
      </>}
    >
      <FieldGroup label="Nom complet" required><TextInput value={form.name} onChange={(v) => upd('name', v)} placeholder="Karim Benjelloun" /></FieldGroup>
      <FieldGroup label="Email professionnel" required hint="L'invitation y sera envoyée">
        <TextInput value={form.email} onChange={(v) => upd('email', v)} mono placeholder="prenom.nom@atlas-btp.ma" />
      </FieldGroup>
      <FieldGroup label="Rôle" required>
        <Select value={form.role} onChange={(v) => upd('role', v)}
          options={Object.entries(ROLES).map(([id, r]) => [id, r.label + ' — ' + r.desc])} />
      </FieldGroup>
      <FieldGroup label="Chantiers affectés" hint="Tous · ou liste séparée par virgules (ex: CSB-114, RBT-208)">
        <TextInput value={form.chantiers} onChange={(v) => upd('chantiers', v)} mono />
      </FieldGroup>
      <div style={{ marginTop: 18, padding: 14, background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Icon name="warning" size={15} stroke={TOKENS.amber} />
        <div style={{ fontSize: 11.5, color: TOKENS.ink2, lineHeight: 1.55 }}>
          Privilèges hérités du rôle <b>{ROLES[form.role].label}</b>. Vous pourrez les ajuster individuellement depuis la fiche.
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
function EditUserModal({ user, onClose, onSave, onSuspend }) {
  const [u, setU] = React.useState(user);
  const upd = (k, v) => setU(x => ({ ...x, [k]: v }));
  return (
    <Modal open onClose={onClose}
      title={`Privilèges · ${user.name}`}
      subtitle={user.email}
      width={580}
      footer={<>
        <Button onClick={() => onSuspend(user)} style={{ color: TOKENS.red, borderColor: TOKENS.red }}>Suspendre</Button>
        <div style={{ flex: 1 }} />
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={() => onSave(u)} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>Enregistrer</Button>
      </>}
    >
      <FieldGroup label="Rôle">
        <Select value={u.role} onChange={(v) => upd('role', v)}
          options={Object.entries(ROLES).map(([id, r]) => [id, r.label])} />
      </FieldGroup>
      <FieldGroup label="Chantiers affectés">
        <TextInput value={u.chantiers.join(', ')} onChange={(v) => upd('chantiers', v.split(',').map(s => s.trim()).filter(Boolean))} mono />
      </FieldGroup>
      <div style={{ marginTop: 14, padding: 14, background: TOKENS.bg, borderRadius: 6, border: `1px solid ${TOKENS.line}` }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 6 }}>PRIVILÈGES SPÉCIFIQUES</div>
        <div style={{ fontSize: 12, color: TOKENS.ink3 }}>
          Pour personnaliser les privilèges, utilisez la <b style={{ color: TOKENS.ocreDeep }}>Matrice des privilèges</b> depuis l'écran utilisateurs.
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
function UserKpi({ label, value, unit, sub, tone, delay }) {
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

Object.assign(window, { Users });
