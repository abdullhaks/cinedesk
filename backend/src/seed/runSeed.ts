import 'reflect-metadata';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

import Permission from '../models/Permission.model';
import Role from '../models/Role.model';
import User from '../models/User.model';
import Production from '../models/Production.model';
import Character from '../models/Character.model';
import Location from '../models/Location.model';
import FundRequest from '../models/FundRequest.model';
import Costume from '../models/Costume.model';
import CostumeAssignment from '../models/CostumeAssignment.model';
import OnboardingApplication from '../models/OnboardingApplication.model';
import AuditLog from '../models/AuditLog.model';
import Notification from '../models/Notification.model';

import { PERMISSION_SEEDS } from './permissions.seed';
import { ROLE_SEEDS } from './roles.seed';
import { USER_SEEDS } from './users.seed';
import { logger } from '../utils/logger';
import {
  ProductionStatus,
  LocationStatus,
  FundRequestStatus,
  CostumeStatus,
  OnboardingStatus,
  ContractorType,
  UserStatus,
} from '../utils/enum';

async function runSeed() {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error('MONGODB_URL environment variable is not defined');
    }
    await mongoose.connect(mongoUrl);
    logger.info('Connected to database for comprehensive seeding');

    // ─────────────────────────────────────────────────────────────
    // Step 1: Wipe & Recreate Permissions
    // ─────────────────────────────────────────────────────────────
    await Permission.deleteMany({});
    const permissions = await Permission.insertMany(PERMISSION_SEEDS);
    logger.info(`Seeded ${permissions.length} permissions`);

    const permKeyToId = new Map<string, mongoose.Types.ObjectId>();
    for (const perm of permissions) {
      permKeyToId.set(perm.key, perm._id);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 2: Create 8 System Roles
    // ─────────────────────────────────────────────────────────────
    await Role.deleteMany({});
    const roles: any[] = [];
    for (const roleSeed of ROLE_SEEDS) {
      let permissionIds: mongoose.Types.ObjectId[] = [];

      if (roleSeed.permissionKeys.includes('*')) {
        permissionIds = permissions.map((p) => p._id);
      } else {
        permissionIds = roleSeed.permissionKeys
          .map((key) => permKeyToId.get(key))
          .filter((id): id is mongoose.Types.ObjectId => id !== undefined);
      }

      const role = await Role.create({
        name: roleSeed.name,
        slug: roleSeed.slug,
        permissions: permissionIds,
        isSystemRole: roleSeed.isSystemRole,
      });
      roles.push(role);
    }
    logger.info(`Seeded ${roles.length} roles`);

    const roleSlugToId = new Map<string, mongoose.Types.ObjectId>();
    for (const role of roles) {
      roleSlugToId.set(role.slug, role._id);
    }

    // ─────────────────────────────────────────────────────────────
    // Step 3: Create Users (Test Accounts)
    // ─────────────────────────────────────────────────────────────
    await User.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const userMap = new Map<string, any>();

    for (const userSeed of USER_SEEDS) {
      const passwordHash = await bcrypt.hash(userSeed.password, salt);
      const roleId = userSeed.roleSlug ? roleSlugToId.get(userSeed.roleSlug) : null;

      const user = await User.create({
        fullName: userSeed.fullName,
        email: userSeed.email,
        passwordHash,
        role: roleId || null,
        status: userSeed.status,
        contractorType: (userSeed as any).contractorType || null,
      });
      userMap.set(userSeed.email, user);
    }
    logger.info(`Seeded ${USER_SEEDS.length} users`);

    const superAdmin = userMap.get('superadmin@tendagon.test');
    const prodAdmin = userMap.get('prodadmin@tendagon.test');
    const prodManager = userMap.get('pm@tendagon.test');
    const financeManager = userMap.get('finance@tendagon.test');
    const locationManager = userMap.get('location@tendagon.test');
    const costumeManager = userMap.get('costume@tendagon.test');
    const castMember = userMap.get('cast@tendagon.test');
    const crewMember = userMap.get('crew@tendagon.test');
    const applicantUser = userMap.get('applicant@tendagon.test');
    const changesUser = userMap.get('changes@tendagon.test');

    // ─────────────────────────────────────────────────────────────
    // Step 4: Seed Productions
    // ─────────────────────────────────────────────────────────────
    await Production.deleteMany({});

    const duneProd = await Production.create({
      title: 'Dune: Prophecy of Arrakis',
      description: 'Epic science-fiction drama chronicling the rise of the Sisterhood across the Imperium.',
      status: ProductionStatus.PRODUCTION,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-12-31'),
      productionManager: prodManager._id,
      budget: {
        total: 15000000,
        spent: 4200000,
        currency: 'USD',
      },
      assignedCast: [castMember._id],
      assignedCrew: [
        {
          user: crewMember._id,
          department: 'Camera',
          position: 'Director of Photography',
        },
      ],
      locations: [],
      notes: 'Main filming in Jordan desert dunes; VFX soundstage in Tokyo.',
      createdBy: superAdmin._id,
    });

    const cyberpunkProd = await Production.create({
      title: 'Cyberpunk: Neon Horizon',
      description: 'Futuristic neo-noir thriller set in the underbelly of a dystopian metropolis.',
      status: ProductionStatus.PRE_PRODUCTION,
      startDate: new Date('2026-09-15'),
      endDate: new Date('2027-03-30'),
      productionManager: prodManager._id,
      budget: {
        total: 8500000,
        spent: 1200000,
        currency: 'USD',
      },
      assignedCast: [castMember._id],
      assignedCrew: [
        {
          user: crewMember._id,
          department: 'Lighting',
          position: 'Chief Lighting Technician (Gaffer)',
        },
      ],
      locations: [],
      notes: 'Extensive stunt sequences and practical neon lighting installations.',
      createdBy: prodAdmin._id,
    });

    const shadowsProd = await Production.create({
      title: 'Shadows of the Past',
      description: 'Period drama exploring aristocratic espionage in 19th-century Vienna.',
      status: ProductionStatus.DEVELOPMENT,
      startDate: new Date('2027-01-10'),
      endDate: new Date('2027-08-20'),
      productionManager: prodAdmin._id,
      budget: {
        total: 3200000,
        spent: 250000,
        currency: 'EUR',
      },
      assignedCast: [],
      assignedCrew: [],
      locations: [],
      notes: 'Script polish in progress; location scouts in Central Europe underway.',
      createdBy: prodAdmin._id,
    });

    const horizonProd = await Production.create({
      title: 'The Last Horizon',
      description: 'Survival adventure following an arctic meteorological expedition.',
      status: ProductionStatus.COMPLETED,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-02-15'),
      productionManager: prodManager._id,
      budget: {
        total: 1200000,
        spent: 1180000,
        currency: 'USD',
      },
      assignedCast: [castMember._id],
      assignedCrew: [{ user: crewMember._id, department: 'Sound', position: 'Boom Operator' }],
      locations: [],
      notes: 'Completed theatrical cut; festival distribution active.',
      createdBy: superAdmin._id,
    });

    logger.info('Seeded 4 representative Productions');

    // ─────────────────────────────────────────────────────────────
    // Step 5: Seed Script Characters
    // ─────────────────────────────────────────────────────────────
    await Character.deleteMany({});

    const paulChar = await Character.create({
      production: duneProd._id,
      name: 'Paul Atreides',
      description: 'Duke of House Atreides, messiah figure to the Fremen.',
      castMember: castMember._id,
    });

    const irulanChar = await Character.create({
      production: duneProd._id,
      name: 'Princess Irulan',
      description: 'Eldest daughter of the Padishah Emperor and Bene Gesserit scholar.',
      castMember: null,
    });

    const vChar = await Character.create({
      production: cyberpunkProd._id,
      name: 'V (Valerie)',
      description: 'Cybernetically enhanced mercenary seeking survival in Night City.',
      castMember: castMember._id,
    });

    const silverhandChar = await Character.create({
      production: cyberpunkProd._id,
      name: 'Johnny Silverhand',
      description: 'Legendary Rockerboy rebel living inside an engram chip.',
      castMember: null,
    });

    logger.info('Seeded 4 Script Characters');

    // ─────────────────────────────────────────────────────────────
    // Step 6: Seed Locations & Bookings
    // ─────────────────────────────────────────────────────────────
    await Location.deleteMany({});

    const wadiRum = await Location.create({
      name: 'Wadi Rum Desert Protected Area',
      address: 'Wadi Rum Protected Area, Aqaba Governorate, Jordan',
      coordinates: { lat: 29.5734, lng: 35.4213 },
      submittedBy: locationManager._id,
      contactPerson: 'Tariq Mansoor',
      contactNumber: '+962 3 209 0600',
      rentalCost: 45000,
      permitInfo: 'Royal Film Commission of Jordan Permit #RFC-2026-8812 approved.',
      status: LocationStatus.BOOKED,
      notes: 'Exclusive red sandstone valley with extreme temperature swings.',
      images: [
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      ],
      permits: ['https://res.cloudinary.com/thcsfhit/image/upload/v1/cinedesk/permits/jordan_permit.pdf'],
      bookingCalendar: [
        {
          startDate: new Date('2026-09-01'),
          endDate: new Date('2026-10-15'),
          production: duneProd._id,
          bookedBy: prodManager._id,
        },
      ],
      createdBy: locationManager._id,
    });

    const warehouseLoc = await Location.create({
      name: 'Old Town Industrial Sound Warehouse',
      address: '450 Industrial Parkway, Brooklyn, NY 11222',
      coordinates: { lat: 40.6782, lng: -73.9442 },
      submittedBy: locationManager._id,
      contactPerson: 'Sarah Jenkins',
      contactNumber: '+1 (718) 555-0192',
      rentalCost: 25000,
      permitInfo: 'NYC Mayor’s Office of Media and Entertainment Permit #MOME-904',
      status: LocationStatus.APPROVED,
      notes: '40ft ceilings, sound-insulated soundstage with 2000A three-phase power.',
      images: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      ],
      bookingCalendar: [],
      createdBy: locationManager._id,
    });

    const soundstageTokyo = await Location.create({
      name: 'Neo-Tokyo CineStudio Stage 4',
      address: 'Stage 4, CineStudio Complex, Koto City, Tokyo 135-0064',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      submittedBy: locationManager._id,
      contactPerson: 'Kenji Sato',
      contactNumber: '+81 3 5555 0143',
      rentalCost: 60000,
      permitInfo: 'Commercial filming permit application in review with Tokyo Metropolitan Govt.',
      status: LocationStatus.UNDER_REVIEW,
      notes: 'Full 360-degree LED Volume virtual production wall installed.',
      images: [
        'https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&w=1200&q=80',
      ],
      bookingCalendar: [],
      createdBy: locationManager._id,
    });

    const chateauLoc = await Location.create({
      name: 'Alpine Mountain Chateau',
      address: 'Route des Alpes 12, 3920 Zermatt, Switzerland',
      coordinates: { lat: 45.9763, lng: 7.7491 },
      submittedBy: locationManager._id,
      contactPerson: 'Marc Dupont',
      contactNumber: '+41 27 555 0184',
      rentalCost: 38000,
      permitInfo: 'Valais Canton historic heritage filming clearance requested.',
      status: LocationStatus.REQUESTED,
      notes: 'Panoramic Matterhorn backdrop with private helipad access.',
      images: [
        'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
      ],
      bookingCalendar: [],
      createdBy: locationManager._id,
    });

    // Link location to duneProd
    await Production.findByIdAndUpdate(duneProd._id, {
      locations: [wadiRum._id],
    });

    logger.info('Seeded 4 Locations with active booking and permits');

    // ─────────────────────────────────────────────────────────────
    // Step 7: Seed Fund Requests
    // ─────────────────────────────────────────────────────────────
    await FundRequest.deleteMany({});

    await FundRequest.create({
      production: duneProd._id,
      requester: prodManager._id,
      amount: 125000,
      requestedAmount: 125000,
      category: 'Visual Effects (VFX)',
      justification: 'Cloud GPU compute cluster reservation for creature physics simulation.',
      reason: 'CGI Sandworm Rendering Pipeline Expansion',
      requiredDate: new Date('2026-09-15'),
      status: FundRequestStatus.SUBMITTED,
      comments: 'Requires review from Finance Manager prior to vendor contract execution.',
    });

    await FundRequest.create({
      production: duneProd._id,
      requester: locationManager._id,
      amount: 45000,
      requestedAmount: 45000,
      approvedAmount: 45000,
      category: 'Location & Security',
      justification: 'Ecological reserve security bond and armed desert patrol logistics.',
      reason: 'Jordan Royal Film Commission Permit Security Bond',
      requiredDate: new Date('2026-08-25'),
      status: FundRequestStatus.APPROVED,
      approver: financeManager._id,
      reviewedAt: new Date('2026-08-10'),
      comments: 'Approved under Q3 location allowance budget.',
    });

    await FundRequest.create({
      production: duneProd._id,
      requester: costumeManager._id,
      amount: 60000,
      requestedAmount: 60000,
      approvedAmount: 60000,
      category: 'Wardrobe & Props',
      justification: 'Custom breathable micro-filtration prop fabrication for lead actors.',
      reason: 'Stillsuit Mk IV Hero Suit Construction',
      requiredDate: new Date('2026-08-01'),
      status: FundRequestStatus.PAID,
      approver: financeManager._id,
      reviewedAt: new Date('2026-07-28'),
      comments: 'Disbursed via direct corporate wire to prop master.',
    });

    await FundRequest.create({
      production: cyberpunkProd._id,
      requester: prodManager._id,
      amount: 18500,
      requestedAmount: 18500,
      category: 'Stunts & Safety',
      justification: 'Certified high-wire decelerator pulleys and hydraulic catch airbags.',
      reason: 'Building Jump Stunt Rigging Equipment',
      requiredDate: new Date('2026-10-01'),
      status: FundRequestStatus.DRAFT,
      comments: 'Initial draft by Stunt Coordinator.',
    });

    await FundRequest.create({
      production: duneProd._id,
      requester: crewMember._id,
      amount: 12000,
      requestedAmount: 12000,
      category: 'Catering & Logistics',
      justification: 'Night shoot midnight hot meal service and specialty espresso bar.',
      reason: 'Night Shoot Overtime Catering',
      requiredDate: new Date('2026-09-20'),
      status: FundRequestStatus.REJECTED,
      approver: financeManager._id,
      reviewedAt: new Date('2026-08-12'),
      comments: 'Rejected: Catering cap reached for Q3. Please submit adjusted proposal.',
    });

    logger.info('Seeded 5 Fund Requests across diverse statuses and categories');

    // ─────────────────────────────────────────────────────────────
    // Step 8: Seed Costumes & Assignments
    // ─────────────────────────────────────────────────────────────
    await Costume.deleteMany({});
    await CostumeAssignment.deleteMany({});

    const stillsuit = await Costume.create({
      name: 'Fremen Desert Stillsuit Mk IV (Hero)',
      category: 'Sci-Fi Armor',
      size: 'M',
      character: paulChar._id,
      production: duneProd._id,
      status: CostumeStatus.ASSIGNED,
      images: [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      ],
      notes: 'Hero prop suit with functional LED pulse indicators and catch-tubes.',
      createdBy: costumeManager._id,
    });

    const trenchCoat = await Costume.create({
      name: 'Cyberpunk Distressed Leather Trench Coat',
      category: 'Outerwear',
      size: 'L',
      character: vChar._id,
      production: cyberpunkProd._id,
      status: CostumeStatus.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      ],
      notes: 'Black distressed buffalo leather with luminescent collar lining.',
      createdBy: costumeManager._id,
    });

    const silkGown = await Costume.create({
      name: 'Imperial Royal Silk Gown & Veil',
      category: 'Period & Royalty',
      size: 'S',
      character: irulanChar._id,
      production: duneProd._id,
      status: CostumeStatus.RESERVED,
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      ],
      notes: 'Hand-woven silver filigree embroidery. Stored in climate-controlled vault.',
      createdBy: costumeManager._id,
    });

    const tacticalVest = await Costume.create({
      name: 'Tactical Combat Harness & Ballistic Vest',
      category: 'Stunt Gear',
      size: 'L',
      production: cyberpunkProd._id,
      status: CostumeStatus.MAINTENANCE,
      images: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      ],
      notes: 'Undergoing buckle reinforcement after motorcycle stunt rehearsal.',
      createdBy: costumeManager._id,
    });

    // Create Costume Assignment for Stillsuit
    await CostumeAssignment.create({
      costume: stillsuit._id,
      actor: castMember._id,
      castMember: castMember._id,
      character: paulChar._id,
      production: duneProd._id,
      assignedBy: costumeManager._id,
      assignedAt: new Date('2026-08-05'),
      assignedDate: new Date('2026-08-05'),
      conditionBefore: 'Mint condition, fresh from fabricator workshop.',
      status: 'Active',
      notes: 'Assigned for principal photography across Scenes 14-48.',
    });

    logger.info('Seeded 4 Costumes and active CostumeAssignment');

    // ─────────────────────────────────────────────────────────────
    // Step 9: Seed Onboarding Applications
    // ─────────────────────────────────────────────────────────────
    await OnboardingApplication.deleteMany({});

    // 1. Pending Review Applicant
    const pendingApp = await OnboardingApplication.create({
      applicant: applicantUser._id,
      contractorType: ContractorType.CAST,
      status: OnboardingStatus.PENDING_REVIEW,
      steps: {
        yourInformation: {
          name: 'David Miller',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          contact: '+1 (555) 234-5678 / david.miller@actorhub.com',
          department: 'Cast',
          position: 'Supporting Actor / Combat Specialist',
          experience: '8 years in SAG-AFTRA feature films; martial arts & stage combat certified.',
        },
        financial: {
          paymentType: 'Direct Deposit',
          bankDetails: 'Chase Bank, Routing #021000021, Account #****9821',
          taxInfo: 'SSN: ***-**-4912 / W-9 on file',
        },
        documents: [
          {
            type: 'Government_ID',
            fileUrl: 'https://res.cloudinary.com/thcsfhit/image/upload/v1/cinedesk/onboarding/passport_sample.jpg',
            uploadedAt: new Date(),
          },
          {
            type: 'Tax_W9',
            fileUrl: 'https://res.cloudinary.com/thcsfhit/image/upload/v1/cinedesk/onboarding/w9_sample.pdf',
            uploadedAt: new Date(),
          },
        ],
        sign: {
          agreedAt: new Date(),
          signatureText: 'David Miller',
        },
      },
      submittedAt: new Date(),
      resubmissionCount: 0,
    });
    await User.findByIdAndUpdate(applicantUser._id, {
      onboardingApplication: pendingApp._id,
    });

    // 2. Changes Requested Applicant
    const changesApp = await OnboardingApplication.create({
      applicant: changesUser._id,
      contractorType: ContractorType.FREELANCER,
      status: OnboardingStatus.CHANGES_REQUESTED,
      steps: {
        yourInformation: {
          name: 'Elena Rostova',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          contact: '+1 (555) 987-6543 / elena.camera@filmlens.org',
          department: 'Camera',
          position: 'Steadicam Operator',
          experience: '6 years high-speed action tracking and gimbal specialist.',
        },
        financial: {
          paymentType: 'Direct Deposit',
          bankDetails: 'Bank of America, Routing #121000358, Account #****4102',
          taxInfo: 'EIN: **-***8821',
        },
        documents: [
          {
            type: 'Government_ID',
            fileUrl: 'https://res.cloudinary.com/thcsfhit/image/upload/v1/cinedesk/onboarding/id_sample.jpg',
            uploadedAt: new Date(),
          },
        ],
        sign: {
          agreedAt: new Date(),
          signatureText: 'Elena Rostova',
        },
      },
      reviewer: superAdmin._id,
      reviewedAt: new Date(),
      reviewComments: 'Please re-upload a clear government-issued photo ID and attach contractor certificate.',
      rejectionReason: 'Illegible Document',
      resubmissionCount: 1,
    });
    await User.findByIdAndUpdate(changesUser._id, {
      onboardingApplication: changesApp._id,
    });

    logger.info('Seeded Onboarding Applications (Pending Review & Changes Requested)');

    // ─────────────────────────────────────────────────────────────
    // Step 10: Seed Audit Logs & Notifications
    // ─────────────────────────────────────────────────────────────
    await AuditLog.deleteMany({});
    await AuditLog.create([
      {
        actor: superAdmin._id,
        action: 'roles_permissions_updated',
        targetEntity: 'Role',
        targetId: roles[0]._id,
        module: 'RBAC',
        meta: { role: 'Super Admin', permissionsCount: permissions.length },
        timestamp: new Date('2026-08-01T10:00:00Z'),
      },
      {
        actor: prodManager._id,
        action: 'location_booked',
        targetEntity: 'Location',
        targetId: wadiRum._id,
        module: 'Locations',
        meta: { production: 'Dune: Prophecy of Arrakis', dateRange: '2026-09-01 to 2026-10-15' },
        timestamp: new Date('2026-08-05T14:30:00Z'),
      },
      {
        actor: financeManager._id,
        action: 'fund_request_approved',
        targetEntity: 'FundRequest',
        module: 'Finance',
        meta: { amount: 45000, category: 'Location & Security' },
        timestamp: new Date('2026-08-10T16:45:00Z'),
      },
      {
        actor: costumeManager._id,
        action: 'costume_assigned',
        targetEntity: 'Costume',
        targetId: stillsuit._id,
        module: 'Costumes',
        meta: { costume: 'Stillsuit Mk IV', actor: 'Cast Member', character: 'Paul Atreides' },
        timestamp: new Date('2026-08-05T11:15:00Z'),
      },
      {
        actor: superAdmin._id,
        action: 'onboarding_request_changes',
        targetEntity: 'OnboardingApplication',
        targetId: changesApp._id,
        module: 'Onboarding',
        meta: { applicant: 'Elena Rostova', reason: 'Illegible Document' },
        timestamp: new Date('2026-08-13T09:20:00Z'),
      },
    ]);

    await Notification.deleteMany({});
    await Notification.create([
      {
        recipient: applicantUser._id,
        type: 'info',
        title: 'Application Submitted',
        message: 'Your onboarding application as Cast has been received and is currently under review.',
        isRead: false,
      },
      {
        recipient: changesUser._id,
        type: 'warning',
        title: 'Action Required: Changes Requested',
        message: 'Admin review requested revisions: Please re-upload a clear government-issued photo ID.',
        isRead: false,
      },
      {
        recipient: prodManager._id,
        type: 'success',
        title: 'Location Approved & Booked',
        message: 'Wadi Rum Desert Protected Area has been booked for Dune: Prophecy of Arrakis.',
        isRead: true,
      },
      {
        recipient: financeManager._id,
        type: 'info',
        title: 'New Fund Request Submitted',
        message: 'VFX CGI Sandworm Rendering Pipeline ($125,000) awaits your financial review.',
        isRead: false,
      },
    ]);

    logger.info('Seeded Audit Logs and Notifications');

    // ─────────────────────────────────────────────────────────────
    // Seeding Summary
    // ─────────────────────────────────────────────────────────────
    logger.info('');
    logger.info('======================================================');
    logger.info('✨ CINEDESK PRO DATABASE SEEDING COMPLETED SUCCESSFULLY ✨');
    logger.info('======================================================');
    logger.info('Test Accounts (Password for all: Password123!):');
    logger.info('──────────────────────────────────────────────────────');
    logger.info('  1. Super Admin:        superadmin@tendagon.test');
    logger.info('  2. Production Admin:   prodadmin@tendagon.test');
    logger.info('  3. Production Manager: pm@tendagon.test');
    logger.info('  4. Finance Manager:    finance@tendagon.test');
    logger.info('  5. Location Manager:   location@tendagon.test');
    logger.info('  6. Costume Manager:    costume@tendagon.test');
    logger.info('  7. Cast Member:        cast@tendagon.test');
    logger.info('  8. Crew Member:        crew@tendagon.test');
    logger.info('  9. Deactivated User:   deactivated@tendagon.test (HTTP 403 test)');
    logger.info(' 10. Pending Applicant:  applicant@tendagon.test (Onboarding Review)');
    logger.info(' 11. Changes Applicant:  changes@tendagon.test (Changes Requested)');
    logger.info('──────────────────────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runSeed();
