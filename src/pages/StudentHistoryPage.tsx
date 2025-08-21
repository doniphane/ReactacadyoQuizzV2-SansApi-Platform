import { useEffect, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AttemptsList, AttemptDetails, SearchBar } from '../components';
import AuthService from '../services/AuthService';
import toast from 'react-hot-toast';
import type { TransformedAttempt, AttemptDetail } from '@/types';



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface ApiAttempt {
  id: number;
  questionnaireTitre: string;
  questionnaireCode: string;
  date: string;
  heure: string;
  score: number;
  nombreTotalQuestions: number;
  pourcentage: number;
  estReussi: boolean;
}


interface ApiAttemptDetail {
  questionId: string;
  questionTexte: string;
  reponseUtilisateurTexte: string;
  reponseCorrecteTexte: string;
  estCorrecte: boolean;
}


interface ApiAttemptDetailResponse {
  reponsesDetails: ApiAttemptDetail[];
}


interface HydraCollection<T> {
  'hydra:member'?: T[];
  member?: T[];
}

type AttemptWithNames = TransformedAttempt & { prenomParticipant?: string; nomParticipant?: string };

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

 
  const transformApiAttempt = (attempt: ApiAttempt): TransformedAttempt => {
    const dateDebut = new Date(attempt.date);
    
    return {
      id: attempt.id,
      prenomParticipant: 'Utilisateur',
      nomParticipant: 'Connecté',
      dateDebut: attempt.date,
      dateFin: undefined,
      score: attempt.score,
      nombreTotalQuestions: attempt.nombreTotalQuestions,
      questionnaire: `/api/questionnaires/${attempt.id}`,
      utilisateur: `/api/utilisateurs/current`,



   


      quizTitle: attempt.questionnaireTitre || 'Quiz sans titre',
      quizCode: attempt.questionnaireCode || 'N/A',
      date: dateDebut.toLocaleDateString('fr-FR'),
      time: dateDebut.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      percentage: attempt.pourcentage || 0,
      isPassed: attempt.estReussi || false
    } as unknown as TransformedAttempt;
  };


  const transformApiAttemptDetails = (attemptDetail: ApiAttemptDetailResponse): AttemptDetail[] => {
    if (!attemptDetail || !attemptDetail.reponsesDetails) {
      return [] as AttemptDetail[];
    }
    return attemptDetail.reponsesDetails.map((detail: ApiAttemptDetail) => ({
      questionId: Number(detail.questionId),
      questionText: detail.questionTexte,
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      const data: unknown = await response.json();
      const collection = data as HydraCollection<unknown>;
      return Array.isArray(data) ? data : (collection.member || collection['hydra:member'] || data);
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error);
      throw error;
    }
  }, [getAuthToken]);


  const loadQuizHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      
      const attemptsArray = await callApi('/api/user/my-attempts') as ApiAttempt[];
      
      if (!attemptsArray) {
        setQuizAttempts([]);
        return;
      }

     
      const transformedAttempts: TransformedAttempt[] = attemptsArray.map(transformApiAttempt);
      
      setQuizAttempts(transformedAttempts);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setError('Erreur lors du chargement de l\'historique des quiz');
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

 
  const loadAttemptDetails = async (attempt: TransformedAttempt) => {
    try {
      setLoadingDetails(true);
      setSelectedAttempt(attempt);
      
      
      const attemptDetail = await callApi(`/api/user/my-attempts/${attempt.id}`) as ApiAttemptDetailResponse;
      
    
      const details = transformApiAttemptDetails(attemptDetail);
      setAttemptDetails(details);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
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
    void loadQuizHistory();
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