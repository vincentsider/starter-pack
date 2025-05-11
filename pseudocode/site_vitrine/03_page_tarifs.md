# Pseudocode : Page "Tarifs" / "Nos Offres" du Site Vitrine SerenKall

## 1. Variables Globales et Données Initiales (Côté Serveur ou Fichier de Configuration)

```plaintext
// FICHIER: /config/pricing_data.json (ou équivalent, chargé dynamiquement)
// DESCRIPTION: Contient toutes les informations nécessaires pour afficher la page des tarifs.
//              Les prix doivent être gérés de manière sécurisée, potentiellement via une API si dynamiques.

pricingData = {
  pageTitle: "Nos Offres Flexibles pour une Tranquillité d'Esprit Totale",
  metaDescription: "Découvrez les plans et tarifs de SerenKall, votre assistant de filtrage d'appels intelligent. Choisissez l'offre adaptée à vos besoins et ne soyez plus jamais dérangé inutilement.",
  introductionText: "SerenKall vous offre la sérénité en filtrant intelligemment vos appels. Découvrez nos offres simples, transparentes et adaptées à chaque besoin.",
  
  // Options de périodicité pour les plans
  periodicityOptions: [
    { id: "monthly", label: "Mensuel", priceMultiplier: 1, default: true },
    { id: "annual", label: "Annuel", priceMultiplier: 0.8, // Exemple: 20% de réduction
      discountLabel: "Économisez 20% !" } 
  ],
  // TEST: Les options de périodicité sont correctement définies, incluant un label d'économie pour l'annuel.

  // Définition des plans tarifaires
  plans: [
    {
      id: "essential",
      name: "Essentiel",
      // Les prix de base sont mensuels. Le calcul annuel se fait avec priceMultiplier.
      basePrice: 9.99, // HT ou TTC à préciser clairement. Ici, supposons TTC.
      currency: "€",
      targetAudience: "Idéal pour les particuliers souhaitant une protection efficace au quotidien.",
      features: [
        { text: "Filtrage IA de base", details: "Bloque les appels indésirables courants.", available: true, icon: "shield-check-outline" },
        { text: "Simulation d'appels (3 scénarios)", available: true, icon: "play-circle-outline" },
        { text: "Notifications par email", available: true, icon: "email-outline" },
        { text: "Liste blanche/noire (10 numéros)", available: true, icon: "format-list-bulleted-type" },
        { text: "Historique des appels (7 jours)", available: true, icon: "history" },
        { text: "Support communautaire", available: true, icon: "account-group-outline" }
      ],
      cta: { text: "Choisir Essentiel", link: "/inscription?plan=essential" },
      isPopular: false
      // TEST: Le plan 'Essentiel' est défini avec ses caractéristiques, prix et CTA.
    },
    {
      id: "advanced",
      name: "Avancé",
      basePrice: 19.99,
      currency: "€",
      targetAudience: "Parfait pour les professionnels et familles actives nécessitant plus de contrôle.",
      features: [
        { text: "Filtrage IA avancé (personnalisable)", available: true, icon: "shield-star-outline" },
        { text: "Simulation d'appels (10 scénarios)", available: true, icon: "play-circle-outline" },
        { text: "Notifications (Email, SMS - 20/mois)", available: true, icon: "message-text-outline" },
        { text: "Liste blanche/noire (50 numéros)", available: true, icon: "format-list-bulleted-type" },
        { text: "Personnalisation des messages IA (basique)", available: true, icon: "account-voice" },
        { text: "Historique des appels (30 jours)", available: true, icon: "history" },
        { text: "Support par email prioritaire", available: true, icon: "email-fast-outline" }
      ],
      cta: { text: "Je Prends l'Avancé", link: "/inscription?plan=advanced" },
      isPopular: true
      // TEST: Le plan 'Avancé' (populaire) est défini avec ses caractéristiques, prix et CTA.
    },
    {
      id: "premium",
      name: "Premium",
      basePrice: 29.99,
      currency: "€",
      targetAudience: "La solution complète pour une tranquillité maximale et des fonctionnalités expertes.",
      features: [
        { text: "Filtrage IA expert (deep learning)", available: true, icon: "shield-airplane-outline" },
        { text: "Simulation d'appels (illimité)", available: true, icon: "play-circle-outline" },
        { text: "Notifications (Email, SMS illimité, Push)", available: true, icon: "cellphone-message" },
        { text: "Liste blanche/noire (illimité)", available: true, icon: "format-list-bulleted-type" },
        { text: "Personnalisation des messages IA (avancée)", available: true, icon: "account-voice" },
        { text: "Historique des appels (illimité)", available: true, icon: "history" },
        { text: "Support téléphonique dédié", available: true, icon: "phone-outline" },
        { text: "Accès API (bêta)", available: true, icon: "api" }
      ],
      cta: { text: "Opter pour Premium", link: "/inscription?plan=premium" },
      isPopular: false
      // TEST: Le plan 'Premium' est défini avec ses caractéristiques, prix et CTA.
    }
  ],
  // TEST: La liste des plans est complète et chaque plan a les attributs nécessaires.

  // Informations pour le tableau comparatif
  featureComparison: {
    title: "Comparez en un Coup d'Œil Toutes Nos Fonctionnalités",
    // Liste de toutes les fonctionnalités uniques avec un ID pour le mapping
    // Les 'groups' permettent de structurer le tableau pour une meilleure lisibilité
    featureGroups: [
      {
        name: "Filtrage & Intelligence",
        features: [
          { id: "filtering_level", name: "Niveau de Filtrage IA" },
          { id: "call_simulation", name: "Simulation d'appels (Scénarios)" },
          { id: "ai_message_customization", name: "Personnalisation Message IA" }
        ]
      },
      {
        name: "Gestion & Contrôle",
        features: [
          { id: "white_black_list", name: "Liste Blanche/Noire (Nb entrées)" },
          { id: "call_history", name: "Historique des Appels" }
        ]
      },
      {
        name: "Notifications & Support",
        features: [
          { id: "notifications", name: "Types de Notifications" },
          { id: "support_level", name: "Niveau de Support" }
        ]
      },
      {
        name: "Fonctionnalités Avancées",
        features: [
          { id: "api_access", name: "Accès API" }
        ]
      }
    ],
    // Valeurs des fonctionnalités pour chaque plan
    planFeatureValues: {
      essential: {
        filtering_level: "Basique",
        call_simulation: "3",
        ai_message_customization: "Non",
        white_black_list: "10",
        call_history: "7 jours",
        notifications: "Email",
        support_level: "Communautaire",
        api_access: "Non"
      },
      advanced: {
        filtering_level: "Avancé",
        call_simulation: "10",
        ai_message_customization: "Basique",
        white_black_list: "50",
        call_history: "30 jours",
        notifications: "Email, SMS (20/mois)",
        support_level: "Email Prioritaire",
        api_access: "Non"
      },
      premium: {
        filtering_level: "Expert",
        call_simulation: "Illimité",
        ai_message_customization: "Avancée",
        white_black_list: "Illimité",
        call_history: "Illimité",
        notifications: "Email, SMS, Push",
        support_level: "Téléphonique Dédié",
        api_access: "Oui (Bêta)"
      }
    }
    // TEST: Les données pour le tableau comparatif sont structurées et complètes.
  },

  // Offre sur mesure
  customOffer: {
    display: true, // Afficher ou non cette section
    title: "Une Solution Adaptée à Votre Entreprise ?",
    text: "Pour des volumes d'appels importants, des besoins d'intégration spécifiques ou des fonctionnalités sur mesure, notre équipe est à votre écoute pour élaborer une offre personnalisée.",
    cta: { text: "Contactez Notre Équipe Commerciale", link: "/contact?reason=custom_enterprise_offer" }
    // TEST: La section d'offre sur mesure est configurable et contient les textes nécessaires.
  },

  // FAQ
  faq: {
    title: "Vos Questions sur Nos Tarifs",
    items: [
      { 
        question: "Y a-t-il une période d'essai gratuite ?", 
        answer: "Oui, tous nos plans bénéficient d'une période d'essai gratuite de 7 jours, sans engagement. Vous pourrez tester l'ensemble des fonctionnalités du plan choisi." 
        // TEST: La Q/R sur l'essai gratuit est présente et claire.
      },
      { 
        question: "Puis-je changer de plan facilement ?", 
        answer: "Absolument ! Vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre espace client. La facturation sera ajustée au prorata." 
        // TEST: La Q/R sur le changement de plan est présente et claire.
      },
      { 
        question: "Quels sont les moyens de paiement acceptés ?", 
        answer: "Nous acceptons les principales cartes de crédit (Visa, MasterCard, American Express) ainsi que les paiements via PayPal. Pour les plans Entreprise, les virements SEPA sont possibles." 
      },
      { 
        question: "Y a-t-il des frais cachés ou des coûts d'installation ?", 
        answer: "Non, la transparence est primordiale chez SerenKall. Les prix affichés sont tout compris, sans frais d'installation ni coûts cachés." 
      },
      { 
        question: "Puis-je annuler mon abonnement à tout moment ?", 
        answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client. L'accès au service restera actif jusqu'à la fin de la période de facturation en cours." 
      }
    ]
    // TEST: La section FAQ contient les questions et réponses pertinentes.
  },

  // Réassurance
  reassurance: {
    items: [
      { text: "Paiement 100% Sécurisé", icon: "lock-closed-outline", details: "Transactions protégées par cryptage SSL." },
      { text: "Annulable à Tout Moment", icon: "calendar-remove-outline", details: "Aucun engagement à long terme." },
      { text: "Support Réactif", icon: "face-agent", details: "Notre équipe est là pour vous aider." }
    ],
    finalCta: { 
      text: "Prêt à retrouver votre tranquillité ?", 
      link: "#", // Lien vers le haut de la page ou vers les plans
      subtext: "Choisissez le plan qui vous convient le mieux !"
    }
    // TEST: Les éléments de réassurance et le CTA final sont définis.
  },

  // Mention légale sur les prix (HT/TTC)
  priceDisclaimer: "Tous les prix sont affichés en Euros (€) et incluent la TVA applicable."
  // TEST: La mention légale sur les prix (TVA) est présente.
}

// ÉTAT LOCAL (Géré par le JavaScript côté client)
currentPeriodicityId = pricingData.periodicityOptions.find(p => p.default).id // Ex: "monthly"
// TEST: L'état initial de la périodicité est correctement défini.
```

## 2. Structure de la Page (HTML avec Composants Pseudocode)

```html_pseudocode
<!-- Page: /tarifs -->
<main class="pricing-page">

  <!-- Section 1: Titre Principal et Introduction -->
  <section id="pricing-header" class="page-section">
    <PricingPageHeader 
      title="{{pricingData.pageTitle}}" 
      introduction="{{pricingData.introductionText}}" />
    
    IF pricingData.periodicityOptions.length > 1 THEN
      <PeriodicitySelector 
        options="{{pricingData.periodicityOptions}}"
        currentSelection="{{currentPeriodicityId}}"
        onChange="CALLBACK handlePeriodicityChange" />
      // TEST: Le sélecteur de périodicité est affiché si plusieurs options existent.
    END IF
  </section>

  <!-- Section 2: Présentation des Offres/Plans Individuels -->
  <section id="pricing-plans" class="page-section">
    <div class="plans-grid">
      FOR EACH plan IN pricingData.plans:
        <PricingPlanCard 
          planData="{{plan}}"
          currentPeriodicityId="{{currentPeriodicityId}}"
          periodicityOptions="{{pricingData.periodicityOptions}}"
          priceDisclaimer="{{pricingData.priceDisclaimer}}" />
        // TEST: Une carte est générée pour chaque plan défini dans pricingData.
      END LOOP
    </div>
    IF pricingData.priceDisclaimer THEN
      <p class="price-disclaimer-text">{{pricingData.priceDisclaimer}}</p>
      // TEST: La mention légale sur les prix est affichée si définie.
    END IF
  </section>

  <!-- Section 3: Tableau Comparatif Détaillé -->
  IF pricingData.featureComparison AND pricingData.plans.length > 1 THEN
    <section id="feature-comparison-table" class="page-section">
      <FeatureComparisonTable
        title="{{pricingData.featureComparison.title}}"
        featureGroups="{{pricingData.featureComparison.featureGroups}}"
        plans="{{pricingData.plans}}"
        planFeatureValues="{{pricingData.featureComparison.planFeatureValues}}"
        currentPeriodicityId="{{currentPeriodicityId}}"
        periodicityOptions="{{pricingData.periodicityOptions}}"
        priceDisclaimer="{{pricingData.priceDisclaimer}}" />
      // TEST: Le tableau comparatif est affiché s'il est défini et qu'il y a plus d'un plan.
    </section>
  END IF

  <!-- Section 4: Offre "Sur Mesure" -->
  IF pricingData.customOffer AND pricingData.customOffer.display THEN
    <section id="custom-offer" class="page-section">
      <CustomPlanSection
        title="{{pricingData.customOffer.title}}"
        text="{{pricingData.customOffer.text}}"
        cta="{{pricingData.customOffer.cta}}" />
      // TEST: La section offre sur mesure est affichée si configurée.
    </section>
  END IF

  <!-- Section 5: Questions Fréquentes (FAQ) -->
  IF pricingData.faq AND pricingData.faq.items.length > 0 THEN
    <section id="pricing-faq" class="page-section">
      <PricingFAQ
        title="{{pricingData.faq.title}}"
        items="{{pricingData.faq.items}}" />
      // TEST: La section FAQ est affichée si des items sont définis.
    </section>
  END IF

  <!-- Section 6: Éléments de Réassurance et Appel à l'Action Final -->
  <section id="pricing-reassurance" class="page-section">
    <PricingReassuranceAndFinalCTA
      reassuranceItems="{{pricingData.reassurance.items}}"
      finalCta="{{pricingData.reassurance.finalCta}}" />
    // TEST: La section de réassurance et CTA final est toujours affichée.
  </section>

</main>
```

## 3. Pseudocode des Composants

### Composant : `PricingPageHeader`
```pseudocode
COMPONENT PricingPageHeader (title, introduction)
  PROPS:
    title: String // Titre principal de la page
    introduction: String // Texte d'introduction

  RENDER
    DIV class="header-content"
      H1 text="{{title}}"
      // TEST: Le titre est correctement affiché.
      P text="{{introduction}}"
      // TEST: L'introduction est correctement affichée.
    END DIV
END COMPONENT
```

### Composant : `PeriodicitySelector`
```pseudocode
COMPONENT PeriodicitySelector (options, currentSelection, onChange)
  PROPS:
    options: Array of {id, label, discountLabel}
    currentSelection: String // id de l'option courante
    onChange: Function // Callback appelé avec le nouvel id sélectionné

  RENDER
    DIV class="periodicity-selector"
      FOR EACH option IN options:
        BUTTON class="{{IF option.id IS currentSelection THEN 'active' END IF}}"
               onClick="CALLBACK onChange(option.id)"
          SPAN text="{{option.label}}"
          IF option.discountLabel THEN
            SPAN class="discount-badge" text="{{option.discountLabel}}"
            // TEST: Le badge de réduction est affiché si discountLabel existe.
          END IF
        END BUTTON
        // TEST: Un bouton est créé pour chaque option de périodicité.
      END LOOP
    END DIV

  LOGIC
    FUNCTION handlePeriodicityChange(newPeriodicityId)
      // Met à jour l'état global `currentPeriodicityId`
      // Redéclenche le rendu des composants dépendants (Prix des plans)
      // TEST: Le changement de périodicité met à jour l'état et déclenche un re-rendu des prix.
    END FUNCTION
END COMPONENT
```

### Composant : `PricingPlanCard`
```pseudocode
COMPONENT PricingPlanCard (planData, currentPeriodicityId, periodicityOptions, priceDisclaimer)
  PROPS:
    planData: Object // {id, name, basePrice, currency, targetAudience, features, cta, isPopular}
    currentPeriodicityId: String
    periodicityOptions: Array
    priceDisclaimer: String // Mention HT/TTC globale (peut être redondante si déjà affichée globalement)

  STATE:
    displayPrice: String // Prix calculé à afficher

  ON_INIT OR ON_PROPS_CHANGE([planData, currentPeriodicityId, periodicityOptions]):
    selectedPeriodicity = periodicityOptions.find(p => p.id IS currentPeriodicityId)
    IF selectedPeriodicity.id IS "annual" THEN
      actualPrice = planData.basePrice * selectedPeriodicity.priceMultiplier * 12 // Supposant que basePrice est mensuel
      priceSuffix = "/an"
    ELSE
      actualPrice = planData.basePrice * selectedPeriodicity.priceMultiplier
      priceSuffix = "/mois"
    END IF
    // Formater le prix avec 2 décimales, la devise, etc.
    displayPrice = formatCurrency(actualPrice, planData.currency) + priceSuffix
    // TEST: Le prix affiché est correctement calculé et formaté en fonction de la périodicité.

  RENDER
    DIV class="plan-card {{IF planData.isPopular THEN 'popular' END IF}}"
      IF planData.isPopular THEN
        DIV class="popular-badge" text="Le plus populaire"
        // TEST: Le badge "populaire" est affiché si isPopular est true.
      END IF
      H3 class="plan-name" text="{{planData.name}}"
      // TEST: Le nom du plan est affiché.
      DIV class="plan-price" text="{{displayPrice}}"
      // TEST: Le prix calculé est affiché.
      P class="plan-target" text="{{planData.targetAudience}}"
      // TEST: La cible du plan est affichée.
      UL class="plan-features-list">
        FOR EACH feature IN planData.features:
          LI class="{{IF feature.available THEN 'available' ELSE 'unavailable' END IF}}"
            Icon name="{{feature.icon}}" // Composant Icône
            SPAN text="{{feature.text}}"
            IF feature.details THEN
              SPAN class="feature-details" text="{{feature.details}}"
            END IF
            // TEST: Chaque fonctionnalité est listée avec son statut (disponible/indisponible) et icône.
          END LI
        END LOOP
      END UL
      A href="{{planData.cta.link}}" class="cta-button plan-cta"
        SPAN text="{{planData.cta.text}}"
      END A
      // TEST: Le CTA du plan est correctement affiché et lié.
    END DIV
END COMPONENT
```

### Composant : `FeatureComparisonTable`
```pseudocode
COMPONENT FeatureComparisonTable (title, featureGroups, plans, planFeatureValues, currentPeriodicityId, periodicityOptions, priceDisclaimer)
  PROPS:
    title: String
    featureGroups: Array of { name, features: Array of {id, name} }
    plans: Array of Plan Objects
    planFeatureValues: Object // { planId: { featureId: value } }
    // currentPeriodicityId, periodicityOptions, priceDisclaimer pour afficher les prix des plans dans les entêtes de colonnes

  RENDER
    DIV class="comparison-table-container"
      H2 text="{{title}}"
      // TEST: Le titre du tableau est affiché.
      TABLE class="comparison-table"
        THEAD
          TR
            TH // Coin vide ou "Fonctionnalités"
            FOR EACH plan IN plans:
              TH class="plan-header-cell"
                DIV class="plan-name-table" text="{{plan.name}}"
                // Afficher le prix du plan (calculé comme dans PricingPlanCard)
                currentPlanPeriodicity = periodicityOptions.find(p => p.id IS currentPeriodicityId)
                IF currentPlanPeriodicity.id IS "annual" THEN
                  planPrice = plan.basePrice * currentPlanPeriodicity.priceMultiplier * 12
                  planPriceSuffix = "/an"
                ELSE
                  planPrice = plan.basePrice * currentPlanPeriodicity.priceMultiplier
                  planPriceSuffix = "/mois"
                END IF
                priceText = formatCurrency(planPrice, plan.currency) + planPriceSuffix
                DIV class="plan-price-table" text="{{priceText}}"
                // TEST: Le nom et le prix de chaque plan sont affichés en en-tête de colonne.
                A href="{{plan.cta.link}}" class="cta-button-small" text="{{plan.cta.text}}"
                // TEST: Un CTA est présent pour chaque plan dans l'en-tête.
              END TH
            END LOOP
          END TR
        END THEAD
        TBODY
          FOR EACH group IN featureGroups:
            TR class="group-header-row"
              TD colspan="{{plans.length + 1}}" text="{{group.name}}"
              // TEST: Un en-tête de groupe de fonctionnalités est affiché.
            END TR
            FOR EACH feature IN group.features:
              TR class="feature-row"
                TD class="feature-name-cell" text="{{feature.name}}"
                // TEST: Le nom de la fonctionnalité est affiché.
                FOR EACH plan IN plans:
                  TD class="feature-value-cell"
                    value = planFeatureValues[plan.id][feature.id]
                    IF value IS "Oui" OR value IS true THEN
                      Icon name="check-bold" class="icon-yes"
                    ELSE IF value IS "Non" OR value IS false THEN
                      Icon name="close-thick" class="icon-no"
                    ELSE
                      SPAN text="{{value}}" // Pour les limitations textuelles
                    END IF
                    // TEST: La valeur de la fonctionnalité pour chaque plan est correctement affichée (coche, croix, ou texte).
                  END TD
                END LOOP
              END TR
            END LOOP
          END LOOP
        END TBODY
      END TABLE
      IF priceDisclaimer THEN
        P class="price-disclaimer-text-table" text="{{priceDisclaimer}}"
        // TEST: La mention légale sur les prix est affichée sous le tableau si définie.
      END IF
    END DIV
END COMPONENT
```

### Composant : `CustomPlanSection`
```pseudocode
COMPONENT CustomPlanSection (title, text, cta)
  PROPS:
    title: String
    text: String
    cta: Object // {text, link}

  RENDER
    DIV class="custom-plan-section"
      H2 text="{{title}}"
      // TEST: Le titre de la section sur mesure est affiché.
      P text="{{text}}"
      // TEST: Le texte explicatif est affiché.
      A href="{{cta.link}}" class="cta-button"
        SPAN text="{{cta.text}}"
      END A
      // TEST: Le CTA pour l'offre sur mesure est affiché et lié.
    END DIV
END COMPONENT
```

### Composant : `PricingFAQ`
```pseudocode
COMPONENT PricingFAQ (title, items)
  PROPS:
    title: String
    items: Array of {question, answer}

  RENDER
    DIV class="faq-section"
      H2 text="{{title}}"
      // TEST: Le titre de la FAQ est affiché.
      DIV class="faq-list">
        FOR EACH item IN items:
          AccordionItem // Composant réutilisable pour un accordéon
            titleContent: item.question
            bodyContent: item.answer
            // TEST: Chaque Q/R est affichée sous forme d'item d'accordéon.
          END AccordionItem
        END LOOP
      END DIV
    END DIV
END COMPONENT
```

### Composant : `PricingReassuranceAndFinalCTA`
```pseudocode
COMPONENT PricingReassuranceAndFinalCTA (reassuranceItems, finalCta)
  PROPS:
    reassuranceItems: Array of {text, icon, details}
    finalCta: Object // {text, link, subtext}

  RENDER
    DIV class="reassurance-cta-section"
      DIV class="reassurance-items-grid">
        FOR EACH item IN reassuranceItems:
          DIV class="reassurance-item"
            Icon name="{{item.icon}}"
            H4 text="{{item.text}}"
            IF item.details THEN
              P text="{{item.details}}"
            END IF
            // TEST: Chaque élément de réassurance est affiché avec icône et texte.
          END DIV
        END LOOP
      END DIV
      DIV class="final-cta-block"
        H3 text="{{finalCta.text}}"
        IF finalCta.subtext THEN
          P text="{{finalCta.subtext}}"
        END IF
        A href="{{finalCta.link}}" class="cta-button large-cta"
          SPAN text="{{finalCta.text}}" // Ou un texte plus générique comme "Voir les offres"
        END A
        // TEST: Le CTA final est affiché avec son texte et lien.
      END DIV
    END DIV
END COMPONENT
```

## 4. Logique JavaScript (Simplifiée)

```javascript
// Fichier: /public/js/pricing_page.js

// État (simplifié, dans un contexte de framework ce serait plus structuré)
let currentPeriodicityId = pricingData.periodicityOptions.find(p => p.default).id;

// Fonction pour mettre à jour les prix affichés (et potentiellement d'autres éléments)
function updateDisplayedPrices() {
  // Parcourir tous les éléments .plan-price et les mettre à jour
  // Parcourir les en-têtes du tableau comparatif et mettre à jour les prix
  // Cette fonction serait appelée par handlePeriodicityChange
  // Elle utiliserait pricingData et currentPeriodicityId pour recalculer et réafficher.
  // TEST: La fonction updateDisplayedPrices recalcule et met à jour tous les prix sur la page.
  console.log("Mise à jour des prix pour la périodicité : ", currentPeriodicityId);
}

// Gestionnaire pour le changement de périodicité
function handlePeriodicityChange(newId) {
  if (newId !== currentPeriodicityId) {
    currentPeriodicityId = newId;
    // Mettre à jour l'UI du sélecteur (classe 'active')
    // Appeler updateDisplayedPrices()
    // TEST: handlePeriodicityChange met à jour l'état et appelle la mise à jour de l'affichage.
    console.log("Périodicité changée en : ", newId);
    updateDisplayedPrices(); 
  }
}

// Initialisation (exemple très basique)
// Dans un vrai scénario, cela impliquerait le rendu des composants avec un moteur de template ou un framework.
document.addEventListener('DOMContentLoaded', () => {
  // Attacher les gestionnaires d'événements aux boutons du PeriodicitySelector, etc.
  // Exemple:
  // const periodicityButtons = document.querySelectorAll('.periodicity-selector button');
  // periodicityButtons.forEach(button => {
  //   button.addEventListener('click', () => {
  //     const selectedId = button.dataset.periodicityId; // Supposons que l'id est stocké dans un data-attribute
  //     handlePeriodicityChange(selectedId);
  //   });
  // });
  console.log("Page Tarifs initialisée.");
  updateDisplayedPrices(); // Afficher les prix initiaux correctement
  // TEST: L'initialisation de la page attache les événements et affiche les prix initiaux.
});

// Helper function (exemple)
function formatCurrency(amount, currencySymbol) {
  // Logique pour formater le nombre en devise (ex: 9.99€)
  // TEST: formatCurrency formate correctement un nombre en chaîne de devise.
  return `${currencySymbol}${Number(amount).toFixed(2).replace('.', ',')}`; 
}
```

Ce pseudocode détaille la structure, les composants et une logique de base pour la page des tarifs. Il inclut des ancres de test pour guider le développement TDD. Les données sont externalisées pour une meilleure gestion.