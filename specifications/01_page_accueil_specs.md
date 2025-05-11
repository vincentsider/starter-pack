# Spécifications : Page d'Accueil du Site Vitrine SerenKall

## 1. Objectifs de la Page d'Accueil

*   Capturer immédiatement l'attention du visiteur.
*   Communiquer clairement la proposition de valeur principale : un assistant IA qui filtre intelligemment les appels téléphoniques sans changer de numéro.
*   Susciter l'intérêt pour en savoir plus sur la solution SerenKall.
*   Diriger les visiteurs vers les sections clés du site (Fonctionnalités, Avantages, Tarifs/Offres, Demande de Démo).
    *   // TEST: Les objectifs de la page sont atteints via les sections et CTA présents.

## 2. Structure et Contenu Détaillé

### Section 1 : Bannière Principale (Héros)
*   **Composant :** `HeroBanner`
*   **Contenu :**
    *   **Titre Accrocheur :** Ex: "Reprenez le contrôle de vos appels avec SerenKall." ou "SerenKall : Ne soyez plus jamais dérangé par les appels indésirables."
        *   // TEST: Le titre est concis et met en avant un bénéfice majeur (contrôle, tranquillité).
        *   // TEST: Le nom du produit "SerenKall" est présent.
    *   **Sous-titre / Description Courte :** Expliquer brièvement le fonctionnement de SerenKall (filtrage par IA, qualification d'appel) et son avantage clé (conservation du numéro actuel).
        *   // TEST: La description est claire (max 2-3 lignes).
        *   // TEST: La description mentionne le filtrage IA et la conservation du numéro.
    *   **Visuel Impactant :** Image ou courte animation (SVG/Lottie) illustrant la sérénité, la technologie de filtrage, ou un téléphone protégé. Le visuel doit être de haute qualité et responsive.
        *   // TEST: Le visuel est pertinent, de haute qualité et s'adapte aux différentes tailles d'écran.
    *   **Appel à l'Action Principal (CTA) :**
        *   **Bouton :** Texte clair et visible (Ex: "Découvrir SerenKall", "Comment ça marche ?").
        *   **Lien :** Dirige vers la page "Fonctionnalités".
        *   // TEST: Le CTA principal est proéminent, avec un texte engageant.
        *   // TEST: Le lien du CTA principal mène à la page Fonctionnalités.

### Section 2 : Problème Adressé / Solution Apportée
*   **Composant :** `ProblemSolution`
*   **Contenu :**
    *   **Titre de section :** Ex: "Fatigué du harcèlement téléphonique ? SerenKall est là pour vous."
    *   **Description du Problème :** Texte court (2-3 phrases) décrivant les nuisances courantes : spam, démarchage abusif, appels non sollicités, perte de temps et de concentration.
        *   // TEST: Le problème du spam/démarchage est clairement identifié.
    *   **Présentation de la Solution (SerenKall) :** Texte court (2-3 phrases) expliquant comment SerenKall résout ce problème grâce à son IA qui qualifie les appelants et ne transfère que les appels pertinents.
        *   // TEST: La solution SerenKall est présentée comme une réponse directe et efficace au problème.
        *   // TEST: Le rôle de l'IA dans la qualification est mentionné.

### Section 3 : Bénéfices Clés (Aperçu)
*   **Composant :** `KeyBenefitsPreview`
*   **Contenu :**
    *   **Titre de section :** Ex: "Les Avantages Uniques de SerenKall".
    *   **Liste de 3-4 Bénéfices :** Chaque bénéfice présenté avec :
        *   Icône illustrative.
        *   Titre court du bénéfice (Ex: "Filtrage IA Avancé", "Gardez Votre Numéro", "Tranquillité Garantie", "Simulation & Contrôle").
        *   Description courte (1 phrase).
        *   // TEST: Au moins 3 bénéfices clés sont présentés.
        *   // TEST: Chaque bénéfice est clair, concis et associé à une icône pertinente.
        *   // TEST: Le bénéfice "Gardez Votre Numéro" est explicitement listé.
    *   **Appel à l'Action Secondaire :**
        *   **Bouton/Lien :** Texte (Ex: "Découvrir tous les avantages").
        *   **Lien :** Dirige vers la page "Fonctionnalités" (ou une future page "Avantages" si créée).
        *   // TEST: Le CTA secondaire est présent et dirige vers une page de détails appropriée.

### Section 4 : Comment ça marche ? (Simplifié)
*   **Composant :** `HowItWorksSimplified`
*   **Contenu :**
    *   **Titre de section :** Ex: "SerenKall en Action : C'est Simple !".
    *   **Processus en 3-4 Étapes Visuelles :** Chaque étape avec une icône/illustration simple et une très courte description.
        1.  **Réception & Analyse :** SerenKall intercepte l'appel et l'analyse avec son IA.
        2.  **Qualification :** L'IA dialogue brièvement pour identifier l'appelant et le motif.
        3.  **Action :**
            *   Appel pertinent ? Transféré sur votre téléphone.
            *   Appel indésirable ? Bloqué ou message pris.
        *   // TEST: Le processus est expliqué en 3-4 étapes claires et visuelles.
        *   // TEST: Le processus est facile à comprendre en un coup d'œil.
    *   **Appel à l'Action :**
        *   **Bouton/Lien :** Texte (Ex: "Voir le fonctionnement détaillé").
        *   **Lien :** Dirige vers la page "Fonctionnalités".
        *   // TEST: Le CTA dirige vers la page détaillée des Fonctionnalités.

### Section 5 : Preuve Sociale (Aperçu)
*   **Composant :** `SocialProofPreview` (Optionnel, afficher si des témoignages/logos sont disponibles)
*   **Contenu (si disponible) :**
    *   **Titre de section :** Ex: "Ils font confiance à SerenKall".
    *   **Extrait de Témoignage :** Un ou deux courts extraits de témoignages clients (anonymisés ou avec accord).
    *   **Logos :** Logos de médias ou partenaires (si applicable et crédible).
    *   // TEST: Si la section est présente, la preuve sociale est crédible et bien intégrée.
    *   // TEST: Les témoignages (si présents) sont courts et impactants.

### Section 6 : Dernier Appel à l'Action
*   **Composant :** `FinalCallToAction`
*   **Contenu :**
    *   **Titre :** Ex: "Prêt à retrouver votre sérénité téléphonique ?" ou "Rejoignez SerenKall aujourd'hui !".
    *   **Texte court de réassurance/motivation.**
    *   **Appel à l'Action Principal (Rappel ou Variante) :**
        *   **Bouton :** Texte (Ex: "Essayer SerenKall Gratuitement" (si offre d'essai), "Nos Offres", "Demander une Démo").
        *   **Lien :** Dirige vers la page Tarifs, Inscription, ou Contact/Démo.
        *   // TEST: Le dernier CTA est clair, visible et encourage la conversion.
        *   // TEST: Le lien du dernier CTA est pertinent par rapport à son texte.

## 3. Éléments Transversaux

### 3.1. Navigation Principale (Header)
*   **Composant :** `MainNavigationBar`
*   **Contenu :**
    *   Logo SerenKall (lien vers la page d'accueil).
    *   Liens de navigation clairs vers :
        *   Accueil
        *   Fonctionnalités (ou "Comment ça marche ?")
        *   Tarifs (ou "Nos Offres")
        *   Contact (ou "Demande de Démo")
        *   FAQ (Optionnel dans la nav principale, sinon footer)
        *   Blog (Optionnel)
    *   Bouton CTA "Connexion" / "Espace Client" (si applicable pour utilisateurs existants).
    *   // TEST: Le menu de navigation est toujours visible (ou facilement accessible sur mobile).
    *   // TEST: Les liens de navigation mènent aux bonnes pages.
    *   // TEST: Le logo SerenKall est présent et cliquable vers l'accueil.

### 3.2. Pied de Page (Footer)
*   **Composant :** `Footer`
*   **Contenu :**
    *   Rappel des liens principaux (Accueil, Fonctionnalités, Tarifs, Contact).
    *   Liens vers :
        *   Mentions Légales
        *   Politique de Confidentialité
        *   Conditions Générales d'Utilisation
        *   FAQ
    *   Informations de copyright (© [Année] SerenKall. Tous droits réservés.).
    *   Liens vers réseaux sociaux (si applicable).
    *   // TEST: Le pied de page contient les liens légaux obligatoires.
    *   // TEST: Le copyright est présent et à jour.

## 4. Design et Expérience Utilisateur (UX)

*   **Identité Visuelle :** Design épuré, moderne, professionnel. Couleurs et typographie en accord avec la marque SerenKall (à définir). Le ton doit être rassurant et inspirer confiance.
    *   // TEST: Le design est cohérent avec une image de marque professionnelle et technologique.
*   **Performance :** Chargement rapide de la page (optimisation des images, code minifié, etc.).
    *   // TEST: Le score PageSpeed Insights est satisfaisant (objectif > 80 mobile/desktop).
*   **Adaptabilité (Responsive Design) :** Affichage et fonctionnalité parfaits sur mobile, tablette et ordinateur.
    *   // TEST: La page est testée et validée sur les principaux navigateurs et tailles d'écran.
*   **Animations :** Animations subtiles et non intrusives pour améliorer l'engagement (ex: apparitions douces au scroll, feedback sur hover/clic).
    *   // TEST: Les animations sont fluides et n'impactent pas négativement la performance ou l'accessibilité.
*   **Accessibilité (WCAG) :** Suivre les recommandations WCAG niveau AA autant que possible (contrastes, navigation clavier, alternatives textuelles pour images, etc.).
    *   // TEST: Des tests d'accessibilité basiques sont effectués (ex: WAVE tool, Axe DevTools).

## 5. Points d'Attention Particuliers

*   **Message Clé :** Mettre constamment en avant l'unicité de SerenKall : filtrage IA performant SANS avoir à changer de numéro de téléphone, et le transfert s'effectue sur le téléphone existant de l'utilisateur (via technologie SIP discrète).
    *   // TEST: L'avantage "conservation du numéro" est répété ou facilement visible.
*   **Confidentialité :** Le message global doit être rassurant quant à la protection de la vie privée et la gestion des données personnelles. Des éléments visuels ou textuels peuvent y contribuer.
    *   // TEST: La page inspire confiance quant à la gestion des données.

## 6. Technologie (Rappel)
*   Next.js (comme spécifié dans [`docs/01_exigences_fonctionnelles_globales.md`](docs/01_exigences_fonctionnelles_globales.md:10)).