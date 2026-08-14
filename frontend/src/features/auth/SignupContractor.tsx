import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../zustand/authStore';
import { ROUTES } from '../../constants/routes';
import type { ContractorType } from '../../interfaces/user';
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required registration fields.');
      return;
    }

    try {
      await registerContractor(fullName, email, password, selectedType);
      message.success('Account created! Let’s complete your 6-step onboarding application.');
      navigate('/onboarding/1');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate contractor onboarding registration.');
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
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step A: Select Contractor Type */}
          <div className="card-minimal shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="label-caps-grey">STEP 1: SELECT YOUR CONTRACTOR TYPE</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
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
                    onClick={() => setSelectedType(item.type)}
                    className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border text-left relative ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2
                        size={16}
                        className="text-blue-600 absolute top-3 right-3"
                      />
                    )}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
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
          </div>

          {/* Step B: Account Credentials */}
          <div className="card-minimal shadow-sm max-w-xl mx-auto">
            <span className="label-caps-grey block mb-4 pb-2 border-b border-slate-100">
              STEP 2: CREATE YOUR ACCOUNT LOGIN
            </span>

            <div className="space-y-4">
              <div>
                <label className="label-caps-grey block mb-1.5">Full Legal Name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. David Miller"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="label-caps-grey block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="label-caps-grey block mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 mt-4"
              >
                {isLoading ? 'Creating Account...' : 'Continue to 6-Step Onboarding'}
                {!isLoading && <ArrowRight size={16} />}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-blue-600 font-semibold hover:underline">
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
