# Pseudocode : Module de Traitement des Appels Entrants

Ce module est responsable de l'évaluation des appels téléphoniques entrants par rapport aux règles de filtrage configurées par l'utilisateur (destinataire de l'appel) et de l'application de l'action appropriée (bloquer, autoriser, transférer vers l'IA). Il s'appuie sur les entités `Utilisateur`, `RegleDeFiltrage`, `AppelEntrant`, et `HistoriqueAppel` du modèle de domaine.

## 1. Entités Concernées (Rappel du Modèle de Domaine)
*   `AppelEntrant`:
    *   `id_appel_temporaire` (String, identifiant unique de l'appel en cours)
    *   `numero_appelant` (String)
    *   `numero_destinataire` (String, correspond à `Utilisateur.numero_telephone_principal` ou `NumeroSecondaire.numero`)
    *   `timestamp_debut_appel` (Timestamp)
    *   `informations_appelant` (Objet JSON, ex: { nom: "...", localisation_approximative: "...", type_ligne: "Mobile/Fixe" }) - potentiellement enrichi par des services externes.
        *   // TEST_DOM: L'entité AppelEntrant pour le pseudocode est alignée avec le modèle de domaine.
*   `HistoriqueAppel`:
    *   `id_historique` (UUID, PK)
    *   `id_utilisateur` (UUID, FK vers `Utilisateur`)
    *   `numero_appelant` (String)
    *   `numero_destinataire` (String)
    *   `timestamp_appel` (Timestamp)
    *   `duree_appel_secondes` (Integer, Optionnel)
    *   `action_prise` (Enum: `BLOQUE`, `AUTORISE`, `VERS_REPONDEUR_IA`, `NON_TRAITE_PAS_DE_REGLE`, `ERREUR_TRAITEMENT`)
    *   `id_regle_declenchee` (UUID, FK vers `RegleDeFiltrage`, Optionnel)
    *   `details_condition` (Objet JSON, Optionnel, ex: mot clé détecté)
    *   `transcription_ia` (Texte, Optionnel, si `VERS_REPONDEUR_IA`)
    *   `evaluation_spam_roo` (Objet JSON, Optionnel, détails de l'analyse Roo)
        *   // TEST_DOM: L'entité HistoriqueAppel pour le pseudocode est alignée avec le modèle de domaine.

## 2. Processus Principal de Traitement d'un Appel (`process_incoming_call`)

```pseudocode
FONCTION process_incoming_call(appel_entrant_details)
    // appel_entrant_details: Objet contenant numero_appelant, numero_destinataire, timestamp_debut_appel, etc.
    // TEST: Un appel vers un numéro destinataire inconnu ne doit pas être traité ou doit générer une erreur spécifique.
    // TEST: Un appel pour un utilisateur sans abonnement actif (ou fonction de filtrage désactivée) peut être autorisé par défaut ou bloqué selon la politique.
    // TEST: Le traitement d'un appel doit correctement évaluer toutes les règles actives de l'utilisateur par ordre de priorité.
    // TEST: La première règle correspondante doit déterminer l'action.
    // TEST: Si aucune règle ne correspond, une action par défaut (ex: AUTORISER) doit être appliquée.
    // TEST: L'historique de l'appel doit être correctement enregistré avec l'action et la règle déclenchée (si applicable).

    // 1. Identifier l'utilisateur destinataire
    utilisateur_destinataire = service_base_de_donnees.trouver_utilisateur_par_numero_telephone(appel_entrant_details.numero_destinataire)

    SI utilisateur_destinataire EST nul ALORS
        enregistrer_appel_historique(appel_entrant_details, "NON_TRAITE_UTILISATEUR_INCONNU", NUL)
        RETOURNER ACTION_DEFAUT_UTILISATEUR_INCONNU // Ex: rejeter l'appel système
        // TEST: Un appel vers un numéro destinataire non associé à un utilisateur est correctement géré et loggué.
    FIN SI

    // 1.b Vérifier le statut de l'abonnement/service de l'utilisateur
    SI service_abonnement.statut_filtrage_actif(utilisateur_destinataire.id_utilisateur) EST FAUX ALORS
        enregistrer_appel_historique(utilisateur_destinataire.id_utilisateur, appel_entrant_details, "AUTORISE_ABONNEMENT_INACTIF", NUL)
        RETOURNER "AUTORISER" // Ou une autre action par défaut pour abonnement inactif
        // TEST: Un appel pour un utilisateur avec un service de filtrage inactif est géré (ex: autorisé par défaut).
    FIN SI

    // 2. Récupérer les règles actives de l'utilisateur, triées par priorité
    regles_actives_utilisateur = service_base_de_donnees.lister_regles_actives_par_utilisateur_triees(utilisateur_destinataire.id_utilisateur)
    // TEST: La récupération des règles actives et leur tri par priorité fonctionnent.

    action_finale = "AUTORISER" // Action par défaut si aucune règle ne correspond
    regle_declenchee_id = NUL
    details_condition_match = NUL

    // 3. Évaluer l'appel par rapport à chaque règle
    POUR CHAQUE regle DANS regles_actives_utilisateur FAIRE
        correspondance = service_evaluation_regles.verifier_condition_regle(appel_entrant_details, regle.type_regle, regle.condition_definition)
        // TEST: La fonction verifier_condition_regle est appelée pour chaque règle active.

        SI correspondance.est_vrai ALORS
            action_finale = regle.action_si_condition_vraie
            regle_declenchee_id = regle.id_regle
            details_condition_match = correspondance.details // ex: le mot-clé détecté
            // TEST: Si une règle correspond, son action est prise et la boucle s'arrête.
            SORTIR DE LA BOUCLE // Première règle correspondante gagne
        FIN SI
    FIN POUR

    // 4. Cas particulier : Si aucune règle utilisateur n'a bloqué/autorisé spécifiquement,
    // et que le système anti-spam Roo est activé pour l'utilisateur (implicitement ou par une règle `SYSTEME_ANTI_SPAM_ROO`).
    // Note: Une règle SYSTEME_ANTI_SPAM_ROO pourrait avoir sa propre logique de priorité.
    // Ici, on suppose qu'il s'agit d'une vérification "globale" si aucune règle utilisateur n'a statué.
    // Ou, la règle SYSTEME_ANTI_SPAM_ROO est juste une règle comme une autre dans la liste.
    // Pour cet exemple, nous la considérons comme une règle normale qui aurait été évaluée dans la boucle ci-dessus.
    // Si elle a une priorité haute et est active, elle aurait déjà été traitée.

    // 5. Exécuter l'action déterminée
    service_actions_appel.executer_action(appel_entrant_details.id_appel_temporaire, action_finale, { transcription_requise: (action_finale EST "VERS_REPONDEUR_IA") })
    // TEST: Le service d'exécution d'action est appelé avec l'action correcte.

    // 6. Enregistrer l'appel dans l'historique
    enregistrer_appel_historique(
        utilisateur_destinataire.id_utilisateur,
        appel_entrant_details,
        action_finale,
        regle_declenchee_id,
        details_condition_match,
        // Autres infos comme la transcription si VERS_REPONDEUR_IA
    )
    // TEST: L'enregistrement de l'historique de l'appel est effectué avec tous les détails pertinents.

    RETOURNER action_finale // Peut-être plus d'infos pour le système téléphonique
    // TEST: La fonction retourne l'action finale déterminée.
FIN FONCTION
```

## 3. Service d'Évaluation des Conditions de Règle (`service_evaluation_regles.verifier_condition_regle`)

```pseudocode
FONCTION verifier_condition_regle(appel_entrant, type_regle, condition_definition)
    // RETOURNE { est_vrai: Boolean, details: Objet (optionnel, ex: mot clé trouvé) }

    // TEST: La fonction retourne faux si le type de règle est inconnu.
    resultat = { est_vrai: FAUX, details: NUL }

    SELON type_regle FAIRE
        CAS "LISTE_NOIRE":
            // condition_definition: { numeros: ["...", "..."], blocage_masques: true/false }
            // TEST: LISTE_NOIRE - Un numéro dans la liste est détecté.
            // TEST: LISTE_NOIRE - Un numéro masqué est détecté si blocage_masques est vrai.
            SI appel_entrant.numero_appelant EST DANS condition_definition.numeros ALORS
                resultat.est_vrai = VRAI
            SINON SI condition_definition.blocage_masques EST VRAI ET appel_entrant.numero_appelant EST MASQUE ALORS
                resultat.est_vrai = VRAI
            FIN SI

        CAS "LISTE_BLANCHE":
            // condition_definition: { numeros: ["...", "..."] }
            // TEST: LISTE_BLANCHE - Un numéro dans la liste est détecté.
            // Important: l'action sera "AUTORISER", cette règle doit avoir une haute priorité.
            SI appel_entrant.numero_appelant EST DANS condition_definition.numeros ALORS
                resultat.est_vrai = VRAI
            FIN SI

        CAS "MOTS_CLES_VOIX":
            // condition_definition: { mots_cles: ["...", "..."], langue: "fr-FR" }
            // Nécessite une transcription en temps réel ou post-appel (pour analyse future).
            // Pour une action immédiate (BLOQUER), la transcription doit être rapide.
            // Supposons une transcription partielle disponible.
            // TEST: MOTS_CLES_VOIX - Un mot-clé est détecté dans la transcription (simulée ou réelle).
            transcription_partielle = service_transcription_voix.obtenir_transcription_partielle(appel_entrant.id_appel_temporaire, condition_definition.langue)
            POUR CHAQUE mot_cle DANS condition_definition.mots_cles FAIRE
                SI mot_cle EST DANS transcription_partielle ALORS
                    resultat.est_vrai = VRAI
                    resultat.details = { mot_cle_detecte: mot_cle }
                    SORTIR DE LA BOUCLE
                FIN SI
            FIN POUR

        CAS "HORAIRES":
            // condition_definition: { jours: ["LUN", "MAR"], heure_debut: "HH:MM", heure_fin: "HH:MM", fuseau_horaire: "Europe/Paris" }
            // TEST: HORAIRES - L'appel est en dehors des heures/jours spécifiés.
            // Note: typiquement, une règle "HORAIRES" définit quand les appels sont *autorisés* ou *envoyés à l'IA*.
            // Si on veut bloquer EN DEHORS, la logique est inversée ou l'action est BLOQUER.
            // Supposons que la condition est vraie si l'appel est DANS la plage horaire définie.
            heure_actuelle_convertie = convertir_heure_locale(appel_entrant.timestamp_debut_appel, condition_definition.fuseau_horaire)
            jour_actuel_converti = obtenir_jour_semaine(heure_actuelle_convertie)
            SI jour_actuel_converti EST DANS condition_definition.jours ET
               heure_actuelle_convertie.heure_minute >= condition_definition.heure_debut ET
               heure_actuelle_convertie.heure_minute <= condition_definition.heure_fin ALORS
                resultat.est_vrai = VRAI
            FIN SI
            // Si la règle est "Bloquer EN DEHORS des heures", alors resultat.est_vrai = NON resultat.est_vrai

        CAS "GEO_LOCALISATION_APPELANT":
            // condition_definition: { pays_autorises: ["FR", "BE"], regions_bloquees: ["..."], blocage_international_hors_liste: true }
            // Nécessite un service de géolocalisation par numéro.
            // TEST: GEO_LOCALISATION - Un appelant d'un pays/région bloqué est détecté.
            // TEST: GEO_LOCALISATION - Un appelant international non autorisé est détecté.
            info_geo_appelant = service_geolocation.obtenir_info_numero(appel_entrant.numero_appelant)
            SI info_geo_appelant.pays EST DANS condition_definition.regions_bloquees_par_pays[info_geo_appelant.pays] OU
               info_geo_appelant.region EST DANS condition_definition.regions_bloquees ALORS
                resultat.est_vrai = VRAI // Supposons que la condition est vraie si on doit BLOQUER
            SINON SI condition_definition.blocage_international_hors_liste EST VRAI ET
                      info_geo_appelant.pays N'EST PAS DANS condition_definition.pays_autorises ET
                      info_geo_appelant.est_international EST VRAI ALORS
                resultat.est_vrai = VRAI
            FIN SI
            // Logique à affiner : la condition est vraie si elle DOIT déclencher l'action (ex: bloquer)

        CAS "SYSTEME_ANTI_SPAM_ROO":
            // condition_definition: { niveau_sensibilite: "ELEVE" } (ou vide, utilise le défaut utilisateur)
            // TEST: SYSTEME_ANTI_SPAM_ROO - Le service Roo identifie l'appel comme spam.
            score_spam = service_anti_spam_roo.evaluer_appel(appel_entrant, condition_definition.niveau_sensibilite)
            SI score_spam.est_spam ALORS // Supposons que le service Roo retourne un booléen est_spam
                resultat.est_vrai = VRAI
                resultat.details = { score: score_spam.score, raisons: score_spam.raisons }
            FIN SI

        AUTRES CAS:
            // Type de règle inconnu ou non implémenté
            logguer_erreur("Type de règle inconnu: " + type_regle)
    FIN SELON

    RETOURNER resultat
FIN FONCTION
```

## 4. Enregistrement dans l'Historique (`enregistrer_appel_historique`)

```pseudocode
FONCTION enregistrer_appel_historique(id_utilisateur, appel_entrant, action_prise, id_regle_declenchee, details_condition_match, options_supplementaires)
    // TEST: Un enregistrement d'historique est créé avec toutes les informations pertinentes.
    // TEST: Si id_regle_declenchee est NUL, il est correctement stocké.

    nouvel_historique = NOUVELLE EntiteHistoriqueAppel AVEC
        id_utilisateur = id_utilisateur,
        numero_appelant = appel_entrant.numero_appelant,
        numero_destinataire = appel_entrant.numero_destinataire,
        timestamp_appel = appel_entrant.timestamp_debut_appel,
        action_prise = action_prise,
        id_regle_declenchee = id_regle_declenchee,
        details_condition = details_condition_match,
        // duree_appel_secondes sera mis à jour à la fin de l'appel si autorisé et décroché
        // transcription_ia sera ajoutée si action_prise est VERS_REPONDEUR_IA et transcription disponible
        // evaluation_spam_roo sera ajoutée si disponible

    SI options_supplementaires CONTIENT "transcription" ALORS
        nouvel_historique.transcription_ia = options_supplementaires.transcription
    FIN SI
    SI options_supplementaires CONTIENT "evaluation_roo" ALORS
        nouvel_historique.evaluation_spam_roo = options_supplementaires.evaluation_roo
    FIN SI
    // etc.

    service_base_de_donnees.sauvegarder_historique_appel(nouvel_historique)
    // TEST: La sauvegarde de l'historique en BDD est tentée.
FIN FONCTION
```

## Services Externes et Internes Supposés

*   `service_base_de_donnees`:
    *   `trouver_utilisateur_par_numero_telephone(numero)`
    *   `lister_regles_actives_par_utilisateur_triees(id_utilisateur)`
    *   `sauvegarder_historique_appel(historique_appel_data)`
*   `service_abonnement`:
    *   `statut_filtrage_actif(id_utilisateur)`: Vérifie si l'utilisateur a un abonnement actif permettant le filtrage.
*   `service_actions_appel`:
    *   `executer_action(id_appel, action, options)`: Interface avec le système téléphonique pour bloquer, autoriser, transférer vers l'IA, etc.
*   `service_transcription_voix`:
    *   `obtenir_transcription_partielle(id_appel, langue)`: Fournit une transcription en quasi temps réel.
*   `service_geolocation`:
    *   `obtenir_info_numero(numero_appelant)`: Fournit des infos géographiques.
*   `service_anti_spam_roo`:
    *   `evaluer_appel(appel_entrant, niveau_sensibilite)`: Retourne une évaluation de spam.
*   Utilitaires:
    *   `convertir_heure_locale(timestamp, fuseau_horaire)`
    *   `obtenir_jour_semaine(timestamp_local)`

Ce module est le moteur principal qui applique la logique de filtrage définie par l'utilisateur aux appels réels.