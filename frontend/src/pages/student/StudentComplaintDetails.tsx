import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { useToast } from '../../context/ToastContext';
import { Complaint, Feedback } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/StatusBadge';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  MessageSquareQuote,
} from 'lucide-react';

export const StudentComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchComplaint = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
    } catch (err: any) {
      error(err.message || 'Failed to load complaint details');
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    if (rating < 1 || rating > 5) {
      error('Please select a star rating from 1 to 5.');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const feedback = await complaintService.submitFeedback(complaint.id, rating, comment);
      success('Thank you! Your feedback and resolution rating have been recorded.');
      setComplaint({ ...complaint, feedback });
    } catch (err: any) {
      error(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
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

  if (!complaint) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top navigation */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/student/complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Complaints
        </button>
      </div>

      {/* Header Info */}
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

      {/* Visual Status Progression Timeline */}
      <Card className="p-6 shadow-sm border-border/80 bg-card">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Resolution Lifecycle Progress
        </h3>
        <StatusTimeline
          status={complaint.status}
          createdAt={complaint.createdAt}
          updatedAt={complaint.updatedAt}
        />
      </Card>

      {/* Main Details Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Issue Description & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-foreground leading-relaxed whitespace-pre-wrap">
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
                <span className="text-muted-foreground block font-medium">Date Logged</span>
                <span className="font-semibold text-foreground">{formatDate(complaint.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Card (If available) */}
      {(complaint.aiCategory || complaint.aiSummary) && (
        <Card className="border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/40 via-purple-50/20 to-card dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              CampusCare AI Issue Intelligence
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
                <strong className="text-foreground">AI Triage Reasoning:</strong> {complaint.aiReason}
              </p>
            )}
            {complaint.aiDepartment && (
              <p>
                <strong className="text-foreground">Assigned Department:</strong> {complaint.aiDepartment}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      <Card className="shadow-sm border-border/80">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Resolution Feedback & Service Rating
          </CardTitle>
          <CardDescription>
            Help campus facilities improve by sharing your experience after repair.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {complaint.feedback ? (
            /* Display Submitted Feedback */
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= complaint.feedback!.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-foreground ml-2">
                    {complaint.feedback.rating} out of 5 Stars
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Submitted {formatDate(complaint.feedback.createdAt)}
                </span>
              </div>

              {complaint.feedback.comment && (
                <div className="flex items-start gap-2 pt-1">
                  <MessageSquareQuote className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground italic leading-relaxed">
                    "{complaint.feedback.comment}"
                  </p>
                </div>
              )}
            </div>
          ) : complaint.status === 'RESOLVED' ? (
            /* Allow Submitting Feedback */
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  How satisfied are you with this resolution?
                </label>
                <div className="flex items-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-muted-foreground hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/40'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-muted-foreground ml-2">
                    {rating} Star{rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Feedback Comments (Optional)
                </label>
                <Textarea
                  placeholder="Share details about the repair quality, technician response, or campus improvements..."
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="gap-2 shadow-sm"
                isLoading={submittingFeedback}
              >
                <Send className="w-4 h-4" />
                Submit Resolution Feedback
              </Button>
            </form>
          ) : (
            /* Ticket Not Yet Resolved */
            <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              <p>
                Feedback rating unlocks automatically once the campus facility team marks this ticket as <strong>Resolved</strong>.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
