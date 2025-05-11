# Architecture Globale et Dépendances du "Répondeur Intelligent"

Ce document offre une vue d'ensemble de l'architecture logicielle du système "Répondeur Intelligent", basée sur les modules de pseudocode définis. Il identifie également les principales dépendances, qu'elles soient internes (services partagés entre modules) ou externes (services tiers).

## 1. Vue d'Ensemble des Modules Applicatifs

Le système est décomposé en plusieurs modules principaux, chacun ayant des responsabilités distinctes :

*   **[Module de Gestion des Utilisateurs (`pseudocode/01_module_gestion_utilisateurs.md`)](pseudocode/01_module_gestion_utilisateurs.md)**
    *   Responsabilités : Inscription, connexion, gestion de profil, gestion des abonnements et paiements, attribution de numéros de téléphone virtuels.
    *   Entités principales : `Utilisateur`, `Abonnement`, `NumeroVirtuel`, `TransactionPaiement`.

*   **[Module de Gestion des Règles de Routage (`pseudocode/02_module_gestion_regles.md`)](pseudocode/02_module_gestion_regles.md)**
    *   Responsabilités : Création, modification, suppression et évaluation des règles de routage d'appels personnalisées par l'utilisateur.
    *   Entités principales : `RegleRoutage`, `ConditionRegle`, `ActionRegle`.

*   **[Module de Traitement des Appels Entrants (`pseudocode/03_module_traitement_appels.md`)](pseudocode/03_module_traitement_appels.md)**
    *   Responsabilités : Réception des appels, identification de l'utilisateur destinataire via le numéro virtuel, application des règles de routage, et redirection de l'appel (vers un numéro réel, messagerie vocale, ou assistant IA).
    *   Entités principales : (Principalement orchestrateur, interagit avec `NumeroVirtuel`, `RegleRoutage`, `Utilisateur`).

*   **[Module d'Historique des Appels et Notifications (`pseudocode/04_module_historique_notifications.md`)](pseudocode/04_module_historique_notifications.md)**
    *   Responsabilités : Enregistrement de chaque appel traité, gestion des transcriptions (vocales et IA), et envoi de notifications aux utilisateurs.
    *   Entités principales : `HistoriqueAppel`, `NotificationUtilisateur`.

*   **[Module Assistant IA et Interactions (`pseudocode/05_module_assistant_ia_interactions.md`)](pseudocode/05_module_assistant_ia_interactions.md)**
    *   Responsabilités : Gestion des conversations entre l'appelant et l'assistant IA, prise de messages, transcription des interactions IA, configuration de la personnalité de l'IA par l'utilisateur.
    *   Entités principales : `ConfigurationAssistantIAUtilisateur`, extension de `HistoriqueAppel`.

*   **[Module Administration Système (`pseudocode/06_module_administration_systeme.md`)](pseudocode/06_module_administration_systeme.md)**
    *   Responsabilités : Gestion globale de la plateforme (utilisateurs, configurations, logs) par les administrateurs.
    *   Entités principales : `AdministrateurSysteme`, `ConfigurationGlobaleSysteme`, `LogAuditSysteme`.

## 2. Services Internes (Supposés et Partagés)

Ces services sont des abstractions logicielles qui seraient implémentées au sein de l'application et utilisées par plusieurs modules.

*   **`service_base_de_donnees`**:
    *   Utilisé par tous les modules pour la persistance et la récupération des données.
    *   Fonctions typiques : `trouver_utilisateur_par_id`, `sauvegarder_regle`, `creer_historique_appel`, `lister_configurations_globales`, etc.

*   **`service_authentification`**:
    *   Utilisé par `Module Gestion Utilisateurs` et `Module Administration Système`.
    *   Fonctions typiques : `verifier_mot_de_passe`, `generer_token_session`, `valider_token`.

*   **`service_paiement_abonnement`**: (Peut être une façade pour un service externe)
    *   Utilisé par `Module Gestion Utilisateurs`.
    *   Fonctions typiques : `creer_abonnement_stripe`, `verifier_statut_paiement`, `gerer_facturation`.

*   **`service_telephonie`**: (Façade pour un fournisseur de services de téléphonie/VoIP externe)
    *   Utilisé par `Module Traitement Appels`, `Module Assistant IA`, `Module Gestion Utilisateurs` (pour l'attribution de numéros).
    *   Fonctions typiques : `recevoir_appel_entrant_webhook`, `transferer_appel`, `jouer_audio_appel`, `raccrocher_appel`, `attribuer_numero_virtuel`, `relacher_numero_virtuel`.

*   **`service_notification_utilisateur`**: (Peut utiliser un service externe d'email/SMS/Push)
    *   Utilisé par `Module Historique et Notifications`, `Module Gestion Utilisateurs`, `Module Assistant IA`.
    *   Fonctions typiques : `envoyer_email_notification`, `envoyer_sms_alerte`.

*   **`service_moteur_ia`**: (Façade pour des services externes de STT, TTS, NLU/NLG)
    *   Utilisé par `Module Assistant IA`, `Module Historique et Notifications` (pour la transcription).
    *   Fonctions typiques : `transcrire_audio_en_texte`, `convertir_texte_en_audio`, `analyser_intention_texte`, `generer_reponse_ia`.

*   **Utilitaires Généraux**:
    *   Validation de données, sanitisation, formatage de dates, génération d'identifiants uniques, gestion des erreurs et logging.

## 3. Dépendances Externes Principales

Ces services sont des systèmes tiers sur lesquels le "Répondeur Intelligent" s'appuierait.

*   **Fournisseur de Services de Paiement**:
    *   Exemple : Stripe, PayPal.
    *   Pour gérer les abonnements et les transactions financières.

*   **Fournisseur de Services de Téléphonie/VoIP (CPaaS - Communications Platform as a Service)**:
    *   Exemple : Twilio, Vonage, Plivo.
    *   Pour la gestion des numéros de téléphone virtuels, la réception et l'émission d'appels, la manipulation des flux d'appels.

*   **Fournisseur de Services IA**:
    *   **STT (Speech-to-Text)**: Exemples: Google Cloud Speech-to-Text, AWS Transcribe, Azure Speech Services.
    *   **TTS (Text-to-Speech)**: Exemples: Google Cloud Text-to-Speech, AWS Polly, Azure Speech Services.
    *   **NLU/NLG (Natural Language Understanding/Generation)**: Exemples: Google Dialogflow, AWS Lex, Rasa, OpenAI API (pour des capacités conversationnelles avancées).
    *   Pour la transcription des messages vocaux, la synthèse vocale des réponses de l'IA, et l'intelligence conversationnelle.

*   **Fournisseur de Services de Messagerie/Notification**:
    *   Exemple : SendGrid, Mailgun (pour les emails), Twilio (pour les SMS).
    *   Pour envoyer des notifications aux utilisateurs (emails, SMS).

*   **Infrastructure d'Hébergement**:
    *   Exemple : AWS, Google Cloud Platform, Azure, Heroku.
    *   Pour déployer l'application, la base de données, et les services associés.

*   **Système de Gestion de Base de Données**:
    *   Exemple : PostgreSQL, MySQL, MongoDB.
    *   Choix en fonction des besoins de scalabilité, de relations, et de types de données.

## 4. Flux de Données de Haut Niveau (Exemple : Appel Entrant)

1.  Un appel arrive sur un `NumeroVirtuel` (géré par le **Fournisseur de Téléphonie**).
2.  Le fournisseur notifie le `Module Traitement Appels` via un webhook.
3.  Le `Module Traitement Appels` identifie l'`Utilisateur` associé au numéro.
4.  Il récupère les `RegleRoutage` de l'utilisateur depuis le `Module Gestion Règles`.
5.  Les règles sont évaluées. Supposons que l'action soit "Transférer à l'Assistant IA".
6.  Le `Module Traitement Appels` instruit le `Module Assistant IA`.
7.  Le `Module Assistant IA` utilise le `service_moteur_ia` (qui s'appuie sur les **Fournisseurs IA externes**) pour interagir avec l'appelant (STT, NLU, TTS).
8.  L'interaction est transcrite et enregistrée dans `HistoriqueAppel` par le `Module Historique et Notifications`.
9.  Une `NotificationUtilisateur` est envoyée via le `service_notification_utilisateur`.

Ce document vise à fournir une fondation pour la phase de validation et les discussions techniques ultérieures. Il met en évidence la modularité du système et ses interactions clés.