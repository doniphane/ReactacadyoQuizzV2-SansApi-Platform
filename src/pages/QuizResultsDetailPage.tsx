import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Calendar, BarChart3, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthService from '../services/AuthService';
import { QuizMetrics, StudentsList, StudentResultsDetail, exportAllResultsPDF, exportStudentResultPDF } from '../components';
import type { Student, AnswerDetail, Metrics, QuizResultsNavigationState, ApiQuestionData, ApiAnswerData, BackendAttempt } from '@/types';



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


interface ApiResponse {
  member?: unknown[];
  'hydra:member'?: unknown[];
}


function QuizResultsDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();


  const { quizId, quizTitle, quizCode } = (location.state as QuizResultsNavigationState) || {};

 

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<AnswerDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

 

 
  const getIdFromIriOrObject = (ref: string | { id: number }): number => {
    if (typeof ref === 'string') {
      const idStr = ref.split('/').pop() || '0';
      return parseInt(idStr);
    }
    return ref.id;
  };


  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    try {
      const isAuth = await AuthService.isAuthenticated();
      return isAuth;
    } catch {
      return false;
    }
  }, []);

 
  const calculateMetrics = (studentsList: Student[]): Metrics => {
    if (studentsList.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        bestScore: 0,
        lowestScore: 0,
        successRate: 0,
        passRate: 0,
        totalQuestions: 0
      };
    }

    const percentages: number[] = studentsList.map(student => student.percentage ?? 0);
    const average = Math.round(percentages.reduce((sum, score) => sum + score, 0) / studentsList.length);
    const best = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    const successCount = studentsList.filter(student => (student.percentage ?? 0) >= 70).length;
    const success = Math.round((successCount / studentsList.length) * 100);
    const totalQuestions = Math.max(...studentsList.map(s => s.totalQuestions ?? 0));

    return {
      totalStudents: studentsList.length,
      averageScore: average,
      bestScore: best,
      lowestScore: lowest,
      successRate: success,
      passRate: success,
      totalQuestions
    };
  };


  const getFilteredStudents = (): Student[] => {
    return students.filter(student =>
      (student.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleExportAllResults = () => {
    exportAllResultsPDF({
      students,
      quizData: {
        title: quizTitle || 'Quiz',
        code: quizCode || 'QUIZ01'
      }
    });
  };

  const handleExportStudentResult = () => {
    if (!selectedStudent) return;
    
    exportStudentResultPDF({
      student: selectedStudent,
      answers: studentAnswers,
      quizData: {
        title: quizTitle || 'Quiz',
        code: quizCode || 'QUIZ01'
      }
    });
  };

  


  const makeApiCall = useCallback(async (endpoint: string): Promise<unknown[]> => {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return [];
    }

    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      const data = response.data;
      
   
      if (Array.isArray(data)) {
        return data;
      }
      
      return (data as ApiResponse).member || (data as ApiResponse)['hydra:member'] || [];
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error);
      throw error;
    }
  }, [checkAuthentication, navigate]);


  const loadQuizResults = useCallback(async () => {
    if (!quizId) {
      toast.error('ID du quiz manquant');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      

      const attempts = await makeApiCall(`/api/tentative_questionnaires?questionnaire=${quizId}`);
      
    
      const quizAttempts = attempts.filter((attempt) => {
        const quizAttempt = attempt as BackendAttempt;
        
        if (typeof quizAttempt.questionnaire === 'string') {
          return quizAttempt.questionnaire.includes(String(quizId));
        } else if (quizAttempt.questionnaire && typeof quizAttempt.questionnaire === 'object') {
          return (quizAttempt.questionnaire as { id: number }).id === Number(quizId);
        }
        return false;
      });

      
      const studentsData: Student[] = quizAttempts.map((attempt) => {
        const quizAttempt = attempt as BackendAttempt;
        const percentage = quizAttempt.nombreTotalQuestions && quizAttempt.score
          ? Math.round((quizAttempt.score / quizAttempt.nombreTotalQuestions) * 100)
          : 0;

        return {
          id: quizAttempt.id,
          name: `${quizAttempt.prenomParticipant} ${quizAttempt.nomParticipant}`,
          email: `${quizAttempt.prenomParticipant}${quizAttempt.nomParticipant}@gmail.com`,
          date: new Date(quizAttempt.dateDebut).toLocaleDateString('fr-FR'),
          score: quizAttempt.score || 0,
          totalQuestions: quizAttempt.nombreTotalQuestions || 0,
          percentage
        } as Student;
      });

      setStudents(studentsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des résultats');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [quizId, makeApiCall]);


  const loadStudentDetails = useCallback(async (student: Student) => {
    setSelectedStudent(student);
    try {
      
      const [questions, userAnswers] = await Promise.all([
        makeApiCall(`/api/questions?questionnaire=${quizId}`),
        makeApiCall(`/api/reponse_utilisateurs?tentative=${student.id}`)
      ]);

      const quizQuestions = (questions as ApiQuestionData[]);
      const studentUserAnswers = (userAnswers as Array<{ question: string | { id: number }; reponse: string | { id: number } }>);

      const answersDetails: AnswerDetail[] = studentUserAnswers.map((userAnswerData) => {
        const questionId = getIdFromIriOrObject(userAnswerData.question as string | { id: number });
        const answerId = getIdFromIriOrObject(userAnswerData.reponse as string | { id: number });

        const question = quizQuestions.find((q) => q.id === questionId);
        const questionAnswers = (question?.reponses ?? []) as ApiAnswerData[];
        const selectedAnswer = questionAnswers.find((a) => a.id === answerId);
        const correctAnswer = questionAnswers.find((a) => a.estCorrecte === true);

        return {
          questionId,
          questionText: question?.texte || 'Question non trouvée',
          userAnswer: selectedAnswer?.texte || 'Réponse non trouvée',
          correctAnswer: correctAnswer?.texte || 'Réponse correcte non trouvée',
          isCorrect: selectedAnswer?.estCorrecte || false
        };
      });

      setStudentAnswers(answersDetails);
    } catch (error) {
      toast.error('Erreur lors du chargement des détails');
      setStudentAnswers([]);
      console.error('Erreur:', error);
    }
  }, [quizId, makeApiCall]);



  const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
        <div className="text-xl">Chargement des résultats...</div>
      </div>
    </div>
  );

  const Header = ({ metrics }: { metrics: Metrics }) => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
      <Button
        onClick={handleBackToAdmin}
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 mb-4 sm:mb-0"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour à l'accueil
      </Button>
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl font-bold text-yellow-400 mb-2">
          {quizTitle || 'Quiz'}
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          Code: {quizCode || 'QUIZ01'} • {metrics.totalStudents} participants
        </p>
      </div>
      <Button
        onClick={handleExportAllResults}
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
      >
        <Download className="w-4 h-4 mr-2" />
        Exporter les Résultats
      </Button>
    </div>
  );

  const SearchAndFilters = () => (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
      <div className="relative flex-1 max-w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="bg-white hover:bg-yellow-600 text-gray-900 flex-1 sm:flex-none">
          <Calendar className="w-4 h-4 mr-2" />
          Trier par date
        </Button>
        <Button className="bg-white hover:bg-yellow-600 text-gray-900 flex-1 sm:flex-none">
          <BarChart3 className="w-4 h-4 mr-2" />
          Trier par résultat
        </Button>
      </div>
    </div>
  );

  const MainContent = ({ filteredStudents }: { filteredStudents: Student[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <StudentsList 
        students={filteredStudents}
        selectedStudent={selectedStudent}
        onStudentSelect={loadStudentDetails}
      />
      <StudentResultsDetail
        selectedStudent={selectedStudent}
        studentAnswers={studentAnswers}
        onExportPDF={handleExportStudentResult}
      />
    </div>
  );

 

 
  useEffect(() => {
    loadQuizResults();
  }, [loadQuizResults]);


  useEffect(() => {
    if (!quizId) {
      navigate('/admin');
    }
  }, [quizId, navigate]);

 


  const metrics = calculateMetrics(students);
  const filteredStudents = getFilteredStudents();

  // Affichage de chargement
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <Header metrics={metrics} />
        <QuizMetrics metrics={metrics} />
        <SearchAndFilters />
        <MainContent filteredStudents={filteredStudents} />
      </div>
    </div>
  );
}

export default QuizResultsDetailPage;