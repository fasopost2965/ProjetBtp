/* global React, TOKENS, Icon, Pill, Modal, FieldGroup, TextInput, TextArea, Select, Radio, Button, fmtMAD */
// =============================================================================
// ERP — "Nouveau …" modals propagés à Chantier, Devis, Facture, Situation
// Chacun écoute window 'erp:new' via une clé (newSite, newQuote, newInvoice, newSit)
// =============================================================================

// -----------------------------------------------------------------------------
// 1. NOUVEAU CHANTIER
// -----------------------------------------------------------------------------
function NewChantierModal({ onClose }) {
  const [form, setForm] = React.useState({
    code: 'CSB-' + Math.floor(200 + Math.random() * 200),
    name: '', client: '', type: 'Bâtiment', region: 'Casa-Settat',
    city: '', conducteur: 'K. Benjelloun', montant: '',
    debut: '', fin: '', marche: '',
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name.trim() || !form.client.trim()) {
      window.toast('Nom et client requis', 'error'); return;
    }
    onClose();
    window.toast('Chantier ouvert', 'success', `${form.code} · ${form.name}`);
  };

  return (
    <Modal open onClose={onClose}
      title="Nouveau chantier"
      subtitle="Ouvrir un projet — sera adressable depuis devis, situations, achats, pointage."
      width={720}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={() => window.toast('Brouillon sauvé', 'info')}>Enregistrer brouillon</Button>
        <Button variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
          Ouvrir le chantier
        </Button>
      </>}
    >
      <FieldGroup label="Type de chantier" required>
        <Radio value={form.type} onChange={(v) => upd('type', v)} options={[
          ['Bâtiment',    'Bâtiment',    'Logement · tertiaire'],
          ['TP / VRD',    'TP / VRD',    'Voirie · réseaux'],
          ['Génie civil', 'Génie civil', 'Pont · ouvrage'],
          ['Industriel',  'Industriel',  'Usine · hangar'],
        ]} />
      </FieldGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14 }}>
        <FieldGroup label="Code chantier"><TextInput value={form.code} onChange={(v) => upd('code', v)} mono /></FieldGroup>
        <FieldGroup label="Intitulé du projet" required>
          <TextInput value={form.name} onChange={(v) => upd('name', v)} placeholder="Marina Casa Lot 3 — résidentiel" />
        </FieldGroup>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FieldGroup label="Maître d'ouvrage" required>
          <TextInput value={form.client} onChange={(v) => upd('client', v)} placeholder="Al Omrane Régional" />
        </FieldGroup>
        <FieldGroup label="N° de marché" hint="laisser vide si gré à gré">
          <TextInput value={form.marche} onChange={(v) => upd('marche', v)} mono placeholder="AO-2026/14/AOMR" />
        </FieldGroup>
        <FieldGroup label="Région">
          <Select value={form.region} onChange={(v) => upd('region', v)} options={[
            'Casa-Settat','Rabat-Salé-Kénitra','Tanger-Tétouan','Fès-Meknès',
            'Souss-Massa','Oriental','Dakhla-Oued Eddahab',
          ]} />
        </FieldGroup>
        <FieldGroup label="Ville">
          <TextInput value={form.city} onChange={(v) => upd('city', v)} placeholder="Casablanca" />
        </FieldGroup>
        <FieldGroup label="Conducteur de travaux">
          <Select value={form.conducteur} onChange={(v) => upd('conducteur', v)} options={[
            'K. Benjelloun','H. Alaoui','M. El Mansouri','S. Fassi','Y. Tazi',
          ]} />
        </FieldGroup>
        <FieldGroup label="Montant marché HT (DH)" required>
          <TextInput value={form.montant} onChange={(v) => upd('montant', v)} mono placeholder="84 500 000" />
        </FieldGroup>
        <FieldGroup label="Date OS / démarrage">
          <TextInput value={form.debut} onChange={(v) => upd('debut', v)} mono placeholder="01/2026" />
        </FieldGroup>
        <FieldGroup label="Délai d'exécution / livraison">
          <TextInput value={form.fin} onChange={(v) => upd('fin', v)} mono placeholder="06/2028" />
        </FieldGroup>
      </div>

      <FieldGroup label="Notes initiales">
        <TextArea rows={2} placeholder="Conditions particulières, observations OS, équipe prévue…" />
      </FieldGroup>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// 2. NOUVEAU DEVIS (Études)
// -----------------------------------------------------------------------------
function ClientChips({ clients, selected, onPick }) {
  if (!clients.length) return null;
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
      {clients.slice(0, 6).map(c => (
        <button key={c.name} onClick={() => onPick(c.name)} style={{
          padding: '3px 10px', border: `1px solid ${selected === c.name ? TOKENS.ocreDeep : TOKENS.line2}`,
          borderRadius: 999, background: selected === c.name ? TOKENS.ocreSoft : 'transparent',
          fontFamily: 'IBM Plex Mono', fontSize: 9.5,
          color: selected === c.name ? TOKENS.ocreDeep : TOKENS.ink3,
          cursor: 'pointer', transition: 'all 120ms ease',
        }}>{c.name}</button>
      ))}
    </div>
  );
}

function NewDevisModal({ onClose }) {
  const store = window.useStore ? window.useStore() : null;
  const storeClients = store?.data?.clients || [];
  const [form, setForm] = React.useState({
    method: 'simulator', client: '', name: '',
    type: 'villa-r1', surface: 280, finit: 'std',
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name.trim() || !form.client.trim()) {
      window.toast('Intitulé et client requis', 'error'); return;
    }
    onClose();
    // Naviguer vers Études puis ouvrir le bon outil selon la méthode choisie
    if (window.location.hash !== '#etudes') window.location.hash = 'etudes';
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('erp:openDevis', { detail: { method: form.method, form } }));
    }, 60);
    if (form.method === 'simulator') {
      window.toast('Ouverture du simulateur', 'success', form.name);
    } else if (form.method === 'bpu') {
      window.toast('Ouverture de l\'éditeur BPU', 'success', form.name);
    } else {
      window.toast('Devis créé depuis modèle', 'success', form.name);
    }
  };

  return (
    <Modal open onClose={onClose}
      title="Nouveau devis"
      subtitle="Choisissez la méthode de chiffrage — modifiable plus tard."
      width={680}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
          Créer le devis
        </Button>
      </>}
    >
      <FieldGroup label="Méthode de chiffrage" required>
        <Radio value={form.method} onChange={(v) => upd('method', v)} options={[
          ['simulator', 'Simulateur',  '5 questions · 2 min'],
          ['bpu',       'BPU détaillé', 'Ligne par ligne'],
          ['model',     'Depuis modèle', 'Devis existant · Excel'],
        ]} />
      </FieldGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FieldGroup label="Client / Prospect" required>
          <TextInput value={form.client} onChange={(v) => upd('client', v)} placeholder="SCI Atlas Habitat" />
          <ClientChips clients={storeClients} selected={form.client} onPick={(n) => upd('client', n)} />
        </FieldGroup>
        <FieldGroup label="Intitulé du projet" required>
          <TextInput value={form.name} onChange={(v) => upd('name', v)} placeholder="Villa R+1 — M. Lahlou" />
        </FieldGroup>
      </div>

      {form.method === 'simulator' && (
        <div style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 8, padding: 16, marginTop: 4 }}>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 12 }}>
            PRÉ-REMPLISSAGE — AFFINABLE EN DIRECT
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FieldGroup label="Type">
              <Select value={form.type} onChange={(v) => upd('type', v)} options={[
                ['villa-r1', 'Villa R+1'],['villa-r2','Villa R+2'],
                ['imm-r4','Immeuble R+4'],['imm-r8','Immeuble R+8'],
                ['hangar','Hangar / Indus.'],['ecole','Équipement public'],
              ]} />
            </FieldGroup>
            <FieldGroup label="Surface (m²)">
              <TextInput value={String(form.surface)} onChange={(v) => upd('surface', Number(v) || 0)} mono />
            </FieldGroup>
            <FieldGroup label="Finition">
              <Select value={form.finit} onChange={(v) => upd('finit', v)} options={[
                ['eco','Économique'],['std','Standard'],['hdg','Haut de gamme'],
              ]} />
            </FieldGroup>
          </div>
        </div>
      )}

      {form.method === 'model' && (
        <FieldGroup label="Modèle source" hint="Vous pourrez aussi téléverser un fichier Excel après création.">
          <Select value="" onChange={() => {}} options={[
            ['DV-2026-0141','DV-2026-0141 — Immeuble R+4 Bouskoura · 18,9 M DH'],
            ['DV-2026-0139','DV-2026-0139 — Réhab. école · 4,65 M DH'],
            ['DV-2026-0138','DV-2026-0138 — Hangar logistique · 9,2 M DH'],
            ['lib-villa',  'Bibliothèque · Villa R+1 standard'],
            ['lib-imm',    'Bibliothèque · Immeuble R+4 standard'],
          ]} />
        </FieldGroup>
      )}
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// 3. NOUVELLE FACTURE
// -----------------------------------------------------------------------------
function NewFactureModal({ onClose }) {
  const store = window.useStore ? window.useStore() : null;
  const storeClients = store?.data?.clients || [];
  const [form, setForm] = React.useState({
    source: 'libre', client: '', chantier: '',
    montantHT: '', mode: 'virement', echeanceJ: 30,
    objet: '', sit: '',
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const ht = Number(form.montantHT) || 0;
  const tva = ht * 0.2;
  const ttc = ht + tva;

  const submit = () => {
    if (!ht) { window.toast('Montant requis', 'error'); return; }
    if (!form.client.trim() && form.source === 'libre') { window.toast('Client requis', 'error'); return; }
    onClose();
    window.toast('Facture émise', 'success', `FA-26-039 · ${fmtMAD(ttc)} DH TTC`);
  };

  return (
    <Modal open onClose={onClose}
      title="Nouvelle facture client"
      subtitle="Émettre — TVA 20% appliquée par défaut, modifiable."
      width={700}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={() => window.toast('Brouillon sauvé', 'info')}>Brouillon</Button>
        <Button onClick={() => window.toast('Aperçu A4 ouvert', 'info', `Facture ${fmtMAD(ttc)} DH TTC`)}
          icon={<Icon name="doc" size={13} stroke={TOKENS.ink2} />}>Aperçu</Button>
        <Button variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
          Émettre la facture
        </Button>
      </>}
    >
      <FieldGroup label="Source de la facture" required>
        <Radio value={form.source} onChange={(v) => upd('source', v)} options={[
          ['libre',    'Saisie libre',  'Montant + objet'],
          ['devis',    'Depuis devis',  'Convertir un devis accepté'],
          ['situation','Depuis situation', 'Net à facturer d\'un attachement'],
        ]} />
      </FieldGroup>

      {form.source === 'devis' && (
        <FieldGroup label="Devis à facturer" required>
          <Select value="" onChange={() => {}} options={[
            ['DV-26-012','DV-26-012 — Café Chichaoua · 84 500 DH HT'],
            ['DV-2026-0139','DV-2026-0139 — Réhab. école · 4 650 000 DH HT'],
            ['DV-2026-0138','DV-2026-0138 — Hangar logistique · 9 200 000 DH HT'],
          ]} />
        </FieldGroup>
      )}

      {form.source === 'situation' && (
        <FieldGroup label="Situation source" required>
          <Select value={form.sit} onChange={(v) => upd('sit', v)} options={[
            ['SIT-04/26','SIT-04/26 — Marina Casa · Avril · 5,64 M DH net'],
            ['SIT-03/26','SIT-03/26 — Tramway Rabat · Mars · 8,05 M DH net'],
            ['SIT-08/26','SIT-08/26 — Port Tanger Med · Mai · 2,82 M DH net'],
          ]} />
        </FieldGroup>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FieldGroup label="Client" required>
          <TextInput value={form.client} onChange={(v) => upd('client', v)} placeholder="Résidence El Manar" />
          <ClientChips clients={storeClients} selected={form.client} onPick={(n) => upd('client', n)} />
        </FieldGroup>
        <FieldGroup label="Chantier rattaché">
          <TextInput value={form.chantier} onChange={(v) => upd('chantier', v)} placeholder="Réhab. immeuble Bd Zerktouni" />
        </FieldGroup>
      </div>

      <FieldGroup label="Objet de la facture" required>
        <TextArea value={form.objet} onChange={(v) => upd('objet', v)} rows={2}
          placeholder="Travaux de réhabilitation — Tranche 1 — selon devis DV-26-014" />
      </FieldGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <FieldGroup label="Montant HT (DH)" required>
          <TextInput value={form.montantHT} onChange={(v) => upd('montantHT', v)} mono type="number" placeholder="142 000" />
        </FieldGroup>
        <FieldGroup label="Échéance (jours)">
          <Select value={String(form.echeanceJ)} onChange={(v) => upd('echeanceJ', Number(v))}
            options={[['0','Comptant'],['15','15 jours'],['30','30 jours'],['45','45 jours'],['60','60 jours']]} />
        </FieldGroup>
        <FieldGroup label="Mode de règlement">
          <Select value={form.mode} onChange={(v) => upd('mode', v)}
            options={[['virement','Virement'],['cheque','Chèque'],['effet','Effet de commerce']]} />
        </FieldGroup>
      </div>

      {/* Récap */}
      <div style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 8, padding: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            ['Montant HT', fmtMAD(ht) + ' DH'],
            ['TVA 20%',    fmtMAD(tva) + ' DH'],
            ['Total TTC',  fmtMAD(ttc) + ' DH'],
          ].map(([k, v], i) => (
            <div key={k} style={{ borderLeft: i === 2 ? `3px solid ${TOKENS.ocre}` : 'none', paddingLeft: i === 2 ? 10 : 0 }}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.1em' }}>{k.toUpperCase()}</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 15, color: i === 2 ? TOKENS.ocreDeep : TOKENS.ink, fontWeight: i === 2 ? 700 : 500, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// 4. NOUVELLE SITUATION
// -----------------------------------------------------------------------------
function NewSituationModal({ onClose }) {
  const [form, setForm] = React.useState({
    chantier: 'CSB-114', periode: '05/2026', kind: 'mensuelle',
    inclureRev: true, retGarantie: 7, retSource: 1.5,
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    onClose();
    window.toast('Situation créée', 'success', `SIT-06/26 · ${form.chantier} · prête à saisir`);
  };

  return (
    <Modal open onClose={onClose}
      title="Nouvelle situation mensuelle"
      subtitle="Initialiser un attachement — quantités à saisir ensuite poste par poste."
      width={680}
      footer={<>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="primary" onClick={submit} icon={<Icon name="check" size={13} stroke={TOKENS.bg} />}>
          Créer & ouvrir l'éditeur
        </Button>
      </>}
    >
      <FieldGroup label="Type de situation" required>
        <Radio value={form.kind} onChange={(v) => upd('kind', v)} options={[
          ['mensuelle', 'Mensuelle',      'Décompte de travaux exécutés'],
          ['avenant',   'Avenant',        'Travaux supplémentaires'],
          ['dgd',       'Décompte général','Clôture de marché'],
        ]} />
      </FieldGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <FieldGroup label="Chantier" required>
          <Select value={form.chantier} onChange={(v) => upd('chantier', v)} options={[
            ['CSB-114','CSB-114 — Marina Casa L3'],
            ['RBT-208','RBT-208 — Tramway Rabat-Salé'],
            ['TNG-061','TNG-061 — Port Tanger Med'],
            ['AGD-033','AGD-033 — Taghazout Bay'],
            ['MEK-019','MEK-019 — Échangeur A2'],
            ['CSB-098','CSB-098 — CC Sidi Maârouf'],
          ]} />
        </FieldGroup>
        <FieldGroup label="Période" hint="Format MM/AAAA">
          <TextInput value={form.periode} onChange={(v) => upd('periode', v)} mono placeholder="06/2026" />
        </FieldGroup>
      </div>

      {/* Récap marché */}
      <div style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 10 }}>
          MARCHÉ DE RÉFÉRENCE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            ['N° marché', 'AO-2024/14/AOMR'],
            ['Montant marché', '84,5 M DH HT'],
            ['Situation précédente', 'SIT-04/26 · 6,24 M'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: TOKENS.ink3, letterSpacing: '0.08em' }}>{k.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: TOKENS.ink, marginTop: 4, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <FieldGroup label="Paramètres de retenue (CCAG marchés publics)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: TOKENS.ink2, marginBottom: 6 }}>Retenue garantie</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" value={form.retGarantie} onChange={(e) => upd('retGarantie', Number(e.target.value))}
                style={{ width: 64, height: 32, padding: '0 8px', textAlign: 'right',
                  border: `1px solid ${TOKENS.line2}`, borderRadius: 5,
                  fontFamily: 'IBM Plex Mono', fontSize: 13 }} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TOKENS.ink2, marginBottom: 6 }}>Retenue à la source</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="number" value={form.retSource} step="0.5" onChange={(e) => upd('retSource', Number(e.target.value))}
                style={{ width: 64, height: 32, padding: '0 8px', textAlign: 'right',
                  border: `1px solid ${TOKENS.line2}`, borderRadius: 5,
                  fontFamily: 'IBM Plex Mono', fontSize: 13 }} />
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ink3 }}>%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TOKENS.ink2, marginBottom: 6 }}>Révision prix</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: TOKENS.ink, cursor: 'pointer', height: 32 }}>
              <input type="checkbox" checked={form.inclureRev} onChange={(e) => upd('inclureRev', e.target.checked)} />
              Appliquer (2,5%)
            </label>
          </div>
        </div>
      </FieldGroup>

      <div style={{ padding: 12, background: TOKENS.ocreSoft, borderRadius: 6, fontSize: 11.5, color: TOKENS.ocreDeep, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <Icon name="warning" size={13} stroke={TOKENS.ocreDeep} strokeWidth={2} />
        <span>L'éditeur s'ouvrira avec le BPU du chantier pré-chargé. Les cumuls précédents sont repris automatiquement.</span>
      </div>
    </Modal>
  );
}

Object.assign(window, { NewChantierModal, NewDevisModal, NewFactureModal, NewSituationModal });
