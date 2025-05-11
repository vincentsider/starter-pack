# Spécifications : Page "Tarifs" / "Nos Offres" du Site Vitrine SerenKall

## 1. Objectifs de la Page "Tarifs"

*   Présenter clairement les différentes offres ou plans d'abonnement SerenKall.
*   Permettre aux utilisateurs de comprendre facilement les fonctionnalités et limitations incluses dans chaque plan.
*   Faciliter la comparaison objective entre les différentes offres proposées.
*   Inciter l'utilisateur à choisir un plan adapté et à procéder à l'inscription ou à la prise de contact pour une offre sur mesure.
*   Rassurer l'utilisateur sur la transparence des prix, l'absence de coûts cachés et la flexibilité des offres.
    *   // TEST: Les objectifs principaux de la page Tarifs sont bien définis et alignés avec les besoins utilisateurs.

## 2. Structure et Contenu Détaillé

### Section 1 : Titre Principal et Introduction
*   **Composant :** `PricingPageHeader`
*   **Contenu :**
    *   **Titre :** Ex: "Des Offres Flexibles pour une Tranquillité d'Esprit Totale", "Choisissez Votre Bouclier SerenKall".
        *   // TEST: Le titre est engageant, clair et en lien avec le service SerenKall.
    *   **Introduction :** Courte phrase soulignant la valeur du service (ex: ne plus être dérangé inutilement) et invitant à découvrir les plans. Mentionner la simplicité et la transparence des offres.
        *   // TEST: L'introduction est concise et motive l'exploration des plans.
    *   **Sélecteur de Périodicité (si applicable et proposé) :**
        *   **Composant :** `PeriodicitySelector`
        *   **Options :** Boutons "Mensuel" / "Annuel".
        *   **Indication :** Mettre en évidence l'économie réalisée avec l'engagement annuel (ex: "Économisez XX% avec l'offre annuelle !").
        *   **Logique :** La sélection met à jour dynamiquement les prix affichés dans les plans.
            *   // TEST: Si une périodicité variable est offerte, le sélecteur est présent, fonctionnel et l'avantage annuel est clair.

### Section 2 : Présentation des Offres/Plans Individuels
*   **Composant :** `PricingPlansDisplay` (itérant sur `PricingPlanCard`)
*   **Structure par plan (ex: "Essentiel", "Avancé", "Premium" ou "Particulier", "Pro", "Entreprise") :**
    *   **Composant :** `PricingPlanCard`
    *   **Nom du Plan :** Clair, distinctif et mémorisable.
        *   // TEST: Chaque plan possède un nom unique et descriptif.
    *   **Prix :** Affiché en grand, avec la devise (€) et la périodicité (ex: "/mois" ou "/an" en fonction du sélecteur). Préciser clairement si le prix est HT ou TTC (conformité légale).
        *   // TEST: Le prix de chaque plan est visible, exact, et les mentions HT/TTC sont présentes.
    *   **Description/Cible du Plan :** Une ou deux phrases résumant à qui s'adresse principalement le plan et son bénéfice principal (ex: "Idéal pour un usage personnel et une protection efficace au quotidien", "Conçu pour les professionnels et petites équipes nécessitant des fonctionnalités avancées").
        *   // TEST: La cible et le bénéfice principal de chaque plan sont clairement énoncés.
    *   **Liste des Fonctionnalités Clés Incluses :**
        *   Utilisation de puces (bullet points) avec des icônes distinctives pour chaque fonctionnalité.
        *   Exemples : "Filtrage IA illimité", "Simulation d'appels (X scénarios)", "Notifications (Email, SMS)", "Personnalisation des règles (Standard/Avancée)", "Historique des appels (X jours)", "Support (Standard/Prioritaire)".
        *   Mettre en évidence les limitations si elles existent pour ce plan.
            *   // TEST: Les fonctionnalités clés de chaque plan sont listées de manière lisible et les limitations sont claires.
    *   **Appel à l'Action (CTA) Spécifique au Plan :**
        *   Bouton avec texte clair : Ex: "Choisir Essentiel", "Je Prends l'Avancé", "Contactez-nous" (pour plan Entreprise/Sur Mesure).
        *   Lien direct vers la page d'inscription (pré-sélectionnant ce plan si possible) ou vers un formulaire de contact spécifique.
            *   // TEST: Chaque plan dispose d'un CTA distinct, menant à l'action appropriée.
    *   **Badge "Le Plus Populaire" (Optionnel) :** Peut être appliqué à un plan pour guider l'utilisateur.
        *   // TEST: Un badge "populaire" peut être utilisé judicieusement.
    *   **Design :** Cartes de plans visuellement distinctes, hiérarchie de l'information claire.
        *   // TEST: La présentation visuelle des plans est soignée, professionnelle et facilite la comparaison rapide.

### Section 3 : Tableau Comparatif Détaillé des Fonctionnalités
*   **Composant :** `FeatureComparisonTable`
*   **Condition d'affichage :** Recommandé si plus de 2 plans ou de nombreuses fonctionnalités à comparer.
*   **Contenu :**
    *   **Sous-titre :** Ex: "Comparez en un Coup d'Œil Toutes Nos Fonctionnalités".
    *   **Structure du Tableau :**
        *   **Lignes :** Liste exhaustive de toutes les fonctionnalités disponibles à travers tous les plans (ex: "Filtrage IA", "Simulation - Scénarios basiques", "Simulation - Scénarios personnalisés", "Liste blanche/noire", "Personnalisation message IA", "Support par email", "Support téléphonique", "Accès API", etc.).
        *   **Colonnes :** Une colonne par plan proposé, plus une colonne pour le nom de la fonctionnalité.
        *   **Cellules :**
            *   Indication de présence : Coche verte (✓), "Oui".
            *   Indication de limitation : Texte précis (ex: "100 appels/mois", "Support Standard").
            *   Indication d'absence : Croix rouge (✗), "Non".
            *   // TEST: Le tableau comparatif est exhaustif, utilise des indicateurs clairs et est facile à interpréter.
        *   Mise en évidence visuelle des différences clés (ex: fond de couleur différent pour certaines cellules/lignes).
            *   // TEST: Les différences majeures entre les plans sont visuellement mises en exergue.
    *   **Appels à l'Action :** Répétition des CTA pour chaque plan en bas du tableau ou en en-tête/pied de colonne (sticky si le tableau est long).
        *   // TEST: Les CTA sont facilement accessibles même après la consultation détaillée du tableau.

### Section 4 : Offre "Sur Mesure" / Besoins Spécifiques (si pertinent)
*   **Composant :** `CustomPlanSection`
*   **Condition d'affichage :** Si SerenKall propose des solutions pour grandes entreprises ou des cas d'usage très spécifiques.
*   **Contenu :**
    *   **Titre :** Ex: "Une Solution Adaptée à Votre Grande Entreprise ?", "Besoins Particuliers ? Parlons-en !".
    *   **Texte :** Expliquer que pour des volumes importants, des intégrations spécifiques ou des fonctionnalités non listées, une offre personnalisée peut être élaborée.
        *   // TEST: L'explication pour l'offre sur mesure est claire.
    *   **Appel à l'Action :** Bouton "Contactez Notre Équipe Commerciale", "Demander un Devis Personnalisé".
    *   **Lien :** Vers un formulaire de contact dédié (avec champs spécifiques pour qualifier le besoin) ou affichage direct des coordonnées (email, téléphone).
        *   // TEST: L'option pour les besoins sur mesure est présente avec un CTA clair et un moyen de contact approprié.

### Section 5 : Questions Fréquentes (FAQ) relatives aux Tarifs et à la Facturation
*   **Composant :** `PricingFAQ`
*   **Contenu :**
    *   **Sous-titre :** Ex: "Questions Fréquemment Posées sur Nos Tarifs".
    *   **Liste de Questions/Réponses (accordéon pour la lisibilité) :**
        *   "Y a-t-il une période d'essai gratuite ?" (détails si oui : durée, fonctionnalités incluses/exclues).
        *   "Puis-je changer de plan facilement (upgrade/downgrade) ?" (conditions, prorata).
        *   "Quels sont les moyens de paiement acceptés ?" (CB, SEPA, PayPal, etc.).
        *   "Y a-t-il des frais d'installation ou des coûts cachés ?" (réponse : Non, transparence).
        *   "Offrez-vous des réductions pour les associations, étudiants, ou pour un engagement sur plusieurs années ?"
        *   "Comment fonctionne le cycle de facturation ?" (mensuel/annuel, date de prélèvement).
        *   "Puis-je annuler mon abonnement à tout moment ?" (conditions d'annulation, préavis éventuel).
        *   "Que se passe-t-il si je dépasse les limites de mon plan ?" (ex: pour le nombre d'appels).
            *   // TEST: La section FAQ aborde de manière exhaustive les questions tarifaires et de facturation les plus courantes.
    *   **Lien (si nécessaire) :** Vers une page FAQ plus complète si de nombreuses questions existent.
        *   // TEST: Un lien vers une FAQ plus détaillée est disponible si cela s'avère pertinent.

### Section 6 : Éléments de Réassurance et Appel à l'Action Final
*   **Composant :** `PricingReassuranceAndFinalCTA`
*   **Contenu :**
    *   **Blocs de Réassurance :**
        *   "Garantie Satisfait ou Remboursé X jours" (si applicable, clairement défini).
        *   "Aucun Engagement à Long Terme" (si les plans sont sans engagement ou avec des options flexibles).
        *   Icônes/logos de "Paiement Sécurisé" (Stripe, PayPal, etc.).
        *   Peut-être 1-2 témoignages clients très courts et impactants sur la valeur/prix.
            *   // TEST: Des éléments de réassurance forts sont présents pour conforter la décision de l'utilisateur.
    *   **Appel à l'Action Général (si l'utilisateur est encore indécis) :**
        *   **Texte :** Ex: "Toujours indécis ? Comparez nos plans en détail" (lien ancre vers le tableau), "Prêt à dire adieu aux appels indésirables ?"
        *   **CTA :** "Découvrir les fonctionnalités en détail" (lien vers page Fonctionnalités), ou "Contactez-nous pour un conseil".
            *   // TEST: Un CTA final guide l'utilisateur indécis vers une action pertinente ou une ressource d'aide.

## 3. Points d'Attention Généraux et Techniques

*   **Transparence et Clarté :** Absolument aucun coût caché. Toutes les informations tarifaires (HT/TTC, devise) doivent être limpides.
    *   // TEST: La transparence des prix est irréprochable, et toutes les mentions légales sont présentes.
*   **Simplicité de Compréhension :** Les offres doivent être faciles à comprendre et à comparer. Éviter la complexité inutile.
    *   // TEST: Les offres sont structurées de manière simple et leur compréhension est immédiate.
*   **Mise en Avant de la Valeur :** Chaque plan doit clairement communiquer la valeur qu'il apporte par rapport à son coût.
    *   // TEST: La proposition de valeur de chaque plan est évidente.
*   **Design et UX :** Mise en page aérée, professionnelle, utilisation judicieuse des couleurs et de la typographie pour faciliter la lecture et inspirer confiance. La comparaison doit être intuitive.
    *   // TEST: La mise en page est esthétique, fonctionnelle et favorise une bonne expérience utilisateur.
*   **CTA Proéminents :** Les boutons d'appel à l'action doivent être visuellement distincts et incitatifs.
    *   // TEST: Les CTA sont clairs, visibles et incitent à l'action.
*   **Cohérence :** Les informations (fonctionnalités listées, prix) doivent être strictement cohérentes avec celles présentées sur les autres pages du site (notamment la page Fonctionnalités).
    *   // TEST: La cohérence des informations tarifaires est assurée avec le reste du site.
*   **Responsive Design :** La page doit être parfaitement lisible et fonctionnelle sur tous les appareils (mobile, tablette, ordinateur).
    *   // TEST: La page des tarifs est intégralement responsive.
*   **Devise :** Indiquer clairement la devise des prix (ex: €, $, etc.).
    *   // TEST: La devise utilisée pour les prix est explicitement mentionnée.
*   **Performance :** Optimisation du temps de chargement (images, scripts).
    *   // TEST: La page se charge rapidement.
*   **Accessibilité (WCAG) :** Respect des normes d'accessibilité.
    *   // TEST: La page est accessible aux utilisateurs ayant des handicaps.

## 4. Données Nécessaires (Exemple de structure)
```json
{
  "pageTitle": "Nos Offres SerenKall",
  "metaDescription": "Découvrez les tarifs et plans de SerenKall pour filtrer vos appels...",
  "introduction": "Choisissez le plan SerenKall adapté à vos besoins...",
  "periodicityOptions": [
    { "id": "monthly", "label": "Mensuel", "discountLabel": null },
    { "id": "annual", "label": "Annuel", "discountLabel": "Économisez 20% !" }
  ],
  "plans": [
    {
      "id": "essential",
      "name": "Essentiel",
      "price": { "monthly": "9.99", "annual": "95.90" }, // Prix TTC ou HT selon la politique
      "currency": "€",
      "priceSuffix": "/mois", // S'adapte avec la périodicité
      "target": "Idéal pour les particuliers.",
      "features": [
        { "text": "Filtrage IA illimité", "icon": "shield-check", "available": true },
        { "text": "Simulation d'appels (3 scénarios)", "icon": "play-circle", "available": true },
        // ...
      ],
      "cta": { "text": "Choisir Essentiel", "link": "/inscription?plan=essential" },
      "isPopular": false
    },
    // ... autres plans
  ],
  "featureComparison": {
    "title": "Comparez nos plans en détail",
    "features": [ // Liste de toutes les fonctionnalités uniques pour les lignes du tableau
      { "id": "unlimited_filtering", "name": "Filtrage IA illimité" },
      { "id": "simulation_basic", "name": "Simulation (Scénarios basiques)"},
      // ...
    ],
    // Les plans auront des mappings vers ces features: plan.featureValues[feature_id] = "Oui" / "Non" / "Limite"
  },
  "customOffer": {
    "title": "Besoin d'une offre sur mesure ?",
    "text": "Pour les grandes entreprises...",
    "cta": { "text": "Contactez-nous", "link": "/contact?reason=custom_offer" }
  },
  "faq": {
    "title": "Questions Fréquentes",
    "items": [
      { "question": "Essai gratuit ?", "answer": "Oui, nous offrons un essai de 7 jours..." },
      // ...
    ]
  },
  "reassurance": {
    "items": [
      { "text": "Paiement 100% sécurisé", "icon": "lock-closed" },
      { "text": "Annulable à tout moment" }
    ],
    "finalCta": { "text": "Prêt à tester ?", "link": "/inscription" }
  }
}
```
*   // TEST: La structure des données nécessaires pour la page est bien définie et couvre tous les aspects.