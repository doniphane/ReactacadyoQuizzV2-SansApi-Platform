import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, User, Menu, X } from "lucide-react";
import AuthService from "../services/AuthService";
import toast from "react-hot-toast";
import { ListeQuiz, MetricsDashboard } from "../components";
import type { Quiz, AdminMetrics, LoadingQuizId } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AdminPage() {
  const navigate = useNavigate();
  
  // États
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuizId, setLoadingQuizId] = useState<LoadingQuizId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState<AdminMetrics>({
    quizzesCreated: 0,
    totalAttempts: 0,
    registeredUsers: 0, 
  });
  
  const getToken = useCallback((): string | null => {
    const token = AuthService.getToken();
    if (!token) {
      toast.error("Vous devez être connecté");
      navigate("/login");
      return null;
    }
    return token;
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };

  const fetchQuizzes = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/questionnaires`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Quiz[] = await response.json();
      setQuizzes(data);
      setMetrics(prev => ({
        ...prev,
        quizzesCreated: data.length
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des quiz:', error);
      toast.error("Erreur lors du chargement des quiz");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const toggleQuizStatus = async (quizId: number, currentStatus: boolean): Promise<void> => {
    try {
      setLoadingQuizId(quizId);
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/questionnaires/${quizId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estActif: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setQuizzes(
        quizzes.map((quiz) =>
          quiz.id === quizId ? { ...quiz, isActive: !currentStatus } : quiz
        )
      );
      
      toast.success(!currentStatus ? "Quiz activé" : "Quiz désactivé");
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoadingQuizId(null);
    }
  };

  const deleteQuiz = async (quizId: number, quizTitre: string): Promise<void> => {
    if (!window.confirm(`Supprimer le quiz "${quizTitre}" ?`)) {
      return;
    }

    try {
      setLoadingQuizId(quizId);
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/questionnaires/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
      toast.success("Quiz supprimé");
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoadingQuizId(null);
    }
  };

  const ActionButtons = ({ isFullWidth = false }) => (
    <>
      <Button
        onClick={() => navigate("/create-quiz")}
        className={`bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3 ${
          isFullWidth ? 'w-full' : ''
        }`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Créer un quiz
      </Button>
      <Button
        onClick={() => navigate("/student")}
        className={`bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3 ${
          isFullWidth ? 'w-full' : ''
        }`}
      >
        <User className="w-4 h-4 mr-2" />
        Espace Élève
      </Button>
      <Button
        onClick={handleLogout}
        className={`bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3 ${
          isFullWidth ? 'w-full' : ''
        }`}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </>
  );

  const Header = () => (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-sm md:text-lg text-gray-300">
          Gérez vos quiz et analysez les performances
        </p>
      </div>
      {/* Bouton hamburger pour mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    
      <div className="hidden md:flex gap-4">
        <ActionButtons />
      </div>
    </div>
  );

  const MobileMenu = () => {
    if (!isMobileMenuOpen) return null;
    
    return (
      <div className="md:hidden bg-gray-800 p-4 rounded-lg space-y-4 mb-6">
        <ActionButtons isFullWidth />
      </div>
    );
  };

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Header />
      <MobileMenu />
      <MetricsDashboard metrics={metrics} />
      <ListeQuiz
        quizzes={quizzes}
        loading={loading}
        loadingQuizId={loadingQuizId}
        onToggleStatus={toggleQuizStatus}
        onDeleteQuiz={deleteQuiz}
      />
    </div>
  );
}

export default AdminPage;