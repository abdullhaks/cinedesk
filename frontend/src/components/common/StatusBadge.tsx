import React from 'react';

export type StatusType =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested'
  | 'active'
  | 'deactivated'
  | 'pending_onboarding'
  | 'Requested'
  | 'Under Review'
  | 'Approved'
  | 'Booked'
  | 'Completed'
  | 'Draft'
  | 'Submitted'
  | 'Paid'
  | 'Available'
  | 'Reserved'
  | 'Assigned'
  | 'Damaged'
  | 'Maintenance'
  | 'Lost';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700'; // fallback grey

  if (['approved', 'active', 'booked', 'completed', 'paid', 'available'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  } else if (['pending_review', 'under review', 'submitted', 'reserved', 'assigned'].includes(normalized)) {
    colorClasses = 'bg-blue-50 text-blue-700 border border-blue-200';
  } else if (['rejected', 'deactivated', 'damaged', 'lost'].includes(normalized)) {
    colorClasses = 'bg-rose-50 text-rose-700 border border-rose-200';
  } else if (['draft', 'requested', 'changes_requested', 'pending_onboarding', 'maintenance'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  const displayLabel = label || status.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {displayLabel}
    </span>
  );
};
