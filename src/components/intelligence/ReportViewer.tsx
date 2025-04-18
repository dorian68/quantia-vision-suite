
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Download, FileText, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReportData } from './ReportGeneratorDialog';
import { toast } from 'sonner';

interface ReportViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: ReportData | null;
}

// Mock data generation based on report type and indicators
const generateMockData = (report: ReportData) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();
  
  const getMonths = () => {
    if (report.period === 'monthly') return [months[currentMonth]];
    if (report.period === 'quarterly') return months.slice(Math.floor(currentMonth / 3) * 3, Math.floor(currentMonth / 3) * 3 + 3);
    if (report.period === 'annual') return months;
    return months.slice(Math.max(0, currentMonth - 4), currentMonth + 1);
  };

  const revenueBase = 120000 + Math.random() * 50000;
  const reportMonths = getMonths();
  
  return reportMonths.map((month, index) => {
    const revenue = report.indicators.includes('revenue') 
      ? revenueBase + (index * 5000) + (Math.random() * 10000 - 5000) 
      : 0;
    
    const margin = report.indicators.includes('margin') 
      ? 0.35 + (Math.random() * 0.15)
      : 0;
    
    const ebitda = report.indicators.includes('ebitda') 
      ? revenue * (0.15 + Math.random() * 0.1)
      : 0;
    
    const fixedCosts = report.indicators.includes('fixedCosts') 
      ? 35000 + (Math.random() * 8000 - 4000)
      : 0;
    
    const inventory = report.indicators.includes('inventory') 
      ? 75000 + (Math.random() * 20000 - 10000)
      : 0;
    
    const cashflow = report.indicators.includes('cashflow') 
      ? revenue * 0.2 - fixedCosts * 0.3 + (Math.random() * 15000 - 7500)
      : 0;
    
    const customerAcq = report.indicators.includes('customerAcq') 
      ? 25 + Math.floor(Math.random() * 15)
      : 0;
    
    const salesPerf = report.indicators.includes('salesPerf') 
      ? 0.85 + (Math.random() * 0.3 - 0.15)
      : 0;
    
    return {
      name: month,
      'Chiffre d\'affaires': revenue.toFixed(0),
      'Marge brute': margin,
      'EBE': ebitda.toFixed(0),
      'Charges fixes': fixedCosts.toFixed(0),
      'Stock': inventory.toFixed(0),
      'Trésorerie': cashflow.toFixed(0),
      'Nouveaux clients': customerAcq,
      'Performance commerciale': salesPerf
    };
  });
};

// Component for rendering KPI summaries
const ReportKPISummary = ({ report, data }: { report: ReportData, data: any[] }) => {
  // Get the latest month data
  const latestData = data[data.length - 1];
  const prevData = data.length > 1 ? data[data.length - 2] : null;
  
  // Calculate trends
  const getTrend = (current: number, previous: number | null) => {
    if (!previous) return { value: 0, isPositive: true };
    const diff = ((current - previous) / previous) * 100;
    return { value: Number(Math.abs(diff).toFixed(1)), isPositive: diff >= 0 };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {report.indicators.includes('revenue') && (
        <StatCard
          title="Chiffre d'affaires"
          value={`${(Number(latestData['Chiffre d\'affaires']) / 1000).toFixed(0)} k€`}
          trend={getTrend(
            Number(latestData['Chiffre d\'affaires']), 
            prevData ? Number(prevData['Chiffre d\'affaires']) : null
          )}
          color="blue"
        />
      )}
      
      {report.indicators.includes('margin') && (
        <StatCard
          title="Marge brute"
          value={`${(latestData['Marge brute'] * 100).toFixed(1)}%`}
          trend={getTrend(
            latestData['Marge brute'], 
            prevData ? prevData['Marge brute'] : null
          )}
          color="green"
        />
      )}
      
      {report.indicators.includes('ebitda') && (
        <StatCard
          title="EBE"
          value={`${(Number(latestData['EBE']) / 1000).toFixed(0)} k€`}
          trend={getTrend(
            Number(latestData['EBE']), 
            prevData ? Number(prevData['EBE']) : null
          )}
          color="purple"
        />
      )}
      
      {report.indicators.includes('fixedCosts') && (
        <StatCard
          title="Charges fixes"
          value={`${(Number(latestData['Charges fixes']) / 1000).toFixed(0)} k€`}
          trend={getTrend(
            Number(latestData['Charges fixes']), 
            prevData ? Number(prevData['Charges fixes']) : null
          )}
          color="orange"
        />
      )}
      
      {report.indicators.includes('inventory') && (
        <StatCard
          title="Niveau de stock"
          value={`${(Number(latestData['Stock']) / 1000).toFixed(0)} k€`}
          color="cyan"
        />
      )}
      
      {report.indicators.includes('cashflow') && (
        <StatCard
          title="Trésorerie"
          value={`${(Number(latestData['Trésorerie']) / 1000).toFixed(0)} k€`}
          trend={getTrend(
            Number(latestData['Trésorerie']), 
            prevData ? Number(prevData['Trésorerie']) : null
          )}
          color="blue"
        />
      )}
    </div>
  );
};

// Main component
export function ReportViewer({ open, onOpenChange, report }: ReportViewerProps) {
  const [activeTab, setActiveTab] = useState('summary');
  
  if (!report) return null;

  const mockData = generateMockData(report);
  
  const handleDownload = () => {
    toast.success("Téléchargement du rapport PDF en cours...");
    // In a real app, this would generate and download a PDF
    setTimeout(() => {
      toast.success("Rapport téléchargé avec succès");
    }, 1500);
  };
  
  const handleShare = () => {
    toast.success("Lien de partage copié dans le presse-papier");
  };

  // Get indicator names based on IDs
  const getIndicatorNames = () => {
    const indicatorMap: Record<string, string> = {
      'revenue': 'Chiffre d\'affaires',
      'margin': 'Marge brute',
      'ebitda': 'EBE',
      'fixedCosts': 'Charges fixes',
      'inventory': 'Niveaux de stock',
      'cashflow': 'Flux de trésorerie',
      'customerAcq': 'Acquisition clients',
      'salesPerf': 'Performance commerciale'
    };
    
    return report.indicators.map(id => indicatorMap[id] || id);
  };

  // Determine which chart to show based on indicators
  const renderChart = () => {
    const indicators = getIndicatorNames();
    
    // If we have revenue data, show a bar chart
    if (report.indicators.includes('revenue')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Chiffre d'affaires" fill="#3b82f6" />
            {report.indicators.includes('ebitda') && (
              <Bar dataKey="EBE" fill="#8b5cf6" />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    // If we have margin or performance data, show a line chart
    if (report.indicators.includes('margin') || report.indicators.includes('salesPerf')) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {report.indicators.includes('margin') && (
              <Line 
                type="monotone" 
                dataKey="Marge brute" 
                stroke="#22c55e" 
                dot={{ r: 4 }}
                strokeWidth={2} 
              />
            )}
            {report.indicators.includes('salesPerf') && (
              <Line 
                type="monotone" 
                dataKey="Performance commerciale" 
                stroke="#f59e0b" 
                dot={{ r: 4 }}
                strokeWidth={2} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    // Default to an area chart for cashflow
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="Trésorerie" 
            fill="#06b6d4" 
            stroke="#0891b2" 
            fillOpacity={0.6} 
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Render data table
  const renderTable = () => {
    const indicators = getIndicatorNames();
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              {indicators.map((indicator, i) => (
                <TableHead key={i}>{indicator}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{item.name}</TableCell>
                {indicators.map((indicator, j) => (
                  <TableCell key={j}>
                    {indicator === 'Marge brute' || indicator === 'Performance commerciale'
                      ? `${(Number(item[indicator]) * 100).toFixed(1)}%`
                      : indicator === 'Nouveaux clients'
                        ? item[indicator]
                        : `${(Number(item[indicator]) / 1000).toFixed(1)} k€`}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Get period label
  const getPeriodLabel = () => {
    const periodMap: Record<string, string> = {
      'weekly': 'Hebdomadaire',
      'monthly': 'Mensuel',
      'quarterly': 'Trimestriel',
      'annual': 'Annuel',
      'custom': 'Personnalisé'
    };
    
    return periodMap[report.period] || report.period;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{report.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{getPeriodLabel()}</Badge>
                <Badge variant="outline">Généré le {new Date().toLocaleDateString()}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="default" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {/* Report Navigation */}
          <div className="flex gap-4 mb-6 border-b">
            <Button 
              variant={activeTab === 'summary' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('summary')}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'summary' ? 'active' : 'inactive'}
            >
              Synthèse
            </Button>
            <Button 
              variant={activeTab === 'chart' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('chart')}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'chart' ? 'active' : 'inactive'}
            >
              Graphique
            </Button>
            <Button 
              variant={activeTab === 'table' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('table')}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              data-state={activeTab === 'table' ? 'active' : 'inactive'}
            >
              Tableau de données
            </Button>
          </div>
          
          {/* Report Content */}
          <div className="mt-4">
            {activeTab === 'summary' && (
              <div>
                <ReportKPISummary report={report} data={mockData} />
                {renderChart()}
                <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">Analyse IA</h3>
                  <p className="text-muted-foreground">
                    Les données {getPeriodLabel().toLowerCase()} montrent 
                    {report.indicators.includes('revenue') && mockData[mockData.length - 1]['Chiffre d\'affaires'] > (mockData[0]['Chiffre d\'affaires'] || 0) 
                      ? ' une progression du chiffre d\'affaires' 
                      : ' une stagnation du chiffre d\'affaires'
                    }
                    {report.indicators.includes('margin') && 
                      (`, avec une marge brute de ${(mockData[mockData.length - 1]['Marge brute'] * 100).toFixed(1)}%`)
                    }.
                    {report.indicators.includes('ebitda') && 
                      ` L'EBE reste ${Number(mockData[mockData.length - 1]['EBE']) > 25000 ? 'satisfaisant' : 'sous surveillance'} à ${(Number(mockData[mockData.length - 1]['EBE']) / 1000).toFixed(0)}k€.`
                    }
                    {report.indicators.includes('fixedCosts') && report.indicators.includes('revenue') && 
                      ` Les charges fixes représentent ${((Number(mockData[mockData.length - 1]['Charges fixes']) / Number(mockData[mockData.length - 1]['Chiffre d\'affaires'])) * 100).toFixed(0)}% du CA.`
                    }
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'chart' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Visualisation graphique</h3>
                  {renderChart()}
                </div>
              </div>
            )}
            
            {activeTab === 'table' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Données détaillées</h3>
                {renderTable()}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
