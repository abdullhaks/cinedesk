import 'reflect-metadata';
import {Container } from 'inversify';
import TYPES from './inversify.types';

// Models
import User from '../models/User.model';
import Role from '../models/Role.model';
import Permission from '../models/Permission.model';
import OnboardingApplication from '../models/OnboardingApplication.model';
import Production from '../models/Production.model';
import Character from '../models/Character.model';
import Location from '../models/Location.model';
import FundRequest from '../models/FundRequest.model';
import Costume from '../models/Costume.model';
import CostumeAssignment from '../models/CostumeAssignment.model';
import AuditLog from '../models/AuditLog.model';
import Notification from '../models/Notification.model';

// Repository interfaces
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IRoleRepository } from '../repositories/interfaces/IRoleRepository';
import { IPermissionRepository } from '../repositories/interfaces/IPermissionRepository';
import { IOnboardingApplicationRepository } from '../repositories/interfaces/IOnboardingApplicationRepository';
import { IProductionRepository } from '../repositories/interfaces/IProductionRepository';
import { ICharacterRepository } from '../repositories/interfaces/ICharacterRepository';
import { ILocationRepository } from '../repositories/interfaces/ILocationRepository';
import { IFundRequestRepository } from '../repositories/interfaces/IFundRequestRepository';
import { ICostumeRepository } from '../repositories/interfaces/ICostumeRepository';
import { ICostumeAssignmentRepository } from '../repositories/interfaces/ICostumeAssignmentRepository';
import { IAuditLogRepository } from '../repositories/interfaces/IAuditLogRepository';
import { INotificationRepository } from '../repositories/interfaces/INotificationRepository';

// Repository implementations
import UserRepository from '../repositories/implementations/user.repository';
import RoleRepository from '../repositories/implementations/role.repository';
import PermissionRepository from '../repositories/implementations/permission.repository';
import OnboardingApplicationRepository from '../repositories/implementations/onboardingApplication.repository';
import ProductionRepository from '../repositories/implementations/production.repository';
import CharacterRepository from '../repositories/implementations/character.repository';
import LocationRepository from '../repositories/implementations/location.repository';
import FundRequestRepository from '../repositories/implementations/fundRequest.repository';
import CostumeRepository from '../repositories/implementations/costume.repository';
import CostumeAssignmentRepository from '../repositories/implementations/costumeAssignment.repository';
import AuditLogRepository from '../repositories/implementations/auditLog.repository';
import NotificationRepository from '../repositories/implementations/notification.repository';

// Service interfaces
import { IAuthService } from '../services/interfaces/IAuth.service';
import { IRoleService } from '../services/interfaces/IRole.service';
import { IOnboardingService } from '../services/interfaces/IOnboarding.service';
import { IUserService } from '../services/interfaces/IUser.service';
import { IProductionService } from '../services/interfaces/IProduction.service';
import { ILocationService } from '../services/interfaces/ILocation.service';
import { IFundRequestService } from '../services/interfaces/IFundRequest.service';
import { ICostumeService } from '../services/interfaces/ICostume.service';
import { IAuditLogService } from '../services/interfaces/IAuditLog.service';
import { INotificationService } from '../services/interfaces/INotification.service';
import { IDashboardService } from '../services/interfaces/IDashboard.service';

// Service implementations
import AuthService from '../services/implementations/auth.service';
import RoleService from '../services/implementations/role.service';
import OnboardingService from '../services/implementations/onboarding.service';
import UserService from '../services/implementations/user.service';
import ProductionService from '../services/implementations/production.service';
import LocationService from '../services/implementations/location.service';
import FundRequestService from '../services/implementations/fundRequest.service';
import CostumeService from '../services/implementations/costume.service';
import AuditLogService from '../services/implementations/auditLog.service';
import NotificationService from '../services/implementations/notification.service';
import DashboardService from '../services/implementations/dashboard.service';

// Controller interfaces
import { IAuthController } from '../controllers/interfaces/IAuth.controller';
import { IRoleController } from '../controllers/interfaces/IRole.controller';
import { IOnboardingController } from '../controllers/interfaces/IOnboarding.controller';
import { IUserController } from '../controllers/interfaces/IUser.controller';
import { IProductionController } from '../controllers/interfaces/IProduction.controller';
import { ILocationController } from '../controllers/interfaces/ILocation.controller';
import { IFundRequestController } from '../controllers/interfaces/IFundRequest.controller';
import { ICostumeController } from '../controllers/interfaces/ICostume.controller';
import { IAuditLogController } from '../controllers/interfaces/IAuditLog.controller';
import { INotificationController } from '../controllers/interfaces/INotification.controller';
import { IDashboardController } from '../controllers/interfaces/IDashboard.controller';

// Controller implementations
import AuthController from '../controllers/implementations/auth.controller';
import RoleController from '../controllers/implementations/role.controller';
import OnboardingController from '../controllers/implementations/onboarding.controller';
import UserController from '../controllers/implementations/user.controller';
import ProductionController from '../controllers/implementations/production.controller';
import LocationController from '../controllers/implementations/location.controller';
import FundRequestController from '../controllers/implementations/fundRequest.controller';
import CostumeController from '../controllers/implementations/costume.controller';
import AuditLogController from '../controllers/implementations/auditLog.controller';
import NotificationController from '../controllers/implementations/notification.controller';
import DashboardController from '../controllers/implementations/dashboard.controller';

// -------------------------------------------------------------------------------
const container = new Container();
// -------------------------------------------------------------------------------

// Model bindings
container.bind(TYPES.UserModel).toConstantValue(User);
container.bind(TYPES.RoleModel).toConstantValue(Role);
container.bind(TYPES.PermissionModel).toConstantValue(Permission);
container.bind(TYPES.OnboardingApplicationModel).toConstantValue(OnboardingApplication);
container.bind(TYPES.ProductionModel).toConstantValue(Production);
container.bind(TYPES.CharacterModel).toConstantValue(Character);
container.bind(TYPES.LocationModel).toConstantValue(Location);
container.bind(TYPES.FundRequestModel).toConstantValue(FundRequest);
container.bind(TYPES.CostumeModel).toConstantValue(Costume);
container.bind(TYPES.CostumeAssignmentModel).toConstantValue(CostumeAssignment);
container.bind(TYPES.AuditLogModel).toConstantValue(AuditLog);
container.bind(TYPES.NotificationModel).toConstantValue(Notification);

// Repository bindings
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IRoleRepository>(TYPES.IRoleRepository).to(RoleRepository);
container.bind<IPermissionRepository>(TYPES.IPermissionRepository).to(PermissionRepository);
container.bind<IOnboardingApplicationRepository>(TYPES.IOnboardingApplicationRepository).to(OnboardingApplicationRepository);
container.bind<IProductionRepository>(TYPES.IProductionRepository).to(ProductionRepository);
container.bind<ICharacterRepository>(TYPES.ICharacterRepository).to(CharacterRepository);
container.bind<ILocationRepository>(TYPES.ILocationRepository).to(LocationRepository);
container.bind<IFundRequestRepository>(TYPES.IFundRequestRepository).to(FundRequestRepository);
container.bind<ICostumeRepository>(TYPES.ICostumeRepository).to(CostumeRepository);
container.bind<ICostumeAssignmentRepository>(TYPES.ICostumeAssignmentRepository).to(CostumeAssignmentRepository);
container.bind<IAuditLogRepository>(TYPES.IAuditLogRepository).to(AuditLogRepository);
container.bind<INotificationRepository>(TYPES.INotificationRepository).to(NotificationRepository);

// Service bindings
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IRoleService>(TYPES.IRoleService).to(RoleService);
container.bind<IOnboardingService>(TYPES.IOnboardingService).to(OnboardingService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IProductionService>(TYPES.IProductionService).to(ProductionService);
container.bind<ILocationService>(TYPES.ILocationService).to(LocationService);
container.bind<IFundRequestService>(TYPES.IFundRequestService).to(FundRequestService);
container.bind<ICostumeService>(TYPES.ICostumeService).to(CostumeService);
container.bind<IAuditLogService>(TYPES.IAuditLogService).to(AuditLogService);
container.bind<INotificationService>(TYPES.INotificationService).to(NotificationService);
container.bind<IDashboardService>(TYPES.IDashboardService).to(DashboardService);

// Controller bindings
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IRoleController>(TYPES.IRoleController).to(RoleController);
container.bind<IOnboardingController>(TYPES.IOnboardingController).to(OnboardingController);
container.bind<IUserController>(TYPES.IUserController).to(UserController);
container.bind<IProductionController>(TYPES.IProductionController).to(ProductionController);
container.bind<ILocationController>(TYPES.ILocationController).to(LocationController);
container.bind<IFundRequestController>(TYPES.IFundRequestController).to(FundRequestController);
container.bind<ICostumeController>(TYPES.ICostumeController).to(CostumeController);
container.bind<IAuditLogController>(TYPES.IAuditLogController).to(AuditLogController);
container.bind<INotificationController>(TYPES.INotificationController).to(NotificationController);
container.bind<IDashboardController>(TYPES.IDashboardController).to(DashboardController);

export default container;
