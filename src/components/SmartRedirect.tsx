import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { useEffect, useState } from 'react';


function SmartRedirect() {
    const { isAuthenticated, isAdmin, isStudent, user, isLoading } = useAuth();
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
        }
    }, [isLoading]);

  
    console.log('SmartRedirect - Debug Info:', {
        isAuthenticated,
        user,
        userRoles: user?.roles,
        isAdmin: isAdmin(),
        isStudent: isStudent(),
        isLoading,
        isReady
    });

    // Attendre que le chargement soit terminé
    if (!isReady || isLoading) {
        return null; 
    }

    if (!isAuthenticated) {
        console.log('SmartRedirect: Utilisateur non authentifié, redirection vers /login');
        return <Navigate to="/login" replace />;
    }


    if (isAdmin()) {
        console.log('SmartRedirect: Utilisateur admin détecté, redirection vers /admin');
        return <Navigate to="/admin" replace />;
    } else if (isStudent()) {
        console.log('SmartRedirect: Utilisateur étudiant détecté, redirection vers /student');
        return <Navigate to="/student" replace />;
    } else {
        console.log('SmartRedirect: Aucun rôle spécifique détecté, redirection par défaut vers /student');
    
        return <Navigate to="/student" replace />;
    }
}

export default SmartRedirect;
