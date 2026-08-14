import React, { useState, useEffect } from 'react';
import { onboardingApi } from '../../services/apis/onboardingApi';
import type { OnboardingApplication } from '../../interfaces/onboarding';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { ClipboardCheck, Eye, CheckCircle2, XCircle, AlertTriangle, Download, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Modal, Drawer, message, Input, Image } from 'antd';
import { useNavigate } from 'react-router-dom';

export const OnboardingReview: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('pending_review');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Selected for Drawer Detail
  const [selectedApp, setSelectedApp] = useState<OnboardingApplication | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Review Modal State
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request_changes' | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await onboardingApi.listApplications({
        status: statusFilter,
        contractorType: typeFilter,
      });
      setApplications(res.items || []);
    } catch (err: any) {
      setError('Failed to fetch onboarding applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, typeFilter]);

  const handleOpenReview = (action: 'approve' | 'reject' | 'request_changes') => {
    setReviewAction(action);
    setReviewComments('');
    setRejectionReason('');
  };

  const handleConfirmReview = async () => {
    if (!selectedApp || !reviewAction) return;
    setSubmittingReview(true);

    try {
      await onboardingApi.reviewApplication(
        selectedApp._id,
        reviewAction,
        reviewComments,
        rejectionReason
      );

      message.success(`Application ${reviewAction === 'request_changes' ? 'changes requested' : reviewAction + 'd'} successfully!`);
      setReviewAction(null);
      setSelectedApp(null);
      await fetchApplications();

      if (reviewAction === 'approve') {
        Modal.confirm({
          title: 'User Approved!',
          content: 'The user account is now ACTIVE. Would you like to navigate to User Management to assign a Role?',
          okText: 'Assign Role Now',
          cancelText: 'Later',
          onOk: () => navigate('/admin/users'),
        });
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to submit review action.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isImageFile = (url?: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg|bmp)(\?.*)?$/i.test(url) || url.includes('/image/upload/');
  };

  const handleDownload = async (url: string, fileName?: string) => {
    try {
      message.loading({ content: 'Downloading document...', key: 'doc_download', duration: 1.5 });
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const name = fileName || url.split('/').pop()?.split('?')[0] || 'document';
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      message.success({ content: 'Download started', key: 'doc_download', duration: 1.5 });
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columns = [
    {
      key: 'applicant',
      title: 'Applicant Name',
      render: (_: any, record: OnboardingApplication) => {
        const applicantObj = typeof record.applicant === 'object' ? record.applicant : null;
        return (
          <div>
            <div className="font-bold text-slate-800">{applicantObj?.fullName || 'Applicant User'}</div>
            <div className="text-[11px] text-slate-400">{applicantObj?.email || ''}</div>
          </div>
        );
      },
    },
    {
      key: 'contractorType',
      title: 'Contractor Type',
      render: (_: any, record: OnboardingApplication) => (
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
          {record.contractorType}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: OnboardingApplication) => <StatusBadge status={record.status} />,
    },
    {
      key: 'submittedAt',
      title: 'Submitted Date',
      render: (_: any, record: OnboardingApplication) => (
        <span className="text-xs text-slate-500">
          {record.submittedAt ? new Date(record.submittedAt).toLocaleDateString() : 'Draft'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: OnboardingApplication) => (
        <button
          onClick={() => setSelectedApp(record)}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Eye size={14} /> Review Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Onboarding Approvals Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review contractor onboarding submissions, verify credentials, and approve access
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="rejected">Rejected</option>
            <option value="">All Statuses</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Contractor Types</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Cast">Cast</option>
            <option value="Supplier">Supplier</option>
            <option value="Cast-Crew Agent">Cast-Crew Agent</option>
            <option value="TCS Team">TCS Team</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} onRetry={fetchApplications} /> : <DataTable columns={columns} data={applications} rowKey="_id" />}

      {/* Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-base font-bold text-slate-800">
            <ClipboardCheck size={20} className="text-blue-600" />
            <span>Onboarding Inspection — {selectedApp?.contractorType}</span>
          </div>
        }
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        width={640}
        extra={
          selectedApp?.status === 'pending_review' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenReview('approve')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <CheckCircle2 size={14} /> Approve
              </button>
              <button
                onClick={() => handleOpenReview('request_changes')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <AlertTriangle size={14} /> Request Changes
              </button>
              <button
                onClick={() => handleOpenReview('reject')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          )
        }
      >
        {selectedApp && (
          <div className="space-y-6 text-xs">
            {/* Header info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="label-caps-grey">CONTRACTOR STATUS</span>
                <div className="mt-1">
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="label-caps-grey">CONTRACTOR TYPE</span>
                <div className="font-bold text-slate-800 text-sm mt-1">{selectedApp.contractorType}</div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-2">
              <span className="label-caps-grey block text-slate-400">Step 2: Personal Information</span>
              <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">Full Name:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.yourInformation?.name || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.yourInformation?.contact || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Department:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.yourInformation?.department || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Position / Specialty:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.yourInformation?.position || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-2">
              <span className="label-caps-grey block text-slate-400">Step 3: Financial Details</span>
              <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">Payment Type:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.financial?.paymentType || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400">Tax Info / SSN:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.financial?.taxInfo || 'N/A'}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Bank Details:</span>
                  <div className="font-semibold text-slate-800">{selectedApp.steps?.financial?.bankDetails || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Documents attached */}
            <div className="space-y-2">
              <span className="label-caps-grey block text-slate-400">Step 4: Uploaded Documents</span>
              <div className="space-y-2.5">
                {selectedApp.steps?.documents?.length ? (
                  selectedApp.steps.documents.map((doc, idx) => {
                    const isImg = isImageFile(doc.fileUrl);
                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isImg ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {isImg ? <ImageIcon size={18} /> : <FileText size={18} />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 text-xs truncate">
                              {doc.type ? doc.type.replace(/_/g, ' ') : `Document #${idx + 1}`}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-medium text-slate-500">{isImg ? 'Image File' : 'Document / PDF'}</span>
                              {doc.uploadedAt && (
                                <span>• {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {isImg ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(doc.fileUrl)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition-colors border border-blue-200/60 cursor-pointer"
                              >
                                <Eye size={13} /> View
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownload(doc.fileUrl, `${doc.type || 'document'}.png`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 cursor-pointer"
                              >
                                <Download size={13} /> Download
                              </button>
                            </>
                          ) : (
                            <>
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg transition-colors border border-blue-200/60"
                              >
                                <ExternalLink size={13} /> View
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDownload(doc.fileUrl, `${doc.type || 'document'}.pdf`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 cursor-pointer"
                              >
                                <Download size={13} /> Download
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-slate-400 italic bg-white p-3 rounded-xl border border-slate-200">
                    No documents attached
                  </div>
                )}
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <span className="label-caps-grey block text-slate-400">Step 5: Digital Signature</span>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400">Signature Text:</span>
                <div className="font-bold text-slate-900 text-sm italic">{selectedApp.steps?.sign?.signatureText || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Action Confirmation Modal */}
      <Modal
        title={`Review Action: ${reviewAction?.toUpperCase().replace('_', ' ')}`}
        open={!!reviewAction}
        onCancel={() => setReviewAction(null)}
        onOk={handleConfirmReview}
        confirmLoading={submittingReview}
        okText="Submit Decision"
      >
        <div className="py-4 space-y-4">
          {reviewAction === 'request_changes' && (
            <div>
              <label className="label-caps-grey block mb-1.5">Reviewer Comments / Required Changes</label>
              <Input.TextArea
                rows={4}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Explain what changes or documents the contractor needs to re-submit..."
              />
            </div>
          )}

          {reviewAction === 'reject' && (
            <div>
              <label className="label-caps-grey block mb-1.5">Rejection Reason</label>
              <Input.TextArea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State the reason for declining this application..."
              />
            </div>
          )}

          {reviewAction === 'approve' && (
            <p className="text-sm text-slate-600">
              Approving this application will transition the contractor's status to <strong>ACTIVE</strong>. (Note: Role assignment is done separately from the User Management menu per security policy).
            </p>
          )}
        </div>
      </Modal>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="hidden">
          <Image
            preview={{
              visible: !!previewImage,
              src: previewImage,
              onVisibleChange: (value) => {
                if (!value) setPreviewImage(null);
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
