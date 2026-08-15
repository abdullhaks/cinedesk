import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../zustand/authStore';
import { ROUTES } from '../../constants/routes';
import type { ContractorType } from '../../interfaces/user';
import { signupContractorSchema } from '../../validators/auth.validator';
import {
  UserCheck,
  Film,
  Truck,
  Users,
  Shield,
  GraduationCap,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from 'lucide-react';
import { message } from 'antd';

const CONTRACTOR_TYPES: { type: ContractorType; label: string; desc: string; icon: any }[] = [
  { type: 'Freelancer', label: 'Freelancer / Crew', desc: 'Camera, sound, lighting & specialized production technicians', icon: Film },
  { type: 'Cast', label: 'Cast Member / Actor', desc: 'Lead actors, supporting cast, stunt performers & talent', icon: UserCheck },
  { type: 'Supplier', label: 'Supplier / Vendor', desc: 'Equipment rental, props, wardrobe fabricators & catering', icon: Truck },
  { type: 'Cast-Crew Agent', label: 'Cast / Crew Agent', desc: 'Talent agents, contractor reps & casting agencies', icon: Users },
  { type: 'TCS Team', label: 'TCS Team', desc: 'Technical & Creative Services internal support crew', icon: Shield },
  { type: 'Intern', label: 'Intern / Trainee', desc: 'Film production students, apprentices & set assistants', icon: GraduationCap },
];

export const SignupContractor: React.FC = () => {
  const navigate = useNavigate();
  const { registerContractor, isLoading } = useAuthStore();

  const [selectedType, setSelectedType] = useState<ContractorType>('Freelancer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  // Live password strength checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    // Clear specific field error on user edit
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate with strict Zod schema
    const validation = signupContractorSchema.safeParse({
      contractorType: selectedType,
      fullName,
      email,
      password,
    });

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const pathKey = err.path[0]?.toString() || 'form';
        if (!formattedErrors[pathKey]) {
          formattedErrors[pathKey] = err.message;
        }
      });
      setFieldErrors(formattedErrors);
      setError('Please resolve all validation errors before proceeding.');
      return;
    }

    try {
      await registerContractor(
        validation.data.fullName,
        validation.data.email,
        validation.data.password,
        validation.data.contractorType
      );
      message.success('Account created! Let’s complete your 6-step onboarding application.');
      navigate('/onboarding/1');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to initiate contractor onboarding registration.';
      setError(errMsg);
      message.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/appicon.png"
            alt="App Icon"
            className="h-16 mx-auto mb-3 object-contain"
          />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contractor Registration & Onboarding</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
            Apply as cast, crew, or service contractor. Complete our 6-step digital onboarding to get verified for film productions.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Step A: Select Contractor Type */}
          <div className="card-minimal shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="label-caps-grey">STEP 1: SELECT YOUR CONTRACTOR TYPE</span>
              <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
                Selected: {selectedType}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CONTRACTOR_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedType === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => {
                      setSelectedType(item.type);
                      if (fieldErrors.contractorType) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.contractorType;
                          return next;
                        });
                      }
                    }}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border text-left relative ${
                      isSelected
                        ? 'bg-slate-100/80 border-black ring-2 ring-black/20'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2
                        size={16}
                        className="text-black absolute top-3 right-3"
                      />
                    )}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                        isSelected
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-0.5">{item.label}</h3>
                    <p className="text-[11px] text-slate-500 leading-snug mb-0">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            {fieldErrors.contractorType && (
              <p className="mt-2 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle size={13} /> {fieldErrors.contractorType}
              </p>
            )}
          </div>

          {/* Step B: Account Credentials */}
          <div className="card-minimal shadow-sm max-w-xl mx-auto">
            <span className="label-caps-grey block mb-4 pb-2 border-b border-slate-100">
              STEP 2: CREATE YOUR ACCOUNT LOGIN
            </span>

            <div className="space-y-4">
              <div>
                <label className="label-caps-grey block mb-1.5">Full Legal Name *</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="e.g. David Miller"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none transition-colors ${
                      fieldErrors.fullName
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:border-black focus:ring-1 focus:ring-black focus:bg-white'
                    }`}
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle size={13} /> {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="label-caps-grey block mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none transition-colors ${
                      fieldErrors.email
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:border-black focus:ring-1 focus:ring-black focus:bg-white'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle size={13} /> {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="label-caps-grey block mb-1.5">Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    placeholder="Create a strong password"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none transition-colors ${
                      fieldErrors.password
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                        : 'border-slate-200 focus:border-black focus:ring-1 focus:ring-black focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle size={13} /> {fieldErrors.password}
                  </p>
                )}

                {/* Password Criteria Checklist */}
                <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-[11px]">
                  <span className="font-semibold text-slate-600 block mb-1">Password Requirements:</span>
                  <div className="grid grid-cols-2 gap-1">
                    <div className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      <Check size={12} className={passwordChecks.length ? 'text-emerald-600' : 'text-slate-300'} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      <Check size={12} className={passwordChecks.uppercase ? 'text-emerald-600' : 'text-slate-300'} />
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      <Check size={12} className={passwordChecks.lowercase ? 'text-emerald-600' : 'text-slate-300'} />
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      <Check size={12} className={passwordChecks.number ? 'text-emerald-600' : 'text-slate-300'} />
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 col-span-2 ${passwordChecks.special ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                      <Check size={12} className={passwordChecks.special ? 'text-emerald-600' : 'text-slate-300'} />
                      <span>Special character (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 mt-4 cursor-pointer"
              >
                {isLoading ? 'Creating Account...' : 'Continue to 6-Step Onboarding'}
                {!isLoading && <ArrowRight size={16} />}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-slate-900 font-bold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupContractor;
