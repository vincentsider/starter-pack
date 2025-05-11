export class CreateUserDto {
  nom: string;
  email: string;
  mot_de_passe: string;
  // preferences_communication et autres champs optionnels peuvent être ajoutés ici
  // ou dans un DTO de mise à jour de profil si non requis à la création.
  // Pour l'instant, je garde les champs essentiels du pseudocode.
}