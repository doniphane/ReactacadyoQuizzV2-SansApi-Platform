import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import { useEffect, useState } from 'react';


function SmartRedirect() {
    const { isAuthenticated, isAdmin, isStudent, isLoading } = useAuth();
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
        }
    }, [isLoading]);

    // Attendre que le chargement soit terminé
    if (!isReady || isLoading) {
        return null; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }


    if (isAdmin()) {
        return <Navigate to="/admin" replace />;
    } else if (isStudent()) {
        return <Navigate to="/student" replace />;
    } else {
        return <Navigate to="/student" replace />;
    }
}

export default SmartRedirect;
