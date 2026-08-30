import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface CategoryBarChartProps {
  data: { name: string; displayName: string; count: number }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  WIFI_IT: '#3b82f6',
  ELECTRICAL: '#f59e0b',
  PLUMBING: '#06b6d4',
  CLASSROOM_EQUIPMENT: '#6366f1',
  HOSTEL_MAINTENANCE: '#a855f7',
  CLEANLINESS: '#10b981',
  TRANSPORT: '#f97316',
  INFRASTRUCTURE: '#78716c',
  SECURITY: '#f43f5e',
  OTHER: '#64748b',
};

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  // Sort descending and filter non-zero or top items
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md text-xs">
          <p className="font-semibold text-foreground">{item.displayName}</p>
          <p className="text-muted-foreground mt-0.5">{item.count} complaints logged</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Complaints by Category</span>
          <span className="text-xs font-normal text-muted-foreground">Volume distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="displayName"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 10, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name] || '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
