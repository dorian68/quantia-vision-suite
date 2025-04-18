
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, LogIn, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define the form validation schema
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get redirect path from location state or default to home
  const from = (location.state as any)?.from || '/';
  
  // Redirect if already logged in
  if (user) {
    navigate(from);
    return null;
  }
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Show processing feedback
      toast.loading('Connexion en cours...');
      
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success('Connexion réussie');
        // Redirect to the page they tried to access or home
        navigate(from);
      } else {
        toast.error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle demo login
  const handleDemoLogin = () => {
    form.setValue('email', 'demo@optiquantia.com');
    form.setValue('password', 'password123');
    
    form.handleSubmit(onSubmit)();
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
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Accédez à votre espace personnel pour gérer vos analyses et rapports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2">Connexion en cours</span>
                      <span className="animate-spin">⟳</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Se connecter
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Accès démo
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Créer un compte
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
