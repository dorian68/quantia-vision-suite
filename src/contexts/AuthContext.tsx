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

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client for development/demo purposes when real credentials are not available
const createMockClient = () => {
  // Return a mock client that simulates authentication success
  const mockUser: User = {
    id: 'demo-user-id',
    email: 'demo@optiquantia.com',
    name: 'Demo User',
    company: 'OptiQuantIA',
    role: 'user',
    plan: 'free'
  };
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: { id: mockUser.id, email: mockUser.email } } }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      signUp: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Simulate signed in state
        callback('SIGNED_IN', { user: { id: mockUser.id, email: mockUser.email } });
        return { unsubscribe: () => {} };
      }
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockUser, error: null }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: mockUser, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) })
    })
  } as unknown as SupabaseClient;
};

// Initialize Supabase client
let supabase: SupabaseClient;

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && supabaseKey && 
  supabaseUrl !== 'https://your-project-url.supabase.co' && 
  supabaseKey !== 'your-anon-key';

if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized with real credentials');
  } catch (error) {
    console.error('Error initializing Supabase client with real credentials:', error);
    supabase = createMockClient();
    console.log('Falling back to mock Supabase client');
  }
} else {
  console.warn('Using mock Supabase client as valid credentials are not provided');
  supabase = createMockClient();
}

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
      
      try {
        // Try to get the user from local storage first as a fallback
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
        
        // Check for existing Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setLoading(false);
          return;
        }
        
        if (session) {
          try {
            // Fetch user profile from Supabase
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching user profile:", error);
              if (storedUser) {
                // Keep using the stored user data if available
                console.log("Using stored user data as fallback");
              } else {
                setUser(null);
              }
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
          } catch (error) {
            console.error("Error processing user profile:", error);
            if (!storedUser) {
              setUser(null);
            }
          }
        } else if (!storedUser) {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Keep using stored user if available
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (!storedUser) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    try {
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            try {
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
            } catch (error) {
              console.error("Error processing auth state change:", error);
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
    } catch (error) {
      console.error("Error setting up auth state change listener:", error);
      return () => {};
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // For demo mode when no valid Supabase credentials
      if (!hasValidCredentials && email === 'demo@optiquantia.com') {
        // Demo mode login
        const demoUser: User = {
          id: 'demo-user-id',
          email: 'demo@optiquantia.com',
          name: 'Demo User',
          company: 'OptiQuantIA',
          role: 'user',
          plan: 'free'
        };
        
        setUser(demoUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        toast.success('Connexion démo réussie');
        return true;
      }
      
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
      
      // Demo mode fallback if real authentication fails
      if (email === 'demo@optiquantia.com') {
        const demoUser: User = {
          id: 'demo-user-id',
          email: 'demo@optiquantia.com',
          name: 'Demo User',
          company: 'OptiQuantIA',
          role: 'user',
          plan: 'free'
        };
        
        setUser(demoUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        toast.success('Connexion démo réussie');
        return true;
      }
      
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
      // For demo mode when no valid Supabase credentials
      if (!hasValidCredentials) {
        // Demo mode registration
        const demoUser: User = {
          id: 'demo-user-id-' + Date.now(),
          email,
          name,
          company,
          role: 'user',
          plan: 'free'
        };
        
        setUser(demoUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        toast.success('Inscription démo réussie');
        return true;
      }
      
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
        try {
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
        } catch (profileError) {
          console.error("Profile creation error:", profileError);
          toast.error('Compte créé mais erreur lors de la création du profil');
          return true; // Still return true as the auth account was created
        }
      } else {
        toast.error('Erreur lors de l\'inscription');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Demo mode fallback if real registration fails
      if (!hasValidCredentials) {
        const demoUser: User = {
          id: 'demo-user-id-' + Date.now(),
          email,
          name,
          company,
          role: 'user',
          plan: 'free'
        };
        
        setUser(demoUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        toast.success('Inscription démo réussie (mode hors ligne)');
        return true;
      }
      
      toast.error('Erreur lors de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
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
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clear local state even if Supabase logout fails
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
      
      // For demo mode when no valid Supabase credentials
      if (!hasValidCredentials) {
        // Update local user state in demo mode
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        toast.success('Profil mis à jour (mode démo)');
        return true;
      }
      
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
      
      if (!hasValidCredentials && user) {
        // Demo mode fallback
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        toast.success('Profil mis à jour (mode démo)');
        return true;
      }
      
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
