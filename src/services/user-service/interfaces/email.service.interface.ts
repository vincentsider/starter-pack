export interface IEmailService {
  sendValidationEmail(email: string, name: string, token: string): Promise<void>;
  sendPasswordResetEmail(email: string, name: string, token: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendPasswordChangedConfirmationEmail(email: string, name: string): Promise<void>;
}