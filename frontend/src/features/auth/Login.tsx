import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../zustand/authStore';
import { ROUTES } from '../../constants/routes';
import { Shield, ArrowRight, Lock, Mail, UserPlus, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F4F4F6] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <img
            src="/appicon.png"
            alt="App Icon"
            className="h-16 mx-auto mb-2 object-contain"
          />
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Film Production Management Platform
          </p>
        </div>

        {/* Public Contractor Signup Banner */}
        <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-100">
              <Sparkles size={14} />
              <span>Contractor Onboarding</span>
            </div>
            <p className="text-xs text-blue-50 mt-0.5 mb-0">Apply as Cast, Crew, or Vendor</p>
          </div>
          <Link
            to={ROUTES.SIGNUP}
            className="px-3.5 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <UserPlus size={14} /> Apply Now
          </Link>
        </div>

        {/* Login Form Card */}
        <div className="card-minimal shadow-lg">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Sign In</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your credentials to access your dashboard</p>

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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="user@tendagon.test"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Select Test Accounts */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 font-semibold uppercase tracking-wider">
              <Shield size={14} className="text-blue-500" />
              <span>Quick Test Accounts (Password: Password123!)</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {TEST_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickSelect(acc.email)}
                  className={`text-left p-2 rounded-lg text-xs transition-colors border ${
                    email === acc.email
                      ? 'bg-blue-50 border-blue-200 text-blue-800 font-medium'
                      : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold text-[11px] truncate">{acc.label}</div>
                  <div className="text-[10px] opacity-75 truncate">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
