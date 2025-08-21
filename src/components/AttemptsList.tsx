import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { AttemptsListProps, TransformedAttempt } from '../types';


function AttemptsList({ attempts, selectedAttempt, onAttemptSelect }: AttemptsListProps) {
    return (
        <Card className="bg-gray-100 text-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Mes Quiz Passés ({attempts.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {attempts.length > 0 ? (
                    attempts.map((attempt: TransformedAttempt) => (
                        <div
                            key={attempt.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedAttempt?.id === attempt.id
                                    ? 'bg-blue-100 border-blue-300'
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => onAttemptSelect(attempt)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {attempt.quizTitle}
                                    </h3>
                                    <p className="text-sm text-blue-600">
                                        Code: {attempt.quizCode}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                        <p className="text-xs text-gray-500">
                                            {attempt.date} à {attempt.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center">
                                        {attempt.isPassed ? (
                                            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600 mr-1" />
                                        )}
                                        <p className={`font-bold ${attempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                            {attempt.percentage}%
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {attempt.score || 0}/{attempt.nombreTotalQuestions || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Aucun quiz passé
                        </h3>
                        <p className="text-sm text-gray-500">
                            Vous n'avez pas encore passé de quiz personnellement
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default AttemptsList; 