
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Report, Dashboard, UserActivity } from '@/types/models';

export const useUserDataService = () => {
  const { supabase, user } = useAuth();
  
  // Reports
  const getUserReports = async (): Promise<Report[]> => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user reports:', error);
      toast.error('Erreur lors de la récupération des rapports');
      return [];
    }
    
    // Map from database format to our model
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      period: item.period,
      indicators: item.indicators,
      userId: item.user_id,
      createdAt: new Date(item.created_at),
      updatedAt: item.updated_at ? new Date(item.updated_at) : undefined
    }));
  };
  
  const createReport = async (report: Omit<Report, 'id' | 'userId' | 'createdAt'>): Promise<Report | null> => {
    if (!user) throw new Error('User not authenticated');
    
    const newReport = {
      title: report.title,
      description: report.description,
      type: report.type,
      period: report.period,
      indicators: report.indicators,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('reports')
      .insert([newReport])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating report:', error);
      toast.error('Erreur lors de la création du rapport');
      return null;
    }
    
    // Log activity
    await logUserActivity('report_created', `Rapport créé: ${report.title}`);
    
    toast.success('Rapport créé avec succès');
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      type: data.type,
      period: data.period,
      indicators: data.indicators,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  };
  
  // Dashboards
  const getUserDashboards = async (): Promise<Dashboard[]> => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user dashboards:', error);
      toast.error('Erreur lors de la récupération des tableaux de bord');
      return [];
    }
    
    // Map from database format to our model
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      visualType: item.visual_type,
      widgets: item.widgets || [],
      userId: item.user_id,
      createdAt: new Date(item.created_at),
      updatedAt: item.updated_at ? new Date(item.updated_at) : undefined
    }));
  };
  
  const createDashboard = async (dashboard: Omit<Dashboard, 'id' | 'userId' | 'createdAt'>): Promise<Dashboard | null> => {
    if (!user) throw new Error('User not authenticated');
    
    const newDashboard = {
      title: dashboard.title,
      description: dashboard.description,
      visual_type: dashboard.visualType,
      widgets: dashboard.widgets,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('dashboards')
      .insert([newDashboard])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating dashboard:', error);
      toast.error('Erreur lors de la création du tableau de bord');
      return null;
    }
    
    // Log activity
    await logUserActivity('dashboard_created', `Tableau créé: ${dashboard.title}`);
    
    toast.success('Tableau de bord créé avec succès');
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      visualType: data.visual_type,
      widgets: data.widgets || [],
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  };
  
  // User activity
  const getUserActivity = async (): Promise<UserActivity[]> => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      action: item.action,
      details: item.details,
      createdAt: new Date(item.created_at)
    }));
  };
  
  const logUserActivity = async (
    action: UserActivity['action'], 
    details?: string
  ): Promise<void> => {
    if (!user) return;
    
    const activity = {
      user_id: user.id,
      action,
      details,
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('user_activities')
      .insert([activity]);
      
    if (error) {
      console.error('Error logging user activity:', error);
    }
  };
  
  return {
    getUserReports,
    createReport,
    getUserDashboards,
    createDashboard,
    getUserActivity,
    logUserActivity
  };
};
