import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../zustand/authStore';
import { usePermission } from '../../hooks/usePermission';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { PERMISSIONS } from '../../constants/permissions';
import { dashboardApi, type DashboardStatsResponse } from '../../services/apis/dashboardApi';
import { Film, DollarSign, MapPin, Shirt, ShieldCheck, Calendar, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { hasPermission } = usePermission();

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSuperAdmin = (user?.role as any)?.slug === 'super_admin' || user?.role?.name === 'Super Admin';

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err: any) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.fullName || 'User'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Role: <span className="font-semibold text-slate-700">{user?.role?.name || 'Guest'}</span> — Overview & Analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={user?.status || 'active'} />
        </div>
      </div>

      {/* Dynamic Top Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Active Productions"
          value={stats ? String(stats.activeProductionsCount) : '0'}
          subtitle="Real-time production count from DB"
          icon={<Film size={18} />}
        />

        {hasPermission(PERMISSIONS.FUNDS_VIEW) ? (
          <StatCard
            label="Total Fund Requested"
            value={stats ? formatCurrency(stats.totalFundRequestedAmount) : '$0'}
            subtitle={
              stats
                ? `Approved: ${formatCurrency(stats.totalFundApprovedAmount)} (${stats.approvedPercentage}%)`
                : 'Approved: $0'
            }
            icon={<DollarSign size={18} />}
          />
        ) : (
          <StatCard
            label="Assigned Characters"
            value={stats ? String(stats.assignedCharactersCount) : '0'}
            subtitle="Current Production Assignments"
            icon={<Film size={18} />}
          />
        )}

        {hasPermission(PERMISSIONS.LOCATIONS_VIEW) ? (
          <StatCard
            label="Booked Locations"
            value={stats ? String(stats.bookedLocationsCount) : '0'}
            subtitle="Shooting locations registered"
            icon={<MapPin size={18} />}
          />
        ) : (
          <StatCard
            label="My Call Times"
            value="07:30 AM"
            subtitle="Stage 4 Studio Call Time"
            icon={<Clock size={18} />}
          />
        )}

        {hasPermission(PERMISSIONS.COSTUMES_VIEW) ? (
          <StatCard
            label="Costume Inventory"
            value={stats ? String(stats.costumeInventoryCount) : '0'}
            subtitle={stats ? `${stats.assignedCostumesCount} currently assigned` : '0 assigned'}
            icon={<Shirt size={18} />}
          />
        ) : (
          <StatCard
            label="Costumes Assigned"
            value={stats ? `${stats.assignedCostumesCount} Items` : '0 Items'}
            subtitle="Status: Wardrobe Inventory"
            icon={<Shirt size={18} />}
          />
        )}
      </div>

      {/* Asymmetric Middle Grid: Main Feature Widget + Side Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart / Analytics Card (2 cols) */}
        <div className="card-minimal lg:col-span-2 flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="label-caps-grey">PRODUCTION BUDGET ALLOCATION</span>
              <h3 className="text-lg font-bold text-slate-800 mt-1 mb-0">Monthly Expenditure Trend</h3>
            </div>
            <div className="text-xs text-slate-500 font-medium">FY 2026</div>
          </div>

          {/* Minimalist Bar Visualization calculated from DB requests */}
          <div className="flex items-end justify-between h-48 gap-4 px-4 pt-6 border-b border-slate-100">
            {(stats?.monthlyExpenses || []).map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.label}
                </span>
                <div
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                    bar.primary ? 'bg-slate-900 shadow-md' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  style={{ height: `${bar.val}%` }}
                />
                <span className="text-xs text-slate-500 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" /> Dynamic Budget Breakdown
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Database Aggregates
              </span>
            </div>
            <span className="font-semibold text-emerald-600">Live Database Feed</span>
          </div>
        </div>

        {/* Side Panel: Role-Varying Activity / Actions */}
        <div className="card-minimal flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="label-caps-grey">
                {isSuperAdmin ? 'ADMINISTRATIVE OVERVIEW' : 'MY SCHEDULE & TASKS'}
              </span>
              <ShieldCheck size={16} className="text-blue-500" />
            </div>

            <div className="space-y-4">
              {isSuperAdmin ? (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Pending Onboardings</div>
                      <div className="text-[11px] text-slate-500">
                        {stats?.pendingOnboardingsCount || 0} applications awaiting review
                      </div>
                    </div>
                    <StatusBadge
                      status="pending_review"
                      label={`${stats?.pendingOnboardingsCount || 0} Pending`}
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Fund Approvals</div>
                      <div className="text-[11px] text-slate-500">
                        {stats?.pendingFundRequestsCount || 0} requests pending sign-off
                      </div>
                    </div>
                    <StatusBadge
                      status="Under Review"
                      label={`${stats?.pendingFundRequestsCount || 0} Requests`}
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">System Roles</div>
                      <div className="text-[11px] text-slate-500">
                        {stats?.activeRolesCount || 0} active roles configured
                      </div>
                    </div>
                    <StatusBadge
                      status="active"
                      label={`${stats?.activeRolesCount || 0} Roles`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Costume Fitting Session</div>
                      <div className="text-[11px] text-slate-500">Scheduled Call</div>
                    </div>
                    <Calendar size={16} className="text-blue-500" />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Script Reading Session</div>
                      <div className="text-[11px] text-slate-500">Production Rehearsal</div>
                    </div>
                    <Calendar size={16} className="text-slate-400" />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <span className="text-xs font-bold text-slate-900 hover:text-black cursor-pointer">
              View Detailed Analytics &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
