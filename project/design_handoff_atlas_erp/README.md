# Handoff : Atlas·BTP ERP — Package développeur

## Vue d'ensemble

Atlas·BTP est un ERP complet pour le secteur BTP marocain (bâtiment et travaux publics). Il couvre la gestion de chantiers, devis, situations mensuelles, facturation, achats, stock, parc matériel, sous-traitance, trésorerie, marchés publics, paie, pointage, rapports, GED et audit HSE.

**Société de référence** : Atlas Constructions S.A. — Casablanca, Maroc.

---

## À propos des fichiers de design

Les fichiers de ce bundle sont des **prototypes de design créés en HTML/React inline** (JSX + Babel standalone). Ce ne sont PAS du code de production à copier tel quel. La tâche est de **recréer ces designs dans un vrai environnement de développement** (Next.js, Remix, Vite+React, ou tout framework adapté) en utilisant ses patterns et bibliothèques.

Le prototype actuel fonctionne sans backend — toutes les données sont en dur dans les fichiers JSX. En production, elles viendront d'une API / base de données.

---

## Fidélité

**High-fidelity (hifi)** — Les maquettes sont pixel-perfect avec couleurs finales, typographie, espacements, et interactions complètes (modales, drawers, toasts, filtres, tri, navigation). Le développeur doit recréer l'UI fidèlement en utilisant le design system documenté ci-dessous.

---

## Architecture des écrans

### Navigation (Sidebar — 6 groupes)

| Groupe | Écrans | Fichier source |
|--------|--------|----------------|
| **Pilotage** | Tableau de bord, Chantiers, Clients, Planning | `erp-dashboard.jsx`, `erp-chantiers.jsx`, `erp-clients.jsx`, `erp-planning.jsx` |
| **Production** | Pointage, Situations, Études de prix | `erp-pointage.jsx`, `erp-situations.jsx`, `erp-etudes.jsx` |
| **Achats & matériel** | Achats, Sous-traitance, Stock, Parc matériel | `erp-achats.jsx`, `erp-sous-traitance.jsx`, `erp-stock.jsx`, `erp-parc.jsx` |
| **Finance** | Facturation, Paie chantier, Trésorerie, Marchés publics | `erp-facturation.jsx`, `erp-paie.jsx`, `erp-tresorerie.jsx`, `erp-marches.jsx` |
| **Rapports** | Bibliothèque de rapports (11 templates) | `erp-rapports.jsx`, `erp-rapports-extra.jsx` |
| **Admin** | Documents/GED, Utilisateurs, Paramétrage | `erp-ged.jsx`, `erp-ged-hse.jsx`, `erp-users.jsx`, `erp-settings.jsx` |

### Écrans détaillés

#### 1. Tableau de bord (`erp-dashboard.jsx`)
- **5 KPI cards** en ligne (CA, factures impayées, retard chantier, heures pointées, trésorerie) avec sparklines
- **Strip d'alertes** : cautions expirantes, factures impayées, stock bas (cartes horizontales scrollables)
- **Table chantiers** : 7 chantiers avec avancement (progress bar), montant, conducteur, statut (Pill)
- **Validations en attente** : BC, situations, factures — avec boutons Valider/Rejeter fonctionnels
- **Cautions bancaires** : timeline avec jauges d'expiration
- **Pointage du jour** : breakdown par chantier (présent/absent)
- **Fil d'activité** : timeline chronologique des dernières actions

#### 2. Chantiers (`erp-chantiers.jsx`)
- **Vue liste / grille** commutable
- **Filtres** : statut (actifs/retard/réception/démarrage), région (Select), type (Select)
- **Recherche** textuelle
- **Tri** : avancement, montant, date fin
- **Modale "Nouveau chantier"** : type (Radio 4 options), code, intitulé, client, région, ville, conducteur, montant, dates
- **Fiche chantier** (`erp-fiche-chantier.jsx`) : onglets (Synthèse, Financier, Planning, Documents)

#### 3. Clients (`erp-clients.jsx`)
- **Liste avec filtres** par catégorie (tous/promoteurs/publics/industriels)
- **Fiche client** en drawer : infos, contacts, chantiers liés, historique financier
- **Modale création** complète avec upload logo fonctionnel (FileReader)

#### 4. Études de prix (`erp-etudes.jsx`)
- **Hub devis** : liste avec status (Brouillon/Envoyé/Accepté/Converti/Refusé), filtres, search
- **Simulateur 5 étapes** : type bâtiment → surface/finitions → lots techniques → récapitulatif → export
- **Bouton Aperçu** : ouvre un rendu A4 du devis via `DevisDocPreview`
- **Modale "Nouveau devis"** : choix méthode (simulateur/BPU/modèle), pré-remplissage

#### 5. Situations (`erp-situations.jsx`)
- **Liste** des situations mensuelles par chantier
- **Éditeur BPU** : tableau éditable poste par poste (quantité cumulée, prix unitaire, calcul automatique)
- **Preview A4** : document de situation pré-formaté
- **Modale "Nouvelle situation"** : type (mensuelle/avenant/DGD), chantier, période, paramètres retenues

#### 6. Facturation (`erp-facturation.jsx`)
- **3 onglets** : Factures, Devis, Encaissements
- **Panneau détail** facture avec timeline de relance
- **Bouton Aperçu A4** : rendu facture complet via `FactureDocPreview`
- **Modales** : Nouveau devis, Nouvelle facture (source libre/devis/situation)

#### 7. Achats (`erp-achats.jsx` + `erp-achats-reception.jsx`)
- **4 onglets** : À valider, Tous, Émis, Livraisons
- **Workflow BC** : brouillon → validation → émission → livraison → clôture
- **Comparatif prix** : modale multi-fournisseurs pour un même article
- **Réception magasin** : modale 960px avec BL, pointage article par article (attendu/livré/écart), checklist qualité 8 points, photos, impact comptable calculé
- **Modale "Nouveau BC"** avec articles, fournisseur, chantier

#### 8. Rapports (`erp-rapports.jsx` + `erp-rapports-extra.jsx`)
- **Hub bibliothèque** : 11 rapports classés par catégorie (Finance, Chantier, RH, Fiscal)
- **Templates A4 complètes** :
  - F1 : Compte d'exploitation par chantier
  - F2 : Marge brute comparative multi-chantiers
  - F3 : Situation financière globale (bilan simplifié)
  - C4 : Rapport hebdomadaire chantier (météo, effectif, tâches, incidents, livraisons)
  - C8 : Dépenses chantier détaillées
  - R1 : Bordereau de paie ouvriers (8 bulletins, charges sociales)
  - R6 : Charges sociales mensuelles
  - F4 : Échéancier trésorerie 13 semaines (courbe SVG, matrice flux)

#### 9. GED + Audit HSE (`erp-ged.jsx` + `erp-ged-hse.jsx`)
- **GED** : arborescence par chantier, dossiers, fichiers avec métadonnées
- **Audit HSE** :
  - KPI (conformité docs, jours sans AT, taux fréquence/gravité)
  - Matrice conformité 7 chantiers × 8 documents obligatoires (DUER, PPSPS, FDS, etc.)
  - Habilitations & certifications (couverture par type)
  - Registre incidents (AT / presque-accidents) avec gravité et actions correctives
  - Plan d'actions correctives & préventives (8 actions)
  - Calendrier audit annuel

#### 10. Utilisateurs (`erp-users.jsx`)
- Liste avec rôles, dernière connexion
- **Matrice de permissions** : rôles × modules avec toggle interactif
- Modale création utilisateur

#### 11. Paramétrage (`erp-settings.jsx`)
- Infos société, coordonnées bancaires, exercice comptable
- Personnalisation (couleurs, logo)

---

## Interactions & comportements

### Navigation
- Hash routing : `#dashboard`, `#sites`, `#factures`, etc.
- Fiche chantier : `#fiche-CSB-114`
- Sidebar : items avec badges dynamiques

### Modales de création (pattern uniforme)
- Déclenchées par bouton "Nouveau" dans chaque écran OU par le menu `+ Nouveau` de la topbar
- Communication via `CustomEvent('erp:new', { detail: { key } })`
- Footer : Annuler | Brouillon (optionnel) | Action principale (primary)

### Toasts
- `window.toast(message, kind, description)` — kind : success/info/warn/error
- Position : bottom-right, auto-dismiss 4s
- Style : fond ink (#1a1814), border-left coloré, icône

### Aperçu documents A4
- Overlay plein écran sur fond semi-transparent
- Barre d'actions : Envoyer email, Imprimer, Télécharger PDF, Fermer
- Page A4 : 794×1123px, fond blanc, ombre portée
- En-tête société (logo SVG + infos) + pied de page

### Animations
- Entrée : translateY(6px) + fade, 360ms ease
- Progress bars : scaleX depuis 0, 700ms
- Délais échelonnés (prop `delay`) pour les cards en séquence

---

## Design tokens

### Couleurs
```
bg:        #f6f3ee          Fond global
bgWarm:    #efe9df          Fond secondaire / hover
paper:     #ffffff          Cartes, modales
ink:       #1a1814          Texte / CTA primary
ink2:      #46423b          Texte secondaire
ink3:      #8a8378          Labels, hints
ink4:      #bdb5a6          Très discret
line:      #e4ddd1          Bordures cartes
line2:     #d6cebf          Bordures inputs
ocre:      oklch(0.62 0.12 50)    Accent principal
ocreDeep:  oklch(0.50 0.13 45)    Accent foncé
ocreSoft:  oklch(0.94 0.04 70)    Fond accent
green:     oklch(0.55 0.08 150)   Succès
red:       oklch(0.55 0.18 25)    Erreur
amber:     oklch(0.72 0.13 75)    Attention
blue:      oklch(0.50 0.10 240)   Info
+ versions *Soft de chaque couleur sémantique
```

### Typographie
```
Manrope      700-800   Titres, KPIs      lettre: -0.025em
IBM Plex Sans  400-600   Corps, boutons    tailles: 11-14px
IBM Plex Mono  400-500   Codes, montants   lettre: 0.04-0.15em, tailles: 8-12px
```

### Espacements & rayons
```
Card padding:     20px (défaut), 14-18px (dense)
Card radius:      8px
Button radius:    6px
Pill radius:      4px
Input radius:     5px
Modal radius:     10px
Section gaps:     22px (entre sections), 12-16px (entre cards)
Grid gaps:        10-16px
```

### Ombres
```
Card hover:       0 8px 24px -16px rgba(26,24,20,0.12)
Modal:            0 24px 72px -24px rgba(26,24,20,0.35)
Notification:     0 18px 56px -18px rgba(26,24,20,0.30)
Toast:            0 14px 36px -14px rgba(0,0,0,0.5)
```

---

## Icônes

Set SVG inline custom (pas de librairie externe). 30 icônes disponibles :
```
dashboard, sites, purchase, subcontract, clock, money, invoice, folder,
settings, bell, search, chevronDown, chevronRight, plus, check, x,
arrowUp, arrowDown, arrowRight, truck, helmet, doc, pin, warning, sun,
user, logout, box, wrench, shield, alert, gauge, refresh
```
Toutes en stroke (pas de fill), `strokeWidth: 1.5`, `viewBox: 0 0 24 24`.

---

## Fichiers de référence

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `erp.html` | Point d'entrée, routeur | 191 |
| `erp-shared.jsx` | Design tokens, composants primitifs | 305 |
| `erp-system.jsx` | Système transversal (modales, toasts, forms) | 557 |
| `erp-shell.jsx` | Layout shell (sidebar, topbar, routing) | 368 |
| `erp-dashboard.jsx` | Tableau de bord | 650+ |
| `erp-chantiers.jsx` | Liste chantiers | 413 |
| `erp-fiche-chantier.jsx` | Fiche détaillée chantier | ~400 |
| `erp-clients.jsx` | CRM clients | 324 |
| `erp-etudes.jsx` | Études de prix + simulateur | 785 |
| `erp-situations.jsx` | Situations mensuelles | 576 |
| `erp-facturation.jsx` | Facturation | 553 |
| `erp-achats.jsx` | Achats / BC | 811 |
| `erp-achats-reception.jsx` | Réception magasin | ~290 |
| `erp-modals-new.jsx` | Modales de création | ~280 |
| `erp-doc-preview.jsx` | Aperçus A4 (facture, devis) | ~420 |
| `erp-rapports.jsx` | Hub rapports + 5 templates | 1089 |
| `erp-rapports-extra.jsx` | 3 templates supplémentaires | ~540 |
| `erp-planning.jsx` | Planning Gantt | 409 |
| `erp-pointage.jsx` | Pointage ouvriers | ~350 |
| `erp-sous-traitance.jsx` | Sous-traitance | 344 |
| `erp-stock.jsx` | Stock / Magasin | 306 |
| `erp-parc.jsx` | Parc matériel | 275 |
| `erp-paie.jsx` | Paie chantier | ~200 |
| `erp-tresorerie.jsx` | Trésorerie & cautions | 312 |
| `erp-marches.jsx` | Marchés publics | 233 |
| `erp-ged.jsx` | GED documentaire | 246 |
| `erp-ged-hse.jsx` | Audit HSE | ~460 |
| `erp-users.jsx` | Utilisateurs & permissions | ~350 |
| `erp-settings.jsx` | Paramétrage | ~300 |
| `login.html` | Page de login | ~50 |
| `login-variants.jsx` | 3 variantes login | ~500 |

---

## Prochaines étapes (voir HANDOFF.md)

1. **Store global** — React Context pour données partagées
2. **Flux E2E** — Devis→Chantier→Situation→Facture connectés
3. **Enrichir modules secondaires** — Stock, Parc, Planning, Sous-traitance, Trésorerie, Marchés
4. **Responsive** — Mobile/tablette (sidebar drawer, tables→cards)
5. **Paie enrichie** — Bulletins, saisie pointage, bordereaux
