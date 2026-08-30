import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import { Complaint, ComplaintCategory, Priority, ComplaintStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { CATEGORY_DETAILS, formatDate, formatRelativeTime } from '../../lib/utils';
import {
  ListOrdered,
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';

export const StudentComplaints: React.FC = () => {
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
      const data = await complaintService.getMyComplaints({
        search: search || undefined,
        status: (status as ComplaintStatus) || undefined,
        category: (category as ComplaintCategory) || undefined,
        priority: (priority as Priority) || undefined,
      });
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
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

  const handleResetFilters = () => {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <ListOrdered className="w-7 h-7 text-brand-600" />
            My Campus Issue History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse, filter, and track all complaints submitted by your account.
          </p>
        </div>
        <Link to="/student/complaints/new">
          <Button className="gap-2 shadow-md">
            <PlusCircle className="w-4 h-4" />
            Raise New Complaint
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-card shadow-sm border-border/80">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-2 relative">
              <Input
                placeholder="Search by title, location, or keyword..."
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
              Showing <strong>{complaints.length}</strong> complaints
            </span>
            <div className="flex items-center gap-2">
              {(search || status || category || priority) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 text-xs gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </Button>
              )}
              <Button type="submit" size="sm" className="h-8 text-xs gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Complaint Table / Cards */}
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
                title="No complaints match your criteria"
                description="Try clearing your search filters or submit a new campus complaint."
                actionLabel="Reset Search"
                onAction={handleResetFilters}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3.5 px-4">Ticket</th>
                    <th className="py-3.5 px-4">Title & Location</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
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
                      <td className="py-4 px-4 max-w-sm">
                        <Link
                          to={`/student/complaints/${complaint.id}`}
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
                      <td className="py-4 px-4 text-xs text-muted-foreground">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right">
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
