

import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Trophy, TrendingDown, Target } from 'lucide-react';


import type { QuizMetricsProps } from '../types';

function QuizMetrics({ metrics }: QuizMetricsProps) {
    return (
        <div className="grid grid-cols-5 gap-4 mb-8">
            <Card className="bg-yellow-400 text-gray-900">
                <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Participants</p>
                    <p className="text-2xl font-bold">{metrics.totalStudents}</p>
                </CardContent>
            </Card>

            <Card className="bg-yellow-400 text-gray-900">
                <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Moyenne</p>
                    <p className="text-2xl font-bold">{metrics.averageScore}%</p>
                </CardContent>
            </Card>

            <Card className="bg-yellow-400 text-gray-900">
                <CardContent className="p-4 text-center">
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Meilleur</p>
                    <p className="text-2xl font-bold">{metrics.bestScore}%</p>
                </CardContent>
            </Card>

            <Card className="bg-yellow-400 text-gray-900">
                <CardContent className="p-4 text-center">
                    <TrendingDown className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Plus Bas</p>
                    <p className="text-2xl font-bold">{metrics.lowestScore}%</p>
                </CardContent>
            </Card>

            <Card className="bg-yellow-400 text-gray-900">
                <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Taux Réussite</p>
                    <p className="text-2xl font-bold">{metrics.successRate}%</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizMetrics; 