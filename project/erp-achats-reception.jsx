/* global React, TOKENS, Icon, Pill, Modal, FieldGroup, TextInput, TextArea, Select, Radio, Button, fmtMAD */
// =============================================================================
// ERP — Achats — Réception magasin
// Formulaire complet : BL (n°, date, transporteur), écart de livraison, qualité,
// affectation magasin, photos justificatives
// =============================================================================

function ReceptionMagasinModal({ bc, onClose }) {
  // Catalog de lignes attendues (déduit du BC)
  const expected = parseItems(bc.items);

  const [form, setForm] = React.useState({
    blNum: 'BL-' + Math.floor(20000 + Math.random() * 80000),
    blDate: '28/05/2026',
    transporteur: '',
    magasin: 'Magasin chantier — base-vie CSB',
    receptionneur: 'R. Bouhsina',
    observations: '',
    qualiteGlobale: 'conforme',
    photos: 0,
  });
  const [lignes, setLignes] = React.useState(expected.map(e => ({
    ...e, livre: e.attendu, ecart: 0, motifEcart: '',
  })));
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updLigne = (i, k, v) => setLignes(l => l.map((x, idx) => idx === i ? { ...x, [k]: v, ecart: k === 'livre' ? v - x.attendu : x.ecart } : x));

  const ecartTotal = lignes.reduce((s, l) => s + Math.abs(l.ecart), 0);
  const hasEcart   = ecartTotal > 0;
  const tauxReception = lignes.reduce((s, l) => s + l.livre, 0) / lignes.reduce((s, l) => s + l.attendu, 0) * 100;

  const submit = () => {
    if (!form.transporteur.trim()) { window.toast('Transporteur requis', 'error'); return; }
    if (hasEcart && !lignes.every(l => l.ecart === 0 || l.motifEcart.trim())) {
      window.toast('Motif d\'écart requis pour chaque ligne avec écart', 'error'); return;
    }
    if (form.qualiteGlobale !== 'conforme' && !form.observations.trim()) {
      window.toast('Observations requises (qualité non conforme)', 'error'); return;
    }
    onClose();
    if (hasEcart || form.qualiteGlobale !== 'conforme') {
      window.toast(
        'Réception enregistrée avec réserves',
        'warn',
        `${bc.num} · ${form.blNum} · taux ${tauxReception.toFixed(0)}%`,
      );
    } else {
      window.toast('Réception conforme enregistrée', 'success', `${bc.num} · ${form.blNum}`);
    }
  };

  return (
    <Modal open onClose={onClose}
      title={`Réception magasin — ${bc.num}`}
      subtitle={`${bc.siteName} · Fournisseur : ${window.FOURNISSEURS_NAMES?.[bc.fournisseur] || bc.fournisseur} · Délai prévu : ${bc.delai}`}
      width={960}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={() => window.toast('Brouillon réception sauvé', 'info')}>Brouillon</Button>
        {hasEcart && (
          <Button onClick={() => window.toast('Réserve écrite envoyée au fournisseur', 'info')}
            icon={<Icon name="warning" size={13} stroke={TOKENS.amber} />}>
            Émettre réserves
          </Button>
        )}
        <Button variant="primary" onClick={submit}
          icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
          Valider la réception
        </Button>
      </>}
    >
      {/* En-tête BL */}
      <div style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 8, padding: 16, marginBottom: 18 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 12 }}>
          BORDEREAU DE LIVRAISON
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          <FieldGroup label="N° BL fournisseur" required>
            <TextInput value={form.blNum} onChange={(v) => upd('blNum', v)} mono />
          </FieldGroup>
          <FieldGroup label="Date BL">
            <TextInput value={form.blDate} onChange={(v) => upd('blDate', v)} mono placeholder="JJ/MM/AAAA" />
          </FieldGroup>
          <FieldGroup label="Transporteur" required>
            <TextInput value={form.transporteur} onChange={(v) => upd('transporteur', v)} placeholder="TIM Logistique · matricule 12345-A-09" />
          </FieldGroup>
          <FieldGroup label="Réceptionneur">
            <Select value={form.receptionneur} onChange={(v) => upd('receptionneur', v)}
              options={['R. Bouhsina', 'A. Lahmer', 'M. Tahiri', 'S. Bakkali']} />
          </FieldGroup>
        </div>
        <FieldGroup label="Magasin / lieu de réception">
          <Select value={form.magasin} onChange={(v) => upd('magasin', v)} options={[
            'Magasin chantier — base-vie CSB',
            'Magasin central Atlas — Aïn Sebaa',
            'Aire de stockage extérieure zone B',
            'Sous-sol — réserve sécurisée',
          ]} />
        </FieldGroup>
      </div>

      {/* Tableau de pointage */}
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 8 }}>
        POINTAGE DES ARTICLES — comparaison BC vs livré
      </div>
      <div style={{ border: `1px solid ${TOKENS.line}`, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 1.4fr',
          padding: '10px 14px', background: TOKENS.ink, color: TOKENS.bg,
          fontFamily: 'IBM Plex Mono', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>Article</span>
          <span style={{ textAlign: 'right' }}>Attendu</span>
          <span style={{ textAlign: 'right' }}>Livré</span>
          <span style={{ textAlign: 'right' }}>Écart</span>
          <span>Motif écart / Observation</span>
        </div>
        {lignes.map((l, i) => {
          const ecart = l.livre - l.attendu;
          const isEcart = ecart !== 0;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 1.4fr',
              padding: '12px 14px', alignItems: 'center', gap: 8,
              borderBottom: i < lignes.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              background: isEcart ? TOKENS.amberSoft : TOKENS.paper,
            }}>
              <div style={{ fontSize: 12, color: TOKENS.ink }}>
                <div style={{ fontWeight: 500 }}>{l.label}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>{l.unite}</div>
              </div>
              <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.ink3 }}>
                {l.attendu}
              </span>
              <input type="number" value={l.livre} onChange={(e) => updLigne(i, 'livre', Number(e.target.value) || 0)}
                style={{
                  height: 30, padding: '0 8px', textAlign: 'right',
                  border: `1px solid ${isEcart ? TOKENS.amber : TOKENS.line2}`, borderRadius: 4,
                  fontFamily: 'IBM Plex Mono', fontSize: 12,
                  background: isEcart ? '#fff8ec' : TOKENS.paper,
                  color: isEcart ? TOKENS.ocreDeep : TOKENS.ink,
                  outline: 'none',
                }} />
              <span style={{
                textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600,
                color: ecart === 0 ? TOKENS.green : ecart < 0 ? TOKENS.red : TOKENS.amber,
              }}>
                {ecart === 0 ? '✓' : (ecart > 0 ? '+' : '') + ecart}
              </span>
              {isEcart ? (
                <input value={l.motifEcart} onChange={(e) => updLigne(i, 'motifEcart', e.target.value)}
                  placeholder="Reliquat à livrer / casse / qualité…"
                  style={{
                    height: 30, padding: '0 10px',
                    border: `1px solid ${TOKENS.amber}`, borderRadius: 4,
                    fontFamily: 'IBM Plex Sans', fontSize: 11.5,
                    background: '#fff8ec', color: TOKENS.ink, outline: 'none',
                  }} />
              ) : (
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.green, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check" size={11} stroke={TOKENS.green} strokeWidth={2.5} /> conforme quantité
                </span>
              )}
            </div>
          );
        })}
        {/* Récap */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 1.4fr',
          padding: '12px 14px', background: TOKENS.bg, borderTop: `2px solid ${TOKENS.ink}`,
          fontFamily: 'IBM Plex Mono', fontSize: 11.5, fontWeight: 700, alignItems: 'center', gap: 8,
        }}>
          <span>Synthèse</span>
          <span style={{ textAlign: 'right' }}>{lignes.reduce((s, l) => s + l.attendu, 0)}</span>
          <span style={{ textAlign: 'right' }}>{lignes.reduce((s, l) => s + l.livre, 0)}</span>
          <span style={{ textAlign: 'right', color: hasEcart ? TOKENS.amber : TOKENS.green }}>
            {hasEcart ? '±' + ecartTotal : '✓'}
          </span>
          <span style={{ color: hasEcart ? TOKENS.amber : TOKENS.green, fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: 12 }}>
            Taux de réception : {tauxReception.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Contrôle qualité */}
      <div style={{ marginBottom: 16 }}>
        <FieldGroup label="Contrôle qualité visuel" required>
          <Radio value={form.qualiteGlobale} onChange={(v) => upd('qualiteGlobale', v)} options={[
            ['conforme',   'Conforme',    'Article OK'],
            ['reserve',    'Avec réserve','Défaut mineur'],
            ['nonconforme','Non conforme','Refus partiel/total'],
          ]} />
        </FieldGroup>

        {/* Checklist qualité */}
        <div style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 8, padding: 14, marginTop: 4 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em', marginBottom: 10 }}>
            CHECKLIST RÉCEPTION
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              'Emballage non détérioré',
              'Marquage / étiquetage conforme',
              'Documents techniques fournis (PV essais, fiche produit)',
              'Numéro de lot tracé',
              'Date de péremption / fabrication vérifiée',
              'Quantité comptée contradictoirement',
              'Échantillonnage conservé (si lot critique)',
              'Photos avant déchargement prises',
            ].map((q, i) => (
              <label key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', cursor: 'pointer', fontSize: 11.5, color: TOKENS.ink2, lineHeight: 1.4 }}>
                <input type="checkbox" defaultChecked={form.qualiteGlobale === 'conforme'} style={{ marginTop: 2, accentColor: TOKENS.ocre }} />
                {q}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Photos justificatives */}
      <FieldGroup label="Photos jointes (BL, déchargement, qualité)">
        <div style={{
          padding: 16, border: `2px dashed ${TOKENS.line2}`, borderRadius: 8,
          background: TOKENS.bg, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        }}
        onClick={() => { upd('photos', form.photos + 3); window.toast(`${form.photos + 3} photos importées`, 'success'); }}>
          <div style={{
            width: 44, height: 44, borderRadius: 6, background: TOKENS.bgWarm,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: TOKENS.ink3,
          }}>
            <Icon name="plus" size={20} stroke={TOKENS.ink3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>
              Glisser des photos ou cliquer pour parcourir
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 4 }}>
              JPG / PNG · max 5 Mo · {form.photos} photo{form.photos > 1 ? 's' : ''} ajoutée{form.photos > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </FieldGroup>

      <FieldGroup label="Observations & remarques" hint="Visible dans le dossier qualité du chantier">
        <TextArea value={form.observations} onChange={(v) => upd('observations', v)} rows={3}
          placeholder="Ex : 2 toupies livrées au lieu de 4. Reliquat 140 m³ replanifié au 30/05. PV essai béton conforme." />
      </FieldGroup>

      {/* Synthèse impact compta */}
      <div style={{ background: TOKENS.ink, color: TOKENS.bg, borderRadius: 8, padding: 14, marginTop: 4, display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999, flexShrink: 0,
          background: hasEcart ? TOKENS.amber : TOKENS.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={hasEcart ? 'warning' : 'check'} size={16} stroke={TOKENS.ink} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ocre, letterSpacing: '0.12em', marginBottom: 4 }}>
            IMPACT COMPTABLE
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>
            {hasEcart
              ? <>Facturation fournisseur à <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>{fmtMAD(bc.montant * (tauxReception / 100))} DH HT</b> (au prorata livré). Reliquat <b>{(100 - tauxReception).toFixed(1)}%</b> à recevoir avant validation finale.</>
              : <>Bon à payer généré pour <b style={{ color: TOKENS.ocre, fontFamily: 'IBM Plex Mono' }}>{fmtMAD(bc.montant)} DH HT</b> dès réception facture fournisseur. Stock magasin mis à jour automatiquement.</>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Parse "TOR Ø12, Ø16, Ø20 — 28 t" into rows
// -----------------------------------------------------------------------------
function parseItems(items) {
  // simple heuristic: split on commas; each piece gets a quantity number found at the end
  const parts = items.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return [{ label: items, attendu: 1, unite: 'unité' }];

  // Try to extract overall quantity from suffix "— 28 t"
  const overallMatch = items.match(/[—\-–]\s*(\d+(?:[.,]\d+)?)\s*([a-zA-Zéèà²³]+)/);
  const overall = overallMatch ? { n: Number(overallMatch[1].replace(',', '.')), u: overallMatch[2] } : null;

  return parts.map((p, i) => {
    const m = p.match(/(\d+(?:[.,]\d+)?)\s*([a-zA-Zéèà²³]+)/);
    let attendu = m ? Number(m[1].replace(',', '.')) : (overall ? Math.round(overall.n / parts.length) : 1);
    let unite = m ? m[2] : (overall ? overall.u : 'unité');
    const label = p.replace(/[—\-–]\s*\d+.*$/, '').trim() || p;
    return { label, attendu, unite };
  });
}

Object.assign(window, { ReceptionMagasinModal });
