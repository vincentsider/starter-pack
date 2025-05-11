import { UserService } from './user.service';
import { IDatabaseService } from './interfaces/database.service.interface';
import { IAuthService } from './interfaces/auth.service.interface';
import { IEmailService } from './interfaces/email.service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; // Ajout de l'import
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DUREE_VALIDITE_TOKEN_REINIT_MDP_MS, MIN_PASSWORD_LENGTH, MESSAGES_ERREUR } from '../../common/config/constants';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { User, UserAccountStatus } from './user.entity';
import { CryptoUtils } from '../../common/utils/crypto.utils';
import pino from 'pino'; // Importer pino pour le mocker

// Mock pour pino
jest.mock('pino');

// Mocks pour les services
const mockDatabaseService: jest.Mocked<IDatabaseService> = {
  emailExists: jest.fn(), // Ajouté
  phoneNumberExists: jest.fn(), // Ajouté
  findUserByEmail: jest.fn(),
  saveUser: jest.fn(),
  updateUser: jest.fn(),
  // findUserById: jest.fn(), // Retiré car non défini dans l'interface
  findUserByValidationToken: jest.fn(),
  findUserByPasswordResetToken: jest.fn(),
  deleteValidationToken: jest.fn(),
};

const mockAuthService: jest.Mocked<IAuthService> = {
  generateSessionToken: jest.fn(),
  invalidateSessionToken: jest.fn(),
  // Ces méthodes ne sont pas dans IAuthService basée sur la définition précédente,
  // mais elles étaient dans le mock original. Je les laisse commentées pour l'instant,
  // à vérifier si elles sont nécessaires pour d'autres tests ou si IAuthService doit être mise à jour.
  // hashPassword: jest.fn(),
  // comparePassword: jest.fn(),
  // generateToken: jest.fn(),
  // verifyToken: jest.fn(),
};

const mockEmailService: jest.Mocked<IEmailService> = {
  sendValidationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(), // Ajouté pour validateEmail
  sendPasswordChangedConfirmationEmail: jest.fn(), // Ajouté pour resetPassword
};

// Mock pour CryptoUtils
jest.mock('../../common/utils/crypto.utils'); // Mock le module entier

const mockedCryptoUtils = CryptoUtils as jest.Mocked<typeof CryptoUtils>;

// Déclaration des variables pour le service et le logger mocké au niveau du module
let userService: UserService;
let mockLogger: MockPinoLogger; // Utiliser notre type simplifié

// Définir un type plus simple pour notre logger mocké, contenant uniquement ce dont nous avons besoin
interface MockPinoLogger {
 fatal: jest.Mock;
 error: jest.Mock;
 warn: jest.Mock;
 info: jest.Mock;
 debug: jest.Mock;
 trace: jest.Mock;
 silent: jest.Mock;
 child: jest.Mock;
 level: string;
}

// Fonction utilitaire pour créer un logger mocké
const createMockPinoLogger = (): MockPinoLogger => ({
 fatal: jest.fn(),
 error: jest.fn(),
 warn: jest.fn(),
 info: jest.fn(),
 debug: jest.fn(),
 trace: jest.fn(),
 silent: jest.fn(),
 child: jest.fn().mockImplementation(() => createMockPinoLogger()),
 level: 'info',
});

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = createMockPinoLogger();
   (pino as unknown as jest.Mock).mockReturnValue(mockLogger); // Caster pino en jest.Mock
    // Ordre correct des services injectés
    userService = new UserService(mockDatabaseService, mockEmailService, mockAuthService);
  });

  describe('createUser', () => {
    it('devrait créer un utilisateur avec succès, hasher le mot de passe, générer un token de validation et envoyer un email', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        mot_de_passe: 'ValidPassword123!',
        nom: 'Test User',
      };
      const hashedPassword = 'hashedPassword';
      const validationToken = 'randomValidationToken';
      const userId = 'generatedUserId';

      mockDatabaseService.findUserByEmail.mockResolvedValue(null);
      // UserService utilise CryptoUtils.generateSecureHash directement
      mockedCryptoUtils.generateSecureHash.mockResolvedValue(hashedPassword);
      mockedCryptoUtils.generateUniqueToken
        .mockReturnValueOnce(userId) // Pour l'id utilisateur
        .mockReturnValueOnce(validationToken); // Pour le token de validation


      // Attente de ce qui sera sauvegardé. Note: l'entité User utilise nom_complet.
      // Le service devra probablement mapper createUserDto.nom vers user.nom_complet.
      const expectedUserToSave = {
        email: createUserDto.email,
        mot_de_passe_hash: hashedPassword,
        nom_complet: createUserDto.nom, // Assumant un mappage direct pour l'instant
        token_validation_email: validationToken, // Stocké tel quel, non hashé pour l'instant
        statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
        // d'autres champs initialisés par le service ou la base de données
      };

      // Mock pour simuler la sauvegarde et le retour de l'utilisateur créé
      // Le service doit retourner un objet qui n'expose pas mot_de_passe_hash.
      mockDatabaseService.saveUser.mockImplementation(async (user) => ({
        ...user,
        id_utilisateur: 'userId123', // Simuler un ID généré
        date_inscription: new Date(),
        // Le statut_compte devrait être PENDING_EMAIL_VALIDATION à la création
        statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
        // Simuler d'autres champs non définis par le DTO mais présents dans l'entité User
        // token_reinitialisation_mdp: null, // etc.
      } as User)); // Assurer que le type retourné correspond à l'entité User

      const result = await userService.createUser(createUserDto);

      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(createUserDto.email);
      // Vérifier l'appel à CryptoUtils.generateSecureHash
      expect(mockedCryptoUtils.generateSecureHash).toHaveBeenCalledWith(createUserDto.mot_de_passe);
      // CryptoUtils.generateUniqueToken est appelé deux fois : une pour l'ID utilisateur, une pour le token de validation.
      expect(mockedCryptoUtils.generateUniqueToken).toHaveBeenCalledTimes(2);


      expect(mockDatabaseService.saveUser).toHaveBeenCalledWith(
        expect.objectContaining(expectedUserToSave),
      );
      // L'appel à sendValidationEmail dans le service utilise nom_complet
      expect(mockEmailService.sendValidationEmail).toHaveBeenCalledWith(
        createUserDto.email,
        createUserDto.nom, // UserService utilise nom_complet, qui est mappé depuis createUserDto.nom
        validationToken,
      );
      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.id_utilisateur).toBe(userId); // Doit correspondre au mock de generateUniqueToken
      expect((result as any).mot_de_passe_hash).toBeUndefined();
      expect(result.nom_complet).toBe(createUserDto.nom);
      expect(result.statut_compte).toBe(UserAccountStatus.PENDING_EMAIL_VALIDATION);
    });

    // Test pour le cas où l'email existe déjà
    it("devrait lever une erreur générique et logger l'information si l'email existe déjà", async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        // Utiliser un mot de passe qui respecte les nouvelles règles de complexité supposées
        // (longueur, majuscule, minuscule, chiffre, caractère spécial)
        // pour s'assurer que le test échoue pour la bonne raison (email existant)
        mot_de_passe: 'ValidPassword123!',
        nom: 'Existing User',
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue({ id_utilisateur: 'existingId' } as User); // Simuler un utilisateur existant

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.CREATION_GENERIQUE,
      );

      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockLogger.info).toHaveBeenCalledWith(
        `Tentative de création de compte avec un email existant: ${createUserDto.email}`
      );
      // Si l'email existe, la complexité du mot de passe n'est pas vérifiée et generateSecureHash non plus.
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    // Test pour format d'email invalide utilisant validator.isEmail
    it("devrait lever une erreur spécifique si le format de l'email est invalide (selon validator.isEmail)", async () => {
      const createUserDto: CreateUserDto = {
        email: 'invalid-email-format', // Ceci devrait être considéré comme invalide par validator.isEmail
        mot_de_passe: 'ValidPass123!', // Mot de passe valide pour isoler le test de l'email
        nom: 'Invalid Email User Test',
      };
      // Pas besoin de mocker findUserByEmail car la validation de l'email échoue avant

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.EMAIL_INVALIDE, // Doit être l'erreur spécifique pour un format d'email invalide
      );
      // Vérifier que le logger a été appelé avec le bon message d'avertissement
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de création de compte avec un email au format invalide: ${createUserDto.email}`
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.info).not.toHaveBeenCalled(); // info est utilisé pour email existant, pas format invalide
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled(); // Ne doit pas être appelé si l'email est invalide
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    // Test pour mot de passe trop court
    it('devrait lever une erreur spécifique si le mot de passe est trop court', async () => {
      const createUserDto: CreateUserDto = {
        email: 'shortpass-test@example.com', // Email valide et unique pour ce test
        mot_de_passe: 'Short1!', // 7 caractères, mais avec majuscule, minuscule, chiffre, symbole. Devrait échouer MIN_PASSWORD_LENGTH.
        nom: 'Short Password User',
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue(null); // Email n'existe pas

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE,
      );
      // Le service logue un avertissement spécifique
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de création de compte pour ${createUserDto.email} avec un mot de passe ne respectant pas les critères de complexité.`
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      // Selon user.service.ts (lignes 59-66), la validation de l'email et la complexité du mot de passe
      // sont faites AVANT la vérification de l'existence de l'email.
      // Donc, si la complexité du mot de passe échoue, findUserByEmail ne devrait PAS être appelé.
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    it('devrait lever une erreur de complexité si le mot de passe ne contient pas de minuscule', async () => {
      const createUserDto: CreateUserDto = {
        email: 'nolowercase@example.com',
        mot_de_passe: 'NOPASSWORD1!', // Pas de minuscule, mais assez long et autres critères OK
        nom: 'No Lowercase User',
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue(null);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE,
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de création de compte pour ${createUserDto.email} avec un mot de passe ne respectant pas les critères de complexité.`
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      // Idem, findUserByEmail ne devrait pas être appelé si la complexité échoue.
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    it('devrait lever une erreur de complexité si le mot de passe ne contient pas de majuscule', async () => {
      const createUserDto: CreateUserDto = {
        email: 'nouppercase@example.com',
        mot_de_passe: 'nopassword1!', // Pas de majuscule, mais autres critères OK
        nom: 'No Uppercase User',
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue(null);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE,
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de création de compte pour ${createUserDto.email} avec un mot de passe ne respectant pas les critères de complexité.`
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      // Idem
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    it('devrait lever une erreur de complexité si le mot de passe ne contient pas de chiffre', async () => {
      const createUserDto: CreateUserDto = {
        email: 'nonumber@example.com',
        mot_de_passe: 'NoPassword!', // Pas de chiffre, mais autres critères OK
        nom: 'No Number User',
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue(null);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE,
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de création de compte pour ${createUserDto.email} avec un mot de passe ne respectant pas les critères de complexité.`
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      // Idem
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    it('devrait lever une erreur de complexité si le mot de passe ne contient pas de symbole', async () => {
      const createUserDto: CreateUserDto = {
        email: 'nosymbol@example.com',
        mot_de_passe: 'NoPassword1', // Pas de symbole, mais autres critères OK
        nom: 'No Symbol User',
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue(null);

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE,
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de création de compte pour ${createUserDto.email} avec un mot de passe ne respectant pas les critères de complexité.`
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
      expect(mockLogger.debug).not.toHaveBeenCalled();
      // Idem
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      expect(mockDatabaseService.saveUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendValidationEmail).not.toHaveBeenCalled();
    });

    // Nouveaux tests pour les autres règles de complexité de mot de passe à ajouter ici

  });

  describe('loginUser', () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@example.com',
      mot_de_passe: 'password123',
    };

    it('devrait connecter un utilisateur avec succès et retourner un token JWT', async () => {
      const mockUser: User = {
        id_utilisateur: 'userId123',
        nom_complet: 'Test User',
        email: loginUserDto.email,
        mot_de_passe_hash: 'hashedPassword',
        date_inscription: new Date(),
        statut_compte: UserAccountStatus.ACTIVE,
        date_derniere_connexion: null,
        token_validation_email: null,
        date_expiration_token_validation: null,
        token_reinitialisation_mdp: null,
        date_expiration_token_reinit: null,
        // autres champs...
      } as User;
      const jwtToken = 'mockedJwtToken';

      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUser);
      // UserService utilise CryptoUtils.verifyPassword directement
      mockedCryptoUtils.verifyPassword.mockResolvedValue(true);
      mockAuthService.generateSessionToken.mockResolvedValue(jwtToken);
      mockDatabaseService.updateUser.mockResolvedValue(mockUser); // Simuler la mise à jour

      const result = await userService.loginUser(loginUserDto);

      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(loginUserDto.email);
      expect(mockedCryptoUtils.verifyPassword).toHaveBeenCalledWith(loginUserDto.mot_de_passe, mockUser.mot_de_passe_hash);
      expect(mockAuthService.generateSessionToken).toHaveBeenCalledWith(mockUser.id_utilisateur, []); // Assumant pas de rôles pour l'instant
      expect(mockDatabaseService.updateUser).toHaveBeenCalledWith(expect.objectContaining({
        id_utilisateur: mockUser.id_utilisateur,
        date_derniere_connexion: expect.any(Date),
      }));
      expect(result).toEqual({ token: jwtToken });
    });

    it("devrait lever une erreur si l'email n'est pas trouvé", async () => {
      mockDatabaseService.findUserByEmail.mockResolvedValue(null);

      await expect(userService.loginUser(loginUserDto)).rejects.toThrow(
        'Email ou mot de passe incorrect.',
      );
      expect(mockedCryptoUtils.verifyPassword).not.toHaveBeenCalled();
      expect(mockAuthService.generateSessionToken).not.toHaveBeenCalled();
    });

    it("devrait lever une erreur si le mot de passe est incorrect", async () => {
      const mockUser: User = {
        id_utilisateur: 'userId123',
        email: loginUserDto.email,
        mot_de_passe_hash: 'hashedPassword',
        statut_compte: UserAccountStatus.ACTIVE,
      } as User;

      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUser);
      mockedCryptoUtils.verifyPassword.mockResolvedValue(false);

      await expect(userService.loginUser(loginUserDto)).rejects.toThrow(
        'Email ou mot de passe incorrect.',
      );
      expect(mockAuthService.generateSessionToken).not.toHaveBeenCalled();
    });

    it("devrait lever une erreur si le compte est en attente de validation", async () => {
      const mockUser: User = {
        id_utilisateur: 'userId123',
        email: loginUserDto.email,
        mot_de_passe_hash: 'hashedPassword',
        statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
      } as User;

      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(userService.loginUser(loginUserDto)).rejects.toThrow(
        'Votre compte est en attente de validation. Veuillez vérifier vos emails.',
      );
      expect(mockedCryptoUtils.verifyPassword).not.toHaveBeenCalled();
    });

    it("devrait lever une erreur si le compte est inactif (hors PENDING_EMAIL_VALIDATION)", async () => {
      const mockUser: User = {
        id_utilisateur: 'userId123',
        email: loginUserDto.email,
        mot_de_passe_hash: 'hashedPassword',
        statut_compte: UserAccountStatus.SUSPENDED, // ou DEACTIVATED
      } as User;

      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUser);

      await expect(userService.loginUser(loginUserDto)).rejects.toThrow(
        'Votre compte est actuellement inactif ou suspendu.',
      );
      expect(mockedCryptoUtils.verifyPassword).not.toHaveBeenCalled();
    });


    it("devrait lever une erreur et logger l'information si le format de l'email est invalide (selon validator.isEmail)", async () => {
      const invalidEmailDto: LoginUserDto = {
        email: 'invalid-login-format', // Invalide selon validator.isEmail
        mot_de_passe: 'password123',
      };
      await expect(userService.loginUser(invalidEmailDto)).rejects.toThrow(
        "Format d'email invalide.",
      );
      // Le mockLogger.warn est appelé dans le service avant que l'erreur ne soit levée
      // donc cette vérification doit être faite *avant* l'assertion sur l'erreur levée si on veut être précis,
      // ou on s'assure que le service logue PUIS throw.
      // Pour l'instant, on s'attend à ce que le log ait eu lieu.
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de connexion avec un email au format invalide: ${invalidEmailDto.email}`,
      );
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockAuthService.generateSessionToken).not.toHaveBeenCalled();
    });
  });


  describe('validateEmail', () => {
    const validateEmailDto: ValidateEmailDto = {
      token: 'valid-validation-token',
    };
    const mockUser: User = { // Défini ici pour être réutilisable dans les tests de ce bloc
      id_utilisateur: 'mockUserId',
      nom_complet: 'Mock User Validate',
      email: 'validate@example.com',
      mot_de_passe_hash: 'hashed',
      date_inscription: new Date(),
      statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
      date_derniere_connexion: null,
      token_validation_email: 'valid-validation-token',
      date_expiration_token_validation: new Date(Date.now() + 3600000),
      token_reinitialisation_mdp: null,
      date_expiration_token_reinit: null,
    };


    it('devrait valider un email avec succès, activer le compte et envoyer un email de bienvenue', async () => {
      const userPendingValidation: User = {
        ...mockUser, // Utilise le mockUser de base
        id_utilisateur: 'userToValidateSuccess', // ID spécifique pour ce test
        statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
        token_validation_email: 'valid-validation-token',
        date_expiration_token_validation: new Date(Date.now() + 3600000), // Expire dans 1h
      };

      mockDatabaseService.findUserByValidationToken.mockResolvedValue(userPendingValidation);
      // Simuler que la mise à jour de l'utilisateur a réussi
      mockDatabaseService.updateUser.mockImplementation(async (user) => {
        // Le service modifie l'objet utilisateur original passé en argument
        // avant de le passer à updateUser. Ici on simule que updateUser retourne cet objet modifié.
        return user;
      });


      await userService.validateEmail(validateEmailDto);

      expect(mockDatabaseService.findUserByValidationToken).toHaveBeenCalledWith(validateEmailDto.token);
      // La vérification que userPendingValidation.statut_compte a été mis à jour doit se faire sur ce que updateUser a reçu
      // ou ce que l'état interne du service reflète. Ici, on vérifie l'appel à updateUser.
      expect(mockDatabaseService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id_utilisateur: userPendingValidation.id_utilisateur,
          statut_compte: UserAccountStatus.ACTIVE,
          token_validation_email: null,
          date_expiration_token_validation: null,
        }),
      );
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        userPendingValidation.email,
        userPendingValidation.nom_complet,
      );
    });

    it('devrait lever une erreur si le token de validation est invalide ou non trouvé', async () => {
      const dtoWithInvalidToken: ValidateEmailDto = { token: 'invalid-or-nonexistent-token' };
      mockDatabaseService.findUserByValidationToken.mockResolvedValue(null);

      await expect(userService.validateEmail(dtoWithInvalidToken)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.TOKEN_VALIDATION_INVALIDE,
      );
      expect(mockDatabaseService.findUserByValidationToken).toHaveBeenCalledWith(dtoWithInvalidToken.token);
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it("devrait lever une erreur si le token de validation est expiré et appeler deleteValidationToken", async () => {
      const expiredUser: User = {
        ...mockUser, // Utilise le mockUser de base
        id_utilisateur: 'userWithExpiredToken', // ID spécifique
        statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
        token_validation_email: 'expired-token',
        date_expiration_token_validation: new Date(Date.now() - 3600000), // Expiré depuis 1h
      };
      const dtoWithExpiredToken: ValidateEmailDto = { token: 'expired-token' };

      mockDatabaseService.findUserByValidationToken.mockResolvedValue(expiredUser);
      // deleteValidationToken est appelé dans le service si le token est expiré
      mockDatabaseService.deleteValidationToken.mockResolvedValue(undefined); // Simule la suppression réussie

      await expect(userService.validateEmail(dtoWithExpiredToken)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.TOKEN_VALIDATION_EXPIRE,
      );
      expect(mockDatabaseService.findUserByValidationToken).toHaveBeenCalledWith(dtoWithExpiredToken.token);
      // Vérifier que deleteValidationToken a été appelé avec l'utilisateur concerné
      expect(mockDatabaseService.deleteValidationToken).toHaveBeenCalledWith(expiredUser);
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });


    it('devrait lever une erreur si le compte est déjà actif', async () => {
      const activeUser: User = {
        ...mockUser, // Utilise le mockUser de base
        id_utilisateur: 'userAlreadyActive', // ID spécifique
        statut_compte: UserAccountStatus.ACTIVE,
        token_validation_email: 'some-token-for-active-user', // Le token importe peu ici
        date_expiration_token_validation: new Date(Date.now() + 3600000),
      };
      const dtoForActiveUser: ValidateEmailDto = { token: 'some-token-for-active-user' };

      mockDatabaseService.findUserByValidationToken.mockResolvedValue(activeUser);

      await expect(userService.validateEmail(dtoForActiveUser)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.COMPTE_DEJA_ACTIF,
      );
      expect(mockDatabaseService.findUserByValidationToken).toHaveBeenCalledWith(dtoForActiveUser.token);
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });
  });

  describe('requestPasswordReset', () => {
    const requestPasswordResetDto: RequestPasswordResetDto = {
      email: 'user@example.com',
    };
    const mockUserActive: User = {
      id_utilisateur: 'userIdActive',
      nom_complet: 'Active User',
      email: 'user@example.com',
      mot_de_passe_hash: 'hashedPassword',
      date_inscription: new Date(),
      statut_compte: UserAccountStatus.ACTIVE,
      date_derniere_connexion: new Date(),
      token_validation_email: null,
      date_expiration_token_validation: null,
      token_reinitialisation_mdp: null,
      date_expiration_token_reinit: null,
    };
    const mockUserPending: User = {
      ...mockUserActive,
      id_utilisateur: 'userIdPending',
      statut_compte: UserAccountStatus.PENDING_EMAIL_VALIDATION,
    };

    beforeEach(() => {
      // CryptoUtils.generateUniqueToken sera appelé pour générer le token de réinitialisation
      mockedCryptoUtils.generateUniqueToken.mockReturnValue('newResetToken123');
    });

    it('devrait traiter une demande de réinitialisation avec succès pour un utilisateur ACTIF', async () => {
      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUserActive);
      mockDatabaseService.updateUser.mockImplementation(async (user) => user); // Simule la mise à jour

      await userService.requestPasswordReset(requestPasswordResetDto);

      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(requestPasswordResetDto.email);
      expect(mockedCryptoUtils.generateUniqueToken).toHaveBeenCalledTimes(1); // Une seule fois pour le token de reset
      expect(mockDatabaseService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id_utilisateur: mockUserActive.id_utilisateur,
          token_reinitialisation_mdp: 'newResetToken123',
          date_expiration_token_reinit: expect.any(Date),
        }),
      );
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUserActive.email,
        mockUserActive.nom_complet,
        'newResetToken123',
      );
    });

    it('devrait traiter une demande de réinitialisation avec succès pour un utilisateur PENDING_EMAIL_VALIDATION', async () => {
      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUserPending);
      mockDatabaseService.updateUser.mockImplementation(async (user) => user);

      await userService.requestPasswordReset(requestPasswordResetDto);

      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(requestPasswordResetDto.email);
      expect(mockedCryptoUtils.generateUniqueToken).toHaveBeenCalledTimes(1);
      expect(mockDatabaseService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id_utilisateur: mockUserPending.id_utilisateur,
          token_reinitialisation_mdp: 'newResetToken123',
        }),
      );
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUserPending.email,
        mockUserPending.nom_complet,
        'newResetToken123',
      );
    });

    it("devrait se terminer silencieusement si l'email n'est pas trouvé", async () => {
      mockDatabaseService.findUserByEmail.mockResolvedValue(null);
      // Le service utilise maintenant le logger pino injecté
      await userService.requestPasswordReset(requestPasswordResetDto);
 
      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(requestPasswordResetDto.email);
      // Dans user.service.ts (ligne ~255), le log pour un email non trouvé lors de requestPasswordReset est .info et le message est différent.
      expect(mockLogger.info).toHaveBeenCalledWith( // Changé .warn en .info
        `Tentative de réinitialisation de mot de passe pour un email non trouvé: ${requestPasswordResetDto.email}`,
      );
      expect(mockLogger.warn).not.toHaveBeenCalled(); // Ajout de cette vérification
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('devrait se terminer silencieusement si le compte utilisateur est SUSPENDED', async () => {
      const mockUserSuspended: User = {
        ...mockUserActive,
        id_utilisateur: 'userIdSuspended',
        statut_compte: UserAccountStatus.SUSPENDED,
      };
      mockDatabaseService.findUserByEmail.mockResolvedValue(mockUserSuspended);
      // Le service utilise maintenant le logger pino injecté
      await userService.requestPasswordReset(requestPasswordResetDto);
 
      expect(mockDatabaseService.findUserByEmail).toHaveBeenCalledWith(requestPasswordResetDto.email);
      expect(mockLogger.warn).toHaveBeenCalledWith( // Changé de console.warn à mockLogger.warn
         `Tentative de réinitialisation de mot de passe pour un compte inactif/suspendu: ${mockUserSuspended.email}`,
      );
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it("devrait lever une erreur et logger l'information si le format de l'email est invalide (selon validator.isEmail)", async () => {
      const invalidEmailDto: RequestPasswordResetDto = { email: 'invalid-reset-format' }; // Email invalide

      await expect(userService.requestPasswordReset(invalidEmailDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.EMAIL_INVALIDE,
      );
      // Dans user.service.ts (ligne ~246), le log pour un email invalide lors de requestPasswordReset est .warn et le message est légèrement différent.
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de réinitialisation de mot de passe avec email invalide: ${invalidEmailDto.email}` // Correction du message
      );
      expect(mockDatabaseService.findUserByEmail).not.toHaveBeenCalled();
      expect(mockedCryptoUtils.generateUniqueToken).not.toHaveBeenCalled(); // Ajouté car c'est avant updateUser
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'validResetToken123',
      nouveau_mot_de_passe: 'newValidPassword123!',
    };
    const mockUserWithResetToken: User = {
      id_utilisateur: 'userIdWithToken',
      nom_complet: 'User With Token',
      email: 'user@example.com',
      mot_de_passe_hash: 'oldHashedPassword',
      date_inscription: new Date(),
      statut_compte: UserAccountStatus.ACTIVE,
      date_derniere_connexion: new Date(),
      token_validation_email: null,
      date_expiration_token_validation: null,
      token_reinitialisation_mdp: 'validResetToken123',
      date_expiration_token_reinit: new Date(Date.now() + DUREE_VALIDITE_TOKEN_REINIT_MDP_MS), // Non expiré
    };

    beforeEach(() => {
      // CryptoUtils.generateSecureHash sera appelé pour le nouveau mot de passe
      mockedCryptoUtils.generateSecureHash.mockResolvedValue('newlyHashedPassword');
    });

    it('devrait réinitialiser le mot de passe avec succès', async () => {
      mockDatabaseService.findUserByPasswordResetToken.mockResolvedValue(mockUserWithResetToken);
      mockDatabaseService.updateUser.mockImplementation(async (user) => user);

      await userService.resetPassword(resetPasswordDto);

      expect(mockDatabaseService.findUserByPasswordResetToken).toHaveBeenCalledWith(resetPasswordDto.token);
      expect(mockedCryptoUtils.generateSecureHash).toHaveBeenCalledWith(resetPasswordDto.nouveau_mot_de_passe);
      expect(mockDatabaseService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id_utilisateur: mockUserWithResetToken.id_utilisateur,
          mot_de_passe_hash: 'newlyHashedPassword',
          token_reinitialisation_mdp: null,
          date_expiration_token_reinit: null,
        }),
      );
      expect(mockEmailService.sendPasswordChangedConfirmationEmail).toHaveBeenCalledWith(
        mockUserWithResetToken.email,
        mockUserWithResetToken.nom_complet,
      );
    });

    it('devrait lever une erreur si le token de réinitialisation est invalide ou non trouvé', async () => {
      const resetPasswordDto: ResetPasswordDto = { token: 'invalidOrNotFoundToken', nouveau_mot_de_passe: 'ValidPassword123!' };
      mockDatabaseService.findUserByPasswordResetToken.mockResolvedValue(null);

      await expect(userService.resetPassword(resetPasswordDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.TOKEN_REINITIALISATION_INVALIDE,
      );
      // Le log est .warn avec "Tentative de réinitialisation de mot de passe avec un token invalide ou non trouvé: ..."
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de réinitialisation de mot de passe avec un token invalide ou non trouvé: ${resetPasswordDto.token}`
      );
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordChangedConfirmationEmail).not.toHaveBeenCalled();
    });

    it('devrait lever une erreur si le token de réinitialisation est expiré et invalider le token', async () => {
      const resetPasswordDto: ResetPasswordDto = { token: 'expiredToken', nouveau_mot_de_passe: 'ValidPassword123!' };
      const mockUserWithExpiredToken: User = {
        // ... (définir un mockUser avec un token expiré)
        id_utilisateur: 'userExpiredTokenId',
        email: 'expired@example.com',
        nom_complet: 'Expired Token User',
        mot_de_passe_hash: 'somehash',
        date_inscription: new Date(),
        statut_compte: UserAccountStatus.ACTIVE,
        token_reinitialisation_mdp: resetPasswordDto.token,
        date_expiration_token_reinit: new Date(Date.now() - DUREE_VALIDITE_TOKEN_REINIT_MDP_MS), // Expiré
        // ... autres champs nécessaires
      } as User;
      mockDatabaseService.findUserByPasswordResetToken.mockResolvedValue(mockUserWithExpiredToken);
      mockDatabaseService.updateUser.mockImplementation(async (user) => user);

      await expect(userService.resetPassword(resetPasswordDto)).rejects.toThrow(
        MESSAGES_ERREUR.COMPTE.TOKEN_REINITIALISATION_EXPIRE,
      );
      // Le log est .warn avec "Tentative de réinitialisation de mot de passe avec un token expiré: ... pour l'utilisateur ..."
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de réinitialisation de mot de passe avec un token expiré: ${resetPasswordDto.token} pour l'utilisateur ${mockUserWithExpiredToken.email}`
      );
      expect(mockDatabaseService.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id_utilisateur: mockUserWithExpiredToken.id_utilisateur,
          token_reinitialisation_mdp: null,
          date_expiration_token_reinit: null,
        }),
      );
      expect(mockEmailService.sendPasswordChangedConfirmationEmail).not.toHaveBeenCalled();
    });

    it('devrait lever une erreur de complexité si le nouveau mot de passe est trop court (après validation du token)', async () => {
      const dtoWithShortPassword: ResetPasswordDto = {
        token: 'validTokenButShortNewPass',
        nouveau_mot_de_passe: 'short', // Clairement trop court
      };
      const mockUserForShortPassReset: User = {
        id_utilisateur: 'userShortPassResetId',
        email: 'shortpass.reset@example.com',
        nom_complet: 'User ShortPass Reset',
        mot_de_passe_hash: 'oldhash',
        date_inscription: new Date(),
        statut_compte: UserAccountStatus.ACTIVE,
        token_reinitialisation_mdp: dtoWithShortPassword.token,
        date_expiration_token_reinit: new Date(Date.now() + DUREE_VALIDITE_TOKEN_REINIT_MDP_MS), // Token valide
         // ... autres champs
      } as User;

      mockDatabaseService.findUserByPasswordResetToken.mockResolvedValue(mockUserForShortPassReset);
      
      // Construction du message d'erreur dynamique
      const expectedErrorMessage = MESSAGES_ERREUR.COMPTE.MOT_DE_PASSE_COMPLEXITE
        .replace('${MIN_PASSWORD_LENGTH}', MIN_PASSWORD_LENGTH.toString());

      await expect(userService.resetPassword(dtoWithShortPassword)).rejects.toThrow(
        expectedErrorMessage
      );

      // findUserByPasswordResetToken EST appelé car le token est vérifié AVANT la complexité du nouveau mot de passe.
      expect(mockDatabaseService.findUserByPasswordResetToken).toHaveBeenCalledWith(dtoWithShortPassword.token);
      // Le log est .warn et inclut l'email de l'utilisateur: "Tentative de réinitialisation de mot de passe pour ... avec un nouveau mot de passe ne respectant pas les critères de complexité."
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Tentative de réinitialisation de mot de passe pour ${mockUserForShortPassReset.email} avec un nouveau mot de passe ne respectant pas les critères de complexité.`
      );
      expect(mockedCryptoUtils.generateSecureHash).not.toHaveBeenCalled();
      // updateUser ne doit pas être appelé si la complexité échoue, même si le token était valide.
      // Exception: si le token était expiré, updateUser aurait été appelé pour l'invalider. Mais ici, il est valide.
      expect(mockDatabaseService.updateUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordChangedConfirmationEmail).not.toHaveBeenCalled();
    });
  }); // Fin du describe 'resetPassword'
}); // Fin du describe 'UserService'