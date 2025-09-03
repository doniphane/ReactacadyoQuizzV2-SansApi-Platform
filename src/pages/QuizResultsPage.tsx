import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { MainResultsCard, AnswerDetailsCard, ActionsCard } from "../components";
import AuthService from "../services/AuthService";

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
          isMultipleChoice: boolean;
          reponsesSelectionnees: Array<{
            id: number;
            texte: string;
            estCorrecte: boolean;
          }>;
          bonnesReponses: Array<{
            id: number;
            texte: string;
            estCorrecte: boolean;
          }>;
          estCorrecte: boolean;
        }
        interface ApiResult {
          resultats: ApiResultItem[];
          score: number;
        }

        // Vérifier l'authentification pour accéder aux résultats
        const token = AuthService.getToken();
        if (!token) {
          toast.error("Vous devez être connecté pour voir les résultats");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/authenticated/questionnaires/tentative/${tentativeId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResult = await response.json();

        const userAnswersDetails = data.resultats.map(
          (resultat: ApiResultItem) => {
            // Mapper les réponses utilisateur
            const userAnswers = resultat.reponsesSelectionnees.map(reponse => ({
              id: reponse.id,
              texte: reponse.texte,
            }));

            // Mapper les bonnes réponses
            const correctAnswers = resultat.bonnesReponses.map(reponse => ({
              id: reponse.id,
              texte: reponse.texte,
            }));

            return {
              questionId: resultat.questionId,
              questionText: resultat.questionTexte,
              userAnswers: userAnswers,
              correctAnswers: correctAnswers,
              isCorrect: resultat.estCorrecte,
              isMultipleChoice: resultat.isMultipleChoice,
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
