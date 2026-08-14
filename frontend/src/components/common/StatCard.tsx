import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  delta,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`card-minimal flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <span className="label-caps-grey">{label}</span>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-3 my-1">
        <div className="numeral-hero">{value}</div>
        {delta && (
          <div
            className={
              delta.type === 'positive'
                ? 'badge-delta-positive'
                : delta.type === 'negative'
                ? 'badge-delta-negative'
                : 'badge-delta-neutral'
            }
          >
            {delta.type === 'positive' && <TrendingUp size={14} />}
            {delta.type === 'negative' && <TrendingDown size={14} />}
            {delta.type === 'neutral' && <Minus size={14} />}
            <span>{delta.value}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mt-2 mb-0">{subtitle}</p>}
    </div>
  );
};
