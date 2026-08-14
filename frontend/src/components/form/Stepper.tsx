import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  number: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div
              key={step.number}
              onClick={() => isCompleted && onStepClick?.(step.number)}
              className={`flex flex-col items-center relative z-10 ${
                isCompleted ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={18} /> : step.number}
              </div>
              <div className="text-center mt-2 hidden sm:block">
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
