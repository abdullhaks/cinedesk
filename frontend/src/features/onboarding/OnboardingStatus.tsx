import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingApi } from '../../services/apis/onboardingApi';
import type { OnboardingApplication } from '../../interfaces/onboarding';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Clock, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { OnboardingHeader } from '../../components/layout/OnboardingHeader';

export const OnboardingStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState<OnboardingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const app = await onboardingApi.getMyApplication();
      setApplication(app);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch application status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchStatus} />;

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F4F4F6] flex flex-col">
        <OnboardingHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="card-minimal max-w-md text-center py-10">
            <h2 className="text-lg font-bold text-slate-800 mb-2">No Active Application</h2>
            <p className="text-xs text-slate-500 mb-6">
              You have not submitted an onboarding application yet.
            </p>
            <button
              onClick={() => navigate('/apply')}
              className="px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Start Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { status, contractorType, steps, reviewComments, rejectionReason } = application;

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex flex-col">
      <OnboardingHeader />
      <div className="flex-1 py-10 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-6">
          {/* Status Card Banner */}
          <div className="card-minimal text-center py-8 px-6 shadow-md">
          {status === 'pending_review' && (
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-3">
              <Clock size={32} />
            </div>
          )}
          {status === 'approved' && (
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} />
            </div>
          )}
          {status === 'changes_requested' && (
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={32} />
            </div>
          )}
          {status === 'rejected' && (
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <XCircle size={32} />
            </div>
          )}

          <div className="mb-2">
            <StatusBadge status={status} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            {status === 'pending_review' && 'Application Under Review'}
            {status === 'approved' && 'Application Approved!'}
            {status === 'changes_requested' && 'Changes Requested by Admin'}
            {status === 'rejected' && 'Application Declined'}
            {status === 'draft' && 'Draft Application Incomplete'}
          </h1>

          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Contractor Type: <strong className="text-slate-800">{contractorType}</strong>
          </p>

          {/* Feedback section for changes_requested or rejected */}
          {status === 'changes_requested' && reviewComments && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
              <span className="label-caps-grey text-amber-800 block mb-1">Reviewer Feedback:</span>
              <p className="text-xs text-amber-900 m-0 font-medium">{reviewComments}</p>
            </div>
          )}

          {status === 'rejected' && rejectionReason && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-left">
              <span className="label-caps-grey text-rose-800 block mb-1">Rejection Reason:</span>
              <p className="text-xs text-rose-900 m-0 font-medium">{rejectionReason}</p>
            </div>
          )}

          {/* Resume flow button */}
          {(status === 'changes_requested' || status === 'draft') && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/onboarding/1')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Resume & Update Application
              </button>
            </div>
          )}

          {status === 'approved' && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Submitted Data Summary */}
        <div className="card-minimal space-y-3">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Submitted Step Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 mb-1">Personal Details</div>
              <div className="text-slate-500">{steps?.yourInformation?.name || 'N/A'}</div>
              <div className="text-slate-500">{steps?.yourInformation?.position || 'N/A'}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 mb-1">Financial & Tax</div>
              <div className="text-slate-500">{steps?.financial?.paymentType || 'N/A'}</div>
              <div className="text-slate-500">Tax ID: {steps?.financial?.taxInfo ? 'Provided' : 'N/A'}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 mb-1">Documents</div>
              <div className="text-slate-500">
                {steps?.documents?.length ? `${steps.documents.length} files attached` : 'No documents'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-semibold text-slate-700 mb-1">Digital Signature</div>
              <div className="text-slate-500">{steps?.sign?.signatureText || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
