/* global React, ReactDOM, TOKENS, Icon, Pill, Button */
// =============================================================================
// ERP — Système transversal
// Modales · Drawers · Notifications · Toasts · Upload logos · Permissions
// Tous accessibles via window.toast() · window.confirm2() · window.modal.open()
// =============================================================================

// -----------------------------------------------------------------------------
// 1. NOTIFICATION CENTER (cloche topbar)
// -----------------------------------------------------------------------------
const SEED_NOTIFICATIONS = [
  { id: 1, kind: 'red',    icon: 'warning',  title: 'Caution définitive BMCE expire dans 18 j', desc: 'CSB-114 · 4,2 M DH · prévoir mainlevée', time: 'il y a 12 min', read: false },
  { id: 2, kind: 'amber',  icon: 'invoice',  title: 'Facture FA-26-038 impayée depuis 67 j',     desc: 'Commune de Sidi Bernoussi · 2,1 M DH',  time: 'il y a 2 h',   read: false },
  { id: 3, kind: 'blue',   icon: 'check',    title: 'Paie de mai générée (212 bulletins)',        desc: 'Validation comptabilité requise',         time: 'il y a 3 h',   read: false },
  { id: 4, kind: 'green',  icon: 'truck',    title: 'Livraison ferraille reçue · CSB-114',       desc: 'BC-2026/0135 · Sonasid · 28 t',          time: 'hier 16:20',   read: true  },
  { id: 5, kind: 'amber',  icon: 'box',      title: 'Stock faible · ciment CPJ45',                 desc: 'Reste 8 t sur magasin Casa-Nord',         time: 'hier 09:15',   read: true  },
  { id: 6, kind: 'red',    icon: 'doc',      title: 'Attestation CNSS SOTRAVO à renouveler',      desc: 'Sous-traitant TNG-061 · expire le 02/06', time: 'hier 08:42',   read: true  },
];

const NotificationContext = React.createContext(null);

function NotificationProvider({ children }) {
  const [list, setList] = React.useState(SEED_NOTIFICATIONS);
  const unread = list.filter(n => !n.read).length;
  const markAll = () => setList(l => l.map(n => ({ ...n, read: true })));
  const markOne = (id) => setList(l => l.map(n => n.id === id ? { ...n, read: true } : n));
  const add = (n) => setList(l => [{ id: Date.now(), time: 'à l\'instant', read: false, kind: 'blue', icon: 'check', ...n }, ...l]);
  return (
    <NotificationContext.Provider value={{ list, unread, markAll, markOne, add }}>
      {children}
    </NotificationContext.Provider>
  );
}
const useNotifications = () => React.useContext(NotificationContext);

function NotificationBell() {
  const ctx = useNotifications();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  if (!ctx) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="erp-icon-btn" data-tip="Notifications" style={{
        width: 36, height: 36, border: `1px solid ${TOKENS.line}`, background: TOKENS.paper,
        borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative',
      }}>
        <Icon name="bell" size={16} stroke={TOKENS.ink2} />
        {ctx.unread > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6, minWidth: 14, height: 14,
            padding: '0 4px', borderRadius: 999, background: TOKENS.red, color: TOKENS.bg,
            fontFamily: 'IBM Plex Mono', fontSize: 9, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1.5px solid ${TOKENS.paper}`, letterSpacing: 0,
          }}>{ctx.unread}</span>
        )}
      </button>

      {open && (
        <div className="erp-fade-in" style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 380, zIndex: 1100,
          background: TOKENS.paper, border: `1px solid ${TOKENS.line}`,
          borderRadius: 10, boxShadow: '0 18px 56px -18px rgba(26,24,20,0.30)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px', borderBottom: `1px solid ${TOKENS.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>Notifications</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2, letterSpacing: '0.06em' }}>
                {ctx.unread > 0 ? `${ctx.unread} NON LUE${ctx.unread > 1 ? 'S' : ''}` : 'TOUT EST LU'}
              </div>
            </div>
            {ctx.unread > 0 && (
              <button onClick={ctx.markAll} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 11.5, color: TOKENS.ocreDeep, fontWeight: 500,
              }}>Tout marquer lu</button>
            )}
          </div>
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            {ctx.list.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: TOKENS.ink3, fontSize: 12.5 }}>
                Pas de notification.
              </div>
            )}
            {ctx.list.map((n, i) => {
              const cmap = {
                red:   { bg: TOKENS.redSoft,   fg: TOKENS.red,   dot: TOKENS.red },
                amber: { bg: TOKENS.amberSoft, fg: TOKENS.amber, dot: TOKENS.amber },
                green: { bg: TOKENS.greenSoft, fg: TOKENS.green, dot: TOKENS.green },
                blue:  { bg: TOKENS.blueSoft,  fg: TOKENS.blue,  dot: TOKENS.blue },
              };
              const c = cmap[n.kind] || cmap.blue;
              return (
                <button key={n.id} onClick={() => ctx.markOne(n.id)} style={{
                  width: '100%', textAlign: 'left', padding: '13px 16px',
                  background: n.read ? TOKENS.paper : '#fdfaf3',
                  border: 'none', borderBottom: i < ctx.list.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
                  cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start',
                }} className="erp-row">
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                    background: c.bg, color: c.fg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={n.icon} size={15} stroke={c.fg} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: TOKENS.ink3, marginTop: 3, lineHeight: 1.45 }}>{n.desc}</div>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink4, marginTop: 5, letterSpacing: '0.02em' }}>{n.time}</div>
                  </div>
                  {!n.read && <span style={{ width: 7, height: 7, borderRadius: 999, background: c.dot, marginTop: 8, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
          <div style={{
            padding: '10px 16px', borderTop: `1px solid ${TOKENS.line}`,
            background: TOKENS.bg, fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3,
            textAlign: 'center', letterSpacing: '0.04em',
          }}>
            Centre de notifications · live
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. TOAST SYSTEM — window.toast(msg, kind?)
// -----------------------------------------------------------------------------
function ToastHost() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    window.toast = (msg, kind = 'success', desc = '') => {
      const id = Date.now() + Math.random();
      setToasts(t => [...t, { id, msg, kind, desc }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    };
  }, []);
  const cmap = {
    success: { bg: TOKENS.ink, accent: TOKENS.green,  icon: 'check'   },
    info:    { bg: TOKENS.ink, accent: TOKENS.blue,   icon: 'check'   },
    warn:    { bg: TOKENS.ink, accent: TOKENS.amber,  icon: 'warning' },
    error:   { bg: TOKENS.ink, accent: TOKENS.red,    icon: 'x'       },
  };
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const c = cmap[t.kind] || cmap.success;
        return (
          <div key={t.id} className="erp-fade-in" style={{
            minWidth: 280, maxWidth: 380,
            background: c.bg, color: TOKENS.bg,
            border: `1px solid ${c.bg}`,
            borderRadius: 8, padding: '12px 14px',
            boxShadow: '0 14px 36px -14px rgba(0,0,0,0.5)',
            display: 'flex', gap: 12, alignItems: 'flex-start',
            borderLeft: `4px solid ${c.accent}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: `color-mix(in oklch, ${c.accent} 25%, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={c.icon} size={14} stroke={c.accent} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{t.msg}</div>
              {t.desc && <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink4, marginTop: 4 }}>{t.desc}</div>}
            </div>
          </div>
        );
      })}
    </div>,
    document.body
  );
}

// -----------------------------------------------------------------------------
// 3. MODAL — generic
// -----------------------------------------------------------------------------
function Modal({ open, onClose, title, subtitle, width = 560, children, footer, scrollable = true }) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(26,24,20,0.45)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, animation: 'erpFadeUp 160ms ease both',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: width, maxHeight: 'calc(100vh - 48px)',
        background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12,
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '18px 22px', borderBottom: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: TOKENS.ink, letterSpacing: '-0.01em' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: TOKENS.ink3, marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="erp-icon-btn" style={{
            width: 30, height: 30, border: `1px solid ${TOKENS.line}`, background: TOKENS.paper,
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            flexShrink: 0,
          }}>
            <Icon name="x" size={14} stroke={TOKENS.ink2} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: scrollable ? 'auto' : 'visible', padding: 22 }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '14px 22px', borderTop: `1px solid ${TOKENS.line}`,
            background: TOKENS.bg, display: 'flex', justifyContent: 'flex-end', gap: 8,
            borderRadius: '0 0 12px 12px',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// -----------------------------------------------------------------------------
// 4. DRAWER — slide-in from right
// -----------------------------------------------------------------------------
function Drawer({ open, onClose, title, subtitle, width = 520, children, footer }) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200 }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(26,24,20,0.40)',
        animation: 'erpFadeUp 160ms ease both',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width,
        background: TOKENS.paper, borderLeft: `1px solid ${TOKENS.line}`,
        boxShadow: '-24px 0 60px -20px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        animation: 'erpSlideLeft 220ms cubic-bezier(.22,.61,.36,1) both',
      }}>
        <div style={{
          padding: '18px 22px', borderBottom: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: TOKENS.ink }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: TOKENS.ink3, marginTop: 4 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="erp-icon-btn" style={{
            width: 30, height: 30, border: `1px solid ${TOKENS.line}`, background: TOKENS.paper,
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Icon name="x" size={14} stroke={TOKENS.ink2} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>{children}</div>
        {footer && (
          <div style={{
            padding: '14px 22px', borderTop: `1px solid ${TOKENS.line}`,
            background: TOKENS.bg, display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// -----------------------------------------------------------------------------
// 5. FORM PRIMITIVES (modale)
// -----------------------------------------------------------------------------
function FieldGroup({ label, hint, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 7, textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: TOKENS.red }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 10.5, color: TOKENS.ink4, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono, type = 'text' }) {
  return (
    <input type={type} value={value || ''} onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder} style={{
      width: '100%', height: 38, padding: '0 12px',
      border: `1px solid ${TOKENS.line2}`, borderRadius: 6, background: TOKENS.paper,
      fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink, outline: 'none',
    }} />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value || ''} onChange={e => onChange && onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{
      width: '100%', padding: '10px 12px', resize: 'vertical',
      border: `1px solid ${TOKENS.line2}`, borderRadius: 6, background: TOKENS.paper,
      fontFamily: 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink, outline: 'none',
      lineHeight: 1.5,
    }} />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value || ''} onChange={e => onChange && onChange(e.target.value)} style={{
      width: '100%', height: 38, padding: '0 10px',
      border: `1px solid ${TOKENS.line2}`, borderRadius: 6, background: TOKENS.paper,
      fontFamily: 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink, outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8378' stroke-width='1.5'><path d='m6 9 6 6 6-6'/></svg>")`,
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: 14,
      paddingRight: 32,
    }}>
      {options.map(o => {
        const [v, l] = Array.isArray(o) ? o : [o, o];
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

function Radio({ value, onChange, options }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 0, border: `1px solid ${TOKENS.line2}`, borderRadius: 6, overflow: 'hidden' }}>
      {options.map(([v, l, desc], i) => {
        const active = value === v;
        return (
          <button key={v} type="button" onClick={() => onChange(v)} style={{
            padding: '10px 12px', border: 'none',
            background: active ? TOKENS.ink : TOKENS.paper,
            color: active ? TOKENS.bg : TOKENS.ink2,
            borderRight: i < options.length - 1 ? `1px solid ${TOKENS.line2}` : 'none',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{l}</div>
            {desc && <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: active ? TOKENS.ink4 : TOKENS.ink3, marginTop: 2 }}>{desc}</div>}
          </button>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 6. LOGO / FILE UPLOAD — fonctionnel via FileReader
// -----------------------------------------------------------------------------
function LogoUpload({ value, onChange, size = 96, label = 'Logo', help = 'PNG ou SVG · fond transparent recommandé · 512×512px' }) {
  const inputRef = React.useRef(null);
  const onPick = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { window.toast('Format non supporté', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { window.toast('Fichier trop volumineux (max 2 Mo)', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (e) => { onChange && onChange(e.target.result); window.toast('Logo importé'); };
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
      <div onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); }}
        onDrop={e => { e.preventDefault(); onPick(e.dataTransfer.files[0]); }}
        style={{
          width: size, height: size, flexShrink: 0,
          background: value ? TOKENS.paper : TOKENS.bg,
          border: `2px dashed ${TOKENS.line2}`, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}>
        {value ? (
          <img src={value} alt="logo" style={{ maxWidth: '85%', maxHeight: '85%', objectFit: 'contain' }} />
        ) : (
          <div style={{ textAlign: 'center', color: TOKENS.ink3 }}>
            <Icon name="plus" size={20} stroke={TOKENS.ink3} />
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, marginTop: 4, letterSpacing: '0.06em' }}>UPLOAD</div>
          </div>
        )}
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 6 }}>{label.toUpperCase()}</div>
        <div style={{ fontSize: 12, color: TOKENS.ink2, marginBottom: 10, lineHeight: 1.5 }}>{help}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" onClick={() => inputRef.current?.click()}>Choisir un fichier</Button>
          {value && <Button size="sm" onClick={() => onChange(null)}>Retirer</Button>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onPick(e.target.files[0])} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// 7. EMPTY STATE / SUCCESS STATE
// -----------------------------------------------------------------------------
function EmptyState({ icon = 'folder', title, desc, action }) {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12, margin: '0 auto 16px',
        background: TOKENS.bgWarm, color: TOKENS.ink3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={22} stroke={TOKENS.ink3} />
      </div>
      <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: TOKENS.ink, marginBottom: 6 }}>{title}</div>
      {desc && <div style={{ fontSize: 12.5, color: TOKENS.ink3, maxWidth: 360, margin: '0 auto 14px', lineHeight: 1.5 }}>{desc}</div>}
      {action}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 8. EXPORT MENU (used to attach PDF / Excel / CSV / Print to any button)
// -----------------------------------------------------------------------------
function ExportMenu({ name = 'document' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const exp = (fmt) => {
    setOpen(false);
    window.toast(`Export ${fmt.toUpperCase()} en cours`, 'info', name);
    setTimeout(() => window.toast(`${name} · ${fmt.toUpperCase()} prêt`, 'success'), 800);
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Button onClick={() => setOpen(o => !o)} icon={<Icon name="arrowDown" size={13} stroke={TOKENS.ink2} />}>
        Exporter
      </Button>
      {open && (
        <div className="erp-fade-in" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 200, zIndex: 1100,
          background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 8,
          boxShadow: '0 14px 36px -14px rgba(0,0,0,0.25)', overflow: 'hidden',
        }}>
          {[
            ['PDF', 'doc'],
            ['Excel', 'box'],
            ['CSV', 'doc'],
            ['Imprimer', 'doc'],
          ].map(([f, i]) => (
            <button key={f} onClick={() => exp(f)} className="erp-row" style={{
              width: '100%', padding: '10px 12px', textAlign: 'left',
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink,
            }}>
              <Icon name={i} size={13} stroke={TOKENS.ink3} />
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 9. PERMISSION MODEL — modules × actions
// -----------------------------------------------------------------------------
const PERMISSION_MODULES = [
  { id: 'dashboard',  label: 'Tableau de bord' },
  { id: 'sites',      label: 'Chantiers' },
  { id: 'pointage',   label: 'Pointage' },
  { id: 'achats',     label: 'Achats' },
  { id: 'sst',        label: 'Sous-traitance' },
  { id: 'factures',   label: 'Facturation' },
  { id: 'paie',       label: 'Paie' },
  { id: 'tresorerie', label: 'Trésorerie' },
  { id: 'rapports',   label: 'Rapports' },
  { id: 'users',      label: 'Utilisateurs' },
  { id: 'settings',   label: 'Paramétrage' },
];
const PERMISSION_ACTIONS = [
  { id: 'lire',    code: 'l', label: 'Voir',           icon: 'check' },
  { id: 'ecrire',  code: 'w', label: 'Créer/Modifier', icon: 'check' },
  { id: 'suppr',   code: 's', label: 'Supprimer',      icon: 'x' },
  { id: 'export',  code: 'x', label: 'Exporter / PDF', icon: 'doc' },
  { id: 'valid',   code: 'v', label: 'Valider',        icon: 'shield' },
];

const DEFAULT_PERMS = {
  direction:  { all: true },
  conducteur: { sites:'lwv', pointage:'lw', achats:'lwv', sst:'lw', factures:'lx', paie:'l', tresorerie:'l', rapports:'lx', users:'l', settings:'l', dashboard:'lx' },
  chef:       { sites:'lw', pointage:'lwv', achats:'lw', factures:'l', paie:'l', rapports:'lx', dashboard:'l', sst:'l' },
  compta:     { factures:'lwvx', paie:'lwvx', tresorerie:'lwvx', achats:'lx', rapports:'lx', dashboard:'lx', settings:'lw', users:'l' },
  acheteur:   { achats:'lwvx', sst:'lwv', sites:'l', factures:'lx', rapports:'lx', dashboard:'l', settings:'l' },
  lecture:    { sites:'l', factures:'l', rapports:'lx', dashboard:'l', pointage:'l' },
};

// -----------------------------------------------------------------------------
// 10. KEYBOARD SHORTCUT BADGE
// -----------------------------------------------------------------------------
function Kbd({ children }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 6px',
      background: TOKENS.bgWarm, border: `1px solid ${TOKENS.line2}`,
      borderRadius: 4, fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2,
      letterSpacing: '0.04em',
    }}>{children}</span>
  );
}

// -----------------------------------------------------------------------------
Object.assign(window, {
  NotificationProvider, NotificationBell, useNotifications,
  ToastHost, Modal, Drawer,
  FieldGroup, TextInput, TextArea, Select, Radio,
  LogoUpload, EmptyState, ExportMenu, Kbd,
  PERMISSION_MODULES, PERMISSION_ACTIONS, DEFAULT_PERMS,
});
