
import { User, Settings, Building, CreditCard, Bell, Mail, Lock, LogOut } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AIAssistant } from '@/components/assistant/AIAssistant';

const ProfilePage = () => {
  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter">
          Mon Profil
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="text-xl">US</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">Utilisateur Demo</h2>
                <p className="text-sm text-muted-foreground">demo@optiquantia.com</p>
                <div className="mt-3 bg-primary/10 px-3 py-1 rounded-full text-xs font-medium text-primary">
                  Plan Pro
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Building className="h-4 w-4 mr-2" />
                  Entreprise
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Abonnement
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Préférences
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Utilisation du compte</CardTitle>
              <CardDescription>Statistiques d'utilisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Stockage</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">450 Mo sur 1 Go</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Rapports</span>
                    <span className="text-sm">75%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">15 sur 20 par mois</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Tableaux</span>
                    <span className="text-sm">30%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '30%' }}></div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">3 sur 10 tableaux</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Profil</TabsTrigger>
              <TabsTrigger value="company">Entreprise</TabsTrigger>
              <TabsTrigger value="subscription">Abonnement</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            {/* Personal Tab */}
            <TabsContent value="personal" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Gérez vos informations de contact</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="firstName">Prénom</label>
                        <Input id="firstName" placeholder="Prénom" defaultValue="Utilisateur" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="lastName">Nom</label>
                        <Input id="lastName" placeholder="Nom" defaultValue="Demo" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">Email</label>
                      <Input id="email" type="email" placeholder="Email" defaultValue="demo@optiquantia.com" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="phone">Téléphone</label>
                      <Input id="phone" placeholder="Téléphone" defaultValue="+33 6 12 34 56 78" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="position">Fonction</label>
                      <Input id="position" placeholder="Fonction" defaultValue="Directeur Financier" />
                    </div>

                    <div className="pt-4">
                      <Button>Enregistrer les changements</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Préférences de communication</CardTitle>
                  <CardDescription>Gérez les notifications et communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Emails de rapport</h4>
                        <p className="text-sm text-muted-foreground">Recevoir des rapports hebdomadaires par email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Alertes importantes</h4>
                        <p className="text-sm text-muted-foreground">Notifications en cas de dépassement de seuils critiques</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mises à jour produit</h4>
                        <p className="text-sm text-muted-foreground">Recevoir les annonces de nouvelles fonctionnalités</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Conseils d'utilisation</h4>
                        <p className="text-sm text-muted-foreground">Conseils pour optimiser votre utilisation</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Tab */}
            <TabsContent value="company" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations entreprise</CardTitle>
                  <CardDescription>Gérez les détails de votre entreprise</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="companyName">Nom de l'entreprise</label>
                      <Input id="companyName" placeholder="Nom de l'entreprise" defaultValue="OptiQuantIA Demo" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="industry">Secteur d'activité</label>
                        <Input id="industry" placeholder="Secteur" defaultValue="Services financiers" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="size">Taille de l'entreprise</label>
                        <Input id="size" placeholder="Effectif" defaultValue="50-100 employés" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="address">Adresse</label>
                      <Input id="address" placeholder="Adresse" defaultValue="123 Rue de la Finance" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="zipCode">Code postal</label>
                        <Input id="zipCode" placeholder="Code postal" defaultValue="75008" />
                      </div>
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-sm font-medium" htmlFor="city">Ville</label>
                        <Input id="city" placeholder="Ville" defaultValue="Paris" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="country">Pays</label>
                        <Input id="country" placeholder="Pays" defaultValue="France" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="vatNumber">Numéro TVA</label>
                        <Input id="vatNumber" placeholder="Numéro TVA" defaultValue="FR12345678901" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="siret">SIRET</label>
                        <Input id="siret" placeholder="SIRET" defaultValue="12345678901234" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button>Enregistrer les changements</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Équipe</CardTitle>
                  <CardDescription>Gérez les accès utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Utilisateur Demo</h4>
                          <p className="text-xs text-muted-foreground">demo@optiquantia.com</p>
                        </div>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Admin
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Jean Dupont</h4>
                          <p className="text-xs text-muted-foreground">j.dupont@example.com</p>
                        </div>
                      </div>
                      <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        Utilisateur
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>ML</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Marie Leroy</h4>
                          <p className="text-xs text-muted-foreground">m.leroy@example.com</p>
                        </div>
                      </div>
                      <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        Lecture seule
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Ajouter un utilisateur
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Votre abonnement actuel</CardTitle>
                  <CardDescription>Plan Pro - 99€/mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium">Facturation mensuelle</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Votre prochain paiement de 99€ sera prélevé le 15/08/2024
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Fonctionnalités incluses :</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Tous les modules</span>
                          <p className="text-xs text-muted-foreground">Pilotage, Intelligence, Prédiction</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Jusqu'à 5 utilisateurs</span>
                          <p className="text-xs text-muted-foreground">Accès multi-utilisateurs avec permissions</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">20 rapports/mois</span>
                          <p className="text-xs text-muted-foreground">Générateur de rapports avancés</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">Support prioritaire</span>
                          <p className="text-xs text-muted-foreground">Temps de réponse sous 4h</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium">1 Go de stockage</span>
                          <p className="text-xs text-muted-foreground">Pour vos rapports et tableaux personnalisés</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline">Changer de plan</Button>
                    <Button variant="default">Gérer le paiement</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Historique de facturation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <h4 className="font-medium">15 Juillet 2024</h4>
                        <p className="text-xs text-muted-foreground">Abonnement mensuel - Plan Pro</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">99,00 €</p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Facture
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <h4 className="font-medium">15 Juin 2024</h4>
                        <p className="text-xs text-muted-foreground">Abonnement mensuel - Plan Pro</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">99,00 €</p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Facture
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <h4 className="font-medium">15 Mai 2024</h4>
                        <p className="text-xs text-muted-foreground">Abonnement mensuel - Plan Pro</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">99,00 €</p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Facture
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>Gérez vos identifiants et paramètres de sécurité</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="currentPassword">Mot de passe actuel</label>
                      <Input id="currentPassword" type="password" placeholder="••••••••" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="newPassword">Nouveau mot de passe</label>
                      <Input id="newPassword" type="password" placeholder="••••••••" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" />
                    </div>

                    <div className="pt-4">
                      <Button>Mettre à jour le mot de passe</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Options de sécurité avancées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Authentification à deux facteurs
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Ajoutez une couche de sécurité supplémentaire à votre compte
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Alertes de connexion
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Recevez une notification lors de nouvelles connexions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Sessions actives
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Gérez les appareils connectés à votre compte
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Gérer
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="destructive" className="mt-4">
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnecter toutes les sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </AppLayout>
  );
};

export default ProfilePage;
