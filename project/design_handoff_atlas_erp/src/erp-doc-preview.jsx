/* global React, ReactDOM, TOKENS, Icon, Pill, Button, fmtMAD */
// =============================================================================
// ERP — Aperçu A4 (preview overlay)
// Modale plein écran qui affiche un document A4 prêt à imprimer / télécharger
// Utilisable pour : Facture, Devis, Situation
// =============================================================================

// -----------------------------------------------------------------------------
// 1. Shell — overlay + barre d'actions + page A4 595×842 @72dpi (≈ 794×1123 @96dpi)
// -----------------------------------------------------------------------------
function DocPreviewShell({ onClose, eyebrow, title, docCode, children }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1300,
      background: 'rgba(20,18,14,0.78)',
      display: 'flex', flexDirection: 'column',
      animation: 'erpFadeUp 160ms ease both',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '14px 22px', background: TOKENS.ink, color: TOKENS.bg,
        display: 'flex', alignItems: 'center', gap: 14, borderBottom: `1px solid #2a2620`,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocre, letterSpacing: '0.15em' }}>
            {eyebrow} · APERÇU AVANT ENVOI
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: TOKENS.bg, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
            {docCode && <span style={{ color: TOKENS.ocre, marginLeft: 10, fontFamily: 'IBM Plex Mono', fontSize: 12 }}>{docCode}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => window.toast('Document envoyé par email', 'success')} style={btn()}>Envoyer par email</button>
          <button onClick={() => window.print && window.print()} style={btn()}>Imprimer</button>
          <button onClick={() => window.toast('PDF généré', 'success', title)} style={btn('primary')}>Télécharger PDF</button>
          <span style={{ width: 1, height: 22, background: '#3a342c', margin: '0 4px' }} />
          <button onClick={onClose} style={{ ...btn(), width: 32, padding: 0, display: 'flex', justifyContent: 'center' }}>
            <Icon name="x" size={14} stroke={TOKENS.bg} />
          </button>
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 0 44px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 794, minHeight: 1123,
          background: TOKENS.paper, color: TOKENS.ink,
          boxShadow: '0 20px 60px -10px rgba(0,0,0,0.45)',
          fontFamily: 'IBM Plex Sans',
          padding: '52px 56px 64px',
          position: 'relative',
        }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function btn(variant) {
  const isPrimary = variant === 'primary';
  return {
    height: 32, padding: '0 14px',
    background: isPrimary ? TOKENS.ocre : 'transparent',
    color: isPrimary ? TOKENS.ink : TOKENS.bg,
    border: `1px solid ${isPrimary ? TOKENS.ocre : '#4a4238'}`, borderRadius: 6,
    fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500, cursor: 'pointer',
  };
}

// -----------------------------------------------------------------------------
// 2. Letterhead réutilisable (en-tête papier Atlas·BTP)
// -----------------------------------------------------------------------------
function PaperLetterhead({ docKind, docCode, docDate }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${TOKENS.ink}`, paddingBottom: 14 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="26" height="26" viewBox="0 0 28 28">
            <rect x="2" y="14" width="10" height="12" fill={TOKENS.ink} />
            <rect x="14" y="8" width="8" height="18" fill={TOKENS.ink} />
            <rect x="6" y="4" width="4" height="8" fill={TOKENS.ocre} />
          </svg>
          <div>
            <div style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1 }}>
              ATLAS<span style={{ color: TOKENS.ocre }}>·</span>BTP
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 7.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginTop: 3 }}>
              CONSTRUCTIONS · CASABLANCA
            </div>
          </div>
        </div>
        <div style={{ fontSize: 9.5, color: TOKENS.ink2, lineHeight: 1.55 }}>
          <b>Atlas Constructions S.A.</b><br />
          78, Boulevard Mohammed V, Casablanca 20000<br />
          Tél. +212 5 22 00 00 00 · contact@atlasbtp.ma<br />
          ICE 002578946000093 · RC 145789 · IF 24578946 · CNSS 7845612
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{
          display: 'inline-block', padding: '5px 11px', borderRadius: 4,
          background: TOKENS.ocreSoft, color: TOKENS.ocreDeep,
          fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.1em', marginBottom: 8,
        }}>
          {docKind}
        </div>
        <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.ocreDeep, letterSpacing: '-0.01em', lineHeight: 1 }}>
          {docCode}
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 8 }}>
          Établi le {docDate}
        </div>
      </div>
    </div>
  );
}

function PaperFooter({ pageOf = '1 / 1' }) {
  return (
    <div style={{
      position: 'absolute', left: 56, right: 56, bottom: 28,
      paddingTop: 10, borderTop: `1px solid ${TOKENS.line}`,
      display: 'flex', justifyContent: 'space-between',
      fontFamily: 'IBM Plex Mono', fontSize: 8, color: TOKENS.ink3, letterSpacing: '0.04em',
    }}>
      <span>Atlas Constructions S.A. · document confidentiel</span>
      <span>Page {pageOf} · généré par Atlas·BTP ERP</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. FACTURE A4 — DocPreviewShell + corps facture
// -----------------------------------------------------------------------------
function FactureDocPreview({ facture, onClose }) {
  const tva = facture.montantHT * 0.20;
  const ttc = facture.montantHT + tva;
  const fmtDateFR = (iso) => {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };
  // Décomposition simplifiée: 1 ligne globale = objet du chantier
  const lignes = [
    { des: facture.chantier, qte: 1, unit: 'forfait', pu: facture.montantHT, total: facture.montantHT },
  ];

  return (
    <DocPreviewShell
      onClose={onClose}
      eyebrow="FACTURE CLIENT"
      title={facture.client}
      docCode={facture.num}
    >
      <PaperLetterhead docKind="FACTURE" docCode={facture.num} docDate={fmtDateFR(facture.date)} />

      {/* Adresse client */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 22 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 6 }}>
            FACTURÉ À
          </div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: TOKENS.ink, marginBottom: 4 }}>
            {facture.client}
          </div>
          <div style={{ fontSize: 10.5, color: TOKENS.ink2, lineHeight: 1.55 }}>
            Service comptabilité<br />
            Casablanca, Maroc<br />
            ICE — à compléter
          </div>
        </div>
        <div style={{
          padding: 14, background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 4,
        }}>
          {[
            ['Date d\'émission', fmtDateFR(facture.date)],
            ['Échéance', fmtDateFR(facture.echeance)],
            ['Mode règlement', facture.mode === 'virement' ? 'Virement' : 'Chèque'],
            ['Référence chantier', facture.chantier],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 10.5 }}>
              <span style={{ color: TOKENS.ink3 }}>{k}</span>
              <span style={{ fontFamily: 'IBM Plex Mono', color: TOKENS.ink, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', padding: '28px 0 14px' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.2em', marginBottom: 6 }}>
          FACTURE DE TRAVAUX
        </div>
        <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 19, margin: 0, letterSpacing: '-0.02em' }}>
          {facture.chantier}
        </h2>
      </div>

      {/* Lignes */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left')}>DÉSIGNATION</th>
            <th style={pCell('right', { width: 70 })}>QTÉ</th>
            <th style={pCell('center', { width: 60 })}>U</th>
            <th style={pCell('right', { width: 100 })}>P.U. HT</th>
            <th style={pCell('right', { width: 110 })}>TOTAL HT</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
              <td style={pCell('left')}>{l.des}</td>
              <td style={pCell('right', { mono: true })}>{l.qte}</td>
              <td style={pCell('center', { mono: true })}>{l.unit}</td>
              <td style={pCell('right', { mono: true })}>{l.pu.toLocaleString('fr-FR')}</td>
              <td style={pCell('right', { mono: true, fontWeight: 600 })}>{l.total.toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totaux */}
      <div style={{ marginTop: 18, marginLeft: '50%' }}>
        {[
          { l: 'Total HT', v: facture.montantHT },
          { l: 'TVA 20%',  v: tva },
          { l: 'TOTAL TTC', v: ttc, big: true },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: r.big ? '10px 12px' : '5px 12px',
            background: r.big ? TOKENS.ink : 'transparent',
            color: r.big ? TOKENS.bg : TOKENS.ink,
            borderTop: r.big ? 'none' : `1px solid ${TOKENS.line}`,
            marginTop: r.big ? 4 : 0, borderRadius: r.big ? 4 : 0,
          }}>
            <span style={{ fontSize: r.big ? 12 : 10.5, fontWeight: r.big ? 600 : 400 }}>{r.l}</span>
            <span style={{
              fontFamily: 'IBM Plex Mono', fontSize: r.big ? 14 : 11,
              fontWeight: r.big ? 700 : 500,
              color: r.big ? TOKENS.ocre : TOKENS.ink,
            }}>{r.v.toLocaleString('fr-FR')} DH</span>
          </div>
        ))}
      </div>

      {/* Arrêté en lettres */}
      <div style={{ marginTop: 24, padding: 14, border: `1px solid ${TOKENS.line}`, borderRadius: 4, background: TOKENS.bg, fontSize: 10.5, lineHeight: 1.55 }}>
        <b>Arrêtée la présente facture</b> à la somme de <b>{fmtMAD(ttc)} dirhams toutes taxes comprises</b> ({(ttc).toLocaleString('fr-FR')} DH).
      </div>

      {/* Conditions règlement */}
      <div style={{ marginTop: 22, fontSize: 9.5, color: TOKENS.ink2, lineHeight: 1.6 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 6 }}>
          CONDITIONS DE RÈGLEMENT
        </div>
        Paiement à <b>30 jours date de facture</b>, par {facture.mode === 'virement' ? 'virement bancaire' : 'chèque à l\'ordre d\'Atlas Constructions S.A.'}.<br />
        BMCE Bank — RIB : <span style={{ fontFamily: 'IBM Plex Mono' }}>011 780 0000 1234567890 12</span>.<br />
        Tout retard de paiement entraîne une pénalité de retard égale à 3 fois le taux d'intérêt légal en vigueur, conformément à l'article 78 du Code de commerce marocain.
      </div>

      {/* Signature */}
      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 12, minHeight: 100 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 4 }}>SERVICE COMPTABILITÉ</div>
          <div style={{ fontSize: 11, color: TOKENS.ink2, marginBottom: 36 }}>Atlas Constructions S.A.</div>
          <div style={{ borderTop: `1px dashed ${TOKENS.line2}`, paddingTop: 4, fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3 }}>
            Date · Signature · Cachet
          </div>
        </div>
        <div style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 12, background: TOKENS.ocreSoft }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 4 }}>BON POUR ACCORD</div>
          <div style={{ fontSize: 10.5, color: TOKENS.ink2, lineHeight: 1.5 }}>
            Le client reconnaît avoir reçu la prestation décrite ci-dessus et s'engage à régler la facture aux échéances convenues.
          </div>
        </div>
      </div>

      <PaperFooter />
    </DocPreviewShell>
  );
}

function pCell(align, opt = {}) {
  return {
    padding: '8px 8px',
    textAlign: align,
    fontFamily: opt.mono ? 'IBM Plex Mono' : 'IBM Plex Sans',
    fontWeight: opt.fontWeight || 400,
    width: opt.width,
    fontSize: 10.5,
    letterSpacing: '0.02em',
  };
}

// -----------------------------------------------------------------------------
// 4. DEVIS A4 (utilisé via window.DevisDocPreview)
// -----------------------------------------------------------------------------
function DevisDocPreview({ devis, onClose }) {
  return (
    <DocPreviewShell onClose={onClose} eyebrow="DEVIS / PROPOSITION COMMERCIALE" title={devis.name} docCode={devis.code}>
      <PaperLetterhead docKind="DEVIS" docCode={devis.code} docDate={devis.date} />
      <div style={{ textAlign: 'center', padding: '24px 0 18px' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.2em', marginBottom: 6 }}>
          DEVIS ESTIMATIF
        </div>
        <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>
          {devis.name}
        </h2>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 6 }}>
          Établi pour : <b style={{ color: TOKENS.ink }}>{devis.client}</b> · Validité 30 jours
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: TOKENS.ink, color: TOKENS.bg }}>
            <th style={pCell('left', { width: 50 })}>N°</th>
            <th style={pCell('left')}>DÉSIGNATION DES OUVRAGES</th>
            <th style={pCell('right', { width: 60 })}>QTÉ</th>
            <th style={pCell('center', { width: 50 })}>U</th>
            <th style={pCell('right', { width: 80 })}>P.U. HT</th>
            <th style={pCell('right', { width: 100 })}>TOTAL HT</th>
          </tr>
        </thead>
        <tbody>
          {[
            { n: '01', lot: 'GROS ŒUVRE',     d: 'Béton armé fondations, semelles, poteaux', q: 380, u: 'm³', pu: 1900 },
            { n: '02', lot: 'GROS ŒUVRE',     d: 'Maçonnerie agglos 20cm avec enduits',      q: 1200, u: 'm²', pu: 145 },
            { n: '03', lot: 'ÉTANCHÉITÉ',     d: 'Étanchéité multicouche + isolation thermique', q: devis.surface * 0.6, u: 'm²', pu: 380 },
            { n: '04', lot: 'MENUISERIE ALU', d: 'Châssis fixes et ouvrants, baies vitrées',  q: 95, u: 'm²', pu: 2400 },
            { n: '05', lot: 'ÉLECTRICITÉ',    d: 'Installation CFO/CFA — distribution complète', q: 1, u: 'forf.', pu: devis.total * 0.08 },
            { n: '06', lot: 'PLOMBERIE',      d: 'Réseaux EF/EC, évacuation, sanitaires',     q: 1, u: 'forf.', pu: devis.total * 0.07 },
            { n: '07', lot: 'REVÊTEMENTS',    d: 'Carrelage, faïence, peinture',             q: devis.surface, u: 'm²', pu: 480 },
          ].map((r, i) => {
            const total = r.q * r.pu;
            return (
              <tr key={i} style={{ borderBottom: `0.5px solid ${TOKENS.line}` }}>
                <td style={pCell('left', { mono: true })}><span style={{ color: TOKENS.ocreDeep }}>{r.n}</span></td>
                <td style={pCell('left')}>
                  <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{r.lot}</div>
                  <div>{r.d}</div>
                </td>
                <td style={pCell('right', { mono: true })}>{Math.round(r.q).toLocaleString('fr-FR')}</td>
                <td style={pCell('center', { mono: true })}>{r.u}</td>
                <td style={pCell('right', { mono: true })}>{Math.round(r.pu).toLocaleString('fr-FR')}</td>
                <td style={pCell('right', { mono: true, fontWeight: 600 })}>{Math.round(total).toLocaleString('fr-FR')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totaux */}
      <div style={{ marginTop: 18, marginLeft: '45%' }}>
        {[
          { l: 'Total HT estimatif', v: devis.total },
          { l: 'TVA 20%',           v: devis.total * 0.2 },
          { l: 'TOTAL TTC ESTIMATIF', v: devis.total * 1.2, big: true },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: r.big ? '10px 12px' : '5px 12px',
            background: r.big ? TOKENS.ink : 'transparent', color: r.big ? TOKENS.bg : TOKENS.ink,
            borderTop: r.big ? 'none' : `1px solid ${TOKENS.line}`, marginTop: r.big ? 4 : 0, borderRadius: r.big ? 4 : 0,
          }}>
            <span style={{ fontSize: r.big ? 12 : 10.5, fontWeight: r.big ? 600 : 400 }}>{r.l}</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: r.big ? 14 : 11, fontWeight: r.big ? 700 : 500,
              color: r.big ? TOKENS.ocre : TOKENS.ink }}>{Math.round(r.v).toLocaleString('fr-FR')} DH</span>
          </div>
        ))}
      </div>

      {/* Conditions */}
      <div style={{ marginTop: 26, padding: 14, background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 4, fontSize: 10, color: TOKENS.ink2, lineHeight: 1.6 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 6 }}>
          CONDITIONS GÉNÉRALES
        </div>
        <b>Validité de l'offre :</b> 30 jours à compter de la date d'émission · <b>Délai d'exécution :</b> à convenir contractuellement.<br />
        <b>Modalités de règlement :</b> 30% à la commande, 40% en cours de chantier (sur situations), 30% à la réception.<br />
        Prix fermes hors révision. Tous travaux non prévus au présent devis feront l'objet d'un avenant écrit.
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 4, padding: 12, minHeight: 100 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3, letterSpacing: '0.12em', marginBottom: 4 }}>L'ENTREPRISE</div>
          <div style={{ fontSize: 11, color: TOKENS.ink2, marginBottom: 36 }}>Atlas Constructions S.A.</div>
          <div style={{ borderTop: `1px dashed ${TOKENS.line2}`, paddingTop: 4, fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3 }}>
            Date · Signature · Cachet
          </div>
        </div>
        <div style={{ border: `1px solid ${TOKENS.ocre}`, borderRadius: 4, padding: 12, background: TOKENS.ocreSoft, minHeight: 100 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 4 }}>BON POUR ACCORD DU CLIENT</div>
          <div style={{ fontSize: 10.5, color: TOKENS.ink2, marginBottom: 36 }}>« Bon pour accord » — manuscrit · {devis.client}</div>
          <div style={{ borderTop: `1px dashed ${TOKENS.ocre}`, paddingTop: 4, fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ocreDeep }}>
            Date · Signature · Cachet
          </div>
        </div>
      </div>

      <PaperFooter />
    </DocPreviewShell>
  );
}

Object.assign(window, { DocPreviewShell, PaperLetterhead, PaperFooter, FactureDocPreview, DevisDocPreview });
