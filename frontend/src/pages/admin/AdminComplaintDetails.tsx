import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Complaint, ComplaintStatus, Priority } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/StatusBadge';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
  Star,
  MessageSquareQuote,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending (Awaiting assignment)' },
  { value: 'IN_PROGRESS', label: 'In Progress (Technician dispatched)' },
  { value: 'RESOLVED', label: 'Resolved (Work completed)' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low Priority' },
  { value: 'MEDIUM', label: 'Medium Priority' },
  { value: 'HIGH', label: 'High Priority (Urgent)' },
];

export const AdminComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [status, setStatus] = useState<ComplaintStatus>('PENDING');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchComplaint = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await adminService.getComplaintById(id);
      setComplaint(data);
      setStatus(data.status);
      setPriority(data.priority);
    } catch (err: any) {
      error(err.message || 'Failed to fetch complaint details');
      navigate('/admin/complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setIsUpdating(true);
    try {
      const updated = await adminService.updateComplaint(complaint.id, {
        status,
        priority,
      });
      setComplaint(updated);
      success(
        `Ticket #${complaint.id} successfully updated to "${status.replace('_', ' ')}" status!`,
        'Changes Saved'
      );
    } catch (err: any) {
      error(err.message || 'Failed to update complaint.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!complaint) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top back link */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Complaints
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              Ticket #{complaint.id}
            </span>
            <CategoryBadge category={complaint.category} />
            <PriorityBadge priority={complaint.priority} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {complaint.title}
          </h1>
        </div>
        <StatusBadge status={complaint.status} className="self-start sm:self-auto text-sm px-3.5 py-1.5" />
      </div>

      {/* Student Reporter Card */}
      <Card className="shadow-sm border-border/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            Reported by Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground block font-medium">Student Name</span>
                <span className="font-bold text-foreground text-sm">{complaint.user?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground block font-medium">Student Email</span>
                <span className="font-bold text-foreground text-sm font-mono">{complaint.user?.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status & Priority Management Form */}
      <Card className="shadow-md border-brand-500/30 bg-gradient-to-br from-card via-card to-brand-500/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            Administrative Status & Priority Control
          </CardTitle>
          <CardDescription>
            Update the resolution stage and urgency level. Changes will notify the student reporter immediately.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Update Resolution Status
                </label>
                <Select
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Update Priority Urgency
                </label>
                <Select
                  options={PRIORITY_OPTIONS}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <Button type="submit" isLoading={isUpdating} className="gap-2 shadow-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Visual Status Progression Timeline */}
      <Card className="p-6 shadow-sm border-border/80 bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Lifecycle Progression Timeline
        </h3>
        <StatusTimeline
          status={complaint.status}
          createdAt={complaint.createdAt}
          updatedAt={complaint.updatedAt}
        />
      </Card>

      {/* Full Description and Location Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Issue Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-muted/40 border border-border text-foreground leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-muted-foreground block font-medium">Campus Location</span>
                <span className="font-semibold text-foreground">{complaint.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-muted-foreground block font-medium">Logged Date</span>
                <span className="font-semibold text-foreground">{formatDate(complaint.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Card */}
      {(complaint.aiCategory || complaint.aiSummary) && (
        <Card className="border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/40 via-purple-50/20 to-card dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              CampusCare AI Auto-Triage Record
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            {complaint.aiSummary && (
              <p>
                <strong className="text-foreground">AI Summary:</strong> {complaint.aiSummary}
              </p>
            )}
            {complaint.aiReason && (
              <p>
                <strong className="text-foreground">AI Reasoning:</strong> {complaint.aiReason}
              </p>
            )}
            {complaint.aiDepartment && (
              <p>
                <strong className="text-foreground">Recommended Department:</strong> {complaint.aiDepartment}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Student Feedback (If available) */}
      {complaint.feedback && (
        <Card className="shadow-sm border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Student Resolution Feedback & Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= complaint.feedback!.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted'
                  }`}
                />
              ))}
              <span className="font-bold text-foreground ml-2">
                {complaint.feedback.rating} / 5 Stars
              </span>
              <span className="text-muted-foreground ml-2">
                ({formatDate(complaint.feedback.createdAt)})
              </span>
            </div>

            {complaint.feedback.comment && (
              <div className="flex items-start gap-2 pt-1">
                <MessageSquareQuote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-foreground italic leading-relaxed">
                  "{complaint.feedback.comment}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
