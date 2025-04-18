
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - this would be replaced with Supabase auth in production
const MOCK_USERS = [
  {
    id: '1',
    email: 'demo@optiquantia.com',
    password: 'password123',
    name: 'Utilisateur Demo',
    company: 'OptiQuantIA',
    role: 'admin' as const,
    plan: 'enterprise' as const,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    company: 'Example Corp',
    role: 'user' as const,
    plan: 'pro' as const,
  }
];

// Local storage keys
const USER_STORAGE_KEY = 'optiquantia-user';
const AUTH_TOKEN_KEY = 'optiquantia-auth-token';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      
      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser) as User;
          setUser(userData);
        } catch (error) {
          console.error('Failed to parse user data', error);
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Mock authentication - replace with Supabase auth
      const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (matchedUser) {
        const { password: _, ...userWithoutPassword } = matchedUser;
        setUser(userWithoutPassword);
        
        // Store in localStorage (temporary solution)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        localStorage.setItem(AUTH_TOKEN_KEY, 'mock-jwt-token-' + userWithoutPassword.id);
        
        toast.success('Connexion réussie');
        return true;
      } else {
        toast.error('Email ou mot de passe incorrect');
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
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        toast.error('Cet email est déjà utilisé');
        return false;
      }
      
      // Create new user (mock)
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        company,
        role: 'user',
        plan: 'free',
      };
      
      // In a real app with Supabase, we would create the user here
      
      setUser(newUser);
      
      // Store in localStorage (temporary solution)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(AUTH_TOKEN_KEY, 'mock-jwt-token-' + newUser.id);
      
      toast.success('Inscription réussie');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    navigate('/login');
    toast.success('Déconnexion réussie');
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setLoading(true);
    
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      // Update in localStorage (temporary solution)
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
        updateProfile
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
