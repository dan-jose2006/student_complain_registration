import React from 'react';
import { ComplaintStatus } from '../../types';
import { CheckCircle2, Clock, RotateCw } from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

interface StatusTimelineProps {
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  status,
  createdAt,
  updatedAt,
}) => {
  const steps = [
    {
      id: 'PENDING',
      label: 'Submitted & Queued',
      description: 'Ticket received and awaiting administrative triage',
      date: createdAt,
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      description: 'Technician dispatched and actively working on resolution',
      date: status === 'IN_PROGRESS' || status === 'RESOLVED' ? updatedAt : null,
    },
    {
      id: 'RESOLVED',
      label: 'Resolved',
      description: 'Work completed and ready for student verification & feedback',
      date: status === 'RESOLVED' ? updatedAt : null,
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (status === 'RESOLVED') return 'completed';
    if (status === 'IN_PROGRESS') {
      if (stepId === 'PENDING') return 'completed';
      if (stepId === 'IN_PROGRESS') return 'active';
      return 'upcoming';
    }
    // PENDING
    if (stepId === 'PENDING') return 'active';
    return 'upcoming';
  };

  return (
    <div className="py-2">
      <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
        {/* Connecting line on desktop */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-border -z-0" />

        {steps.map((step, idx) => {
          const stepState = getStepStatus(step.id);
          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-row md:flex-col items-start md:items-center text-left md:text-center md:flex-1 gap-4 md:gap-2"
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm shrink-0',
                  stepState === 'completed' &&
                    'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20',
                  stepState === 'active' &&
                    'bg-card border-brand-500 text-brand-500 ring-4 ring-brand-500/20',
                  stepState === 'upcoming' &&
                    'bg-muted border-border text-muted-foreground'
                )}
              >
                {stepState === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                {stepState === 'active' && (
                  step.id === 'IN_PROGRESS' ? (
                    <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )
                )}
                {stepState === 'upcoming' && <span className="text-xs font-semibold">{idx + 1}</span>}
              </div>

              {/* Text */}
              <div className="space-y-1">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    stepState === 'active'
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : stepState === 'completed'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs md:mx-auto">
                  {step.description}
                </p>
                {step.date && (
                  <p className="text-[11px] font-medium text-muted-foreground/80 pt-0.5">
                    {formatDate(step.date)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
