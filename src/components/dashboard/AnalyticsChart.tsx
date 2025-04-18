
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

type ChartType = 'line' | 'area' | 'bar';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface AnalyticsChartProps {
  data: DataPoint[];
  title: string;
  description?: string;
  type?: ChartType;
  height?: number;
  color?: string;
  secondaryColor?: string;
  showGrid?: boolean;
  className?: string;
  yAxisFormatter?: (value: number) => string;
}

export function AnalyticsChart({
  data,
  title,
  description,
  type = 'line',
  height = 300,
  color = 'var(--color-primary)',
  secondaryColor,
  showGrid = true,
  className,
  yAxisFormatter = (value) => `${value}`,
}: AnalyticsChartProps) {
  const chartColor = color || 'hsl(var(--primary))';
  const gradientColor = secondaryColor || chartColor;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg shadow-lg bg-background border border-border p-3">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${yAxisFormatter(entry.value as number)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Generate unique IDs for gradient definitions
  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substring(2, 9)}`, []);

  // Chart component based on type
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              stroke="var(--muted-foreground)"
              tickFormatter={yAxisFormatter} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              stroke="var(--muted-foreground)"
              tickFormatter={yAxisFormatter} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={`url(#${gradientId})`} 
              radius={[4, 4, 0, 0]} 
            />
          </RechartsBarChart>
        );
      case 'line':
      default:
        return (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />}
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              stroke="var(--muted-foreground)"
              tickFormatter={yAxisFormatter} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              strokeWidth={2}
              dot={{ stroke: chartColor, strokeWidth: 2, fill: 'var(--background)' }}
              activeDot={{ stroke: chartColor, strokeWidth: 2, r: 6, fill: chartColor }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={cn("dashboard-card", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
