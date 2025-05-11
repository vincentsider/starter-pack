import { User, UserAccountStatus } from './user.entity';
import { IDatabaseService } from './interfaces/database.service.interface';
import { IEmailService } from './interfaces/email.service.interface';
import { IAuthService } from './interfaces/auth.service.interface';
import { CryptoUtils } from '../../common/utils/crypto.utils';
import validator from 'validator';
import pino, { Logger } from 'pino';
import {
  DUREE_VALIDITE_TOKEN_EMAIL_MS,
  DUREE_VALIDITE_TOKEN_REINIT_MDP_MS,
  MIN_PASSWORD_LENGTH,
  PASSWORD_UPPERCASE_REGEX,
  PASSWORD_LOWERCASE_REGEX,
  PASSWORD_DIGIT_REGEX,
  PASSWORD_SYMBOL_REGEX,
  MESSAGES_ERREUR,
} from '../../common/config/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

export class UserService {
  private readonly logger: Logger;

  constructor(
    private readonly databaseService: IDatabaseService,
    private readonly emailService: IEmailService,
    private readonly authService: IAuthService,
  ) {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    });
  }

  private isPasswordComplex(password: string): boolean {
    this.logger.info(`[isPasswordComplex] Checking password: "${password}" (length: ${password.length})`);
    const lengthOk = password.length >= MIN_PASSWORD_LENGTH;
    const uppercaseOk = PASSWORD_UPPERCASE_REGEX.test(password);
    const lowercaseOk = PASSWORD_LOWERCASE_REGEX.test(password);
    const digitOk = PASSWORD_DIGIT_REGEX.test(password);
    const symbolOk = PASSWORD_SYMBOL_REGEX.test(password);

    this.logger.info(`[isPasswordComplex] Criteria: MIN_PASSWORD_LENGTH=${MIN_PASSWORD_LENGTH}`);
    this.logger.info(`[isPasswordComplex] Regex: UPPERCASE=${PASSWORD_UPPERCASE_REGEX}, LOWERCASE=${PASSWORD_LOWERCASE_REGEX}, DIGIT=${PASSWORD_DIGIT_REGEX}, SYMBOL=${PASSWORD_SYMBOL_REGEX}`);
    this.logger.info(`[isPasswordComplex] Results for "${password}": lengthOk=${lengthOk}, uppercaseOk=${uppercaseOk}, lowercaseOk=${lowercaseOk}, digitOk=${digitOk}, symbolOk=${symbolOk}`);

    if (!lengthOk) {
      this.logger.info(`[isPasswordComplex] Failed for "${password}": MIN_PASSWORD_LENGTH`);
      return false;
    }
    if (!uppercaseOk) {
      this.logger.info(`[isPasswordComplex] Failed for "${password}": PASSWORD_UPPERCASE_REGEX`);
      return false;
    }
    if (!lowercaseOk) {
      this.logger.info(`[isPasswordComplex] Failed for "${password}": PASSWORD_LOWERCASE_REGEX`);
      return false;
    }
    if (!digitOk) {
      this.logger.info(`[isPasswordComplex] Failed for "${password}": PASSWORD_DIGIT_REGEX`);
      return false;
    }
    if (!symbolOk) {
      this.logger.info(`[isPasswordComplex] Failed for "${password}": PASSWORD_SYMBOL_REGEX`);
      return false;
    }
    this.logger.info(`[isPasswordComplex] Passed all checks for "${password}".`);
    return true;
  }

  // Les méthodes seront implémentées ici
  // en suivant le pseudocode 01_module_gestion_utilisateurs.md

  /**
   * Crée un nouvel utilisateur.
   * @param createUserDto Données pour la création de l'utilisateur.
   * @returns L'utilisateur créé (sans le mot de passe).
   */
  // @TODO: Intégrer la limitation de taux ici
  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    // 1. Valider les données d'entrée (email, mot de passe)
    if (!validator.isEmail(createUserDto.email)) {
      this.logger.warn(`Tentative de création de compte avec un email au format invalide: ${createUserDto.email}`);
      throw new Error(MESSAGES_ERREUR.COMPTE.EMAIL_INVALIDE);
    }
    if (!this.isPasswordComplex(createUserDto.mot_de_passe)) {
      this.logger.warn(`Tentative de création de compte pour ${createUserDto.email} avec un mot de passe ne respectant pas les critères de complexité.`);
      throw new Error(MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE);
    }

    // 2. Vérifier si l'email existe déjà
    const existingUser = await this.databaseService.findUserByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      // Message générique pour ne pas confirmer l'existence d'un email
      this.logger.info(`Tentative de création de compte avec un email existant: ${createUserDto.email}`);
      throw new Error("Impossible de créer le compte. Veuillez vérifier vos informations ou essayer plus tard.");
    }

    // 3. Hasher le mot de passe
    const hashedPassword = await CryptoUtils.generateSecureHash(
      createUserDto.mot_de_passe,
    );

    // 4. Créer l'entité utilisateur
    const userId = CryptoUtils.generateUniqueToken();
    const tokenValidation = CryptoUtils.generateUniqueToken();
    const dateExpirationTokenEmail = new Date(
      Date.now() + DUREE_VALIDITE_TOKEN_EMAIL_MS,
    );

    const newUser = new User(
      userId,
      createUserDto.nom, // nom_complet est attendu par l'entité
      createUserDto.email,
      hashedPassword,
      new Date(), // date_inscription
      UserAccountStatus.PENDING_EMAIL_VALIDATION, // statut_compte
      undefined, // numero_telephone_principal
      undefined, // id_abonnement_actuel
      tokenValidation, // token_validation_email
      dateExpirationTokenEmail, // date_expiration_token_validation
      null, // token_reinitialisation_mdp
      null, // date_expiration_token_reinit
      new Date(), // date_derniere_connexion (ou null, à clarifier lors du login)
    );
    // Note: date_mise_a_jour n'est pas dans le constructeur, elle devrait être gérée par le service de BDD ou manuellement avant la sauvegarde.
    // Pour l'instant, on peut l'omettre ici si le service de BDD s'en charge ou l'ajouter manuellement.
    // newUser.date_mise_a_jour = new Date(); // Si besoin de le gérer ici

    // 5. Sauvegarder l'utilisateur en base de données
    const savedUser = await this.databaseService.saveUser(newUser);

    // 6. Envoyer l'email de validation
    await this.emailService.sendValidationEmail(
      savedUser.email,
      savedUser.nom_complet, // Correction: utiliser nom_complet
      savedUser.token_validation_email!,
    );

    // 7. Retourner l'utilisateur créé (sans informations sensibles)
    // 7. Retourner l'utilisateur créé (sans informations sensibles et avec l'ID utilisateur correct)
    const {
      mot_de_passe_hash,          // Exclure
      token_validation_email,     // Exclure
      date_expiration_token_validation, // Exclure
      token_reinitialisation_mdp, // Exclure
      date_expiration_token_reinit, // Exclure
      id_utilisateur: _savedUserId, // Récupérer pour l'exclure si différent, mais on va forcer `userId` de toute façon
      ...publicDataFromSavedUser
    } = savedUser;

    return {
      ...publicDataFromSavedUser, // Contient tous les autres champs de savedUser
      id_utilisateur: userId,    // S'assurer que l'id retourné est celui généré initialement
    };
  }

  /**
   * Connecte un utilisateur.
   * @param loginUserDto Données pour la connexion de l'utilisateur.
   * @returns Un token JWT si la connexion est réussie.
   */
  // @TODO: Intégrer la limitation de taux ici
  async loginUser(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    // 1. Valider les données d'entrée (email)
    if (!validator.isEmail(loginUserDto.email)) {
      this.logger.warn(`Tentative de connexion avec un email au format invalide: ${loginUserDto.email}`);
      throw new Error(MESSAGES_ERREUR.COMPTE.EMAIL_INVALIDE);
    }

    // 2. Rechercher l'utilisateur par email
    const user = await this.databaseService.findUserByEmail(loginUserDto.email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect.'); // Message générique pour la sécurité
    }

    // 3. Vérifier si le compte est actif
    if (user.statut_compte !== UserAccountStatus.ACTIVE) {
      if (user.statut_compte === UserAccountStatus.PENDING_EMAIL_VALIDATION) {
        throw new Error(
          'Votre compte est en attente de validation. Veuillez vérifier vos emails.',
        );
      }
      throw new Error('Votre compte est actuellement inactif ou suspendu.');
    }

    // 4. Vérifier le mot de passe
    const isPasswordValid = await CryptoUtils.verifyPassword(
      loginUserDto.mot_de_passe,
      user.mot_de_passe_hash,
    );
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect.'); // Message générique
    }

    // 5. Générer un token JWT
    // TODO: Gérer les rôles utilisateur lorsque la fonctionnalité sera implémentée
    const token = await this.authService.generateSessionToken(user.id_utilisateur, []);

    // 6. Mettre à jour la date de dernière connexion (optionnel, mais bonne pratique)
    user.date_derniere_connexion = new Date();
    await this.databaseService.updateUser(user);


    // 7. Retourner le token
    return { token };
  }

  /**
   * Valide l'email d'un utilisateur à l'aide d'un token.
   * @param validateEmailDto Données pour la validation de l'email.
   */
  async validateEmail(validateEmailDto: ValidateEmailDto): Promise<void> {
    // 1. Rechercher l'utilisateur par token de validation
    const user = await this.databaseService.findUserByValidationToken(
      validateEmailDto.token,
    );

    if (!user) {
      throw new Error('Token de validation invalide ou expiré.');
    }

    // 2. Vérifier si le token n'est pas expiré
    if (
      !user.date_expiration_token_validation ||
      user.date_expiration_token_validation < new Date()
    ) {
      // Optionnel: Permettre de renvoyer un email de validation si expiré
      await this.databaseService.deleteValidationToken(user); // Supprimer le token expiré
      throw new Error(
        'Token de validation expiré. Veuillez demander un nouveau lien de validation.',
      );
    }

    // 3. Vérifier si le compte est déjà actif
    if (user.statut_compte === UserAccountStatus.ACTIVE) {
      throw new Error('Ce compte est déjà actif.');
    }

    // 4. Mettre à jour le statut du compte à ACTIF
    user.statut_compte = UserAccountStatus.ACTIVE;
    user.token_validation_email = null; // Invalider le token
    user.date_expiration_token_validation = null; // Invalider la date d'expiration
    // La date de mise à jour devrait être gérée automatiquement par la base de données ou le service de base de données.

    await this.databaseService.updateUser(user);

    // 5. Envoyer un email de bienvenue (optionnel)
    await this.emailService.sendWelcomeEmail(user.email, user.nom_complet);
  }

  /**
   * Gère une demande de réinitialisation de mot de passe.
   * @param requestPasswordResetDto Données pour la demande de réinitialisation.
   */
  async requestPasswordReset(
    requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<void> {
    // @TODO: Intégrer la limitation de taux ici
    // 1. Valider l'email
    if (!validator.isEmail(requestPasswordResetDto.email)) {
      this.logger.warn(`Tentative de réinitialisation de mot de passe avec email invalide: ${requestPasswordResetDto.email}`);
      // Réponse générique pour ne pas indiquer si le format est le problème vs l'existence de l'email
      throw new Error(MESSAGES_ERREUR.COMPTE.EMAIL_INVALIDE); // Ou un message plus générique si préféré, mais pour le test spécifique c'est EMAIL_INVALIDE
    }

    // 2. Rechercher l'utilisateur par email
    const user = await this.databaseService.findUserByEmail(
      requestPasswordResetDto.email,
    );

    if (!user) {
      this.logger.info(
        `Tentative de réinitialisation de mot de passe pour un email non trouvé: ${requestPasswordResetDto.email}`,
      );
      // Ne pas divulguer que l'utilisateur n'existe pas. Envoyer une réponse comme si l'email avait été envoyé.
      // Le service d'email ne sera pas appelé.
      return;
    }

    // 3. Vérifier si le compte est dans un état permettant la réinitialisation
    // (Actif ou en attente de validation email, car un utilisateur peut oublier son mdp avant de valider son email)
    if (
      user.statut_compte !== UserAccountStatus.ACTIVE &&
      user.statut_compte !== UserAccountStatus.PENDING_EMAIL_VALIDATION
    ) {
      this.logger.warn(
        `Tentative de réinitialisation de mot de passe pour un compte inactif/suspendu: ${user.email}`,
      );
      // Réponse générique
      return;
    }

    // 4. Générer un token de réinitialisation de mot de passe et sa date d'expiration
    const resetToken = CryptoUtils.generateUniqueToken();
    const expirationDate = new Date(
      Date.now() + DUREE_VALIDITE_TOKEN_REINIT_MDP_MS,
    );

    user.token_reinitialisation_mdp = resetToken;
    user.date_expiration_token_reinit = expirationDate;
    // user.date_mise_a_jour = new Date(); // Géré par la BDD ou le service de BDD

    await this.databaseService.updateUser(user);

    // 5. Envoyer l'email de réinitialisation de mot de passe
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.nom_complet,
      resetToken,
    );
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur à l'aide d'un token.
   * @param resetPasswordDto Données pour la réinitialisation du mot de passe.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    // 1. Rechercher l'utilisateur par token de réinitialisation
    const user = await this.databaseService.findUserByPasswordResetToken(
      resetPasswordDto.token,
    );

    if (!user) {
      this.logger.warn(`Tentative de réinitialisation de mot de passe avec un token invalide ou non trouvé: ${resetPasswordDto.token}`);
      throw new Error(MESSAGES_ERREUR.COMPTE.TOKEN_REINITIALISATION_INVALIDE);
    }

    // 2. Vérifier si le token n'est pas expiré
    if (
      !user.date_expiration_token_reinit ||
      user.date_expiration_token_reinit < new Date()
    ) {
      this.logger.warn(`Tentative de réinitialisation de mot de passe avec un token expiré: ${resetPasswordDto.token} pour l'utilisateur ${user.email}`);
      // Optionnel: invalider le token dans la BDD si expiré
      user.token_reinitialisation_mdp = null;
      user.date_expiration_token_reinit = null;
      await this.databaseService.updateUser(user);
      throw new Error(MESSAGES_ERREUR.COMPTE.TOKEN_REINITIALISATION_EXPIRE);
    }

    // 3. Valider le nouveau mot de passe APRES la validation du token
    if (!this.isPasswordComplex(resetPasswordDto.nouveau_mot_de_passe)) {
      this.logger.warn(`Tentative de réinitialisation de mot de passe pour ${user.email} avec un nouveau mot de passe ne respectant pas les critères de complexité.`);
      throw new Error(MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE);
    }

    // 4. Hasher le nouveau mot de passe
    const hashedPassword = await CryptoUtils.generateSecureHash(
      resetPasswordDto.nouveau_mot_de_passe,
    );

    // 5. Mettre à jour le mot de passe de l'utilisateur
    user.mot_de_passe_hash = hashedPassword;
    user.token_reinitialisation_mdp = null; // Invalider le token
    user.date_expiration_token_reinit = null; // Invalider la date d'expiration
    
    await this.databaseService.updateUser(user);
    this.logger.info(`Mot de passe réinitialisé avec succès pour l'utilisateur: ${user.email}`);

    // 6. Envoyer un email de confirmation de changement de mot de passe
    await this.emailService.sendPasswordChangedConfirmationEmail(
      user.email,
      user.nom_complet,
    );
  }
}