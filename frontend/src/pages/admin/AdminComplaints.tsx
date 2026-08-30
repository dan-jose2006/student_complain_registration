import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Complaint, ComplaintCategory, Priority, ComplaintStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { CATEGORY_DETAILS, formatDate } from '../../lib/utils';
import {
  Layers,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllComplaints({
        search: search || undefined,
        status: (status as ComplaintStatus) || undefined,
        category: (category as ComplaintCategory) || undefined,
        priority: (priority as Priority) || undefined,
      });
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [status, category, priority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setCategory('');
    setPriority('');
  };

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...Object.entries(CATEGORY_DETAILS).map(([value, details]) => ({
      label: details.label,
      value,
    })),
  ];

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: '' },
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-brand-600" />
          Campus Issue Management Console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inspect, prioritize, dispatch technicians, and update resolution statuses across all campus departments.
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-card shadow-sm border-border/80">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <Input
                placeholder="Search student, email, title, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
            </div>

            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />

            <Select
              options={categoryOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Select
              options={priorityOptions}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-muted-foreground">
              Total <strong>{complaints.length}</strong> complaints matched
            </span>
            <div className="flex items-center gap-2">
              {(search || status || category || priority) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 text-xs gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
              <Button type="submit" size="sm" className="h-8 text-xs gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Filter Records
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Admin Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No complaints found matching filters"
                description="Try clearing search keywords or selecting different status/category filters."
                actionLabel="Clear Filters"
                onAction={handleReset}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ticket</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Issue & Location</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">AI Triage</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-accent/40 transition-colors group">
                      <td className="py-4 px-4 font-mono font-bold text-xs text-muted-foreground">
                        #{complaint.id}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className="font-semibold text-foreground block">
                          {complaint.user?.name}
                        </span>
                        <span className="text-muted-foreground block text-[11px] truncate max-w-[130px]">
                          {complaint.user?.email}
                        </span>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <Link
                          to={`/admin/complaints/${complaint.id}`}
                          className="font-medium text-foreground hover:text-brand-600 transition-colors block truncate"
                        >
                          {complaint.title}
                        </Link>
                        <span className="text-xs text-muted-foreground block truncate mt-0.5">
                          📍 {complaint.location}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <CategoryBadge category={complaint.category} />
                      </td>
                      <td className="py-4 px-4">
                        <PriorityBadge priority={complaint.priority} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="py-4 px-4">
                        {complaint.aiCategory ? (
                          <Badge variant="ai" className="text-[10px] py-0.5 gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {Math.round((complaint.aiConfidence || 0.9) * 100)}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Manual</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right">
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
