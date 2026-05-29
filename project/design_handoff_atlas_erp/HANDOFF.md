# Atlas·BTP ERP — Prompt de handoff pour Claude Code

> Ce document est un brief complet à fournir à Claude Code pour poursuivre le développement.
> Lire CLAUDE.md en premier pour les conventions techniques.

---

## Contexte

Tu reprends un prototype ERP BTP marocain (Atlas Constructions S.A.) construit en React 18 inline JSX (Babel standalone). Le prototype est fonctionnel avec 18+ modules, un design system complet, et des données de démo réalistes.

**Point d'entrée** : `erp.html`
**Conventions** : `CLAUDE.md` (à lire impérativement avant toute modification)

---

## CHANTIER 1 — Enrichir les modules secondaires

Les modules suivants existent mais sont moins denses que les modules principaux. Chacun doit être enrichi pour atteindre le même niveau de détail que `erp-achats.jsx` ou `erp-situations.jsx`.

### 1.1 Stock (`erp-stock.jsx` · ~306 lignes)

**Existant** : Liste articles par dépôt, seuils de réappro, catégories.

**À ajouter** :
- **Mouvements de stock** : tableau historique (entrée BR, sortie BS, transfert inter-dépôts, inventaire). Colonnes : date, type mouvement (Pill coloré), article, quantité, dépôt source/dest, opérateur, BC/BL lié.
- **Bon de sortie chantier** : modale formulaire — sélection dépôt source, chantier destination, articles (autocomplete depuis le catalogue), quantité, motif, demandeur, validation chef chantier.
- **Transfert inter-dépôts** : modale — dépôt source, dépôt destination, articles, quantité.
- **Inventaire physique** : vue spéciale — liste articles avec stock théorique, champ saisie stock réel, calcul écart automatique, motif d'écart, signature.
- **Alertes de seuil** : section en haut avec les articles sous seuil → bouton "Générer BC" qui pré-remplit une commande.
- **Valorisation stock** : KPI avec valeur totale du stock (Σ stock × PU), par catégorie.

### 1.2 Parc matériel (`erp-parc.jsx` · ~275 lignes)

**Existant** : Liste engins avec status, VGP, coût/jour, compteur.

**À ajouter** :
- **Fiche engin détaillée** : drawer ou vue détail — photo placeholder, infos techniques, historique d'affectation (timeline), compteur d'heures/km, coût cumulé, documents (carte grise, assurance, VGP).
- **Formulaire maintenance** : modale — type (préventive/curative/VGP), engin, date, prestataire, pièces remplacées, coût, durée immobilisation, observations.
- **Calendrier VGP** : vue calendrier ou timeline montrant les prochaines VGP à programmer, coloré par urgence (vert > 60j, ambre 15-60j, rouge < 15j).
- **Affectation engin** : modale — engin, chantier destination, date début, date fin prévisionnelle, conducteur attitré, taux horaire facturé au chantier.
- **Location externe** : sous-section — engins loués à/par des tiers, contrats en cours, coût vs achat, échéances retour.
- **KPIs enrichis** : taux d'utilisation moyen, coût/heure moyen, valeur totale du parc, heures de panne cumulées.

### 1.3 Planning (`erp-planning.jsx` · ~409 lignes)

**Existant** : Gantt multi-chantiers avec phases, jalons, charge d'équipe.

**À ajouter** :
- **Zoom / filtres** : boutons zoom (mois / trimestre / année), filtre par conducteur, par région, par statut.
- **Chemin critique** : mettre en surbrillance les tâches critiques (celles dont le retard impacte la livraison). Afficher en rouge les barres Gantt en retard.
- **Dépendances** : lignes de liaison entre phases dépendantes (flèches SVG).
- **Planning détaillé chantier** : clic sur un chantier → vue détaillée avec tâches WBS (2-3 niveaux), dates début/fin, % avancement, responsable.
- **Charge ressources** : histogramme empilé par semaine montrant la charge (nombre d'ouvriers) par chantier, avec ligne de capacité max.
- **Alertes planning** : section avec les chantiers en retard, les jalons à risque (< 15 jours et avancement insuffisant).

### 1.4 Sous-traitance (`erp-sous-traitance.jsx` · ~344 lignes)

**Existant** : Liste contrats ST, KPIs, détail contrat avec financier.

**À ajouter** :
- **Workflow DC4** : étapes visuelles (dépôt demande → vérification docs → envoi MOE → agrément → notification ST), avec statut par étape.
- **Situations sous-traitant** : tableau des décomptes mensuels du ST (comme les situations de l'entreprise mais côté paiement).
- **Paiement direct** : pour les marchés publics, workflow de paiement direct (le MOA paie directement le ST). Afficher le flux financier.
- **Évaluation sous-traitant** : formulaire de notation (qualité, délais, sécurité, réactivité) → note globale → historique.
- **Documents ST** : checklist docs obligatoires (attestation CNSS, RC pro, attestation fiscale, habilitations) avec statut et dates d'expiration.

### 1.5 Trésorerie (`erp-tresorerie.jsx` · ~312 lignes)

**Existant** : Comptes multi-banques, prévisionnel 8 semaines, flux, cautions.

**À ajouter** :
- **Rapprochement bancaire** : vue avec relevé importé vs écritures comptables, matching automatique, écarts à traiter.
- **Cautions détaillées** : workflow de caution (demande → émission banque → remise MOA → mainlevée). Alertes sur expirations.
- **Tableau des effets** : effets de commerce à échéance, classés par date, avec statut (en portefeuille, remis à l'encaissement, impayé).
- **Budget de trésorerie annuel** : vue 12 mois avec budget vs réalisé, variance.
- **Ligne de crédit** : affichage des facilités bancaires (découvert autorisé, escompte, Dailly) avec utilisation et disponible.
- **KPIs enrichis** : DSO (délai moyen de paiement clients), DPO (délai fournisseurs), BFR.

### 1.6 Marchés publics (`erp-marches.jsx` · ~233 lignes)

**Existant** : Veille AO, liste marchés attribués, KPIs.

**À ajouter** :
- **Dossier AO détaillé** : drawer avec checklist pièces (caution provisoire, CNSS, RC, attestation fiscale, note technique, offre financière), statut de chaque pièce, date de remise, responsable.
- **Comparaison offres** : tableau des concurrents connus (si info disponible post-ouverture des plis), avec classement.
- **Suivi post-attribution** : OS (ordre de service), avenants, pénalités de retard, révision de prix, réceptions.
- **Veille marchés** : intégration fictive avec portail des marchés publics marocain, alertes sur nouveaux AO par catégorie/région.
- **Garanties** : détail des cautions (provisoire → définitive → retenue de garantie → mainlevée) liées au marché.

---

## CHANTIER 2 — Version mobile / responsive

Le prototype est actuellement desktop-only (sidebar fixe 232px + contenu). Objectif : rendre l'ERP utilisable sur tablette (768px) et mobile (375px).

### Principes :
- **Mobile-first pour la navigation** : la sidebar devient un drawer off-canvas avec bouton hamburger.
- **Topbar** : simplifier — masquer la recherche (icône seule qui ouvre un overlay), masquer le sélecteur d'exercice.
- **Tables** : sur mobile, transformer les grids en cartes empilées (chaque ligne = une card). Sur tablette, masquer les colonnes non essentielles.
- **Modales** : `width: 100%` + `max-width` sur mobile, bottom-sheet style si possible.
- **KPI strips** : passer de `repeat(4-5, 1fr)` à `repeat(2, 1fr)` sur tablette, `1fr` sur mobile.
- **Ne pas casser le desktop** — ajouter des media queries ou du JS responsive, pas remplacer.

### Implémentation suggérée :
1. Ajouter un hook `useBreakpoint()` dans `erp-shared.jsx` :
```jsx
function useBreakpoint() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return { mobile: w < 768, tablet: w < 1024, desktop: w >= 1024 };
}
```
2. L'exposer via `window.useBreakpoint`.
3. Dans `erp-shell.jsx` : rendre la sidebar conditionnelle (drawer sur mobile/tablette).
4. Dans chaque écran : adapter les grid templates selon le breakpoint.

---

## CHANTIER 3 — Flux de bout en bout (E2E)

Actuellement, les actions "Créer" dans les modales affichent un toast de confirmation mais ne créent pas réellement l'entité dans les données. Objectif : connecter les flux entre eux via un store centralisé.

### 3.1 Store global

Créer `erp-store.jsx` avec un React Context global :

```jsx
const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [data, setData] = React.useState({
    chantiers: [...INITIAL_CHANTIERS],
    devis: [...INITIAL_DEVIS],
    factures: [...INITIAL_FACTURES],
    situations: [...INITIAL_SITUATIONS],
    bcs: [...INITIAL_BCS],
    clients: [...INITIAL_CLIENTS],
  });

  const addChantier = (c) => setData(d => ({ ...d, chantiers: [c, ...d.chantiers] }));
  const addDevis = (dv) => setData(d => ({ ...d, devis: [dv, ...d.devis] }));
  const addFacture = (f) => setData(d => ({ ...d, factures: [f, ...d.factures] }));
  const updateDevisStatus = (code, status) => { ... };
  const convertDevisToChantier = (devisCode) => { ... };
  // etc.

  return (
    <StoreContext.Provider value={{ data, addChantier, addDevis, ... }}>
      {children}
    </StoreContext.Provider>
  );
}
```

### 3.2 Flux à connecter

| Flux | Déclencheur | Résultat attendu |
|------|-------------|------------------|
| **Devis → Chantier** | Bouton "→ Chantier" sur un devis accepté | Crée un chantier pré-rempli avec les infos du devis, le devis passe en statut "Converti" |
| **Chantier → Situation** | Bouton "Nouvelle situation" sur une fiche chantier | Crée une situation liée au chantier, pré-charge le BPU |
| **Situation → Facture** | Bouton "Émettre facture" dans l'éditeur de situation | Crée une facture avec le montant net de la situation |
| **Devis → Facture** | Source "Depuis devis" dans la modale nouvelle facture | Pré-remplit le montant et l'objet depuis le devis |
| **BC → Réception** | Bouton "Enregistrer réception" sur un BC émis | Ouvre la modale réception, met à jour le stock à validation |
| **Réception → Stock** | Validation de la réception | Ajoute un mouvement d'entrée dans le stock |
| **Nouveau client** | Modale client dans Clients | Le client apparaît dans les selects de Devis/Facture |

### 3.3 Navigation contextuelle

Quand un flux crée une entité dans un autre module, naviguer automatiquement :
```jsx
// Après conversion devis → chantier :
window.location.hash = 'fiche-' + newChantierCode;
window.toast('Chantier ouvert depuis devis', 'success', newChantierCode);
```

### 3.4 Compteurs dynamiques

Les badges dans la sidebar (`badge: '34'` pour Chantiers, `badge: '7'` pour Achats) doivent refléter le nombre réel d'entités dans le store.

---

## CHANTIER 4 — Paie chantier (`erp-paie.jsx`)

Ce module est actuellement léger. L'enrichir avec :

- **Liste des ouvriers** : matricule, nom, catégorie, chantier affecté, CNSS, date embauche.
- **Saisie pointage mensuel** : grille jours × ouvriers (présent/absent/congé/AT) pour le mois en cours.
- **Calcul automatique** : heures normales, heures supplémentaires (25% / 50% / 100%), primes, brut → CNSS salariale (4,48%) → AMO salariale (2,26%) → IR (barème marocain) → net.
- **Bulletin de paie** : aperçu A4 individuel (utiliser `DocPreviewShell` + `PaperLetterhead`).
- **Bordereaux** : CNSS (DAMANCOM), AMO, IR — récapitulatifs mensuels.
- **Virement de masse** : génération d'un fichier de virement multi-bénéficiaires (format fictif).

---

## Priorités suggérées

1. **Store global** (CHANTIER 3.1) — fondation pour tout le reste
2. **Flux E2E** (CHANTIER 3.2-3.4) — donne vie au prototype
3. **Modules secondaires** (CHANTIER 1) — en parallèle, module par module
4. **Responsive** (CHANTIER 2) — après stabilisation des modules
5. **Paie enrichie** (CHANTIER 4) — dernier car dépend du store

---

## Contraintes techniques rappelées

- Pas de bundler, pas de npm, pas de Node — tout est inline JSX + Babel standalone.
- React 18.3.1 pinné avec intégrité SRI (voir `erp.html`).
- Polices Google Fonts : Manrope, IBM Plex Sans, IBM Plex Mono (déjà chargées).
- Couleurs : TOUJOURS `TOKENS.*` — jamais de couleurs en dur.
- Export composants : TOUJOURS `Object.assign(window, { ... })`.
- Nommage fichiers : `erp-<module>.jsx` — un fichier = un module.
- Max ~800 lignes par fichier — split si nécessaire.
- Langue UI : français, contexte BTP marocain.
- Données : en dur (pas de backend) — données réalistes Maroc.

---

## Commande de démarrage

```bash
# Lire le guide technique
cat CLAUDE.md

# Comprendre l'architecture
ls *.jsx | head -30

# Commencer par le store global
# → Créer erp-store.jsx
# → Migrer les données seed de chaque module vers le store
# → Wrapper <App> dans <StoreProvider>
# → Connecter le premier flux : Devis → Chantier
```
