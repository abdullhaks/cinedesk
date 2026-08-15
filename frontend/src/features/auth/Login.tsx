import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../zustand/authStore';
import { ROUTES } from '../../constants/routes';
import { Shield, ArrowRight, Lock, Mail, UserPlus, Sparkles, Film, CheckCircle2, DollarSign, Clapperboard, Eye, EyeOff } from 'lucide-react';
import { message } from 'antd';

const TEST_ACCOUNTS = [
  { label: 'Super Admin', email: 'superadmin@tendagon.test', role: 'Full System Access' },
  { label: 'Production Admin', email: 'prodadmin@tendagon.test', role: 'Productions & Onboarding' },
  { label: 'Production Manager', email: 'pm@tendagon.test', role: 'Productions, Cast & Funds' },
  { label: 'Finance Manager', email: 'finance@tendagon.test', role: 'Fund Approvals & Disbursal' },
  { label: 'Location Manager', email: 'location@tendagon.test', role: 'Locations & Permits' },
  { label: 'Costume Manager', email: 'costume@tendagon.test', role: 'Costumes & Assignments' },
  { label: 'Cast Member', email: 'cast@tendagon.test', role: 'Assigned Productions & Profile' },
  { label: 'Crew Member', email: 'crew@tendagon.test', role: 'Assigned Productions & Profile' },
  { label: 'Pending Applicant', email: 'applicant@tendagon.test', role: 'In Review Onboarding App' },
  { label: 'Deactivated User', email: 'deactivated@tendagon.test', role: 'HTTP 403 Security Test' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('superadmin@tendagon.test');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      setError(errMsg);
      message.error(errMsg);
    }
  };

  const handleQuickSelect = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-stretch">
      {/* Split Screen Grid Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* LEFT COLUMN: App Logo & Cinema Branding Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-zinc-950 to-black p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800/80 relative overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-zinc-700/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo Section */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <img
                src="/appicon.png"
                alt="App Logo"
                className="h-12 w-auto object-contain drop-shadow-md"
              />
            </div>
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-semibold text-zinc-300 mb-4 shadow-inner">
                <Clapperboard size={13} className="text-zinc-400" />
                <span>Next-Gen Film Production Suite</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Streamline productions, cast & finances in one place.
              </h1>
              <p className="text-sm text-zinc-400 mt-3 max-w-md leading-relaxed">
                Centralized production scheduling, instant fund drawdown approvals, automated contractor onboarding, and real-time audit control.
              </p>
            </div>
          </div>

          {/* Feature Highlights Showcase */}
          <div className="my-8 space-y-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm flex items-start gap-3.5 transition-transform hover:translate-x-1">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 shrink-0">
                <Film size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">End-to-End Production Logistics</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Manage cast, crew, locations, and wardrobe schedules seamlessly.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm flex items-start gap-3.5 transition-transform hover:translate-x-1">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 shrink-0">
                <DollarSign size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Audited Financial Approvals</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Automated fund disbursements with self-approval guards.</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-sm flex items-start gap-3.5 transition-transform hover:translate-x-1">
              <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200 shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-200">Role-Based Access Control</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Strict permission boundaries across 8 specialized studio roles.</div>
              </div>
            </div>
          </div>

          {/* Bottom Version Tag */}
          <div className="relative z-10 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
            <span>© 2026 Cinedesk Studio Pro</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Enterprise Ready
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Window & Account Switcher */}
        <div className="lg:col-span-7 bg-[#F4F4F6] text-slate-900 p-6 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-lg space-y-5">

            {/* Public Contractor Signup Banner */}
            <div className="bg-gradient-to-r from-zinc-900 via-slate-900 to-black rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Contractor Onboarding</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 mb-0">Apply as Cast, Crew, or Vendor</p>
              </div>
              <Link
                to={ROUTES.SIGNUP}
                className="px-3.5 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <UserPlus size={14} /> Apply Now
              </Link>
            </div>

            {/* Login Window Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 sm:p-8">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">Enter your credentials to access your dashboard</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-caps-grey block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-colors"
                      placeholder="user@tendagon.test"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-caps-grey block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-colors"
                      placeholder="••••••••"
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
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-black hover:bg-zinc-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              {/* Quick Select Test Accounts */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-semibold uppercase tracking-wider">
                  <Shield size={14} className="text-zinc-700" />
                  <span>Quick Test Accounts (Password: Password123!)</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {TEST_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickSelect(acc.email)}
                      className={`text-left p-2 rounded-xl text-xs transition-all border cursor-pointer ${
                        email === acc.email
                          ? 'bg-zinc-900 border-zinc-900 text-white font-medium shadow-xs'
                          : 'bg-slate-50 border-slate-200/70 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-semibold text-[11px] truncate">{acc.label}</div>
                      <div className={`text-[10px] truncate ${email === acc.email ? 'text-zinc-300' : 'text-slate-400'}`}>
                        {acc.role}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
