import { useEffect, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AttemptsList, AttemptDetails, SearchBar } from '../components';
import AuthService from '../services/AuthService';
import toast from 'react-hot-toast';
import axios from 'axios';
import type { TransformedAttempt, AttemptDetail } from '@/types';
import type {
  ApiAttempt,
  ApiAttemptDetail,
  ApiAttemptDetailResponse,
  HydraCollection,
} from "../types";
import type { AttemptWithNames } from "../types";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


function StudentHistoryPage() {
  const navigate = useNavigate();

  

  const [quizAttempts, setQuizAttempts] = useState<TransformedAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState<TransformedAttempt | null>(null);
  const [attemptDetails, setAttemptDetails] = useState<AttemptDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

 

  const getAuthToken = useCallback((): string | null => {
    const token = AuthService.getToken();
    if (!token) {
      toast.error('Vous devez être connecté');
      return null;
    }
    return token;
  }, []);

 
  const transformApiAttempt = (attempt: any): TransformedAttempt => {
    let dateDebut: Date;
    try {
      dateDebut = new Date(attempt.date || attempt.dateDebut || new Date().toISOString());
    } catch (error) {
      dateDebut = new Date();
    }
    
    return {
      id: attempt.id || 0,
      quizTitle: attempt.questionnaireTitre || attempt.quizTitle || attempt.titre || 'Quiz sans titre',
      quizCode: attempt.questionnaireCode || attempt.quizCode || attempt.code || 'N/A',
      date: dateDebut.toLocaleDateString('fr-FR'),
      time: dateDebut.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      score: attempt.score || 0,
      totalQuestions: attempt.nombreTotalQuestions || attempt.totalQuestions || 0,
      nombreTotalQuestions: attempt.nombreTotalQuestions || attempt.totalQuestions || 0,
      percentage: attempt.pourcentage || attempt.percentage || 0,
      isPassed: attempt.estReussi || attempt.isPassed || false
    };
  };


  const transformApiAttemptDetails = (attemptDetail: ApiAttemptDetailResponse): AttemptDetail[] => {
    if (!attemptDetail || !attemptDetail.reponsesDetails) {
      return [] as AttemptDetail[];
    }
    return attemptDetail.reponsesDetails.map((detail: ApiAttemptDetail) => ({
      questionId: Number(detail.questionId),
      questionText: detail.questionTexte,
      answer: detail.reponseUtilisateurTexte,
      userAnswer: detail.reponseUtilisateurTexte,
      correctAnswer: detail.reponseCorrecteTexte,
      isCorrect: detail.estCorrecte
    }));
  };

 
  const getFilteredAttempts = (): TransformedAttempt[] => {
    return quizAttempts.filter((attempt: TransformedAttempt) => {
      const a = attempt as AttemptWithNames;
      const quizTitle = attempt.quizTitle || `${a.prenomParticipant ?? ''} ${a.nomParticipant ?? ''}`.trim();
      const quizCode = attempt.quizCode || 'N/A';
      return quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
             quizCode.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const handleBackToStudent = () => {
    navigate('/student');
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

 

  const callApi = useCallback(async (endpoint: string): Promise<unknown> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = response.data;
      
      if (data && typeof data === 'object' && ('hydra:member' in data || 'member' in data)) {
        const collection = data as HydraCollection<unknown>;
        const extractedData = collection['hydra:member'] || collection.member || [];
        return extractedData;
      }
      
      return Array.isArray(data) ? data : data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Session expirée, veuillez vous reconnecter');
          AuthService.logout();
          return;
        }
        
        if (error.response?.status === 404) {
          throw new Error(`Endpoint ${endpoint} non trouvé`);
        }
      }
      
      throw error;
    }
  }, [getAuthToken]);


  const loadQuizHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await callApi('/api/quizzes/history');
      const attemptsArray = result as ApiAttempt[];
      
      if (!attemptsArray || !Array.isArray(attemptsArray)) {
        setQuizAttempts([]);
        toast.error('Aucun historique trouvé pour cet utilisateur');
        return;
      }

      if (attemptsArray.length === 0) {
        setQuizAttempts([]);
        toast.error('Vous n\'avez pas encore passé de quiz');
        return;
      }

      const transformedAttempts: TransformedAttempt[] = attemptsArray.map(transformApiAttempt);
      setQuizAttempts(transformedAttempts);
      toast.success(`${transformedAttempts.length} tentative(s) trouvée(s)`);
      
    } catch (error) {
      setError('Erreur lors du chargement de l\'historique des quiz');
      toast.error('Impossible de charger l\'historique');
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

 
  const loadAttemptDetails = async (attempt: TransformedAttempt) => {
    try {
      setLoadingDetails(true);
      setSelectedAttempt(attempt);
      
      const attemptDetail = await callApi(`/api/quizzes/history/${attempt.id}`) as ApiAttemptDetailResponse;
      const details = transformApiAttemptDetails(attemptDetail);
      setAttemptDetails(details);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails');
      setAttemptDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
        <div className="text-xl">Chargement de l'historique...</div>
      </div>
    </div>
  );

  const ErrorScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p className="text-gray-300 mb-4">{error}</p>
        <Button onClick={handleBackToStudent} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );

  const Header = ({ quizAttempts }: { quizAttempts: TransformedAttempt[] }) => (
    <div className="flex justify-between items-center mb-8">
      <Button
        onClick={handleBackToStudent}
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">
          Mon Historique Personnel
        </h1>
        <p className="text-gray-300">
          {quizAttempts.length} quiz passé{quizAttempts.length > 1 ? 's' : ''} par vous
        </p>
      </div>
      <div className="w-32"></div> 
    </div>
  );

  const MainContent = ({ filteredAttempts }: { filteredAttempts: TransformedAttempt[] }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AttemptsList 
        attempts={filteredAttempts}
        selectedAttempt={selectedAttempt}
        onAttemptSelect={loadAttemptDetails}
      />
      <AttemptDetails 
        selectedAttempt={selectedAttempt}
        attemptDetails={attemptDetails}
        loadingDetails={loadingDetails}
      />
    </div>
  );

 
  useEffect(() => {
    const initializePage = async () => {
      const token = AuthService.getToken();
      if (!token) {
        setError('Vous devez être connecté pour voir votre historique');
        setIsLoading(false);
        return;
      }
      
      try {
        const user = await AuthService.getCurrentUser();
        
        if (!user) {
          setError('Erreur d\'authentification');
          setIsLoading(false);
          return;
        }
        
        void loadQuizHistory();
      } catch (authError) {
        setError('Erreur d\'authentification');
        setIsLoading(false);
      }
    };
    
    void initializePage();
  }, [loadQuizHistory]);



 
  if (isLoading) {
    return <LoadingScreen />;
  }

 
  if (error) {
    return <ErrorScreen />;
  }


  const filteredAttempts = getFilteredAttempts();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header quizAttempts={quizAttempts} />
        
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        
        <MainContent filteredAttempts={filteredAttempts} />
      </div>
    </div>
  );
}

export default StudentHistoryPage;