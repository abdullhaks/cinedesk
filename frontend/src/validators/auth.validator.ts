import { z } from 'zod';

export const signupContractorSchema = z.object({
  contractorType: z.enum(
    ['Freelancer', 'Cast', 'Supplier', 'Cast-Crew Agent', 'TCS Team', 'Intern'],
    { message: 'Please select a valid contractor type' }
  ),
  fullName: z
    .string()
    .trim()
    .min(1, 'Full legal name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address (e.g. name@example.com)')
    .max(100, 'Email address cannot exceed 100 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password cannot exceed 64 characters')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter (A-Z)')
    .regex(/[a-z]/, 'Must contain at least 1 lowercase letter (a-z)')
    .regex(/[0-9]/, 'Must contain at least 1 number (0-9)')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least 1 special character (e.g. !@#$%^&*)'),
});

export type SignupContractorInput = z.infer<typeof signupContractorSchema>;
