import React from 'react';
import { Inbox, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  action,
}) => {
  return (
    <div className="card-minimal flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Inbox size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading data.',
  onRetry,
}) => {
  return (
    <div className="card-minimal flex flex-col items-center justify-center text-center py-12 px-6 border border-rose-100 bg-rose-50/20">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="card-minimal animate-pulse space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/4 mb-6" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 bg-slate-200 rounded flex-1" />
          <div className="h-10 bg-slate-200 rounded w-24" />
        </div>
      ))}
    </div>
  );
};
