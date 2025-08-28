import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


import { LogOut, History, Menu, X } from 'lucide-react';


import AuthService from '../services/AuthService';
import { StudentAccessForm } from '@/components';
import type { QuizInfo } from '../types';


function StudentPage() {
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Fonction de déconnexion
	const handleLogout = async (): Promise<void> => {
		try {
			await AuthService.logout();
			navigate('/login');
		} catch {
			navigate('/login');
		}
	};


	const handleNavigateToHistory = (): void => {
		navigate('/student-history');
	};

	
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			
			<div className="bg-gray-800 p-4">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Espace Étudiant</h1>

					{/* hamburger pour mobile */}
					<div className="md:hidden">
						<button onClick={toggleMobileMenu} className="text-white focus:outline-none">
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>

					{/* Menu desktop */}
					<div className="hidden md:flex gap-4">
						<Button onClick={handleNavigateToHistory} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3">
							<History className="w-4 h-4 mr-2" />
							Mon Historique
						</Button>
						<Button onClick={handleLogout} className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3">
							<LogOut className="w-4 h-4 mr-2" />
							Déconnexion
						</Button>
					</div>
				</div>

				{/* Menu mobile */}
				{isMobileMenuOpen && (
					<div className="md:hidden mt-4 space-y-2">
						<Button onClick={handleNavigateToHistory} className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3">
							<History className="w-4 h-4 mr-2" />
							Mon Historique
						</Button>
						<Button onClick={handleLogout} className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3">
							<LogOut className="w-4 h-4 mr-2" />
							Déconnexion
						</Button>
					</div>
				)}
			</div>

		
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="max-w-md w-full">
					<Card className="border-2 border-yellow-400 shadow-2xl">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl font-bold text-gray-900">Accéder à un quiz</CardTitle>
							<p className="text-gray-600">Entrez vos informations et le code du quiz</p>
						</CardHeader>

						<CardContent className="space-y-4">
							<StudentAccessForm
								onSuccess={({ participantData, quizInfo }: { participantData: { firstName: string; lastName: string; quizCode: string }; quizInfo: QuizInfo }) => {
									navigate('/take-quiz', { state: { participantData, quizInfo } });
								}}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default StudentPage;