import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productionApi } from '../../services/apis/productionApi';
import { userApi } from '../../services/apis/userApi';
import type { Production, Character } from '../../interfaces/production';
import type { User } from '../../interfaces/user';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Film, Users, UserCheck, Plus, ArrowLeft, Calendar, Shield, Trash2 } from 'lucide-react';
import { Tabs, Modal, message, Select, Input } from 'antd';

export const ProductionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [production, setProduction] = useState<Production | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isAssignCastOpen, setIsAssignCastOpen] = useState(false);
  const [selectedCastUserId, setSelectedCastUserId] = useState('');

  const [isAssignCrewOpen, setIsAssignCrewOpen] = useState(false);
  const [selectedCrewUserId, setSelectedCrewUserId] = useState('');
  const [crewDept, setCrewDept] = useState('Camera');
  const [crewPos, setCrewPos] = useState('Camera Operator');

  const [isCreateCharacterOpen, setIsCreateCharacterOpen] = useState(false);
  const [charName, setCharName] = useState('');
  const [charDesc, setCharDesc] = useState('');
  const [charCastId, setCharCastId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [prod, chars, usersRes] = await Promise.all([
        productionApi.getProductionById(id),
        productionApi.listCharacters(id),
        userApi.listUsers({ status: 'active' }),
      ]);
      setProduction(prod);
      setCharacters(chars || []);
      setAllUsers(usersRes.items || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load production details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAssignCast = async () => {
    if (!id || !selectedCastUserId) return;
    setSubmitting(true);
    try {
      await productionApi.assignCast(id, selectedCastUserId);
      message.success('Cast member assigned to production!');
      setIsAssignCastOpen(false);
      await fetchDetail();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to assign cast member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCast = async (userId: string) => {
    if (!id) return;
    try {
      await productionApi.removeCast(id, userId);
      message.success('Cast member removed');
      await fetchDetail();
    } catch (err: any) {
      message.error('Failed to remove cast member.');
    }
  };

  const handleAssignCrew = async () => {
    if (!id || !selectedCrewUserId) return;
    setSubmitting(true);
    try {
      await productionApi.assignCrew(id, selectedCrewUserId, crewDept, crewPos);
      message.success('Crew member assigned to production!');
      setIsAssignCrewOpen(false);
      await fetchDetail();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to assign crew member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCharacter = async () => {
    if (!id || !charName.trim()) return;
    setSubmitting(true);
    try {
      await productionApi.createCharacter(id, {
        name: charName.trim(),
        description: charDesc,
        castMember: charCastId || undefined,
      });
      message.success(`Character "${charName}" created!`);
      setIsCreateCharacterOpen(false);
      setCharName('');
      setCharDesc('');
      await fetchDetail();
    } catch (err: any) {
      message.error('Failed to create character.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!production) return null;

  const managerObj = typeof production.productionManager === 'object' ? production.productionManager : null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/productions')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} /> Back to Productions
        </button>
        <StatusBadge status={production.status} />
      </div>

      {/* Production Hero Card */}
      <div className="card-minimal space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{production.title}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">{production.description || 'No logline available.'}</p>
          </div>

          <div className="text-left md:text-right">
            <span className="label-caps-grey">PRODUCTION MANAGER</span>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 md:justify-end mt-1">
              <Shield size={14} className="text-blue-500" />
              <span>{managerObj?.fullName || 'Manager Unassigned'}</span>
            </div>
          </div>
        </div>

        {/* Schedule & Budget Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="label-caps-grey block mb-1">Schedule Range</span>
            <div className="font-semibold text-slate-800 flex items-center gap-1">
              <Calendar size={14} className="text-slate-400" />
              <span>{new Date(production.startDate).toLocaleDateString()} &ndash; {new Date(production.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="label-caps-grey block mb-1">Total Budget</span>
            <div className="font-bold text-slate-900 text-sm">
              ${production.budget?.total?.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="label-caps-grey block mb-1">Cast & Crew Count</span>
            <div className="font-semibold text-slate-800">
              {production.assignedCast?.length || 0} Cast / {production.assignedCrew?.length || 0} Crew
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="card-minimal">
        <Tabs
          items={[
            {
              key: 'cast-crew',
              label: (
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  <Users size={16} /> Cast & Crew Roster
                </span>
              ),
              children: (
                <div className="py-4 space-y-6">
                  {/* Cast Roster */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <UserCheck size={16} className="text-zinc-800" /> Cast Members ({production.assignedCast?.length || 0})
                      </h3>
                      <button
                        onClick={() => setIsAssignCastOpen(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <Plus size={14} /> Assign Cast
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {production.assignedCast?.map((cast: any) => (
                        <div key={cast._id || cast} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-slate-800">{cast.fullName || 'Cast Member'}</div>
                            <div className="text-[10px] text-slate-400">{cast.email}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveCast(cast._id || cast)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            title="Remove from Cast"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {(!production.assignedCast || production.assignedCast.length === 0) && (
                        <div className="text-xs text-slate-400 italic col-span-3 py-2">No cast members assigned yet.</div>
                      )}
                    </div>
                  </div>

                  {/* Crew Roster */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Film size={16} className="text-slate-700" /> Crew Members ({production.assignedCrew?.length || 0})
                      </h3>
                      <button
                        onClick={() => setIsAssignCrewOpen(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        <Plus size={14} /> Assign Crew
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {production.assignedCrew?.map((item: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-slate-800">{item.user?.fullName || 'Crew Member'}</div>
                            <div className="text-[10px] text-slate-500">{item.department} &bull; {item.position}</div>
                          </div>
                        </div>
                      ))}
                      {(!production.assignedCrew || production.assignedCrew.length === 0) && (
                        <div className="text-xs text-slate-400 italic col-span-3 py-2">No crew members assigned yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: 'characters',
              label: (
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  <Film size={16} /> Script Characters
                </span>
              ),
              children: (
                <div className="py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Character Roster ({characters.length})</h3>
                    <button
                      onClick={() => setIsCreateCharacterOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <Plus size={14} /> Add Character
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {characters.map((char) => (
                      <div key={char._id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="font-bold text-sm text-slate-900">{char.name}</div>
                        <div className="text-[11px] text-slate-500">{char.description || 'No description'}</div>
                        <div className="pt-2 text-xs border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-slate-400">Assigned Actor:</span>
                          <span className="font-semibold text-slate-900">
                            {typeof char.castMember === 'object' ? char.castMember?.fullName : 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {characters.length === 0 && (
                      <div className="text-xs text-slate-400 italic col-span-3 py-4 text-center">
                        No script characters created yet.
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Assign Cast Modal */}
      <Modal
        title="Assign Cast Member"
        open={isAssignCastOpen}
        onCancel={() => setIsAssignCastOpen(false)}
        onOk={handleAssignCast}
        confirmLoading={submitting}
        okText="Assign Cast"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Select User to Assign as Cast</label>
            <Select
              className="w-full"
              value={selectedCastUserId}
              onChange={(val) => setSelectedCastUserId(val)}
              options={allUsers.map((u) => ({
                value: u.id,
                label: `${u.fullName} (${u.email} - ${u.contractorType || 'User'})`,
              }))}
            />
          </div>
        </div>
      </Modal>

      {/* Assign Crew Modal */}
      <Modal
        title="Assign Crew Member"
        open={isAssignCrewOpen}
        onCancel={() => setIsAssignCrewOpen(false)}
        onOk={handleAssignCrew}
        confirmLoading={submitting}
        okText="Assign Crew"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Select Crew User</label>
            <Select
              className="w-full"
              value={selectedCrewUserId}
              onChange={(val) => setSelectedCrewUserId(val)}
              options={allUsers.map((u) => ({
                value: u.id,
                label: `${u.fullName} (${u.email})`,
              }))}
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Department</label>
            <Input value={crewDept} onChange={(e) => setCrewDept(e.target.value)} />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Position / Title</label>
            <Input value={crewPos} onChange={(e) => setCrewPos(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Create Character Modal */}
      <Modal
        title="Create Script Character"
        open={isCreateCharacterOpen}
        onCancel={() => setIsCreateCharacterOpen(false)}
        onOk={handleCreateCharacter}
        confirmLoading={submitting}
        okText="Create Character"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Character Name *</label>
            <Input value={charName} onChange={(e) => setCharName(e.target.value)} placeholder="e.g. Paul Atreides" />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Description / Role Notes</label>
            <Input.TextArea rows={2} value={charDesc} onChange={(e) => setCharDesc(e.target.value)} />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Assign to Cast Member (Optional)</label>
            <Select
              className="w-full"
              allowClear
              value={charCastId}
              onChange={(val) => setCharCastId(val)}
              options={production.assignedCast?.map((c: any) => ({
                value: c._id || c,
                label: c.fullName || 'Cast Member',
              }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
