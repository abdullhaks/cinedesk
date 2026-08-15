import React, { useState, useEffect } from 'react';
import { fundRequestApi } from '../../services/apis/fundRequestApi';
import { productionApi } from '../../services/apis/productionApi';
import { useAuthStore } from '../../zustand/authStore';
import type { FundRequestItem } from '../../interfaces/fundRequest';
import type { Production } from '../../interfaces/production';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Can } from '../../components/auth/Can';
import { PERMISSIONS } from '../../constants/permissions';
import { DollarSign, Plus, CheckCircle2, XCircle, Eye, ShieldAlert, CreditCard } from 'lucide-react';
import { Modal, Drawer, message, Input, Select } from 'antd';

export const FundRequestList: React.FC = () => {
  const { user: currentUser } = useAuthStore();

  const [requests, setRequests] = useState<FundRequestItem[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter] = useState('');

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [prodId, setProdId] = useState('');
  const [amount, setAmount] = useState<number>(1500);
  const [category, setCategory] = useState('Equipment / Gear');
  const [justification, setJustification] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Detail / Approval Drawer
  const [selectedReq, setSelectedReq] = useState<FundRequestItem | null>(null);
  const [actionComments, setActionComments] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqsRes = await fundRequestApi.listRequests({ status: statusFilter, category: categoryFilter });
      setRequests(reqsRes.items || []);
    } catch (err: any) {
      setError('Failed to load fund requests.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductions = async () => {
    try {
      const prodsRes = await productionApi.listProductions();
      setProductions(prodsRes.items || []);
    } catch {
      // Graceful fallback if user role does not have productions.view permission
      setProductions([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleCreateRequest = async () => {
    if (!prodId || !amount || amount <= 0) {
      message.warning('Please select a production and enter a valid amount.');
      return;
    }
    setSubmitting(true);
    try {
      await fundRequestApi.createRequest({
        productionId: prodId,
        amount: Number(amount),
        category,
        justification,
      });
      message.success('Fund request submitted successfully!');
      setIsCreateOpen(false);
      setProdId('');
      setJustification('');
      await fetchRequests();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to submit fund request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await fundRequestApi.approveRequest(selectedReq._id, actionComments);
      message.success('Fund request approved!');
      setSelectedReq(null);
      await fetchRequests();
    } catch (err: any) {
      // Show self-approval prohibition 403 error message clearly per acceptance checklist!
      message.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await fundRequestApi.rejectRequest(selectedReq._id, actionComments);
      message.success('Fund request rejected');
      setSelectedReq(null);
      await fetchRequests();
    } catch (err: any) {
      message.error('Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisburse = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await fundRequestApi.disburseRequest(selectedReq._id);
      message.success('Funds disbursed to requester!');
      setSelectedReq(null);
      await fetchRequests();
    } catch (err: any) {
      message.error('Disbursement failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const isSelfRequest = selectedReq && currentUser && ((selectedReq.requester as any)?._id || selectedReq.requester?.id) === currentUser.id;

  const columns = [
    {
      key: 'production',
      title: 'Film Title',
      render: (_: any, record: FundRequestItem) => (
        <div>
          <div className="font-bold text-slate-900">{record.production?.title || 'Film Title'}</div>
          <div className="text-[11px] text-slate-400">{record.category}</div>
        </div>
      ),
    },
    {
      key: 'requester',
      title: 'Requester',
      render: (_: any, record: FundRequestItem) => (
        <span className="text-xs font-semibold text-slate-700">
          {record.requester?.fullName || 'Requester'}
        </span>
      ),
    },
    {
      key: 'amount',
      title: 'Requested Amount',
      render: (_: any, record: FundRequestItem) => (
        <div className="text-xs font-bold text-slate-900">
          ${record.amount?.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: FundRequestItem) => <StatusBadge status={record.status} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: FundRequestItem) => (
        <button
          onClick={() => setSelectedReq(record)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-black bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Eye size={13} /> View Request
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
            Production Fund Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Budget drawdown requests, department expense approvals, and disbursements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </select>

          <Can permission={PERMISSIONS.FUNDS_REQUEST}>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={16} /> Request Funds
            </button>
          </Can>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} onRetry={fetchRequests} /> : <DataTable columns={columns} data={requests} rowKey="_id" />}

      {/* Create Modal */}
      <Modal
        title="Submit Fund Request"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateRequest}
        confirmLoading={submitting}
        okText="Submit Request"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Production Film Title *</label>
            <Select
              className="w-full"
              placeholder="Select production..."
              value={prodId}
              onChange={(val) => setProdId(val)}
              options={productions.map((p) => ({
                value: p._id,
                label: p.title,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-caps-grey block mb-1.5">Amount ($) *</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-caps-grey block mb-1.5">Category *</label>
              <Select
                className="w-full"
                value={category}
                onChange={(val) => setCategory(val)}
                options={[
                  { value: 'Equipment / Gear', label: 'Equipment / Gear' },
                  { value: 'Location Catering', label: 'Location Catering' },
                  { value: 'Costume & Wardrobe', label: 'Costume & Wardrobe' },
                  { value: 'Travel & Transport', label: 'Travel & Transport' },
                  { value: 'Miscellaneous', label: 'Miscellaneous' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Justification / Reason</label>
            <Input.TextArea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Detail why these funds are needed for production..."
            />
          </div>
        </div>
      </Modal>

      {/* Detail / Approval Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
            <DollarSign size={20} className="text-emerald-600" />
            <span>Fund Request Detail — ${selectedReq?.amount?.toLocaleString()}</span>
          </div>
        }
        open={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        width={540}
      >
        {selectedReq && (
          <div className="space-y-6 text-xs">
            {/* Self-Approval Warning Guard Alert */}
            {isSelfRequest && selectedReq.status === 'Submitted' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800">
                <ShieldAlert size={18} className="shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <div className="font-bold">Self-Approval Prohibition Warning</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    You created this fund request. According to platform policy, Finance Managers are strictly forbidden from approving their own fund requests (HTTP 403).
                  </div>
                </div>
              </div>
            )}

            {/* Request Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="label-caps-grey">REQUEST STATUS</span>
                <StatusBadge status={selectedReq.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400">Film Production:</span>
                  <div className="font-bold text-slate-800">{selectedReq.production?.title}</div>
                </div>
                <div>
                  <span className="text-slate-400">Category:</span>
                  <div className="font-bold text-slate-800">{selectedReq.category}</div>
                </div>
                <div>
                  <span className="text-slate-400">Requester:</span>
                  <div className="font-bold text-slate-800">{selectedReq.requester?.fullName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Amount Requested:</span>
                  <div className="font-bold text-emerald-600 text-sm">${selectedReq.amount?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Justification */}
            <div className="space-y-1">
              <span className="label-caps-grey block text-slate-400">JUSTIFICATION</span>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700">
                {selectedReq.justification || 'No justification text provided.'}
              </div>
            </div>

            {/* Approval Controls */}
            {selectedReq.status === 'Submitted' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Approval Decision Panel
                </h3>

                <Input.TextArea
                  rows={2}
                  value={actionComments}
                  onChange={(e) => setActionComments(e.target.value)}
                  placeholder="Optional review notes / comments..."
                />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 size={16} /> Approve Request
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <XCircle size={16} /> Reject Request
                  </button>
                </div>
              </div>
            )}

            {/* Disbursement Control if Approved */}
            {selectedReq.status === 'Approved' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <h3 className="font-bold text-emerald-900 text-xs">Ready for Payment Disbursement</h3>
                <p className="text-[11px] text-emerald-700">
                  This request has been approved by {selectedReq.approver?.fullName || 'Finance Admin'}.
                </p>
                <button
                  onClick={handleDisburse}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <CreditCard size={16} /> Disburse & Pay Funds
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
