export interface IAuthService {
  generateSessionToken(userId: string, roles: string[]): Promise<string>;
  invalidateSessionToken(token: string): Promise<void>; // Pour les tokens stateful si nécessaire
  // Les fonctions utilitaires comme `generer_hash_securise` et `verifier_mot_de_passe`
  // pourraient être dans un module séparé d'utilitaires de cryptographie
  // ou faire partie de ce service si cela a du sens dans l'architecture globale.
  // Pour l'instant, je les considère comme des fonctions utilitaires globales.
}