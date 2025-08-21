import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import type { AnswerDetailsCardProps } from '../types';


function AnswerDetailsCard({ results }: AnswerDetailsCardProps) {
    return (
        <Card className="bg-gray-200 text-gray-900">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Détail des Réponses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {results.userAnswers.map((answerDetail, index) => (
                    <div 
                        key={answerDetail.questionId} 
                        className="border border-gray-300 rounded-lg p-4 bg-gray-100"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            {answerDetail.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            )}
                            <h3 className="font-semibold">
                                Question {index + 1}: {answerDetail.questionText}
                            </h3>
                        </div>
                        <div className="ml-8 space-y-2">
                            <div className={answerDetail.isCorrect ? "text-green-600" : "text-red-600"}>
                                <span className="font-medium">
                                    {answerDetail.isMultipleChoice ? "Vos réponses:" : "Votre réponse:"}
                                </span>
                                <div className="ml-2">
                                    {answerDetail.userAnswers.map((answer) => (
                                        <div key={answer.id} className="ml-2">
                                            • {answer.texte}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {!answerDetail.isCorrect && (
                                <div className="text-green-600">
                                    <span className="font-medium">
                                        {answerDetail.isMultipleChoice ? "Réponses correctes:" : "Réponse correcte:"}
                                    </span>
                                    <div className="ml-2">
                                        {answerDetail.correctAnswers.map((answer) => (
                                            <div key={answer.id} className="ml-2">
                                                • {answer.texte}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default AnswerDetailsCard; 