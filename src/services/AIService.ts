


// Interface pour les données de réponse de l'IA
interface AIQuestionResponse {
    question: string;
    answers: Array<{
        text: string;
        correct: boolean;
    }>;
}

// Interface pour la réponse complète de l'IA
interface AIGeneratedQuestions {
    questions: AIQuestionResponse[];
    message?: string;
    error?: string;
}

// Interface pour la réponse de test de disponibilité
interface AvailabilityResponse {
    isAvailable: boolean;
    message?: string;
    error?: string;
}



class AIService {
   
    static async checkOpenRouterAvailability(): Promise<AvailabilityResponse> {
        try {
            
            const AuthService = (await import('./AuthService')).default;
            const token = AuthService.getToken();
            if (!token) {
                return {
                    isAvailable: false,
                    error: 'Vous devez être connecté pour tester la disponibilité.'
                };
            }

            // Appeler le backend Symfony qui teste OpenRouter
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8000';
            const requestUrl = `${apiBaseUrl}/api/ai/check-availability`;
            
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            
            return {
                isAvailable: data.isAvailable || false,
                message: data.message || 'Test de disponibilité terminé'
            };

        } catch (error) {
            let errorMessage = 'Erreur lors du test de disponibilité';
            
            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    errorMessage = 'Vous devez être connecté pour tester la disponibilité.';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Erreur serveur. Vérifiez la configuration OpenRouter.';
                } else if (error.message.includes('timeout')) {
                    errorMessage = 'Timeout de la connexion. Vérifiez votre connexion internet.';
                } else {
                    errorMessage = error.message;
                }
            }

            return {
                isAvailable: false,
                error: errorMessage
            };
        }
    }



 
    static async generateQuestionsWithAvailabilityCheck(
        text: string, 
        numberOfQuestions: number = 3,
        onToastMessage?: (message: string, type: 'success' | 'error' | 'info') => void
    ): Promise<AIGeneratedQuestions> {
        try {
           
            if (onToastMessage) {
                onToastMessage('Vérification de la disponibilité de l\'IA...', 'info');
            }

            
            const availability = await AIService.checkOpenRouterAvailability();
            
            if (!availability.isAvailable) {
                const errorMessage = availability.error || 'OpenRouter n\'est pas disponible';
                if (onToastMessage) {
                    onToastMessage(errorMessage, 'error');
                }
                return {
                    questions: [],
                    error: errorMessage
                };
            }

          
            if (onToastMessage) {
                onToastMessage('IA disponible ! Génération des questions...', 'success');
            }

           
            return await AIService.generateQuestionsFromText(text, numberOfQuestions);

        } catch {
            const errorMessage = 'Erreur lors de la vérification et génération';
            if (onToastMessage) {
                onToastMessage(errorMessage, 'error');
            }
            return {
                questions: [],
                error: errorMessage
            };
        }
    }

  
    static async generateQuestionsFromText(
        text: string, 
        numberOfQuestions: number = 3
    ): Promise<AIGeneratedQuestions> {
        try {
          
            const AuthService = (await import('./AuthService')).default;
            const token = AuthService.getToken();
            if (!token) {
                return {
                    questions: [],
                    error: 'Vous devez être connecté pour utiliser cette fonctionnalité.'
                };
            }

        
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8000';
            const requestUrl = `${apiBaseUrl}/api/ai/generate-questions`;
            
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: text,
                    numberOfQuestions: numberOfQuestions
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            return {
                questions: data.questions || [],
                message: data.message || `Génération réussie de ${data.questions?.length || 0} questions`
            };
        } catch (error) {
            let errorMessage = 'Erreur lors de la génération des questions';
            if (error instanceof Error) {
                if (error.message.includes('401')) {
                    errorMessage = 'Vous devez être connecté pour utiliser cette fonctionnalité.';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Erreur serveur. Vérifiez la configuration OpenRouter.';
                } else {
                    errorMessage = error.message;
                }
            }
            return {
                questions: [],
                error: errorMessage
            };
        }
    }



  
    static convertToApiFormat(
        aiQuestions: AIQuestionResponse[], 
        quizId: number, 
        startOrder: number
    ) {
        return aiQuestions.map((aiQuestion, index) => ({
            texte: aiQuestion.question,
            numeroOrdre: startOrder + index,
            questionnaire: quizId,
            reponses: aiQuestion.answers.map((answer, answerIndex) => ({
                texte: answer.text,
                estCorrecte: answer.correct,
                numeroOrdre: answerIndex + 1
            }))
        }));
    }
}

export default AIService;
export type { AIQuestionResponse, AIGeneratedQuestions, AvailabilityResponse };