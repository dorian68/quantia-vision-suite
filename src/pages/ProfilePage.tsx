
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building, Check, Edit, Mail, User as UserIcon, X, Activity, Shield, CreditCard } from 'lucide-react';
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
import { useUserDataService } from '@/services/userDataService';
import { UserActivity } from '@/types/models';

// Define profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }).optional(),
  company: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { user, updateProfile, supabase } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const userDataService = useUserDataService();
  
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
  
  // Fetch user activity
  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const activities = await userDataService.getUserActivity();
        setUserActivities(activities);
      } catch (error) {
        console.error('Error fetching user activity:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchUserActivity();
    }
  }, [user]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const success = await updateProfile({
        name: data.name,
        company: data.company,
      });
      
      if (success) {
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès');
        
        // Log the activity
        await userDataService.logUserActivity('profile_updated', 'Profil mis à jour');
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
  
  // Format user activity for display
  const formatUserActivity = (activity: UserActivity) => {
    const actionLabels: Record<string, string> = {
      'login': 'Connexion',
      'report_created': 'Rapport créé',
      'dashboard_created': 'Tableau créé',
      'ai_used': 'IA utilisée',
      'profile_updated': 'Profil mis à jour'
    };
    
    return {
      action: actionLabels[activity.action] || activity.action,
      details: activity.details || '',
      date: activity.createdAt.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };
  };
  
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
          <TabsTrigger value="security">Sécurité</TabsTrigger>
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
            
            {/* Account Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Informations du compte</CardTitle>
                <CardDescription>
                  Détails de votre compte et historique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">ID utilisateur</h4>
                  <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    {user?.id}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Plan actuel</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{userPlan}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {planDetails.limits}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Compte créé le</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Données utilisateur</h4>
                    <p className="text-xs text-muted-foreground">
                      Téléchargez toutes vos données
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Exporter
                  </Button>
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
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
                </div>
              ) : userActivities.length > 0 ? (
                <div className="space-y-6">
                  {userActivities.map((activity) => {
                    const formattedActivity = formatUserActivity(activity);
                    return (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{formattedActivity.action}</p>
                          <p className="text-sm text-muted-foreground">{formattedActivity.details}</p>
                          <p className="text-xs text-muted-foreground">{formattedActivity.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune activité récente</p>
                </div>
              )}
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
                    <CreditCard className="h-4 w-4 mr-2" />
                    Méthode de paiement
                  </Button>
                  <Button variant="outline" size="sm">
                    Historique de facturation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
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
                    Dernière modification: {new Date().toLocaleDateString('fr-FR')}
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
                      <p className="text-sm font-medium">Navigateur actuel</p>
                      <p className="text-xs text-muted-foreground">
                        {`${navigator.platform} • ${navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                           navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                           navigator.userAgent.includes('Safari') ? 'Safari' : 'Navigateur'}`}
                      </p>
                    </div>
                    <Badge>Actuel</Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Authentification à deux facteurs</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Protégez votre compte avec 2FA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Non activé
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Activer
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
