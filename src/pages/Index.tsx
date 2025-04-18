
import { BarChart3, BrainCircuit, MoveRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/assistant/AIAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

const ModuleCard = ({
  title,
  description,
  icon: Icon,
  color,
  link,
}: {
  title: string;
  description: string;
  icon: typeof BarChart3;
  color: string;
  link: string;
}) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/50">
    <CardHeader className={`bg-gradient-to-r ${color} p-4`}>
      <div className="flex items-center justify-between">
        <CardTitle className="text-white text-lg">{title}</CardTitle>
        <div className="bg-white/20 p-2 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardDescription className="mb-4">{description}</CardDescription>
      <Button variant="ghost" className="group w-full justify-between" asChild>
        <Link to={link}>
          Explorer le module
          <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Bienvenue dans <span className="text-gradient">OptiQuantIA</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          La plateforme d'intelligence quantitative pour piloter votre entreprise avec précision
        </p>
      </div>

      {/* Value proposition */}
      <div className="mb-10 p-6 bg-card border rounded-xl">
        <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
        <p className="text-lg mb-4">
          Mettre la puissance de l'analyse quantitative au service de toutes les entreprises, 
          pas seulement des grandes structures.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Démocratisation de l'expertise</h3>
              <p className="text-sm text-muted-foreground">
                Nous rendons accessibles les outils d'analyse avancés à toutes les entreprises.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Innovation accessible</h3>
              <p className="text-sm text-muted-foreground">
                Nous intégrons les dernières technologies d'IA dans une interface intuitive.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Clarté des analyses complexes</h3>
              <p className="text-sm text-muted-foreground">
                Nous transformons les données complexes en insights actionnables.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Accompagnement intelligent</h3>
              <p className="text-sm text-muted-foreground">
                Notre IA vous guide et vous conseille dans vos prises de décision.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key metrics overview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Chiffre d'affaires" 
            value="95 000 €" 
            trend={{ value: 8.2, isPositive: true }} 
            color="blue"
          />
          <StatCard 
            title="Marge brute" 
            value="42 750 €" 
            trend={{ value: 5.3, isPositive: true }} 
            color="purple"
          />
          <StatCard 
            title="Trésorerie" 
            value="125 430 €" 
            trend={{ value: 12.1, isPositive: true }} 
            color="green"
          />
          <StatCard 
            title="Stock" 
            value="58 250 €" 
            trend={{ value: 3.5, isPositive: false }} 
            color="orange"
          />
        </div>
      </div>

      {/* Revenue chart */}
      <div className="mb-10">
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

      {/* Modules */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Nos modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard
            title="Pilotage de la Performance"
            description="Suivez vos KPIs, détectez les écarts et optimisez votre performance globale."
            icon={BarChart3}
            color="from-quantia-blue to-quantia-cyan"
            link="/performance"
          />
          <ModuleCard
            title="Intelligence Assistée"
            description="Automatisez vos analyses et bénéficiez d'un conseiller virtuel proactif."
            icon={BrainCircuit}
            color="from-quantia-purple to-quantia-indigo"
            link="/intelligence"
          />
          <ModuleCard
            title="Intelligence Prédictive"
            description="Prévoyez votre trésorerie et optimisez votre supply chain grâce à l'IA."
            icon={TrendingUp}
            color="from-quantia-green to-quantia-cyan"
            link="/predictive"
          />
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </AppLayout>
  );
};

export default Index;
