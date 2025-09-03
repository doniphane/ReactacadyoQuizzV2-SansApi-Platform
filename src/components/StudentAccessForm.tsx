import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../store/authStore';
import AuthService from '../services/AuthService';

interface StudentFormData {
	firstName: string;
	lastName: string;
	quizCode: string;
}

interface QuizInfo {
	id: number;
	title: string;
	description?: string;
	isActive: boolean;
	isStarted: boolean;
	accessCode: string;
	scorePassage?: number;
	questions?: unknown[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function FormField({
	label,
	id,
	type,
	placeholder,
	autoComplete,
	error,
	disabled,
	register,
	fieldName,
	validation,
	maxLength,
	className = ''
}: {
	label: string;
	id: string;
	type: string;
	placeholder: string;
	autoComplete: string;
	error: FieldError | undefined;
	disabled: boolean;
	register: UseFormRegister<StudentFormData>;
	fieldName: keyof StudentFormData;
	validation: object;
	maxLength?: number;
	className?: string;
}) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id} className="text-sm font-medium">
				{label}
			</Label>
			<Input
				id={id}
				type={type}
				autoComplete={autoComplete}
				placeholder={placeholder}
				disabled={disabled}
				maxLength={maxLength}
				className={`focus:ring-amber-500 focus:border-amber-500 ${className} ${
					error ? 'border-red-500' : ''
				}`}
				{...register(fieldName, validation)}
			/>
			{error && <p className="text-sm text-red-600">{error.message}</p>}
		</div>
	);
}

function SubmitButton({ isDisabled, isLoading }: { isDisabled: boolean; isLoading: boolean }) {
	return (
		<Button
			type="submit"
			disabled={isDisabled}
			className="w-full bg-yellow-500 hover:bg-yellow-400 focus:ring-amber-500 text-black font-bold"
		>
			{isLoading ? 'Recherche du quiz...' : 'Commencer le quiz'}
		</Button>
	);
}

export default function StudentAccessForm({
	onSuccess
}: {
	onSuccess: (payload: {
		participantData: { firstName: string; lastName: string; quizCode: string };
		quizInfo: QuizInfo;
	}) => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors,
		setValue
	} = useForm<StudentFormData>({
		mode: 'onChange',
		defaultValues: { firstName: '', lastName: '', quizCode: '' }
	});

	// Pré-remplir les champs avec les informations de l'utilisateur connecté
	useEffect(() => {
		if (user) {
			if (user.firstName) {
				setValue('firstName', user.firstName);
			}
			if (user.lastName) {
				setValue('lastName', user.lastName);
			}
		}
	}, [user, setValue]);

	const onSubmit = async (data: StudentFormData): Promise<void> => {
		clearErrors();
		setIsLoading(true);
		try {
			// Vérifier l'authentification avant d'accéder au quiz
			const token = AuthService.getToken();
			if (!token) {
				toast.error("Vous devez être connecté pour accéder à un quiz");
				navigate("/login");
				return;
			}

			const response = await fetch(
				`${API_BASE_URL}/api/quizzes/play/code/${data.quizCode.trim().toUpperCase()}`,
				{
					method: 'GET',
					headers: { 
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				}
			);

			if (!response.ok) {
				switch (response.status) {
					case 404:
						setError('quizCode', { type: 'manual', message: "Aucun quiz trouvé avec ce code d'accès" });
						break;
					case 403:
						setError('quizCode', { type: 'manual', message: "Ce quiz n'est pas disponible" });
						break;
					default:
						toast.error('Erreur lors de la recherche du quiz');
				}
				return;
			}

			const quizInfo: QuizInfo = await response.json();

			if (!quizInfo.isActive) {
				setError('quizCode', { type: 'manual', message: "Ce quiz n'est pas actif actuellement" });
				return;
			}

			onSuccess({
				participantData: {
					firstName: data.firstName.trim(),
					lastName: data.lastName.trim(),
					quizCode: data.quizCode.trim().toUpperCase()
				},
				quizInfo
			});
		} catch (error) {
			console.error('Erreur lors de la recherche du quiz:', error);
			toast.error('Erreur de connexion. Vérifiez votre réseau.');
		} finally {
			setIsLoading(false);
		}
	};

	const isFormDisabled = isLoading || isSubmitting;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<FormField
				label="Prénom"
				id="firstName"
				type="text"
				placeholder="Votre prénom"
				autoComplete="given-name"
				error={errors.firstName}
				disabled={isFormDisabled}
				register={register}
				fieldName="firstName"
				validation={{
					required: 'Le prénom est requis',
					minLength: { value: 2, message: 'Le prénom doit contenir au moins 2 caractères' }
				}}
				maxLength={50}
			/>

			<FormField
				label="Nom"
				id="lastName"
				type="text"
				placeholder="Votre nom de famille"
				autoComplete="family-name"
				error={errors.lastName}
				disabled={isFormDisabled}
				register={register}
				fieldName="lastName"
				validation={{
					required: 'Le nom est requis',
					minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
				}}
				maxLength={50}
			/>

			<FormField
				label="Code du quiz"
				id="quizCode"
				type="text"
				placeholder="Ex: MATH01"
				autoComplete="off"
				error={errors.quizCode}
				disabled={isFormDisabled}
				register={register}
				fieldName="quizCode"
				validation={{
					required: 'Le code du quiz est requis',
					minLength: { value: 3, message: 'Le code doit contenir au moins 3 caractères' }
				}}
				maxLength={20}
				className="uppercase"
			/>

			<SubmitButton isDisabled={isFormDisabled} isLoading={isLoading} />
		</form>
	);
} 