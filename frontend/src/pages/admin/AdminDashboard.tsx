import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminDashboardData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/StatusBadge';
import { StatusDoughnutChart } from '../../components/charts/StatusDoughnutChart';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { TrendsLineChart } from '../../components/charts/TrendsLineChart';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import {
  LayoutDashboard,
  Inbox,
  Clock,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await adminService.getDashboard();
        setData(result);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Campus Operations Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Admin Portal
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time telemetry, issue triage queues, and operational analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/ai-insights">
            <Button variant="ai" size="sm" className="gap-1.5 shadow-sm text-xs">
              <Sparkles className="w-4 h-4" />
              AI Campus Insights
            </Button>
          </Link>
          <Link to="/admin/complaints">
            <Button size="sm" className="gap-1.5 shadow-sm text-xs">
              <Layers className="w-4 h-4" />
              Manage All Complaints
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Statistic Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">Total</span>
            <Inbox className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-extrabold text-foreground mt-2">
            {loading ? <Skeleton className="h-7 w-12" /> : data?.summary.total}
          </p>
        </Card>

        {/* Pending */}
        <Card className="p-4 flex flex-col justify-between border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 mt-2">
            {loading ? <Skeleton className="h-7 w-12" /> : data?.summary.pending}
          </p>
        </Card>

        {/* In Progress */}
        <Card className="p-4 flex flex-col justify-between border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">In Progress</span>
            <RotateCw className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-blue-800 dark:text-blue-300 mt-2">
            {loading ? <Skeleton className="h-7 w-12" /> : data?.summary.inProgress}
          </p>
        </Card>

        {/* Resolved */}
        <Card className="p-4 flex flex-col justify-between border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 mt-2">
            {loading ? <Skeleton className="h-7 w-12" /> : data?.summary.resolved}
          </p>
        </Card>

        {/* High Priority */}
        <Card className="p-4 flex flex-col justify-between border-rose-200 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">High Urgency</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-800 dark:text-rose-300 mt-2">
            {loading ? <Skeleton className="h-7 w-12" /> : data?.summary.highPriority}
          </p>
        </Card>

        {/* Resolution Rate */}
        <Card className="p-4 flex flex-col justify-between border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase">Resolution</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-purple-800 dark:text-purple-300 mt-2">
            {loading ? <Skeleton className="h-7 w-12" /> : `${data?.summary.resolutionRate}%`}
          </p>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <StatusDoughnutChart data={data?.charts.status || []} />
          )}
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <CategoryBarChart data={data?.charts.categories || []} />
          )}
        </div>
      </div>

      {/* 7-Day Velocity Trend Chart */}
      <div>
        {loading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <TrendsLineChart data={data?.charts.trends || []} />
        )}
      </div>

      {/* Recent Complaints Queued for Triage */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg">Recent Campus Incident Log</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live queue of reported issues across campus facilities
            </p>
          </div>
          <Link to="/admin/complaints">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              View All Complaints <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : data?.recentComplaints.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No complaints logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Issue Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Reported</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data?.recentComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-accent/40 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-xs text-muted-foreground">
                        #{complaint.id}
                      </td>
                      <td className="py-3.5 px-3 text-xs">
                        <span className="font-semibold text-foreground block">{complaint.user?.name}</span>
                        <span className="text-muted-foreground block text-[11px] truncate max-w-[120px]">
                          {complaint.user?.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-foreground max-w-xs truncate">
                        <Link
                          to={`/admin/complaints/${complaint.id}`}
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
                        <Link to={`/admin/complaints/${complaint.id}`}>
                          <Button variant="default" size="sm" className="h-8 text-xs">
                            Manage
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
