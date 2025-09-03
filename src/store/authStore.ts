

import { create } from 'zustand';
import AuthService from '../services/AuthService';
import type { User } from '../types';

// Interface pour l'état d'authentification
export type Auth = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isStudent: () => boolean;
};

export const useAuthStore = create<Auth>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Définir l'utilisateur
  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null 
    });
  },

  // Connexion
  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        // Récupérer les informations de l'utilisateur
        const user = await AuthService.getCurrentUser();
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({ 
          error: result.message, 
          isLoading: false,
          isAuthenticated: false,
          user: null
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      set({ 
        error: errorMessage, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      return false;
    }
  },

  // Déconnexion
  logout: async (): Promise<void> => {
    set({ isLoading: true });
    
    try {
      await AuthService.logout();
    } catch {
      // Ignore logout errors 
    } finally {
      // Nettoyer complètement le state
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    }
  },


  checkAuth: async (): Promise<boolean> => {
    set({ isLoading: true });
    
    try {
      const isAuth = await AuthService.isAuthenticated();
      
      if (isAuth) {
        const user = await AuthService.getCurrentUser();
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
        return true;
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null
        });
        return false;
      }
    } catch {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
      return false;
    }
  },

  // Nettoyer les erreurs
  clearError: () => {
    set({ error: null });
  },

 
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole: (role: string): boolean => {
    const state = get();
    return state.user?.roles?.includes(role) || false;
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: (): boolean => {
    const state = get();
    // Vérifier les deux variantes possibles du rôle admin
    return state.hasRole('ROLE_ADMIN') || state.hasRole('ROLE8ADMIN');
  },

  // Vérifier si l'utilisateur est étudiant
  isStudent: (): boolean => {
    const state = get();
    return state.hasRole('ROLE_USER');
  }
}));

export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
   
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
    setLoading: store.setLoading,
    hasRole: store.hasRole,
    isAdmin: store.isAdmin,
    isStudent: store.isStudent
  };
};