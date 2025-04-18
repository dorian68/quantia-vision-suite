
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ReportGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateReport: (reportData: ReportData) => void;
}

export interface ReportData {
  title: string;
  type: string;
  period: string;
  indicators: string[];
  id?: string;
  createdAt?: Date;
}

export function ReportGeneratorDialog({ open, onOpenChange, onGenerateReport }: ReportGeneratorDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('performance');
  const [period, setPeriod] = useState('monthly');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  const availableIndicators = [
    { id: 'revenue', label: 'Chiffre d\'affaires' },
    { id: 'margin', label: 'Marge brute' },
    { id: 'ebitda', label: 'EBE' },
    { id: 'fixedCosts', label: 'Charges fixes' },
    { id: 'cashflow', label: 'Flux de trésorerie' },
    { id: 'inventory', label: 'Niveaux de stock' },
    { id: 'customerAcq', label: 'Acquisition clients' },
    { id: 'salesPerf', label: 'Performance commerciale' }
  ];

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Veuillez saisir un titre pour le rapport");
      return;
    }

    if (selectedIndicators.length === 0) {
      toast.error("Veuillez sélectionner au moins un indicateur");
      return;
    }

    const reportData: ReportData = {
      title,
      type,
      period,
      indicators: selectedIndicators,
      id: `report-${Date.now()}`,
      createdAt: new Date()
    };

    onGenerateReport(reportData);
    resetForm();
    onOpenChange(false);
    toast.success("Rapport généré avec succès");
  };

  const resetForm = () => {
    setTitle('');
    setType('performance');
    setPeriod('monthly');
    setSelectedIndicators([]);
  };

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rapport</DialogTitle>
          <DialogDescription>
            Configurez les paramètres de votre rapport pour générer une analyse personnalisée.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre du rapport</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Analyse de performance Q3 2024"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type de rapport</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance globale</SelectItem>
                  <SelectItem value="financial">Financier</SelectItem>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="executive">Comité de direction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="period">Période</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="annual">Annuel</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <FileText className="h-4 w-4" />
            Générer le rapport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
