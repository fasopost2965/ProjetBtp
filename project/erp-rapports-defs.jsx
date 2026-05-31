/* global fmtMAD */
// =============================================================================
// ERP — Définitions de données des 26 rapports (data-driven)
// Chaque entrée : (params) => { code, category, title, period, blocks[] }
// Consommé par le moteur window.RapportEngine.ReportRenderer / exportReport.
// Exposé : window.RAPPORT_DEFS  (map code -> fonction de définition)
// =============================================================================

(function () {
const f = (n) => fmtMAD(n) + ' DH';
const pct = (n) => n.toFixed(1).replace('.', ',') + ' %';

// Données partagées (chantiers de démo)
const CHANTIERS = [
  { code: 'CSB-114', nom: 'Marina Casablanca L3', ca: 31478, cout: 27700 },
  { code: 'RBT-208', nom: 'Tramway Rabat-Salé', ca: 84200, cout: 74900 },
  { code: 'TNG-061', nom: 'Port Tanger Med', ca: 67300, cout: 60100 },
  { code: 'AGD-033', nom: 'Hôtel Taghazout Bay', ca: 48600, cout: 44200 },
  { code: 'MEK-019', nom: 'Échangeur A2 PK142', ca: 29400, cout: 25800 },
  { code: 'CSB-098', nom: 'CC Sidi Maârouf', ca: 76900, cout: 67460 },
];

const DEFS = {};

// ─── FINANCE ─────────────────────────────────────────────────────────────────
DEFS.F1 = () => {
  const recettes = [
    ['Situation N°1 — Janvier 2025', f(4120000)],
    ['Situation N°2 — Mars 2025', f(5840000)],
    ['Situation N°3 — Septembre 2025', f(7650000)],
    ['Situation N°4 — Avril 2026', f(6240000)],
    ['Situation N°5 en cours — Mai 2026', f(6188400)],
    ['Avenant N°1 facturé', f(1440000)],
  ];
  const totRec = 31478400;
  const directs = [
    ['Matériaux (béton, acier, agglos)', f(14681000), '53,0 %'],
    ['Main d\'œuvre directe', f(4432000), '16,0 %'],
    ['Sous-traitance', f(6094000), '22,0 %'],
    ['Location matériel & engins', f(2493000), '9,0 %'],
  ];
  const indirects = [
    ['Frais de chantier (base-vie, fluides)', f(1180000)],
    ['Encadrement & conduite travaux', f(890000)],
    ['Quote-part frais généraux siège', f(940000)],
  ];
  return {
    code: 'F1', category: 'Finance', title: 'Compte d\'exploitation par chantier',
    period: 'Chantier CSB-114 · Marina Casablanca · cumul à fin mai 2026',
    blocks: [
      { type: 'kpis', items: [
        { label: 'Recettes', value: f(31478400) },
        { label: 'Coûts totaux', value: f(27700000) },
        { label: 'Résultat brut', value: f(3778400), highlight: true },
        { label: 'Marge', value: '12,0', unit: '%', sub: 'cible 14,5 % · −1,7 pt' },
      ] },
      { type: 'section', num: 'I', title: 'Recettes', headers: ['Désignation', 'Montant HT'], rows: recettes, totalRow: ['Total recettes', f(totRec)] },
      { type: 'section', num: 'II', title: 'Coûts directs', headers: ['Poste', 'Montant', '% direct'], rows: directs, totalRow: ['Total coûts directs', f(27700000), '100 %'] },
      { type: 'section', num: 'III', title: 'Coûts indirects', headers: ['Poste', 'Montant'], rows: indirects, totalRow: ['Total indirects', f(3010000)] },
      { type: 'signatures', roles: ['Conducteur de travaux', 'Directeur administratif & financier', 'Directeur Général'] },
    ],
  };
};

DEFS.F2 = () => {
  const rows = CHANTIERS.map(c => {
    const marge = c.ca - c.cout;
    const tx = (marge / c.ca) * 100;
    const prevu = tx + (Math.random() * 3 - 1.5);
    return [c.code + ' · ' + c.nom, f(c.ca * 1000), f(c.cout * 1000), f(marge * 1000), pct(prevu) + ' / ' + pct(tx), (tx - prevu >= 0 ? '+' : '') + (tx - prevu).toFixed(1).replace('.', ',') + ' pt'];
  });
  const totCA = CHANTIERS.reduce((s, c) => s + c.ca, 0) * 1000;
  const totCout = CHANTIERS.reduce((s, c) => s + c.cout, 0) * 1000;
  return {
    code: 'F2', category: 'Finance', title: 'Marge brute par chantier',
    period: 'Tous chantiers actifs · cumul exercice 2026',
    blocks: [
      { type: 'kpis', items: [
        { label: 'CA cumulé', value: f(totCA) },
        { label: 'Coûts cumulés', value: f(totCout) },
        { label: 'Marge brute moyenne', value: pct((totCA - totCout) / totCA * 100), highlight: true },
      ] },
      { type: 'section', title: 'Marge par chantier', headers: ['Chantier', 'CA HT', 'Coût', 'Marge', 'Prévue / Réelle', 'Écart'], rows, totalRow: ['TOTAL', f(totCA), f(totCout), f(totCA - totCout), pct((totCA - totCout) / totCA * 100), ''] },
      { type: 'note', text: 'Marge prévue issue du budget BPU. Écart négatif = dérive à analyser (dépassement matériaux ou sous-traitance). Seuil d\'alerte : −2 points.' },
    ],
  };
};

DEFS.F3 = () => ({
  code: 'F3', category: 'Finance', title: 'Situation financière globale',
  period: 'Position consolidée au 28 mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Trésorerie nette', value: f(26105000), highlight: true },
      { label: 'Créances clients', value: f(43100000) },
      { label: 'Dettes fournisseurs', value: f(33700000) },
      { label: 'BFR', value: f(9400000), sub: 'créances − dettes' },
    ] },
    { type: 'section', num: 'I', title: 'Trésorerie disponible', headers: ['Compte', 'Solde'], rows: [
      ['BMCE Bank', f(11240000)], ['Attijariwafa Bank', f(8930000)], ['CIH Bank', f(5680000)], ['Petite caisse', f(255000)],
    ], totalRow: ['Total disponible', f(26105000)] },
    { type: 'section', num: 'II', title: 'Créances clients par ancienneté', headers: ['Tranche', 'Montant'], rows: [
      ['0 – 30 jours', f(18400000)], ['30 – 60 jours', f(11800000)], ['60 – 90 jours', f(7600000)], ['> 90 jours (relance)', f(5300000)],
    ], totalRow: ['Total créances', f(43100000)] },
    { type: 'section', num: 'III', title: 'Dettes fournisseurs', headers: ['Tranche', 'Montant'], rows: [
      ['À échoir', f(21300000)], ['Échu < 30 j', f(8900000)], ['Échu > 30 j', f(3500000)],
    ], totalRow: ['Total dettes', f(33700000)] },
    { type: 'note', text: 'Créance > 90 j de 5,3 M DH à passer en relance contentieuse. Trésorerie nette couvre ~2 mois de charges. Caution CSB-114 expire dans 18 jours.' },
  ],
});

DEFS.F4 = () => {
  const sem = Array.from({ length: 13 }, (_, i) => `S${22 + i}`);
  const rows = sem.map((s, i) => {
    const enc = 2000 + Math.round(Math.sin(i) * 800 + i * 120);
    const dec = 1400 + Math.round(Math.cos(i) * 500 + i * 60);
    return [s, f(enc * 1000), f(dec * 1000), f((enc - dec) * 1000)];
  });
  return {
    code: 'F4', category: 'Finance', title: 'Échéancier de trésorerie 13 semaines',
    period: 'Prévisionnel glissant · S22 → S34 2026',
    blocks: [
      { type: 'kpis', items: [
        { label: 'Solde initial', value: f(26100000) },
        { label: 'Encaissements 13 sem.', value: f(45916000) },
        { label: 'Décaissements 13 sem.', value: f(20872000) },
        { label: 'Solde fin S34', value: f(51144000), highlight: true },
      ] },
      { type: 'section', title: 'Flux hebdomadaires', headers: ['Semaine', 'Encaissements', 'Décaissements', 'Net'], rows },
      { type: 'note', text: 'Hypothèses : encaissement situations validées MOE à 21 j, privé 30 j, public 45 j. Paie au 28, CNSS/AMO au 8, IR au 30. Réserve de sécurité : 15 M DH.' },
    ],
  };
};

DEFS.F5 = () => ({
  code: 'F5', category: 'Finance', title: 'Suivi des cautions bancaires',
  period: 'Cautions de marché en cours · mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Encours cautions', value: f(41580000), highlight: true },
      { label: 'Provisoires', value: f(8200000) },
      { label: 'Définitives', value: f(24600000) },
      { label: 'Retenues garantie', value: f(8780000) },
    ] },
    { type: 'section', title: 'Détail par caution', headers: ['Chantier', 'Type', 'Banque', 'Montant', 'Échéance'], rows: [
      ['CSB-114', 'Définitive', 'BMCE', f(4225000), '15/06/2026'],
      ['RBT-208', 'Définitive', 'Attijari', f(8400000), '30/09/2026'],
      ['TNG-061', 'Retenue gar.', 'CIH', f(3360000), '12/11/2026'],
      ['AGD-033', 'Provisoire', 'BMCE', f(2430000), '08/07/2026'],
      ['MEK-019', 'Définitive', 'BP', f(2940000), '20/12/2026'],
    ], totalRow: ['TOTAL', '', '', f(41580000), ''] },
    { type: 'note', text: 'Caution CSB-114 (BMCE, 4,2 M DH) expire dans 18 jours → demander mainlevée après réception définitive ou renouveler. Coût moyen mainlevée : 0,2 % du montant.' },
  ],
});

DEFS.F6 = () => ({
  code: 'F6', category: 'Finance', title: 'Déclaration TVA mensuelle',
  period: 'Période : avril 2026 · régime débit',
  blocks: [
    { type: 'kpis', items: [
      { label: 'TVA collectée', value: f(8940000) },
      { label: 'TVA déductible', value: f(6120000) },
      { label: 'TVA à payer', value: f(2820000), highlight: true },
    ] },
    { type: 'section', num: 'I', title: 'TVA collectée (ventes)', headers: ['Base HT', 'Taux', 'TVA'], rows: [
      [f(44700000), '20 %', f(8940000)],
    ], totalRow: ['Total collectée', '', f(8940000)] },
    { type: 'section', num: 'II', title: 'TVA déductible (achats & charges)', headers: ['Nature', 'Base HT', 'TVA'], rows: [
      ['Immobilisations', f(4200000), f(840000)],
      ['Achats matériaux & ST', f(24600000), f(4920000)],
      ['Charges diverses', f(1800000), f(360000)],
    ], totalRow: ['Total déductible', '', f(6120000)] },
    { type: 'note', text: 'TVA nette à reverser à l\'administration fiscale avant le 20 du mois suivant. Crédit de TVA reportable si déductible > collectée.' },
  ],
});

DEFS.F7 = () => ({
  code: 'F7', category: 'Finance', title: 'Balance âgée clients',
  period: 'Au 24 mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Total créances', value: f(43100000), highlight: true },
      { label: 'Non échu', value: f(18400000) },
      { label: 'En retard', value: f(24700000), sub: '57 % de l\'encours' },
    ] },
    { type: 'section', title: 'Encours par client', headers: ['Client', '0-30 j', '30-60 j', '60-90 j', '> 90 j', 'Total'], rows: [
      ['Al Omrane Rabat', f(6200000), f(3100000), '0', '0', f(9300000)],
      ['STÉ Maroc Distribution', f(4100000), f(2800000), f(1900000), '0', f(8800000)],
      ['Résidence El Manar', f(3200000), f(1700000), f(2100000), f(1400000), f(8400000)],
      ['Commune Sidi Bernoussi', f(2100000), f(2400000), f(1800000), f(2300000), f(8600000)],
      ['Habous Casablanca', f(2800000), f(1800000), f(1800000), f(1600000), f(8000000)],
    ], totalRow: ['TOTAL', f(18400000), f(11800000), f(7600000), f(5300000), f(43100000)] },
    { type: 'note', text: 'Relances à déclencher : tranche 60-90 j (courrier recommandé), tranche > 90 j (mise en demeure / contentieux). Priorité : Résidence El Manar et Commune Sidi Bernoussi.' },
  ],
});

DEFS.F8 = () => ({
  code: 'F8', category: 'Finance', title: 'Engagements fournisseurs',
  period: 'Bons de commande en cours · mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Engagé total', value: f(12480000), highlight: true },
      { label: 'Livré non facturé', value: f(3900000) },
      { label: 'Restant à livrer', value: f(5200000) },
    ] },
    { type: 'section', title: 'Engagements par fournisseur', headers: ['Fournisseur', 'BC émis', 'Livré', 'Facturé', 'Reste à livrer'], rows: [
      ['Sonasid (acier)', f(2840000), f(1900000), f(1900000), f(940000)],
      ['CIMAR (BPE)', f(3120000), f(2400000), f(1800000), f(720000)],
      ['LafargeHolcim', f(1840000), f(1840000), f(1500000), '0'],
      ['Granulats du Souss', f(1560000), f(900000), f(900000), f(660000)],
      ['TIM Locations', f(1680000), f(1120000), f(1120000), f(560000)],
    ], totalRow: ['TOTAL', f(11040000), f(8160000), f(7220000), f(2880000)] },
  ],
});

DEFS.C8 = () => ({
  code: 'C8', category: 'Chantier', title: 'Dépenses & charges chantier détaillées',
  period: 'Chantier CSB-114 · cumul janvier → mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Dépenses cumulées', value: f(6983000), highlight: true },
      { label: 'Moyenne mensuelle', value: f(1397000) },
      { label: 'Poste principal', value: 'BPE', unit: '28 %' },
      { label: 'vs budget', value: '+4,2', unit: '%', sub: 'dépassement modéré' },
    ] },
    { type: 'section', title: 'Dépenses par poste (cumul)', headers: ['Poste', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Cumul'], rows: [
      ['Béton (BPE)', f(280000), f(340000), f(420000), f(480000), f(440000), f(1960000)],
      ['Aciers', f(180000), f(220000), f(260000), f(240000), f(210000), f(1110000)],
      ['Agglos & granulats', f(90000), f(110000), f(130000), f(120000), f(100000), f(550000)],
      ['Main d\'œuvre', f(220000), f(260000), f(280000), f(300000), f(290000), f(1350000)],
      ['Sous-traitance', f(140000), f(180000), f(220000), f(260000), f(240000), f(1040000)],
      ['Location engins', f(80000), f(90000), f(110000), f(120000), f(100000), f(500000)],
      ['Carburants & frais', f(95000), f(100000), f(110000), f(105000), f(63000), f(473000)],
    ], totalRow: ['TOTAL', f(1085000), f(1300000), f(1640000), f(1625000), f(1443000), f(6983000)] },
    { type: 'note', text: 'Répartition : matériaux 53,4 %, MO 21,8 %, sous-traitance 13,1 %, matériel 8,2 %, frais 3,5 %. Dépassement budgétaire de 4,2 % concentré sur le béton.' },
  ],
});

DEFS.R6 = () => ({
  code: 'R6', category: 'RH & Paie', title: 'Charges sociales mensuelles',
  period: 'Période : mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Masse salariale brute', value: f(1634000) },
      { label: 'Charges patronales', value: f(392000), sub: '24 % du brut' },
      { label: 'Retenues salariales', value: f(278000), sub: '17 % du brut' },
      { label: 'Coût employeur total', value: f(2026000), highlight: true },
    ] },
    { type: 'section', title: 'Ventilation par chantier', headers: ['Chantier', 'Brut', 'CNSS pat.', 'AMO pat.', 'IR', 'Net à payer', 'Coût total'], rows: [
      ['CSB-114', f(458000), f(41000), f(8500), f(62000), f(346000), f(566000)],
      ['RBT-208', f(184000), f(16500), f(3400), f(22000), f(142000), f(228000)],
      ['TNG-061', f(312000), f(28000), f(5800), f(38000), f(241000), f(386000)],
      ['AGD-033', f(268000), f(24000), f(5000), f(31000), f(208000), f(332000)],
      ['Siège', f(412000), f(37000), f(7600), f(58000), f(309000), f(514000)],
    ], totalRow: ['TOTAL', f(1634000), f(146500), f(30300), f(211000), f(1246000), f(2026000)] },
    { type: 'note', text: 'Échéances : CNSS/AMO DAMANCOM au 8 juin · IR DGI au 30 juin · taxe formation professionnelle au 30 juin. Cotisations patronales : CNSS 8,98 % + AMO 1,85 % + formation 1,6 %.' },
  ],
});

// ─── CHANTIER ────────────────────────────────────────────────────────────────
DEFS.C2 = () => ({
  code: 'C2', category: 'Chantier', title: 'Avancement physique vs budget',
  period: 'Chantier CSB-114 · au 24 mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Avancement physique', value: '47', unit: '%' },
      { label: 'Avancement budgétaire', value: '52', unit: '%', highlight: true },
      { label: 'Écart', value: '−5', unit: 'pts', sub: 'consommation > production' },
    ] },
    { type: 'section', title: 'Avancement par lot', headers: ['Lot', 'Physique %', 'Budget consommé %', 'Écart'], rows: [
      ['Terrassement & VRD', '100 %', '98 %', '+2'],
      ['Gros œuvre structure', '62 %', '68 %', '−6'],
      ['Étanchéité', '20 %', '24 %', '−4'],
      ['Second œuvre', '8 %', '12 %', '−4'],
      ['Finitions', '0 %', '2 %', '−2'],
    ] },
    { type: 'note', text: 'Écart négatif global de 5 points : la consommation budgétaire dépasse l\'avancement physique, principalement sur le gros œuvre. À surveiller pour préserver la marge.' },
  ],
});

DEFS.C3 = () => ({
  code: 'C3', category: 'Chantier', title: 'Décompte général définitif (DGD)',
  period: 'Chantier CSB-098 · clôture de marché',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Montant marché initial', value: f(72000000) },
      { label: 'Avenants', value: f(4800000) },
      { label: 'Décompte définitif', value: f(76200000), highlight: true },
    ] },
    { type: 'section', title: 'Récapitulatif des situations', headers: ['Situation', 'Période', 'Montant cumulé'], rows: [
      ['Situations 1 à 11', '2025', f(58400000)],
      ['Situation 12 (solde)', 'Jan 2026', f(13000000)],
      ['Révision de prix', '—', f(1400000)],
      ['Avenant N°1 (travaux supp.)', '—', f(4800000)],
      ['Retenue de garantie (−)', '5 %', '− ' + f(1400000)],
    ], totalRow: ['Net décompte général définitif', '', f(76200000)] },
    { type: 'signatures', roles: ['Entreprise', 'Maître d\'œuvre', 'Maître d\'ouvrage'] },
  ],
});

DEFS.C5 = () => ({
  code: 'C5', category: 'Chantier', title: 'Journal de chantier',
  period: 'Chantier CSB-114 · semaine du 24 au 28 mai 2026',
  blocks: [
    { type: 'section', title: 'Mouvements & événements', headers: ['Date', 'Type', 'Description'], rows: [
      ['24/05', 'Livraison', 'Acier TOR 28 t — Sonasid (BL 4471)'],
      ['25/05', 'Matériel', 'Arrivée grue à tour 60 m — montage'],
      ['26/05', 'Livraison', 'BPE C25/30 — 280 m³ (4 toupies)'],
      ['26/05', 'Visite', 'Contrôle MOE — voile B3 conforme'],
      ['27/05', 'Incident', 'Presqu\'accident chute mineur — sécurisé'],
      ['28/05', 'Sortie', 'Évacuation déblais — 12 rotations camion'],
    ] },
    { type: 'note', text: 'Aucun arrêt de travaux majeur cette semaine. Effectif moyen : 142 ouvriers. Prochaine livraison critique : coffrage niveau 5 prévue lundi.' },
  ],
});

DEFS.C6 = () => ({
  code: 'C6', category: 'Chantier', title: 'Consommation matériaux',
  period: 'Chantier CSB-114 · cumul à fin mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Écart global', value: '+3,2', unit: '%', sub: 'réel vs théorique', highlight: true },
    ] },
    { type: 'section', title: 'Théorique BPU vs réel', headers: ['Matériau', 'Théorique', 'Réel', 'Écart %'], rows: [
      ['Béton (m³)', '4 200', '4 380', '+4,3 %'],
      ['Acier (t)', '520', '534', '+2,7 %'],
      ['Agglos (u)', '128 000', '131 200', '+2,5 %'],
      ['Ciment (t)', '180', '189', '+5,0 %'],
      ['Sable (m³)', '960', '982', '+2,3 %'],
    ] },
    { type: 'note', text: 'Surconsommation béton (+4,3 %) et ciment (+5 %) à investiguer : pertes au coulage ou ajustements de dosage. Seuil d\'alerte BTP : +5 %.' },
  ],
});

DEFS.C7 = () => ({
  code: 'C7', category: 'Chantier', title: 'Sous-détail de prix',
  period: 'Poste : Béton armé pour voiles (B25) · au m³',
  blocks: [
    { type: 'section', num: 'I', title: 'Déboursé sec', headers: ['Composante', 'Quantité', 'P.U.', 'Montant'], rows: [
      ['Béton C25/30 (BPE)', '1,02 m³', '950', f(969)],
      ['Acier HA (ratio 90 kg/m³)', '90 kg', '14', f(1260)],
      ['Coffrage (2 faces)', '5 m²', '55', f(275)],
      ['Main d\'œuvre (coffreur+ferrailleur)', '3,5 h', '95', f(333)],
    ], totalRow: ['Déboursé sec', '', '', f(2837)] },
    { type: 'section', num: 'II', title: 'Du déboursé au prix de vente', headers: ['Élément', 'Taux', 'Montant'], rows: [
      ['Déboursé sec', '—', f(2837)],
      ['Frais de chantier (FC)', '8 %', f(227)],
      ['Frais généraux (FG)', '6 %', f(170)],
      ['Marge bénéficiaire', '12 %', f(388)],
    ], totalRow: ['Prix de vente HT / m³', '', f(3622)] },
  ],
});

DEFS.C9 = () => ({
  code: 'C9', category: 'Chantier', title: 'Suivi fournisseurs par chantier',
  period: 'Chantier CSB-114 · cumul exercice 2026',
  blocks: [
    { type: 'section', title: 'Volume confié — Top fournisseurs', headers: ['Fournisseur', 'Catégorie', 'Volume HT', '% du total'], rows: [
      ['CIMAR', 'BPE', f(4120000), '28 %'],
      ['Sonasid', 'Acier', f(3240000), '22 %'],
      ['SOTRAVO', 'Étanchéité', f(2350000), '16 %'],
      ['Granulats du Souss', 'Granulats', f(1760000), '12 %'],
      ['TIM Locations', 'Matériel', f(1470000), '10 %'],
      ['Autres (12)', 'Divers', f(1760000), '12 %'],
    ], totalRow: ['TOTAL', '', f(14700000), '100 %'] },
  ],
});

// ─── RH & PAIE ───────────────────────────────────────────────────────────────
DEFS.R2 = () => ({
  code: 'R2', category: 'RH & Paie', title: 'Déclaration CNSS (BDS)',
  period: 'Période : mai 2026 · télédéclaration DAMANCOM',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Salariés déclarés', value: '212' },
      { label: 'Masse plafonnée', value: f(1272000) },
      { label: 'Cotisation totale', value: f(388000), highlight: true },
    ] },
    { type: 'section', title: 'Récapitulatif par chantier', headers: ['Chantier', 'Effectif', 'Masse salariale', 'Base plafonnée', 'Cotisation'], rows: [
      ['CSB-114', '52', f(458000), f(312000), f(95000)],
      ['RBT-208', '38', f(184000), f(228000), f(70000)],
      ['TNG-061', '44', f(312000), f(264000), f(80000)],
      ['AGD-033', '36', f(268000), f(216000), f(66000)],
      ['Siège', '42', f(412000), f(252000), f(77000)],
    ], totalRow: ['TOTAL', '212', f(1634000), f(1272000), f(388000)] },
    { type: 'note', text: 'Cotisation = base plafonnée (6 000 DH/salarié) × taux global CNSS. Télédéclaration et paiement avant le 8 juin 2026 via le portail DAMANCOM.' },
  ],
});

DEFS.R3 = () => ({
  code: 'R3', category: 'RH & Paie', title: 'IR sur salaires',
  period: 'Période : mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Salariés imposables', value: '64', sub: 'sur 212' },
      { label: 'IR à reverser DGI', value: f(286000), highlight: true },
    ] },
    { type: 'section', title: 'IR par tranche de salaire', headers: ['Tranche nette imposable', 'Effectif', 'IR retenu'], rows: [
      ['0 – 2 500 (exonéré)', '148', '0'],
      ['2 500 – 4 166 (10 %)', '32', f(38000)],
      ['4 166 – 5 000 (20 %)', '14', f(52000)],
      ['5 000 – 6 667 (30 %)', '11', f(78000)],
      ['6 667 – 15 000 (34 %)', '6', f(86000)],
      ['> 15 000 (38 %)', '1', f(32000)],
    ], totalRow: ['TOTAL', '212', f(286000)] },
    { type: 'note', text: 'Retenue à la source reversée à la DGI avant le 30 du mois suivant. Barème IR mensuel marocain 2026.' },
  ],
});

DEFS.R4 = () => ({
  code: 'R4', category: 'RH & Paie', title: 'Heures pointées par chantier',
  period: 'Semaine du 24 au 28 mai 2026',
  blocks: [
    { type: 'section', title: 'Heures par chantier', headers: ['Chantier', 'Effectif', 'H. normales', 'H. supp.', 'Total'], rows: [
      ['CSB-114', '142', '5 680', '420', '6 100'],
      ['RBT-208', '56', '2 240', '120', '2 360'],
      ['TNG-061', '78', '3 120', '180', '3 300'],
      ['AGD-033', '87', '3 480', '210', '3 690'],
      ['MEK-019', '41', '1 640', '60', '1 700'],
    ], totalRow: ['TOTAL', '404', '16 160', '990', '17 150'] },
    { type: 'note', text: 'Heures supplémentaires majorées à 25 % (jour) / 50 % (nuit & dimanche). Taux d\'heures supp. global : 5,8 % — dans la norme.' },
  ],
});

DEFS.R5 = () => ({
  code: 'R5', category: 'RH & Paie', title: 'Affectation parc matériel',
  period: 'Mai 2026 · tous engins',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Engins actifs', value: '24' },
      { label: 'Taux d\'utilisation moyen', value: '78', unit: '%', highlight: true },
      { label: 'Gasoil consommé', value: '42 800', unit: 'L' },
    ] },
    { type: 'section', title: 'Affectation par engin', headers: ['Engin', 'Chantier', 'Heures', 'Utilisation %', 'Gasoil (L)'], rows: [
      ['Grue à tour 60 m', 'CSB-114', '184', '92 %', '0'],
      ['Pelle 30 t', 'RBT-208', '156', '78 %', '8 400'],
      ['Bulldozer D6', 'TNG-061', '142', '71 %', '9 200'],
      ['Chargeuse 950', 'AGD-033', '168', '84 %', '6 800'],
      ['Niveleuse', 'MEK-019', '128', '64 %', '5 600'],
    ] },
    { type: 'note', text: 'Engins sous 70 % d\'utilisation (niveleuse MEK-019) : envisager mutualisation ou restitution de location. Coût gasoil moyen : 12,80 DH/L.' },
  ],
});

DEFS.R7 = () => ({
  code: 'R7', category: 'RH & Paie', title: 'Productivité équipes chantier',
  period: 'Cumul mai 2026',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Rendement moyen', value: '94', unit: '%', sub: 'h vendues / h pointées', highlight: true },
    ] },
    { type: 'section', title: 'Rendement par chantier', headers: ['Chantier', 'H. pointées', 'H. vendues (BPU)', 'Rendement'], rows: [
      ['CSB-114', '24 400', '23 100', '95 %'],
      ['RBT-208', '9 440', '8 600', '91 %'],
      ['TNG-061', '13 200', '12 500', '95 %'],
      ['AGD-033', '14 760', '13 400', '91 %'],
      ['MEK-019', '6 800', '6 600', '97 %'],
    ] },
    { type: 'note', text: 'Rendement < 92 % (RBT-208, AGD-033) : analyser les temps morts (attente matériel, intempéries, reprises). Objectif interne : 95 %.' },
  ],
});

// ─── CONFORMITÉ ──────────────────────────────────────────────────────────────
DEFS.L1 = () => ({
  code: 'L1', category: 'Conformité', title: 'Dossier appel d\'offres',
  period: 'AO N°48/2026 · Construction groupe scolaire — Province de Berrechid',
  blocks: [
    { type: 'section', num: 'I', title: 'Pièces administratives', headers: ['Pièce', 'Statut'], rows: [
      ['Déclaration sur l\'honneur', '✓ Fournie'],
      ['Attestation CNSS', '✓ À jour'],
      ['Attestation fiscale', '✓ À jour'],
      ['Certificat d\'inscription RC', '✓ Fournie'],
      ['Caution provisoire (1,5 %)', '✓ Émise BMCE'],
    ] },
    { type: 'section', num: 'II', title: 'Pièces techniques', headers: ['Pièce', 'Statut'], rows: [
      ['Moyens humains (CV encadrement)', '✓ Fournie'],
      ['Moyens matériels', '✓ Fournie'],
      ['Références chantiers similaires', '✓ 5 attestations'],
      ['Planning prévisionnel', '✓ Fournie'],
      ['Mémoire technique', '⚠ En cours'],
    ] },
    { type: 'note', text: 'Dossier à déposer avant le 12 juin 2026, 10h00. Reste à finaliser : mémoire technique (méthodologie + organisation). Offre financière sous pli séparé.' },
  ],
});

DEFS.L2 = () => ({
  code: 'L2', category: 'Conformité', title: 'Liste attestations sous-traitants',
  period: 'Au 5 mai 2026',
  blocks: [
    { type: 'section', title: 'Conformité documentaire', headers: ['Sous-traitant', 'CNSS', 'Fiscale', 'RC pro', 'Statut'], rows: [
      ['SOTRAVO Étanchéité', '✓', '✓', '✓', 'Conforme'],
      ['Électrique du Maroc', '✓', '✓', '✓', 'Conforme'],
      ['Aluminium Berrechid', '✓', '⚠ expire 06/26', '✓', 'À renouveler'],
      ['Géofondations Maroc', '✓', '✓', '✓', 'Conforme'],
      ['KONE Maroc', '✓', '✓', '⚠ manquante', 'Incomplet'],
    ] },
    { type: 'note', text: 'Relancer Aluminium Berrechid (attestation fiscale expire en juin) et KONE Maroc (RC pro manquante) avant tout nouveau décompte. Paiement bloqué si non conforme.' },
  ],
});

DEFS.L3 = () => ({
  code: 'L3', category: 'Conformité', title: 'Registre HSE',
  period: 'Mai 2026 · tous chantiers',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Accidents avec arrêt', value: '0', highlight: true },
      { label: 'Presque-accidents', value: '3' },
      { label: 'Formations sécurité', value: '4', sub: '86 personnes' },
    ] },
    { type: 'section', title: 'Événements HSE du mois', headers: ['Date', 'Chantier', 'Type', 'Suite donnée'], rows: [
      ['07/05', 'RBT-208', 'Presque-accident (chute objet)', 'Sécurisation zone + causerie'],
      ['14/05', 'CSB-114', 'Formation port EPI', '32 ouvriers formés'],
      ['19/05', 'TNG-061', 'Presque-accident (engin)', 'Balisage renforcé'],
      ['22/05', 'AGD-033', 'Formation travail en hauteur', '18 personnes'],
      ['27/05', 'CSB-114', 'Presque-accident (chute mineur)', 'Garde-corps ajouté'],
    ] },
    { type: 'note', text: 'Zéro accident avec arrêt ce mois — objectif maintenu. Taux de fréquence en baisse. Plan d\'action : généraliser les garde-corps niveau supérieur sur CSB-114.' },
  ],
});

DEFS.R1 = () => ({
  code: 'R1', category: 'RH & Paie', title: 'Bordereau de paie ouvriers chantier',
  period: 'Période : mai 2026 · chantier CSB-114',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Ouvriers payés', value: '52' },
      { label: 'Heures normales', value: '5 680', unit: 'h' },
      { label: 'Heures supp.', value: '420', unit: 'h' },
      { label: 'Net à payer total', value: f(346000), highlight: true },
    ] },
    { type: 'section', title: 'Détail par ouvrier (extrait)', headers: ['Matricule', 'Nom', 'H. norm.', 'H. supp.', 'Brut', 'Retenues', 'Net'], rows: [
      ['O-101', 'M. Aït Hssaine', '208', '22', f(7180), f(1120), f(6060)],
      ['O-102', 'S. Berrada', '200', '18', f(6890), f(1070), f(5820)],
      ['O-201', 'A. Boutaleb', '208', '26', f(7700), f(1190), f(6510)],
      ['O-301', 'R. Bennani', '200', '12', f(5460), f(840), f(4620)],
      ['O-501', 'A. Chikhi', '208', '16', f(8260), f(1280), f(6980)],
    ], totalRow: ['TOTAL (52 ouvriers)', '', '5 680', '420', f(458000), f(112000), f(346000)] },
    { type: 'note', text: 'Modes de règlement : virement 62 %, chèque 24 %, espèces 14 %. Déclarations : CNSS au 8 juin, IR au 30 juin.' },
    { type: 'signatures', roles: ['Pointeur', 'Conducteur de travaux', 'DAF'] },
  ],
});

DEFS.C4 = () => ({
  code: 'C4', category: 'Chantier', title: 'Rapport hebdomadaire de chantier',
  period: 'Chantier CSB-114 · semaine 22 (24 au 28 mai 2026)',
  blocks: [
    { type: 'kpis', items: [
      { label: 'Avancement', value: '47', unit: '%' },
      { label: 'Effectif moyen', value: '142' },
      { label: 'Heures pointées', value: '6 100', unit: 'h' },
      { label: 'Incidents HSE', value: '1', sub: 'presque-accident' },
    ] },
    { type: 'section', num: 'I', title: 'Tâches exécutées', headers: ['Lot', 'Tâche', 'Avancement', 'État'], rows: [
      ['Gros œuvre', 'Coulage dalle niveau 4', '100 %', 'Fait'],
      ['Gros œuvre', 'Ferraillage voiles B3', '75 %', 'En cours'],
      ['Maçonnerie', 'Cloisons niveau 2', '60 %', 'En cours'],
      ['Étanchéité', 'Toiture-terrasse zone A', '100 %', 'Fait'],
    ] },
    { type: 'section', num: 'II', title: 'Livraisons & visites', headers: ['Date', 'Événement', 'Détail'], rows: [
      ['24/05', 'Livraison', 'Acier TOR 28 t (Sonasid)'],
      ['26/05', 'Livraison', 'BPE 280 m³ (CIMAR)'],
      ['26/05', 'Visite MOE', 'Voile B3 réceptionné conforme'],
    ] },
    { type: 'note', text: 'Météo favorable (26 °C moyen, 0 arrêt). Programme S23 : coffrage niveau 5, démarrage second œuvre niveau 1. Aucun retard sur le planning contractuel.' },
    { type: 'signatures', roles: ['Conducteur de travaux', 'Chef de chantier', 'Visa MOE'] },
  ],
});

Object.assign(window, { RAPPORT_DEFS: DEFS });
})();
