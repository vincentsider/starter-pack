export class UpdateProfileDto {
  nom?: string;
  email?: string; // Pourrait nécessiter une re-validation si modifié
  preferences_communication?: {
    email?: boolean;
    sms?: boolean;
  };
  // autres champs comme numero_telephone, etc.
}