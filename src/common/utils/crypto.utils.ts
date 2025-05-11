import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10; // Configurable

export class CryptoUtils {
  public static async generateSecureHash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  public static async verifyPassword(
    plainText: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }

  public static generateUniqueToken(): string {
    return uuidv4();
  }
}