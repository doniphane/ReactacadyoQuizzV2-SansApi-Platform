import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import type { MainResultsCardProps } from '../types';


function MainResultsCard({ results }: MainResultsCardProps) {
    const getMotivationMessage = (percentage: number): string => {
        if (percentage >= 80) {
            return 'Excellent !';
        } else if (percentage >= 60) {
            return 'Bien, mais peut mieux faire !';
        } else {
            return 'Il faut réviser !';
        }
    };

  
    const getMessageColor = (percentage: number): string => {
        if (percentage >= 80) {
            return 'text-green-600';
        } else if (percentage >= 60) {
            return 'text-yellow-600';
        } else {
            return 'text-red-600';
        }
    };

    return (
        <Card className="bg-gray-200 text-gray-900 mb-6">
            <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
                <div className="text-6xl font-bold mb-2">
                    {results.score}/{results.totalQuestions}
                </div>
                <div className="text-2xl text-gray-600 mb-4">
                    {Math.round(results.percentage)}%
                </div>
                <div className={`font-semibold text-lg ${getMessageColor(results.percentage)}`}>
                    {getMotivationMessage(results.percentage)}
                </div>
            </CardContent>
        </Card>
    );
}

export default MainResultsCard; 