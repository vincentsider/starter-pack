# Spécifications : Page "Contact & Demande de Démo" du Site Vitrine SerenKall

## 1. Objectifs de la Page "Contact & Demande de Démo"

*   Fournir aux visiteurs un moyen simple et direct de contacter l'équipe SerenKall pour des questions générales, du support commercial ou des partenariats.
*   Permettre aux prospects intéressés de solliciter une démonstration personnalisée du produit.
*   Collecter les informations de contact des prospects de manière structurée et sécurisée.
*   Rassurer l'utilisateur sur la prise en charge rapide de sa demande.
*   Afficher des informations de contact alternatives si disponibles (email, téléphone, adresse).
    *   // TEST: Les objectifs principaux de la page Contact sont clairs et orientés utilisateur/business.

## 2. Structure et Contenu Détaillé

### Section 1 : Titre Principal et Introduction
*   **Composant :** `ContactPageHeader`
*   **Contenu :**
    *   **Titre :** Ex: "Contactez-Nous", "Une Question ? Envie d'une Démo ? Parlons-en !", "Entrons en Contact".
        *   // TEST: Le titre est accueillant et indique clairement le but de la page.
    *   **Introduction :** Courte phrase encourageant le contact. Ex: "Notre équipe est à votre écoute pour répondre à toutes vos questions ou pour vous présenter SerenKall en action. N'hésitez pas à remplir le formulaire ci-dessous ou à utiliser nos autres canaux de contact."
        *   // TEST: L'introduction est engageante et informative.

### Section 2 : Formulaire de Contact / Demande de Démo
*   **Composant :** `ContactForm`
*   **Champs du formulaire :**
    *   **Nom Complet\*** (Champ texte) - `fullName`
        *   Validation : Requis, minimum 2 caractères.
        *   // TEST: Le champ Nom Complet est présent, requis et a des règles de validation.
    *   **Adresse Email\*** (Champ email) - `email`
        *   Validation : Requis, format email valide.
        *   // TEST: Le champ Email est présent, requis et valide le format email.
    *   **Numéro de Téléphone** (Champ tel, optionnel mais recommandé pour démo) - `phoneNumber`
        *   Validation : Format numéro de téléphone (peut être flexible internationalement ou ciblé).
        *   // TEST: Le champ Téléphone est présent et a une validation de format (si possible).
    *   **Nom de l'Entreprise** (Champ texte, optionnel, pertinent si B2B) - `companyName`
        *   Validation : Aucun si optionnel, ou min caractères si requis dans certains contextes.
        *   // TEST: Le champ Nom de l'Entreprise est présent.
    *   **Sujet de la Demande\*** (Liste déroulante ou boutons radio) - `requestSubject`
        *   Options :
            *   "Question générale"
            *   "Demande de démonstration"
            *   "Support commercial / Devis"
            *   "Partenariat"
            *   "Autre (précisez dans votre message)"
        *   Validation : Requis.
        *   // TEST: Le champ Sujet est présent, requis, et offre des options pertinentes.
    *   **Votre Message\*** (Zone de texte multiligne) - `message`
        *   Validation : Requis, minimum 10 caractères, maximum 2000 caractères.
        *   Placeholder : Ex: "Décrivez votre besoin ou votre question ici..."
        *   // TEST: Le champ Message est présent, requis et a des limites de longueur.
    *   **Champs conditionnels pour "Demande de démonstration" :** (Peuvent apparaître si ce sujet est sélectionné)
        *   **Nombre d'utilisateurs envisagés** (Liste déroulante : "1-5", "6-20", "21-50", "50+") - `demoUserCount`
            *   // TEST: Si demande de démo, le champ Nombre d'utilisateurs est disponible.
        *   **Date/Heure préférée pour la démo** (Sélecteur de date/heure ou simple indication) - `demoPreferredDateTime`
            *   Préciser que c'est indicatif et sera confirmé.
            *   // TEST: Si demande de démo, un champ pour les préférences de date/heure est disponible.
    *   **Case à cocher RGPD\*** : "J'accepte que mes données soient traitées conformément à la [Politique de Confidentialité](/politique-confidentialite) pour répondre à ma demande." - `consentRGPD`
        *   Validation : Requis (la case doit être cochée).
        *   // TEST: La case de consentement RGPD est présente, requise, et liée à la politique de confidentialité.
*   **Bouton d'Envoi :**
    *   Texte : Ex: "Envoyer le Message", "Demander une Démo". Le texte peut s'adapter au sujet sélectionné.
    *   // TEST: Le bouton d'envoi est clair et son texte peut être dynamique.
*   **Gestion des erreurs :**
    *   Messages d'erreur clairs sous chaque champ invalide.
    *   Message d'erreur global en cas d'échec de l'envoi.
    *   // TEST: La gestion des erreurs de validation et d'envoi du formulaire est prévue.
*   **Message de Succès :**
    *   Affiché après envoi réussi (peut remplacer le formulaire ou apparaître au-dessus).
    *   Ex: "Merci ! Votre message a bien été envoyé. Notre équipe vous répondra dans les plus brefs délais (généralement sous 24-48h ouvrées)."
    *   // TEST: Un message de succès clair est affiché après l'envoi.
*   **Sécurité :**
    *   Protection anti-spam (ex: CAPTCHA invisible, honeypot). NON VISIBLE PAR L'UTILISATEUR.
    *   // TEST: Des mesures anti-spam sont prévues (non visibles mais fonctionnelles).
    *   Transmission sécurisée des données (HTTPS est une contrainte globale).

### Section 3 : Autres Moyens de Contact (Optionnel mais recommandé)
*   **Composant :** `AlternativeContactMethods`
*   **Condition d'affichage :** Si l'entreprise souhaite proposer d'autres canaux.
*   **Contenu :**
    *   **Sous-titre :** Ex: "Autres Moyens pour Nous Joindre".
    *   **Adresse Email :**
        *   Si affichée : `contact@serenkall.com` (cliquable avec `mailto:`).
        *   // TEST: L'adresse email de contact est affichée et cliquable si fournie.
    *   **Numéro de Téléphone :**
        *   Si affiché : "+33 X XX XX XX XX" (cliquable avec `tel:`). Préciser les horaires de disponibilité.
        *   // TEST: Le numéro de téléphone est affiché et cliquable si fourni, avec horaires.
    *   **Adresse Postale (si pertinent, ex: siège social) :**
        *   Format standard. Peut inclure un lien vers Google Maps.
        *   // TEST: L'adresse postale est affichée si pertinente.
    *   **Liens vers les Réseaux Sociaux (si actifs professionnellement) :**
        *   Icônes cliquables (LinkedIn, Twitter, etc.).
        *   // TEST: Les liens vers les réseaux sociaux sont présents si des profils existent.

### Section 4 : Carte de Localisation (Optionnel)
*   **Composant :** `LocationMap`
*   **Condition d'affichage :** Si une adresse physique est communiquée et que la localisation est pertinente (ex: pour des rendez-vous).
*   **Contenu :**
    *   Carte interactive (Google Maps Embed, Leaflet, etc.) montrant l'emplacement du bureau/siège.
    *   // TEST: Une carte de localisation est affichée si nécessaire.

## 3. Points d'Attention Généraux et Techniques

*   **Réactivité :** Assurer une réponse rapide aux demandes est crucial (interne à l'entreprise, mais le site peut fixer des attentes).
*   **Simplicité :** Le formulaire ne doit pas être trop long ou décourageant.
*   **Clarté :** Les raisons pour contacter et les actions attendues doivent être claires.
*   **Design et UX :** Page aérée, formulaire facile à remplir, messages d'erreur/succès bien visibles.
    *   // TEST: La page et le formulaire sont bien conçus pour une bonne UX.
*   **Cohérence :** Le design doit être cohérent avec le reste du site.
*   **Responsive Design :** La page et le formulaire doivent être parfaitement utilisables sur tous les appareils.
    *   // TEST: La page Contact est entièrement responsive.
*   **Performance :** Optimisation (ex: chargement du CAPTCHA).
*   **Accessibilité (WCAG) :** Champs de formulaire correctement étiquetés, navigation au clavier possible, etc.
    *   // TEST: Le formulaire respecte les normes d'accessibilité.
*   **Traitement Backend :**
    *   Un endpoint API est nécessaire pour recevoir les données du formulaire.
    *   Validation des données côté serveur (en plus du client).
    *   Envoi de notifications par email à l'équipe SerenKall.
    *   Optionnel : Envoi d'un email de confirmation à l'utilisateur.
    *   Stockage des demandes dans une base de données ou un CRM.
    *   // TEST: Les exigences backend pour le traitement du formulaire sont identifiées.

## 4. Données Nécessaires (Exemple de structure pour la configuration de la page)
```json
{
  "pageTitle": "Contactez SerenKall",
  "metaDescription": "Contactez l'équipe SerenKall pour toute question, demande de démo ou support. Nous sommes là pour vous aider.",
  "header": {
    "title": "Contactez-Nous ou Demandez Votre Démo",
    "introduction": "Remplissez le formulaire ci-dessous, et nous reviendrons vers vous rapidement."
  },
  "form": {
    "showCompanyName": true,
    "subjects": [
      { "value": "general", "label": "Question générale" },
      { "value": "demo", "label": "Demande de démonstration" },
      { "value": "sales", "label": "Support commercial / Devis" },
      { "value": "partnership", "label": "Partenariat" },
      { "value": "other", "label": "Autre" }
    ],
    "demoFields": { // Champs spécifiques si sujet "demo"
      "userCountOptions": ["1-5", "6-20", "21-50", "50+"]
    },
    "rgpdConsentText": "J'accepte que mes données soient traitées conformément à la [Politique de Confidentialité](/politique-confidentialite) pour répondre à ma demande.",
    "submitButtonDefaultText": "Envoyer le Message",
    "submitButtonDemoText": "Demander une Démo Gratuite",
    "successMessage": "Merci ! Votre message a bien été envoyé. Nous vous contacterons sous 48h ouvrées.",
    "errorMessage": "Une erreur s'est produite. Veuillez réessayer ou nous contacter directement."
  },
  "alternativeContacts": {
    "display": true,
    "sectionTitle": "Autres Moyens pour Nous Joindre",
    "email": "contact@serenkall.com",
    "phone": "+33 1 23 45 67 89 (Lun-Ven, 9h-18h)",
    "address": {
      "street": "123 Rue de l'Innovation",
      "city": "75000 Paris",
      "country": "France",
      "googleMapsLink": "https://maps.google.com/..."
    },
    "socialLinks": [
      { "platform": "linkedin", "url": "https://linkedin.com/company/serenkall" },
      { "platform": "twitter", "url": "https://twitter.com/serenkall" }
    ]
  },
  "locationMap": {
    "display": false, // ou true si pertinent
    "embedUrl": "https://www.google.com/maps/embed?pb=..."
  }
}
```
*   // TEST: La structure des données de configuration pour la page Contact est bien définie.