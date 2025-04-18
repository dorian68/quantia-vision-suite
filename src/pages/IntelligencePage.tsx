
import { useState } from 'react';
import { 
  Bot, 
  BrainCircuit, 
  FileText, 
  MessagesSquare, 
  Send, 
  Share2, 
  Sparkles,
  PanelLeft, 
  RotateCw, 
  Table, 
  Link as LinkIcon,
  Download,
  LayoutDashboard,
  ChartPie
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AIAssistant } from '@/components/assistant/AIAssistant';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportGeneratorDialog, ReportData } from '@/components/intelligence/ReportGeneratorDialog';
import { ReportViewer } from '@/components/intelligence/ReportViewer';
import { CustomDashboardCreator, CustomDashboard } from '@/components/intelligence/CustomDashboardCreator';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { toast } from 'sonner';

const ReportCard = ({ title, description, tags, date, onView }: {
  title: string;
  description: string;
  tags: string[];
  date: string;
  onView: () => void;
}) => (
  <Card className="overflow-hidden h-full flex flex-col">
    <div className="h-32 bg-muted relative">
      <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
        <FileText className="h-10 w-10 text-primary/40" />
      </div>
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="pb-2 flex-grow">
      <div className="flex flex-wrap gap-1 mb-3">
        {tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Dernière mise à jour: {date}
      </p>
    </CardContent>
    <CardFooter className="pt-0 flex justify-between">
      <Button variant="ghost" size="sm">
        <Share2 className="h-4 w-4 mr-2" />
        Partager
      </Button>
      <Button size="sm" onClick={onView}>
        Consulter
      </Button>
    </CardFooter>
  </Card>
);

const DashboardCard = ({ title, description, visual, onView }: {
  title: string;
  description?: string;
  visual: string;
  onView: () => void;
}) => {
  // Map visual type to icon
  const getVisualIcon = () => {
    switch(visual) {
      case 'cards': return LayoutDashboard;
      case 'table': return Table;
      case 'bar': case 'line': return ChartPie;
      case 'pie': return ChartPie;
      default: return LayoutDashboard;
    }
  };
  
  const VisualIcon = getVisualIcon();
  
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-quantia-blue to-quantia-purple flex items-center justify-center text-white">
        <VisualIcon className="h-14 w-14 opacity-50" />
      </div>
      <CardContent className="pt-4">
        <h3 className="text-xl font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description || 'Tableau de bord personnalisé'}
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Aperçu</Button>
          <Button size="sm" onClick={onView}>Modifier</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ChatMessage = ({ content, isUser }: { content: string; isUser: boolean }) => (
  <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
    <Avatar className="h-8 w-8 mt-1">
      {isUser ? (
        <>
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-primary/10 text-primary">US</AvatarFallback>
        </>
      ) : (
        <>
          <AvatarImage src="" alt="AI" />
          <AvatarFallback className="bg-quantia-purple/10 text-quantia-purple"><BrainCircuit className="h-4 w-4" /></AvatarFallback>
        </>
      )}
    </Avatar>
    <div className={`max-w-[80%] p-3 rounded-lg ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
      <p className="text-sm">{content}</p>
    </div>
  </div>
);

// Suggestion card for IA recommendations
const SuggestionCard = ({ title, description, icon: Icon, onClick }: {
  title: string;
  description: string;
  icon: typeof BrainCircuit;
  onClick?: () => void;
}) => (
  <Card 
    className="border-dashed cursor-pointer transition-all duration-300 hover:border-primary hover:bg-primary/5"
    onClick={onClick}
  >
    <CardContent className="p-4 flex gap-3">
      <div className="bg-primary/10 p-2 rounded-md h-fit">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const IntelligencePage = () => {
  const [message, setMessage] = useState('');
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showDashboardCreator, setShowDashboardCreator] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showReportViewer, setShowReportViewer] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: 'report-1',
      title: 'Rapport mensuel de performance',
      description: 'Synthèse complète des indicateurs clés de juillet 2024',
      type: 'performance',
      period: 'monthly',
      indicators: ['revenue', 'margin', 'ebitda', 'fixedCosts'],
      createdAt: new Date('2024-08-01')
    },
    {
      id: 'report-2',
      title: 'Analyse de rentabilité par client',
      description: 'Étude détaillée de la profitabilité par segment client',
      type: 'financial',
      period: 'quarterly',
      indicators: ['margin', 'costs', 'clients'],
      createdAt: new Date('2024-07-28')
    }
  ]);
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([]);
  
  const handleSendMessage = () => {
    // This would handle the message sending in a real implementation
    if (!message.trim()) return;
    
    // Handle message logic here
    // For our MVP, we'll just show a toast to confirm receipt
    toast.success("Message envoyé à l'assistant IA");
    setMessage('');
  };
  
  const handleGenerateReport = (reportData: ReportData) => {
    setReports(prev => [reportData, ...prev]);
  };
  
  const handleViewReport = (report: ReportData) => {
    setSelectedReport(report);
    setShowReportViewer(true);
  };
  
  const handleSaveDashboard = (dashboard: CustomDashboard) => {
    setDashboards(prev => [dashboard, ...prev]);
  };
  
  const handleSuggestionClick = (suggestionType: string) => {
    switch(suggestionType) {
      case 'profitability':
        setShowReportGenerator(true);
        toast.info("Assistant IA : Créons une analyse de rentabilité");
        break;
      case 'cashflow':
        setShowReportGenerator(true);
        toast.info("Assistant IA : Configurons une prévision de trésorerie");
        break;
      case 'inventory':
        setShowDashboardCreator(true);
        toast.info("Assistant IA : Préparons un tableau d'optimisation des stocks");
        break;
      case 'performance':
        setShowReportGenerator(true);
        toast.info("Assistant IA : Générons un rapport de performance");
        break;
      default:
        toast.info("Fonctionnalité en développement");
    }
  };

  const generateReportPDF = () => {
    toast.success("Génération du rapport PDF en cours...");
    setTimeout(() => {
      toast.success("Rapport PDF généré avec succès");
    }, 1500);
  };
  
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter">
            Intelligence Assistée
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Automatisez vos analyses et bénéficiez d'un conseiller virtuel proactif
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAdminDashboard(true)}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assistant">
            <MessagesSquare className="h-4 w-4 mr-2" />
            Assistant IA
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            Générateur de rapports
          </TabsTrigger>
          <TabsTrigger value="dashboards">
            <Table className="h-4 w-4 mr-2" />
            Tableaux personnalisés
          </TabsTrigger>
        </TabsList>

        {/* Assistant IA */}
        <TabsContent value="assistant" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar with suggestions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggestions</CardTitle>
                  <CardDescription>Analyses recommandées par l'IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-4 pb-4">
                  <SuggestionCard
                    title="Analyser la rentabilité"
                    description="Examen détaillé des marges par produit et client"
                    icon={Sparkles}
                    onClick={() => handleSuggestionClick('profitability')}
                  />
                  <SuggestionCard
                    title="Prévision de trésorerie"
                    description="Projection des flux financiers sur les 3 prochains mois"
                    icon={BrainCircuit}
                    onClick={() => handleSuggestionClick('cashflow')}
                  />
                  <SuggestionCard
                    title="Optimisation des stocks"
                    description="Identification des produits à réapprovisionner"
                    icon={RotateCw}
                    onClick={() => handleSuggestionClick('inventory')}
                  />
                  <SuggestionCard
                    title="Rapport de performance"
                    description="Synthèse des KPIs et recommandations"
                    icon={FileText}
                    onClick={() => handleSuggestionClick('performance')}
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-stretch pt-0">
                  <div className="bg-muted/30 p-3 rounded-lg mb-3">
                    <h3 className="font-medium text-sm mb-1 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Intégrations disponibles
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">Slack</Badge>
                      <Badge variant="outline" className="text-xs">Email</Badge>
                      <Badge variant="outline" className="text-xs">Webhooks</Badge>
                      <Badge variant="outline" className="text-xs">API</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-start">
                    <PanelLeft className="h-4 w-4 mr-2" />
                    Configurer les intégrations
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Main chat area */}
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-quantia-purple/10 p-2 rounded-full">
                        <BrainCircuit className="h-5 w-5 text-quantia-purple" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Assistant QuantIA</CardTitle>
                        <CardDescription>Conseiller stratégique intelligent</CardDescription>
                      </div>
                    </div>
                    <Select defaultValue="business">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="analysis">Analyse</SelectItem>
                        <SelectItem value="technical">Technique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4 border-y">
                  <div className="space-y-4">
                    <ChatMessage 
                      isUser={false} 
                      content="Bonjour ! Je suis votre assistant OptiQuantIA. Comment puis-je vous aider aujourd'hui ?"
                    />
                    <ChatMessage 
                      isUser={true} 
                      content="Pouvez-vous me donner un aperçu de nos performances ce mois-ci ?"
                    />
                    <ChatMessage 
                      isUser={false} 
                      content="Bien sûr ! Voici un résumé des performances de juillet 2024 :
                      
- Chiffre d'affaires : 95 000 € (+8,2% vs juin)
- Marge brute : 42 750 € (taux de 45%)
- EBE : 32 300 € (+5,4% vs juin)
- Charges fixes : 28 500 € (+2,1% vs juin)

Points forts : Excellente progression du CA, notamment sur les produits premium.
Points d'attention : Légère hausse des charges fixes à surveiller.

Souhaitez-vous une analyse plus détaillée sur un aspect particulier ?"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <div className="flex w-full items-center gap-2">
                    <Textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Posez une question ou demandez une analyse..."
                      className="min-h-10 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button className="bg-primary" size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Générateur de rapports */}
        <TabsContent value="reports" className="pt-4">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Rapports</h2>
              <p className="text-muted-foreground">Générez et consultez des analyses détaillées</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Importer modèle
              </Button>
              <Button onClick={() => setShowReportGenerator(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Nouveau rapport
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                description={report.description || ''}
                tags={[
                  report.type === 'performance' ? 'Performance' : 
                  report.type === 'financial' ? 'Financier' : 
                  report.type === 'operational' ? 'Opérationnel' : 
                  report.type === 'commercial' ? 'Commercial' : 
                  report.type === 'executive' ? 'Direction' : report.type,
                  report.period === 'monthly' ? 'Mensuel' : 
                  report.period === 'quarterly' ? 'Trimestriel' : 
                  report.period === 'annual' ? 'Annuel' : 
                  report.period
                ]}
                date={report.createdAt ? report.createdAt.toLocaleDateString() : 'N/A'}
                onView={() => handleViewReport(report)}
              />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed h-full p-6">
              <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Créer un rapport</h3>
              <p className="text-center text-muted-foreground mb-4">
                Générez un nouveau rapport personnalisé avec l'IA
              </p>
              <Button onClick={() => setShowReportGenerator(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Nouveau rapport
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* Tableaux personnalisés */}
        <TabsContent value="dashboards" className="pt-4">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Tableaux de bord personnalisés</h2>
              <p className="text-muted-foreground">Créez des visualisations selon vos besoins spécifiques</p>
            </div>
            <Button onClick={() => setShowDashboardCreator(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Nouveau tableau
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <DashboardCard
                key={dashboard.id}
                title={dashboard.title}
                description={dashboard.description}
                visual={dashboard.visualType}
                onView={() => setShowDashboardCreator(true)}
              />
            ))}
            
            {dashboards.length === 0 && (
              <>
                <Card className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-quantia-blue to-quantia-purple flex items-center justify-center text-white">
                    <Table className="h-14 w-14 opacity-50" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-medium mb-1">Performance commerciale</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyse des ventes par produit, région et commercial
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm" onClick={() => setShowDashboardCreator(true)}>Modifier</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-quantia-green to-quantia-cyan flex items-center justify-center text-white">
                    <Table className="h-14 w-14 opacity-50" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-medium mb-1">Rentabilité par produit</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Décomposition des marges et analyse des coûts
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm" onClick={() => setShowDashboardCreator(true)}>Modifier</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-quantia-orange to-quantia-red flex items-center justify-center text-white">
                    <Table className="h-14 w-14 opacity-50" />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-medium mb-1">Flux de trésorerie</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Suivi des entrées et sorties financières
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm" onClick={() => setShowDashboardCreator(true)}>Modifier</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="mt-8 border rounded-lg p-6 bg-muted/30">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BrainCircuit className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Suggestions IA</h3>
                <p className="text-muted-foreground mb-4">
                  Basées sur vos données, voici des tableaux de bord que notre IA recommande de créer :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card 
                    className="bg-background hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setShowDashboardCreator(true)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">Analyse clients inactifs</h4>
                      <p className="text-sm text-muted-foreground">
                        Identification des clients sans commande depuis 3 mois
                      </p>
                    </CardContent>
                  </Card>
                  <Card 
                    className="bg-background hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setShowDashboardCreator(true)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">Gestion des achats</h4>
                      <p className="text-sm text-muted-foreground">
                        Optimisation des coûts et des fournisseurs
                      </p>
                    </CardContent>
                  </Card>
                  <Card 
                    className="bg-background hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setShowDashboardCreator(true)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">KPIs opérationnels</h4>
                      <p className="text-sm text-muted-foreground">
                        Indicateurs de productivité et d'efficacité
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Generator Dialog */}
      <ReportGeneratorDialog 
        open={showReportGenerator}
        onOpenChange={setShowReportGenerator}
        onGenerateReport={handleGenerateReport}
      />
      
      {/* Report Viewer Dialog */}
      <ReportViewer
        open={showReportViewer}
        onOpenChange={setShowReportViewer}
        report={selectedReport}
      />
      
      {/* Custom Dashboard Creator Dialog */}
      <CustomDashboardCreator
        open={showDashboardCreator}
        onOpenChange={setShowDashboardCreator}
        onSaveDashboard={handleSaveDashboard}
      />
      
      {/* Admin Dashboard Dialog */}
      <AdminDashboard
        open={showAdminDashboard}
        onOpenChange={setShowAdminDashboard}
        reports={reports}
        dashboards={dashboards}
      />

      {/* AI Assistant */}
      <AIAssistant />
    </AppLayout>
  );
};

export default IntelligencePage;
