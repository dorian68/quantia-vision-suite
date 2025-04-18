
import { 
  BarChart3, 
  Download, 
  FileText, 
  Filter, 
  PieChart, 
  RefreshCw, 
  Share2, 
  ShoppingCart, 
  TrendingDown, 
  TrendingUp, 
  Zap
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/assistant/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const revenueData = [
  { name: 'Jan', value: 65000 },
  { name: 'Fév', value: 72000 },
  { name: 'Mar', value: 80000 },
  { name: 'Avr', value: 74000 },
  { name: 'Mai', value: 85000 },
  { name: 'Juin', value: 92000 },
  { name: 'Juil', value: 95000 },
];

const categoriesData = [
  { name: 'Produit A', value: 45000 },
  { name: 'Produit B', value: 28000 },
  { name: 'Produit C', value: 15000 },
  { name: 'Produit D', value: 7000 },
];

const expensesData = [
  { name: 'Jan', value: 32000 },
  { name: 'Fév', value: 35000 },
  { name: 'Mar', value: 38000 },
  { name: 'Avr', value: 36000 },
  { name: 'Mai', value: 40000 },
  { name: 'Juin', value: 42000 },
  { name: 'Juil', value: 45000 },
];

const marginData = [
  { name: 'Jan', value: 51 },
  { name: 'Fév', value: 49 },
  { name: 'Mar', value: 53 },
  { name: 'Avr', value: 48 },
  { name: 'Mai', value: 52 },
  { name: 'Juin', value: 54 },
  { name: 'Juil', value: 53 },
];

const AlertCard = ({ title, message, type }: { title: string; message: string; type: 'warning' | 'success' | 'error' }) => {
  const colors = {
    warning: 'border-quantia-orange bg-quantia-orange/10',
    success: 'border-quantia-green bg-quantia-green/10',
    error: 'border-quantia-red bg-quantia-red/10',
  };
  
  const icons = {
    warning: <TrendingDown className="h-5 w-5 text-quantia-orange" />,
    success: <TrendingUp className="h-5 w-5 text-quantia-green" />,
    error: <Zap className="h-5 w-5 text-quantia-red" />,
  };
  
  return (
    <div className={`rounded-lg border p-4 ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {icons[type]}
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

const PerformancePage = () => {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter">
            Pilotage de la Performance
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Suivez vos KPIs et optimisez votre performance globale
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" className="h-9">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Period selection */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <p className="font-medium">Période :</p>
          <Select defaultValue="Q3-2024">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1-2024">Q1 2024</SelectItem>
              <SelectItem value="Q2-2024">Q2 2024</SelectItem>
              <SelectItem value="Q3-2024">Q3 2024</SelectItem>
              <SelectItem value="year-2024">Année 2024</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Chiffre d'affaires" 
            value="95 000 €" 
            trend={{ value: 8.2, isPositive: true }} 
            color="blue"
          />
          <StatCard 
            title="Marge brute" 
            value="52,6 %" 
            trend={{ value: 0.7, isPositive: true }} 
            color="purple"
          />
          <StatCard 
            title="EBE" 
            value="32 300 €" 
            trend={{ value: 5.4, isPositive: true }} 
            color="green"
          />
          <StatCard 
            title="Charges fixes" 
            value="28 500 €" 
            trend={{ value: 2.1, isPositive: false }} 
            color="orange"
          />
        </div>
      </div>

      {/* Alerts section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Alertes et détection de dérives</h2>
        <div className="space-y-3">
          <AlertCard 
            title="Charges de personnel en hausse" 
            message="Les charges de personnel ont augmenté de 7,2% ce mois-ci, au-dessus du seuil d'alerte de 5%." 
            type="warning" 
          />
          <AlertCard 
            title="Stock produit 'X73' critique" 
            message="Le niveau de stock du produit X73 est à 12% de sa capacité normale. Risque de rupture dans 5 jours." 
            type="error" 
          />
          <AlertCard 
            title="Progression CA dépasse objectifs" 
            message="Votre CA du T3 dépasse les objectifs fixés de 4,3%. Performance excellente sur la gamme premium." 
            type="success" 
          />
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="mb-8">
        <Tabs defaultValue="ca" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ca">Chiffre d'affaires</TabsTrigger>
            <TabsTrigger value="marge">Marge</TabsTrigger>
            <TabsTrigger value="charges">Charges</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>
          <TabsContent value="ca" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <AnalyticsChart
                  data={revenueData}
                  title="Évolution du chiffre d'affaires"
                  description="Les 7 derniers mois"
                  type="area"
                  color="hsl(var(--primary))"
                  height={300}
                  yAxisFormatter={(value) => `${value.toLocaleString()} €`}
                />
              </div>
              <div>
                <AnalyticsChart
                  data={categoriesData}
                  title="Répartition par produit"
                  description="Mois en cours"
                  type="bar"
                  color="#7A5AF8"
                  height={300}
                  yAxisFormatter={(value) => `${value.toLocaleString()} €`}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Analyse IA</CardTitle>
                  <CardDescription>Interprétation augmentée des données</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-quantia-green" />
                        Forces détectées
                      </h4>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>• Croissance soutenue et régulière du CA (+8,2% sur juillet)</li>
                        <li>• Les produits premium représentent 47% du CA total</li>
                        <li>• Taux de conversion en hausse de 3,5 points</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="font-medium flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-quantia-orange" />
                        Points d'attention
                      </h4>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>• Ralentissement des ventes sur la région Sud (-2,7%)</li>
                        <li>• Produit C en baisse de performance (-5,3%)</li>
                        <li>• Coût d'acquisition client en augmentation (+7,1%)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recommandations</CardTitle>
                  <CardDescription>Actions suggérées par l'IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="bg-quantia-blue/10 p-2 rounded-md">
                        <Zap className="h-5 w-5 text-quantia-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium">Optimiser les campagnes marketing</h4>
                        <p className="text-sm text-muted-foreground">Réallouer 15% du budget marketing vers les produits à forte marge (A et B).</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="bg-quantia-purple/10 p-2 rounded-md">
                        <PieChart className="h-5 w-5 text-quantia-purple" />
                      </div>
                      <div>
                        <h4 className="font-medium">Analyser la région Sud</h4>
                        <p className="text-sm text-muted-foreground">Lancer une étude approfondie pour comprendre le ralentissement des ventes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="bg-quantia-green/10 p-2 rounded-md">
                        <ShoppingCart className="h-5 w-5 text-quantia-green" />
                      </div>
                      <div>
                        <h4 className="font-medium">Réviser la stratégie produit C</h4>
                        <p className="text-sm text-muted-foreground">Envisager un repositionnement ou une mise à jour du produit C pour stimuler les ventes.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="marge" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnalyticsChart
                data={marginData}
                title="Évolution de la marge"
                description="Les 7 derniers mois"
                type="line"
                color="#7A5AF8"
                height={300}
                yAxisFormatter={(value) => `${value}%`}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des marges par produit</CardTitle>
                  <CardDescription>Mois en cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-quantia-blue"></div>
                        <span>Produit A</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">58%</span>
                        <span className="text-xs text-quantia-green">+2.3%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-quantia-purple"></div>
                        <span>Produit B</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">52%</span>
                        <span className="text-xs text-quantia-green">+1.5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-quantia-cyan"></div>
                        <span>Produit C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">45%</span>
                        <span className="text-xs text-quantia-red">-0.8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-quantia-green"></div>
                        <span>Produit D</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">48%</span>
                        <span className="text-xs text-muted-foreground">0%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="charges" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnalyticsChart
                data={expensesData}
                title="Évolution des charges"
                description="Les 7 derniers mois"
                type="area"
                color="#FF7849"
                height={300}
                yAxisFormatter={(value) => `${value.toLocaleString()} €`}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des charges</CardTitle>
                  <CardDescription>Mois en cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Personnel</span>
                        <span className="text-sm font-medium">24 300 € (54%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-quantia-purple" style={{ width: '54%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Locaux</span>
                        <span className="text-sm font-medium">8 500 € (19%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-quantia-blue" style={{ width: '19%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Marketing</span>
                        <span className="text-sm font-medium">7 200 € (16%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-quantia-cyan" style={{ width: '16%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Autres charges</span>
                        <span className="text-sm font-medium">5 000 € (11%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-quantia-green" style={{ width: '11%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stock" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Gestion des stocks</CardTitle>
                  <CardDescription>Valeur totale: 58 250 €</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Produits en stock optimal</h4>
                        <span className="text-sm text-quantia-green font-medium">15 produits</span>
                      </div>
                      <div className="text-sm">
                        Produits avec un niveau de stock entre 30% et 80% de la capacité maximale.
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Produits en stock élevé</h4>
                        <span className="text-sm text-quantia-orange font-medium">6 produits</span>
                      </div>
                      <div className="text-sm">
                        Produits avec un niveau de stock supérieur à 80% de la capacité maximale.
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Produits en rupture de stock</h4>
                        <span className="text-sm text-quantia-red font-medium">2 produits</span>
                      </div>
                      <div className="text-sm">
                        Produits avec un niveau de stock inférieur à 10% de la capacité maximale.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Rotation des stocks</CardTitle>
                  <CardDescription>Performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative h-40 w-40 flex items-center justify-center">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          className="text-muted stroke-current"
                          strokeWidth="10"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-quantia-blue stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray="251.2"
                          strokeDashoffset="75.36"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold">7.2</span>
                          <span className="text-sm block text-muted-foreground">rotations/an</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        La rotation des stocks est bonne. Votre stock se renouvelle en moyenne toutes les 7 semaines.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </AppLayout>
  );
};

export default PerformancePage;
