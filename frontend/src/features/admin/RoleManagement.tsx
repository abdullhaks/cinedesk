import React, { useState, useEffect } from 'react';
import { roleApi } from '../../services/apis/roleApi';
import type { Role, Permission } from '../../interfaces/user';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Shield, Edit2, Plus, Check } from 'lucide-react';
import { Modal, message } from 'antd';

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermKeys, setSelectedPermKeys] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Create Role State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [createPermKeys, setCreatePermKeys] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesData, permsData] = await Promise.all([
        roleApi.listRoles(),
        roleApi.listPermissions(),
      ]);
      setRoles(rolesData);
      setAllPermissions(permsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roles and permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    const currentKeys = (role.permissions || []).map((p: any) =>
      typeof p === 'object' && p.key ? p.key : p.toString()
    );
    setSelectedPermKeys(currentKeys);
  };

  const handleTogglePerm = (key: string) => {
    if (selectedPermKeys.includes(key)) {
      setSelectedPermKeys(selectedPermKeys.filter((k) => k !== key));
    } else {
      setSelectedPermKeys([...selectedPermKeys, key]);
    }
  };

  const handleSavePermissions = async () => {
    if (!editingRole) return;
    setSaving(true);
    try {
      await roleApi.updatePermissions(editingRole._id, selectedPermKeys);
      message.success(`Updated permissions for role: ${editingRole.name}`);
      setEditingRole(null);
      await fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to update permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      message.warning('Please enter a role name');
      return;
    }
    setSaving(true);
    try {
      await roleApi.createRole(newRoleName.trim(), createPermKeys);
      message.success(`Created custom role: ${newRoleName}`);
      setIsCreateOpen(false);
      setNewRoleName('');
      setCreatePermKeys([]);
      await fetchData();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to create role.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  // Group permissions by module for the checkbox matrix
  const permsByModule: Record<string, Permission[]> = {};
  allPermissions.forEach((p) => {
    if (!permsByModule[p.module]) {
      permsByModule[p.module] = [];
    }
    permsByModule[p.module].push(p);
  });

  const columns = [
    {
      key: 'name',
      title: 'Role Name',
      render: (_: any, record: Role) => (
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-blue-500" />
          <span className="font-semibold text-slate-800">{record.name}</span>
        </div>
      ),
    },
    {
      key: 'slug',
      title: 'Slug Identifier',
      render: (_: any, record: Role) => (
        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
          {record.slug}
        </code>
      ),
    },
    {
      key: 'type',
      title: 'Role Type',
      render: (_: any, record: Role) => (
        <StatusBadge
          status={record.isSystemRole ? 'active' : 'draft'}
          label={record.isSystemRole ? 'System Role' : 'Custom Role'}
        />
      ),
    },
    {
      key: 'permissions',
      title: 'Assigned Permissions',
      render: (_: any, record: Role) => {
        const count = record.permissions?.length || 0;
        return (
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {count} permissions
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: Role) => (
        <button
          onClick={() => handleOpenEdit(record)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-black bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Edit2 size={13} />
          <span>Edit Permissions</span>
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
            Roles & Permissions Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system roles and fine-grained permission capabilities
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Role Table */}
      <DataTable columns={columns} data={roles} rowKey="_id" />

      {/* Edit Permissions Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Shield size={18} className="text-zinc-800" />
            <span>Manage Permissions — {editingRole?.name}</span>
          </div>
        }
        open={!!editingRole}
        onCancel={() => setEditingRole(null)}
        onOk={handleSavePermissions}
        confirmLoading={saving}
        okText="Save Permissions"
        width={720}
      >
        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(permsByModule).map(([moduleName, perms]) => (
            <div key={moduleName} className="border-b border-slate-100 pb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Module: {moduleName}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {perms.map((p) => {
                  const isChecked = selectedPermKeys.includes(p.key) || selectedPermKeys.includes('*');
                  return (
                    <label
                      key={p.key}
                      onClick={() => handleTogglePerm(p.key)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-slate-100 border-zinc-400 text-slate-900 font-medium'
                          : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                          isChecked ? 'bg-black border-black text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check size={12} />}
                      </div>
                      <div>
                        <div className="font-semibold">{p.key}</div>
                        <div className="text-[10px] text-slate-500 opacity-80">{p.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Create Role Modal */}
      <Modal
        title="Create Custom Role"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateRole}
        confirmLoading={saving}
        okText="Create Role"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Role Name</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="e.g. Set Assistant Manager"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Select Initial Permissions ({createPermKeys.length} selected)</label>
            <div className="max-h-48 overflow-y-auto space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {allPermissions.map((p) => {
                const isSelected = createPermKeys.includes(p.key);
                return (
                  <div
                    key={p.key}
                    onClick={() => {
                      if (isSelected) {
                        setCreatePermKeys(createPermKeys.filter((k) => k !== p.key));
                      } else {
                        setCreatePermKeys([...createPermKeys, p.key]);
                      }
                    }}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded cursor-pointer hover:bg-slate-200/60"
                  >
                    <span className="font-medium text-slate-700">{p.key}</span>
                    {isSelected && <Check size={14} className="text-black" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
