/* global React, TOKENS, Icon, Pill, Card, Button, fmtMAD */
// =============================================================================
// ERP — Éditeur de devis / facture à lignes éditables
// Un vrai tableau de postes : ajouter / modifier / supprimer une ligne,
// quantité × prix unitaire, remise, TVA, sous-totaux et total TTC en direct.
// Exposé via window.DevisEditor — utilisable pour devis ET facture (prop `kind`).
// =============================================================================

(function () {

const UNITS = ['U', 'm²', 'm³', 'ml', 'm', 'kg', 'T', 'forfait', 'ens', 'h', 'j'];

// Bibliothèque de postes types (BTP Maroc) — pour insertion rapide
const POSTES_BIBLIO = [
  { designation: 'Terrassement en pleine masse', unit: 'm³', pu: 45 },
  { designation: 'Béton de propreté dosé à 250 kg/m³', unit: 'm³', pu: 950 },
  { designation: 'Béton armé pour fondations (B25)', unit: 'm³', pu: 1450 },
  { designation: 'Béton armé pour poteaux / poutres', unit: 'm³', pu: 1650 },
  { designation: 'Plancher corps creux 20+5', unit: 'm²', pu: 280 },
  { designation: 'Maçonnerie agglos creux ép. 20', unit: 'm²', pu: 120 },
  { designation: 'Enduit intérieur au mortier de ciment', unit: 'm²', pu: 75 },
  { designation: 'Étanchéité multicouche autoprotégée', unit: 'm²', pu: 190 },
  { designation: 'Carrelage grès cérame 60×60', unit: 'm²', pu: 220 },
  { designation: 'Menuiserie aluminium (fourni/posé)', unit: 'm²', pu: 1100 },
  { designation: 'Peinture vinylique 2 couches', unit: 'm²', pu: 55 },
  { designation: 'Installation électrique par point', unit: 'U', pu: 350 },
];

let _seq = 100;
const uid = () => `L-${++_seq}`;
const blankLine = () => ({ id: uid(), designation: '', unit: 'U', qte: 1, pu: 0, remise: 0, tva: 20 });

function seedLines(seed) {
  if (seed && Array.isArray(seed.lignes) && seed.lignes.length) {
    return seed.lignes.map(l => ({ ...blankLine(), ...l, id: uid() }));
  }
  // 3 lignes d'exemple éditables
  return [
    { ...blankLine(), designation: 'Gros œuvre — structure béton armé', unit: 'm²', qte: 320, pu: 2200, tva: 20 },
    { ...blankLine(), designation: 'Second œuvre (cloisons, enduits, réseaux)', unit: 'm²', qte: 320, pu: 1400, tva: 20 },
    { ...blankLine(), designation: 'Finitions (revêtements, peinture, menuiserie)', unit: 'm²', qte: 320, pu: 1100, tva: 20 },
  ];
}

const lineHT = (l) => l.qte * l.pu * (1 - (l.remise || 0) / 100);

// -----------------------------------------------------------------------------
function DevisEditor({ kind = 'devis', seed, onClose }) {
  const isFacture = kind === 'facture';
  const [meta, setMeta] = React.useState({
    code: seed?.code || (isFacture ? 'FA-26-039' : 'DV-2026-0143'),
    client: seed?.client || '',
    objet: seed?.name || seed?.objet || '',
    date: seed?.date || '28/05/2026',
    echeance: isFacture ? '30 jours' : '',
    validite: isFacture ? '' : '30 jours',
  });
  const [lignes, setLignes] = React.useState(() => seedLines(seed));
  const [bShow, setBShow] = React.useState(false);

  const updMeta = (k, v) => setMeta(m => ({ ...m, [k]: v }));
  const updLine = (id, k, v) => setLignes(ls => ls.map(l => l.id === id ? { ...l, [k]: v } : l));
  const addLine = (preset) => setLignes(ls => [...ls, preset ? { ...blankLine(), ...preset } : blankLine()]);
  const dupLine = (id) => setLignes(ls => {
    const i = ls.findIndex(l => l.id === id);
    if (i < 0) return ls;
    const copy = { ...ls[i], id: uid() };
    return [...ls.slice(0, i + 1), copy, ...ls.slice(i + 1)];
  });
  const delLine = (id) => setLignes(ls => ls.filter(l => l.id !== id));
  const move = (id, dir) => setLignes(ls => {
    const i = ls.findIndex(l => l.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ls.length) return ls;
    const c = ls.slice();
    [c[i], c[j]] = [c[j], c[i]];
    return c;
  });

  // Totaux
  const totalHT = lignes.reduce((s, l) => s + lineHT(l), 0);
  const tvaGroups = {};
  lignes.forEach(l => { const t = l.tva || 0; tvaGroups[t] = (tvaGroups[t] || 0) + lineHT(l) * t / 100; });
  const totalTVA = Object.values(tvaGroups).reduce((s, v) => s + v, 0);
  const totalTTC = totalHT + totalTVA;

  const save = () => {
    if (!meta.client.trim()) { window.toast('Client requis', 'error'); return; }
    if (!lignes.length || totalHT <= 0) { window.toast('Ajoutez au moins une ligne chiffrée', 'error'); return; }
    window.toast(`${isFacture ? 'Facture' : 'Devis'} enregistré`, 'success', `${meta.code} · ${fmtMAD(totalTTC)} DH TTC`);
    onClose && onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,20,0.55)', zIndex: 950, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflow: 'auto', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 1080, background: TOKENS.bg, borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 64px -12px rgba(26,24,20,0.4)' }}>
        {/* Header */}
        <div style={{ padding: '16px 22px', background: TOKENS.paper, borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, position: 'sticky', top: 0, zIndex: 5 }}>
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em' }}>
              {isFacture ? 'NOUVELLE FACTURE' : 'NOUVEAU DEVIS'} · ÉDITEUR DE LIGNES
            </div>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, margin: '4px 0 0' }}>
              {meta.code} {meta.objet ? <span style={{ color: TOKENS.ink3, fontWeight: 500 }}>· {meta.objet}</span> : ''}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={onClose}>Fermer</Button>
            <Button variant="primary" icon={<Icon name="check" size={13} stroke={TOKENS.bg} />} onClick={save}>
              Enregistrer
            </Button>
          </div>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* En-tête document — méta */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <MetaField label="N° pièce" value={meta.code} onChange={v => updMeta('code', v)} mono />
            <MetaField label="Client" value={meta.client} onChange={v => updMeta('client', v)} placeholder="Nom du client" />
            <MetaField label="Date" value={meta.date} onChange={v => updMeta('date', v)} mono />
            <MetaField label={isFacture ? 'Échéance' : 'Validité'} value={isFacture ? meta.echeance : meta.validite}
              onChange={v => updMeta(isFacture ? 'echeance' : 'validite', v)} />
            <div style={{ gridColumn: '1 / -1' }}>
              <MetaField label="Objet / désignation du projet" value={meta.objet} onChange={v => updMeta('objet', v)} placeholder="Ex : Construction villa R+1 — Souissi" />
            </div>
          </div>

          {/* Tableau de lignes */}
          <Card padding={0}>
            {/* En-tête colonnes */}
            <div style={{
              display: 'grid', gridTemplateColumns: '28px 1fr 70px 70px 110px 70px 70px 120px 92px',
              gap: 8, padding: '10px 14px', background: TOKENS.ink, color: TOKENS.bg,
              fontFamily: 'IBM Plex Mono', fontSize: 9, letterSpacing: '0.05em', textTransform: 'uppercase', alignItems: 'center',
            }}>
              <span>#</span>
              <span>Désignation</span>
              <span style={{ textAlign: 'center' }}>Unité</span>
              <span style={{ textAlign: 'right' }}>Qté</span>
              <span style={{ textAlign: 'right' }}>P.U. HT</span>
              <span style={{ textAlign: 'right' }}>Rem.%</span>
              <span style={{ textAlign: 'right' }}>TVA%</span>
              <span style={{ textAlign: 'right' }}>Total HT</span>
              <span style={{ textAlign: 'center' }}>Actions</span>
            </div>

            {lignes.length === 0 && (
              <div style={{ padding: 28, textAlign: 'center', color: TOKENS.ink3, fontSize: 13 }}>
                Aucune ligne. Cliquez « + Ajouter une ligne » ci-dessous.
              </div>
            )}

            {lignes.map((l, i) => (
              <div key={l.id} style={{
                display: 'grid', gridTemplateColumns: '28px 1fr 70px 70px 110px 70px 70px 120px 92px',
                gap: 8, padding: '8px 14px', borderBottom: `1px solid ${TOKENS.line}`, alignItems: 'center',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{i + 1}</span>
                <input value={l.designation} onChange={e => updLine(l.id, 'designation', e.target.value)}
                  placeholder="Désignation du poste…" style={inp()} />
                <select value={l.unit} onChange={e => updLine(l.id, 'unit', e.target.value)} style={{ ...inp(), textAlign: 'center', cursor: 'pointer' }}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input type="number" value={l.qte} min={0} onChange={e => updLine(l.id, 'qte', +e.target.value || 0)} style={{ ...inp(), textAlign: 'right' }} />
                <input type="number" value={l.pu} min={0} onChange={e => updLine(l.id, 'pu', +e.target.value || 0)} style={{ ...inp(), textAlign: 'right' }} />
                <input type="number" value={l.remise} min={0} max={100} onChange={e => updLine(l.id, 'remise', +e.target.value || 0)} style={{ ...inp(), textAlign: 'right' }} />
                <input type="number" value={l.tva} min={0} max={20} onChange={e => updLine(l.id, 'tva', +e.target.value || 0)} style={{ ...inp(), textAlign: 'right' }} />
                <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600, color: TOKENS.ink }}>
                  {fmtMAD(lineHT(l))}
                </span>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <IconBtn name="arrowUp" tip="Monter" onClick={() => move(l.id, -1)} disabled={i === 0} />
                  <IconBtn name="arrowDown" tip="Descendre" onClick={() => move(l.id, 1)} disabled={i === lignes.length - 1} />
                  <IconBtn name="plus" tip="Dupliquer" onClick={() => dupLine(l.id)} />
                  <IconBtn name="x" tip="Supprimer" onClick={() => delLine(l.id)} danger />
                </div>
              </div>
            ))}

            {/* Barre d'ajout */}
            <div style={{ padding: '12px 14px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button size="sm" variant="ocre" icon={<Icon name="plus" size={12} stroke={TOKENS.ink} />} onClick={() => addLine()}>
                Ajouter une ligne
              </Button>
              <div style={{ position: 'relative' }}>
                <Button size="sm" icon={<Icon name="box" size={12} stroke={TOKENS.ink2} />} onClick={() => setBShow(s => !s)}>
                  Depuis la bibliothèque
                </Button>
                {bShow && (
                  <div style={{
                    position: 'absolute', top: 36, left: 0, width: 340, maxHeight: 280, overflow: 'auto', zIndex: 20,
                    background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 8,
                    boxShadow: '0 12px 32px -12px rgba(26,24,20,0.25)', padding: 6,
                  }}>
                    {POSTES_BIBLIO.map((p, k) => (
                      <button key={k} onClick={() => { addLine({ designation: p.designation, unit: p.unit, pu: p.pu, qte: 1 }); setBShow(false); }} style={{
                        width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 5, border: 'none',
                        cursor: 'pointer', background: 'transparent', display: 'flex', justifyContent: 'space-between', gap: 10,
                      }} className="erp-row">
                        <span style={{ fontSize: 12, color: TOKENS.ink }}>{p.designation}</span>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, whiteSpace: 'nowrap' }}>{p.pu} DH/{p.unit}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3, marginLeft: 'auto' }}>
                {lignes.length} ligne{lignes.length > 1 ? 's' : ''}
              </span>
            </div>
          </Card>

          {/* Totaux */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 340, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 10, overflow: 'hidden' }}>
              <TotalRow label="Total HT" value={totalHT} />
              {Object.entries(tvaGroups).sort().map(([t, v]) => (
                <TotalRow key={t} label={`TVA ${t}%`} value={v} sub />
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: TOKENS.ink }}>
                <span style={{ color: TOKENS.bg, fontSize: 13, fontWeight: 500 }}>Total TTC</span>
                <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, color: TOKENS.ocre, letterSpacing: '-0.02em' }}>
                  {fmtMAD(totalTTC)} <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: TOKENS.ink4 }}>DH</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
function MetaField({ label, value, onChange, placeholder, mono }) {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.08em', marginBottom: 5 }}>
        {label.toUpperCase()}
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        width: '100%', height: 36, padding: '0 11px', borderRadius: 6,
        border: `1px solid ${TOKENS.line2}`, background: TOKENS.paper, outline: 'none',
        fontFamily: mono ? 'IBM Plex Mono' : 'IBM Plex Sans', fontSize: 13, color: TOKENS.ink,
      }} />
    </div>
  );
}

function inp() {
  return {
    width: '100%', height: 32, padding: '0 8px', borderRadius: 5,
    border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, outline: 'none',
    fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: TOKENS.ink,
  };
}

function IconBtn({ name, tip, onClick, disabled, danger }) {
  return (
    <button onClick={onClick} disabled={disabled} title={tip} style={{
      width: 22, height: 22, borderRadius: 4, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      background: 'transparent', opacity: disabled ? 0.3 : 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} className={disabled ? '' : 'erp-icon-btn'}>
      <Icon name={name} size={12} stroke={danger ? TOKENS.red : TOKENS.ink3} strokeWidth={2} />
    </button>
  );
}

function TotalRow({ label, value, sub }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: sub ? '6px 18px' : '12px 18px', borderBottom: `1px solid ${TOKENS.line}` }}>
      <span style={{ fontSize: sub ? 11.5 : 13, color: sub ? TOKENS.ink3 : TOKENS.ink2 }}>{label}</span>
      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: sub ? 12 : 13.5, fontWeight: sub ? 400 : 600, color: TOKENS.ink }}>
        {fmtMAD(value)} DH
      </span>
    </div>
  );
}

Object.assign(window, { DevisEditor });
})();
