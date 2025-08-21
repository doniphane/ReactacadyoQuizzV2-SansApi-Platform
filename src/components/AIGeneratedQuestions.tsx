

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Toast from '@/components/ui/toast';
import { 
    Bot, 
    Loader2, 
    Sparkles, 
    AlertCircle, 
    CheckCircle, 
    Plus,
    Trash2
} from 'lucide-react';

// Import du service IA
import AIService from '../services/AIService';
import type { AIGeneratedQuestionsProps, AIQuestionResponse } from '../types';

function AIGeneratedQuestions({ 
    quizId, 
    currentQuestionsCount, 
    onAddQuestions, 
    isSubmitting 
}: AIGeneratedQuestionsProps) {
    // États pour la gestion de l'IA
    const [inputText, setInputText] = useState<string>('');
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(3);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestionResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // État pour le toast
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
    const [showToast, setShowToast] = useState<boolean>(false);

    // Fonction pour afficher un toast
    const showToastMessage = (message: string, type: 'success' | 'error' | 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const closeToast = () => {
        setShowToast(false);
    };

   
    const handleGenerateQuestions = async (): Promise<void> => {
        if (!inputText.trim()) {
            setError('Veuillez entrer du texte à analyser');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setSuccess(null);

        try {
            
            const result = await AIService.generateQuestionsWithAvailabilityCheck(
                inputText, 
                numberOfQuestions,
                showToastMessage 
            );
            
            if (result.error) {
                setError(result.error);
                setGeneratedQuestions([]);
            } else if (result.questions.length > 0) {
                setGeneratedQuestions(result.questions);
                setSuccess(result.message || 'Questions générées avec succès');
                setError(null);
            } else {
                setError('Aucune question n\'a pu être générée. Essayez avec un texte plus détaillé.');
                setGeneratedQuestions([]);
            }
        } catch {
            setError('Erreur lors de la génération des questions');
            setGeneratedQuestions([]);
        } finally {
            setIsGenerating(false);
        }
    };

    // Fonction pour supprimer une question générée
    const handleRemoveQuestion = (index: number): void => {
        const newQuestions = generatedQuestions.filter((_, i) => i !== index);
        setGeneratedQuestions(newQuestions);
    };

    // Fonction pour ajouter toutes les questions générées au quiz
    const handleAddGeneratedQuestions = async (): Promise<void> => {
        if (generatedQuestions.length === 0) return;

        try {
            const questionsToAdd = AIService.convertToApiFormat(
                generatedQuestions,
                quizId,
                currentQuestionsCount + 1
            );

            await onAddQuestions(questionsToAdd);
            
      
            setGeneratedQuestions([]);
            setInputText('');
            setSuccess('Questions ajoutées au quiz avec succès');
            setError(null);
        } catch {
            setError('Erreur lors de l\'ajout des questions au quiz');
        }
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        Génération automatique de questions avec l'IA
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Zone de saisie du texte */}
                    <div className="space-y-2">
                        <Label htmlFor="ai-text-input">
                            Texte à analyser pour générer des questions
                        </Label>
                        <Textarea
                            id="ai-text-input"
                            placeholder="Collez ici le texte que vous souhaitez analyser pour générer des questions automatiquement..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            rows={6}
                            className="resize-none"
                        />
                    </div>

                    {/* Configuration du nombre de questions */}
                    <div className="space-y-2">
                        <Label htmlFor="questions-count" className="text-sm font-medium">
                            Nombre de questions à générer
                        </Label>
                        <select
                            id="questions-count"
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                            disabled={isGenerating || isSubmitting}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={1}>1 question</option>
                            <option value={2}>2 questions</option>
                            <option value={3}>3 questions</option>
                            <option value={4}>4 questions</option>
                            <option value={5}>5 questions</option>
                        </select>
                    </div>

                  
                    <Button
                        type="button"
                        onClick={handleGenerateQuestions}
                        disabled={isGenerating || !inputText.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Génération en cours...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Générer des questions avec l'IA
                            </>
                        )}
                    </Button>

               
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Erreur</span>
                            </div>
                            <p className="text-xs text-red-700 mt-1">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Succès</span>
                            </div>
                            <p className="text-xs text-green-700 mt-1">{success}</p>
                        </div>
                    )}

                    
                    {generatedQuestions.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">
                                    Questions générées ({generatedQuestions.length})
                                </Label>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    IA Généré
                                </Badge>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {generatedQuestions.map((question, index) => (
                                    <div
                                        key={index}
                                        className="p-3 bg-white border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="font-medium text-sm">
                                                Question {index + 1}
                                            </h4>
                                            <Button
                                                type="button"
                                                onClick={() => handleRemoveQuestion(index)}
                                                variant="outline"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-red-600"
                                                disabled={isSubmitting}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        
                                        <p className="text-sm text-gray-700 mb-2">
                                            {question.question}
                                        </p>
                                        
                                        <div className="space-y-1">
                                            {question.answers.map((answer, answerIndex) => (
                                                <div
                                                    key={answerIndex}
                                                    className={`text-xs p-2 rounded ${
                                                        answer.correct
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}
                                                >
                                                    {answer.text}
                                                    {answer.correct && (
                                                        <CheckCircle className="w-3 h-3 inline ml-1" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            
                            <Button
                                type="button"
                                onClick={handleAddGeneratedQuestions}
                                disabled={isSubmitting}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Ajout en cours...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Ajouter toutes les questions au quiz
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

       
            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
                onClose={closeToast}
                duration={4000}
            />
        </>
    );
}

export default AIGeneratedQuestions; 