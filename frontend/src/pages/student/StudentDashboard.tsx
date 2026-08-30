import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { Complaint } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import {
  PlusCircle,
  Inbox,
  Clock,
  RotateCw,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ListOrdered,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await complaintService.getMyComplaints();
        setComplaints(data);
      } catch (err) {
        console.error('Error fetching student complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'PENDING').length;
  const inProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {getGreeting()}, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your campus facility and service requests.
          </p>
        </div>
        <Link to="/student/complaints/new">
          <Button size="lg" className="gap-2 shadow-md shadow-brand-500/20 w-full sm:w-auto">
            <PlusCircle className="w-5 h-5" />
            Raise New Complaint
          </Button>
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Raised
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{loading ? <Skeleton className="h-8 w-12" /> : total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center justify-between border-amber-200 dark:border-amber-900/40">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Pending
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-300">{loading ? <Skeleton className="h-8 w-12" /> : pending}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center justify-between border-blue-200 dark:border-blue-900/40">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              In Progress
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-800 dark:text-blue-300">{loading ? <Skeleton className="h-8 w-12" /> : inProgress}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <RotateCw className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center justify-between border-emerald-200 dark:border-emerald-900/40">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Resolved
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-800 dark:text-emerald-300">{loading ? <Skeleton className="h-8 w-12" /> : resolved}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5 flex items-center justify-between col-span-2 lg:col-span-1 border-purple-200 dark:border-purple-900/40">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
              Resolution
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-purple-300">{loading ? <Skeleton className="h-8 w-12" /> : `${resolutionRate}%`}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Recent Complaints Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-brand-600" />
              Recent Issues Raised By You
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track the current status and technician updates for your requests
            </p>
          </div>
          {complaints.length > 0 && (
            <Link to="/student/complaints">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : complaints.length === 0 ? (
            <EmptyState
              title="No issues reported yet"
              description="Have a problem with Wi-Fi, electricity, plumbing, or classroom equipment? Log a ticket to get it resolved promptly."
              actionLabel="Raise First Complaint"
              onAction={() => {}}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3">Ticket ID</th>
                    <th className="py-3 px-3">Issue Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Reported</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-accent/50 transition-colors group">
                      <td className="py-3.5 px-3 font-mono font-bold text-xs text-muted-foreground">
                        #{complaint.id}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-foreground max-w-xs truncate">
                        <Link
                          to={`/student/complaints/${complaint.id}`}
                          className="hover:text-brand-600 transition-colors"
                        >
                          {complaint.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <CategoryBadge category={complaint.category} />
                      </td>
                      <td className="py-3.5 px-3">
                        <PriorityBadge priority={complaint.priority} />
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="py-3.5 px-3 text-xs text-muted-foreground">
                        {formatRelativeTime(complaint.createdAt)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link to={`/student/complaints/${complaint.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
