import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerContractorSchema = z.object({
  contractorType: z.enum(
    ['Freelancer', 'Cast', 'Supplier', 'Cast-Crew Agent', 'TCS Team', 'Intern'],
    { message: 'Invalid contractor type' }
  ),
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Full name can only contain letters and spaces'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(100, 'Email address is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must not exceed 64 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
    .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
