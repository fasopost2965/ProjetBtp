/* global React, TOKENS, Icon, Logo, Pill */
// =============================================================================
// ERP — App shell: sidebar + topbar + hash routing
// =============================================================================

const NAV_GROUPS = [
  { label: 'Pilotage', items: [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
    { id: 'sites',     label: 'Chantiers', icon: 'sites', badge: '34' },
    { id: 'clients',   label: 'Clients', icon: 'user', badge: '52' },
    { id: 'planning',  label: 'Planning', icon: 'clock' },
  ]},
  { label: 'Production', items: [
    { id: 'pointage',  label: 'Pointage', icon: 'helmet', badge: 'aujourd\'hui' },
    { id: 'situations',label: 'Situations', icon: 'doc' },
    { id: 'etudes',    label: 'Études de prix', icon: 'invoice' },
  ]},
  { label: 'Achats & matériel', items: [
    { id: 'achats',    label: 'Achats', icon: 'purchase', badge: '7' },
    { id: 'sst',       label: 'Sous-traitance', icon: 'subcontract', badge: '3' },
    { id: 'stock',     label: 'Stock', icon: 'box', badge: '2' },
    { id: 'parc',      label: 'Parc matériel', icon: 'truck' },
  ]},
  { label: 'Finance', items: [
    { id: 'factures',  label: 'Facturation', icon: 'invoice' },
    { id: 'paie',      label: 'Paie chantier', icon: 'money' },
    { id: 'tresorerie',label: 'Trésorerie & cautions', icon: 'money' },
    { id: 'marches',   label: 'Marchés publics', icon: 'folder' },
  ]},
  { label: 'Rapports & analyses', items: [
    { id: 'rapports',  label: 'Bibliothèque de rapports', icon: 'doc' },
  ]},
  { label: 'Admin', items: [
    { id: 'ged',       label: 'Documents', icon: 'folder' },
    { id: 'users',     label: 'Utilisateurs', icon: 'user' },
    { id: 'settings',  label: 'Paramétrage', icon: 'settings' },
  ]},
];

// -----------------------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------------------
function Sidebar({ route, onNavigate }) {
  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: TOKENS.paper,
      borderRight: `1px solid ${TOKENS.line}`,
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo block */}
      <div style={{
        height: 56, padding: '0 18px',
        display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${TOKENS.line}`,
      }}>
        <Logo />
      </div>

      {/* Society switcher */}
      <button style={{
        margin: 12,
        padding: '10px 12px',
        background: TOKENS.bgWarm,
        border: `1px solid ${TOKENS.line}`,
        borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 28, height: 28,
          background: TOKENS.ink, color: TOKENS.bg,
          borderRadius: 4,
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          letterSpacing: '-0.01em',
        }}>AC</div>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: 12.5, color: TOKENS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Atlas Constructions S.A.
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.04em' }}>
            ICE · 002578946000093
          </div>
        </div>
        <Icon name="chevronDown" size={14} stroke={TOKENS.ink3} />
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 16px' }}>
        {NAV_GROUPS.map(g => (
          <div key={g.label} style={{ marginBottom: 14 }}>
            <div style={{
              padding: '8px 10px 6px',
              fontFamily: 'IBM Plex Mono', fontSize: 9,
              color: TOKENS.ink4, letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              {g.label}
            </div>
            {g.items.map(item => {
              const active = route === item.id;
              return (
                <button key={item.id} onClick={() => onNavigate(item.id)}
                  className={`erp-nav-item${active ? ' active' : ''}`}
                  style={{
                  width: '100%', padding: '8px 10px',
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: active ? TOKENS.ink : 'transparent',
                  color: active ? TOKENS.bg : TOKENS.ink2,
                  border: 'none', borderRadius: 5,
                  cursor: 'pointer',
                  fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: active ? 500 : 400,
                  textAlign: 'left', marginBottom: 2,
                  position: 'relative',
                }}>
                  <Icon name={item.icon} size={15} stroke={active ? TOKENS.ocre : TOKENS.ink3} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontFamily: 'IBM Plex Mono', fontSize: 9,
                      padding: '1px 6px', borderRadius: 3,
                      background: active ? 'rgba(255,255,255,0.12)' : TOKENS.bgWarm,
                      color: active ? TOKENS.bg : TOKENS.ink3,
                      letterSpacing: '0.04em',
                    }}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{
        borderTop: `1px solid ${TOKENS.line}`,
        padding: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32,
          background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
          borderRadius: 999,
          fontFamily: 'Manrope', fontWeight: 700, fontSize: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>KB</div>
        <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
          <div style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: 12, color: TOKENS.ink }}>
            Karim Benjelloun
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.02em' }}>
            Conducteur de travaux
          </div>
        </div>
        <button style={{
          width: 28, height: 28, border: 'none', background: 'transparent',
          color: TOKENS.ink3, cursor: 'pointer', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
  );
}

// -----------------------------------------------------------------------------
// Topbar
// -----------------------------------------------------------------------------
function Topbar({ breadcrumb }) {
  return (
    <header style={{
      height: 56, flexShrink: 0,
      borderBottom: `1px solid ${TOKENS.line}`,
      background: TOKENS.paper,
      padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Sans', fontSize: 13 }}>
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: TOKENS.ink4 }}>/</span>}
            <span style={{ color: i === breadcrumb.length - 1 ? TOKENS.ink : TOKENS.ink3, fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>
              {b}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div className="erp-search" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px', height: 34,
        background: TOKENS.bg,
        border: `1px solid ${TOKENS.line}`,
        borderRadius: 6,
        flex: '0 1 320px', minWidth: 200,
        transition: 'border-color 140ms ease, background 140ms ease',
      }}>
        <Icon name="search" size={14} stroke={TOKENS.ink3} />
        <input
          placeholder="Rechercher chantier, fournisseur, facture…"
          style={{
            flex: 1, border: 'none', background: 'transparent',
            outline: 'none', fontFamily: 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink,
          }}
        />
        <span style={{
          fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3,
          padding: '1px 5px', border: `1px solid ${TOKENS.line2}`, borderRadius: 3,
        }}>⌘K</span>
      </div>

      {/* Period / exercise */}
      <button style={{
        height: 34, padding: '0 12px',
        background: TOKENS.paper, border: `1px solid ${TOKENS.line2}`, borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer',
        fontFamily: 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink,
      }}>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.08em' }}>EX.</span>
        2026
        <Icon name="chevronDown" size={13} stroke={TOKENS.ink3} />
      </button>

      {/* Notifications */}
      {window.NotificationBell && <window.NotificationBell />}

      {/* Quick action */}
      <NewMenu />
    </header>
  );
}

// -----------------------------------------------------------------------------
// + Nouveau — quick action popover
// -----------------------------------------------------------------------------
function NewMenu() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const items = [
    { kind: 'CH',  label: 'Chantier',              desc: 'Ouvrir un nouveau chantier',     tone: 'ocre', go: 'sites',      key: 'newSite' },
    { kind: 'CL',  label: 'Client',                desc: 'Entreprise · particulier · collectivité', go: 'clients',  key: 'newClient' },
    { kind: 'DV',  label: 'Devis / Étude de prix', desc: 'Démarrer un sous-détail',         go: 'etudes',     key: 'newQuote' },
    { kind: 'BC',  label: 'Bon de commande',       desc: 'Achat fournisseur',               go: 'achats',     key: 'newBC' },
    { kind: 'SIT', label: 'Situation mensuelle',   desc: 'Attachement / décompte',          go: 'situations', key: 'newSit' },
    { kind: 'FA',  label: 'Facture client',        desc: 'Émission',                        go: 'factures',   key: 'newInvoice' },
    { kind: 'EMP', label: 'Employé',               desc: 'Ouvrier · technicien · cadre',    go: 'pointage',   key: 'newEmp' },
    { kind: 'USR', label: 'Utilisateur',           desc: 'Compte ERP + rôle',               go: 'users',      key: 'newUser' },
  ];
  const trigger = (it) => {
    setOpen(false);
    window.location.hash = it.go;
    // give the screen a tick to mount, then dispatch the open event
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('erp:new', { detail: { key: it.key } }));
      window.toast(`Nouveau ${it.label.toLowerCase()}`, 'info', 'Formulaire ouvert');
    }, 60);
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 34, padding: '0 14px',
        background: TOKENS.ink, color: TOKENS.bg, border: 'none', borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer',
        fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 500,
      }}>
        <Icon name="plus" size={14} />
        Nouveau
        <Icon name="chevronDown" size={12} stroke={TOKENS.bg} />
      </button>
      {open && (
        <div className="erp-fade-in" style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 340, background: TOKENS.paper,
          border: `1px solid ${TOKENS.line}`, borderRadius: 8,
          boxShadow: '0 20px 50px -20px rgba(26,24,20,0.20), 0 4px 12px -4px rgba(26,24,20,0.08)',
          padding: 8, zIndex: 50,
        }}>
          <div style={{ padding: '6px 10px 10px', fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.12em' }}>
            CRÉER UN ÉLÉMENT
          </div>
          {items.map((it, i) => (
            <button key={i} className="erp-nav-item" onClick={() => trigger(it)} style={{
              width: '100%', padding: 10,
              background: 'transparent', border: 'none', borderRadius: 5,
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{
                width: 34, height: 34, borderRadius: 5, flexShrink: 0,
                background: it.tone === 'ocre' ? TOKENS.ocreSoft : TOKENS.bg,
                color: it.tone === 'ocre' ? TOKENS.ocreDeep : TOKENS.ink,
                border: `1px solid ${TOKENS.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 500,
              }}>{it.kind}</span>
              <div style={{ flex: 1, lineHeight: 1.3 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: TOKENS.ink }}>{it.label}</div>
                <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 2 }}>{it.desc}</div>
              </div>
              <Icon name="chevronRight" size={13} stroke={TOKENS.ink3} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Shell — wraps the routed screen
// -----------------------------------------------------------------------------
function Shell({ route, onNavigate, breadcrumb, children }) {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: TOKENS.bg,
      fontFamily: 'IBM Plex Sans',
      color: TOKENS.ink,
    }}>
      <Sidebar route={route} onNavigate={onNavigate} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar breadcrumb={breadcrumb} />
        <main style={{ flex: 1, padding: '24px 28px 40px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Stub for routes not yet built
// -----------------------------------------------------------------------------
function StubScreen({ title }) {
  return (
    <div style={{
      border: `1px dashed ${TOKENS.line2}`,
      borderRadius: 8, padding: 60,
      textAlign: 'center', background: TOKENS.paper,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.15em', marginBottom: 10 }}>
        ÉCRAN À VENIR
      </div>
      <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, margin: '0 0 8px', color: TOKENS.ink }}>
        {title}
      </h2>
      <p style={{ color: TOKENS.ink3, fontSize: 13, margin: 0 }}>
        Cet écran fait partie du plan validé — on y arrivera selon l'ordre défini.
      </p>
    </div>
  );
}

Object.assign(window, { Shell, StubScreen, NAV_GROUPS });
