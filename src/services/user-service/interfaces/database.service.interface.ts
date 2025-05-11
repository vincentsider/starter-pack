import { User } from '../user.entity';

export interface IDatabaseService {
  emailExists(email: string): Promise<boolean>;
  phoneNumberExists(phoneNumber: string): Promise<boolean>;
  saveUser(user: User): Promise<User>; // Retourne l'utilisateur sauvegardé, potentiellement avec son ID
  findUserByValidationToken(token: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByPasswordResetToken(token: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  deleteValidationToken(user: User): Promise<void>; // Ou mettre à jour l'utilisateur directement
}