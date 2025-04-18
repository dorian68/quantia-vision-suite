
export interface Report {
  id: string;
  title: string;
  description?: string;
  type: ReportType;
  period: ReportPeriod;
  indicators: string[];
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  visualType: 'table' | 'bar' | 'line' | 'pie' | 'cards';
  widgets: DashboardWidget[];
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'table';
  size: 'sm' | 'md' | 'lg';
  data: any;
  config: any;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'report_created' | 'dashboard_created' | 'ai_used' | 'profile_updated';
  details?: string;
  createdAt: Date;
}

export interface UserSubscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  startDate: Date;
  endDate?: Date;
  paymentMethod?: string;
}

export type ReportType = 'performance' | 'financial' | 'operational' | 'commercial' | 'executive';
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
