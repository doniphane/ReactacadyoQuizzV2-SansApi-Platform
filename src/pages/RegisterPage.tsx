import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/components/RegisterForm';

function RegisterPage() {
	const RegisterHeader = () => (
		<div className="hidden xl:flex w-1/2 items-center justify-end pr-16">
			<div className="text-center">
				<h1 className="text-5xl font-bold mb-4">
					<span className="text-white">Acadyo</span>
					<span className="text-amber-500"> Quiz</span>
				</h1>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen flex" style={{ backgroundColor: "#18191D" }}>
			<RegisterHeader />

			<div className="w-full xl:w-1/2 flex items-center justify-center p-6 xl:justify-start xl:pl-16">
				<div className="w-full max-w-md">
					<Card className="bg-white rounded-lg border-2 border-amber-500 shadow-2xl">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl font-bold text-gray-900">
								Inscription
							</CardTitle>
							<CardDescription className="text-gray-600">
								Créez votre compte pour accéder au Quiz de Acadyo
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-4">
							<RegisterForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;