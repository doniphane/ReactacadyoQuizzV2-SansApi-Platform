

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Edit } from 'lucide-react';


import type { QuestionsListProps, ApiQuestionData, ApiAnswerData } from '../types';


import EditQuestionForm from './EditQuestionForm';

function QuestionsList({ questions, quizTitle, onQuestionUpdate }: QuestionsListProps) {
  
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

   
    const handleStartEdit = (questionId: number): void => {
        setEditingQuestionId(questionId);
    };

    
    const handleCancelEdit = (): void => {
        setEditingQuestionId(null);
    };

    
    const handleSaveEdit = async (questionId: number, updatedQuestion: ApiQuestionData): Promise<void> => {
        if (onQuestionUpdate) {
            await onQuestionUpdate(questionId, updatedQuestion);
        }
        setEditingQuestionId(null);
    };

   
    if (!questions || questions.length === 0) {
        return (
            <Card className="bg-gray-100 text-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Questions du quiz "{quizTitle}"
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-blue-800 font-semibold mb-2">Aucune question</h4>
                        <p className="text-blue-700">
                            Ce quiz n'a pas encore de questions. Ajoutez-en une ci-dessous !
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-100 text-gray-900">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    Questions du quiz "{quizTitle}"
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div 
                            key={`question-${question.id}-${index}`} 
                            className="border border-gray-200 rounded-lg p-4 bg-white"
                        >
                           
                            <div className="flex justify-between items-start mb-3">
                                <h5 className="font-semibold text-gray-900">
                                    Question {index + 1}: {question.texte || 'Question sans texte'}
                                </h5>
                                <Button
                                    onClick={() => handleStartEdit(question.id)}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                                >
                                    <Edit className="w-4 h-4" />
                                    Modifier
                                </Button>
                            </div>

                       
                            <div className="ml-4 space-y-3">
                                {question.reponses && Array.isArray(question.reponses) && 
                                    question.reponses.map((answer: ApiAnswerData, answerIndex: number) => (
                                        <div
                                            key={`answer-${answer.id}-${index}-${answerIndex}`}
                                            className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                                                answer.estCorrecte
                                                    ? 'bg-green-50 border-green-300'
                                                    : 'bg-red-50 border-red-300'
                                            }`}
                                        >
                                        
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                                answer.estCorrecte
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                            }`}>
                                                {answer.estCorrecte ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <XCircle className="w-4 h-4" />
                                                )}
                                            </div>

                                           
                                            <div className="flex-1">
                                                <span className={`font-semibold ${
                                                    answer.estCorrecte ? 'text-green-800' : 'text-red-800'
                                                }`}>
                                                    {answerIndex + 1}. {answer.texte || 'Réponse sans texte'}
                                                </span>
                                            </div>

                                         
                                            <Badge className={`${
                                                answer.estCorrecte
                                                    ? 'bg-green-100 text-green-800 border-green-300'
                                                    : 'bg-red-100 text-red-800 border-red-300'
                                            }`}>
                                                {answer.estCorrecte ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Correct
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Incorrect
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    ))
                                }
                            </div>

                          
                            {editingQuestionId === question.id && (
                                <EditQuestionForm
                                    question={question}
                                    onSave={(updatedQuestion) => handleSaveEdit(question.id, updatedQuestion)}
                                    onCancel={handleCancelEdit}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default QuestionsList; 