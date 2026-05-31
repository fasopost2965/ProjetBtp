/* global React, TOKENS, Icon, Pill, Card, Button, fmtMAD */
// =============================================================================
// ERP — GED · Gestion électronique des documents
// Arborescence par chantier · plans, marchés, PV, photos, pièces comptables
// =============================================================================

(function () {
const moisCourt = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
const fmtD = (iso) => { const [y, m, d] = iso.split('-'); return `${parseInt(d)} ${moisCourt[parseInt(m) - 1]} ${y.slice(2)}`; };

const TREE = [
  { id: 'csb', code: 'CSB-114', name: 'Marina Casablanca Lot 3', count: 248, size: '4,2 Go' },
  { id: 'rbt', code: 'RBT-208', name: 'Tramway Rabat-Salé', count: 132, size: '2,1 Go' },
  { id: 'tng', code: 'TNG-061', name: 'Port Tanger Med', count: 186, size: '3,4 Go' },
  { id: 'agd', code: 'AGD-033', name: 'Hôtel Taghazout Bay', count: 94, size: '1,6 Go' },
  { id: 'soc', code: 'SOCIÉTÉ', name: 'Documents société', count: 64, size: '780 Mo' },
];

const FOLDERS = {
  csb: [
    { id: 'plans', name: 'Plans & DAO', count: 86, type: 'folder' },
    { id: 'marche', name: 'Marché & pièces administratives', count: 22, type: 'folder' },
    { id: 'pv', name: 'PV & comptes-rendus', count: 41, type: 'folder' },
    { id: 'photos', name: 'Photos de chantier', count: 78, type: 'folder' },
    { id: 'qse', name: 'QSE & sécurité', count: 21, type: 'folder' },
  ],
};

const FILES = {
  plans: [
    { name: 'PLAN-COFF-B3-niv4-indC.dwg', kind: 'dwg', size: '3,1 Mo', by: 'Hicham Lahlou', date: '2026-05-26', ver: 'C', status: 'valide' },
    { name: 'PLAN-FERR-poteaux-P12-P28.pdf', kind: 'pdf', size: '1,8 Mo', by: 'BET Tazi', date: '2026-05-24', ver: 'B', status: 'valide' },
    { name: 'SYNOPTIQUE-réseaux-VRD.pdf', kind: 'pdf', size: '4,2 Mo', by: 'BET Tazi', date: '2026-05-20', ver: 'A', status: 'attente' },
    { name: 'PLAN-ARCHI-façade-est.dwg', kind: 'dwg', size: '2,6 Mo', by: 'Atelier Mansouri', date: '2026-05-18', ver: 'D', status: 'valide' },
    { name: 'DÉTAIL-acrotère-toiture.pdf', kind: 'pdf', size: '920 Ko', by: 'BET Tazi', date: '2026-05-12', ver: 'A', status: 'obsolete' },
  ],
};

const KIND_META = {
  pdf:    { color: TOKENS.red, label: 'PDF' },
  dwg:    { color: TOKENS.blue, label: 'DWG' },
  xlsx:   { color: TOKENS.green, label: 'XLS' },
  img:    { color: TOKENS.ocre, label: 'IMG' },
  folder: { color: TOKENS.ink3, label: '' },
};
const DOC_STATUS = {
  valide:   { label: 'À jour', tone: 'green' },
  attente:  { label: 'À valider', tone: 'amber' },
  obsolete: { label: 'Périmé', tone: 'neutral' },
};

const RECENTS = [
  { name: 'PV réception support — voile B3', chantier: 'CSB-114', by: 'Rachid Bouhsina', date: '2026-05-28', kind: 'pdf' },
  { name: 'Décompte n°4 signé', chantier: 'CSB-114', by: 'Karim Benjelloun', date: '2026-05-27', kind: 'pdf' },
  { name: 'Photos coulage radier zone C', chantier: 'TNG-061', by: 'Said Bakkali', date: '2026-05-27', kind: 'img' },
  { name: 'Avenant n°2 — délai', chantier: 'RBT-208', by: 'Direction', date: '2026-05-26', kind: 'pdf' },
];

const VERSION_HISTORY = {
  'PLAN-COFF-B3-niv4-indC.dwg': [
    { ver: 'C', date: '2026-05-26', by: 'Hicham Lahlou', note: 'Modification aciers poteaux P12-P28', size: '3,1 Mo' },
    { ver: 'B', date: '2026-05-10', by: 'BET Tazi',      note: 'Correction alignement axes',           size: '2,9 Mo' },
    { ver: 'A', date: '2026-04-22', by: 'BET Tazi',      note: 'Version initiale',                     size: '2,8 Mo' },
  ],
  'PLAN-FERR-poteaux-P12-P28.pdf': [
    { ver: 'B', date: '2026-05-24', by: 'BET Tazi', note: 'Ajout ferraillage escaliers', size: '1,8 Mo' },
    { ver: 'A', date: '2026-05-05', by: 'BET Tazi', note: 'Version initiale',            size: '1,6 Mo' },
  ],
};

function UploadModal({ onClose }) {
  const { Modal, FieldGroup, TextInput, Select } = window;
  const [form, setForm] = React.useState({
    chantier: 'CSB-114', categorie: 'plans', indice: 'A', commentaire: '',
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [file, setFile] = React.useState(null);

  return (
    <Modal open onClose={onClose}
      title="Téléverser un document"
      subtitle="Le fichier sera versionné automatiquement si une version précédente existe."
      width={560}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary"
          onClick={() => { onClose(); window.toast('Document déposé', 'success', file?.name || 'fichier · ind. ' + form.indice); }}
          icon={<Icon name="arrowUp" size={13} stroke={TOKENS.bg} />}>
          Téléverser
        </Button>
      </>}
    >
      <div style={{ border: `2px dashed ${TOKENS.line2}`, borderRadius: 8, padding: 28, textAlign: 'center', cursor: 'pointer', marginBottom: 4,
        background: file ? TOKENS.greenSoft : TOKENS.bg, transition: 'background 150ms ease' }}
        onClick={() => document.getElementById('ged-file-input')?.click()}>
        <input id="ged-file-input" type="file" style={{ display: 'none' }}
          onChange={e => setFile(e.target.files?.[0] || null)} />
        {file ? (
          <>
            <Icon name="doc" size={28} stroke={TOKENS.green} />
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: TOKENS.green, marginTop: 10, fontWeight: 600 }}>{file.name}</div>
            <div style={{ fontSize: 11, color: TOKENS.ink3, marginTop: 4 }}>{(file.size / 1024).toFixed(0)} Ko — cliquer pour changer</div>
          </>
        ) : (
          <>
            <Icon name="arrowUp" size={28} stroke={TOKENS.ink3} />
            <div style={{ fontSize: 13, color: TOKENS.ink3, marginTop: 10 }}>Glisser-déposer ou cliquer pour sélectionner</div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink4, marginTop: 4 }}>PDF · DWG · DXF · XLS · JPG · PNG</div>
          </>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
        <FieldGroup label="Chantier">
          <Select value={form.chantier} onChange={(v) => upd('chantier', v)} options={['CSB-114','RBT-208','TNG-061','AGD-033','SOCIÉTÉ']} />
        </FieldGroup>
        <FieldGroup label="Catégorie">
          <Select value={form.categorie} onChange={(v) => upd('categorie', v)} options={[
            ['plans','Plans & DAO'],['marche','Marché & admin.'],['pv','PV & CR'],['photos','Photos'],['qse','QSE & sécurité'],
          ]} />
        </FieldGroup>
        <FieldGroup label="Indice / Version">
          <TextInput value={form.indice} onChange={(v) => upd('indice', v)} placeholder="A" mono />
        </FieldGroup>
        <FieldGroup label="Commentaire de version">
          <TextInput value={form.commentaire} onChange={(v) => upd('commentaire', v)} placeholder="Modification…" />
        </FieldGroup>
      </div>
    </Modal>
  );
}

function VersionDrawer({ file, onClose }) {
  const { Drawer } = window;
  const history = VERSION_HISTORY[file.name] || [{ ver: file.ver, date: file.date, by: file.by, note: 'Version actuelle', size: file.size }];
  const km = KIND_META[file.kind];
  return (
    <Drawer open onClose={onClose} title="Historique des versions" subtitle={file.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {history.map((v, i) => (
          <div key={v.ver} style={{ padding: '14px 0', borderBottom: i < history.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
            display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 5, flexShrink: 0, background: i === 0 ? km.color + '20' : TOKENS.bgWarm,
              color: i === 0 ? km.color : TOKENS.ink3,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 700 }}>
              {v.ver}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink, fontWeight: 600 }}>Indice {v.ver}</span>
                {i === 0 && <Pill tone="green" dot>Actuel</Pill>}
              </div>
              <div style={{ fontSize: 12, color: TOKENS.ink2, marginBottom: 4 }}>{v.note}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>
                {fmtD(v.date)} · {v.by} · {v.size}
              </div>
            </div>
            <Button size="sm" icon={<Icon name="arrowDown" size={11} stroke={TOKENS.ink2} />}
              onClick={() => window.toast(`Téléchargement ind. ${v.ver}`, 'info', file.name)}>
              DL
            </Button>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// -----------------------------------------------------------------------------
function Ged() {
  const [view, setView] = React.useState('docs'); // 'docs' | 'hse'
  const [site, setSite] = React.useState('csb');
  const [folder, setFolder] = React.useState('plans');
  const [q, setQ] = React.useState('');
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [versionFile, setVersionFile] = React.useState(null);

  if (view === 'hse' && window.GedHseAudit) {
    return <window.GedHseAudit onBack={() => setView('docs')} />;
  }

  const totalDocs = TREE.reduce((s, t) => s + t.count, 0);
  const folders = FOLDERS[site] || FOLDERS.csb;
  const allFiles = FILES[folder] || FILES.plans;
  const files = q ? allFiles.filter(f => (f.name + f.by).toLowerCase().includes(q.toLowerCase())) : allFiles;
  const currentSite = TREE.find(t => t.id === site) || TREE[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em', marginBottom: 10 }}>
            GED · GESTION DOCUMENTAIRE
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em', color: TOKENS.ink, lineHeight: 1.2 }}>
            Documents &amp; plans
          </h1>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink3, marginTop: 6 }}>
            {totalDocs} documents · 12,1 Go · classés par chantier
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button onClick={() => setView('hse')}
            icon={<Icon name="shield" size={13} stroke={TOKENS.ink2} />}>
            Audit HSE
          </Button>
          <Button variant="primary" onClick={() => setUploadOpen(true)} icon={<Icon name="arrowUp" size={13} stroke={TOKENS.bg} />}>Téléverser</Button>
        </div>
      </div>

      {/* KPI strip — refonte UX : 3 indicateurs (toggle redondant retiré, accès HSE via l'en-tête) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <GedKpi label="DOCUMENTS" value={totalDocs} unit="fichiers" sub={`tous chantiers · 12,1 Go / 50 Go`} delay={60} tone="ink" />
        <GedKpi label="À VALIDER" value="9" unit="documents" sub="plans en attente de visa" delay={120} tone="amber" />
        <GedKpi label="AJOUTÉS CETTE SEMAINE" value="34" unit="fichiers" sub="dont 12 photos terrain" delay={180} tone="green" />
      </div>

      {/* Browser */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 16 }}>
        {/* Tree sidebar */}
        <Card padding={0} delay={300} style={{ alignSelf: 'flex-start' }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${TOKENS.line}`, fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.1em' }}>
            CHANTIERS
          </div>
          <div style={{ padding: 6 }}>
            {TREE.map(t => {
              const active = site === t.id;
              return (
                <button key={t.id} className="erp-nav-item" onClick={() => { setSite(t.id); setFolder('plans'); }} style={{
                  width: '100%', padding: '9px 10px', borderRadius: 5, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: active ? TOKENS.bgWarm : 'transparent', marginBottom: 2,
                  display: 'flex', alignItems: 'center', gap: 9,
                }}>
                  <Icon name="folder" size={15} stroke={active ? TOKENS.ocreDeep : TOKENS.ink3} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, marginTop: 2 }}>{t.code} · {t.count}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Files */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Breadcrumb + folder chips */}
          <Card padding={0} delay={340}>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Sans', fontSize: 12.5 }}>
              <Icon name="folder" size={14} stroke={TOKENS.ocreDeep} />
              <span style={{ color: TOKENS.ink3 }}>{currentSite.code}</span>
              <span style={{ color: TOKENS.ink4 }}>/</span>
              <span style={{ color: TOKENS.ink, fontWeight: 600 }}>{(folders.find(f => f.id === folder) || folders[0]).name}</span>
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{currentSite.size}</span>
            </div>
            <div style={{ padding: '12px 18px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {folders.map(f => {
                const active = folder === f.id;
                return (
                  <button key={f.id} onClick={() => setFolder(f.id)} style={{
                    padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
                    background: active ? TOKENS.ink : TOKENS.bgWarm,
                    color: active ? TOKENS.bg : TOKENS.ink2, border: 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
                  }}>
                    <Icon name="folder" size={13} stroke={active ? TOKENS.ocre : TOKENS.ink3} />
                    {f.name}
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: active ? TOKENS.ink4 : TOKENS.ink3 }}>{f.count}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* File list */}
          <Card padding={0} delay={380}>
            <div style={{ padding: '10px 18px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="erp-search" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 34,
                background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 5 }}>
                <Icon name="search" size={13} stroke={TOKENS.ink3} />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un fichier…"
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5 }} />
                {q && <button onClick={() => setQ('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: TOKENS.ink3, padding: 0, lineHeight: 1 }}>
                  <Icon name="x" size={12} />
                </button>}
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3 }}>{files.length} fichier{files.length > 1 ? 's' : ''}</span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 90px 130px 80px 110px 80px',
              padding: '10px 18px', background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}`,
              fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ink3, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              <span>Fichier</span><span>Indice</span><span>Modifié par</span><span style={{ textAlign: 'right' }}>Taille</span><span style={{ textAlign: 'right' }}>Statut</span><span></span>
            </div>
            {files.length === 0 ? (
              <div style={{ padding: '32px 18px', textAlign: 'center', color: TOKENS.ink3, fontSize: 13 }}>Aucun fichier pour «&nbsp;{q}&nbsp;»</div>
            ) : files.map((f, i) => {
              const km = KIND_META[f.kind];
              const st = DOC_STATUS[f.status];
              return (
                <div key={f.name} className="erp-row" style={{
                  display: 'grid', gridTemplateColumns: '1fr 90px 130px 80px 110px 80px',
                  padding: '12px 18px', borderBottom: i < files.length - 1 ? `1px solid ${TOKENS.line}` : 'none', alignItems: 'center',
                  opacity: f.status === 'obsolete' ? 0.6 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 5, flexShrink: 0,
                      background: km.color + '18', color: km.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'IBM Plex Mono', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.04em',
                    }}>{km.label}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>{fmtD(f.date)}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11.5, color: TOKENS.ink2 }}>ind. {f.ver}</span>
                  <span style={{ fontSize: 11.5, color: TOKENS.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.by}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>{f.size}</span>
                  <span style={{ textAlign: 'right' }}><Pill tone={st.tone} dot={f.status !== 'obsolete'}>{st.label}</Pill></span>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button className="erp-icon-btn" onClick={() => window.toast('Téléchargement', 'info', f.name)}
                      style={{ width: 28, height: 28, borderRadius: 4, border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="arrowDown" size={13} stroke={TOKENS.ink3} />
                    </button>
                    <button className="erp-icon-btn" onClick={() => setVersionFile(f)}
                      style={{ width: 28, height: 28, borderRadius: 4, border: 'none', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="refresh" size={13} stroke={TOKENS.ink3} />
                    </button>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Récents */}
      <Card padding={0} delay={440}>
        <div style={{ padding: '13px 20px', borderBottom: `1px solid ${TOKENS.line}` }}>
          <h3 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, margin: 0 }}>Activité récente</h3>
        </div>
        {RECENTS.map((r, i) => {
          const km = KIND_META[r.kind];
          return (
            <div key={i} className="erp-row" style={{
              padding: '12px 20px', borderBottom: i < RECENTS.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ width: 30, height: 30, borderRadius: 5, flexShrink: 0, background: km.color + '18', color: km.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Mono', fontSize: 8.5, fontWeight: 600 }}>{km.label}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: TOKENS.ink, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ink3, marginTop: 2 }}>{r.by} · {fmtD(r.date)}</div>
              </div>
              <Pill tone="neutral" mono>{r.chantier}</Pill>
            </div>
          );
        })}
      </Card>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
      {versionFile && <VersionDrawer file={versionFile} onClose={() => setVersionFile(null)} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
function GedKpi({ label, value, unit, sub, tone, delay }) {
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

Object.assign(window, { Ged });
})();
