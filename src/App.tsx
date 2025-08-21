import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, Layout, ProtectedRoute } from './components';

// Import de toutes les pages
import {
    LoginPage,
    RegisterPage,
    AdminPage,
    StudentPage,
    TakeQuizPage,
    CreateQuizPage,
    ManageQuestionsPage,
    QuizResultsPage,
    QuizResultsDetailPage,
    StudentHistoryPage
} from './pages';

// Interface pour définir une route avec ses propriétés
interface AppRoute {
    path: string;
    element: React.ReactNode;
    requiredRole?: string;
    description: string;
}

// Configuration des routes publiques (pas besoin d'authentification)
const publicRoutes: AppRoute[] = [
    {
        path: '/login',
        element: <LoginPage />,
        description: 'Page de connexion pour tous les utilisateurs'
    },
    {
        path: '/register',
        element: <RegisterPage />,
        description: 'Page d\'inscription pour tous les utilisateurs'
    }
];

// Configuration des routes pour les étudiants (ROLE_USER)
const studentRoutes: AppRoute[] = [
    {
        path: '/student',
        element: <StudentPage />,
        requiredRole: 'ROLE_USER',
        description: 'Page d\'accueil des étudiants'
    },
    {
        path: '/take-quiz',
        element: <TakeQuizPage />,
        requiredRole: 'ROLE_USER',
        description: 'Page pour passer un quiz'
    },
    {
        path: '/student-history',
        element: <StudentHistoryPage />,
        requiredRole: 'ROLE_USER',
        description: 'Historique des quiz passés par l\'étudiant'
    },
    {
        path: '/quiz-results',
        element: <QuizResultsPage />,
        requiredRole: 'ROLE_USER',
        description: 'Résultats des quiz pour l\'étudiant'
    }
];

// Configuration des routes pour les administrateurs (ROLE_ADMIN)
const adminRoutes: AppRoute[] = [
    {
        path: '/admin',
        element: <AdminPage />,
        requiredRole: 'ROLE_ADMIN',
        description: 'Page d\'accueil des administrateurs'
    },
    {
        path: '/create-quiz',
        element: <CreateQuizPage />,
        requiredRole: 'ROLE_ADMIN',
        description: 'Page pour créer un nouveau quiz'
    },
    {
        path: '/manage-questions/:quizId',
        element: <ManageQuestionsPage />,
        requiredRole: 'ROLE_ADMIN',
        description: 'Page pour gérer les questions d\'un quiz'
    },
    {
        path: '/quiz-results-detail',
        element: <QuizResultsDetailPage />,
        requiredRole: 'ROLE_ADMIN',
        description: 'Détails des résultats de tous les quiz'
    }
];

// Fonction pour créer une route protégée à partir d'une configuration
function createProtectedRoute(routeConfig: AppRoute) {
    if (routeConfig.requiredRole) {
        // Route qui nécessite un rôle spécifique
        return (
            <Route
                key={routeConfig.path}
                path={routeConfig.path}
                element={
                    <ProtectedRoute requiredRole={routeConfig.requiredRole}>
                        {routeConfig.element}
                    </ProtectedRoute>
                }
            />
        );
    } else {
        // Route publique (pas de protection)
        return (
            <Route
                key={routeConfig.path}
                path={routeConfig.path}
                element={routeConfig.element}
            />
        );
    }
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Routes publiques - accessibles à tous les utilisateurs */}
                        {publicRoutes.map(createProtectedRoute)}
                        
                        {/* Routes pour les étudiants - nécessitent ROLE_USER */}
                        {studentRoutes.map(createProtectedRoute)}
                        
                        {/* Routes pour les administrateurs - nécessitent ROLE_ADMIN */}
                        {adminRoutes.map(createProtectedRoute)}
                        
                        {/* Routes par défaut - redirection intelligente selon l'authentification */}
                        <Route 
                            index 
                            element={
                                <ProtectedRoute>
                                    <Navigate to="/student" replace />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Route pour les URLs non trouvées - redirige vers la connexion */}
                        <Route 
                            path="*" 
                            element={<Navigate to="/login" replace />} 
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;