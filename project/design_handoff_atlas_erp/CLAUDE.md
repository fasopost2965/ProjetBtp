# Atlas·BTP ERP — Guide technique pour Claude Code

> Ce fichier est la référence unique pour tout développeur ou agent IA travaillant sur ce projet.
> Dernière mise à jour : 29 mai 2026.

---

## 1. Vue d'ensemble

**Produit** : ERP BTP marocain (Atlas Constructions S.A.)
**Stack** : HTML + React 18 inline JSX (Babel standalone) — pas de bundler, pas de Node.
**Langue UI** : Français (contexte marocain — DH, CNSS, ICE, CCAG marchés publics).
**Entrée** : `erp.html` charge tous les `.jsx` via `<script type="text/babel" src="...">`.
**Login** : `login.html` (page séparée, 3 variantes dans `login-variants.jsx`).

---

## 2. Architecture des fichiers

```
erp.html                  ← Point d'entrée, charge tous les scripts, définit le routeur
├── erp-shared.jsx        ← TOKENS (palette), Icon, Logo, Pill, Card, CardHead, Progress, Button, Stat, Sparkline, fmtMAD
├── erp-system.jsx        ← Notification center, Toasts (window.toast), Modal, Drawer, FieldGroup, TextInput, TextArea, Select, Radio, LogoUpload, EmptyState, ExportMenu, Kbd
├── erp-modals-new.jsx    ← Modales "Nouveau" : NewChantierModal, NewDevisModal, NewFactureModal, NewSituationModal
├── erp-doc-preview.jsx   ← Aperçu A4 : DocPreviewShell, PaperLetterhead, PaperFooter, FactureDocPreview, DevisDocPreview
├── erp-shell.jsx         ← Sidebar (NAV_GROUPS), Topbar (breadcrumb, search, notifications, NewMenu), Shell layout, StubScreen
│
│   ── Écrans principaux (un fichier = un module) ──
├── erp-dashboard.jsx     ← Tableau de bord : KPIs, alertes, chantiers, validations, cautions, pointage, activité, hebdo modal, tournée modal
├── erp-chantiers.jsx     ← Liste/grid chantiers avec filtres, tri, search
├── erp-fiche-chantier.jsx← Fiche détaillée d'un chantier (onglets)
├── erp-clients.jsx       ← CRM clients avec modale création + fiches
├── erp-etudes.jsx        ← Études de prix : hub devis + simulateur 5-étapes
├── erp-situations.jsx    ← Situations mensuelles : liste → éditeur BPU → preview A4
├── erp-facturation.jsx   ← Facturation : factures + devis + encaissements
├── erp-achats.jsx        ← Achats : BC (valider/émis/tous/livraisons), comparatif prix, fournisseurs
├── erp-achats-reception.jsx ← Réception magasin : BL, pointage, qualité, photos
├── erp-pointage.jsx      ← Pointage ouvriers par chantier
├── erp-planning.jsx      ← Planning multi-chantiers Gantt + charge équipes
├── erp-sous-traitance.jsx← Sous-traitance : contrats, DC4, paiements
├── erp-stock.jsx         ← Stock/Magasin : dépôts, articles, mouvements, seuils
├── erp-parc.jsx          ← Parc matériel : engins, VGP, maintenance
├── erp-paie.jsx          ← Paie chantier
├── erp-tresorerie.jsx    ← Trésorerie multi-banques + cautions bancaires
├── erp-marches.jsx       ← Marchés publics : AO → soumission → attribution
├── erp-rapports.jsx      ← Bibliothèque de rapports (F1, F2, F3, C8, R6 + shell/helpers)
├── erp-rapports-extra.jsx← Rapports additionnels : C4 (hebdo), R1 (paie), F4 (échéancier 13 sem.)
├── erp-ged.jsx           ← GED documentaire
├── erp-ged-hse.jsx       ← Audit complet HSE (matrice conformité, incidents, habilitations, plan d'actions)
├── erp-users.jsx         ← Gestion utilisateurs + rôles + permissions
├── erp-settings.jsx      ← Paramétrage société
│
├── login.html            ← Page de login
└── login-variants.jsx    ← 3 variantes de login (classique, split, zellige)
```

---

## 3. Design system — Tokens

### 3.1 Palette (définie dans `erp-shared.jsx` → `const TOKENS`)

| Token        | Valeur                    | Usage                             |
|-------------|---------------------------|-----------------------------------|
| `bg`        | `#f6f3ee`                 | Fond global (warm off-white)      |
| `bgWarm`    | `#efe9df`                 | Fond secondaire, hover states     |
| `paper`     | `#ffffff`                 | Cartes, modales, sidebar          |
| `ink`       | `#1a1814`                 | Texte principal, CTA primary bg   |
| `ink2`      | `#46423b`                 | Texte secondaire                  |
| `ink3`      | `#8a8378`                 | Labels, hints, timestamps         |
| `ink4`      | `#bdb5a6`                 | Texte très discret, borders       |
| `line`      | `#e4ddd1`                 | Bordures cartes                   |
| `line2`     | `#d6cebf`                 | Bordures inputs, séparateurs      |
| `ocre`      | `oklch(0.62 0.12 50)`     | Accent principal (terre ocre)     |
| `ocreDeep`  | `oklch(0.50 0.13 45)`     | Accent foncé (labels, codes)      |
| `ocreSoft`  | `oklch(0.94 0.04 70)`     | Fond accent clair                 |
| `green`     | `oklch(0.55 0.08 150)`    | Succès, conforme, positif         |
| `greenSoft` | `oklch(0.95 0.04 150)`    | Fond vert clair                   |
| `red`       | `oklch(0.55 0.18 25)`     | Erreur, retard, négatif           |
| `redSoft`   | `oklch(0.95 0.04 25)`     | Fond rouge clair                  |
| `amber`     | `oklch(0.72 0.13 75)`     | Attention, en retard              |
| `amberSoft` | `oklch(0.95 0.05 80)`     | Fond ambre clair                  |
| `blue`      | `oklch(0.50 0.10 240)`    | Info, liens, neutre               |
| `blueSoft`  | `oklch(0.94 0.03 240)`    | Fond bleu clair                   |

### 3.2 Typographie

| Famille           | Rôle                                    | Exemples                          |
|-------------------|-----------------------------------------|-----------------------------------|
| **Manrope**       | Titres, KPIs grands, noms               | `fontWeight: 700–800`, `letterSpacing: '-0.025em'` |
| **IBM Plex Sans** | Corps de texte, labels, boutons         | `fontWeight: 400–600`, corps 12–14px |
| **IBM Plex Mono** | Codes, montants, dates, eyebrows, badges| `fontSize: 9–12px`, `letterSpacing: '0.04–0.15em'` |

### 3.3 Conventions visuelles

- **Eyebrows** : `fontFamily: 'IBM Plex Mono'`, `fontSize: 10`, `letterSpacing: '0.12em'`, `color: TOKENS.ocreDeep`, uppercase
- **Card** : `background: TOKENS.paper`, `border: 1px solid TOKENS.line`, `borderRadius: 8`
- **Table header** : `background: TOKENS.ink`, `color: TOKENS.bg`, polices mono 9.5–10px uppercase
- **Table rows** : className `erp-row` → hover `background: #faf8f3`
- **Montants** : `fontFamily: 'IBM Plex Mono'`, alignés à droite
- **Progress bar** : composant `<Progress value={%} tone="ocre|green|red" />`
- **Status pills** : `<Pill tone="green|red|amber|blue|ocre|ink|neutral" dot mono>`
- **Animations d'entrée** : className `erp-fade-in` (translateY 6px + fadeIn 360ms), `animationDelay` via prop `delay`

---

## 4. Composants disponibles (via `window.*`)

### 4.1 Primitives (`erp-shared.jsx`)

| Composant   | Props                                              |
|------------|-----------------------------------------------------|
| `Icon`     | `name`, `size=16`, `stroke`, `strokeWidth=1.5`     |
| `Logo`     | `tone='ink'`, `compact`                             |
| `Pill`     | `children`, `tone`, `dot`, `mono`                   |
| `Card`     | `children`, `padding=20`, `style`, `hoverable`, `delay`, `onClick` |
| `CardHead` | `eyebrow`, `title`, `right`, `style`               |
| `Progress` | `value`, `target`, `tone`, `height`, `showLabel`    |
| `Button`   | `children`, `variant='default|primary|ghost|ocre'`, `size='sm|md|lg'`, `icon`, `iconRight`, `onClick`, `style` |
| `Stat`     | `label`, `value`, `unit`, `delta`, `deltaLabel`, `tone`, `sub` |
| `Sparkline`| `data[]`, `width`, `height`, `color`, `fill`        |
| `fmtMAD()` | Formate un nombre en DH lisible (k / M)             |

### 4.2 Système (`erp-system.jsx`)

| Composant / API         | Usage                                         |
|------------------------|------------------------------------------------|
| `Modal`                | `open`, `onClose`, `title`, `subtitle`, `width`, `footer`, `children` |
| `Drawer`               | Slide-in depuis la droite, même API que Modal  |
| `window.toast(msg, kind, desc)` | Toast bottom-right (success/info/warn/error) |
| `FieldGroup`           | `label`, `hint`, `required`, wraps form field  |
| `TextInput`            | `value`, `onChange`, `placeholder`, `mono`, `type` |
| `TextArea`             | `value`, `onChange`, `placeholder`, `rows`      |
| `Select`               | `value`, `onChange`, `options` (string[] ou [value,label][]) |
| `Radio`                | `value`, `onChange`, `options` ([[value, label, desc]]) |
| `LogoUpload`           | Upload fichier avec preview                    |
| `EmptyState`           | `icon`, `title`, `desc`, `action`              |
| `ExportMenu`           | Menu contextuel PDF/Excel/CSV/Print            |
| `NotificationProvider` | Context provider pour les notifications        |
| `NotificationBell`     | Cloche topbar avec dropdown                    |
| `ToastHost`            | Conteneur des toasts (monté 1× dans App)       |

### 4.3 Icônes disponibles (prop `name` de `<Icon>`)

```
dashboard, sites, purchase, subcontract, clock, money, invoice, folder,
settings, bell, search, chevronDown, chevronRight, plus, check, x,
arrowUp, arrowDown, arrowRight, truck, helmet, doc, pin, warning, sun,
user, logout, box, wrench, shield, alert, gauge, refresh
```

---

## 5. Navigation & routing

- **Hash-based** : `window.location.hash = 'sites'` → affiche Chantiers
- **Routes** définies dans `erp.html` → objet `ROUTES` : chaque clé = id de nav
- **NAV_GROUPS** (dans `erp-shell.jsx`) : 6 groupes × items avec `id`, `label`, `icon`, `badge`
- **Fiche chantier** : hash `#fiche-CSB-114` → composant `FicheChantier`
- **erp:new event** : `window.dispatchEvent(new CustomEvent('erp:new', { detail: { key } }))` — les écrans écoutent et ouvrent leur modale de création

### Clés `erp:new` actuellement gérées :

| Clé          | Écran        | Modale                |
|-------------|-------------|------------------------|
| `newSite`   | Chantiers    | `NewChantierModal`     |
| `newClient` | Clients      | Modale création client |
| `newQuote`  | Études       | `NewDevisModal`        |
| `newBC`     | Achats       | `NewBCModal`           |
| `newSit`    | Situations   | `NewSituationModal`    |
| `newInvoice`| Facturation  | `NewFactureModal`      |
| `newUser`   | Users        | Modale création user   |

---

## 6. Patterns de code à suivre

### 6.1 Ajouter un nouvel écran

```jsx
// 1. Créer erp-monmodule.jsx
/* global React, TOKENS, Icon, Pill, Card, CardHead, Progress, Button, fmtMAD */

function MonModule() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div className="erp-fade-in" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: TOKENS.ocreDeep, letterSpacing: '0.15em' }}>
            EYEBROW
          </div>
          <h1 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 28, margin: 0, letterSpacing: '-0.025em' }}>
            Titre du module
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" icon={<Icon name="plus" size={13} stroke={TOKENS.bg} />}>
            Action
          </Button>
        </div>
      </div>
      {/* KPI strip → Cards → Tables */}
    </div>
  );
}

Object.assign(window, { MonModule });

// 2. Dans erp.html : ajouter <script type="text/babel" src="erp-monmodule.jsx"></script>
// 3. Dans erp.html → ROUTES : ajouter la clé
// 4. Dans erp-shell.jsx → NAV_GROUPS : ajouter l'item de nav
```

### 6.2 Ajouter une modale de création

```jsx
// Écouter l'event dans le composant écran :
React.useEffect(() => {
  const h = (e) => { if (e.detail?.key === 'newXxx') setCreateOpen(true); };
  window.addEventListener('erp:new', h);
  return () => window.removeEventListener('erp:new', h);
}, []);

// Rendre la modale conditionnellement :
{createOpen && <NewXxxModal onClose={() => setCreateOpen(false)} />}
```

### 6.3 Tables de données

```jsx
{/* Header */}
<div style={{
  display: 'grid', gridTemplateColumns: '...',
  padding: '10px 20px', background: TOKENS.ink, color: TOKENS.bg,
  fontFamily: 'IBM Plex Mono', fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase',
}}>

{/* Rows */}
<div className="erp-row" style={{
  display: 'grid', gridTemplateColumns: '...',
  padding: '12px 20px', borderBottom: `1px solid ${TOKENS.line}`,
}}>
```

### 6.4 KPI cards (pattern récurrent)

```jsx
function MonKpi({ label, value, unit, sub, tone, delay }) {
  return (
    <Card delay={delay} padding={16}>
      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 9.5, color: TOKENS.ocreDeep, letterSpacing: '0.12em', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 26, color: TOKENS.ink, letterSpacing: '-0.025em', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10.5, color: TOKENS.ink3 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, marginTop: 8, color: TOKENS.ink3 }}>{sub}</div>}
    </Card>
  );
}
```

### 6.5 Rapports (ajout)

Pour ajouter un rapport, créer un composant `ReportXX({ onBack })` et l'enregistrer :

```jsx
window.RAPPORT_TEMPLATES = {
  ...(window.RAPPORT_TEMPLATES || {}),
  XX: ReportXX,
};
```

Le hub le détecte automatiquement s'il est dans le catalogue `REPORT_CATALOG` de `erp-rapports.jsx`.

---

## 7. Données de démo

Toutes les données sont en dur dans chaque fichier `.jsx` (pas de backend). Convention :
- **Chantier codes** : `CSB-114`, `RBT-208`, `TNG-061`, `AGD-033`, `MEK-019`, `CSB-098`, `OUJ-007`
- **Fournisseurs** : Sonasid, CIMAR, LafargeHolcim, Granulats du Souss, etc.
- **Sous-traitants** : SOTRAVO, Électrique du Maroc, KONE, Aluminium Berrechid, etc.
- **Conducteurs** : K. Benjelloun, H. Alaoui, M. El Mansouri, S. Fassi, Y. Tazi
- **Société** : Atlas Constructions S.A. · ICE 002578946000093 · Casablanca
- **Monnaie** : DH (dirhams) · TVA 20% · CNSS/AMO/IR standards marocains

---

## 8. Règles impératives

1. **Pas de `const styles = {}`** au global — toujours nommer : `const monModuleStyles = {}` ou inline.
2. **Chaque fichier Babel a son propre scope** — exporter via `Object.assign(window, { ... })`.
3. **`/* global */` en tête** de chaque fichier pour lister les dépendances window.
4. **Ne pas utiliser `import/export`** — tout passe par `window.*`.
5. **Pas de `type="module"`** sur les scripts Babel.
6. **Ordre de chargement** dans `erp.html` = dépendances (shared → system → shells → écrans).
7. **Ne jamais modifier `erp-shared.jsx`** sans raison majeure — c'est le socle design.
8. **Un fichier par module** — max ~800 lignes ; au-delà, split (ex: `erp-rapports.jsx` + `erp-rapports-extra.jsx`).
9. **Animations** : utiliser `.erp-fade-in` + `animationDelay` via prop `delay` ; pas de librairie d'animation.
10. **Couleurs** : toujours `TOKENS.*`, jamais de hex en dur (sauf dans TOKENS lui-même).
