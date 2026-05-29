/* global React */

// ============================================================================
// Shared bits
// ============================================================================

const Logo = ({ tone = 'ink' }) => {
  const color = tone === 'ink' ? '#1a1814' : '#f6f3ee';
  const accent = 'oklch(0.62 0.12 50)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="2" y="14" width="10" height="12" fill={color} />
        <rect x="14" y="8" width="8" height="18" fill={color} />
        <rect x="6" y="4" width="4" height="8" fill={accent} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 15, color, letterSpacing: '-0.01em' }}>ATLAS<span style={{ color: accent }}>·</span>BTP</span>
        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: tone === 'ink' ? '#8a8378' : '#bdb5a6', marginTop: 3, letterSpacing: '0.08em' }}>ERP / GESTION CHANTIER</span>
      </div>
    </div>
  );
};

const Field = ({ label, type = 'text', placeholder, value, hint, optional, dark }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{
      fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: dark ? '#bdb5a6' : '#8a8378',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <span>{label}</span>
      {optional && <span style={{ color: dark ? '#7a7268' : '#b8b0a3', fontSize: 9 }}>optionnel</span>}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      style={{
        height: 44,
        padding: '0 14px',
        background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : '#e4ddd1'}`,
        borderRadius: 6,
        fontFamily: 'IBM Plex Sans',
        fontSize: 14,
        color: dark ? '#f6f3ee' : '#1a1814',
        outline: 'none',
      }}
    />
    {hint && <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: dark ? '#8a8378' : '#8a8378' }}>{hint}</span>}
  </label>
);

const Btn = ({ children, primary, dark, full, icon }) => (
  <button style={{
    height: 46,
    padding: full ? 0 : '0 18px',
    width: full ? '100%' : 'auto',
    background: primary ? '#1a1814' : (dark ? 'rgba(255,255,255,0.04)' : '#fff'),
    color: primary ? '#f6f3ee' : (dark ? '#f6f3ee' : '#1a1814'),
    border: primary ? '1px solid #1a1814' : `1px solid ${dark ? 'rgba(255,255,255,0.14)' : '#d6cebf'}`,
    borderRadius: 6,
    fontFamily: 'IBM Plex Sans',
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '-0.005em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
  }}>
    {icon}
    {children}
    {primary && <span style={{ fontFamily: 'IBM Plex Mono', opacity: 0.5, marginLeft: 4 }}>→</span>}
  </button>
);

const LangSwitch = ({ active = 'FR', dark }) => {
  const langs = ['FR', 'AR', 'EN'];
  return (
    <div style={{
      display: 'inline-flex',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : '#e4ddd1'}`,
      borderRadius: 999,
      padding: 3,
      gap: 2,
      background: dark ? 'rgba(255,255,255,0.03)' : 'transparent',
    }}>
      {langs.map(l => (
        <span key={l} style={{
          fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.08em',
          padding: '5px 10px', borderRadius: 999,
          background: l === active ? (dark ? '#f6f3ee' : '#1a1814') : 'transparent',
          color: l === active ? (dark ? '#1a1814' : '#f6f3ee') : (dark ? '#bdb5a6' : '#8a8378'),
          cursor: 'pointer',
        }}>{l}</span>
      ))}
    </div>
  );
};

const StripePlaceholder = ({ label, dark, tone = 'warm' }) => {
  const stripeColor = dark
    ? 'rgba(255,255,255,0.05)'
    : tone === 'warm' ? 'rgba(26,24,20,0.06)' : 'rgba(26,24,20,0.04)';
  const bg = dark ? '#26221d' : (tone === 'warm' ? '#efe9df' : '#f6f3ee');
  const textColor = dark ? '#7a7268' : '#8a8378';
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `repeating-linear-gradient(45deg, ${bg} 0 14px, ${stripeColor} 14px 15px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.15em',
      color: textColor,
      textTransform: 'uppercase',
    }}>
      [ {label} ]
    </div>
  );
};

// ============================================================================
// Variant 01 — Classique chantier
// Single panel, centered, with ticker of active sites below
// ============================================================================

function LoginClassique() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f6f3ee',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'IBM Plex Sans',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        height: 64,
        padding: '0 40px',
        borderBottom: '1px solid #e4ddd1',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#8a8378', letterSpacing: '0.1em' }}>
            v4.2.1 · CASABLANCA
          </span>
          <LangSwitch active="FR" />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 40px 0' }}>
        <div style={{ width: 420 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'oklch(0.50 0.13 45)', letterSpacing: '0.18em', marginBottom: 14 }}>
            ESPACE ENTREPRISE
          </div>
          <h1 style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 38,
            margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.1, color: '#1a1814',
          }}>
            Bienvenue.<br/>
            <span style={{ color: '#8a8378' }}>Connectez-vous à votre chantier.</span>
          </h1>
          <p style={{ fontSize: 14, color: '#46423b', margin: '0 0 28px', lineHeight: 1.5 }}>
            Suivi des coûts, pointage, achats, sous-traitance — accessible aux conducteurs de travaux, chefs de chantier et direction.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Identifiant / e-mail pro" placeholder="prenom.nom@entreprise.ma" />
            <div>
              <Field label="Mot de passe" type="password" placeholder="••••••••••" />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#46423b' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#1a1814' }} />
                  Rester connecté sur ce poste
                </label>
                <a style={{ fontSize: 12, color: 'oklch(0.50 0.13 45)', textDecoration: 'none', borderBottom: '1px dotted oklch(0.50 0.13 45)' }}>
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div style={{ marginTop: 4 }}>
              <Btn primary full>Accéder à l'ERP</Btn>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e4ddd1' }} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: '#8a8378', letterSpacing: '0.15em' }}>OU</span>
              <div style={{ flex: 1, height: 1, background: '#e4ddd1' }} />
            </div>

            <Btn full>Authentification par carte CIN entreprise</Btn>
          </div>

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e4ddd1', fontSize: 12, color: '#8a8378' }}>
            Pas encore de compte ?{' '}
            <a style={{ color: '#1a1814', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'oklch(0.62 0.12 50)', textUnderlineOffset: 3 }}>
              Demander un accès à votre administrateur
            </a>
          </div>
        </div>
      </div>

      {/* Active sites ticker */}
      <div style={{
        height: 56,
        borderTop: '1px solid #e4ddd1',
        background: '#efe9df',
        display: 'flex', alignItems: 'stretch',
        flexShrink: 0,
        fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#46423b',
      }}>
        <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', borderRight: '1px solid #d6cebf', background: '#1a1814', color: '#f6f3ee', letterSpacing: '0.1em' }}>
          ● CHANTIERS ACTIFS
        </div>
        {[
          ['CSB-114', 'Marina Casablanca · lot 3', '47%'],
          ['RBT-208', 'Tramway Rabat-Salé · ext.', '12%'],
          ['TNG-061', 'Port Tanger Med · digue', '89%'],
          ['AGD-033', 'Hôtel Taghazout Bay', '64%'],
        ].map(([code, name, pct], i) => (
          <div key={i} style={{
            padding: '0 22px', display: 'flex', alignItems: 'center', gap: 14,
            borderRight: i < 3 ? '1px solid #d6cebf' : 'none', flex: 1,
          }}>
            <span style={{ color: 'oklch(0.50 0.13 45)', fontWeight: 600 }}>{code}</span>
            <span style={{ flex: 1, color: '#46423b' }}>{name}</span>
            <span style={{ color: '#1a1814', fontWeight: 600 }}>{pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Variant 02 — Split éditorial
// Big image left with editorial copy, form right
// ============================================================================

function LoginSplit() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#1f1d1a',
      display: 'grid', gridTemplateColumns: '1.15fr 1fr',
      fontFamily: 'IBM Plex Sans',
    }}>
      {/* Left — editorial */}
      <div style={{
        position: 'relative',
        padding: 44,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        color: '#f6f3ee',
        overflow: 'hidden',
      }}>
        {/* Background placeholder */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <StripePlaceholder dark label="photo chantier — grue + structure béton" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(31,29,26,0.55) 0%, rgba(31,29,26,0.85) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Logo tone="paper" />
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', color: '#bdb5a6', textAlign: 'right' }}>
            <div style={{ marginBottom: 6 }}>EDITION 2026</div>
            <div style={{ color: 'oklch(0.72 0.12 55)' }}>● 142 ENTREPRISES · 8 200 UTILISATEURS</div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'oklch(0.72 0.12 55)', letterSpacing: '0.2em', marginBottom: 18 }}>
            — DEPUIS CASABLANCA, POUR LE BTP MAROCAIN
          </div>
          <h1 style={{
            fontFamily: 'Manrope', fontWeight: 800, fontSize: 56,
            lineHeight: 1, letterSpacing: '-0.035em',
            margin: '0 0 18px', maxWidth: 540,
          }}>
            Du devis au<br/>décompte final.<br/>
            <span style={{ color: 'oklch(0.72 0.12 55)', fontStyle: 'italic', fontWeight: 500 }}>un seul outil.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: '#d6cebf', maxWidth: 460, margin: 0 }}>
            Études de prix, planning, achats, sous-traitance, paie chantier, situations mensuelles, retenues de garantie. Conforme à la réglementation marocaine.
          </p>

          <div style={{ marginTop: 36, display: 'flex', gap: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {[
              ['DH 12.4 Mds', 'volume facturé via la plateforme'],
              ['98.7%', 'disponibilité service · 12 mois'],
              ['ISO 27001', 'données hébergées au Maroc'],
            ].map(([n, l], i) => (
              <div key={i}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>{n}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#bdb5a6', marginTop: 4, letterSpacing: '0.06em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        background: '#f6f3ee',
        padding: '44px 56px',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#8a8378' }}>Besoin d'aide ?</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#1a1814' }}>+212 5 22 00 00 00</span>
          <span style={{ width: 1, height: 16, background: '#d6cebf' }} />
          <LangSwitch active="FR" />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 380 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'oklch(0.50 0.13 45)', letterSpacing: '0.18em', marginBottom: 12 }}>
            01 / CONNEXION
          </div>
          <h2 style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 28,
            margin: '0 0 28px', letterSpacing: '-0.02em', color: '#1a1814',
          }}>
            Reprendre où vous en étiez.
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Field label="Identifiant" placeholder="prenom.nom" />
            <Field label="Mot de passe" type="password" placeholder="••••••••••" hint="8 caractères min., 1 chiffre, 1 majuscule" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#46423b' }}>
                <input type="checkbox" style={{ accentColor: 'oklch(0.50 0.13 45)' }} />
                Se souvenir de moi
              </label>
              <a style={{ fontSize: 12, color: 'oklch(0.50 0.13 45)' }}>Récupérer →</a>
            </div>

            <div style={{ marginTop: 8 }}>
              <Btn primary full>Se connecter</Btn>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#8a8378', paddingTop: 20, borderTop: '1px solid #e4ddd1' }}>
          <span>© 2026 Atlas BTP · Tous droits réservés</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a style={{ color: '#46423b' }}>Mentions légales</a>
            <a style={{ color: '#46423b' }}>CGU</a>
            <a style={{ color: '#46423b' }}>Statut système ●</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Variant 03 — Zellige discret
// Subtle Moroccan tile pattern, asymmetric card, role selector
// ============================================================================

function ZelligePattern() {
  // Generate a simple 8-pointed star pattern background with CSS
  const tile = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
      <g fill='none' stroke='oklch(0.62 0.12 50)' stroke-width='1' opacity='0.18'>
        <rect x='0' y='0' width='80' height='80' />
        <polygon points='40,8 52,28 72,28 56,42 64,62 40,52 16,62 24,42 8,28 28,28' />
        <polygon points='40,20 47,32 60,32 50,40 54,52 40,46 26,52 30,40 20,32 33,32' />
      </g>
    </svg>
  `);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,${tile}")`,
      backgroundSize: '80px 80px',
      maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 65%)',
      WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 65%)',
    }} />
  );
}

function LoginZellige() {
  const [role, setRole] = React.useState('conducteur');
  const roles = [
    { id: 'conducteur', label: 'Conducteur de travaux', code: 'CT' },
    { id: 'chef', label: 'Chef de chantier', code: 'CC' },
    { id: 'compta', label: 'Comptabilité / Paie', code: 'CP' },
    { id: 'direction', label: 'Direction', code: 'DG' },
  ];
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#f6f3ee',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'IBM Plex Sans',
      display: 'flex', flexDirection: 'column',
    }}>
      <ZelligePattern />

      {/* Top */}
      <div style={{ position: 'relative', padding: '32px 44px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo />
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#8a8378', letterSpacing: '0.12em' }}>
            ● PLATEFORME OPÉRATIONNELLE
          </span>
          <LangSwitch active="FR" />
        </div>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', flex: 1, display: 'grid', gridTemplateColumns: '1fr 520px', gap: 60, padding: '0 60px 40px', alignItems: 'center' }}>
        {/* Left — title */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 12px', borderRadius: 999,
            background: '#fff', border: '1px solid #e4ddd1',
            fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'oklch(0.50 0.13 45)', letterSpacing: '0.12em',
            marginBottom: 22,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'oklch(0.62 0.12 50)' }} />
            ENTREPRISES BTP — MAROC
          </div>

          <h1 style={{
            fontFamily: 'Manrope', fontWeight: 700, fontSize: 64,
            lineHeight: 0.98, letterSpacing: '-0.035em',
            margin: '0 0 18px', color: '#1a1814',
          }}>
            Le chantier,<br/>
            <span style={{ color: 'oklch(0.50 0.13 45)' }}>bien tenu.</span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#46423b', maxWidth: 380, margin: '0 0 28px' }}>
            L'ERP pensé pour les entrepreneurs marocains du gros œuvre, second œuvre, VRD et travaux divers. Conforme CNSS, DGI et procédures marchés publics.
          </p>

          {/* Module strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 480 }}>
            {['Études', 'Devis', 'Achats', 'Sous-traitance', 'Pointage', 'Paie', 'Situations', 'Factures', 'TVA', 'Stock', 'Matériel', 'Cautions'].map(m => (
              <span key={m} style={{
                padding: '6px 11px', borderRadius: 4,
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid #e4ddd1',
                fontFamily: 'IBM Plex Mono', fontSize: 11, color: '#46423b',
                letterSpacing: '0.02em',
              }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Right — card */}
        <div style={{
          background: '#fff',
          border: '1px solid #e4ddd1',
          borderRadius: 10,
          padding: 32,
          boxShadow: '0 1px 0 #fff inset, 0 30px 60px -30px rgba(26,24,20,0.18), 0 0 0 6px rgba(255,255,255,0.6)',
          position: 'relative',
        }}>
          {/* Tab bar role */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.12em', color: '#8a8378', marginBottom: 10 }}>
              JE ME CONNECTE EN TANT QUE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {roles.map(r => (
                <button key={r.id} onClick={() => setRole(r.id)} style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  background: role === r.id ? '#1a1814' : '#f6f3ee',
                  color: role === r.id ? '#f6f3ee' : '#1a1814',
                  border: `1px solid ${role === r.id ? '#1a1814' : '#e4ddd1'}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontFamily: 'IBM Plex Sans',
                }}>
                  <span style={{
                    fontFamily: 'IBM Plex Mono', fontSize: 10,
                    padding: '2px 6px', borderRadius: 3,
                    background: role === r.id ? 'oklch(0.62 0.12 50)' : '#fff',
                    color: role === r.id ? '#1a1814' : '#46423b',
                    border: role === r.id ? 'none' : '1px solid #e4ddd1',
                  }}>{r.code}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: '#e4ddd1', margin: '0 -32px 22px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="E-mail professionnel" placeholder="prenom.nom@entreprise.ma" />
            <Field label="Mot de passe" type="password" placeholder="••••••••••" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#46423b' }}>
                <input type="checkbox" style={{ accentColor: '#1a1814' }} />
                Garder ma session active
              </label>
              <a style={{ fontSize: 12, color: 'oklch(0.50 0.13 45)' }}>Mot de passe oublié ?</a>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <Btn primary full>Entrer dans l'espace</Btn>
            </div>

            <div style={{
              marginTop: 6,
              padding: 12,
              background: '#f6f3ee',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 11, color: '#46423b',
              border: '1px dashed #d6cebf',
            }}>
              <span style={{
                fontFamily: 'IBM Plex Mono', fontSize: 9,
                padding: '2px 6px', background: '#1a1814', color: '#f6f3ee', borderRadius: 3, letterSpacing: '0.08em',
              }}>2FA</span>
              <span>Vérification par SMS au numéro <b style={{ color: '#1a1814' }}>•• •• •• •• 47</b> après identification.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        padding: '14px 44px',
        borderTop: '1px solid #e4ddd1',
        background: 'rgba(255,255,255,0.5)',
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.08em', color: '#8a8378',
      }}>
        <span>SERVEUR · CASABLANCA-TECHNOPARK · RGPD + LOI 09-08</span>
        <span>BUILD 2026.05 · ÉTAT ● OPÉRATIONNEL</span>
      </div>
    </div>
  );
}

Object.assign(window, { LoginClassique, LoginSplit, LoginZellige });
