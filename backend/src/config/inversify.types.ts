
const TYPES = {
  // Models
  UserModel: Symbol.for('UserModel'),
  RoleModel: Symbol.for('RoleModel'),
  PermissionModel: Symbol.for('PermissionModel'),
  OnboardingApplicationModel: Symbol.for('OnboardingApplicationModel'),
  ProductionModel: Symbol.for('ProductionModel'),
  CharacterModel: Symbol.for('CharacterModel'),
  LocationModel: Symbol.for('LocationModel'),
  FundRequestModel: Symbol.for('FundRequestModel'),
  CostumeModel: Symbol.for('CostumeModel'),
  CostumeAssignmentModel: Symbol.for('CostumeAssignmentModel'),
  AuditLogModel: Symbol.for('AuditLogModel'),
  NotificationModel: Symbol.for('NotificationModel'),

  // Repositories
  IUserRepository: Symbol.for('IUserRepository'),
  IRoleRepository: Symbol.for('IRoleRepository'),
  IPermissionRepository: Symbol.for('IPermissionRepository'),
  IOnboardingApplicationRepository: Symbol.for('IOnboardingApplicationRepository'),
  IProductionRepository: Symbol.for('IProductionRepository'),
  ICharacterRepository: Symbol.for('ICharacterRepository'),
  ILocationRepository: Symbol.for('ILocationRepository'),
  IFundRequestRepository: Symbol.for('IFundRequestRepository'),
  ICostumeRepository: Symbol.for('ICostumeRepository'),
  ICostumeAssignmentRepository: Symbol.for('ICostumeAssignmentRepository'),
  IAuditLogRepository: Symbol.for('IAuditLogRepository'),
  INotificationRepository: Symbol.for('INotificationRepository'),

  // Services
  IAuthService: Symbol.for('IAuthService'),
  IUserService: Symbol.for('IUserService'),
  IRoleService: Symbol.for('IRoleService'),
  IOnboardingService: Symbol.for('IOnboardingService'),
  IProductionService: Symbol.for('IProductionService'),
  ILocationService: Symbol.for('ILocationService'),
  IFundRequestService: Symbol.for('IFundRequestService'),
  ICostumeService: Symbol.for('ICostumeService'),
  IAuditLogService: Symbol.for('IAuditLogService'),
  INotificationService: Symbol.for('INotificationService'),
  IDashboardService: Symbol.for('IDashboardService'),

  // Controllers
  IAuthController: Symbol.for('IAuthController'),
  IOnboardingController: Symbol.for('IOnboardingController'),
  IProductionController: Symbol.for('IProductionController'),
  ILocationController: Symbol.for('ILocationController'),
  IFundRequestController: Symbol.for('IFundRequestController'),
  ICostumeController: Symbol.for('ICostumeController'),
  IUserController: Symbol.for('IUserController'),
  IRoleController: Symbol.for('IRoleController'),
  IAuditLogController: Symbol.for('IAuditLogController'),
  INotificationController: Symbol.for('INotificationController'),
  IDashboardController: Symbol.for('IDashboardController'),
};

export default TYPES;
