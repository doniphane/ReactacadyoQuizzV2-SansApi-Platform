import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  QuestionsList,
  AddQuestionForm,
  AIGeneratedQuestions,
} from "../components";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface QuizWithQuestions {
  id: number;
  title: string;
  accessCode: string;
  questions: ApiQuestionData[];
}

interface ApiQuestion {
  texte: string;
  numeroOrdre: number;
  questionnaire: number;
  reponses: {
    texte: string;
    estCorrecte: boolean;
    numeroOrdre: number;
  }[];
}

interface ApiQuestionData {
  id: number;
  texte: string;
  numeroOrdre: number;
  questionnaire: number;
  reponses: ApiAnswerData[];
}

interface ApiAnswerData {
  id: number;
  texte: string;
  estCorrecte: boolean;
  numeroOrdre: number;
}

function ManageQuestionsPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fonction pour gérer les erreurs d'API
  const handleApiError = useCallback((error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { status: number; data?: unknown };
      };
      const status = axiosError.response.status;

      switch (status) {
        case 401:
          return "Session expirée. Veuillez vous reconnecter.";
        case 403:
          return "Vous n'êtes pas autorisé à effectuer cette action";
        case 404:
          return "Ressource non trouvée";
        case 422:
          return "Données invalides. Vérifiez vos informations.";
        default:
          return "Erreur lors de l'opération";
      }
    }

    return "Erreur réseau. Vérifiez votre connexion.";
  }, []);

  const handleBackToDashboard = (): void => {
    navigate("/admin");
  };

  const fetchQuiz = useCallback(async (): Promise<void> => {
    if (!quizId) {
      setError("ID du quiz manquant");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<QuizWithQuestions>(
        `${API_BASE_URL}/api/quizzes/${quizId}`
      );

      setQuiz(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);

   
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response.status === 401) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [quizId, navigate, handleApiError]);

  const handleSubmitQuestion = async (
    questionData: ApiQuestion
  ): Promise<void> => {
    if (!quiz) {
      throw new Error("Quiz non disponible");
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/questions`, questionData);

      await fetchQuiz();
      toast.success("Question ajoutée avec succès");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitMultipleQuestions = async (
    questionsData: ApiQuestion[]
  ): Promise<void> => {
    if (!quiz) {
      throw new Error("Quiz non disponible");
    }

    setIsSubmitting(true);
    try {
     
      for (const questionData of questionsData) {
        await axios.post(`${API_BASE_URL}/api/questions`, questionData);
      }

      await fetchQuiz();
      toast.success("Questions ajoutées avec succès");
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionUpdate = async (
    questionId: number,
    updatedQuestion: ApiQuestionData
  ): Promise<void> => {
    if (!quiz) {
      throw new Error("Quiz non disponible");
    }

    setIsSubmitting(true);
    try {
      
      const questionData = {
        texte: updatedQuestion.texte,
        numeroOrdre: updatedQuestion.numeroOrdre,
        questionnaire: quiz.id,
        reponses: updatedQuestion.reponses.map(
          (reponse: ApiAnswerData, index: number) => ({
            texte: reponse.texte,
            estCorrecte: reponse.estCorrecte,
            numeroOrdre: index + 1,
          })
        ),
      };

      await axios.put(
        `${API_BASE_URL}/api/questions/${questionId}`,
        questionData
      );

      await fetchQuiz();
      toast.success("Question mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la question:", error);
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Breadcrumb = ({
    onBack,
    quizTitle,
  }: {
    onBack: () => void;
    quizTitle: string;
  }) => (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <button
        onClick={onBack}
        className="hover:text-yellow-400 transition-colors duration-200"
      >
        Dashboard
      </button>
      <span className="text-gray-600">/</span>
      <span className="text-yellow-400 font-medium">Gérer les questions</span>
      <span className="text-gray-600">/</span>
      <span className="text-gray-300">{quizTitle}</span>
    </nav>
  );

  const ManageQuestionsHeader = ({ quiz }: { quiz: QuizWithQuestions }) => (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-2">
        Gérer les Questions
      </h1>
      <p className="text-gray-300 text-lg">
        Quiz "{quiz.title}" - Code: {quiz.accessCode}
      </p>
    </div>
  );

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Chargement du quiz...</span>
      </div>
    </div>
  );

  const ErrorScreen = ({
    error,
    onBack,
    onRetry,
  }: {
    error: string;
    onBack: () => void;
    onRetry?: () => void;
  }) => (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <div className="space-x-4">
          <Button
            onClick={onBack}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
          >
            Retour au dashboard
          </Button>
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Réessayer
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const MainContent = () => (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Breadcrumb onBack={handleBackToDashboard} quizTitle={quiz!.title} />
      <ManageQuestionsHeader quiz={quiz!} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
   
        <div className="lg:col-span-2">
          <QuestionsList
            questions={quiz!.questions}
            quizTitle={quiz!.title}
            onQuestionUpdate={handleQuestionUpdate}
          />
        </div>

       
        <div className="space-y-6">
          <AddQuestionForm
            quizId={quiz!.id}
            currentQuestionsCount={quiz!.questions.length}
            onSubmit={handleSubmitQuestion}
            isSubmitting={isSubmitting}
          />

          <AIGeneratedQuestions
            quizId={quiz!.id}
            currentQuestionsCount={quiz!.questions.length}
            onAddQuestions={handleSubmitMultipleQuestions}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

 
  if (isLoading) {
    return <LoadingScreen />;
  }

 
  if (error || !quiz) {
    return (
      <ErrorScreen
        error={error || "Quiz non trouvé"}
        onBack={handleBackToDashboard}
        onRetry={error ? fetchQuiz : undefined}
      />
    );
  }

  return <MainContent />;
}

export default ManageQuestionsPage;
