
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  BarChart, 
  FileText, 
  Users, 
  Settings, 
  BrainCircuit, 
  LayoutDashboard,
  Download,
  ChevronDown,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/dashboard/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ReportData } from '@/components/intelligence/ReportGeneratorDialog';
import { CustomDashboard } from '@/components/intelligence/CustomDashboardCreator';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reports, setReports] = useState<ReportData[]>([]);
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([]);
  
  useEffect(() => {
    // Mock data for our MVP
    const mockReports: ReportData[] = [
      {
        id: 'report-1',
        title: 'Rapport mensuel de performance',
        type: 'performance',
        period: 'monthly',
        indicators: ['revenue', 'margin', 'ebitda', 'fixedCosts'],
        createdAt: new Date('2024-08-01')
      },
      {
        id: 'report-2',
        title: 'Analyse de rentabilité par client',
        type: 'financial',
        period: 'quarterly',
        indicators: ['margin', 'costs', 'clients'],
        createdAt: new Date('2024-07-28')
      },
      {
        id: 'report-3',
        title: 'Impact des variations saisonnières',
        type: 'operational',
        period: 'annual',
        indicators: ['revenue', 'inventory', 'costs'],
        createdAt: new Date('2024-07-15')
      },
      {
        id: 'report-4',
        title: 'Analyse de l\'efficacité commerciale',
        type: 'commercial',
        period: 'monthly',
        indicators: ['sales', 'clients', 'satisfaction'],
        createdAt: new Date('2024-07-10')
      },
      {
        id: 'report-5',
        title: 'Rapport dynamique pour direction',
        type: 'executive',
        period: 'monthly',
        indicators: ['revenue', 'margin', 'ebitda', 'cash'],
        createdAt: new Date('2024-07-05')
      }
    ];
    
    const mockDashboards: CustomDashboard[] = [
      {
        id: 'dashboard-1',
        title: 'Performance commerciale',
        description: 'Analyse des ventes par produit, région et commercial',
        indicators: ['revenue', 'margin', 'clients'],
        layout: 'grid',
        visualType: 'cards',
        createdAt: new Date('2024-08-02')
      },
      {
        id: 'dashboard-2',
        title: 'Rentabilité par produit',
        description: 'Décomposition des marges et analyse des coûts',
        indicators: ['margin', 'costs', 'inventory'],
        layout: 'split',
        visualType: 'bar',
        createdAt: new Date('2024-07-30')
      },
      {
        id: 'dashboard-3',
        title: 'Flux de trésorerie',
        description: 'Suivi des entrées et sorties financières',
        indicators: ['cash', 'costs', 'revenue'],
        layout: 'grid',
        visualType: 'line',
        createdAt: new Date('2024-07-25')
      }
    ];
    
    setReports(mockReports);
    setDashboards(mockDashboards);
  }, []);
  
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
    <AppLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter">
            Tableau de bord d'administration
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Suivi des performances et de l'utilisation de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter les données
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="month">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="default">
            Appliquer
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Rapports
          </TabsTrigger>
          <TabsTrigger value="dashboards">
            <BarChart className="h-4 w-4 mr-2" />
            Tableaux
          </TabsTrigger>
          <TabsTrigger value="ai">
            <BrainCircuit className="h-4 w-4 mr-2" />
            Utilisation IA
          </TabsTrigger>
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
            <Card>
              <CardHeader>
                <CardTitle>Activité de la semaine</CardTitle>
                <CardDescription>Suivi des interactions avec la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Rapports" fill="#3b82f6" />
                      <Bar dataKey="Tableaux" fill="#8b5cf6" />
                      <Bar dataKey="IA Chat" fill="#22c55e" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Indicateurs les plus utilisés</CardTitle>
                <CardDescription>Répartition des indicateurs dans les rapports et tableaux</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activité des utilisateurs</CardTitle>
                <CardDescription>Niveau d'engagement par utilisateur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart 
                      layout="vertical" 
                      data={userActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="activity" fill="#06b6d4" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="py-4">
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
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Types de rapports</CardTitle>
                <CardDescription>Répartition par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des rapports</CardTitle>
              <CardDescription>Liste complète des rapports générés</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Dashboards Tab */}
        <TabsContent value="dashboards" className="py-4">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des tableaux</CardTitle>
              <CardDescription>Liste complète des tableaux de bord personnalisés</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
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
            />
            <StatCard
              title="Temps moyen par session"
              value="4m 12s"
              trend={{ value: 8.7, isPositive: true }}
              color="purple"
            />
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Utilisation de l'IA (7 derniers jours)</CardTitle>
              <CardDescription>Suivi des interactions avec l'assistant IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Types de requêtes</CardTitle>
                <CardDescription>Répartition par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance IA</CardTitle>
                <CardDescription>Metrics de qualité et rapidité</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

// Helper function
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default AdminDashboardPage;
