/* global React, TOKENS, Icon, Button, fmtMAD */
// =============================================================================
// ERP — Moteur de rapports (data-driven)
// Une définition de rapport (objet) → rendu A4 paginé à l'écran + exports réels
// PDF (fenêtre d'impression A4), Excel (.xls HTML), CSV (Blob téléchargé).
//
// Modèle de définition :
//   { code, category, title, period, meta?,
//     blocks: [
//       { type:'kpis', items:[{label,value,unit,sub,highlight}] }
//       { type:'section', num?, title, headers, rows, aligns?, totalRow?, note? }
//       { type:'note', text }
//       { type:'signatures', roles:[...] }
//     ] }
// Exposé : window.RapportEngine = { ReportRenderer, exportReport }
// =============================================================================

(function () {

const SOCIETE = {
  nom: 'Atlas Constructions S.A.',
  adresse: '78, Bd Mohammed V, Casablanca 20000',
  legal: 'ICE 002578946000093 · RC 145789 · IF 24578946 · CNSS 7845612',
};

// ─── Utils ───────────────────────────────────────────────────────────────────
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const csvCell = (s) => {
  const v = String(s == null ? '' : s);
  return /[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
};
function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime + ';charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
}

// ─── Export CSV ──────────────────────────────────────────────────────────────
function exportCSV(def) {
  const lines = [];
  lines.push([def.code, def.title].map(csvCell).join(';'));
  if (def.period) lines.push([csvCell(def.period)].join(';'));
  lines.push('');
  for (const b of def.blocks) {
    if (b.type === 'kpis') {
      lines.push('INDICATEURS');
      b.items.forEach(k => lines.push([k.label, `${k.value}${k.unit ? ' ' + k.unit : ''}`].map(csvCell).join(';')));
      lines.push('');
    } else if (b.type === 'section') {
      lines.push(csvCell((b.num ? b.num + '. ' : '') + b.title));
      if (b.headers) lines.push(b.headers.map(csvCell).join(';'));
      (b.rows || []).forEach(r => lines.push(r.map(csvCell).join(';')));
      if (b.totalRow) lines.push(b.totalRow.map(csvCell).join(';'));
      lines.push('');
    }
  }
  download(`${def.code}_${def.title.replace(/[^a-z0-9]+/gi, '_')}.csv`, '﻿' + lines.join('\r\n'), 'text/csv');
  window.toast('Export CSV téléchargé', 'success', `${def.code} · ${def.title}`);
}

// ─── Export Excel (.xls = HTML reconnu par Excel) ────────────────────────────
function exportExcel(def) {
  let t = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>
    td,th{border:1px solid #ccc;padding:4px 8px;font-family:Calibri,Arial,sans-serif;font-size:11pt;}
    th{background:#1a1814;color:#fff;text-align:left;}
    .tt{font-size:16pt;font-weight:bold;} .sub{color:#777;} .tot{background:#efe9df;font-weight:bold;}
    .num{mso-number-format:"\\#\\,\\#\\#0";text-align:right;}
  </style></head><body>`;
  t += `<table><tr><td class="tt" colspan="6">${esc(SOCIETE.nom)} — ${esc(def.title)}</td></tr>`;
  t += `<tr><td class="sub" colspan="6">${esc(def.code)} · ${esc(def.period || '')}</td></tr></table><br>`;
  for (const b of def.blocks) {
    if (b.type === 'kpis') {
      t += '<table><tr><th>Indicateur</th><th>Valeur</th></tr>';
      b.items.forEach(k => { t += `<tr><td>${esc(k.label)}</td><td>${esc(k.value)} ${esc(k.unit || '')}</td></tr>`; });
      t += '</table><br>';
    } else if (b.type === 'section') {
      t += `<table><tr><td class="tt" colspan="${(b.headers || ['']).length}">${esc((b.num ? b.num + '. ' : '') + b.title)}</td></tr>`;
      if (b.headers) { t += '<tr>' + b.headers.map(h => `<th>${esc(h)}</th>`).join('') + '</tr>'; }
      (b.rows || []).forEach(r => { t += '<tr>' + r.map((c, i) => `<td class="${i === 0 ? '' : 'num'}">${esc(c)}</td>`).join('') + '</tr>'; });
      if (b.totalRow) { t += '<tr class="tot">' + b.totalRow.map((c, i) => `<td class="${i === 0 ? '' : 'num'}">${esc(c)}</td>`).join('') + '</tr>'; }
      t += '</table><br>';
    }
  }
  t += '</body></html>';
  download(`${def.code}_${def.title.replace(/[^a-z0-9]+/gi, '_')}.xls`, t, 'application/vnd.ms-excel');
  window.toast('Export Excel téléchargé', 'success', `${def.code} · ${def.title}`);
}

// ─── Export PDF (fenêtre d'impression A4) ────────────────────────────────────
function exportPDF(def) {
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) { window.toast('Autorisez les pop-ups pour le PDF', 'warn'); return; }
  w.document.write(buildPrintHTML(def));
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 350);
  window.toast('Aperçu PDF ouvert — « Enregistrer au format PDF »', 'info', `${def.code} · ${def.title}`);
}

function buildPrintHTML(def) {
  const head = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>${esc(def.code)} — ${esc(def.title)}</title>
  <style>
    @page { size: A4; margin: 16mm 14mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, 'Helvetica Neue', sans-serif; color: #1a1814; font-size: 11px; margin: 0; }
    .hd { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1a1814; padding-bottom:10px; }
    .brand { font-weight:800; font-size:16px; letter-spacing:-0.5px; }
    .brand b { color:#b5651d; }
    .legal { font-size:9px; color:#46423b; line-height:1.5; margin-top:4px; }
    .badge { background:#f3e9da; color:#8a5a1e; font-size:9px; letter-spacing:1px; padding:3px 8px; border-radius:3px; display:inline-block; }
    h1.title { text-align:center; font-size:18px; margin:18px 0 4px; }
    .period { text-align:center; font-size:10px; color:#8a8378; margin-bottom:14px; }
    .kpis { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; }
    .kpi { flex:1; min-width:120px; border:1px solid #e4ddd1; border-radius:5px; padding:8px 10px; }
    .kpi .l { font-size:8px; letter-spacing:0.6px; color:#8a8378; text-transform:uppercase; }
    .kpi .v { font-size:15px; font-weight:700; margin-top:3px; }
    .kpi.hl { background:#1a1814; color:#fff; } .kpi.hl .l{ color:#d9a441; }
    h2.sec { font-size:13px; margin:18px 0 6px; border-bottom:1px solid #1a1814; padding-bottom:3px; }
    table { width:100%; border-collapse:collapse; margin-top:4px; }
    th { background:#1a1814; color:#fff; font-size:8.5px; letter-spacing:0.4px; text-transform:uppercase; padding:5px 6px; text-align:left; }
    td { padding:4px 6px; font-size:10px; border-bottom:0.5px solid #e4ddd1; }
    td.num, th.num { text-align:right; font-variant-numeric:tabular-nums; }
    tr.tot td { background:#efe9df; font-weight:700; border-top:1px solid #1a1814; }
    .note { font-size:9.5px; color:#46423b; background:#f6f3ee; border-left:3px solid #d9a441; padding:8px 10px; margin-top:10px; line-height:1.5; }
    .sign { display:flex; gap:24px; margin-top:28px; }
    .sign div { flex:1; border-top:1px solid #1a1814; padding-top:4px; font-size:9px; color:#46423b; }
    .ft { margin-top:24px; padding-top:8px; border-top:1px solid #e4ddd1; display:flex; justify-content:space-between; font-size:8px; color:#8a8378; }
    .section { page-break-inside:avoid; }
    tr { page-break-inside:avoid; }
  </style></head><body>`;
  let b = `<div class="hd"><div><div class="brand">ATLAS<b>·</b>BTP</div>
    <div class="legal"><b>${esc(SOCIETE.nom)}</b> · ${esc(SOCIETE.adresse)}<br>${esc(SOCIETE.legal)}</div></div>
    <div style="text-align:right"><span class="badge">${esc(def.code)} · ${esc((def.category || '').toUpperCase())}</span>
    <div style="font-size:9px;color:#8a8378;margin-top:5px">Édité le 28/05/2026 · K. Benjelloun</div></div></div>`;
  b += `<h1 class="title">${esc(def.title)}</h1>`;
  if (def.period) b += `<div class="period">${esc(def.period)}</div>`;
  b += renderBlocksHTML(def.blocks);
  b += `<div class="ft"><span>Confidentiel · ${esc(SOCIETE.nom)}</span><span>Généré par Atlas·BTP ERP · v4.2.1</span></div>`;
  return head + b + '</body></html>';
}

function renderBlocksHTML(blocks) {
  let h = '';
  for (const blk of blocks) {
    if (blk.type === 'kpis') {
      h += '<div class="kpis">';
      blk.items.forEach(k => {
        h += `<div class="kpi ${k.highlight ? 'hl' : ''}"><div class="l">${esc(k.label)}</div><div class="v">${esc(k.value)} <span style="font-size:9px;color:#8a8378">${esc(k.unit || '')}</span></div>${k.sub ? `<div style="font-size:8.5px;color:#8a8378;margin-top:2px">${esc(k.sub)}</div>` : ''}</div>`;
      });
      h += '</div>';
    } else if (blk.type === 'section') {
      h += '<div class="section">';
      h += `<h2 class="sec">${esc((blk.num ? blk.num + '. ' : '') + blk.title)}</h2>`;
      if (blk.headers) {
        h += '<table><thead><tr>' + blk.headers.map((hh, i) => `<th class="${i === 0 ? '' : 'num'}">${esc(hh)}</th>`).join('') + '</tr></thead><tbody>';
        (blk.rows || []).forEach(r => { h += '<tr>' + r.map((c, i) => `<td class="${i === 0 ? '' : 'num'}">${esc(c)}</td>`).join('') + '</tr>'; });
        if (blk.totalRow) h += '<tr class="tot">' + blk.totalRow.map((c, i) => `<td class="${i === 0 ? '' : 'num'}">${esc(c)}</td>`).join('') + '</tr>';
        h += '</tbody></table>';
      }
      if (blk.note) h += `<div class="note">${esc(blk.note)}</div>`;
      h += '</div>';
    } else if (blk.type === 'note') {
      h += `<div class="note">${esc(blk.text)}</div>`;
    } else if (blk.type === 'signatures') {
      h += '<div class="sign">' + blk.roles.map(r => `<div>${esc(r)}</div>`).join('') + '</div>';
    }
  }
  return h;
}

function exportReport(def, fmt) {
  if (fmt === 'csv') exportCSV(def);
  else if (fmt === 'excel') exportExcel(def);
  else exportPDF(def);
}

// ─── Rendu écran A4 paginé ───────────────────────────────────────────────────
function ReportRenderer({ def, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Barre d'actions */}
      <div className="erp-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: 'none', color: TOKENS.ink3, fontSize: 12,
          padding: '4px 8px', marginLeft: -8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13 }}>←</span> Bibliothèque
        </button>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => exportReport(def, 'csv')} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>CSV</Button>
          <Button onClick={() => exportReport(def, 'excel')} icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Excel</Button>
          <Button onClick={() => exportReport(def, 'pdf')} variant="primary" icon={<Icon name="doc" size={13} stroke={TOKENS.bg} />}>
            Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Feuille A4 */}
      <div className="erp-fade-in" style={{
        background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 4,
        padding: '40px 48px', maxWidth: 820, margin: '0 auto', width: '100%',
        boxShadow: '0 12px 40px -16px rgba(26,24,20,0.18)', color: TOKENS.ink,
      }}>
        <ScreenLetterhead def={def} />
        <ScreenBlocks blocks={def.blocks} />
        <div style={{ marginTop: 28, paddingTop: 12, borderTop: `1px solid ${TOKENS.line}`, display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono', fontSize: 8.5, color: TOKENS.ink3 }}>
          <span>Confidentiel · {SOCIETE.nom}</span><span>Généré par Atlas·BTP ERP · v4.2.1</span>
        </div>
      </div>
    </div>
  );
}

function ScreenLetterhead({ def }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${TOKENS.ink}`, paddingBottom: 12 }}>
        <div>
          <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>
            ATLAS<span style={{ color: TOKENS.ocre }}>·</span>BTP
          </span>
          <div style={{ fontSize: 9.5, color: TOKENS.ink2, lineHeight: 1.55, marginTop: 6 }}>
            <b>{SOCIETE.nom}</b> · {SOCIETE.adresse}<br />{SOCIETE.legal}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 4, background: TOKENS.ocreSoft, color: TOKENS.ocreDeep, fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '0.1em' }}>
            {def.code} · {(def.category || '').toUpperCase()}
          </span>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 6 }}>Édité le 28/05/2026 · K. Benjelloun</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '20px 0 14px' }}>
        <h2 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>{def.title}</h2>
        {def.period && <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3, marginTop: 6 }}>{def.period}</div>}
      </div>
    </>
  );
}

function ScreenBlocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.type === 'kpis') {
      return (
        <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0' }}>
          {b.items.map((k, j) => (
            <div key={j} style={{
              flex: 1, minWidth: 130, padding: '10px 12px', borderRadius: 5,
              background: k.highlight ? TOKENS.ink : TOKENS.paper, border: `1px solid ${k.highlight ? TOKENS.ink : TOKENS.line}`,
            }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 8.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: k.highlight ? TOKENS.ocre : TOKENS.ink3 }}>{k.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 3 }}>
                <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 16, color: k.highlight ? TOKENS.bg : TOKENS.ink }}>{k.value}</span>
                {k.unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3 }}>{k.unit}</span>}
              </div>
              {k.sub && <div style={{ fontSize: 8.5, color: k.highlight ? TOKENS.ink4 : TOKENS.ink3, marginTop: 2 }}>{k.sub}</div>}
            </div>
          ))}
        </div>
      );
    }
    if (b.type === 'section') {
      return (
        <div key={i} style={{ marginTop: 18 }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, margin: '0 0 6px', borderBottom: `1px solid ${TOKENS.ink}`, paddingBottom: 3 }}>
            {b.num ? b.num + '. ' : ''}{b.title}
          </h3>
          {b.headers && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, marginTop: 4 }}>
              <thead>
                <tr>
                  {b.headers.map((h, k) => (
                    <th key={k} style={{ padding: '5px 6px', textAlign: k === 0 ? 'left' : 'right', background: TOKENS.ink, color: TOKENS.bg, fontFamily: 'IBM Plex Mono', fontSize: 8.5, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(b.rows || []).map((r, k) => (
                  <tr key={k}>
                    {r.map((c, m) => (
                      <td key={m} style={{ padding: '4px 6px', textAlign: m === 0 ? 'left' : 'right', borderBottom: `0.5px solid ${TOKENS.line}`, fontFamily: m === 0 ? 'IBM Plex Sans' : 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink2 }}>{c}</td>
                    ))}
                  </tr>
                ))}
                {b.totalRow && (
                  <tr>
                    {b.totalRow.map((c, m) => (
                      <td key={m} style={{ padding: '6px', textAlign: m === 0 ? 'left' : 'right', background: TOKENS.bgWarm, borderTop: `1px solid ${TOKENS.ink}`, fontFamily: m === 0 ? 'IBM Plex Sans' : 'IBM Plex Mono', fontSize: 10.5, fontWeight: 700, color: TOKENS.ink }}>{c}</td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {b.note && (
            <div style={{ fontSize: 9.5, color: TOKENS.ink2, background: TOKENS.bg, borderLeft: `3px solid ${TOKENS.ocre}`, padding: '8px 10px', marginTop: 10, lineHeight: 1.5 }}>{b.note}</div>
          )}
        </div>
      );
    }
    if (b.type === 'note') {
      return <div key={i} style={{ fontSize: 9.5, color: TOKENS.ink2, background: TOKENS.bg, borderLeft: `3px solid ${TOKENS.ocre}`, padding: '8px 10px', marginTop: 12, lineHeight: 1.5 }}>{b.text}</div>;
    }
    if (b.type === 'signatures') {
      return (
        <div key={i} style={{ display: 'flex', gap: 24, marginTop: 28 }}>
          {b.roles.map((r, j) => (
            <div key={j} style={{ flex: 1, borderTop: `1px solid ${TOKENS.ink}`, paddingTop: 5, fontSize: 9.5, color: TOKENS.ink2 }}>{r}</div>
          ))}
        </div>
      );
    }
    return null;
  });
}

Object.assign(window, { RapportEngine: { ReportRenderer, exportReport } });
})();
