import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ComplaintCategory, Priority, ComplaintStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

export const CATEGORY_DETAILS: Record<
  ComplaintCategory,
  { label: string; icon: string; color: string; bg: string }
> = {
  WIFI_IT: {
    label: 'Wi-Fi / IT',
    icon: 'Wifi',
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
  },
  ELECTRICAL: {
    label: 'Electrical',
    icon: 'Zap',
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
  },
  PLUMBING: {
    label: 'Plumbing',
    icon: 'Droplets',
    color: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
  },
  CLASSROOM_EQUIPMENT: {
    label: 'Classroom Equipment',
    icon: 'MonitorPlay',
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
  },
  HOSTEL_MAINTENANCE: {
    label: 'Hostel Maintenance',
    icon: 'Home',
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
  },
  CLEANLINESS: {
    label: 'Cleanliness',
    icon: 'Sparkles',
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
  },
  TRANSPORT: {
    label: 'Transport',
    icon: 'Bus',
    color: 'text-orange-500 dark:text-orange-400',
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
  },
  INFRASTRUCTURE: {
    label: 'Infrastructure',
    icon: 'Building2',
    color: 'text-stone-500 dark:text-stone-400',
    bg: 'bg-stone-500/10 dark:bg-stone-500/20',
  },
  SECURITY: {
    label: 'Security',
    icon: 'ShieldAlert',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
  },
  OTHER: {
    label: 'Other',
    icon: 'HelpCircle',
    color: 'text-gray-500 dark:text-gray-400',
    bg: 'bg-gray-500/10 dark:bg-gray-500/20',
  },
};

export const PRIORITY_DETAILS: Record<
  Priority,
  { label: string; color: string; bg: string; border: string }
> = {
  LOW: {
    label: 'Low',
    color: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-300 dark:border-amber-700/60',
  },
  HIGH: {
    label: 'High',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-300 dark:border-rose-700/60',
  },
};

export const STATUS_DETAILS: Record<
  ComplaintStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
};
