

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

// Import des types
import type { StudentResultsDetailProps } from '../types';

function StudentResultsDetail({ selectedStudent, studentAnswers, onExportPDF }: StudentResultsDetailProps) {
    return (
        <Card className="bg-gray-100 text-gray-900">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Résultats Détaillés</CardTitle>
                    {selectedStudent && studentAnswers.length > 0 && (
                        <Button
                            onClick={onExportPDF}
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 text-sm"
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Exporter PDF
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {selectedStudent ? (
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">{selectedStudent.name}</h3>
                            <p className="text-gray-600 mb-4">{selectedStudent.email}</p>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {selectedStudent.percentage}%
                            </div>
                            <p className="text-sm text-gray-600">
                                Score: {selectedStudent.score}/{selectedStudent.totalQuestions}
                            </p>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Détails des réponses</h4>
                            {studentAnswers.length > 0 ? (
                                <div className="space-y-3">
                                    {studentAnswers.map((answer, index) => (
                                        <div key={index} className="p-3 border rounded-lg bg-white">
                                            <h5 className="font-medium text-gray-900 mb-2">
                                                Question {index + 1}: {answer.questionText}
                                            </h5>
                                            <div className="space-y-1">
                                                <div className="text-sm">
                                                    <span className="font-medium">Votre réponse:</span>
                                                    <span className={`ml-2 ${
                                                        answer.isCorrect ? 'text-green-600' : 'text-red-600'
                                                    }`}>
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Chargement des détails...
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Sélectionnez un étudiant
                        </h3>
                        <p className="text-sm text-gray-500">
                            Cliquez sur un étudiant pour voir ses résultats
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default StudentResultsDetail; 