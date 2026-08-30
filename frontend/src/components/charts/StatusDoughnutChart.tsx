import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface StatusDoughnutChartProps {
  data: { name: string; displayName: string; count: number; color: string }[];
}

export const StatusDoughnutChart: React.FC<StatusDoughnutChartProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
      return (
        <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md text-xs">
          <p className="font-semibold text-foreground">{item.displayName}</p>
          <p className="text-muted-foreground mt-0.5">
            {item.count} tickets ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Complaint Status Breakdown</span>
          <span className="text-xs font-normal text-muted-foreground">
            {total} Total Issues
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs font-medium text-foreground mr-2">
                    {entry.payload.displayName} ({entry.payload.count})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
