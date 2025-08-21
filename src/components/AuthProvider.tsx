import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import LoadingScreen from './LoadingScreen';


export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Vérifie l'authentification dès le chargement de l'app
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
   
  }, []);

  // Afficher un écran de chargement pendant l'initialisation
  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}