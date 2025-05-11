# Pseudocode : Module Historique des Appels et Notifications

Ce module est responsable de fournir aux utilisateurs un accès à leur historique d'appels filtrés et de gérer l'envoi de notifications pour certains événements. Il s'appuie sur l'entité `HistoriqueAppel` et potentiellement une nouvelle entité `Notification`.

## 1. Entités Concernées (Rappel et Nouvelle)
*   `HistoriqueAppel` (défini dans le module de traitement des appels)
    *   Contient tous les détails des appels traités.
    *   // TEST_DOM: L'entité HistoriqueAppel pour le pseudocode est alignée avec le modèle de domaine.
*   `Notification` (Nouvelle entité potentielle pour le suivi des notifications envoyées)
    *   `id_notification` (UUID, PK)
    *   `id_utilisateur` (UUID, FK vers `Utilisateur`)
    *   `type_notification` (Enum: `NOUVEL_APPEL_REPONDEUR_IA`, `REGLE_FREQUEMMENT_DECLENCHEE`, `ALERTE_SECURITE_COMPTE`)
    *   `message` (String)
    *   `est_lue` (Boolean, Default: false)
    *   `date_creation` (Timestamp)
    *   `lien_associe` (String, Optionnel, ex: lien vers l'historique d'appel spécifique)
        *   // TEST_DOM: La nouvelle entité Notification est définie correctement.

## 2. Consultation de l'Historique des Appels (`get_call_history`)

```pseudocode
FONCTION get_call_history(id_utilisateur, options_pagination, options_filtre, options_tri)
    // options_pagination: { page: N, taille_page: M }
    // options_filtre: { date_debut, date_fin, action_prise_filtre, numero_appelant_filtre, id_regle_filtre }
    // options_tri: { champ_tri: "timestamp_appel", ordre_tri: "DESC" }
    // TEST: L'utilisateur doit exister.
    // TEST: La pagination fonctionne correctement (retourne le bon nombre d'enregistrements pour la page).
    // TEST: Le filtrage par date fonctionne.
    // TEST: Le filtrage par action_prise (BLOQUE, AUTORISE, VERS_REPONDEUR_IA) fonctionne.
    // TEST: Le filtrage par numéro appelant fonctionne.
    // TEST: Le filtrage par règle déclenchée fonctionne.
    // TEST: Le tri par timestamp (défaut DESC) fonctionne.
    // TEST: Le tri par d'autres champs (ex: numero_appelant, action_prise) fonctionne.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La consultation de l'historique échoue si l'utilisateur est inconnu.
    FIN SI

    // Valeurs par défaut pour la pagination et le tri si non fournies
    pagination_finale = options_pagination SI options_pagination SONT definies SINON { page: 1, taille_page: 20 }
    tri_final = options_tri SI options_tri SONT definies SINON { champ_tri: "timestamp_appel", ordre_tri: "DESC" }

    resultat_historique = service_base_de_donnees.lister_historique_appels_utilisateur(
        id_utilisateur,
        pagination_finale,
        options_filtre,
        tri_final
    )

    SI resultat_historique EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la récupération de l'historique des appels."
        // TEST: La consultation de l'historique gère une erreur de la BDD.
    FIN SI

    RETOURNER SUCCES AVEC {
        historique: resultat_historique.enregistrements,
        total_enregistrements: resultat_historique.total,
        page_actuelle: pagination_finale.page,
        total_pages: CALCULER_TOTAL_PAGES(resultat_historique.total, pagination_finale.taille_page)
    }
    // TEST: La consultation retourne une liste paginée d'historique pour un utilisateur valide.
    // TEST: La liste est vide si l'utilisateur n'a pas d'historique correspondant aux filtres.
FIN FONCTION
```

## 3. Obtention des Détails d'un Enregistrement d'Historique Spécifique (`get_call_history_entry_details`)

```pseudocode
FONCTION get_call_history_entry_details(id_utilisateur, id_historique)
    // TEST: L'utilisateur doit exister.
    // TEST: L'enregistrement d'historique doit exister.
    // TEST: L'utilisateur doit être le propriétaire de l'enregistrement d'historique.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La récupération des détails échoue si l'utilisateur est inconnu.
    FIN SI

    enregistrement_historique = service_base_de_donnees.trouver_historique_appel_par_id(id_historique)
    SI enregistrement_historique EST nul ALORS
        RETOURNER ERREUR "Enregistrement d'historique non trouvé."
        // TEST: La récupération des détails échoue si l'historique est inconnu.
    FIN SI

    SI enregistrement_historique.id_utilisateur N'EST PAS EGAL A id_utilisateur ALORS
        RETOURNER ERREUR "Accès non autorisé à cet enregistrement d'historique."
        // TEST: La récupération des détails échoue si l'utilisateur n'est pas le propriétaire.
    FIN SI

    RETOURNER SUCCES AVEC { details_historique: enregistrement_historique }
    // TEST: La récupération retourne les détails complets d'un enregistrement d'historique.
FIN FONCTION
```

## 4. Création d'une Notification (`create_notification`) - (Interne au système)

```pseudocode
FONCTION create_notification(id_utilisateur, type_notification, message, lien_associe)
    // TEST: L'utilisateur doit exister.
    // TEST: Le type de notification doit être valide.
    // TEST: Le message ne doit pas être vide.
    // TEST: Une notification est correctement créée et sauvegardée.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        logguer_erreur("Tentative de création de notification pour utilisateur inexistant: " + id_utilisateur)
        RETOURNER ERREUR "Utilisateur non trouvé pour notification."
        // TEST: La création de notification échoue discrètement si l'utilisateur est inconnu.
    FIN SI

    SI type_notification N'EST PAS VALIDE OU message EST vide ALORS
        logguer_erreur("Paramètres de notification invalides pour utilisateur: " + id_utilisateur)
        RETOURNER ERREUR "Paramètres de notification invalides."
        // TEST: La création de notification échoue avec des paramètres invalides.
    FIN SI

    nouvelle_notification = NOUVELLE EntiteNotification AVEC
        id_utilisateur = id_utilisateur,
        type_notification = type_notification,
        message = message,
        est_lue = FAUX,
        date_creation = date_heure_actuelle(),
        lien_associe = lien_associe

    resultat_sauvegarde = service_base_de_donnees.sauvegarder_notification(nouvelle_notification)
    SI resultat_sauvegarde EST un échec ALORS
        logguer_erreur("Erreur BDD lors de la création de notification pour: " + id_utilisateur)
        RETOURNER ERREUR "Erreur BDD lors de la création de notification."
        // TEST: La création de notification échoue si la sauvegarde BDD échoue.
    FIN SI

    // Potentiellement, déclencher un envoi via un service de notification push/email ici
    service_systeme_notifications_externes.envoyer_si_configure(utilisateur, nouvelle_notification)
    // TEST: Le service de notification externe est appelé.

    RETOURNER SUCCES AVEC { id_notification: nouvelle_notification.id_notification }
    // TEST: La création de notification réussit et retourne l'ID.
FIN FONCTION
```
Exemple de déclenchement (depuis le module de traitement des appels) :
```pseudocode
// ... dans process_incoming_call, après enregistrer_appel_historique ...
SI action_finale EST "VERS_REPONDEUR_IA" ALORS
    message_notif = "Un nouvel appel de " + appel_entrant_details.numero_appelant + " a été pris en charge par votre assistant IA."
    create_notification(utilisateur_destinataire.id_utilisateur, "NOUVEL_APPEL_REPONDEUR_IA", message_notif, "/historique/" + nouvel_historique.id_historique)
FIN SI
```

## 5. Consultation des Notifications (`get_user_notifications`)

```pseudocode
FONCTION get_user_notifications(id_utilisateur, options_pagination, filtre_lues)
    // filtre_lues: "TOUTES", "LUES", "NON_LUES"
    // TEST: L'utilisateur doit exister.
    // TEST: La pagination des notifications fonctionne.
    // TEST: Le filtrage par statut de lecture (lues/non lues/toutes) fonctionne.
    // TEST: Les notifications sont retournées triées par date de création décroissante par défaut.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La consultation des notifications échoue si l'utilisateur est inconnu.
    FIN SI

    pagination_finale = options_pagination SI options_pagination SONT definies SINON { page: 1, taille_page: 10 }
    filtre_statut_lecture = filtre_lues SI filtre_lues EST defini SINON "TOUTES"

    resultat_notifications = service_base_de_donnees.lister_notifications_utilisateur(
        id_utilisateur,
        pagination_finale,
        filtre_statut_lecture,
        { champ_tri: "date_creation", ordre_tri: "DESC" } // Tri par défaut
    )

    SI resultat_notifications EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la récupération des notifications."
        // TEST: La consultation des notifications gère une erreur BDD.
    FIN SI

    RETOURNER SUCCES AVEC {
        notifications: resultat_notifications.enregistrements,
        total_enregistrements: resultat_notifications.total,
        page_actuelle: pagination_finale.page,
        total_pages: CALCULER_TOTAL_PAGES(resultat_notifications.total, pagination_finale.taille_page)
    }
    // TEST: La consultation retourne une liste paginée de notifications.
FIN FONCTION
```

## 6. Marquer une Notification comme Lue/Non Lue (`update_notification_status`)

```pseudocode
FONCTION update_notification_status(id_utilisateur, id_notification, statut_lue)
    // statut_lue: Boolean (VRAI pour marquer comme lue, FAUX pour non lue)
    // TEST: L'utilisateur doit exister.
    // TEST: La notification doit exister et appartenir à l'utilisateur.
    // TEST: Le statut 'est_lue' de la notification est correctement mis à jour.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La mise à jour du statut échoue si l'utilisateur est inconnu.
    FIN SI

    notification = service_base_de_donnees.trouver_notification_par_id(id_notification)
    SI notification EST nul ALORS
        RETOURNER ERREUR "Notification non trouvée."
        // TEST: La mise à jour du statut échoue si la notification est inconnue.
    FIN SI

    SI notification.id_utilisateur N'EST PAS EGAL A id_utilisateur ALORS
        RETOURNER ERREUR "Accès non autorisé à cette notification."
        // TEST: La mise à jour du statut échoue si l'utilisateur n'est pas propriétaire.
    FIN SI

    notification.est_lue = statut_lue
    resultat_mise_a_jour = service_base_de_donnees.mettre_a_jour_notification(notification)

    SI resultat_mise_a_jour EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la mise à jour du statut de la notification."
        // TEST: La mise à jour du statut échoue en cas d'erreur BDD.
    FIN SI

    RETOURNER SUCCES "Statut de la notification mis à jour."
    // TEST: La mise à jour du statut réussit.
FIN FONCTION
```

## 7. Marquer Toutes les Notifications comme Lues (`mark_all_notifications_as_read`)

```pseudocode
FONCTION mark_all_notifications_as_read(id_utilisateur)
    // TEST: L'utilisateur doit exister.
    // TEST: Toutes les notifications non lues de l'utilisateur sont marquées comme lues.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: Marquer tout comme lu échoue si l'utilisateur est inconnu.
    FIN SI

    resultat = service_base_de_donnees.marquer_toutes_notifications_lues_utilisateur(id_utilisateur)

    SI resultat EST un échec ALORS
        RETOURNER ERREUR "Erreur lors du marquage de toutes les notifications comme lues."
        // TEST: Marquer tout comme lu échoue en cas d'erreur BDD.
    FIN SI

    RETOURNER SUCCES "Toutes les notifications ont été marquées comme lues."
    // TEST: Marquer tout comme lu réussit.
FIN FONCTION
```

## Services Supposés

*   `service_base_de_donnees`:
    *   `lister_historique_appels_utilisateur(id_utilisateur, pagination, filtres, tri)`
    *   `trouver_historique_appel_par_id(id_historique)`
    *   `sauvegarder_notification(notification_data)`
    *   `lister_notifications_utilisateur(id_utilisateur, pagination, filtre_lues, tri)`
    *   `trouver_notification_par_id(id_notification)`
    *   `mettre_a_jour_notification(notification_data)`
    *   `marquer_toutes_notifications_lues_utilisateur(id_utilisateur)`
*   `service_systeme_notifications_externes`:
    *   `envoyer_si_configure(utilisateur, notification)`: Gère l'envoi de notifications via des canaux externes (email, push mobile, etc.) en fonction des préférences de l'utilisateur.
*   Utilitaires:
    *   `CALCULER_TOTAL_PAGES(total_enregistrements, taille_page)`

Ce module assure que l'utilisateur reste informé et peut consulter l'activité de filtrage de son compte.