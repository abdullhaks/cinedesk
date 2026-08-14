import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingApi } from '../../services/apis/onboardingApi';
import type { ContractorType } from '../../interfaces/user';
import { UserCheck, Film, Truck, Users, Shield, GraduationCap, ArrowRight } from 'lucide-react';
import { OnboardingHeader } from '../../components/layout/OnboardingHeader';

const CONTRACTOR_TYPES: { type: ContractorType; label: string; desc: string; icon: any }[] = [
  { type: 'Freelancer', label: 'Freelancer / Crew', desc: 'Independent film crew, technicians & specialists', icon: Film },
  { type: 'Cast', label: 'Cast Member / Actor', desc: 'Performers, actors, stunt team & voice talents', icon: UserCheck },
  { type: 'Supplier', label: 'Supplier / Vendor', desc: 'Equipment rental, catering, props & costume suppliers', icon: Truck },
  { type: 'Cast-Crew Agent', label: 'Cast / Crew Agent', desc: 'Talent agencies & contractor representatives', icon: Users },
  { type: 'TCS Team', label: 'TCS Team', desc: 'Technical & Creative Services internal team', icon: Shield },
  { type: 'Intern', label: 'Intern / Trainee', desc: 'Production interns, apprentices & assistants', icon: GraduationCap },
];

export const Apply: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectType = async (type: ContractorType) => {
    setLoading(true);
    setError(null);
    try {
      await onboardingApi.createDraft(type);
      navigate('/onboarding/1');
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Active application exists -> redirect to status page
        navigate('/onboarding/status');
      } else {
        setError(err.response?.data?.message || 'Failed to start onboarding process');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex flex-col">
      <OnboardingHeader />
      <div className="flex-1 py-12 px-4 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Contractor Application Portal</h1>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Select your contractor role to begin your digital onboarding application for Cinidesk Pro.
            </p>
          </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTRACTOR_TYPES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                onClick={() => !loading && handleSelectType(item.type)}
                className="card-minimal cursor-pointer group hover:border-blue-500 border border-transparent transition-all duration-200 flex items-start gap-4 p-5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </h3>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-0">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  );
};
