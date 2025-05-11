# Pseudocode : Module Assistant IA et Interactions

Ce module gère les interactions entre les appelants et l'assistant IA lorsque les appels sont transférés par le module de traitement des appels. Il couvre la conversation, la prise de messages, la transcription, et potentiellement la configuration de la personnalité de l'IA par l'utilisateur.

## 1. Entités Concernées (Rappel et Nouvelle)
*   `HistoriqueAppel`: (défini précédemment)
    *   Le champ `transcription_ia` sera crucial ici.
    *   Un nouveau champ pourrait être `details_interaction_ia` (Objet JSON) pour stocker plus que la simple transcription, par exemple, les étapes de la conversation, les intentions détectées, etc.
        *   // TEST_DOM: Le champ `transcription_ia` de HistoriqueAppel est utilisé.
        *   // TEST_DOM: Un nouveau champ `details_interaction_ia` dans HistoriqueAppel peut être envisagé et est aligné.
*   `ConfigurationAssistantIAUtilisateur`: (Nouvelle entité)
    *   `id_config_ia` (UUID, PK)
    *   `id_utilisateur` (UUID, FK vers `Utilisateur`, Unique)
    *   `nom_assistant` (String, Optionnel, ex: "L'assistant de [NomUtilisateur]")
    *   `message_accueil_personnalise` (String, Optionnel)
    *   `instructions_specifiques_ia` (Texte, Optionnel, pour guider les réponses ou la prise d'info)
    *   `langue_preferentielle_ia` (String, ex: "fr-FR", "en-US")
    *   `transfert_appel_humain_si_urgence` (Boolean, Default: false)
    *   `numero_transfert_urgence` (String, Optionnel, si `transfert_appel_humain_si_urgence` est vrai)
        *   // TEST_DOM: La nouvelle entité `ConfigurationAssistantIAUtilisateur` est bien définie.

## 2. Processus d'Interaction avec l'IA (`handle_ia_call_interaction`)

```pseudocode
FONCTION handle_ia_call_interaction(id_appel_temporaire, numero_appelant, utilisateur_destinataire)
    // TEST: La fonction est appelée lorsqu'un appel est transféré à l'IA.
    // TEST: Les configurations de l'IA de l'utilisateur sont correctement chargées.
    // TEST: Un message d'accueil personnalisé est joué s'il est configuré.
    // TEST: L'IA engage la conversation et tente de comprendre la raison de l'appel.
    // TEST: L'interaction est transcrite.
    // TEST: Un message est pris si nécessaire.
    // TEST: L'historique de l'appel est mis à jour avec la transcription et les détails de l'interaction.

    // 1. Récupérer la configuration IA de l'utilisateur
    config_ia = service_base_de_donnees.trouver_configuration_ia_utilisateur(utilisateur_destinataire.id_utilisateur)
    SI config_ia EST nulle ALORS
        config_ia = CONFIGURATION_IA_DEFAUT // Utiliser des valeurs par défaut globales
        // TEST: Une configuration IA par défaut est utilisée si aucune configuration utilisateur n'existe.
    FIN SI

    // 2. Initialiser la session d'appel avec le service IA
    // (Cela peut impliquer des API externes de services vocaux et de NLU/NLG)
    session_ia_active = service_moteur_ia.initialiser_session_appel_ia(
        id_appel_temporaire,
        numero_appelant,
        config_ia.langue_preferentielle_ia
    )
    // TEST: L'initialisation de la session IA réussit.

    SI session_ia_active EST un échec ALORS
        logguer_erreur("Échec de l'initialisation de la session IA pour l'appel: " + id_appel_temporaire)
        // Tenter une action de repli, ex: message vocal standard, ou raccrocher poliment.
        service_telephonie.jouer_message_erreur_et_raccrocher(id_appel_temporaire)
        enregistrer_echec_interaction_ia_dans_historique(id_appel_temporaire, utilisateur_destinataire.id_utilisateur, "ECHEC_INIT_IA")
        RETOURNER
        // TEST: Un échec d'initialisation de la session IA est géré.
    FIN SI

    // 3. Jouer le message d'accueil
    message_accueil = config_ia.message_accueil_personnalise SI config_ia.message_accueil_personnalise EST defini SINON MESSAGE_ACCUEIL_IA_DEFAUT
    service_moteur_ia.jouer_audio(session_ia_active, convertir_texte_en_audio(message_accueil, config_ia.langue_preferentielle_ia))
    // TEST: Le message d'accueil (personnalisé ou par défaut) est joué.

    // 4. Boucle de conversation
    transcription_complete = ""
    details_conversation = NOUVELLE Collection // Pour stocker les tours de parole, intentions, etc.
    continuer_conversation = VRAI

    TANT QUE continuer_conversation ET service_telephonie.appel_est_actif(id_appel_temporaire) FAIRE
        // a. Écouter la réponse de l'appelant (avec transcription en direct)
        reponse_appelant_audio = service_moteur_ia.ecouter_et_transcrire(session_ia_active, { timeout_silence: 5_SECONDES })
        // TEST: L'IA écoute et transcrit la réponse de l'appelant.

        SI reponse_appelant_audio.statut EST "TIMEOUT_SILENCE" OU reponse_appelant_audio.statut EST "APPEL_TERMINE_PAR_APPELANT" ALORS
            continuer_conversation = FAUX
            // TEST: La conversation se termine si l'appelant raccroche ou reste silencieux trop longtemps.
            SORTIR DE LA BOUCLE
        FIN SI

        texte_appelant = reponse_appelant_audio.transcription
        transcription_complete += "\nAppelant: " + texte_appelant
        AJOUTER_A(details_conversation, { locuteur: "APPELANT", texte: texte_appelant, timestamp: date_heure_actuelle() })

        // b. Analyser l'intention de l'appelant et générer une réponse de l'IA
        intention_et_reponse_ia = service_moteur_ia.analyser_et_generer_reponse(
            session_ia_active,
            texte_appelant,
            config_ia.instructions_specifiques_ia,
            OBTENIR_CONTEXTE_CONVERSATION(details_conversation)
        )
        // TEST: L'intention de l'appelant est analysée et une réponse IA est générée.

        texte_reponse_ia = intention_et_reponse_ia.texte_reponse
        transcription_complete += "\nAssistant: " + texte_reponse_ia
        AJOUTER_A(details_conversation, { locuteur: "ASSISTANT_IA", texte: texte_reponse_ia, timestamp: date_heure_actuelle() })

        // c. Jouer la réponse de l'IA
        service_moteur_ia.jouer_audio(session_ia_active, convertir_texte_en_audio(texte_reponse_ia, config_ia.langue_preferentielle_ia))
        // TEST: La réponse audio de l'IA est jouée.

        // d. Vérifier si la conversation doit se terminer (ex: IA a pris un message, appelant veut raccrocher)
        SI intention_et_reponse_ia.action_speciale EST "TERMINER_CONVERSATION" OU
           intention_et_reponse_ia.action_speciale EST "MESSAGE_PRIS" ALORS
            continuer_conversation = FAUX
            // TEST: La conversation se termine lorsque l'IA détermine que c'est approprié.
        FIN SI

        // e. Gérer le cas d'urgence si configuré
        SI config_ia.transfert_appel_humain_si_urgence EST VRAI ET intention_et_reponse_ia.intention_detectee EST "URGENCE" ALORS
            SI config_ia.numero_transfert_urgence EST VALIDE ALORS
                service_moteur_ia.jouer_audio(session_ia_active, convertir_texte_en_audio(MESSAGE_TRANSFERT_URGENCE, config_ia.langue_preferentielle_ia))
                service_telephonie.transferer_appel(id_appel_temporaire, config_ia.numero_transfert_urgence)
                // TEST: Un appel est transféré à un numéro d'urgence si l'intention est détectée et configurée.
                continuer_conversation = FAUX // Le transfert termine la session IA
            SINON
                service_moteur_ia.jouer_audio(session_ia_active, convertir_texte_en_audio(MESSAGE_URGENCE_NON_CONFIG, config_ia.langue_preferentielle_ia))
                // Continuer la conversation pour tenter de prendre un message détaillé sur l'urgence.
            FIN SI
        FIN SI
    FIN TANT QUE

    // 5. Finaliser la session IA
    service_moteur_ia.terminer_session_appel_ia(session_ia_active)
    // TEST: La session IA est correctement terminée.

    // 6. Mettre à jour l'historique de l'appel avec la transcription et les détails
    // (L'enregistrement initial de l'historique a été fait par process_incoming_call avec action VERS_REPONDEUR_IA)
    service_base_de_donnees.mettre_a_jour_historique_appel_avec_details_ia(
        id_appel_temporaire, // ou l'ID d'historique si disponible
        utilisateur_destinataire.id_utilisateur,
        transcription_complete,
        details_conversation // Peut inclure un résumé, un message pris, etc.
    )
    // TEST: L'historique de l'appel est mis à jour avec la transcription complète et les détails de l'interaction.

    // 7. Envoyer une notification à l'utilisateur
    message_notif = "Votre assistant IA a interagi avec " + numero_appelant + ". Transcription disponible."
    lien_notif = "/historique/appel/" + OBTENIR_ID_HISTORIQUE_PAR_ID_APPEL_TEMP(id_appel_temporaire)
    create_notification(utilisateur_destinataire.id_utilisateur, "NOUVEL_APPEL_REPONDEUR_IA", message_notif, lien_notif)
    // TEST: Une notification est envoyée à l'utilisateur concernant l'interaction IA.

FIN FONCTION
```

## 3. Configuration de l'Assistant IA par l'Utilisateur

### 3.1. Obtenir la Configuration IA (`get_ia_configuration`)

```pseudocode
FONCTION get_ia_configuration(id_utilisateur)
    // TEST: L'utilisateur doit exister.
    // TEST: La configuration IA de l'utilisateur est retournée si elle existe.
    // TEST: Une configuration par défaut (ou des champs vides) est retournée si aucune n'existe.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La récupération de config IA échoue pour un utilisateur inconnu.
    FIN SI

    config_ia = service_base_de_donnees.trouver_configuration_ia_utilisateur(id_utilisateur)
    SI config_ia EST nulle ALORS
        RETOURNER SUCCES AVEC { configuration_ia: CONFIGURATION_IA_DEFAUT_POUR_AFFICHAGE }
        // TEST: Retourne une structure de configuration par défaut si aucune config utilisateur.
    SINON
        RETOURNER SUCCES AVEC { configuration_ia: config_ia }
        // TEST: Retourne la configuration IA existante de l'utilisateur.
    FIN SI
FIN FONCTION
```

### 3.2. Mettre à Jour la Configuration IA (`update_ia_configuration`)

```pseudocode
FONCTION update_ia_configuration(id_utilisateur, nouveaux_parametres_config)
    // nouveaux_parametres_config: { nom_assistant, message_accueil_personnalise, instructions_specifiques_ia, langue_preferentielle_ia, etc. }
    // TEST: L'utilisateur doit exister.
    // TEST: Les paramètres fournis sont validés (ex: format langue, validité numéro de transfert).
    // TEST: La configuration IA est créée si elle n'existe pas.
    // TEST: La configuration IA est mise à jour si elle existe.

    utilisateur = service_base_de_donnees.trouver_utilisateur_par_id(id_utilisateur)
    SI utilisateur EST nul ALORS
        RETOURNER ERREUR "Utilisateur non trouvé."
        // TEST: La mise à jour de config IA échoue pour un utilisateur inconnu.
    FIN SI

    // Validation des nouveaux_parametres_config
    erreurs_validation = VALIDER_PARAMETRES_CONFIG_IA(nouveaux_parametres_config)
    SI erreurs_validation NON vide ALORS
        RETOURNER ERREUR AVEC { erreurs: erreurs_validation }
        // TEST: La mise à jour échoue si les paramètres de configuration sont invalides.
    FIN SI

    config_ia_existante = service_base_de_donnees.trouver_configuration_ia_utilisateur(id_utilisateur)
    SI config_ia_existante EST nulle ALORS
        config_ia_maj = NOUVELLE EntiteConfigurationAssistantIAUtilisateur AVEC
            id_utilisateur = id_utilisateur
            // Appliquer les nouveaux_parametres_config et les valeurs par défaut pour les champs manquants
        // TEST: Une nouvelle configuration IA est créée si aucune n'existait.
    SINON
        config_ia_maj = config_ia_existante
        // Appliquer les nouveaux_parametres_config à config_ia_maj
        // TEST: La configuration IA existante est mise à jour.
    FIN SI

    APPLIQUER_MODIFICATIONS(config_ia_maj, nouveaux_parametres_config) // Fonction utilitaire

    resultat_sauvegarde = service_base_de_donnees.sauvegarder_configuration_ia_utilisateur(config_ia_maj)
    SI resultat_sauvegarde EST un échec ALORS
        RETOURNER ERREUR "Échec de la sauvegarde de la configuration de l'assistant IA."
        // TEST: La mise à jour échoue en cas d'erreur BDD.
    FIN SI

    RETOURNER SUCCES AVEC { configuration_ia: config_ia_maj }
    // TEST: La configuration IA est sauvegardée et retournée avec succès.
FIN FONCTION
```

## Services Externes et Internes Supposés

*   `service_base_de_donnees`:
    *   `trouver_configuration_ia_utilisateur(id_utilisateur)`
    *   `sauvegarder_configuration_ia_utilisateur(config_data)`
    *   `mettre_a_jour_historique_appel_avec_details_ia(id_appel_ou_historique, id_utilisateur, transcription, details_interaction)`
*   `service_moteur_ia` (pourrait être une façade pour plusieurs services externes comme STT, TTS, NLU/NLG):
    *   `initialiser_session_appel_ia(id_appel, numero_appelant, langue)`
    *   `jouer_audio(session_ia_active, audio_data_ou_url)`
    *   `ecouter_et_transcrire(session_ia_active, options_ecoute)`
    *   `analyser_et_generer_reponse(session_ia_active, texte_entree, instructions_personnalisees, contexte_conversation)`
    *   `terminer_session_appel_ia(session_ia_active)`
*   `service_telephonie` (interface avec le système téléphonique):
    *   `appel_est_actif(id_appel_temporaire)`
    *   `jouer_message_erreur_et_raccrocher(id_appel_temporaire)`
    *   `transferer_appel(id_appel_temporaire, numero_destination)`
*   `create_notification` (défini dans le module précédent)
*   Utilitaires:
    *   `convertir_texte_en_audio(texte, langue)`: Produit des données audio ou une URL vers un fichier audio.
    *   `OBTENIR_CONTEXTE_CONVERSATION(details_conversation)`: Prépare le contexte pour le moteur IA.
    *   `VALIDER_PARAMETRES_CONFIG_IA(params)`: Valide les entrées de configuration.
    *   `APPLIQUER_MODIFICATIONS(entite_existante, nouvelles_valeurs)`: Met à jour une entité avec de nouvelles valeurs.
    *   `OBTENIR_ID_HISTORIQUE_PAR_ID_APPEL_TEMP(id_appel_temporaire)`

Ce module est complexe car il implique une interaction en temps réel et l'intégration avec des services d'IA. Les tests devront couvrir de nombreux scénarios de conversation.