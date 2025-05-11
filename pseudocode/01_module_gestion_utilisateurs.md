# Pseudocode : Module de Gestion des Utilisateurs

Ce module gère l'inscription, la connexion, la déconnexion, et les opérations de base sur le profil utilisateur. Il s'appuie sur l'entité `Utilisateur` définie dans le modèle de domaine.

## 1. Entité `Utilisateur` (Rappel du Modèle de Domaine)
*   `id_utilisateur` (UUID, PK)
*   `nom_complet` (String)
*   `email` (String, Unique)
*   `mot_de_passe_hash` (String)
*   `numero_telephone_principal` (String, Unique)
*   `id_abonnement_actuel` (UUID, FK vers `Abonnement`)
*   `date_inscription` (Timestamp)
*   `statut_compte` (Enum: `ACTIF`, `EN_ATTENTE_VALIDATION_EMAIL`, `SUSPENDU`)
*   `token_validation_email` (String, Optionnel)
*   `date_expiration_token_validation` (Timestamp, Optionnel)
*   `token_reinitialisation_mdp` (String, Optionnel)
*   `date_expiration_token_reinit` (Timestamp, Optionnel)
    *   // TEST_DOM: L'entité Utilisateur pour le pseudocode est alignée avec le modèle de domaine.

## 2. Processus d'Inscription (`register_user`)

```pseudocode
FONCTION register_user(nom_complet, email, mot_de_passe, numero_telephone_principal)
    // TEST: Tenter de s'inscrire avec un email déjà existant doit échouer.
    // TEST: Tenter de s'inscrire avec un numéro de téléphone principal déjà existant doit échouer.
    // TEST: Tenter de s'inscrire avec un mot de passe trop faible doit échouer.
    // TEST: Tenter de s'inscrire avec un email invalide doit échouer.
    // TEST: Tenter de s'inscrire avec un numéro de téléphone invalide doit échouer.

    // 1. Valider les entrées
    SI nom_complet EST vide OU email EST invalide OU mot_de_passe EST trop faible OU numero_telephone_principal EST invalide ALORS
        RETOURNER ERREUR "Données d'inscription invalides."
        // TEST: Une inscription avec des données invalides retourne une erreur spécifique.
    FIN SI

    // 2. Vérifier l'unicité de l'email
    SI service_base_de_donnees.email_existe(email) ALORS
        RETOURNER ERREUR "Cet email est déjà utilisé."
        // TEST: La vérification d'unicité de l'email est fonctionnelle.
    FIN SI

    // 3. Vérifier l'unicité du numéro de téléphone principal
    SI service_base_de_donnees.numero_principal_existe(numero_telephone_principal) ALORS
        RETOURNER ERREUR "Ce numéro de téléphone principal est déjà utilisé."
        // TEST: La vérification d'unicité du numéro de téléphone principal est fonctionnelle.
    FIN SI

    // 4. Hacher le mot de passe
    mot_de_passe_hash = generer_hash_securise(mot_de_passe)
    // TEST: Le mot de passe est correctement haché avant stockage.

    // 5. Créer l'entité utilisateur (simplifié, l'abonnement initial sera géré séparément ou par défaut)
    nouvel_utilisateur = NOUVELLE EntiteUtilisateur AVEC
        nom_complet = nom_complet,
        email = email,
        mot_de_passe_hash = mot_de_passe_hash,
        numero_telephone_principal = numero_telephone_principal,
        date_inscription = date_heure_actuelle(),
        statut_compte = "EN_ATTENTE_VALIDATION_EMAIL", // Ou "ACTIF" si pas de validation email initiale
        // id_abonnement_actuel sera mis à jour lors du choix du plan (ex: plan gratuit par défaut)

    // 6. Générer un token de validation d'email (si validation activée)
    token_validation = generer_token_unique()
    nouvel_utilisateur.token_validation_email = token_validation
    nouvel_utilisateur.date_expiration_token_validation = date_heure_actuelle() + DUREE_VALIDITE_TOKEN_EMAIL
    // TEST: Un token de validation email est généré pour un nouvel utilisateur.

    // 7. Sauvegarder l'utilisateur en base de données
    resultat_sauvegarde = service_base_de_donnees.sauvegarder_utilisateur(nouvel_utilisateur)
    SI resultat_sauvegarde EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la création du compte."
        // TEST: Une erreur de sauvegarde en base de données est gérée.
    FIN SI

    // 8. Envoyer l'email de validation (si validation activée)
    service_email.envoyer_email_validation(email, nom_complet, token_validation)
    // TEST: L'email de validation est envoyé après une inscription réussie.

    RETOURNER SUCCES AVEC { utilisateur_id: nouvel_utilisateur.id_utilisateur, message: "Inscription réussie. Veuillez vérifier votre email." }
    // TEST: Une inscription réussie retourne un message de succès et l'ID utilisateur.
FIN FONCTION
```

## 3. Processus de Validation d'Email (`validate_email`)

```pseudocode
FONCTION validate_email(token_validation)
    // TEST: Tenter de valider avec un token inexistant doit échouer.
    // TEST: Tenter de valider avec un token expiré doit échouer.
    // TEST: Tenter de valider avec un token déjà utilisé (compte déjà actif) doit informer l'utilisateur.

    // 1. Rechercher l'utilisateur par token de validation
    utilisateur = service_base_de_donnees.trouver_utilisateur_par_token_validation(token_validation)

    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Token de validation invalide ou expiré."
        // TEST: La validation avec un token non trouvé retourne une erreur.
    FIN SI

    SI utilisateur.statut_compte EST "ACTIF" ALORS
        RETOURNER SUCCES "Votre compte est déjà activé."
        // TEST: La validation d'un compte déjà actif est gérée.
    FIN SI

    SI date_heure_actuelle() > utilisateur.date_expiration_token_validation ALORS
        // Optionnel : Renvoyer un nouveau token ou inviter à redemander
        service_base_de_donnees.supprimer_token_validation(utilisateur) // Invalider l'ancien token
        RETOURNER ERREUR "Token de validation expiré. Veuillez demander un nouveau lien de validation."
        // TEST: La validation avec un token expiré retourne une erreur.
    FIN SI

    // 2. Mettre à jour le statut du compte
    utilisateur.statut_compte = "ACTIF"
    utilisateur.token_validation_email = NUL
    utilisateur.date_expiration_token_validation = NUL

    resultat_mise_a_jour = service_base_de_donnees.mettre_a_jour_utilisateur(utilisateur)
    SI resultat_mise_a_jour EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de l'activation du compte."
        // TEST: Une erreur de mise à jour du statut du compte est gérée.
    FIN SI

    RETOURNER SUCCES "Votre compte a été activé avec succès."
    // TEST: Une validation d'email réussie met à jour le statut et retourne un message de succès.
FIN FONCTION
```

## 4. Processus de Connexion (`login_user`)

```pseudocode
FONCTION login_user(email, mot_de_passe)
    // TEST: Tenter de se connecter avec un email inexistant doit échouer.
    // TEST: Tenter de se connecter avec un mot de passe incorrect doit échouer.
    // TEST: Tenter de se connecter avec un compte non validé (si validation active) doit échouer ou informer.
    // TEST: Tenter de se connecter avec un compte suspendu doit échouer.

    // 1. Valider les entrées
    SI email EST invalide OU mot_de_passe EST vide ALORS
        RETOURNER ERREUR "Email ou mot de passe invalide."
        // TEST: Une connexion avec des données de format invalide retourne une erreur.
    FIN SI

    // 2. Rechercher l'utilisateur par email
    utilisateur = service_base_de_donnees.trouver_utilisateur_par_email(email)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Identifiants incorrects." // Message générique pour la sécurité
        // TEST: La connexion avec un email non trouvé retourne une erreur.
    FIN SI

    // 3. Vérifier le statut du compte
    SI utilisateur.statut_compte EST "EN_ATTENTE_VALIDATION_EMAIL" ALORS
        RETOURNER ERREUR "Veuillez valider votre email avant de vous connecter."
        // TEST: La connexion à un compte non validé est bloquée.
    FIN SI
    SI utilisateur.statut_compte EST "SUSPENDU" ALORS
        RETOURNER ERREUR "Votre compte est suspendu. Veuillez contacter le support."
        // TEST: La connexion à un compte suspendu est bloquée.
    FIN SI

    // 4. Vérifier le mot de passe
    SI verifier_mot_de_passe(mot_de_passe, utilisateur.mot_de_passe_hash) EST FAUX ALORS
        // Optionnel: Incrémenter un compteur d'échecs de connexion ici
        RETOURNER ERREUR "Identifiants incorrects."
        // TEST: La connexion avec un mot de passe incorrect retourne une erreur.
    FIN SI

    // 5. Générer un token de session (ex: JWT)
    token_session = service_authentification.generer_token_session(utilisateur.id_utilisateur, utilisateur.roles) // Supposant des rôles
    // TEST: Un token de session est généré après une connexion réussie.

    // 6. Mettre à jour la date de dernière connexion
    utilisateur.date_derniere_connexion = date_heure_actuelle()
    service_base_de_donnees.mettre_a_jour_utilisateur(utilisateur)
    // TEST: La date de dernière connexion est mise à jour.

    RETOURNER SUCCES AVEC { token: token_session, utilisateur_id: utilisateur.id_utilisateur, nom: utilisateur.nom_complet }
    // TEST: Une connexion réussie retourne un token de session et des informations utilisateur.
FIN FONCTION
```

## 5. Processus de Déconnexion (`logout_user`)

```pseudocode
FONCTION logout_user(token_session)
    // TEST: Tenter de se déconnecter avec un token invalide ou déjà invalidé doit être géré.

    // 1. Invalider le token de session côté serveur (si stateful tokens, ex: liste noire de tokens)
    resultat_invalidation = service_authentification.invalider_token_session(token_session)
    // Pour les JWT stateless, la déconnexion est souvent gérée côté client par la suppression du token.
    // Cependant, une liste noire côté serveur est plus sécurisée pour invalider immédiatement.

    SI resultat_invalidation EST un échec ET (mécanisme de liste noire en place) ALORS
        RETOURNER ERREUR "Échec de la déconnexion."
        // TEST: Une erreur d'invalidation de token côté serveur est gérée.
    FIN SI

    RETOURNER SUCCES "Déconnexion réussie."
    // TEST: Une déconnexion réussie retourne un message de succès.
FIN FONCTION
```

## 6. Demande de Réinitialisation de Mot de Passe (`request_password_reset`)

```pseudocode
FONCTION request_password_reset(email)
    // TEST: Demander une réinitialisation pour un email inexistant ne doit pas révéler son inexistence, mais ne rien envoyer.
    // TEST: Une demande valide doit générer un token et envoyer un email.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_email(email)

    SI utilisateur N'EST PAS nul ET utilisateur.statut_compte EST "ACTIF" ALORS
        token_reinit = generer_token_unique()
        date_expiration = date_heure_actuelle() + DUREE_VALIDITE_TOKEN_REINIT_MDP

        utilisateur.token_reinitialisation_mdp = token_reinit
        utilisateur.date_expiration_token_reinit = date_expiration
        service_base_de_donnees.mettre_a_jour_utilisateur(utilisateur)
        // TEST: Un token de réinitialisation est généré et stocké pour un utilisateur valide.

        service_email.envoyer_email_reinitialisation_mdp(email, utilisateur.nom_complet, token_reinit)
        // TEST: L'email de réinitialisation est envoyé.
    FIN SI

    // Toujours retourner un message générique pour éviter l'énumération d'emails
    RETOURNER SUCCES "Si un compte est associé à cet email, un lien de réinitialisation a été envoyé."
    // TEST: La fonction retourne toujours un message de succès générique.
FIN FONCTION
```

## 7. Réinitialisation de Mot de Passe (`reset_password`)

```pseudocode
FONCTION reset_password(token_reinit, nouveau_mot_de_passe)
    // TEST: Tenter de réinitialiser avec un token invalide ou expiré doit échouer.
    // TEST: Tenter de réinitialiser avec un nouveau mot de passe trop faible doit échouer.
    // TEST: Une réinitialisation réussie doit mettre à jour le mot de passe et invalider le token.

    // 1. Valider le nouveau mot de passe
    SI nouveau_mot_de_passe EST trop faible ALORS
        RETOURNER ERREUR "Le nouveau mot de passe est trop faible."
        // TEST: La validation de la force du nouveau mot de passe est effectuée.
    FIN SI

    // 2. Rechercher l'utilisateur par token de réinitialisation
    utilisateur = service_base_de_donnees.trouver_utilisateur_par_token_reinit(token_reinit)

    SI utilisateur EST nul OU date_heure_actuelle() > utilisateur.date_expiration_token_reinit ALORS
        RETOURNER ERREUR "Token de réinitialisation invalide ou expiré."
        // TEST: La réinitialisation avec un token invalide/expiré échoue.
    FIN SI

    // 3. Mettre à jour le mot de passe
    utilisateur.mot_de_passe_hash = generer_hash_securise(nouveau_mot_de_passe)
    utilisateur.token_reinitialisation_mdp = NUL
    utilisateur.date_expiration_token_reinit = NUL
    // Optionnel: Invalider toutes les sessions actives de l'utilisateur ici

    resultat_mise_a_jour = service_base_de_donnees.mettre_a_jour_utilisateur(utilisateur)
    SI resultat_mise_a_jour EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la mise à jour du mot de passe."
        // TEST: Une erreur de sauvegarde du nouveau mot de passe est gérée.
    FIN SI

    RETOURNER SUCCES "Votre mot de passe a été réinitialisé avec succès."
    // TEST: Une réinitialisation de mot de passe réussie retourne un message de succès.
FIN FONCTION
```

## Services Externes Supposés

*   `service_base_de_donnees`:
    *   `email_existe(email)`
    *   `numero_principal_existe(numero)`
    *   `sauvegarder_utilisateur(utilisateur)`
    *   `trouver_utilisateur_par_token_validation(token)`
    *   `trouver_utilisateur_par_email(email)`
    *   `trouver_utilisateur_par_token_reinit(token)`
    *   `mettre_a_jour_utilisateur(utilisateur)`
    *   `supprimer_token_validation(utilisateur)`
*   `service_email`:
    *   `envoyer_email_validation(email, nom, token)`
    *   `envoyer_email_reinitialisation_mdp(email, nom, token)`
*   `service_authentification`:
    *   `generer_token_session(utilisateur_id, roles)`
    *   `invalider_token_session(token)` (pour tokens stateful)
*   Fonctions utilitaires :
    *   `generer_hash_securise(chaine)`
    *   `verifier_mot_de_passe(chaine_claire, hash_stocke)`
    *   `generer_token_unique()`
    *   `date_heure_actuelle()`
    *   Validation de format d'email, numéro de téléphone, force du mot de passe.

Ce pseudocode sera la base pour l'implémentation et les tests du module de gestion des utilisateurs.