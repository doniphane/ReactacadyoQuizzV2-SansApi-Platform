import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Clock, Trophy, Target } from 'lucide-react';
import type { AttemptDetailsProps } from '../types';


function AttemptDetails({ selectedAttempt, attemptDetails, loadingDetails }: AttemptDetailsProps) {
    return (
        <Card className="bg-gray-100 text-gray-900">
            <CardHeader>
                <CardTitle>Détails du Quiz</CardTitle>
            </CardHeader>
            <CardContent>
                {selectedAttempt ? (
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">
                                {selectedAttempt.quizTitle}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Code: {selectedAttempt.quizCode}
                            </p>
                            <div className="flex items-center justify-center mb-4">
                                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                <p className="text-sm text-gray-600">
                                    {selectedAttempt.date} à {selectedAttempt.time}
                                </p>
                            </div>
                            <div className={`text-3xl font-bold mb-2 ${
                                selectedAttempt.isPassed ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {selectedAttempt.percentage}%
                            </div>
                            <div className="flex items-center justify-center">
                                {selectedAttempt.isPassed ? (
                                    <Trophy className="w-5 h-5 text-green-600 mr-2" />
                                ) : (
                                    <Target className="w-5 h-5 text-red-600 mr-2" />
                                )}
                                <p className="text-sm text-gray-600">
                                    {selectedAttempt.isPassed ? 'Quiz réussi' : 'Quiz échoué'}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Score: {selectedAttempt.score || 0}/{selectedAttempt.nombreTotalQuestions || 0}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-4">Détails des réponses</h4>
                            {loadingDetails ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div>
                                    <p className="text-sm text-gray-600 mt-2">Chargement des détails...</p>
                                </div>
                            ) : attemptDetails.length > 0 ? (
                                <div className="space-y-3">
                                    {attemptDetails.map((answer: AttemptDetail, index: number) => (
                                        <div key={answer.questionId} className="p-3 border rounded-lg bg-white">
                                            <h5 className="font-medium text-gray-900 mb-2">
                                                Question {index + 1}: {answer.questionText}
                                            </h5>
                                            <div className="space-y-1">
                                                <div className="text-sm">
                                                    <span className="font-medium">Votre réponse:</span>
                                                    <span className={`ml-2 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                        {answer.userAnswer}
                                                    </span>
                                                </div>
                                                {!answer.isCorrect && (
                                                    <div className="text-sm">
                                                        <span className="font-medium">Réponse correcte:</span>
                                                        <span className="ml-2 text-green-600">
                                                            {answer.correctAnswer}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="mt-2">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                        answer.isCorrect
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Aucun détail disponible pour ce quiz
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Sélectionnez un quiz
                        </h3>
                        <p className="text-sm text-gray-500">
                            Cliquez sur un quiz dans la liste pour voir ses détails
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default AttemptDetails; 