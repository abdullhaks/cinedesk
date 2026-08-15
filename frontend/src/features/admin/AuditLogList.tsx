import React, { useState, useEffect } from 'react';
import { auditLogApi } from '../../services/apis/auditLogApi';
import type { AuditLogItem } from '../../interfaces/auditLog';
import { DataTable } from '../../components/common/DataTable';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { ShieldCheck, Search, Calendar, Database } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export const AuditLogList: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [entityFilter, setEntityFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditLogApi.listLogs({ search: debouncedSearch, targetEntity: entityFilter });
      setLogs(res.items || []);
    } catch (err: any) {
      setError('Failed to load system audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [debouncedSearch, entityFilter]);

  const columns = [
    {
      key: 'timestamp',
      title: 'Timestamp',
      render: (_: any, record: AuditLogItem) => (
        <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span>{new Date(record.timestamp || record.createdAt).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'actor',
      title: 'Actor',
      render: (_: any, record: AuditLogItem) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
            {record.actor?.fullName ? record.actor.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="font-bold text-xs text-slate-800">{record.actor?.fullName || 'System / Admin'}</div>
            <div className="text-[10px] text-slate-400">{record.actor?.email || ''}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Action Event',
      render: (_: any, record: AuditLogItem) => (
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-mono">
          {record.action}
        </span>
      ),
    },
    {
      key: 'targetEntity',
      title: 'Target Entity',
      render: (_: any, record: AuditLogItem) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <Database size={13} className="text-slate-400" />
          <span>{record.targetEntity} ({record.targetId ? String(record.targetId).substring(0, 8) + '...' : 'N/A'})</span>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      title: 'IP Address',
      render: (_: any, record: AuditLogItem) => (
        <span className="text-[11px] font-mono text-slate-400">
          {record.ipAddress || '127.0.0.1'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck size={24} className="text-slate-900" />
            System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system event logs, administrative approvals, and permission change history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action event..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Entities</option>
            <option value="OnboardingApplication">OnboardingApplication</option>
            <option value="FundRequest">FundRequest</option>
            <option value="Location">Location</option>
            <option value="Costume">Costume</option>
            <option value="User">User</option>
            <option value="Role">Role</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSkeleton rows={6} /> : error ? <ErrorState message={error} onRetry={fetchLogs} /> : <DataTable columns={columns} data={logs} rowKey="_id" />}
    </div>
  );
};
