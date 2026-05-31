# Refonte UX/UI — Atlas·BTP ERP
### Audit & re-conception orientés PME BTP marocaine

> Document de cadrage **avant toute modification technique**.
> Méthode : analyse de l'état réel des écrans (code source) → problèmes UX → simplification → nouvelle arborescence → parcours → wireframes → priorisation.
> Cible : **PME BTP marocaine** (10–200 salariés, 5–35 chantiers actifs, patron qui suit son cash, chefs de chantier sur le terrain).

---

## 0. Synthèse exécutive

Le prototype actuel est **visuellement excellent** mais **calibré comme un ERP de grand groupe** : densité d'information très haute (35 à 150 « briques » par écran), workflows multi-niveaux, jargon comptable, et beaucoup d'écrans pensés pour un usage **bureau** alors que la moitié des utilisateurs réels sont **sur chantier, sur mobile, pressés**.

**Les 5 leviers de la refonte :**

| # | Levier | Principe |
|---|--------|----------|
| 1 | **Hiérarchie de l'information** | Un écran = 1 question principale + 3 chiffres max en tête. Le détail se déplie, il ne s'impose pas. |
| 2 | **Mobile-first sur le terrain** | Pointage, réception, photos, validation = pensés d'abord pour le pouce, pas pour la souris. |
| 3 | **Moins de jargon** | « Net à facturer », « Déboursé sec », « DC4 » → traduits ou masqués derrière un mode « expert ». |
| 4 | **Workflows courts** | Validation 1–2 niveaux par défaut (pas 3). Actions directes plutôt que modales de confirmation. |
| 5 | **Le cash d'abord** | Pour le patron PME, la question n°1 est *« qui me doit de l'argent et qui dois-je payer ? »*. La trésorerie remonte au premier plan. |

**Règle d'or de densité** : *si un écran affiche plus de 7 chiffres « durs » au-dessus de la ligne de flottaison, il est trop chargé pour une PME.*

---

## 1. Personas & contextes d'usage

Toute la refonte est priorisée selon **qui utilise quoi, où, et dans quel état d'esprit**.

| Persona | Rôle | Appareil | Fréquence | Besoin n°1 |
|---------|------|----------|-----------|------------|
| **Karim — le patron** | Gérant / DG | Bureau + mobile | Tous les jours, 5 min | « Mon cash, mes retards, ce que je dois valider » |
| **Hicham — chef de chantier** | Terrain | **Mobile uniquement** | Tous les jours | Pointer, demander du matériel, signaler |
| **Samira — conductrice de travaux** | Pilotage | Bureau + tablette | Plusieurs fois/jour | Avancement, situations, achats |
| **Rachid — magasinier** | Dépôt/base-vie | **Mobile/tablette** | Tous les jours | Réceptionner, sortir du stock |
| **Nadia — compta/admin** | Back-office | Bureau | Tous les jours | Factures, paie, déclarations, trésorerie |

**Insight clé** : 3 personas sur 5 sont **terrain/mobile**. Le prototype actuel les sert mal (tableaux 7 colonnes, saisie inline de 45 lignes, modales denses).

---

## 2. Problèmes transversaux (valables sur tous les modules)

Identifiés de façon récurrente dans l'analyse du code :

### 2.1 Densité excessive
- **Dashboard** : 35–45 blocs simultanés, 4 KPI à sparklines + 4 alertes + 3 tableaux + 3 colonnes.
- **Pointage** : 45 ouvriers × 7 colonnes = 300+ cellules, 90 champs éditables, 9 filtres.
- **Achats** : jusqu'à 130 points de données avec le panneau de détail ouvert.
- **Études** : panneau résultat à 80–100 points de données.

### 2.2 Tableaux non responsive
Partout : grilles `gridTemplateColumns` à 5–8 colonnes fixes. Sur mobile, illisibles. Aucun passage en « cartes empilées » sur petit écran (le hook `useBreakpoint` existe mais n'est pas exploité dans les écrans de données).

### 2.3 Jargon non traduit
`Déboursé sec`, `FC 8% / FG 6%`, `Net à facturer`, `DC4`, `BDS`, `VGP`, `Retenue de garantie`, `attente-dg`. Pertinent pour un expert, opaque pour un chef de chantier ou un jeune patron.

### 2.4 Boutons décoratifs (dette de confiance)
Beaucoup d'actions affichent un `toast` mais ne font rien (« Historique », « Exporter BDS », « Réinitialiser », « Rapprocher la facture »…). En l'état c'est un prototype ; en refonte il faut **soit câbler, soit masquer** — un bouton qui ne fait rien érode la confiance.

### 2.5 Workflows trop longs
Achats à 3 niveaux d'approbation (Conducteur → Chef centre → Direction), seuil arbitraire à 800 K DH. Sous-traitance DC4 à 5 étapes. Pour une PME, 1–2 niveaux suffisent dans 90 % des cas.

### 2.6 Pas d'état « mobile terrain »
Aucun écran « light » pour le chef de chantier : il devrait avoir une vue ultra-simplifiée (pointer / demander / signaler), pas l'ERP complet.

---

## 3. Audit module par module

Chaque module suit la même structure :
**(A)** problèmes UX · **(B)** infos à retirer/simplifier · **(C)** nouvelle organisation · **(D)** parcours optimal · **(E)** wireframe · **(F)** priorité PME.

---

### 3.1 — TABLEAU DE BORD

**(A) Problèmes UX**
- 10 KPI + 4 alertes + 3 tableaux + 3 colonnes = surcharge cognitive immédiate.
- Sparklines sur chaque KPI : jolies mais peu actionnables pour une PME.
- 2 modales « grand groupe » peu utilisées en PME : *Rapport hebdomadaire MOE* et *Tournée des chantiers* (itinéraire Waze, 260 km/jour — irréaliste pour un patron PME).
- Mélange de 3 niveaux de lecture (stratégique = CA/marge, opérationnel = pointage, administratif = cautions) sans hiérarchie claire.
- KPI « Créances > 60J » et « Engagements en cours » = vocabulaire financier de DAF.

**(B) Infos à retirer / simplifier**
- ❌ Sparklines sur les 4 KPI → remplacer par chiffre + flèche delta.
- ❌ Modale *Tournée des chantiers* → hors usage PME.
- ⚠️ Modale *Rapport hebdo* → garder mais simplifier (1 chantier, 1 clic, PDF).
- ⚠️ « Engagements en cours » → renommer « Commandes en cours » ou retirer.
- ⚠️ Journal d'activité 6 lignes temps réel → réduire à 3, ou déplacer en bas.

**(C) Nouvelle organisation (3 zones, pas 8)**
1. **Bandeau « Ce qui demande VOTRE attention »** (le plus haut) : nombre d'éléments à valider + montant, retards de paiement, cautions qui expirent < 30 j. Cliquable → va à l'action.
2. **3 chiffres clés** (pas 4, pas de sparkline) : *Cash encaissé ce mois* · *À encaisser (dont retard)* · *Marge moyenne*.
3. **2 listes courtes** : *Chantiers à surveiller* (uniquement ceux en retard/dépassement, 3–4 max) + *À valider* (file d'attente avec ✓/✗).

**(D) Parcours optimal**
> Karim ouvre l'app le matin → voit en 5 secondes « 3 choses demandent ton attention, 23 M DH à relancer » → tape sur « valider » → approuve 2 BC → tape sur un chantier en rouge → fiche chantier. **Fini en 90 secondes.**

**(E) Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│  Bonjour Karim — vendredi 31 mai                        │
│                                                         │
│  ⚠️  3 CHOSES DEMANDENT VOTRE ATTENTION                  │
│  ┌───────────────┬───────────────┬──────────────────┐  │
│  │ 2 BC à valider│ 23,1 M à      │ 1 caution expire │  │
│  │ → 501 K DH    │ relancer >60j │ dans 18 j (BMCE) │  │
│  └───────────────┴───────────────┴──────────────────┘  │
│                                                         │
│  💰 CASH                                                 │
│  Encaissé mai      À encaisser        Marge moy.        │
│  47,8 M ▲12%       198 M (23 retard)  14,2 %            │
│                                                         │
│  🏗  CHANTIERS À SURVEILLER          📋 À VALIDER        │
│  ● AGD-033  budget +7% 🔴            BC ferraille 412K ✓✗│
│  ● RBT-208  OS n°14 non signé 🔴     Loc. grue 89K    ✓✗│
│  ● TNG-061  CNSS sous-trait. 🟠      Situation n°6   ✓✗│
│                                          [voir tout →]  │
└─────────────────────────────────────────────────────────┘
```

**(F) Priorité PME : 🔴 CRITIQUE** — c'est l'écran d'accueil quotidien du patron. Maquette HTML prioritaire.

---

### 3.2 — FACTURATION

**(A) Problèmes UX**
- Déjà bien orienté « patron » (KPI cash, pipeline visuel) — **le meilleur module actuel**.
- Mais 4 KPI TTC + pipeline + 3 onglets + tableau + panneau détail = encore dense.
- Statuts de relance à 3 niveaux (Relance 1/2/3 + Mise en demeure) = beaucoup de granularité.
- Le lien **devis → facture** vient d'être ajouté (✅) mais le module « Études » a aussi ses devis → risque de **double source de vérité** sur les devis.

**(B) Infos à retirer / simplifier**
- ⚠️ Fusionner conceptuellement les **devis** : ils vivent dans « Études » ET « Facturation ». Choisir un seul lieu (recommandé : Études crée, Facturation consomme).
- ⚠️ 3 niveaux de relance → 2 suffisent (« À relancer » / « En retard grave »).
- ✅ Garder les KPI cash — ils sont justes.

**(C) Nouvelle organisation**
1. **3 KPI cash** : *Encaissé ce mois* · *En attente* · *En retard* (le 4e « à 7 jours » fusionne avec « en attente »).
2. **Pipeline simplifié** : Devis acceptés → Factures émises → Encaissées (3 colonnes, montants).
3. **Une seule liste filtrable** : toutes les factures, filtre par chip (À encaisser / Retard / Payées).
4. **Action contextuelle forte** : sur une facture en retard → bouton « Relancer » (SMS/email/WhatsApp).

**(D) Parcours optimal**
> Nadia veut savoir qui doit payer → onglet « En retard » → 3 factures → tape « Relancer » sur chacune → modèle de message pré-rempli → envoyé. Le patron, lui, regarde juste les 3 chiffres cash.

**(E) Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│  Facturation                         [+ Nouvelle facture]│
│  ┌────────────┬────────────┬──────────────────────────┐ │
│  │ Encaissé   │ En attente │ ⚠️ En retard              │ │
│  │ 1,2 M ▲    │ 3,4 M      │ 540 K (3 factures) 🔴     │ │
│  └────────────┴────────────┴──────────────────────────┘ │
│                                                         │
│  [Toutes] [À encaisser] [Retard] [Payées]              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ FA-26-034  Al Andalous   38,9K  retard 6j  [Relancer]│
│  │ FA-26-033  M. Idrissi    72,0K  retard 16j [Relancer]│
│  │ FA-26-038  El Manar     142,0K  échoir 26j  [Voir]  │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**(F) Priorité PME : 🔴 CRITIQUE** — le nerf de la guerre (cash). Maquette HTML prioritaire.

---

### 3.3 — POINTAGE

**(A) Problèmes UX** *(le plus gros problème du prototype)*
- **45 ouvriers détaillés sur une seule page**, 7 colonnes, 90 champs éditables inline → **impraticable sur mobile**, alors que c'est LE module terrain par excellence.
- 9 filtres (3 états + 6 métiers) : un chef de chantier ne filtre jamais par métier pour pointer.
- Saisie d'heures libres (0–12 h normales, 0–6 h supp.) → en réalité BTP : présent (8 h) / absent, point.
- Heures supp. mélangées au pointage (c'est de la **paie**, pas du pointage).
- Motifs d'absence affichés mais **non saisissables** (données en dur).
- État « clôturé » verrouille la logique mais **pas visuellement** l'interface.

**(B) Infos à retirer / simplifier**
- ❌ Les 6 filtres métier → supprimer de la saisie (utiles seulement en rapport RH).
- ❌ Inputs heures supp. inline → déplacer vers la paie.
- ❌ Avatars colorisés sur 45 lignes → bruit visuel.
- ❌ Footer dark 4-colonnes → 1 chiffre suffit (« 42 présents, 405 h »).
- ✅ Ajouter : saisie réelle du motif d'absence.

**(C) Nouvelle organisation — MOBILE-FIRST**
1. **En-tête minimal** : chantier + date + « 42/45 présents ».
2. **Liste pointage = cartes tappables** : photo/initiale + nom + **un seul gros bouton « Présent / Absent »** (toggle pouce). Pas de tableau.
3. **Présence par défaut « présent »** : le chef ne marque QUE les absents (gain de temps énorme).
4. **Absent → mini-sélecteur motif** (maladie / congé / injustifié) qui apparaît.
5. **Heures supp.** : écran séparé optionnel, accessible seulement si besoin.
6. **1 bouton « Clôturer »** → verrouille visuellement (overlay).

**(D) Parcours optimal**
> Hicham arrive sur le chantier à 7 h. Ouvre « Pointage » sur son téléphone. La liste est déjà « tout présent ». Il tape sur les 3 absents → choisit « maladie / congé ». Tape « Clôturer ». **30 secondes, 3 taps.** Les données partent à la paie.

**(E) Wireframe (mobile)**
```
┌─────────────────────┐
│ CSB-114 · Jeu 28 mai│
│ 42 / 45 présents    │
│ ─────────────────── │
│ 👤 M. Aït Hssaine   │
│    Coffreur  [✓ Présent] │
│ ─────────────────── │
│ 👤 S. Berrada       │
│    Coffreur  [✗ Absent ▾]│
│      └ motif: maladie│
│ ─────────────────── │
│ 👤 A. Boutaleb      │
│    Ferraill. [✓ Présent] │
│ ...                 │
│ ─────────────────── │
│ [   CLÔTURER (3 abs)]│
└─────────────────────┘
```

**(F) Priorité PME : 🔴 CRITIQUE** — usage quotidien terrain, aujourd'hui inutilisable sur mobile. Maquette HTML prioritaire (en version mobile).

---

### 3.4 — ÉTUDE DE PRIX / BPU

**(A) Problèmes UX**
- Simulateur 5 étapes **dense** : 26 boutons toggles + 2 sliders sur un panneau de 440 px, panneau résultat à 80–100 points de données.
- 8 types de projet, 9 lots, 6 régions à facteurs précis (×1.00, ×1.05…) → granularité « bureau d'études », pas « patron qui chiffre vite ».
- Benchmark marché à 3 seuils fixes (6k/10k/14k DH/m²) → peut décourager si on n'y rentre pas.
- Beaucoup d'actions finales non câblées (Réinitialiser, Convertir en BPU, Sauver…).

**(B) Infos à retirer / simplifier**
- ⚠️ Sliders « marge cible » et « délai » → la PME applique une marge fixe (15–20 %) : pré-réglée, repliée par défaut.
- ⚠️ 9 lots → proposer 4 lots « gros » par défaut (Terrassement / Gros œuvre / Second œuvre / Finitions), détail en option.
- ⚠️ Facteurs régionaux affichés → masquer le ×facteur, garder juste le nom de ville.
- ✅ Garder le résultat « gros chiffre » (estimation HT) — c'est la valeur.

**(C) Nouvelle organisation**
1. **Mode « Express »** (par défaut) : 3 questions seulement → Type · Surface · Ville → **estimation immédiate**.
2. **Mode « Détaillé »** (déplié si besoin) : lots, finitions, marge, benchmark.
3. **Résultat = 1 grand chiffre + 1 fourchette** (« entre X et Y »), puis détail repliable.
4. **1 action claire** : « Transformer en devis » → génère le PDF.

**(D) Parcours optimal**
> Samira reçoit un appel : « combien pour une villa R+1 de 280 m² à Casa ? » → Express → Villa R+1 / 280 / Casablanca → « ≈ 2,1 M DH HT » en 3 taps → « Envoyer le devis » → PDF prêt. Détail des lots seulement si le client creuse.

**(E) Wireframe**
```
┌─────────────────────────────────────────┐
│  Chiffrage express        [Mode détaillé]│
│  ① Type     [Villa R+1 ▾]                │
│  ② Surface  [====●====] 280 m²           │
│  ③ Ville    [Casablanca ▾]               │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  ESTIMATION                        │ │
│  │  ≈ 2,10 M DH HT                    │ │
│  │  fourchette 1,95 – 2,30 M          │ │
│  │  ~7 500 DH/m²                      │ │
│  │           [Transformer en devis →] │ │
│  └────────────────────────────────────┘ │
│  ▸ Voir le détail par lot               │
└─────────────────────────────────────────┘
```

**(F) Priorité PME : 🟠 IMPORTANTE** — chiffrage rapide = beaucoup d'affaires gagnées/perdues. Maquette HTML secondaire.

---

### 3.5 — ACHATS

**(A) Problèmes UX**
- Workflow d'approbation **3 niveaux** (Conducteur → Chef centre → Direction si ≥ 800 K) → friction sur les petits achats.
- 8 statuts distincts + timeline 7 étapes → visuellement lourd.
- 3 surfaces parallèles (panneau détail + modale comparatif + modale nouvelle DA).
- Bloc « Top fournisseurs » avec score qualité 88–99 % → peu actionnable.
- Comparatif prix à 8 colonnes (PU, rabais, délai, CNSS…) → sur-outillé pour une PME qui négocie 2–3 devis.

**(B) Infos à retirer / simplifier**
- ⚠️ Workflow → **2 niveaux par défaut** (Demandeur → Patron/Direction), 3e niveau seulement au-delà d'un seuil configurable.
- ⚠️ 8 statuts → 4 (À valider / Commandé / Reçu / Facturé).
- ⚠️ Colonne « CNSS » et score qualité dans le comparatif → mode expert.
- ⚠️ Bloc Top fournisseurs → déplacer dans un onglet « Fournisseurs » dédié.

**(C) Nouvelle organisation**
1. **3 chips d'état** en haut : *À valider (montant)* · *En livraison* · *Engagé ce mois*.
2. **Une liste BC** filtrable, ligne = désignation + chantier + montant + statut + action.
3. **Détail en panneau léger** : qui demande, combien, pour quel chantier, + 1 bouton d'action selon l'état.
4. **Comparatif prix = optionnel**, accessible depuis une DA (« comparer 3 devis »).

**(D) Parcours optimal**
> Hicham (chantier) : « il me faut 28 t de ferraille » → DA en 3 champs → part en validation.
> Karim (patron) : notif « BC 412 K à valider » → voit désignation + chantier + montant → ✓. **2 taps.**

**(E) Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│  Achats                                   [+ Demande]    │
│  ┌────────────┬────────────┬──────────────────────────┐ │
│  │ À valider  │ En livraison│ Engagé mai               │ │
│  │ 3 · 612 K  │ 5 BC        │ 4,8 M DH                 │ │
│  └────────────┴────────────┴──────────────────────────┘ │
│  [À valider] [Commandés] [Reçus] [Tous]                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Ferraille TOR 28t · CSB-114 · 412K  [✓ Valider] │   │
│  │ Location grue 60m · RBT-208 · 89K   [✓ Valider] │   │
│  │ BPE 25 · 120m³ · TNG-061 · 156K     Commandé    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**(F) Priorité PME : 🟠 IMPORTANTE** — fréquent, mais le workflow à simplifier est le vrai sujet. Maquette HTML secondaire.

---

### 3.6 — SOUS-TRAITANCE

**(A) Problèmes UX**
- Workflow **DC4 à 5 étapes** (dépôt → vérif docs → envoi MOE → agrément MOA → notification ST), chaque étape avec un responsable différent → process marché public lourd, surdimensionné pour de la sous-traitance privée courante.
- **Double système de statut** redondant : `status` (cours/agrément/réception/litige) ET `dc4` (agree/depose/attente) se recoupent → confusion sur « où en est ce contrat ».
- Panneau détail très chargé : 8 blocs scrollables (identité + infos + financier + stepper 5 étapes + situations ST + checklist docs + actions).
- **Concepts affichés mais non opérationnels** : badge « Paiement direct (loi 13-83) » sans aucune UI pour le gérer ; **mainlevée des retenues de garantie absente** (vrai risque de trésorerie PME : retenues jamais restituées).
- Alertes statiques (texte en dur) sans date/priorité/responsable.

**(B) Infos à retirer / simplifier**
- ⚠️ DC4 complet → afficher uniquement en **mode marché public** ; en sous-traitance privée, un contrat simple (3 états : à agréer / en cours / soldé) suffit.
- ⚠️ Fusionner `status` + `dc4` en **un seul statut lisible**.
- ⚠️ Checklist documents (CNSS, fiscale, RC pro, habilitations) → garder (vrai besoin légal marocain) mais en **feux tricolores** compacts.
- ✅ **Ajouter** ce qui manque vraiment : suivi des **retenues de garantie** et de leur **mainlevée** (impact cash direct).
- ✅ Ajouter une vue agrégée « **volume par sous-traitant** » (SOTRAVO apparaît sur 2 contrats sans total consolidé).

**(C) Nouvelle organisation**
1. **3 chips d'état** : *En cours (montant)* · *À agréer* · *⚠️ Litiges / retenues à libérer*.
2. **Liste contrats** : lot + sous-traitant + chantier + avancement + reste à payer + 1 feu (docs OK / manquants).
3. **Détail allégé** : identité ST, financier (avec **retenue + date de mainlevée prévue**), checklist docs en feux, 1 action principale selon l'état.
4. **DC4** replié par défaut, déplié seulement si marché public.

**(D) Parcours optimal**
> Samira veut payer SOTRAVO : ouvre le contrat → voit « exécuté 72 %, payé 60 %, retenue 7 % (152 K à libérer à réception) » → « Établir situation ST » → montant net calculé → validé. Le patron voit juste « 1 litige, 340 K de retenues à libérer ce trimestre ».

**(E) Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│  Sous-traitance                        [+ Nouveau contrat]│
│  ┌────────────┬────────────┬──────────────────────────┐ │
│  │ En cours   │ À agréer   │ ⚠️ Litiges / retenues     │ │
│  │ 7 · 38 M   │ 2 contrats │ 1 litige · 340K à libérer │ │
│  └────────────┴────────────┴──────────────────────────┘ │
│  [En cours] [À agréer] [Litiges] [Tous]                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Étanchéité · SOTRAVO · CSB-098                   │   │
│  │ ████████░░ 72%  reste 0,87M  docs ✅  [Situation]│   │
│  │ Façade alu · ALUM · AGD-033          docs 🔴     │   │
│  │ ░░░░░░░░░░ 8%   ⚠️ DC4 non agréé     [Agréer]   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**(F) Priorité PME : 🟡 SECONDAIRE** (🟠 IMPORTANTE si l'entreprise est orientée marchés publics ou sous-traite beaucoup — la gestion des retenues devient alors un vrai sujet cash).

---

### 3.7 — STOCK

**(A) Problèmes UX**
- Module enrichi récemment : alertes ruptures, bons de sortie, transferts, inventaire — **fonctionnellement riche**.
- Risque : multiplication des modales (sortie / transfert / inventaire) → 3 portes d'entrée à clarifier.
- Tableaux d'articles par dépôt = denses sur mobile (le magasinier est sur tablette).

**(B) Infos à retirer / simplifier**
- ⚠️ Valorisation stock par catégorie → utile au patron, pas au magasinier : à isoler.
- ✅ Garder les alertes de seuil (très actionnables) en tête.

**(C) Nouvelle organisation**
1. **Alertes en haut** : « 4 articles sous seuil → Générer BC ».
2. **2 actions terrain énormes** : « Sortie chantier » · « Réception » (gros boutons tablette).
3. **Liste articles** par dépôt, recherche en premier.
4. **Inventaire** = mode dédié, hors du flux quotidien.

**(D) Parcours optimal**
> Rachid : un chef demande du ciment → « Sortie chantier » → scanne/choisit l'article → quantité → chantier → validé. Le stock se décrémente, l'alerte se déclenche si seuil franchi.

**(E) Wireframe**
```
┌───────────────────────────────────────┐
│  Stock — Dépôt base-vie CSB           │
│  🔴 4 articles sous seuil  [Générer BC]│
│  ┌─────────────┬─────────────────────┐│
│  │ ⬇ Sortie     │ ⬆ Réception         ││
│  │   chantier   │                     ││
│  └─────────────┴─────────────────────┘│
│  🔍 [Rechercher un article...]        │
│  Ciment CPJ45      120 sacs   ⚠️ bas   │
│  Acier TOR 12      8,2 t      ok       │
│  Parpaing 20       3 400 u    ok       │
└───────────────────────────────────────┘
```

**(F) Priorité PME : 🟡 SECONDAIRE** (🟠 si l'entreprise gère de vrais dépôts).

---

### 3.8 — PARC MATÉRIEL

**(A) Problèmes UX**
- Enrichi récemment : fiche engin, maintenance, affectation, calendrier VGP — **complet**.
- Risque de complexité : VGP, taux horaire facturé, location externe, heures de panne = beaucoup de concepts.
- Calendrier VGP coloré = bon, mais la PME pense surtout « quel engin est où, et lequel est en panne ».

**(B) Infos à retirer / simplifier**
- ⚠️ « Taux horaire facturé au chantier », « heures de panne cumulées », « location externe » → mode gestion fine, pas en première vue.
- ✅ Garder : statut engin (dispo / sur chantier / panne / maintenance) + prochaines VGP.

**(C) Nouvelle organisation**
1. **Vue « parc en un coup d'œil »** : chaque engin = carte avec statut couleur + chantier actuel.
2. **Alerte VGP** en tête (« 2 VGP à programmer < 15 j »).
3. **Détail engin** au clic (historique, docs) — déjà bien fait.

**(D) Parcours optimal**
> Samira : « où est la grue 3 ? » → vue parc → carte « Grue 60m · CSB-114 · dispo » → clic → historique. Le patron voit juste « 2 engins en panne, 2 VGP à faire ».

**(F) Priorité PME : 🟡 SECONDAIRE** (🟠 si parc important).

---

### 3.9 — TRÉSORERIE

**(A) Problèmes UX**
- Enrichi récemment : 4 onglets (comptes / prévisionnel / budget 12 mois / rapprochement) + cautions + effets + DSO/DPO.
- **Le plus « DAF » de tous les modules** : DSO, DPO, BFR, rapprochement bancaire, effets de commerce → vocabulaire et outils de directeur financier.
- Or, pour le **patron PME**, la trésorerie est LA question n°1 — mais formulée simplement : *« combien j'ai, combien je vais avoir, qu'est-ce qui coince ? »*.

**(B) Infos à retirer / simplifier**
- ⚠️ DSO / DPO / BFR → mode expert (ou tooltip pédagogique).
- ⚠️ Rapprochement bancaire → c'est un travail de compta, à isoler dans un onglet « Compta ».
- ⚠️ Effets de commerce → garder mais derrière « Encaissements à venir ».
- ✅ Mettre en avant : **solde aujourd'hui · prévision à 4 semaines · cautions qui expirent**.

**(C) Nouvelle organisation**
1. **Le chiffre roi** : solde de trésorerie consolidé aujourd'hui.
2. **Courbe prévisionnelle 8 semaines** (entrées vs sorties) — déjà présente, à mettre au centre.
3. **2 listes** : *encaissements attendus* (factures + effets) · *décaissements prévus* (paie, fournisseurs, échéances).
4. **Cautions** : bandeau d'alerte sur les expirations.
5. **Onglet « Compta »** séparé : rapprochement, budget 12 mois, ratios.

**(D) Parcours optimal**
> Karim, dimanche soir : ouvre Trésorerie → « 8,4 M aujourd'hui, mais creux à -1,2 M dans 3 semaines (paie + échéance CIMAR) » → décide de relancer 2 gros clients. **La décision en 1 écran.**

**(E) Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│  Trésorerie                          [Comptes][Compta »] │
│  SOLDE AUJOURD'HUI                                       │
│  8,42 M DH   (BMCE 4,1 · Attijari 3,0 · BP 1,3)        │
│                                                         │
│  Prévision 8 semaines                                   │
│   ▁▃▅▇▆▅▃▁  ⚠️ creux S+3 : −1,2 M                       │
│                                                         │
│  ENTRÉES attendues          SORTIES prévues             │
│  El Manar    142K  5 juin   Paie mai    1,9M  30 mai    │
│  Effet Idriss 72K  12 juin  CIMAR       560K  8 juin    │
│  STÉ Maroc   218K  19 juin  Sous-trait. 340K  15 juin   │
│                                                         │
│  ⚠️ Caution BMCE expire dans 18 j — 4,2 M DH            │
└─────────────────────────────────────────────────────────┘
```

**(F) Priorité PME : 🔴 CRITIQUE** — question n°1 du patron. Maquette HTML prioritaire.

---

### 3.10 — RAPPORTS

**(A) Problèmes UX**
- **26 rapports catalogués** avec une nomenclature interne codée (F1→F8, C1→C9, R1→R7, L1→L3) → **opaque** : un patron PME ne sait pas que « C8 » = ses dépenses de chantier.
- Seulement **5–8 templates réellement construits** sur 26 → beaucoup de cartes mènent à du vide (dette de confiance).
- **Redondances** confirmées : F7 (balance âgée) ↔ F3 (créances) ; R3 (IR salaires) ⊂ R6 (charges sociales) ; R4 (heures) ≈ R7 (productivité) ; F5 (cautions) ↔ déjà en trésorerie.
- Jargon comptable/fiscal lourd : C7 « Sous-détail de prix » (déboursé sec, FG, FC), DGD, prorata TVA — niche CCAG.
- Densité hub : jusqu'à 33 cartes-rapports si on déroule les 4 catégories.

**(B) Infos à retirer / simplifier**
- ❌ Réduire le catalogue de **26 à ~10 rapports réellement utiles** à une PME, et **masquer/fusionner** les redondants (F7, R3, R4, F5).
- ⚠️ Renommer en clair : `C8` → « Dépenses du chantier », `R6` → « Charges sociales du mois », `F4` → « Trésorerie 13 semaines », `C4` → « Rapport de chantier hebdo ».
- ⚠️ Réorganiser **par destinataire** plutôt que par code interne.
- ⚠️ Mode « expert » pour les rapports techniques (C7, DGD, sous-détails).

**(C) Nouvelle organisation — par destinataire, pas par code**
1. **Recherche en haut** (« de quoi as-tu besoin ? »).
2. **4 familles par usage** :
   - 🏦 **Pour la banque** : situation financière, trésorerie, cautions.
   - 👷 **Pour le client / MOE** : situation mensuelle, avancement, rapport hebdo.
   - 💰 **Pour moi (patron)** : marge par chantier, dépenses, compte d'exploitation.
   - 🏛 **Pour l'administration** : CNSS/DAMANCOM, IR, TVA.
3. **Chaque rapport = 1 carte avec nom clair + 1 bouton « Générer »** (PDF/Excel). Pas de carte sans template.

**(D) Parcours optimal**
> Nadia, fin de mois : onglet « Pour l'administration » → « CNSS du mois » → Générer → PDF DAMANCOM prêt. Le patron va dans « Pour moi » → « Marge par chantier » → voit ses 3 chantiers déficitaires.

**(E) Wireframe**
```
┌─────────────────────────────────────────────────────────┐
│  Rapports          🔍 [De quoi avez-vous besoin ?]       │
│                                                         │
│  🏦 POUR LA BANQUE                                       │
│   [Situation financière] [Trésorerie 13 sem] [Cautions] │
│  👷 POUR LE CLIENT / MOE                                 │
│   [Situation mensuelle] [Avancement] [Rapport hebdo]    │
│  💰 POUR MOI                                             │
│   [Marge par chantier] [Dépenses chantier] [Exploit.]   │
│  🏛 POUR L'ADMINISTRATION                                │
│   [CNSS du mois] [IR salaires] [Déclaration TVA]        │
│                                                         │
│  Chaque carte → [Générer PDF] [Excel]                   │
└─────────────────────────────────────────────────────────┘
```

**(F) Priorité PME : 🟡 SECONDAIRE** — utile en fin de mois, mais le gain vient surtout du **renommage + dégraissage** (faible effort, bon impact), pas d'une refonte lourde.

---

### 3.11 — GESTION DOCUMENTAIRE (GED)

**(A) Problèmes UX**
- Enrichi récemment : recherche, upload (drag-drop), historique de versions par indice — **solide**.
- Arborescence chantier → dossiers → fichiers : claire, mais sur mobile l'arbre 230 px + liste 6 colonnes passe mal.
- Mélange GED documentaire + Audit HSE dans le même écran (toggle) → 2 métiers différents.

**(B) Infos à retirer / simplifier**
- ⚠️ Séparer **Audit HSE** dans son propre module (c'est de la conformité, pas de la GED).
- ✅ Garder recherche + versions (très bon).
- ⚠️ Colonne « indice » + statut → fusionner visuellement.

**(C) Nouvelle organisation**
1. **Recherche d'abord** (le doc se cherche, il ne se navigue pas).
2. **Récents** en tête (ce qu'on vient d'ajouter/consulter).
3. **Arbre chantier** repliable (drawer sur mobile).
4. **Upload = bouton flottant** toujours accessible.

**(D) Parcours optimal**
> Samira cherche le « PV réception voile B3 » → tape dans la recherche → trouve → ouvre/partage. Elle ne navigue jamais l'arbre.

**(F) Priorité PME : 🟡 SECONDAIRE.**

---

## 4. Priorisation globale (roadmap PME)

| Module | Priorité | Effort refonte | Gain PME | Maquette HTML |
|--------|----------|----------------|----------|---------------|
| **Tableau de bord** | 🔴 Critique | Moyen | Très élevé | ✅ Prioritaire |
| **Trésorerie** | 🔴 Critique | Moyen | Très élevé | ✅ Prioritaire |
| **Pointage (mobile)** | 🔴 Critique | Élevé | Très élevé | ✅ Prioritaire |
| **Facturation** | 🔴 Critique | Faible | Élevé | ✅ Prioritaire |
| **Études / BPU** | 🟠 Important | Moyen | Élevé | ⏳ Secondaire |
| **Achats** | 🟠 Important | Moyen | Moyen | ⏳ Secondaire |
| **Stock** | 🟡 Secondaire | Faible | Moyen | — |
| **Parc** | 🟡 Secondaire | Faible | Moyen | — |
| **Sous-traitance** | 🟡 Secondaire | Moyen | Faible–Moyen | — |
| **Rapports** | 🟡 Secondaire | Faible | Moyen | — |
| **GED** | 🟡 Secondaire | Faible | Faible | — |

**Séquence recommandée :**
1. **Vague 1 (le cash & le terrain)** : Tableau de bord, Trésorerie, Pointage mobile, Facturation.
2. **Vague 2 (gagner & acheter)** : Études express, Achats simplifiés.
3. **Vague 3 (le reste)** : Stock, Parc, Sous-traitance, Rapports, GED.

---

## 5. Maquettes HTML interactives

Les wireframes ci-dessus de la **Vague 1** sont déclinés en maquettes HTML cliquables dans le fichier **`refonte-maquettes.html`**, construites dans le design system Atlas existant (TOKENS, Manrope/IBM Plex) :

- **Tableau de bord** repensé (3 zones, plus de sparklines).
- **Trésorerie** orientée patron (solde + prévision + entrées/sorties).
- **Facturation** resserrée (3 KPI cash + liste avec relance).
- **Pointage mobile** (cartes tappables, présence par défaut, 3 taps).

> Ouvrir `refonte-maquettes.html` dans un navigateur — un sélecteur en haut permet de basculer entre les 4 écrans. La maquette Pointage s'affiche dans un cadre « téléphone » pour montrer l'usage terrain.

## 6. Prochaines étapes

- [x] **Vague 1 implémentée** :
  - Facturation — 3 KPI cash + relance en 1 clic (RelanceModal).
  - Tableau de bord — bandeau « attention » + KPI cash sans sparklines, Tournée retirée.
  - Trésorerie — KPI 6→4, onglets 4→3, DSO/DPO/budget/rapprochement regroupés sous « Compta ».
  - Pointage — vue mobile terrain (présence par défaut, motif, CTA collant), filtres métier retirés.
- [x] **Vague 2 implémentée** : Études simulateur express (3 questions) + Achats workflow 2 niveaux (KPI 5→3).
- [x] **Correctifs retours utilisateur** : exercice comptable réglable (barre + Paramètres synchronisés), flux simulateur réparé, éditeur de devis/facture à lignes (ajout/modif/suppression de postes, totaux en direct).
- [x] **Rapports** : moteur data-driven, 26 templates rendus, exports réels CSV/Excel/PDF (pagination A4).
- [x] **Vague 3 implémentée** : densité réduite Stock / Parc / Sous-traitance / GED (KPI dégraissés, toggle HSE redondant retiré).
- [ ] Valider ces écrans avec un utilisateur PME réel (un patron + un chef de chantier).
- [ ] Pistes restantes : aperçu A4 dans l'éditeur de devis · filtres de rapports (chantier/période) · mode mobile terrain transverse (réception, photos).

*Document généré le 31/05/2026 — Vagues 1, 2, 3 + gros chantiers implémentés le 31/05/2026.*
