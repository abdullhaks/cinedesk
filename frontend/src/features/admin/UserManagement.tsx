import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/apis/userApi';
import { roleApi } from '../../services/apis/roleApi';
import type { User, Role } from '../../interfaces/user';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Shield, UserX, Search } from 'lucide-react';
import { Modal, message, Select } from 'antd';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Assign Role Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userApi.listUsers({ search, status: statusFilter }),
        roleApi.listRoles(),
      ]);
      setUsers(usersRes.items || []);
      setRoles(rolesRes || []);
    } catch (err: any) {
      setError('Failed to fetch users and system roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleOpenAssignRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRoleId(user.role?.id || '');
  };

  const handleConfirmRoleAssign = async () => {
    if (!selectedUser || !selectedRoleId) {
      message.warning('Please select a role to assign');
      return;
    }
    setSubmitting(true);
    try {
      await userApi.assignRole(selectedUser.id, selectedRoleId);
      message.success(`Assigned new role to ${selectedUser.fullName}!`);
      setSelectedUser(null);
      await fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to assign role');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (user: User) => {
    Modal.confirm({
      title: `Deactivate ${user.fullName}?`,
      content: 'This user will immediately be blocked from logging into the platform (returns HTTP 403).',
      okText: 'Deactivate User',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await userApi.deactivateUser(user.id);
          message.success(`User ${user.fullName} has been deactivated.`);
          await fetchData();
        } catch (err: any) {
          message.error('Failed to deactivate user.');
        }
      },
    });
  };

  const columns = [
    {
      key: 'name',
      title: 'User Profile',
      render: (_: any, record: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
            {record.fullName ? record.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-bold text-slate-800">{record.fullName}</div>
            <div className="text-[11px] text-slate-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contractorType',
      title: 'Contractor Type',
      render: (_: any, record: User) => (
        <span className="text-xs font-semibold text-slate-600">
          {record.contractorType || 'N/A'}
        </span>
      ),
    },
    {
      key: 'role',
      title: 'System Role',
      render: (_: any, record: User) => (
        <div className="flex items-center gap-1.5">
          <Shield size={14} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-800">
            {record.role?.name || 'No Role Assigned'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Account Status',
      render: (_: any, record: User) => <StatusBadge status={record.status} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAssignRole(record)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Shield size={13} /> Assign Role
          </button>
          {record.status !== 'deactivated' && (
            <button
              onClick={() => handleDeactivate(record)}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Deactivate Account"
            >
              <UserX size={13} />
            </button>
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
            User Accounts & Role Assignment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage system users, assign RBAC roles, and control access status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              placeholder="Search user email or name..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_onboarding">Pending Onboarding</option>
            <option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} onRetry={fetchData} /> : <DataTable columns={columns} data={users} rowKey="id" />}

      {/* Assign Role Modal */}
      <Modal
        title={`Assign Role — ${selectedUser?.fullName}`}
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        onOk={handleConfirmRoleAssign}
        confirmLoading={submitting}
        okText="Assign Role"
      >
        <div className="py-4 space-y-4">
          <p className="text-xs text-slate-500">
            Select a system role to grant specific RBAC permissions to this user account:
          </p>

          <div>
            <label className="label-caps-grey block mb-1.5">Select Role</label>
            <Select
              className="w-full"
              value={selectedRoleId}
              onChange={(val) => setSelectedRoleId(val)}
              options={roles.map((r) => ({
                value: r._id || r.id,
                label: `${r.name} (${r.permissions?.length || 0} permissions)`,
              }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
