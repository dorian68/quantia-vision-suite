
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define the user type
export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'user' | 'admin';
  plan?: 'free' | 'pro' | 'enterprise';
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, company?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  supabase: SupabaseClient;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// User storage keys
const USER_STORAGE_KEY = 'optiquantia-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      // Check for existing Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Fetch user profile from Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        } else if (profile) {
          const userData: User = {
            id: profile.id,
            email: session.user.email || '',
            name: profile.name || '',
            company: profile.company,
            role: profile.role || 'user',
            plan: profile.plan || 'free',
          };
          
          setUser(userData);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        }
      } else {
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            const userData: User = {
              id: profile.id,
              email: session.user.email || '',
              name: profile.name || '',
              company: profile.company,
              role: profile.role || 'user',
              plan: profile.plan || 'free',
            };
            
            setUser(userData);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || 'Email ou mot de passe incorrect');
        return false;
      }
      
      if (data.user) {
        toast.success('Connexion réussie');
        return true;
      } else {
        toast.error('Erreur lors de la connexion');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur lors de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    company?: string
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
          },
        },
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        toast.error(error.message || 'Erreur lors de l\'inscription');
        return false;
      }
      
      if (data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              company,
              role: 'user',
              plan: 'free',
              created_at: new Date().toISOString(),
            },
          ]);
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast.error('Compte créé mais erreur lors de la création du profil');
          return true; // Still return true as the auth account was created
        }
        
        toast.success('Inscription réussie');
        return true;
      } else {
        toast.error('Erreur lors de l\'inscription');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      toast.error('Erreur lors de la déconnexion');
    } else {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      navigate('/login');
      toast.success('Déconnexion réussie');
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setLoading(true);
    
    try {
      if (!user) return false;
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          company: data.company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        console.error("Profile update error:", error);
        toast.error('Erreur lors de la mise à jour du profil');
        return false;
      }
      
      // Update local user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      toast.success('Profil mis à jour');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        login,
        register,
        logout,
        updateProfile,
        supabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
