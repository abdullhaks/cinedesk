import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productionApi } from '../../services/apis/productionApi';
import type { Production } from '../../interfaces/production';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Can } from '../../components/auth/Can';
import { PERMISSIONS } from '../../constants/permissions';
import { Film, Plus, Calendar, ArrowRight } from 'lucide-react';
import { Modal, message, Input, DatePicker } from 'antd';

export const ProductionList: React.FC = () => {
  const navigate = useNavigate();
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBudget, setNewBudget] = useState(500000);
  const [newDates, setNewDates] = useState<[any, any] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProductions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productionApi.listProductions();
      setProductions(res.items || []);
    } catch (err: any) {
      setError('Failed to load film productions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleCreateProduction = async () => {
    if (!newTitle.trim() || !newDates) {
      message.warning('Please enter a title and select start/end dates.');
      return;
    }
    setSubmitting(true);
    try {
      await productionApi.createProduction({
        title: newTitle.trim(),
        description: newDesc,
        budgetTotal: newBudget,
        startDate: newDates[0].toISOString(),
        endDate: newDates[1].toISOString(),
      });
      message.success(`Production "${newTitle}" created!`);
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      await fetchProductions();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to create production.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'title',
      title: 'Production Title',
      render: (_: any, record: Production) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Film size={18} />
          </div>
          <div>
            <div className="font-bold text-slate-900">{record.title}</div>
            <div className="text-[11px] text-slate-400 truncate max-w-xs">{record.description || 'No description'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Phase Status',
      render: (_: any, record: Production) => <StatusBadge status={record.status} />,
    },
    {
      key: 'dates',
      title: 'Production Dates',
      render: (_: any, record: Production) => (
        <div className="text-xs text-slate-600 flex items-center gap-1">
          <Calendar size={14} className="text-slate-400" />
          <span>{new Date(record.startDate).toLocaleDateString()} &ndash; {new Date(record.endDate).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: 'budget',
      title: 'Budget (Total / Spent)',
      render: (_: any, record: Production) => (
        <div className="text-xs font-semibold text-slate-800">
          ${record.budget?.total?.toLocaleString()} <span className="text-slate-400 font-normal">(${record.budget?.spent?.toLocaleString() || 0} spent)</span>
        </div>
      ),
    },
    {
      key: 'castCrewCount',
      title: 'Cast & Crew',
      render: (_: any, record: Production) => {
        const castCount = record.assignedCast?.length || 0;
        const crewCount = record.assignedCrew?.length || 0;
        return (
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {castCount} Cast / {crewCount} Crew
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Production) => (
        <button
          onClick={() => navigate(`/productions/${record._id}`)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>View Details</span> <ArrowRight size={13} />
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
            Film Productions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active film titles, schedule timelines, and cast/crew allocations
          </p>
        </div>

        <Can permission={PERMISSIONS.PRODUCTIONS_CREATE}>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus size={16} />
            <span>Create Production</span>
          </button>
        </Can>
      </div>

      {/* Production Table */}
      {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} onRetry={fetchProductions} /> : <DataTable columns={columns} data={productions} rowKey="_id" onRowClick={(rec) => navigate(`/productions/${rec._id}`)} />}

      {/* Create Modal */}
      <Modal
        title="Create New Production"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateProduction}
        confirmLoading={submitting}
        okText="Create Production"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Production Title *</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Dune III: Desert Reckoning"
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Description</label>
            <Input.TextArea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Synopsis / Logline..."
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Total Allocated Budget ($)</label>
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Production Schedule Range *</label>
            <DatePicker.RangePicker
              className="w-full"
              onChange={(dates) => setNewDates(dates as any)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
