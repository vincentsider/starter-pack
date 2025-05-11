# Pseudocode : Module de Gestion des Règles de Filtrage

Ce module est responsable de la création, la lecture, la mise à jour et la suppression (CRUD) des règles de filtrage pour un utilisateur. Il s'appuie sur les entités `Utilisateur` et `RegleDeFiltrage` du modèle de domaine.

## 1. Entité `RegleDeFiltrage` (Rappel du Modèle de Domaine)
*   `id_regle` (UUID, PK)
*   `id_utilisateur` (UUID, FK vers `Utilisateur`)
*   `nom_regle` (String)
*   `type_regle` (Enum: `LISTE_NOIRE`, `LISTE_BLANCHE`, `MOTS_CLES_VOIX`, `HORAIRES`, `GEO_LOCALISATION_APPELANT`, `SYSTEME_ANTI_SPAM_ROO`)
*   `condition_definition` (Objet JSON)
*   `action_si_condition_vraie` (Enum: `BLOQUER`, `AUTORISER`, `VERS_REPONDEUR_IA`)
*   `priorite` (Integer)
*   `est_active` (Boolean, Default: true)
*   `est_systeme` (Boolean, Default: false)
*   `date_creation` (Timestamp)
*   `date_derniere_modification` (Timestamp)
    *   // TEST_DOM: L'entité RegleDeFiltrage pour le pseudocode est alignée avec le modèle de domaine.

## 2. Création d'une Règle (`create_filtering_rule`)

```pseudocode
FONCTION create_filtering_rule(id_utilisateur, nom_regle, type_regle, condition_definition, action_si_condition_vraie, priorite_initiale, est_active_initial)
    // TEST: L'utilisateur doit exister pour créer une règle.
    // TEST: Le nom de la règle ne doit pas être vide.
    // TEST: Le type de règle doit être parmi les types valides.
    // TEST: La condition_definition doit être valide pour le type_regle spécifié.
    // TEST: L'action doit être parmi les actions valides.
    // TEST: La priorité doit être un entier positif.
    // TEST: Un utilisateur ne peut pas créer une règle de type SYSTEME_ANTI_SPAM_ROO.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La création de règle échoue si l'utilisateur est inconnu.
    FIN SI

    SI nom_regle EST vide OU type_regle N'EST PAS VALIDE OU action_si_condition_vraie N'EST PAS VALIDE ALORS
        RETOURNER ERREUR "Paramètres de règle invalides (nom, type ou action)."
        // TEST: La création de règle échoue avec des paramètres de base invalides.
    FIN SI

    SI type_regle EST "SYSTEME_ANTI_SPAM_ROO" ET utilisateur.est_admin EST FAUX ALORS
        RETOURNER ERREUR "Seuls les administrateurs peuvent créer des règles système."
        // TEST: La création de règle système par un non-admin est bloquée.
    FIN SI

    validation_condition = valider_structure_condition(type_regle, condition_definition)
    SI validation_condition EST FAUX ALORS
        RETOURNER ERREUR "La structure de la condition n'est pas valide pour le type de règle: " + type_regle
        // TEST: La création de règle échoue si la condition_definition est invalide pour le type.
    FIN SI

    // Gestion de la priorité : s'assurer qu'elle est unique ou la réajuster
    // Pour simplifier, on peut la laisser telle quelle et gérer les doublons à l'exécution,
    // ou attribuer la prochaine priorité disponible si non fournie ou en conflit.
    // Ici, nous supposons que la priorité est fournie et acceptée, ou une valeur par défaut est assignée.
    priorite_finale = priorite_initiale SI priorite_initiale EST definie ET positive SINON service_regles.calculer_prochaine_priorite(id_utilisateur)

    nouvelle_regle = NOUVELLE EntiteRegleDeFiltrage AVEC
        id_utilisateur = id_utilisateur,
        nom_regle = nom_regle,
        type_regle = type_regle,
        condition_definition = condition_definition,
        action_si_condition_vraie = action_si_condition_vraie,
        priorite = priorite_finale,
        est_active = est_active_initial SI est_active_initial EST definie SINON VRAI,
        est_systeme = (type_regle EST "SYSTEME_ANTI_SPAM_ROO"), // Seuls les admins peuvent la passer à vrai
        date_creation = date_heure_actuelle(),
        date_derniere_modification = date_heure_actuelle()

    resultat_sauvegarde = service_base_de_donnees.sauvegarder_regle(nouvelle_regle)
    SI resultat_sauvegarde EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la création de la règle."
        // TEST: La création de règle échoue si la sauvegarde en BDD échoue.
    FIN SI

    RETOURNER SUCCES AVEC { id_regle: nouvelle_regle.id_regle, message: "Règle créée avec succès." }
    // TEST: Une création de règle réussie retourne l'ID de la nouvelle règle.
FIN FONCTION
```

## 3. Lecture des Règles d'un Utilisateur (`get_user_filtering_rules`)

```pseudocode
FONCTION get_user_filtering_rules(id_utilisateur, options_tri, options_filtre)
    // TEST: L'utilisateur doit exister pour lister ses règles.
    // TEST: Les règles sont retournées triées par priorité par défaut.
    // TEST: Le filtrage par statut (active/inactive) fonctionne.
    // TEST: Le filtrage par type de règle fonctionne.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La lecture des règles échoue si l'utilisateur est inconnu.
    FIN SI

    // Par défaut, trier par priorité croissante
    tri_par_defaut = { champ: "priorite", ordre: "ASC" }
    tri_final = options_tri SI options_tri SONT definies SINON tri_par_defaut

    regles_utilisateur = service_base_de_donnees.lister_regles_par_utilisateur(id_utilisateur, tri_final, options_filtre)

    SI regles_utilisateur EST nul OU erreur_lecture ALORS
        RETOURNER ERREUR "Erreur lors de la récupération des règles."
        // TEST: La lecture des règles gère une erreur de la BDD.
    FIN SI

    RETOURNER SUCCES AVEC { regles: regles_utilisateur }
    // TEST: La lecture retourne une liste de règles pour un utilisateur valide.
    // TEST: La liste retournée est vide si l'utilisateur n'a pas de règles.
FIN FONCTION
```

## 4. Lecture d'une Règle Spécifique (`get_filtering_rule_details`)

```pseudocode
FONCTION get_filtering_rule_details(id_utilisateur, id_regle)
    // TEST: L'utilisateur doit exister.
    // TEST: La règle doit exister.
    // TEST: L'utilisateur doit être le propriétaire de la règle.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La lecture d'une règle spécifique échoue si l'utilisateur est inconnu.
    FIN SI

    regle = service_base_de_donnees.trouver_regle_par_id(id_regle)
    SI regle EST nul ALORS
        RETOURNER ERREUR "Règle non trouvée."
        // TEST: La lecture d'une règle spécifique échoue si la règle est inconnue.
    FIN SI

    SI regle.id_utilisateur N'EST PAS EGAL A id_utilisateur ET utilisateur.est_admin EST FAUX ALORS
        RETOURNER ERREUR "Accès non autorisé à cette règle."
        // TEST: La lecture d'une règle spécifique échoue si l'utilisateur n'est pas le propriétaire (et n'est pas admin).
    FIN SI

    RETOURNER SUCCES AVEC { regle_details: regle }
    // TEST: La lecture d'une règle spécifique retourne les détails de la règle.
FIN FONCTION
```

## 5. Mise à Jour d'une Règle (`update_filtering_rule`)

```pseudocode
FONCTION update_filtering_rule(id_utilisateur, id_regle, mises_a_jour)
    // mises_a_jour est un objet contenant les champs à modifier: { nom_regle, condition_definition, action_si_condition_vraie, priorite, est_active }
    // TEST: L'utilisateur doit exister.
    // TEST: La règle doit exister et appartenir à l'utilisateur (sauf si admin).
    // TEST: Une règle système ne peut pas être modifiée par un utilisateur non-admin.
    // TEST: La condition_definition doit rester valide pour le type_regle (le type_regle ne peut pas être modifié ici, pour cela: supprimer et recréer).
    // TEST: Les champs fournis dans mises_a_jour sont correctement appliqués.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La mise à jour échoue si l'utilisateur est inconnu.
    FIN SI

    regle_existante = service_base_de_donnees.trouver_regle_par_id(id_regle)
    SI regle_existante EST nul ALORS
        RETOURNER ERREUR "Règle non trouvée."
        // TEST: La mise à jour échoue si la règle est inconnue.
    FIN SI

    SI regle_existante.id_utilisateur N'EST PAS EGAL A id_utilisateur ET utilisateur.est_admin EST FAUX ALORS
        RETOURNER ERREUR "Accès non autorisé pour modifier cette règle."
        // TEST: La mise à jour échoue si l'utilisateur n'est pas propriétaire (et n'est pas admin).
    FIN SI

    SI regle_existante.est_systeme EST VRAI ET utilisateur.est_admin EST FAUX ALORS
        RETOURNER ERREUR "Les règles système ne peuvent pas être modifiées par les utilisateurs."
        // TEST: La mise à jour d'une règle système par un non-admin est bloquée.
    FIN SI

    // Appliquer les mises à jour
    POUR CHAQUE cle, valeur DANS mises_a_jour FAIRE
        SI cle EST "nom_regle" ET valeur N'EST PAS vide ALORS
            regle_existante.nom_regle = valeur
        SINON SI cle EST "condition_definition" ALORS
            validation_condition = valider_structure_condition(regle_existante.type_regle, valeur)
            SI validation_condition EST FAUX ALORS
                RETOURNER ERREUR "La nouvelle structure de condition est invalide pour le type de règle."
                // TEST: La mise à jour échoue si la nouvelle condition_definition est invalide.
            FIN SI
            regle_existante.condition_definition = valeur
        SINON SI cle EST "action_si_condition_vraie" ET valeur EST VALIDE ALORS
            regle_existante.action_si_condition_vraie = valeur
        SINON SI cle EST "priorite" ET valeur EST un entier positif ALORS
            // Gérer la réorganisation des priorités si nécessaire
            regle_existante.priorite = valeur
        SINON SI cle EST "est_active" ET valeur EST un booleen ALORS
            regle_existante.est_active = valeur
        // Le type_regle et est_systeme ne sont pas modifiables via cette fonction pour un user standard.
        // Un admin pourrait avoir une fonction dédiée.
    FIN POUR

    regle_existante.date_derniere_modification = date_heure_actuelle()

    resultat_mise_a_jour = service_base_de_donnees.mettre_a_jour_regle(regle_existante)
    SI resultat_mise_a_jour EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la mise à jour de la règle."
        // TEST: La mise à jour échoue si la sauvegarde en BDD échoue.
    FIN SI

    RETOURNER SUCCES AVEC { regle_mise_a_jour: regle_existante, message: "Règle mise à jour avec succès." }
    // TEST: Une mise à jour réussie retourne la règle modifiée.
FIN FONCTION
```

## 6. Suppression d'une Règle (`delete_filtering_rule`)

```pseudocode
FONCTION delete_filtering_rule(id_utilisateur, id_regle)
    // TEST: L'utilisateur doit exister.
    // TEST: La règle doit exister et appartenir à l'utilisateur (sauf si admin).
    // TEST: Une règle système ne peut pas être supprimée par un utilisateur non-admin.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La suppression échoue si l'utilisateur est inconnu.
    FIN SI

    regle_a_supprimer = service_base_de_donnees.trouver_regle_par_id(id_regle)
    SI regle_a_supprimer EST nul ALORS
        RETOURNER ERREUR "Règle non trouvée."
        // TEST: La suppression échoue si la règle est inconnue.
    FIN SI

    SI regle_a_supprimer.id_utilisateur N'EST PAS EGAL A id_utilisateur ET utilisateur.est_admin EST FAUX ALORS
        RETOURNER ERREUR "Accès non autorisé pour supprimer cette règle."
        // TEST: La suppression échoue si l'utilisateur n'est pas propriétaire (et n'est pas admin).
    FIN SI

    SI regle_a_supprimer.est_systeme EST VRAI ET utilisateur.est_admin EST FAUX ALORS
        RETOURNER ERREUR "Les règles système ne peuvent pas être supprimées par les utilisateurs."
        // TEST: La suppression d'une règle système par un non-admin est bloquée.
    FIN SI

    resultat_suppression = service_base_de_donnees.supprimer_regle(id_regle)
    SI resultat_suppression EST un échec ALORS
        RETOURNER ERREUR "Erreur lors de la suppression de la règle."
        // TEST: La suppression échoue si l'opération en BDD échoue.
    FIN SI

    RETOURNER SUCCES "Règle supprimée avec succès."
    // TEST: Une suppression réussie retourne un message de confirmation.
FIN FONCTION
```

## 7. Mise à Jour des Priorités des Règles (`update_rules_priority`)
Permet à l'utilisateur de réorganiser l'ordre de ses règles.

```pseudocode
FONCTION update_rules_priority(id_utilisateur, liste_regles_ordonnees)
    // liste_regles_ordonnees est un tableau d'objets [{id_regle: "uuid", nouvelle_priorite: N}, ...]
    // TEST: L'utilisateur doit exister.
    // TEST: Toutes les id_regle dans la liste doivent appartenir à l'utilisateur.
    // TEST: Les nouvelles priorités doivent être uniques et séquentielles (ou gérées pour l'être).
    // TEST: La mise à jour des priorités est correctement appliquée en base de données.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La mise à jour des priorités échoue si l'utilisateur est inconnu.
    FIN SI

    // Validation : Vérifier que toutes les règles appartiennent à l'utilisateur
    // et que les priorités sont valides (ex: pas de doublons, séquentielles à partir de 1)
    POUR CHAQUE item DANS liste_regles_ordonnees FAIRE
        regle = service_base_de_donnees.trouver_regle_par_id(item.id_regle)
        SI regle EST nul OU regle.id_utilisateur N'EST PAS EGAL A id_utilisateur ALORS
            RETOURNER ERREUR "Une ou plusieurs règles sont invalides ou n'appartiennent pas à l'utilisateur."
            // TEST: La mise à jour des priorités échoue si une règle est invalide/non possédée.
        FIN SI
        // Autres validations sur item.nouvelle_priorite
    FIN POUR

    // Débuter une transaction
    service_base_de_donnees.commencer_transaction()

    POUR CHAQUE item DANS liste_regles_ordonnees FAIRE
        resultat = service_base_de_donnees.mettre_a_jour_priorite_regle(item.id_regle, item.nouvelle_priorite)
        SI resultat EST un échec ALORS
            service_base_de_donnees.annuler_transaction()
            RETOURNER ERREUR "Erreur lors de la mise à jour des priorités."
            // TEST: La mise à jour des priorités échoue et la transaction est annulée en cas d'erreur BDD.
        FIN SI
    FIN POUR

    service_base_de_donnees.valider_transaction()
    RETOURNER SUCCES "Priorités des règles mises à jour."
    // TEST: La mise à jour des priorités réussit pour une liste valide.
FIN FONCTION
```

## Fonctions de Validation et Services Supposés

*   `valider_structure_condition(type_regle, condition_definition)`:
    *   Valide que `condition_definition` (JSON) a la structure attendue pour le `type_regle`.
    *   Ex: Pour `LISTE_NOIRE`, `condition_definition` doit être `{ numeros: ["...", "..."] }`.
    *   Ex: Pour `HORAIRES`, `condition_definition` doit être `{ jours: ["LUN"], heure_debut: "HH:MM", heure_fin: "HH:MM", ... }`.
*   `service_regles.calculer_prochaine_priorite(id_utilisateur)`: Calcule la prochaine priorité disponible pour les règles d'un utilisateur.
*   `service_base_de_donnees`:
    *   `trouver_utilisateur_par_id(id)`
    *   `sauvegarder_regle(regle)`
    *   `lister_regles_par_utilisateur(id_utilisateur, options_tri, options_filtre)`
    *   `trouver_regle_par_id(id_regle)`
    *   `mettre_a_jour_regle(regle)`
    *   `supprimer_regle(id_regle)`
    *   `mettre_a_jour_priorite_regle(id_regle, nouvelle_priorite)`
    *   `commencer_transaction()`, `valider_transaction()`, `annuler_transaction()`

Ce module est essentiel pour la personnalisation du filtrage par l'utilisateur.