
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  color?: 'blue' | 'purple' | 'cyan' | 'green' | 'orange' | 'red';
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  color = 'blue',
  className,
}: StatCardProps) {
  const colorMap = {
    blue: 'from-quantia-blue to-quantia-blue/50',
    purple: 'from-quantia-purple to-quantia-purple/50',
    cyan: 'from-quantia-cyan to-quantia-cyan/50',
    green: 'from-quantia-green to-quantia-green/50',
    orange: 'from-quantia-orange to-quantia-orange/50',
    red: 'from-quantia-red to-quantia-red/50',
  };

  const iconColorMap = {
    blue: 'text-quantia-blue bg-quantia-blue/10',
    purple: 'text-quantia-purple bg-quantia-purple/10',
    cyan: 'text-quantia-cyan bg-quantia-cyan/10',
    green: 'text-quantia-green bg-quantia-green/10',
    orange: 'text-quantia-orange bg-quantia-orange/10',
    red: 'text-quantia-red bg-quantia-red/10',
  };

  const trendColorMap = {
    positive: 'text-quantia-green',
    negative: 'text-quantia-red',
  };

  return (
    <div className={cn(
      "dashboard-card overflow-hidden",
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg",
            iconColorMap[color]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && (
          <span className={cn(
            "text-sm font-medium flex items-center",
            trend.isPositive ? trendColorMap.positive : trendColorMap.negative
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
      {/* Bottom gradient accent */}
      <div className={cn(
        "h-1 w-full mt-3 rounded-full bg-gradient-to-r",
        colorMap[color]
      )} />
    </div>
  );
}
