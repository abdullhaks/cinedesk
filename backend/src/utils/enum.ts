export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum UserStatus {
  PENDING_ONBOARDING = 'pending_onboarding',
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

export enum ContractorType {
  FREELANCER = 'Freelancer',
  CAST = 'Cast',
  SUPPLIER = 'Supplier',
  CAST_CREW_AGENT = 'Cast-Crew Agent',
  TCS_TEAM = 'TCS Team',
  INTERN = 'Intern',
}

export enum OnboardingStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CHANGES_REQUESTED = 'changes_requested',
}

export enum ProductionStatus {
  DEVELOPMENT = 'Development',
  PRE_PRODUCTION = 'Pre-Production',
  PRODUCTION = 'Production',
  POST_PRODUCTION = 'Post-Production',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export enum LocationStatus {
  REQUESTED = 'Requested',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  BOOKED = 'Booked',
  COMPLETED = 'Completed',
}

export enum FundRequestStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PAID = 'Paid',
}

export enum CostumeStatus {
  AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  ASSIGNED = 'Assigned',
  DAMAGED = 'Damaged',
  MAINTENANCE = 'Maintenance',
  LOST = 'Lost',
}

export enum PurchaseOrRentalType {
  PURCHASE = 'Purchase',
  RENTAL = 'Rental',
}
