import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import type { AxiosResponse } from "axios";

import { MainResultsCard, AnswerDetailsCard, ActionsCard } from "../components";

import type {
  QuizResultsLocationState,
  CustomLocation,
  CalculatedResults,
} from "@/types";


const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

function QuizResultsPage() {
  const navigate = useNavigate();

  const location = useLocation() as CustomLocation;
  const { quizInfo, tentativeId }: Partial<QuizResultsLocationState> =
    location.state || {};

  const [results, setResults] = useState<CalculatedResults | null>(null);

  const [isCalculating, setIsCalculating] = useState<boolean>(true);

  useEffect(() => {
    const fetchResults = async (): Promise<void> => {
      if (!quizInfo || !tentativeId) {
        navigate("/student");
        return;
      }

      try {
        interface ApiResultItem {
          questionId: number;
          questionTexte: string;
          reponseSelectionnee: {
            id: number;
            texte: string;
            estCorrecte: boolean;
          };
          bonneReponse?: {
            id: number;
            texte: string;
          };
        }
        interface ApiResult {
          resultats: ApiResultItem[];
          score: number;
        }

        const response: AxiosResponse<ApiResult> = await axios.get(
          `${API_BASE_URL}/api/public/questionnaires/tentative/${tentativeId}`
        );
        const data = response.data;

        const userAnswersDetails = data.resultats.map(
          (resultat: ApiResultItem) => {
            const userAnswer = {
              id: resultat.reponseSelectionnee.id,
              texte: resultat.reponseSelectionnee.texte,
            };
            const correctAnswer = resultat.bonneReponse
              ? {
                  id: resultat.bonneReponse.id,
                  texte: resultat.bonneReponse.texte,
                }
              : null;

            return {
              questionId: resultat.questionId,
              questionText: resultat.questionTexte,
              userAnswers: [userAnswer],
              correctAnswers: correctAnswer ? [correctAnswer] : [],
              isCorrect: resultat.reponseSelectionnee.estCorrecte,
              isMultipleChoice: false,
            };
          }
        );

        const correctAnswers = userAnswersDetails.filter(
          (detail) => detail.isCorrect
        ).length;
        const totalQuestions = userAnswersDetails.length;
        const percentage =
          data.score ??
          Math.round((correctAnswers / Math.max(1, totalQuestions)) * 100);

        setResults({
          score: correctAnswers,
          maxScore: totalQuestions,
          percentage,
          passed: percentage >= 50,
          totalQuestions,
          correctAnswers,
          wrongAnswers: totalQuestions - correctAnswers,
          questions: [],
          userAnswers: userAnswersDetails,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des résultats:", error);
        navigate("/student");
      } finally {
        setIsCalculating(false);
      }
    };

    fetchResults();
  }, [quizInfo, tentativeId, navigate]);

  const handleBackToHome = (): void => {
    navigate("/student");
  };

  // Affichage de chargement
  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Calcul des résultats...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!results) {
    navigate("/student");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
     
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Résultat du Quiz
          </h1>
          <p className="text-gray-300">Votre performance détaillée</p>
        </div>

      
        <MainResultsCard results={results} />

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
          <AnswerDetailsCard results={results} />

        
          <ActionsCard onBackToHome={handleBackToHome} />
        </div>
      </div>
    </div>
  );
}

export default QuizResultsPage;
