# Pseudocode : Page d'Accueil (Site Vitrine SerenKall)

Basé sur : `specifications/01_page_accueil_specs.md`

## Structure Générale de la Page (`pages/index.tsx`)

```typescript
// pages/index.tsx
// TEST: Le fichier principal de la page d'accueil existe et importe les composants nécessaires.

FONCTION HomePage():
    // TEST: HomePage est un composant React/Next.js.

    RETOURNER (
        <Layout>
            <HeroBanner />
            <ProblemSolution />
            <KeyBenefitsPreview />
            <HowItWorksSimplified />
            <SocialProofPreview /> // Optionnel, conditionner l'affichage si données disponibles
            <FinalCallToAction />
        </Layout>
    )
FIN FONCTION
```

## Composants Détaillés

### 1. `Layout` (composant transversal)
*   Situé dans `components/layout/Layout.tsx`
*   Gère la structure globale de la page (header, footer, contenu principal).
    *   // TEST: Le composant Layout structure correctement la page avec un header et un footer.

```typescript
// components/layout/Layout.tsx

FONCTION Layout({ enfants }):
    // TEST: Layout est un composant React qui accepte des enfants.
    RETOURNER (
        <>
            <MainNavigationBar />
            <main>{enfants}</main>
            <Footer />
        </>
    )
FIN FONCTION
```

### 2. `MainNavigationBar` (composant transversal)
*   Situé dans `components/layout/MainNavigationBar.tsx`
    *   // TEST: Le composant MainNavigationBar existe.

```typescript
// components/layout/MainNavigationBar.tsx

TYPE LinkItem = {
    href: String,
    label: String
}

CONST navLinks: Array<LinkItem> = [
    { href: "/", label: "Accueil" },
    { href: "/fonctionnalites", label: "Fonctionnalités" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "/contact", label: "Contact" }
    // Optionnel: { href: "/faq", label: "FAQ" },
    // Optionnel: { href: "/blog", label: "Blog" }
]
// TEST: Les liens de navigation principaux sont définis et corrects.

FONCTION MainNavigationBar():
    // TEST: MainNavigationBar est un composant React.
    // TODO: Gérer l'état pour le menu mobile (ouvert/fermé).

    RETOURNER (
        <nav>
            AFFICHER LogoSerenKall AVEC lien vers "/"
            // TEST: Le logo est affiché et lie vers la page d'accueil.

            POUR CHAQUE lien DANS navLinks:
                AFFICHER Lien AVEC lien.href ET lien.label
                // TEST: Chaque lien de navigation est rendu correctement.
            FIN POUR

            // Optionnel : Bouton pour menu mobile
            // TEST: Un mécanisme pour la navigation mobile est présent.

            AFFICHER Bouton "Connexion" AVEC lien vers "/connexion" (ou "/espace-client")
            // TEST: Le bouton/lien de connexion est présent et fonctionnel.
        </nav>
    )
FIN FONCTION
```

### 3. `Footer` (composant transversal)
*   Situé dans `components/layout/Footer.tsx`
    *   // TEST: Le composant Footer existe.

```typescript
// components/layout/Footer.tsx

CONST footerLinks: Array<LinkItem> = [
    { href: "/mentions-legales", label: "Mentions Légales" },
    { href: "/politique-confidentialite", label: "Politique de Confidentialité" },
    { href: "/cgu", label: "Conditions Générales d'Utilisation" },
    { href: "/faq", label: "FAQ" }
]
// TEST: Les liens du pied de page sont définis et corrects.

CONST socialLinks: Array<{ href: String, icon: String, label: String }> = [
    // Ex: { href: "https://twitter.com/serenkall", icon: "TwitterIcon", label: "Twitter"}
]
// TEST: Les liens vers les réseaux sociaux (si définis) sont corrects.

FONCTION Footer():
    // TEST: Footer est un composant React.
    RETOURNER (
        <footer>
            DIV ConteneurLiensFooter:
                POUR CHAQUE lien DANS footerLinks:
                    AFFICHER Lien AVEC lien.href ET lien.label
                    // TEST: Chaque lien légal et d'information est rendu.
                FIN POUR
            FIN DIV

            DIV ConteneurReseauxSociaux: // Optionnel
                POUR CHAQUE lienSocial DANS socialLinks:
                    AFFICHER Lien AVEC lienSocial.href, icône lienSocial.icon ET libellé lienSocial.label
                FIN POUR
            FIN DIV

            AFFICHER Texte "© {ANNEE_COURANTE} SerenKall. Tous droits réservés."
            // TEST: L'information de copyright est présente et l'année est dynamique.
        </footer>
    )
FIN FONCTION
```

### 4. `HeroBanner`
*   Situé dans `components/accueil/HeroBanner.tsx`
    *   // TEST: Le composant HeroBanner existe.

```typescript
// components/accueil/HeroBanner.tsx

FONCTION HeroBanner():
    // TEST: HeroBanner est un composant React.
    CONST titre = "Reprenez le contrôle de vos appels avec SerenKall." // Ou lire depuis une config/CMS
    CONST sousTitre = "Notre IA filtre intelligemment les appels pour vous, sans changer de numéro."
    CONST ctaTexte = "Découvrir SerenKall"
    CONST ctaLien = "/fonctionnalites"

    RETOURNER (
        <section className="hero-banner">
            DIV ContenuTexte:
                AFFICHER Titre h1 AVEC texte: titre
                // TEST: Le titre principal (h1) est affiché avec le contenu attendu.
                AFFICHER Paragraphe p AVEC texte: sousTitre
                // TEST: Le sous-titre est affiché avec le contenu attendu.
                AFFICHER Bouton CTA AVEC texte: ctaTexte ET lien vers: ctaLien
                // TEST: Le CTA principal est affiché, avec le bon texte et lien.
            FIN DIV
            DIV ContenuVisuel:
                AFFICHER ImageOuAnimation // (ex: <Image src="/path/to/hero-image.svg" alt="Illustration SerenKall" layout="responsive" />)
                // TEST: Le visuel est présent et possède une alternative textuelle.
            FIN DIV
        </section>
    )
FIN FONCTION
```

### 5. `ProblemSolution`
*   Situé dans `components/accueil/ProblemSolution.tsx`
    *   // TEST: Le composant ProblemSolution existe.

```typescript
// components/accueil/ProblemSolution.tsx

FONCTION ProblemSolution():
    // TEST: ProblemSolution est un composant React.
    CONST titreSection = "Fatigué du harcèlement téléphonique ? SerenKall est là pour vous."
    CONST texteProbleme = "Spam, démarchage abusif, appels non sollicités... Ces interruptions constantes vous font perdre temps et concentration."
    CONST texteSolution = "SerenKall analyse et qualifie chaque appelant grâce à son IA. Seuls les appels importants vous parviennent."

    RETOURNER (
        <section className="problem-solution">
            AFFICHER Titre h2 AVEC texte: titreSection
            // TEST: Le titre de la section est affiché.
            DIV Contenu:
                DIV Probleme:
                    AFFICHER Paragraphe AVEC texte: texteProbleme
                    // TEST: La description du problème est affichée.
                FIN DIV
                DIV Solution:
                    AFFICHER Paragraphe AVEC texte: texteSolution
                    // TEST: La présentation de la solution est affichée.
                FIN DIV
            FIN DIV
        </section>
    )
FIN FONCTION
```

### 6. `KeyBenefitsPreview`
*   Situé dans `components/accueil/KeyBenefitsPreview.tsx`
    *   // TEST: Le composant KeyBenefitsPreview existe.

```typescript
// components/accueil/KeyBenefitsPreview.tsx

TYPE Benefit = {
    icon: String, // Nom du composant icône ou chemin SVG
    title: String,
    description: String
}

CONST benefits: Array<Benefit> = [
    { icon: "IconShield", title: "Filtrage IA Avancé", description: "Notre IA identifie et bloque les spams avant qu'ils ne vous atteignent." },
    { icon: "IconPhoneLock", title: "Gardez Votre Numéro", description: "Aucun besoin de changer de numéro, SerenKall s'intègre discrètement." },
    { icon: "IconSmile", title: "Tranquillité Garantie", description: "Recevez uniquement les appels que vous souhaitez." },
    // { icon: "IconSettings", title: "Simulation & Contrôle", description: "Testez vos règles et gardez le contrôle total sur le filtrage." }
]
// TEST: La liste des bénéfices est définie avec les informations nécessaires.

FONCTION KeyBenefitsPreview():
    // TEST: KeyBenefitsPreview est un composant React.
    CONST titreSection = "Les Avantages Uniques de SerenKall"
    CONST ctaTexte = "Découvrir tous les avantages"
    CONST ctaLien = "/fonctionnalites" // ou "/avantages"

    RETOURNER (
        <section className="key-benefits-preview">
            AFFICHER Titre h2 AVEC texte: titreSection
            // TEST: Le titre de la section est affiché.
            DIV GrilleDesBenefices:
                POUR CHAQUE benefice DANS benefits:
                    DIV CarteBenefice:
                        AFFICHER Icone AVEC nom/source: benefice.icon
                        // TEST: L'icône du bénéfice est affichée.
                        AFFICHER Titre h3 AVEC texte: benefice.title
                        // TEST: Le titre du bénéfice est affiché.
                        AFFICHER Paragraphe AVEC texte: benefice.description
                        // TEST: La description du bénéfice est affichée.
                    FIN DIV
                    // TEST: Chaque bénéfice est rendu correctement avec icône, titre et description.
                FIN POUR
            FIN DIV
            AFFICHER Bouton/Lien CTA AVEC texte: ctaTexte ET lien vers: ctaLien
            // TEST: Le CTA secondaire pour les avantages est affiché avec le bon texte et lien.
        </section>
    )
FIN FONCTION
```

### 7. `HowItWorksSimplified`
*   Situé dans `components/accueil/HowItWorksSimplified.tsx`
    *   // TEST: Le composant HowItWorksSimplified existe.

```typescript
// components/accueil/HowItWorksSimplified.tsx

TYPE Step = {
    icon: String,
    title: String,
    description: String
}

CONST steps: Array<Step> = [
    { icon: "IconReceiveAnalyze", title: "1. Réception & Analyse", description: "SerenKall intercepte l'appel et l'IA l'analyse." },
    { icon: "IconQualify", title: "2. Qualification", description: "L'IA dialogue pour identifier l'appelant et le motif." },
    { icon: "IconAction", title: "3. Action", description: "Appel pertinent ? Transféré. Indésirable ? Bloqué." }
]
// TEST: Les étapes du fonctionnement simplifié sont définies.

FONCTION HowItWorksSimplified():
    // TEST: HowItWorksSimplified est un composant React.
    CONST titreSection = "SerenKall en Action : C'est Simple !"
    CONST ctaTexte = "Voir le fonctionnement détaillé"
    CONST ctaLien = "/fonctionnalites"

    RETOURNER (
        <section className="how-it-works-simplified">
            AFFICHER Titre h2 AVEC texte: titreSection
            // TEST: Le titre de la section est affiché.
            DIV ConteneurEtapes:
                POUR CHAQUE etape DANS steps:
                    DIV CarteEtape:
                        AFFICHER Icone AVEC nom/source: etape.icon
                        // TEST: L'icône de l'étape est affichée.
                        AFFICHER Titre h3 AVEC texte: etape.title
                        // TEST: Le titre de l'étape est affiché.
                        AFFICHER Paragraphe AVEC texte: etape.description
                        // TEST: La description de l'étape est affichée.
                    FIN DIV
                    // TEST: Chaque étape est rendue correctement.
                FIN POUR
            FIN DIV
            AFFICHER Bouton/Lien CTA AVEC texte: ctaTexte ET lien vers: ctaLien
            // TEST: Le CTA pour le fonctionnement détaillé est affiché.
        </section>
    )
FIN FONCTION
```

### 8. `SocialProofPreview` (Optionnel)
*   Situé dans `components/accueil/SocialProofPreview.tsx`
    *   // TEST: Le composant SocialProofPreview existe.

```typescript
// components/accueil/SocialProofPreview.tsx

TYPE Testimonial = {
    quote: String,
    author: String,
    source?: String // Ex: "Client Vérifié"
}

// Simuler la récupération de données. Dans une vraie app, viendrait d'un CMS ou API.
CONST testimonials: Array<Testimonial> = [
    // { quote: "Incroyable, plus aucun appel de spam !", author: "Sophie D." }
]
CONST logos: Array<{ src: String, alt: String }> = [
    // { src: "/logos/partenaire-presse.png", alt: "Logo Partenaire Presse" }
]

FONCTION SocialProofPreview():
    // TEST: SocialProofPreview est un composant React.
    SI testimonials EST VIDE ET logos EST VIDE ALORS
        RETOURNER null
        // TEST: Le composant ne rend rien si aucune preuve sociale n'est disponible.
    FIN SI

    CONST titreSection = "Ils font confiance à SerenKall"

    RETOURNER (
        <section className="social-proof-preview">
            AFFICHER Titre h2 AVEC texte: titreSection
            // TEST: Le titre de la section est affiché si des données existent.

            SI testimonials N'EST PAS VIDE ALORS
                DIV ConteneurTemoignages:
                    POUR CHAQUE temoignage DANS testimonials:
                        Bloc Temoignage:
                            AFFICHER Citation: temoignage.quote
                            AFFICHER Auteur: temoignage.author
                            // TEST: Chaque témoignage est affiché correctement.
                        FIN Bloc
                    FIN POUR
                FIN DIV
            FIN SI

            SI logos N'EST PAS VIDE ALORS
                DIV ConteneurLogos:
                    POUR CHAQUE logo DANS logos:
                        AFFICHER Image AVEC src: logo.src ET alt: logo.alt
                        // TEST: Chaque logo est affiché correctement avec son alt.
                    FIN POUR
                FIN DIV
            FIN SI
        </section>
    )
FIN FONCTION
```

### 9. `FinalCallToAction`
*   Situé dans `components/accueil/FinalCallToAction.tsx`
    *   // TEST: Le composant FinalCallToAction existe.

```typescript
// components/accueil/FinalCallToAction.tsx

FONCTION FinalCallToAction():
    // TEST: FinalCallToAction est un composant React.
    CONST titre = "Prêt à retrouver votre sérénité téléphonique ?"
    CONST texteMotivation = "Rejoignez des milliers d'utilisateurs qui ont dit adieu au dérangement."
    CONST ctaTexte = "Nos Offres" // Ou "Essayer Gratuitement", "Demander une Démo"
    CONST ctaLien = "/tarifs" // Ou "/inscription", "/contact#demo"

    RETOURNER (
        <section className="final-cta">
            AFFICHER Titre h2 AVEC texte: titre
            // TEST: Le titre du CTA final est affiché.
            AFFICHER Paragraphe AVEC texte: texteMotivation
            // TEST: Le texte de motivation est affiché.
            AFFICHER Bouton CTA Principal AVEC texte: ctaTexte ET lien vers: ctaLien
            // TEST: Le bouton CTA final est affiché avec le bon texte et lien.
        </section>
    )
FIN FONCTION
```

## Considérations Générales de Pseudocode
*   **Variables d'Environnement :** Aucune variable d'environnement (ex: clés API) n'est codée en dur. Les URL de base d'API ou autres configurations sensibles seraient injectées via les variables d'environnement de Next.js (`process.env.NEXT_PUBLIC_...`).
    *   // TEST: Aucune clé API ou secret n'est visible dans le pseudocode.
*   **Testabilité :** Les ancres `// TEST:` sont incluses pour guider la création des tests unitaires et d'intégration.
*   **Modularité :** Les composants sont décomposés pour favoriser la réutilisabilité et la maintenabilité.
*   **Internationalisation (i18n) :** Bien que non explicitement détaillé ici, les chaînes de caractères (titres, descriptions, labels de boutons) devraient être gérées par une librairie i18n (ex: `next-i18next`) pour faciliter la traduction. Les constantes de texte dans ce pseudocode seraient alors remplacées par des appels à des fonctions de traduction.
    *   // TEST: (Pour une phase ultérieure) Les chaînes sont prêtes pour l'internationalisation.
*   **Accessibilité (a11y) :** Les éléments sémantiques HTML (nav, section, h1-h6, button, etc.) sont suggérés. Les attributs `alt` pour les images et `aria-label` pour les contrôles interactifs sans texte visible seraient nécessaires.
    *   // TEST: (Pour une phase ultérieure) Les pratiques d'accessibilité de base sont suivies.
*   **Styling :** Le pseudocode ne détaille pas le CSS. Предполагается, что классы CSS, такие как `hero-banner`, `problem-solution`, будут определены в отдельных файлах CSS/SCSS Modules или с использованием CSS-in-JS решений.
    *   // TEST: (Pour une phase ultérieure) Le style est appliqué de manière cohérente et responsive.