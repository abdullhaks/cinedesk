import React, { useState, useEffect } from 'react';
import { costumeApi } from '../../services/apis/costumeApi';
import { productionApi } from '../../services/apis/productionApi';
import { userApi } from '../../services/apis/userApi';
import type { CostumeItem } from '../../interfaces/costume';
import type { Production } from '../../interfaces/production';
import type { User } from '../../interfaces/user';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Can } from '../../components/auth/Can';
import { PERMISSIONS } from '../../constants/permissions';
import { Shirt, Plus, UserCheck } from 'lucide-react';
import { Modal, message, Input, Select } from 'antd';

export const CostumeList: React.FC = () => {
  const [costumes, setCostumes] = useState<CostumeItem[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter] = useState('');

  // Create Costume Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [prodId, setProdId] = useState('');
  const [category, setCategory] = useState('Period Drama');
  const [size, setSize] = useState('M');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Assign Costume Modal
  const [selectedCostume, setSelectedCostume] = useState<CostumeItem | null>(null);
  const [assignActorUserId, setAssignActorUserId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchCostumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cRes, pRes, uRes] = await Promise.all([
        costumeApi.listCostumes({ status: statusFilter, category: categoryFilter }),
        productionApi.listProductions(),
        userApi.listUsers({ status: 'active' }),
      ]);
      setCostumes(cRes.items || []);
      setProductions(pRes.items || []);
      setActiveUsers(uRes.items || []);
    } catch (err: any) {
      setError('Failed to load wardrobe costumes inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostumes();
  }, [statusFilter, categoryFilter]);

  const handleCreateCostume = async () => {
    if (!name.trim() || !prodId) {
      message.warning('Please enter a costume name and select a production.');
      return;
    }
    setSubmitting(true);
    try {
      await costumeApi.createCostume({
        name: name.trim(),
        productionId: prodId,
        category,
        size,
        notes,
      });
      message.success(`Costume "${name}" created!`);
      setIsCreateOpen(false);
      setName('');
      setNotes('');
      await fetchCostumes();
    } catch (err: any) {
      message.error('Failed to create costume.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignCostume = async () => {
    if (!selectedCostume || !assignActorUserId) {
      message.warning('Please select an actor to assign the costume to.');
      return;
    }
    setAssignLoading(true);
    try {
      await costumeApi.assignCostume(selectedCostume._id, {
        actorUserId: assignActorUserId,
        notes: assignNotes,
      });
      message.success(`Costume assigned to actor!`);
      setSelectedCostume(null);
      setAssignActorUserId('');
      await fetchCostumes();
    } catch (err: any) {
      // Show Availability Guard 409 Conflict error message clearly per acceptance checklist!
      message.error(err.response?.data?.message || 'Costume assignment failed.');
    } finally {
      setAssignLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Costume Name & Category',
      render: (_: any, record: CostumeItem) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Shirt size={18} />
          </div>
          <div>
            <div className="font-bold text-slate-900">{record.name}</div>
            <div className="text-[11px] text-slate-400">{record.category} &bull; Size {record.size}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'production',
      title: 'Film Title',
      render: (_: any, record: CostumeItem) => (
        <span className="text-xs font-semibold text-slate-700">
          {record.production?.title || 'Film Production'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: CostumeItem) => <StatusBadge status={record.status} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: CostumeItem) => (
        <div className="flex items-center gap-2">
          {record.status === 'Available' ? (
            <button
              onClick={() => setSelectedCostume(record)}
              className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <UserCheck size={13} /> Assign to Actor
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
              {record.status}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Wardrobe & Costume Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Costume assets, actor allocations, and return tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="In Cleaning">In Cleaning</option>
            <option value="Damaged">Damaged</option>
          </select>

          <Can permission={PERMISSIONS.COSTUMES_CREATE}>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={16} /> Add Costume
            </button>
          </Can>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} onRetry={fetchCostumes} /> : <DataTable columns={columns} data={costumes} rowKey="_id" />}

      {/* Create Modal */}
      <Modal
        title="Add Costume to Inventory"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateCostume}
        confirmLoading={submitting}
        okText="Add Costume"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Costume Title / Description *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Guard Armor Set #4"
            />
          </div>

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
              <label className="label-caps-grey block mb-1.5">Category</label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <label className="label-caps-grey block mb-1.5">Size</label>
              <Select
                className="w-full"
                value={size}
                onChange={(val) => setSize(val)}
                options={[
                  { value: 'XS', label: 'XS' },
                  { value: 'S', label: 'S' },
                  { value: 'M', label: 'M' },
                  { value: 'L', label: 'L' },
                  { value: 'XL', label: 'XL' },
                  { value: 'Custom', label: 'Custom Fitted' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Notes & Wardrobe Details</label>
            <Input.TextArea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Assign Costume Modal */}
      <Modal
        title={`Assign Costume — ${selectedCostume?.name}`}
        open={!!selectedCostume}
        onCancel={() => setSelectedCostume(null)}
        onOk={handleAssignCostume}
        confirmLoading={assignLoading}
        okText="Confirm Assignment"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Select Actor User *</label>
            <Select
              className="w-full"
              placeholder="Select actor..."
              value={assignActorUserId}
              onChange={(val) => setAssignActorUserId(val)}
              options={activeUsers.map((u) => ({
                value: u.id,
                label: `${u.fullName} (${u.email} - ${u.contractorType || 'Actor'})`,
              }))}
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Assignment Notes / Fitting Instructions</label>
            <Input.TextArea
              rows={2}
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
              placeholder="e.g. Returned for alterations on Tuesday..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
