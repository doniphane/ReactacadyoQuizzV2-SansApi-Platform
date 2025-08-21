import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';


import type { ActionsCardProps } from '../types';


function ActionsCard({ onBackToHome }: ActionsCardProps) {
    return (
        <Card className="bg-gray-200 text-gray-900 h-48">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-center">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-center h-full">
                <Button
                    onClick={onBackToHome}
                    variant="outline"
                    className="w-full border-gray-400 text-gray-700 hover:bg-gray-100 bg-transparent"
                >
                    <Home className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                </Button>
            </CardContent>
        </Card>
    );
}

export default ActionsCard; 