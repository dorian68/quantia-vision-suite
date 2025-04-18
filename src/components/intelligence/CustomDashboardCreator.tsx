
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/dashboard/StatCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LayoutDashboard, Save, Table as TableIcon, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CustomDashboardCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveDashboard: (dashboard: CustomDashboard) => void;
}

export interface CustomDashboard {
  id: string;
  title: string;
  description: string;
  indicators: string[];
  layout: string;
  visualType: string;
  createdAt: Date;
}

type LayoutOption = 'grid' | 'list' | 'split';
type VisualType = 'cards' | 'table' | 'bar' | 'line' | 'pie';

// Helper function to generate mock data for indicators
const generateMockData = (indicators: string[]) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  
  return months.map(month => {
    const data: Record<string, any> = { name: month };
    
    indicators.forEach(indicator => {
      switch(indicator) {
        case 'revenue':
          data['CA'] = Math.floor(80000 + Math.random() * 50000);
          break;
        case 'margin':
          data['Marge'] = Math.floor(30000 + Math.random() * 20000);
          break;
        case 'costs':
          data['Charges'] = Math.floor(25000 + Math.random() * 15000);
          break;
        case 'cash':
          data['Trésorerie'] = Math.floor(40000 + Math.random() * 30000);
          break;
        case 'inventory':
          data['Stock'] = Math.floor(60000 + Math.random() * 25000);
          break;
        case 'clients':
          data['Clients'] = Math.floor(20 + Math.random() * 15);
          break;
        case 'orders':
          data['Commandes'] = Math.floor(40 + Math.random() * 30);
          break;
        case 'satisfaction':
          data['Satisfaction'] = Math.floor(70 + Math.random() * 25);
          break;
      }
    });
    
    return data;
  });
};

export function CustomDashboardCreator({ open, onOpenChange, onSaveDashboard }: CustomDashboardCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutOption>('grid');
  const [visualType, setVisualType] = useState<VisualType>('cards');
  const [activeTab, setActiveTab] = useState('config');
  
  const availableIndicators = [
    { id: 'revenue', label: 'Chiffre d\'affaires' },
    { id: 'margin', label: 'Marge brute' },
    { id: 'costs', label: 'Charges' },
    { id: 'cash', label: 'Trésorerie' },
    { id: 'inventory', label: 'Stock' },
    { id: 'clients', label: 'Clients' },
    { id: 'orders', label: 'Commandes' },
    { id: 'satisfaction', label: 'Satisfaction client' }
  ];

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre pour le tableau de bord");
      return;
    }

    if (selectedIndicators.length === 0) {
      toast.error("Veuillez sélectionner au moins un indicateur");
      return;
    }

    const dashboard: CustomDashboard = {
      id: `dashboard-${Date.now()}`,
      title,
      description,
      indicators: selectedIndicators,
      layout,
      visualType,
      createdAt: new Date()
    };

    onSaveDashboard(dashboard);
    resetForm();
    onOpenChange(false);
    toast.success("Tableau de bord créé avec succès");
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedIndicators([]);
    setLayout('grid');
    setVisualType('cards');
    setActiveTab('config');
  };
  
  // Generate mock data for preview
  const mockData = generateMockData(selectedIndicators);
  
  // Get last month's data for KPI cards
  const getLatestMonthData = () => {
    return mockData.length > 0 ? mockData[mockData.length - 1] : {};
  };
  
  // Get label for indicator
  const getIndicatorLabel = (id: string) => {
    const indicator = availableIndicators.find(ind => ind.id === id);
    return indicator ? indicator.label : id;
  };
  
  // Preview renderer based on selected visualization type
  const renderPreview = () => {
    if (selectedIndicators.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <LayoutDashboard className="h-12 w-12 mb-4" />
          <p>Sélectionnez des indicateurs pour visualiser votre tableau de bord</p>
        </div>
      );
    }
    
    switch(visualType) {
      case 'cards':
        return renderCardsPreview();
      case 'table':
        return renderTablePreview();
      case 'bar':
        return renderBarChartPreview();
      case 'line':
        return renderLineChartPreview();
      case 'pie':
        return renderPieChartPreview();
      default:
        return renderCardsPreview();
    }
  };
  
  // Cards visualization
  const renderCardsPreview = () => {
    const latestData = getLatestMonthData();
    const COLORS = ['blue', 'purple', 'green', 'orange', 'cyan', 'red'];
    
    return (
      <div className={`grid ${layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
        {selectedIndicators.map((indicator, index) => {
          let value = latestData[getIndicatorShortLabel(indicator)];
          
          // Format value based on indicator type
          if (['revenue', 'margin', 'costs', 'cash', 'inventory'].includes(indicator)) {
            value = `${(value / 1000).toFixed(0)} k€`;
          } else if (indicator === 'satisfaction') {
            value = `${value}%`;
          }
          
          return (
            <StatCard
              key={indicator}
              title={getIndicatorLabel(indicator)}
              value={value}
              color={COLORS[index % COLORS.length] as any}
            />
          );
        })}
      </div>
    );
  };
  
  // Table visualization
  const renderTablePreview = () => {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Période</TableHead>
              {selectedIndicators.map(ind => (
                <TableHead key={ind}>{getIndicatorShortLabel(ind)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{row.name}</TableCell>
                {selectedIndicators.map(ind => (
                  <TableCell key={ind}>
                    {formatCellValue(ind, row[getIndicatorShortLabel(ind)])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  // Bar chart visualization
  const renderBarChartPreview = () => {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {selectedIndicators.map((ind, index) => {
              const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444'];
              return (
                <Bar 
                  key={ind} 
                  dataKey={getIndicatorShortLabel(ind)} 
                  fill={COLORS[index % COLORS.length]} 
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Line chart visualization
  const renderLineChartPreview = () => {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {selectedIndicators.map((ind, index) => {
              const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444'];
              return (
                <Line 
                  key={ind} 
                  type="monotone" 
                  dataKey={getIndicatorShortLabel(ind)} 
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Pie chart visualization
  const renderPieChartPreview = () => {
    // For pie chart, we only use the latest month data
    const latestData = getLatestMonthData();
    const pieData = selectedIndicators.map(ind => ({
      name: getIndicatorShortLabel(ind),
      value: latestData[getIndicatorShortLabel(ind)]
    }));
    
    const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444'];
    
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  // Helper function to get short label for indicator
  const getIndicatorShortLabel = (id: string) => {
    switch(id) {
      case 'revenue': return 'CA';
      case 'margin': return 'Marge';
      case 'costs': return 'Charges';
      case 'cash': return 'Trésorerie';
      case 'inventory': return 'Stock';
      case 'clients': return 'Clients';
      case 'orders': return 'Commandes';
      case 'satisfaction': return 'Satisfaction';
      default: return id;
    }
  };
  
  // Helper function to format cell value based on indicator type
  const formatCellValue = (indicator: string, value: number) => {
    if (['revenue', 'margin', 'costs', 'cash', 'inventory'].includes(indicator)) {
      return `${(value / 1000).toFixed(0)} k€`;
    } else if (indicator === 'satisfaction') {
      return `${value}%`;
    }
    return value;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Créer un tableau de bord personnalisé</DialogTitle>
          <DialogDescription>
            Configurez les indicateurs et la visualisation de votre tableau de bord
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre du tableau de bord</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Suivi commercial mensuel"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Visualisation des indicateurs commerciaux clés"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Indicateurs à inclure</Label>
                <div className="grid grid-cols-2 gap-3 border rounded-md p-3">
                  {availableIndicators.map((indicator) => (
                    <div key={indicator.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`indicator-${indicator.id}`} 
                        checked={selectedIndicators.includes(indicator.id)}
                        onCheckedChange={() => toggleIndicator(indicator.id)}
                      />
                      <Label 
                        htmlFor={`indicator-${indicator.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {indicator.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="layout">Mise en page</Label>
                  <Select value={layout} onValueChange={(val) => setLayout(val as LayoutOption)}>
                    <SelectTrigger id="layout">
                      <SelectValue placeholder="Choisir une mise en page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grille</SelectItem>
                      <SelectItem value="list">Liste</SelectItem>
                      <SelectItem value="split">Divisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="visualType">Type de visualisation</Label>
                  <Select value={visualType} onValueChange={(val) => setVisualType(val as VisualType)}>
                    <SelectTrigger id="visualType">
                      <SelectValue placeholder="Choisir un type de visualisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">Cartes KPI</SelectItem>
                      <SelectItem value="table">Tableau</SelectItem>
                      <SelectItem value="bar">Graphique à barres</SelectItem>
                      <SelectItem value="line">Graphique linéaire</SelectItem>
                      <SelectItem value="pie">Graphique circulaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="py-4">
            <div className="mb-4 pb-4 border-b">
              <h3 className="text-lg font-medium">{title || 'Aperçu du tableau de bord'}</h3>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {renderPreview()}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            Enregistrer le tableau de bord
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
