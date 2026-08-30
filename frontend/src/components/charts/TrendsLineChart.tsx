import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface TrendsLineChartProps {
  data: { date: string; created: number; resolved: number }[];
}

export const TrendsLineChart: React.FC<TrendsLineChartProps> = ({ data }) => {
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
    }),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md text-xs">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-brand-500 font-medium">
              Reported: {payload[0]?.value || 0} issues
            </p>
            <p className="text-emerald-500 font-medium">
              Resolved: {payload[1]?.value || 0} issues
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>7-Day Resolution Velocity</span>
          <span className="text-xs font-normal text-muted-foreground">
            Reports vs Resolutions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={30} iconType="circle" />
              <Area
                type="monotone"
                dataKey="created"
                name="Reported"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCreated)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolved"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResolved)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
