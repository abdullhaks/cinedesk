import { OnboardingStatus } from '../utils/enum';

const ALLOWED_TRANSITIONS: Record<OnboardingStatus, OnboardingStatus[]> = {
  [OnboardingStatus.DRAFT]: [OnboardingStatus.PENDING_REVIEW],
  [OnboardingStatus.PENDING_REVIEW]: [
    OnboardingStatus.APPROVED,
    OnboardingStatus.REJECTED,
    OnboardingStatus.CHANGES_REQUESTED,
  ],
  [OnboardingStatus.CHANGES_REQUESTED]: [OnboardingStatus.PENDING_REVIEW],
  [OnboardingStatus.APPROVED]: [],
  [OnboardingStatus.REJECTED]: [],
};

export const canTransitionOnboarding = (
  from: OnboardingStatus,
  to: OnboardingStatus
): boolean => {
  const allowed = ALLOWED_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
};
