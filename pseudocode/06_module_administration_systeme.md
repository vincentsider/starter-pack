# Pseudocode : Module Administration Système

Ce module est destiné aux administrateurs de la plateforme "Répondeur Intelligent" et non aux utilisateurs finaux. Il permet de gérer les aspects globaux du système, les utilisateurs, les configurations centrales et la surveillance.

## 1. Entités Concernées (Nouvelles et Extensions)
*   `AdministrateurSysteme`:
    *   `id_admin` (UUID, PK)
    *   `nom_utilisateur` (String, Unique)
    *   `mot_de_passe_hash` (String)
    *   `role` (String, ex: "super_admin", "support_admin")
    *   `date_creation` (Timestamp)
    *   `derniere_connexion` (Timestamp)
        *   // TEST_DOM: L'entité `AdministrateurSysteme` est correctement définie.
*   `ConfigurationGlobaleSysteme`:
    *   `id_config` (UUID, PK, ou Singleton si une seule config globale)
    *   `nom_parametre` (String, Unique)
    *   `valeur_parametre` (String ou JSON)
    *   `description` (Texte)
    *   `date_modification` (Timestamp)
        *   // TEST_DOM: L'entité `ConfigurationGlobaleSysteme` permet de stocker divers paramètres.
        *   Exemples de paramètres: `provider_ia_par_defaut`, `limite_transcription_gratuite_par_mois`, `cle_api_service_email`.
*   `LogAuditSysteme`:
    *   `id_log` (UUID, PK)
    *   `id_admin_acteur` (UUID, FK vers `AdministrateurSysteme`, Optionnel si action système)
    *   `action_effectuee` (String, ex: "MODIF_CONFIG_GLOBALE", "SUSPENSION_UTILISATEUR")
    *   `details_action` (JSON)
    *   `timestamp` (Timestamp)
        *   // TEST_DOM: L'entité `LogAuditSysteme` trace les actions administratives.
*   `Utilisateur` (extension pour administration):
    *   Ajouter un champ `statut_compte` (String, ex: "ACTIF", "SUSPENDU", "EN_ATTENTE_VALIDATION")
        *   // TEST_DOM: Le champ `statut_compte` est ajouté à l'entité `Utilisateur`.
    *   Ajouter un champ `note_administrateur` (Texte, Optionnel)

## 2. Fonctionnalités Administratives

### 2.1. Authentification Administrateur (`admin_login`)
```pseudocode
FONCTION admin_login(nom_utilisateur_admin, mot_de_passe_admin)
    // TEST: L'authentification réussit avec des identifiants valides.
    // TEST: L'authentification échoue avec des identifiants invalides.
    // TEST: Le hash du mot de passe est correctement vérifié.

    admin = service_base_de_donnees.trouver_administrateur_par_nom(nom_utilisateur_admin)
    SI admin EST nul OU NON verifier_mot_de_passe(mot_de_passe_admin, admin.mot_de_passe_hash) ALORS
        RETOURNER ERREUR "Identifiants administrateur invalides."
        // TEST: Un message d'erreur approprié est retourné pour des identifiants invalides.
    FIN SI

    // Mettre à jour derniere_connexion
    admin.derniere_connexion = date_heure_actuelle()
    service_base_de_donnees.sauvegarder_administrateur(admin)

    token_session_admin = generer_token_session_admin(admin.id_admin, admin.role)
    RETOURNER SUCCES AVEC { token: token_session_admin, role: admin.role }
    // TEST: Un token de session et le rôle sont retournés en cas de succès.
FIN FONCTION
```

### 2.2. Gestion des Utilisateurs (par Admin)

#### 2.2.1. Lister les Utilisateurs (`admin_list_users`)
```pseudocode
FONCTION admin_list_users(filtres, pagination_options)
    // filtres: { statut_compte, email_contient, etc. }
    // TEST: Nécessite une session admin valide.
    // TEST: Retourne une liste paginée d'utilisateurs selon les filtres.
    // TEST: Les informations sensibles (ex: mot de passe hash) ne sont pas retournées.

    VERIFIER_SESSION_ADMIN_ET_PERMISSIONS("voir_utilisateurs") // Lève une exception si non autorisé

    utilisateurs = service_base_de_donnees.lister_tous_les_utilisateurs_admin(filtres, pagination_options)
    // S'assurer de ne pas exposer les mots de passe hashés ou autres données sensibles.
    utilisateurs_sanitises = SANITISER_LISTE_UTILISATEURS_POUR_ADMIN(utilisateurs)

    RETOURNER SUCCES AVEC { utilisateurs: utilisateurs_sanitises, total: OBTENIR_TOTAL_UTILISATEURS(filtres) }
    // TEST: Les données utilisateur retournées sont correctement aseptisées.
FIN FONCTION
```

#### 2.2.2. Voir Détails Utilisateur (`admin_get_user_details`)
```pseudocode
FONCTION admin_get_user_details(id_utilisateur_cible)
    // TEST: Nécessite une session admin valide.
    // TEST: Retourne les détails complets d'un utilisateur spécifique (pour admin).

    VERIFIER_SESSION_ADMIN_ET_PERMISSIONS("voir_details_utilisateur")

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id_admin(id_utilisateur_cible)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: Gère le cas d'un utilisateur non trouvé.
    FIN SI

    RETOURNER SUCCES AVEC { utilisateur: SANITISER_UTILISATEUR_POUR_ADMIN(utilisateur) }
FIN FONCTION
```

#### 2.2.3. Modifier Statut Utilisateur (`admin_update_user_status`)
```pseudocode
FONCTION admin_update_user_status(id_admin_acteur, id_utilisateur_cible, nouveau_statut, note)
    // nouveau_statut: "ACTIF", "SUSPENDU"
    // TEST: Nécessite une session admin valide avec permissions.
    // TEST: Le statut de l'utilisateur est mis à jour.
    // TEST: Une note administrative peut être ajoutée.
    // TEST: Un log d'audit est créé.

    VERIFIER_SESSION_ADMIN_ET_PERMISSIONS("modifier_statut_utilisateur")

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur_cible)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
    FIN SI

    ancien_statut = utilisateur.statut_compte
    utilisateur.statut_compte = nouveau_statut
    SI note EST fournie ALORS
        utilisateur.note_administrateur = note
    FIN SI

    service_base_de_donnees.sauvegarder_utilisateur(utilisateur)
    // TEST: La modification du statut est persistée.

    // Log Audit
    creer_log_audit(
        id_admin_acteur,
        "MODIFICATION_STATUT_UTILISATEUR",
        { id_utilisateur: id_utilisateur_cible, ancien_statut: ancien_statut, nouveau_statut: nouveau_statut, note: note }
    )
    // TEST: L'action est correctement enregistrée dans les logs d'audit.

    RETOURNER SUCCES "Statut de l'utilisateur mis à jour."
FIN FONCTION
```

### 2.3. Gestion de la Configuration Globale

#### 2.3.1. Lister les Paramètres de Configuration (`admin_list_global_configs`)
```pseudocode
FONCTION admin_list_global_configs()
    // TEST: Nécessite une session admin valide.
    // TEST: Retourne tous les paramètres de configuration globale.

    VERIFIER_SESSION_ADMIN_ET_PERMISSIONS("voir_config_globale")

    configs = service_base_de_donnees.lister_configurations_globales()
    RETOURNER SUCCES AVEC { configurations: configs }
FIN FONCTION
```

#### 2.3.2. Mettre à Jour un Paramètre de Configuration (`admin_update_global_config`)
```pseudocode
FONCTION admin_update_global_config(id_admin_acteur, nom_parametre, nouvelle_valeur)
    // TEST: Nécessite une session admin valide avec permissions.
    // TEST: La valeur du paramètre est mise à jour.
    // TEST: La validation de la valeur peut être nécessaire selon le paramètre.
    // TEST: Un log d'audit est créé.

    VERIFIER_SESSION_ADMIN_ET_PERMISSIONS("modifier_config_globale")

    param_config = service_base_de_donnees.trouver_configuration_globale_par_nom(nom_parametre)
    SI param_config EST nul ALORS
        RETOURNER ERREUR "Paramètre de configuration non trouvé."
        // TEST: Gère le cas d'un paramètre de configuration inconnu.
    FIN SI

    // Potentiellement, ajouter une validation spécifique basée sur nom_parametre
    SI NON VALIDER_VALEUR_CONFIG(nom_parametre, nouvelle_valeur) ALORS
        RETOURNER ERREUR "Valeur invalide pour le paramètre " + nom_parametre
        // TEST: La mise à jour échoue si la nouvelle valeur est invalide pour le paramètre.
    FIN SI

    ancienne_valeur = param_config.valeur_parametre
    param_config.valeur_parametre = nouvelle_valeur
    param_config.date_modification = date_heure_actuelle()
    service_base_de_donnees.sauvegarder_configuration_globale(param_config)
    // TEST: La modification de la configuration est persistée.

    // Log Audit
    creer_log_audit(
        id_admin_acteur,
        "MODIFICATION_CONFIG_GLOBALE",
        { parametre: nom_parametre, ancienne_valeur: ancienne_valeur, nouvelle_valeur: nouvelle_valeur }
    )
    // TEST: L'action de modification de config est loguée.

    RETOURNER SUCCES "Paramètre de configuration mis à jour."
FIN FONCTION
```

### 2.4. Visualisation des Logs d'Audit (`admin_view_audit_logs`)
```pseudocode
FONCTION admin_view_audit_logs(filtres, pagination_options)
    // filtres: { id_admin_acteur, type_action, plage_dates, etc. }
    // TEST: Nécessite une session admin valide avec permissions.
    // TEST: Retourne une liste paginée de logs d'audit.

    VERIFIER_SESSION_ADMIN_ET_PERMISSIONS("voir_logs_audit")

    logs = service_base_de_donnees.lister_logs_audit(filtres, pagination_options)
    RETOURNER SUCCES AVEC { logs_audit: logs, total: OBTENIR_TOTAL_LOGS_AUDIT(filtres) }
    // TEST: Les logs d'audit sont retournés correctement.
FIN FONCTION
```

## 3. Services Internes Supposés
*   `service_base_de_donnees`:
    *   `trouver_administrateur_par_nom(nom_utilisateur_admin)`
    *   `sauvegarder_administrateur(admin_data)`
    *   `lister_tous_les_utilisateurs_admin(filtres, pagination)`
    *   `trouver_utilisateur_par_id_admin(id_utilisateur)` (peut-être identique à `trouver_utilisateur_par_id` mais avec plus de champs)
    *   `lister_configurations_globales()`
    *   `trouver_configuration_globale_par_nom(nom_parametre)`
    *   `sauvegarder_configuration_globale(config_data)`
    *   `creer_entree_log_audit(log_data)`
    *   `lister_logs_audit(filtres, pagination)`
*   Utilitaires d'authentification et de sécurité:
    *   `verifier_mot_de_passe(mot_de_passe_clair, hash_stocke)`
    *   `generer_token_session_admin(id_admin, role)`
    *   `VERIFIER_SESSION_ADMIN_ET_PERMISSIONS(permission_requise)`: Vérifie le token de session et les droits.
*   Utilitaires de sanitisation et validation:
    *   `SANITISER_LISTE_UTILISATEURS_POUR_ADMIN(utilisateurs)`
    *   `SANITISER_UTILISATEUR_POUR_ADMIN(utilisateur)`
    *   `VALIDER_VALEUR_CONFIG(nom_parametre, valeur)`
*   Fonction de log:
    *   `creer_log_audit(id_admin, action, details)` (interface vers `service_base_de_donnees.creer_entree_log_audit`)

Ce module assure que les administrateurs peuvent superviser et gérer la plateforme efficacement.