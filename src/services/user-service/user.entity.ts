export enum UserAccountStatus {
  ACTIVE = "ACTIF",
  PENDING_EMAIL_VALIDATION = "EN_ATTENTE_VALIDATION_EMAIL",
  SUSPENDED = "SUSPENDU",
}

export class User {
  id_utilisateur: string; // UUID
  nom_complet: string;
  email: string; // Unique
  mot_de_passe_hash: string;
  numero_telephone_principal?: string; // Unique, optionnel pour l'instant, à clarifier vs NumeroVirtuel
  id_abonnement_actuel?: string; // UUID, FK vers Abonnement
  date_inscription: Date;
  statut_compte: UserAccountStatus;
  token_validation_email?: string | null;
  date_expiration_token_validation?: Date | null;
  token_reinitialisation_mdp?: string | null;
  date_expiration_token_reinit?: Date | null;
  date_derniere_connexion?: Date | null;

  constructor(
    id_utilisateur: string,
    nom_complet: string,
    email: string,
    mot_de_passe_hash: string,
    date_inscription: Date,
    statut_compte: UserAccountStatus,
    numero_telephone_principal?: string,
    id_abonnement_actuel?: string,
    token_validation_email?: string | null,
    date_expiration_token_validation?: Date | null,
    token_reinitialisation_mdp?: string | null,
    date_expiration_token_reinit?: Date | null,
    date_derniere_connexion?: Date | null,
  ) {
    this.id_utilisateur = id_utilisateur;
    this.nom_complet = nom_complet;
    this.email = email;
    this.mot_de_passe_hash = mot_de_passe_hash;
    this.date_inscription = date_inscription;
    this.statut_compte = statut_compte;
    this.numero_telephone_principal = numero_telephone_principal;
    this.id_abonnement_actuel = id_abonnement_actuel;
    this.token_validation_email = token_validation_email;
    this.date_expiration_token_validation = date_expiration_token_validation;
    this.token_reinitialisation_mdp = token_reinitialisation_mdp;
    this.date_expiration_token_reinit = date_expiration_token_reinit;
    this.date_derniere_connexion = date_derniere_connexion;
  }
  // D'après le modèle de données conceptuel, il y a aussi id_config_ia, mais non présent dans le pseudocode de l'entité User.
  // Je le laisse de côté pour l'instant pour cette entité spécifique et le traiterai avec S_AssistantIA.
}