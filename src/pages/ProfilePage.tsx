
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building, Check, Edit, Mail, User as UserIcon, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }).optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock user activity data
const recentActivity = [
  { id: 1, action: 'Rapport généré', date: '15/04/2025', details: 'Rapport mensuel de performance' },
  { id: 2, action: 'Tableau créé', date: '10/04/2025', details: 'Analyse de rentabilité produit' },
  { id: 3, action: 'IA utilisée', date: '08/04/2025', details: 'Prédiction de trésorerie Q2 2025' },
  { id: 4, action: 'Connexion', date: '05/04/2025', details: 'Connexion depuis l\'application mobile' },
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || '',
    },
  });
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        company: user.company,
      });
    }
  }, [user, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const success = await updateProfile({
        name: data.name,
        company: data.company,
      });
      
      if (success) {
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'US';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const planInfo = {
    'free': {
      name: 'Free',
      features: ['Rapports de base', 'Tableaux limités', 'Support email'],
      limits: '3 rapports par mois',
    },
    'pro': {
      name: 'Pro',
      features: ['Rapports illimités', 'Tableaux personnalisés', 'Support prioritaire', 'Export avancé'],
      limits: 'Utilisateurs limités (5)',
    },
    'enterprise': {
      name: 'Enterprise',
      features: ['Tout Pro', 'API personnalisée', 'Utilisateurs illimités', 'Support dédié 24/7', 'Intégrations'],
      limits: 'Aucune limite',
    },
  };
  
  const userPlan = user?.plan || 'free';
  const planDetails = planInfo[userPlan as keyof typeof planInfo];
  
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et consultez vos activités récentes
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Informations</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={user?.name || 'User'} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {user?.email}
                      </span>
                      {user?.company && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" /> {user.company}
                        </span>
                      )}
                    </div>
                    <div className="pt-2">
                      <Badge variant={user?.role === 'admin' ? 'default' : 'outline'}>
                        {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <div className="relative flex-1">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pl-10"
                                  disabled={!isEditing}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                disabled={true} // Email cannot be changed in this demo
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entreprise</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-10"
                                disabled={!isEditing}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            form.reset();
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Annuler
                        </Button>
                        <Button type="submit" size="sm">
                          <Check className="mr-2 h-4 w-4" />
                          Enregistrer
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier le profil
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Account Security */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez la sécurité de votre compte et vos appareils connectés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Mot de passe</h4>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Dernière modification: 15/04/2025
                    </p>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Appareils connectés</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">MacBook Pro</p>
                        <p className="text-xs text-muted-foreground">Paris, France • Aujourd'hui</p>
                      </div>
                      <Badge>Actuel</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">iPhone 15</p>
                        <p className="text-xs text-muted-foreground">Lyon, France • Hier</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Déconnecter
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Authentification à deux facteurs</h4>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Protégez votre compte avec 2FA
                    </p>
                    <Button variant="outline" size="sm">
                      Activer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Suivez vos dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir plus d'activités
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Abonnement</CardTitle>
              <CardDescription>
                Gérez votre abonnement et vos informations de facturation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Plan {planDetails.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {planDetails.limits}
                  </p>
                </div>
                <Button variant={userPlan === 'enterprise' ? 'secondary' : 'default'}>
                  {userPlan === 'enterprise' ? 'Contacter le commercial' : 'Mettre à niveau'}
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-3">Fonctionnalités incluses :</h4>
                <ul className="space-y-2">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Facturation</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Prochain paiement</span>
                    <span className="text-sm">01/05/2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Méthode de paiement</span>
                    <span className="text-sm">Carte ••••4242</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Historique de facturation
                  </Button>
                  <Button variant="outline" size="sm">
                    Méthode de paiement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ProfilePage;
