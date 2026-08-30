import React from 'react';
import { ComplaintStatus, Priority, ComplaintCategory } from '../../types';
import { STATUS_DETAILS, PRIORITY_DETAILS, CATEGORY_DETAILS, cn } from '../../lib/utils';
import {
  Clock,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  Wifi,
  Zap,
  Droplets,
  MonitorPlay,
  Home,
  Sparkles,
  Bus,
  Building2,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

export const StatusBadge: React.FC<{ status: ComplaintStatus; className?: string }> = ({
  status,
  className,
}) => {
  const details = STATUS_DETAILS[status] || STATUS_DETAILS.PENDING;

  const renderIcon = () => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-3 h-3 text-amber-500" />;
      case 'IN_PROGRESS':
        return <RotateCw className="w-3 h-3 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors shadow-sm',
        details.bg,
        details.color,
        details.border,
        className
      )}
    >
      {renderIcon()}
      <span>{details.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority; className?: string }> = ({
  priority,
  className,
}) => {
  const details = PRIORITY_DETAILS[priority] || PRIORITY_DETAILS.MEDIUM;

  const renderIcon = () => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangle className="w-3 h-3 text-rose-500" />;
      case 'MEDIUM':
        return <AlertCircle className="w-3 h-3 text-amber-500" />;
      case 'LOW':
        return <ArrowDown className="w-3 h-3 text-slate-500" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
        details.bg,
        details.color,
        details.border,
        className
      )}
    >
      {renderIcon()}
      <span>{details.label} Priority</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: ComplaintCategory; className?: string }> = ({
  category,
  className,
}) => {
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.OTHER;

  const renderIcon = () => {
    switch (category) {
      case 'WIFI_IT':
        return <Wifi className="w-3.5 h-3.5" />;
      case 'ELECTRICAL':
        return <Zap className="w-3.5 h-3.5" />;
      case 'PLUMBING':
        return <Droplets className="w-3.5 h-3.5" />;
      case 'CLASSROOM_EQUIPMENT':
        return <MonitorPlay className="w-3.5 h-3.5" />;
      case 'HOSTEL_MAINTENANCE':
        return <Home className="w-3.5 h-3.5" />;
      case 'CLEANLINESS':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'TRANSPORT':
        return <Bus className="w-3.5 h-3.5" />;
      case 'INFRASTRUCTURE':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'SECURITY':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-border/60',
        details.bg,
        details.color,
        className
      )}
    >
      {renderIcon()}
      <span>{details.label}</span>
    </span>
  );
};
