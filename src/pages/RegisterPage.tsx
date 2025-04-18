
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building, Lock, Mail, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define the form validation schema
const registerFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }),
  company: z.string().optional(),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // If already logged in, redirect to home
  if (user) {
    navigate('/');
    return null;
  }
  
  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Show processing feedback
      toast.loading('Création de votre compte...');
      
      // Try to register with our auth system
      const success = await register(data.email, data.password, data.name, data.company);
      
      if (success) {
        toast.success('Compte créé avec succès!');
        // Redirect to home page after successful registration
        navigate('/');
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle demo login
  const handleDemoLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-md bg-gradient-to-r from-quantia-blue to-quantia-purple flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">OptiQuantIA</h1>
          <p className="text-muted-foreground">Plateforme d'Intelligence Assistée</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez OptiQuantIA pour accéder à l'intelligence artificielle au service de votre entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Jean Dupont" className="pl-10" {...field} />
                        </div>
                      </FormControl>
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
                          <Input placeholder="votre@email.com" className="pl-10" {...field} />
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
                      <FormLabel>Entreprise (optionnel)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Nom de votre entreprise" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">Inscription en cours</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Se connecter
              </Link>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-4">
              <p>
                Note: Pour tester l'application sans inscription, vous pouvez utiliser l'email 
                <span className="font-semibold mx-1">demo@optiquantia.com</span> 
                sur la page de connexion.
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
