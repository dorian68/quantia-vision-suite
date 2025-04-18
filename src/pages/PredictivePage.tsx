
import { 
  BrainCircuit, 
  CalendarDays, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Download, 
  LineChart, 
  Share2, 
  TrendingDown, 
  TrendingUp,
  Truck,
  Wallet
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/assistant/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// Mock data for cashflow forecast
const cashflowData = [
  { name: 'Août', value: 84000 },
  { name: 'Sept', value: 91000 },
  { name: 'Oct', value: 88000 },
  { name: 'Nov', value: 96000 },
  { name: 'Déc', value: 105000 },
  { name: 'Jan', value: 72000 },
];

// Mock data for scenario comparison
const optimisticData = [
  { name: 'Août', value: 84000 },
  { name: 'Sept', value: 93000 },
  { name: 'Oct', value: 92000 },
  { name: 'Nov', value: 102000 },
  { name: 'Déc', value: 112000 },
  { name: 'Jan', value: 78000 },
];

const pessimisticData = [
  { name: 'Août', value: 84000 },
  { name: 'Sept', value: 86000 },
  { name: 'Oct', value: 82000 },
  { name: 'Nov', value: 88000 },
  { name: 'Déc', value: 96000 },
  { name: 'Jan', value: 66000 },
];

// Mock data for inventory forecast
const inventoryData = [
  { name: 'Août', value: 68 },
  { name: 'Sept', value: 72 },
  { name: 'Oct', value: 64 },
  { name: 'Nov', value: 58 },
  { name: 'Déc', value: 82 },
  { name: 'Jan', value: 75 },
];

const supplyRiskData = [
  { name: 'Produit A', risk: 'low', leadTime: '3 jours', stock: '85%', trend: 'stable' },
  { name: 'Produit B', risk: 'medium', leadTime: '5 jours', stock: '42%', trend: 'decreasing' },
  { name: 'Produit C', risk: 'high', leadTime: '12 jours', stock: '15%', trend: 'decreasing' },
  { name: 'Produit D', risk: 'low', leadTime: '4 jours', stock: '76%', trend: 'increasing' },
  { name: 'Produit E', risk: 'medium', leadTime: '7 jours', stock: '38%', trend: 'stable' },
];

// Supply risk indicator component
const SupplyRiskIndicator = ({ risk }: { risk: 'low' | 'medium' | 'high' }) => {
  const colors = {
    low: 'bg-quantia-green',
    medium: 'bg-quantia-orange',
    high: 'bg-quantia-red',
  };
  
  const labels = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${colors[risk]}`}></span>
      <span className="text-sm">{labels[risk]}</span>
    </div>
  );
};

const ScenarioSelector = () => (
  <div className="p-4 rounded-lg border bg-card">
    <h3 className="font-medium mb-3">Paramètres de simulation</h3>
    
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Croissance CA</span>
          <span className="text-sm font-medium">5.2%</span>
        </div>
        <Slider
          defaultValue={[5.2]}
          max={15}
          min={-5}
          step={0.1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>-5%</span>
          <span>15%</span>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Délai de paiement clients</span>
          <span className="text-sm font-medium">45 jours</span>
        </div>
        <Slider
          defaultValue={[45]}
          max={90}
          min={0}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0j</span>
          <span>90j</span>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Augmentation des charges</span>
          <span className="text-sm font-medium">2.4%</span>
        </div>
        <Slider
          defaultValue={[2.4]}
          max={10}
          min={0}
          step={0.1}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>10%</span>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Évènements exceptionnels</span>
          <Switch />
        </div>
        <Select disabled defaultValue="none">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="investment">Investissement majeur</SelectItem>
            <SelectItem value="expansion">Expansion commerciale</SelectItem>
            <SelectItem value="crisis">Crise sectorielle</SelectItem>
            <SelectItem value="none">Aucun</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-3">
        <Button className="w-full">
          <BrainCircuit className="h-4 w-4 mr-2" />
          Recalculer la prévision
        </Button>
      </div>
    </div>
  </div>
);

const PredictivePage = () => {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter">
            Intelligence Prédictive
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Prévision de trésorerie et optimisation de la supply chain
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <CalendarDays className="h-4 w-4 mr-2" />
            Période
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      {/* Tabs for different predictions */}
      <Tabs defaultValue="cashflow" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cashflow">
            <Wallet className="h-4 w-4 mr-2" />
            Prévision Trésorerie
          </TabsTrigger>
          <TabsTrigger value="supply">
            <Truck className="h-4 w-4 mr-2" />
            Supply Chain
          </TabsTrigger>
        </TabsList>

        {/* Cashflow Forecast Tab */}
        <TabsContent value="cashflow" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Prévision CA T4 2024" 
              value="289 000 €" 
              trend={{ value: 7.2, isPositive: true }} 
              color="blue"
            />
            <StatCard 
              title="Trésorerie min. prévue" 
              value="58 300 €" 
              description="Décembre 2024"
              color="purple"
            />
            <StatCard 
              title="Délai client moyen" 
              value="45 jours" 
              trend={{ value: 2.5, isPositive: true }} 
              color="orange"
            />
            <StatCard 
              title="Seuil d'alerte" 
              value="50 000 €" 
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main cashflow chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Prévision de trésorerie</CardTitle>
                  <CardDescription>Projection sur 6 mois avec scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end mb-2 gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-quantia-blue"></span>
                      <span className="text-xs">Base</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-quantia-green"></span>
                      <span className="text-xs">Optimiste</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-quantia-red"></span>
                      <span className="text-xs">Pessimiste</span>
                    </div>
                  </div>
                  <div className="relative">
                    <AnalyticsChart
                      data={cashflowData}
                      title=""
                      description=""
                      type="line"
                      color="hsl(var(--primary))"
                      height={300}
                      yAxisFormatter={(value) => `${value.toLocaleString()} €`}
                      className="h-72"
                    />
                    <div className="absolute inset-0 pointer-events-none">
                      {/* This would be multiple lines in a real implementation */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Entrées prévisionnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>CA encaissé</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">78 400 €</span>
                          <Badge className="bg-quantia-green/10 text-quantia-green hover:bg-quantia-green/20">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            5.2%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Subventions</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">12 000 €</span>
                          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
                            0%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Financements</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">0 €</span>
                          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
                            0%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium pt-2 border-t">
                        <span>Total entrées</span>
                        <span>90 400 €</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sorties prévisionnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Achats</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">32 500 €</span>
                          <Badge className="bg-quantia-red/10 text-quantia-red hover:bg-quantia-red/20">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            3.8%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Charges fixes</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">28 700 €</span>
                          <Badge className="bg-quantia-orange/10 text-quantia-orange hover:bg-quantia-orange/20">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            2.4%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Salaires</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">24 300 €</span>
                          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
                            0%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium pt-2 border-t">
                        <span>Total sorties</span>
                        <span>85 500 €</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Scenario editor */}
            <div className="lg:col-span-1">
              <ScenarioSelector />
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Analyse prédictive IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-1 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-quantia-blue" />
                        Point bas de trésorerie
                      </h4>
                      <p>Prévu en décembre 2024 avec un montant de 58 300 €, bien au-dessus du seuil d'alerte.</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-1 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-quantia-green" />
                        Opportunité détectée
                      </h4>
                      <p>Surplus de trésorerie en novembre. Considérez un placement court terme ou un réinvestissement.</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-1 flex items-center">
                        <LineChart className="h-4 w-4 mr-1 text-quantia-purple" />
                        Tendance générale
                      </h4>
                      <p>Tendance positive sur l'ensemble de la période, avec une saisonnalité marquée en fin d'année.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Supply Chain Tab */}
        <TabsContent value="supply" className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Stock moyen" 
              value="68%" 
              trend={{ value: 3.2, isPositive: true }} 
              color="blue"
            />
            <StatCard 
              title="Produits à risque" 
              value="2" 
              description="5 produits suivis"
              color="red"
            />
            <StatCard 
              title="Lead time moyen" 
              value="5.2 jours" 
              trend={{ value: 0.3, isPositive: false }} 
              color="green"
            />
            <StatCard 
              title="Coût de stockage" 
              value="4 300 €/mois" 
              trend={{ value: 1.2, isPositive: false }} 
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Prévision des niveaux de stock</CardTitle>
                  <CardDescription>Évolution et seuils sur 6 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    data={inventoryData}
                    title=""
                    description=""
                    type="area"
                    color="#00BD9D"
                    height={300}
                    yAxisFormatter={(value) => `${value}%`}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analyse des risques supply chain</CardTitle>
                  <CardDescription>Produits critiques et délais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-3 font-medium">Produit</th>
                          <th className="text-left pb-3 font-medium">Risque</th>
                          <th className="text-left pb-3 font-medium">Lead time</th>
                          <th className="text-left pb-3 font-medium">Stock</th>
                          <th className="text-left pb-3 font-medium">Tendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplyRiskData.map((item, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-3 font-medium">{item.name}</td>
                            <td className="py-3">
                              <SupplyRiskIndicator risk={item.risk as 'low' | 'medium' | 'high'} />
                            </td>
                            <td className="py-3">{item.leadTime}</td>
                            <td className="py-3">{item.stock}</td>
                            <td className="py-3">
                              {item.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-quantia-green" />}
                              {item.trend === 'decreasing' && <TrendingDown className="h-4 w-4 text-quantia-red" />}
                              {item.trend === 'stable' && <span className="text-muted-foreground">–</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Paramètres d'optimisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Niveau de stock cible</span>
                        <span className="text-sm font-medium">70%</span>
                      </div>
                      <Slider
                        defaultValue={[70]}
                        max={100}
                        min={20}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>20%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Marge de sécurité</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <Slider
                        defaultValue={[15]}
                        max={50}
                        min={5}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>50%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Lead time max toléré</span>
                        <span className="text-sm font-medium">10 jours</span>
                      </div>
                      <Slider
                        defaultValue={[10]}
                        max={30}
                        min={1}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1j</span>
                        <span>30j</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium">Mode saisonnier</span>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Optimisation coûts</span>
                      <Switch defaultChecked />
                    </div>

                    <div className="pt-3">
                      <Button className="w-full">
                        <BrainCircuit className="h-4 w-4 mr-2" />
                        Optimiser la supply chain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertes automatiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-quantia-red/10 rounded-lg">
                      <div className="mt-0.5 text-quantia-red">
                        <ChevronDown className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Rupture imminente</h4>
                        <p className="text-xs">Produit C en risque de rupture dans 5 jours. Commander immédiatement.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-quantia-orange/10 rounded-lg">
                      <div className="mt-0.5 text-quantia-orange">
                        <ChevronDown className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Niveau critique</h4>
                        <p className="text-xs">Produit B sous le seuil de 50%. Planifier réapprovisionnement.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-quantia-green/10 rounded-lg">
                      <div className="mt-0.5 text-quantia-green">
                        <ChevronUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Surstock détecté</h4>
                        <p className="text-xs">Le produit D dépasse 75% depuis 30 jours. Envisager une promotion.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Assistant */}
      <AIAssistant />
    </AppLayout>
  );
};

export default PredictivePage;
