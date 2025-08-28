import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ChevronRight, Send } from "lucide-react";
import toast from "react-hot-toast";
import type {
  TakeQuizLocationState,
  TakeQuizQuestion,
  TakeQuizResults,
  ApiQuestion,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TakeQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const state = location.state as TakeQuizLocationState;
  const [questions, setQuestions] = useState<TakeQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, number | number[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMultipleChoiceQuestion = (): boolean => {
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion ? currentQuestion.isMultipleChoice : false;
  };

  const handleBackToStudent = () => {
    navigate("/student");
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Gérer la sélection d'une réponse
  const handleAnswerSelect = (questionId: number, answerId: number) => {
    const isMultiple = isMultipleChoiceQuestion();

    if (isMultiple) {
      // Question à choix multiples
      const currentAnswers = (userAnswers[questionId] as number[]) || [];
      if (currentAnswers.includes(answerId)) {
        // Désélectionner la réponse
        setUserAnswers((prev) => ({
          ...prev,
          [questionId]: currentAnswers.filter((id) => id !== answerId),
        }));
      } else {
        setUserAnswers((prev) => ({
          ...prev,
          [questionId]: [...currentAnswers, answerId],
        }));
      }
    } else {
      // Question à choix unique
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answerId,
      }));
    }
  };

  const makeApiCall = useCallback(
    async (endpoint: string, options?: RequestInit) => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: options?.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...((options?.headers as Record<string, string>) || {}),
          },
          body: options?.body,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Erreur API:", error);
        throw error;
      }
    },
    []
  );

  // Charger les questions du quiz
  const loadQuizQuestions = useCallback(async () => {
    if (!state?.quizInfo?.id) return;

    try {
      setIsLoading(true);

      const quizData = await makeApiCall(
        `/api/public/questionnaires/${state.quizInfo.id}`
      );

      if (quizData.questions && Array.isArray(quizData.questions)) {
        // Formatter les questions pour l'interface
        const formattedQuestions: TakeQuizQuestion[] = quizData.questions.map(
          (apiQuestion: ApiQuestion) => ({
            id: apiQuestion.id,
            text: apiQuestion.texte,
            order: apiQuestion.numeroOrdre,
            isMultipleChoice: apiQuestion.isMultipleChoice,
            answers: apiQuestion.reponses.map((reponse) => ({
              id: reponse.id,
              text: reponse.texte,
              orderNumber: reponse.numeroOrdre,
              isCorrect: false,
            })),
          })
        );

        setQuestions(formattedQuestions);
      } else {
        throw new Error("Aucune question trouvée pour ce quiz");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des questions:", error);
      toast.error("Erreur lors du chargement du quiz");
      navigate("/student");
    } finally {
      setIsLoading(false);
    }
  }, [state?.quizInfo?.id, navigate, makeApiCall]);


  const submitQuiz = async () => {
    if (!state?.quizInfo?.id || !state?.participantData) {
      toast.error("Données manquantes pour soumettre le quiz");
      return;
    }

    setIsSubmitting(true);
    try {
    
      // Traiter les réponses en gérant les choix multiples
      const reponses = Object.entries(userAnswers).flatMap(
        ([questionId, answerId]) => {
          const questionIdInt = parseInt(questionId);
          if (Array.isArray(answerId)) {
            // Question à choix multiple - créer une entrée pour chaque réponse
            return answerId.map(id => ({
              questionId: questionIdInt,
              reponseId: id,
            }));
          } else {
            // Question à choix unique
            return [{
              questionId: questionIdInt,
              reponseId: answerId,
            }];
          }
        }
      );

     
      const result = await makeApiCall(
        `/api/public/questionnaires/${state.quizInfo.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prenomParticipant: state.participantData.firstName,
            nomParticipant: state.participantData.lastName,
            reponses: reponses,
          }),
        }
      );

   
      const totalQuestions = result.totalQuestions || questions.length;
      const bonnesReponses = result.bonnesReponses || 0;
      const percentage =
        typeof result.score === "number"
          ? result.score
          : Math.round((bonnesReponses / Math.max(totalQuestions, 1)) * 100);
      const passed = percentage >= (state.quizInfo.scorePassage ?? 50);

      const results: TakeQuizResults = {
        score: bonnesReponses,
        maxScore: totalQuestions,
        percentage,
        passed,
        totalQuestions,
      };

     
      navigate("/quiz-results", {
        state: {
          quizInfo: state.quizInfo,
          userAnswers: userAnswers,
          results: results,
          tentativeId: result.tentativeId,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de la soumission du quiz");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleNextButton = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      await submitQuiz();
    } else {
      goToNextQuestion();
    }
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-xl">Chargement du quiz...</p>
      </div>
    </div>
  );

  const NoQuestionsScreen = () => (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl mb-4">Aucune question trouvée pour ce quiz</p>
        <Button
          onClick={handleBackToStudent}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );

  const Header = () => (
    <div className="flex justify-between items-center mb-6">
      <Button
        onClick={handleBackToStudent}
        variant="outline"
        className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-yellow-400">
          {state.quizInfo.titre}
        </h1>
        <p className="text-gray-300">
          {state.participantData.firstName} {state.participantData.lastName}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-400">Question</p>
        <p className="text-lg font-bold text-yellow-400">
          {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>
    </div>
  );

  const ProgressSection = ({ progress }: { progress: number }) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isMultiple = currentQuestion?.isMultipleChoice;
    
    return (
      <div className="mb-8">
        <Progress value={progress} className="h-2 [&>*]:bg-yellow-400" />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-400">
            {Math.round(progress)}% complété
          </p>
          {currentQuestion && (
            <p className="text-sm text-yellow-400 font-medium">
              {isMultiple ? "Choix multiple" : "Choix unique"}
            </p>
          )}
        </div>
      </div>
    );
  };

  const QuestionCard = ({
    currentQuestion,
    currentAnswer,
  }: {
    currentQuestion: TakeQuizQuestion;
    currentAnswer: number | number[] | undefined;
  }) => {
    const isMultiple = currentQuestion.isMultipleChoice;
    
    return (
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            {currentQuestion.text}
          </CardTitle>
          <p className="text-sm text-yellow-400 mt-2">
            {isMultiple ? "Sélectionnez une ou plusieurs réponses" : "Sélectionnez une seule réponse"}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.answers.map((answer: { id: number; text: string; isCorrect: boolean }) => {
            const isSelected = Array.isArray(currentAnswer)
              ? currentAnswer.includes(answer.id)
              : currentAnswer === answer.id;

            return (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                    : "border-gray-600 bg-gray-700 text-white hover:border-gray-500"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 border-2 mr-3 ${
                      isMultiple ? "rounded" : "rounded-full"
                    } ${
                      isSelected
                        ? "border-yellow-400 bg-yellow-400"
                        : "border-gray-400"
                    }`}
                  />
                  {answer.text}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const NavigationButtons = ({
    hasAnswered,
    isLastQuestion,
  }: {
    hasAnswered: boolean;
    isLastQuestion: boolean;
  }) => (
    <div className="flex justify-between">
      <Button
        onClick={() =>
          setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
        }
        disabled={currentQuestionIndex === 0}
        variant="outline"
        className="border-gray-600 text-gray-400"
      >
        Précédent
      </Button>
      <Button
        onClick={handleNextButton}
        disabled={!hasAnswered || isSubmitting}
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
            Soumission...
          </>
        ) : isLastQuestion ? (
          <>
            <Send className="w-4 h-4 mr-2" />
            Terminer le quiz
          </>
        ) : (
          <>
            <ChevronRight className="w-4 h-4 mr-2" />
            Question suivante
          </>
        )}
      </Button>
    </div>
  );

  const MainQuizContent = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const currentAnswer = userAnswers[currentQuestion.id];
    const hasAnswered =
      currentAnswer !== undefined &&
      (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <Header />
          <ProgressSection progress={progress} />
          <QuestionCard
            currentQuestion={currentQuestion}
            currentAnswer={currentAnswer}
          />
          <NavigationButtons
            hasAnswered={hasAnswered}
            isLastQuestion={isLastQuestion}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!state?.participantData || !state?.quizInfo) {
      toast.error("Données manquantes pour le quiz");
      navigate("/student");
    }
  }, [state, navigate]);


  useEffect(() => {
    loadQuizQuestions();
  }, [loadQuizQuestions]);

  if (!state?.participantData || !state?.quizInfo) {
    return null;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (questions.length === 0) {
    return <NoQuestionsScreen />;
  }

  return <MainQuizContent />;
}

export default TakeQuizPage;
