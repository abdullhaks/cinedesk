import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  helpText,
  children,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="label-caps-grey block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helpText && !error && <p className="text-[11px] text-slate-400 m-0">{helpText}</p>}
      {error && <p className="text-xs text-rose-600 font-medium m-0">{error}</p>}
    </div>
  );
};
