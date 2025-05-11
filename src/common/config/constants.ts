// Durées en millisecondes
export const DUREE_VALIDITE_TOKEN_EMAIL_MS = 24 * 60 * 60 * 1000; // 24 heures
export const DUREE_VALIDITE_TOKEN_REINIT_MDP_MS = 1 * 60 * 60 * 1000; // 1 heure

// Regex pour validation
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // E.164 format basique

// Critères de complexité du mot de passe
export const MIN_PASSWORD_LENGTH = 8;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_DIGIT_REGEX = /[0-9]/;
export const PASSWORD_SYMBOL_REGEX = /[\W_]/; // \W correspond à tout ce qui n'est pas un mot (lettre, chiffre, _) et _ est ajouté explicitement

// Rôles utilisateur (si nécessaire plus tard)
export enum UserRoles {
  USER = "USER",
  ADMIN = "ADMIN",
}

// Messages d'erreur standardisés
export const MESSAGES_ERREUR = {
  COMPTE: {
    CREATION_GENERIQUE: "Impossible de créer le compte. Veuillez vérifier vos informations ou essayer plus tard.",
    EMAIL_INVALIDE: "Format d'email invalide.",
    MOT_DE_PASSE_COMPLEXITE: `Le mot de passe ne respecte pas les critères de complexité (minimum ${MIN_PASSWORD_LENGTH} caractères, une majuscule, une minuscule, un chiffre, un symbole).`,
    // EMAIL_EXISTANT est volontairement le même que CREATION_GENERIQUE pour la sécurité
    EMAIL_EXISTANT: "Impossible de créer le compte. Veuillez vérifier vos informations ou essayer plus tard.",
    LOGIN_GENERIQUE: "Email ou mot de passe incorrect.",
    COMPTE_INACTIF: "Votre compte est actuellement inactif ou suspendu.",
    COMPTE_ATTENTE_VALIDATION: "Votre compte est en attente de validation. Veuillez vérifier vos emails.",
    TOKEN_VALIDATION_INVALIDE: "Token de validation invalide ou expiré.",
    TOKEN_VALIDATION_EXPIRE: "Token de validation expiré. Veuillez demander un nouveau lien de validation.",
    COMPTE_DEJA_ACTIF: "Ce compte est déjà actif.",
    REINITIALISATION_MOT_DE_PASSE_INFO: "Si un compte avec cet email existe et est valide, un email de réinitialisation a été envoyé.", // Utilisé comme réponse à l'utilisateur, pas comme une erreur interne.
    TOKEN_REINITIALISATION_INVALIDE: "Token de réinitialisation invalide ou expiré.",
    TOKEN_REINITIALISATION_EXPIRE: "Token de réinitialisation expiré. Veuillez refaire une demande.",
  },
  PROFIL: {
    MISE_A_JOUR_INTERDITE: "Vous n'êtes pas autorisé à mettre à jour ce profil.",
    UTILISATEUR_NON_TROUVE: "Utilisateur non trouvé.",
  },
  SECURITE: {
    ACTION_NON_AUTORISEE: "Action non autorisée.",
    RESSOURCE_NON_TROUVEE: "Ressource non trouvée.",
    ERREUR_CRYPTO: "Une erreur de cryptographie est survenue.",
  },
  VALIDATION: {
    DONNEES_MANQUANTES: "Des données requises sont manquantes.",
    FORMAT_INVALIDE: "Le format des données fournies est invalide.",
  },
  SYSTEME: {
    ERREUR_INTERNE: "Une erreur interne est survenue. Veuillez réessayer plus tard.",
    ERREUR_DATABASE: "Une erreur de base de données est survenue.",
    ERREUR_EMAIL_SERVICE: "Le service d'envoi d'emails a rencontré un problème.",
    ERREUR_AUTH_SERVICE: "Le service d'authentification a rencontré un problème."
  },
  GENERIQUE: "Une erreur est survenue. Veuillez réessayer plus tard."
};