/* global React */
// =============================================================================
// ERP — Global Store (Context)
// Données centralisées : chantiers, devis, factures, situations, clients, bcs
// Exposé via window.StoreProvider, window.useStore, window.StoreContext
// =============================================================================

(function () {

  const StoreContext = React.createContext(null);

  // ---------------------------------------------------------------------------
  // Données initiales (seedées depuis les modules existants)
  // ---------------------------------------------------------------------------

  const INIT_CHANTIERS = [
    { code: 'CSB-114', name: 'Marina Casablanca — Lot 3 résidentiel', client: 'Al Omrane Régional', city: 'Casablanca', region: 'Casa-Settat', type: 'Bâtiment', conducteur: 'K. Benjelloun', physique: 47, budget: 52, marge: 12.0, montant: 84_500_000, debut: '01/2025', fin: '03/2027', status: 'En cours', tone: 'green', alert: 0 },
    { code: 'RBT-208', name: 'Tramway Rabat-Salé — Extension ligne 2', client: 'STRS', city: 'Rabat', region: 'Rabat-Salé-Kénitra', type: 'TP / VRD', conducteur: 'H. Alaoui', physique: 12, budget: 18, marge: 13.1, montant: 142_000_000, debut: '11/2025', fin: '06/2028', status: 'Démarrage', tone: 'blue', alert: 1 },
    { code: 'TNG-061', name: 'Port Tanger Med — Digue secondaire', client: 'TMSA', city: 'Tanger', region: 'Tanger-Tétouan', type: 'Génie civil', conducteur: 'M. El Mansouri', physique: 89, budget: 84, marge: 17.0, montant: 67_300_000, debut: '03/2024', fin: '07/2026', status: 'En cours', tone: 'green', alert: 0 },
    { code: 'AGD-033', name: 'Hôtel Taghazout Bay — Gros œuvre', client: 'SAPST', city: 'Agadir', region: 'Souss-Massa', type: 'Bâtiment', conducteur: 'S. Fassi', physique: 64, budget: 71, marge: 8.0, montant: 38_900_000, debut: '06/2024', fin: '11/2026', status: 'En retard', tone: 'amber', alert: 2 },
    { code: 'MEK-019', name: 'Échangeur autoroute A2 — PK 142', client: 'ADM', city: 'Meknès', region: 'Fès-Meknès', type: 'TP / VRD', conducteur: 'Y. Tazi', physique: 31, budget: 29, marge: 14.0, montant: 56_700_000, debut: '04/2025', fin: '01/2027', status: 'En cours', tone: 'green', alert: 0 },
    { code: 'CSB-098', name: 'Centre commercial Sidi Maârouf', client: 'Aksal Group', city: 'Casablanca', region: 'Casa-Settat', type: 'Bâtiment', conducteur: 'K. Benjelloun', physique: 95, budget: 92, marge: 17.0, montant: 124_200_000, debut: '02/2023', fin: '06/2026', status: 'Réception', tone: 'ocre', alert: 0 },
    { code: 'OUJ-007', name: "Station d'épuration Oujda Nord", client: 'ONEE Branche Eau', city: 'Oujda', region: 'Oriental', type: 'Génie civil', conducteur: 'Y. Tazi', physique: 4, budget: 6, marge: 13.5, montant: 31_500_000, debut: '03/2026', fin: '08/2027', status: 'Démarrage', tone: 'blue', alert: 0 },
  ];

  const INIT_DEVIS = [
    { code: 'DV-2026-0142', name: 'Villa R+1 — M. Lahlou', client: 'Particulier · M. Lahlou', surface: 320, total: 2_780_000, status: 'Brouillon', tone: 'neutral', date: '24/05/2026' },
    { code: 'DV-2026-0141', name: 'Immeuble R+4 Bouskoura', client: 'SCI Atlas Habitat', surface: 1850, total: 18_900_000, status: 'Envoyé', tone: 'blue', date: '20/05/2026' },
    { code: 'DV-2026-0139', name: 'Réhabilitation école primaire', client: 'Commune Sidi Bernoussi', surface: 1200, total: 4_650_000, status: 'Accepté', tone: 'green', date: '15/05/2026' },
    { code: 'DV-2026-0138', name: 'Hangar logistique Aïn Sebaa', client: 'TransLog Maroc', surface: 2400, total: 9_200_000, status: 'Converti', tone: 'ocre', date: '12/05/2026', convertedTo: 'CSB-119' },
    { code: 'DV-2026-0135', name: 'Voirie résidence Hay Riad', client: 'Al Omrane Rabat', surface: 850, total: 3_400_000, status: 'Refusé', tone: 'red', date: '08/05/2026' },
    { code: 'DV-2026-0133', name: 'Mosquée de quartier — Nouaceur', client: 'Habous Casablanca', surface: 680, total: 5_120_000, status: 'Envoyé', tone: 'blue', date: '04/05/2026' },
  ];

  const INIT_FACTURES = [
    { num: 'FA-26-038', date: '2026-05-27', client: 'Résidence El Manar', chantier: 'Réhab. immeuble Bd Zerktouni', montantHT: 142_000, echeance: '2026-06-26', status: 'emise', mode: 'virement' },
    { num: 'FA-26-037', date: '2026-05-20', client: 'STÉ Maroc Distribution', chantier: 'Local commercial Hay Riad', montantHT: 218_000, echeance: '2026-06-19', status: 'emise', mode: 'virement' },
    { num: 'FA-26-036', date: '2026-05-15', client: 'M. Belhaj', chantier: 'Villa Souissi — situation 3', montantHT: 168_000, echeance: '2026-06-14', status: 'emise', mode: 'cheque' },
    { num: 'FA-26-035', date: '2026-04-28', client: 'Pharma Atlas SARL', chantier: 'Aménagement pharmacie', montantHT: 96_400, echeance: '2026-05-28', status: 'relance1', mode: 'virement', joursRetard: 0 },
    { num: 'FA-26-034', date: '2026-04-22', client: 'Résidence Al Andalous', chantier: 'Maintenance trim. ascenseurs', montantHT: 38_900, echeance: '2026-05-22', status: 'relance2', mode: 'virement', joursRetard: 6 },
    { num: 'FA-26-033', date: '2026-04-12', client: 'M. Idrissi', chantier: 'Travaux divers villa', montantHT: 72_000, echeance: '2026-05-12', status: 'relance3', mode: 'cheque', joursRetard: 16, alert: true },
    { num: 'FA-26-032', date: '2026-04-05', client: 'Café Bab Sebta', chantier: 'Réfection terrasse', montantHT: 54_300, echeance: '2026-05-05', status: 'encaisse', mode: 'cheque', encaisseLe: '2026-05-12' },
    { num: 'FA-26-031', date: '2026-03-28', client: 'STÉ Maroc Distribution', chantier: 'Local commercial — sit. 2', montantHT: 186_000, echeance: '2026-04-27', status: 'encaisse', mode: 'virement', encaisseLe: '2026-04-30' },
    { num: 'FA-26-030', date: '2026-03-15', client: 'Résidence El Manar', chantier: 'Étanchéité toiture', montantHT: 124_500, echeance: '2026-04-14', status: 'encaisse', mode: 'virement', encaisseLe: '2026-04-22' },
  ];

  const INIT_SITUATIONS = [
    { num: 'SIT-05/26', chantier: 'CSB-114', label: 'Marina Casablanca · Mai 2026', brut: 6_840_000, net: 6_188_400, status: 'Brouillon', tone: 'neutral', date: '28/05' },
    { num: 'SIT-04/26', chantier: 'CSB-114', label: 'Marina Casablanca · Avril 2026', brut: 6_240_000, net: 5_645_280, status: 'Validée MOE', tone: 'green', date: '02/05' },
    { num: 'SIT-08/26', chantier: 'TNG-061', label: 'Port Tanger Med · Mai 2026', brut: 3_120_000, net: 2_822_640, status: 'Envoyée', tone: 'blue', date: '26/05' },
    { num: 'SIT-03/26', chantier: 'RBT-208', label: 'Tramway Rabat · Mars 2026', brut: 8_900_000, net: 8_051_300, status: 'Payée', tone: 'ocre', date: '15/04' },
    { num: 'SIT-11/26', chantier: 'AGD-033', label: 'Hôtel Taghazout · Mai 2026', brut: 2_780_000, net: 2_514_460, status: 'Brouillon', tone: 'neutral', date: '27/05' },
    { num: 'SIT-04/26b', chantier: 'CSB-114', label: 'Marina · Avenant N°2 Mai', brut: 1_200_000, net: 1_085_640, status: 'Contestée', tone: 'red', date: '24/05' },
  ];

  const INIT_CLIENTS = [
    { id: 1, type: 'entreprise', name: 'Al Omrane', code: 'AO', ice: '000123456000078', city: 'Rabat', contact: 'M. R. Bouchaib', email: 'r.bouchaib@alomrane.ma', phone: '+212 537 28 19 45', ca: 84_500_000, chantiers: 1, factures: 12, statut: 'actif', encours: 2_140_000, logo: null },
    { id: 2, type: 'entreprise', name: 'STRS — Société Tramway Rabat-Salé', code: 'STR', ice: '000564789000056', city: 'Rabat', contact: 'Mme N. Kabbaj', email: 'n.kabbaj@strs.ma', phone: '+212 537 28 88 00', ca: 142_000_000, chantiers: 1, factures: 4, statut: 'actif', encours: 6_240_000, logo: null },
    { id: 3, type: 'entreprise', name: 'TMSA — Tanger Med', code: 'TMS', ice: '001874512000017', city: 'Tanger', contact: 'M. M. Tazi', email: 'tazi@tmsa.ma', phone: '+212 539 39 41 00', ca: 67_300_000, chantiers: 1, factures: 8, statut: 'actif', encours: 1_840_000, logo: null },
    { id: 4, type: 'entreprise', name: 'Aksal Group', code: 'AKS', ice: '002214785000044', city: 'Casablanca', contact: 'M. K. Berrada', email: 'k.berrada@aksal.ma', phone: '+212 522 48 77 00', ca: 124_200_000, chantiers: 1, factures: 18, statut: 'actif', encours: 4_120_000, logo: null },
    { id: 5, type: 'collectivite', name: 'Commune de Sidi Bernoussi', code: 'CSB', ice: '000098765000033', city: 'Casablanca', contact: 'M. le Président', email: 'president@csb.gov.ma', phone: '+212 522 35 12 00', ca: 28_900_000, chantiers: 2, factures: 9, statut: 'attention', encours: 12_700_000, logo: null },
    { id: 6, type: 'administration', name: 'ADM — Autoroutes du Maroc', code: 'ADM', ice: '000222111000058', city: 'Rabat', contact: 'Mme F. Chraïbi', email: 'f.chraibi@adm.gov.ma', phone: '+212 537 71 71 00', ca: 56_700_000, chantiers: 1, factures: 5, statut: 'actif', encours: 980_000, logo: null },
    { id: 7, type: 'entreprise', name: 'SAPST Hôtels', code: 'SAP', ice: '001845712000022', city: 'Agadir', contact: 'M. H. Lakhdar', email: 'h.lakhdar@sapst.ma', phone: '+212 528 84 12 00', ca: 38_900_000, chantiers: 1, factures: 6, statut: 'actif', encours: 720_000, logo: null },
    { id: 8, type: 'particulier', name: 'Famille Bennani', code: 'BEN', ice: '—', city: 'Marrakech', contact: 'M. & Mme Bennani', email: 'a.bennani@gmail.com', phone: '+212 661 24 18 90', ca: 4_800_000, chantiers: 1, factures: 3, statut: 'actif', encours: 0, logo: null },
    { id: 9, type: 'collectivite', name: 'Région Casablanca-Settat', code: 'RCS', ice: '000345678000091', city: 'Casablanca', contact: 'Direction technique', email: 'travaux@cs-region.ma', phone: '+212 522 45 80 00', ca: 21_400_000, chantiers: 1, factures: 2, statut: 'actif', encours: 2_840_000, logo: null },
    { id: 10, type: 'administration', name: 'ONEE Branche Eau', code: 'ONE', ice: '000887654000012', city: 'Rabat', contact: 'Direction Achats', email: 'achats@onee.ma', phone: '+212 537 71 40 00', ca: 31_500_000, chantiers: 1, factures: 2, statut: 'actif', encours: 0, logo: null },
  ];

  const INIT_BCS = [
    { num: 'BC-2026/0137', date: '2026-05-25', fournisseur: 'LafargeHolcim', chantier: 'CASA', montant: 46_800, status: 'valide', objet: 'Ciment CPJ 45 — 600 sacs' },
    { num: 'BC-2026/0136', date: '2026-05-22', fournisseur: 'Sonasid', chantier: 'CSB-114', montant: 78_400, status: 'valide', objet: 'Acier TOR Ø16 — 8 t' },
    { num: 'BC-2026/0135', date: '2026-05-18', fournisseur: 'Sonasid', chantier: 'CSB-114', montant: 274_400, status: 'livre', objet: 'Ferraille TOR — 28 t' },
    { num: 'BC-2026/0134', date: '2026-05-14', fournisseur: 'Granulats du Souss', chantier: 'AGD-033', montant: 26_400, status: 'emis', objet: 'Sable lavé 0/4 — 180 m³' },
    { num: 'BC-2026/0133', date: '2026-05-10', fournisseur: 'SOTRAVO Étanchéité', chantier: 'TNG-061', montant: 33_600, status: 'livre', objet: 'Membrane SBS 4mm — 80 rouleaux' },
  ];

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------
  function StoreProvider({ children }) {
    const [chantiers,  setChantiers]  = React.useState(INIT_CHANTIERS);
    const [devis,      setDevis]      = React.useState(INIT_DEVIS);
    const [factures,   setFactures]   = React.useState(INIT_FACTURES);
    const [situations, setSituations] = React.useState(INIT_SITUATIONS);
    const [clients,    setClients]    = React.useState(INIT_CLIENTS);
    const [bcs,        setBcs]        = React.useState(INIT_BCS);

    // ── Chantiers ──────────────────────────────────────────────────────────
    const addChantier = (c) => setChantiers(prev => [c, ...prev]);
    const updateChantier = (code, updates) =>
      setChantiers(prev => prev.map(ch => ch.code === code ? { ...ch, ...updates } : ch));

    // ── Devis ──────────────────────────────────────────────────────────────
    const addDevis = (dv) => setDevis(prev => [dv, ...prev]);
    const updateDevisStatus = (code, status) => {
      const toneMap = {
        'Brouillon': 'neutral', 'Envoyé': 'blue', 'Accepté': 'green',
        'Converti': 'ocre', 'Refusé': 'red',
      };
      setDevis(prev => prev.map(d => d.code === code ? { ...d, status, tone: toneMap[status] || 'neutral' } : d));
    };

    // ── Factures ───────────────────────────────────────────────────────────
    const addFacture = (f) => setFactures(prev => [f, ...prev]);
    const updateFactureStatus = (num, status) =>
      setFactures(prev => prev.map(f => f.num === num ? { ...f, status } : f));

    // ── Situations ─────────────────────────────────────────────────────────
    const addSituation = (s) => setSituations(prev => [s, ...prev]);

    // ── Clients ────────────────────────────────────────────────────────────
    const addClient = (c) => {
      const id = Date.now();
      setClients(prev => [{ id, ...c }, ...prev]);
    };

    // ── BCs ────────────────────────────────────────────────────────────────
    const addBC = (bc) => setBcs(prev => [bc, ...prev]);

    // ── Conversion : Devis → Chantier ─────────────────────────────────────
    const convertDevisToChantier = (devisCode) => {
      const dv = devis.find(d => d.code === devisCode);
      if (!dv) return null;

      // Générer un code chantier unique
      const seq = String(chantiers.length + 1).padStart(3, '0');
      const newCode = 'CSB-' + (200 + chantiers.length);

      const newChantier = {
        code: newCode,
        name: dv.name,
        client: dv.client,
        city: 'Casablanca',
        region: 'Casa-Settat',
        type: 'Bâtiment',
        conducteur: 'K. Benjelloun',
        physique: 0,
        budget: 0,
        marge: 12,
        montant: dv.total,
        debut: new Date().toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }).replace('/', '/'),
        fin: '12/2027',
        status: 'Démarrage',
        tone: 'blue',
        alert: 0,
        fromDevis: devisCode,
      };

      setChantiers(prev => [newChantier, ...prev]);
      updateDevisStatus(devisCode, 'Converti');
      setDevis(prev => prev.map(d => d.code === devisCode ? { ...d, convertedTo: newCode } : d));

      return newCode;
    };

    // ── Situation → Facture ────────────────────────────────────────────────
    const situationToFacture = (sitCode) => {
      const sit = situations.find(s => s.num === sitCode);
      if (!sit) return null;

      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const isoDate = `${yyyy}-${mm}-${dd}`;

      // Échéance à 30 jours
      const ech = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const isoEch = `${ech.getFullYear()}-${String(ech.getMonth() + 1).padStart(2, '0')}-${String(ech.getDate()).padStart(2, '0')}`;

      const lastNum = factures.reduce((max, f) => {
        const n = parseInt((f.num || '').split('-').pop()) || 0;
        return Math.max(max, n);
      }, 38);
      const newNum = `FA-26-${String(lastNum + 1).padStart(3, '0')}`;

      const chantier = chantiers.find(c => c.code === sit.chantier);

      const newFacture = {
        num: newNum,
        date: isoDate,
        client: chantier ? chantier.client : sit.chantier,
        chantier: sit.label,
        montantHT: Math.round(sit.net / 1.2),
        echeance: isoEch,
        status: 'emise',
        mode: 'virement',
        fromSituation: sitCode,
      };

      setFactures(prev => [newFacture, ...prev]);
      setSituations(prev => prev.map(s => s.num === sitCode ? { ...s, status: 'Facturée', tone: 'ocre' } : s));

      return newNum;
    };

    const value = {
      // State
      chantiers, devis, factures, situations, clients, bcs,
      // Setters directs (si nécessaire)
      setChantiers, setDevis, setFactures, setSituations, setClients, setBcs,
      // Operations
      addChantier, updateChantier,
      addDevis, updateDevisStatus,
      addFacture, updateFactureStatus,
      addSituation,
      addClient,
      addBC,
      convertDevisToChantier,
      situationToFacture,
    };

    return (
      <StoreContext.Provider value={value}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStore() {
    const ctx = React.useContext(StoreContext);
    if (!ctx) {
      // Retourne un objet vide-safe pour éviter les crash si le provider est absent
      console.warn('[Atlas·BTP] useStore() appelé hors de <StoreProvider>');
      return {};
    }
    return ctx;
  }

  Object.assign(window, { StoreProvider, useStore, StoreContext });

})();
