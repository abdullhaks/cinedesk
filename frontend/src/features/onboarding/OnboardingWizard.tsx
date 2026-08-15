import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onboardingApi } from '../../services/apis/onboardingApi';
import type { OnboardingApplication } from '../../interfaces/onboarding';
import { Stepper } from '../../components/form/Stepper';
import type { StepItem } from '../../components/form/Stepper';
import { FormField } from '../../components/form/FormField';
import { FileUploadField } from '../../components/form/FileUploadField';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react';
import { OnboardingHeader } from '../../components/layout/OnboardingHeader';
import { message } from 'antd';

const WIZARD_STEPS: StepItem[] = [
  { number: 1, title: 'Welcome', description: 'Application Overview' },
  { number: 2, title: 'Information', description: 'Personal Details' },
  { number: 3, title: 'Financial', description: 'Banking & Tax' },
  { number: 4, title: 'Documents', description: 'Upload Proof' },
  { number: 5, title: 'Sign', description: 'Agreement' },
  { number: 6, title: 'Done', description: 'Submit Application' },
];

export const OnboardingWizard: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const currentStepNum = Math.min(6, Math.max(1, parseInt(step || '1', 10)));

  const [application, setApplication] = useState<OnboardingApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Step 2 Form State
  const [yourInfo, setYourInfo] = useState({
    name: '',
    photo: '',
    contact: '',
    department: '',
    position: '',
    experience: '',
  });

  // Step 3 Form State
  const [financial, setFinancial] = useState({
    paymentType: 'Direct Deposit',
    bankDetails: '',
    taxInfo: '',
  });

  // Step 5 Form State
  const [signatureText, setSignatureText] = useState('');
  const [agreed, setAgreed] = useState(false);

  const fetchApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const app = await onboardingApi.getMyApplication();
      if (!app) {
        navigate('/apply');
        return;
      }
      setApplication(app);

      // Populate existing step data if available
      if (app.steps?.yourInformation) {
        setYourInfo({
          name: app.steps.yourInformation.name || '',
          photo: app.steps.yourInformation.photo || '',
          contact: app.steps.yourInformation.contact || '',
          department: app.steps.yourInformation.department || '',
          position: app.steps.yourInformation.position || '',
          experience: app.steps.yourInformation.experience || '',
        });
      }
      if (app.steps?.financial) {
        setFinancial({
          paymentType: app.steps.financial.paymentType || 'Direct Deposit',
          bankDetails: app.steps.financial.bankDetails || '',
          taxInfo: app.steps.financial.taxInfo || '',
        });
      }
      if (app.steps?.sign) {
        setSignatureText(app.steps.sign.signatureText || '');
        setAgreed(!!app.steps.sign.agreedAt);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  const handleNextStep = async () => {
    if (!application) return;
    setSaving(true);

    try {
      if (currentStepNum === 2) {
        if (!yourInfo.name || !yourInfo.contact || !yourInfo.department || !yourInfo.position) {
          message.warning('Please fill in all required personal information fields.');
          setSaving(false);
          return;
        }
        await onboardingApi.updateStep(application._id, 'yourInformation', yourInfo);
      } else if (currentStepNum === 3) {
        if (!financial.paymentType || !financial.bankDetails || !financial.taxInfo) {
          message.warning('Please fill in all required financial information fields.');
          setSaving(false);
          return;
        }
        await onboardingApi.updateStep(application._id, 'financial', financial);
      } else if (currentStepNum === 5) {
        if (!signatureText || !agreed) {
          message.warning('You must provide a signature text and agree to the terms.');
          setSaving(false);
          return;
        }
        await onboardingApi.updateStep(application._id, 'sign', { signatureText, agreed: true });
      }

      if (currentStepNum < 6) {
        navigate(`/onboarding/${currentStepNum + 1}`);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to save step data.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!application) return;
    setSaving(true);
    try {
      await onboardingApi.submit(application._id);
      message.success('Onboarding application submitted successfully!');
      navigate('/onboarding/status');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUploadSuccess = async (fileUrl: string, type: string) => {
    if (!application) return;
    try {
      await onboardingApi.updateStep(application._id, 'documents', { fileUrl, type });
      message.success(`${type} uploaded successfully`);
      await fetchApplication();
    } catch (err: any) {
      message.error('Failed to save document record');
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchApplication} />;

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex flex-col">
      <OnboardingHeader />
      <div className="flex-1 py-10 px-4">
        <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* Top Stepper Header */}
        <div className="card-minimal">
          <div className="flex items-center justify-between mb-2">
            <span className="label-caps-grey">CONTRACTOR ONBOARDING WIZARD</span>
            <span className="text-xs font-bold text-slate-900">
              Contractor Type: {application?.contractorType}
            </span>
          </div>
          <Stepper
            steps={WIZARD_STEPS}
            currentStep={currentStepNum}
            onStepClick={(stepNumber) => navigate(`/onboarding/${stepNumber}`)}
          />
        </div>

        {/* Wizard Step Content Card */}
        <div className="card-minimal shadow-md">
          {/* STEP 1: WELCOME */}
          {currentStepNum === 1 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Welcome to Cinedesk Pro</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You are beginning your digital onboarding process as a{' '}
                <strong className="text-slate-800">{application?.contractorType}</strong>. Please complete the following steps to submit your application for administrative review.
              </p>
            </div>
          )}

          {/* STEP 2: YOUR INFORMATION */}
          {currentStepNum === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 2: Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" required>
                  <input
                    type="text"
                    value={yourInfo.name}
                    onChange={(e) => setYourInfo({ ...yourInfo, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </FormField>

                <FormField label="Contact Email / Phone" required>
                  <input
                    type="text"
                    value={yourInfo.contact}
                    onChange={(e) => setYourInfo({ ...yourInfo, contact: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </FormField>

                <FormField label="Department" required>
                  <input
                    type="text"
                    value={yourInfo.department}
                    onChange={(e) => setYourInfo({ ...yourInfo, department: e.target.value })}
                    placeholder="e.g. Camera / Cast / Lighting"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </FormField>

                <FormField label="Position / Specialty" required>
                  <input
                    type="text"
                    value={yourInfo.position}
                    onChange={(e) => setYourInfo({ ...yourInfo, position: e.target.value })}
                    placeholder="e.g. Lead Actor / Camera Operator"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </FormField>
              </div>

              <FormField label="Years of Experience / Notes">
                <textarea
                  value={yourInfo.experience}
                  onChange={(e) => setYourInfo({ ...yourInfo, experience: e.target.value })}
                  placeholder="Summarize relevant film industry experience..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </FormField>
            </div>
          )}

          {/* STEP 3: FINANCIAL */}
          {currentStepNum === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 3: Financial & Tax Details
              </h2>
              <div className="space-y-4">
                <FormField label="Payment Disbursement Type" required>
                  <select
                    value={financial.paymentType}
                    onChange={(e) => setFinancial({ ...financial, paymentType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Direct Deposit">Direct Deposit (Bank Transfer)</option>
                    <option value="Check">Corporate Check</option>
                    <option value="Agency Wire">Agency Wire Transfer</option>
                  </select>
                </FormField>

                <FormField label="Bank Account Details " required>
                  <input
                    type="text"
                    value={financial.bankDetails}
                    onChange={(e) => setFinancial({ ...financial, bankDetails: e.target.value })}
                    placeholder="Bank Name, Account holder, Account No, IFSC Code"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </FormField>

                <FormField label="Tax Identification Number / SSN / EIN" required>
                  <input
                    type="text"
                    value={financial.taxInfo}
                    onChange={(e) => setFinancial({ ...financial, taxInfo: e.target.value })}
                    placeholder="XX-XXXXXXX"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {currentStepNum === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 4: Required Document Uploads
              </h2>
              <p className="text-xs text-slate-500">
                Please upload official government ID and tax identification documents.
              </p>

              <div className="space-y-4">
                <FileUploadField
                  label="Government Issued Photo ID"
                  documentType="Government_ID"
                  onUploadSuccess={handleDocumentUploadSuccess}
                />

                <FileUploadField
                  label="W-9 / Tax Verification Document"
                  documentType="Tax_W9"
                  onUploadSuccess={handleDocumentUploadSuccess}
                />
              </div>

              {application?.steps?.documents && application.steps.documents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="label-caps-grey block mb-2">Uploaded Files Summary</span>
                  <div className="space-y-2">
                    {application.steps.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                      >
                        <span className="font-semibold text-slate-700">{doc.type}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 font-medium">Uploaded</span>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await onboardingApi.updateStep(application._id, 'documents', { type: doc.type, action: 'remove' });
                                message.success(`${doc.type} removed successfully`);
                                fetchApplication();
                              } catch (err: any) {
                                message.error('Failed to remove document');
                              }
                            }}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            title={`Remove ${doc.type}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SIGN */}
          {currentStepNum === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 5: Contractor Terms & Digital Signature
              </h2>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto">
                By submitting this application, you declare that all provided personal, financial, and tax information is truthful and accurate. You agree to adhere to Cinedesk Pro platform guidelines and studio safety protocols.
              </div>

              <FormField label="Digital Signature (Full Legal Name)" required>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  placeholder="Type your full legal name as signature"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </FormField>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-black accent-black border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-700">
                  I agree to the contractor terms and conditions.
                </span>
              </label>
            </div>
          )}

          {/* STEP 6: DONE & SUBMIT */}
          {currentStepNum === 6 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Application Ready for Submission</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                All 5 steps have been completed. Click the button below to submit your application for administrative review.
              </p>

              <button
                onClick={handleFinalSubmit}
                disabled={saving}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50 mt-4 cursor-pointer"
              >
                {saving ? 'Submitting Application...' : 'Submit Application Now'}
              </button>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            {currentStepNum > 1 ? (
              <button
                onClick={() => navigate(`/onboarding/${currentStepNum - 1}`)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStepNum < 6 && (
              <button
                onClick={handleNextStep}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Continue'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
