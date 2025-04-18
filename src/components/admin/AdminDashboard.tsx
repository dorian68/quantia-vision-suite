
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/dashboard/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  BarChart2, 
  FileText, 
  Users, 
  Clock, 
  Download, 
  MessagesSquare, 
  PieChart as PieChartIcon,
  BrainCircuit
} from 'lucide-react';
import { ReportData } from '../intelligence/ReportGeneratorDialog';
import { CustomDashboard } from '../intelligence/CustomDashboardCreator';

interface AdminDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reports: ReportData[];
  dashboards: CustomDashboard[];
}

export function AdminDashboard({ open, onOpenChange, reports, dashboards }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Generate mock usage data
  const generateMockUsageData = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days.map(day => ({
      name: day,
      'Rapports': Math.floor(Math.random() * 8) + 2,
      'Tableaux': Math.floor(Math.random() * 5) + 1,
      'IA Chat': Math.floor(Math.random() * 15) + 5,
    }));
  };
  
  const generateMockUserActivityData = () => {
    const users = ['Marc D.', 'Sophie L.', 'Thomas B.', 'Julie M.', 'David P.'];
    return users.map(user => ({
      name: user,
      activity: Math.floor(Math.random() * 100) + 20
    }));
  };
  
  const generateReportTypeData = () => {
    const typeCount: Record<string, number> = {};
    
    reports.forEach(report => {
      if (typeCount[report.type]) {
        typeCount[report.type]++;
      } else {
        typeCount[report.type] = 1;
      }
    });
    
    return Object.entries(typeCount).map(([name, value]) => ({
      name: getReportTypeName(name),
      value
    }));
  };
  
  const getReportTypeName = (type: string): string => {
    switch(type) {
      case 'performance': return 'Performance';
      case 'financial': return 'Financier';
      case 'operational': return 'Opérationnel';
      case 'commercial': return 'Commercial';
      case 'executive': return 'Direction';
      default: return type;
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const usageData = generateMockUsageData();
  const userActivityData = generateMockUserActivityData();
  const reportTypeData = generateReportTypeData();
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tableau de bord d'administration</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
            <TabsTrigger value="dashboards">Tableaux</TabsTrigger>
            <TabsTrigger value="ai">Utilisation IA</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Rapports générés"
                value={reports.length.toString()}
                trend={{ value: 12.5, isPositive: true }}
                color="blue"
              />
              <StatCard
                title="Tableaux personnalisés"
                value={dashboards.length.toString()}
                trend={{ value: 8.3, isPositive: true }}
                color="purple"
              />
              <StatCard
                title="Requêtes IA"
                value="127"
                trend={{ value: 23.7, isPositive: true }}
                color="green"
              />
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Activité de la semaine</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Rapports" fill="#3b82f6" />
                    <Bar dataKey="Tableaux" fill="#8b5cf6" />
                    <Bar dataKey="IA Chat" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Indicateurs les plus utilisés</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'CA', value: 35 },
                          { name: 'Marge', value: 25 },
                          { name: 'EBE', value: 20 },
                          { name: 'Trésorerie', value: 15 },
                          { name: 'Autres', value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {reportTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Activité des utilisateurs</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={userActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="activity" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="py-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Rapports générés ({reports.length})</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Rapports cette semaine"
                value={(reports.length || 0).toString()}
                trend={{ value: 12.5, isPositive: true }}
                color="blue"
              />
              <StatCard
                title="Type le plus populaire"
                value={reports.length > 0 ? getReportTypeName(reports[0].type) : "N/A"}
                color="purple"
              />
              <StatCard
                title="Téléchargements"
                value={(Math.floor((reports.length || 0) * 1.3)).toString()}
                trend={{ value: 5.2, isPositive: true }}
                color="green"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Types de rapports</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportTypeData.length > 0 ? reportTypeData : [
                        { name: 'Performance', value: 1 },
                        { name: 'Financier', value: 1 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {reportTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Historique des rapports</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Indicateurs</TableHead>
                      <TableHead>Date de création</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>{getReportTypeName(report.type)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {report.period === 'monthly' ? 'Mensuel' : 
                                report.period === 'quarterly' ? 'Trimestriel' :
                                report.period === 'annual' ? 'Annuel' : report.period}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.indicators.length}</TableCell>
                          <TableCell>{report.createdAt ? formatDate(report.createdAt) : 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Aucun rapport généré
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          {/* Dashboards Tab */}
          <TabsContent value="dashboards" className="py-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Tableaux personnalisés ({dashboards.length})</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Tableaux cette semaine"
                value={(dashboards.length || 0).toString()}
                trend={{ value: 8.3, isPositive: true }}
                color="purple"
              />
              <StatCard
                title="Visualisation préférée"
                value={dashboards.length > 0 ? capitalizeFirst(dashboards[0].visualType) : "N/A"}
                color="cyan"
              />
              <StatCard
                title="Indicateurs moyens"
                value={dashboards.length > 0 ? 
                  (dashboards.reduce((acc, d) => acc + d.indicators.length, 0) / dashboards.length).toFixed(1) : 
                  "N/A"
                }
                color="orange"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Historique des tableaux</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type d'affichage</TableHead>
                      <TableHead>Indicateurs</TableHead>
                      <TableHead>Date de création</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboards.length > 0 ? (
                      dashboards.map((dashboard) => (
                        <TableRow key={dashboard.id}>
                          <TableCell className="font-medium">{dashboard.title}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {dashboard.description || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {dashboard.visualType === 'cards' ? 'Cartes KPI' : 
                                dashboard.visualType === 'table' ? 'Tableau' :
                                dashboard.visualType === 'bar' ? 'Graphique à barres' :
                                dashboard.visualType === 'line' ? 'Graphique linéaire' : 
                                dashboard.visualType === 'pie' ? 'Graphique circulaire' : 
                                dashboard.visualType}
                            </Badge>
                          </TableCell>
                          <TableCell>{dashboard.indicators.length}</TableCell>
                          <TableCell>{formatDate(dashboard.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Aucun tableau personnalisé créé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          {/* AI Usage Tab */}
          <TabsContent value="ai" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Requêtes IA totales"
                value="127"
                trend={{ value: 23.7, isPositive: true }}
                color="green"
                icon={BrainCircuit}
              />
              <StatCard
                title="Suggestions acceptées"
                value="68%"
                trend={{ value: 5.2, isPositive: true }}
                color="blue"
                icon={MessagesSquare}
              />
              <StatCard
                title="Temps moyen par session"
                value="4m 12s"
                trend={{ value: 8.7, isPositive: true }}
                color="purple"
                icon={Clock}
              />
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Utilisation de l'IA (7 derniers jours)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: 'Lun', requêtes: 15, suggestions: 8, rapports: 3 },
                    { day: 'Mar', requêtes: 22, suggestions: 12, rapports: 5 },
                    { day: 'Mer', requêtes: 18, suggestions: 10, rapports: 4 },
                    { day: 'Jeu', requêtes: 25, suggestions: 15, rapports: 6 },
                    { day: 'Ven', requêtes: 28, suggestions: 18, rapports: 7 },
                    { day: 'Sam', requêtes: 12, suggestions: 5, rapports: 2 },
                    { day: 'Dim', requêtes: 7, suggestions: 3, rapports: 1 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="requêtes" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="suggestions" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rapports" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Types de requêtes</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Questions', value: 45 },
                          { name: 'Analyse', value: 30 },
                          { name: 'Rapport', value: 15 },
                          { name: 'Prévision', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2, 3].map((index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Performance IA</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Taux de satisfaction</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Précision des réponses</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Temps de réponse moyen</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper function
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
