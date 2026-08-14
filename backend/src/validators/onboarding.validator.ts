import { z } from 'zod';
import { ContractorType } from '../utils/enum';

export const createOnboardingSchema = z.object({
  contractorType: z.nativeEnum(ContractorType),
});

export const yourInformationStepSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  photo: z.string().optional(),
  contact: z.string().min(5, 'Contact info is required'),
  department: z.string().min(2, 'Department is required'),
  position: z.string().min(2, 'Position is required'),
  experience: z.string().optional(),
});

export const financialStepSchema = z.object({
  paymentType: z.string().min(2, 'Payment type is required'),
  bankDetails: z.string().min(5, 'Bank details are required'),
  taxInfo: z.string().min(2, 'Tax info is required'),
});

export const documentItemSchema = z.object({
  type: z.string().min(1, 'Document type is required'),
  fileUrl: z.string().url('Invalid file URL'),
});

export const signStepSchema = z.object({
  signatureText: z.string().min(2, 'Signature text is required'),
  agreed: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

export const reviewOnboardingSchema = z.object({
  action: z.enum(['approve', 'reject', 'request_changes']),
  comments: z.string().optional(),
  rejectionReason: z.string().optional(),
});
