

import { Navigate, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import type { ProtectedRouteProps, NavigationState } from '../types';


type UserRole = 'ROLE_ADMIN' | 'ROLE_STUDENT' | 'ROLE_USER' | string;




type RoleCheckResult = boolean;



function ProtectedRoute({ 
    children, 
    requiredRole, 
    redirectTo = '/login' 
}: ProtectedRouteProps) {
   
    const location: Location = useLocation();

 
    const { isAuthenticated, hasRole, isAdmin, isStudent } = useAuth();

  
    if (!isAuthenticated) {
    
        const navigationState: NavigationState = { 
            from: location,
            error: 'Veuillez vous connecter pour accéder à cette page'
        };
        
        return <Navigate to={redirectTo} state={navigationState} replace />;
    }

    
    if (requiredRole) {
        const hasRequiredRole: RoleCheckResult = hasRole(requiredRole as UserRole);

        if (!hasRequiredRole) {
         
            let appropriateRedirect: string;
            
            if (isAdmin()) {
                appropriateRedirect = '/admin';
            } else if (isStudent()) {
                
                appropriateRedirect = location.pathname === '/student' ? '/login' : '/student';
            } else {
              
                appropriateRedirect = '/login';
            }
            
           
            const navigationState: NavigationState = { 
                from: location, 
                error: `Accès non autorisé. Rôle requis: ${requiredRole}` 
            };
            
            return <Navigate to={appropriateRedirect} state={navigationState} replace />;
        }
    }

    return <>{children}</>;
}

export default ProtectedRoute;