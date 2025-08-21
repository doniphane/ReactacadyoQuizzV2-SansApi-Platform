import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight } from 'lucide-react';
import type {
	UserData,
	ApiErrorResponse
} from '@/types';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

interface RegisterFormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

interface FetchError {
	status: number;
	data?: ApiErrorResponse;
}

const FormField = ({
	label,
	id,
	type,
	placeholder,
	autoComplete,
	error,
	disabled,
	register,
	fieldName,
	validation
}: {
	label: string;
	id: string;
	type: string;
	placeholder: string;
	autoComplete: string;
	error: { message?: string } | undefined;
	disabled: boolean;
	register: unknown;
	fieldName: string;
	validation: object;
}) => (
	<div className="space-y-2">
		<Label htmlFor={id}>{label}</Label>
		<Input
			id={id}
			type={type}
			autoComplete={autoComplete}
			placeholder={placeholder}
			disabled={disabled}
			className={`focus:ring-amber-500 focus:border-amber-500 ${
				error ? 'border-red-500' : ''
			}`}
			{...(register as (name: string, options?: object) => object)(fieldName, validation)}
		/>
		{error && (
			<p className="text-sm text-red-600">{error.message}</p>
		)}
	</div>
);

const RegisterButton = ({ isDisabled }: { isDisabled: boolean }) => (
	<Button
		type="submit"
		disabled={isDisabled}
		className="w-full bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
	>
		{isDisabled ? (
			<>
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				Création en cours...
			</>
		) : (
			<>
				S'inscrire
				<ArrowRight className="ml-2 h-4 w-4" />
			</>
		)}
	</Button>
);

const LoginLink = ({ onNavigate, isDisabled }: { onNavigate: () => void; isDisabled: boolean }) => (
	<div className="mt-6 text-center">
		<p className="text-gray-700 text-sm">
			Déjà un compte ?{" "}
			<Button
				variant="link"
				className="p-0 h-auto text-amber-500 hover:text-amber-400 font-medium underline"
				onClick={onNavigate}
				disabled={isDisabled}
			>
				Se connecter
			</Button>
		</p>
	</div>
);

function handleApiError(
	error: FetchError,
	setError: (field: keyof RegisterFormData, options: { type: string; message: string }) => void,
	clearErrors: (fields?: (keyof RegisterFormData)[]) => void
): void {
	clearErrors(['firstName', 'lastName', 'email', 'password']);

	if (!error.status) {
		setError('email', { type: 'manual', message: 'Problème de connexion au serveur. Veuillez réessayer.' });
		return;
	}

	const status = error.status;
	const data = error.data;
	let message = '';

	switch (status) {
		case 409:
			message = "Cet email est déjà utilisé par un autre compte";
			break;
		case 422:
			if (data?.violations) {
				message = data.violations.map((v) => v.message).join(', ');
			} else if (data?.detail) {
				message = data.detail;
			} else {
				message = "Les données du formulaire ne sont pas valides";
			}
			break;
		case 400:
			message = "Données invalides. Vérifiez votre saisie.";
			break;
		case 404:
			message = "La route d'inscription n'est pas disponible";
			break;
		case 500:
			message = "Erreur interne du serveur. Veuillez réessayer plus tard.";
			break;
		default:
			message = data?.message || data?.detail || "Erreur lors de la création du compte";
	}

	setError('email', { type: 'manual', message });
}

function createUserData(data: RegisterFormData): UserData {
	return {
		firstName: data.firstName.trim(),
		lastName: data.lastName.trim(),
		email: data.email.trim(),
		password: data.password
	};
}

function RegisterForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors
	} = useForm<RegisterFormData>({
		defaultValues: { firstName: '', lastName: '', email: '', password: '' }
	});

	const onSubmit = async (data: RegisterFormData): Promise<void> => {
		clearErrors();
		const userData = createUserData(data);

		try {
			const response = await fetch(`${API_BASE_URL}/api/users/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});

			if (response.status === 201 || response.status === 200) {
				navigate('/login', {
					state: {
						successMessage: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
					}
				});
			} else {
				let errorData: ApiErrorResponse | undefined;
				try {
					errorData = await response.json();
				} catch {
					errorData = undefined;
				}

				const fetchError: FetchError = {
					status: response.status,
					data: errorData
				};

				handleApiError(fetchError, setError, clearErrors);
			}
		} catch {
			const networkError: FetchError = {
				status: 0,
				data: undefined
			};
			handleApiError(networkError, setError, clearErrors);
		}
	};

	const goToLoginPage = (): void => {
		navigate('/login');
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<FormField
						label="Prénom"
						id="firstName"
						type="text"
						placeholder="Votre prénom"
						autoComplete="given-name"
						error={errors.firstName}
						disabled={isSubmitting}
						register={register}
						fieldName="firstName"
						validation={{
							required: 'Prénom requis',
							minLength: {
								value: 2,
								message: 'Le prénom doit contenir au moins 2 caractères'
							},
							maxLength: {
								value: 255,
								message: 'Le prénom ne peut pas dépasser 255 caractères'
							},
							pattern: {
								value: /^[a-zA-ZÀ-ÿ\s'-]+$/u,
								message: 'Le prénom ne peut contenir que des lettres, espaces, apostrophes et tirets'
							}
						}}
					/>

					<FormField
						label="Nom"
						id="lastName"
						type="text"
						placeholder="Votre nom"
						autoComplete="family-name"
						error={errors.lastName}
						disabled={isSubmitting}
						register={register}
						fieldName="lastName"
						validation={{
							required: 'Nom requis',
							minLength: {
								value: 2,
								message: 'Le nom doit contenir au moins 2 caractères'
							},
							maxLength: {
								value: 255,
								message: 'Le nom ne peut pas dépasser 255 caractères'
							},
							pattern: {
								value: /^[a-zA-ZÀ-ÿ\s'-]+$/u,
								message: 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
							}
						}}
					/>
				</div>

				<FormField
					label="Email"
					id="email"
					type="email"
					placeholder="Entrez votre email"
					autoComplete="email"
					error={errors.email}
					disabled={isSubmitting}
					register={register}
					fieldName="email"
					validation={{
						required: 'Email requis',
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'Email invalide'
						},
						maxLength: {
							value: 180,
							message: "L'email ne peut pas dépasser 180 caractères"
						}
					}}
				/>

				<FormField
					label="Mot de passe"
					id="password"
					type="password"
					placeholder="Entrez votre mot de passe"
					autoComplete="new-password"
					error={errors.password}
					disabled={isSubmitting}
					register={register}
					fieldName="password"
					validation={{
						required: 'Mot de passe requis',
						minLength: {
							value: 6,
							message: 'Le mot de passe doit contenir au moins 6 caractères'
						},
						maxLength: {
							value: 255,
							message: 'Le mot de passe ne peut pas dépasser 255 caractères'
						},
						pattern: {
							value: /^(?=.*[a-zA-Z])(?=.*\d)/,
							message: 'Le mot de passe doit contenir au moins une lettre et un chiffre'
						}
					}}
				/>

				<RegisterButton isDisabled={isSubmitting} />
			</form>

			<LoginLink onNavigate={goToLoginPage} isDisabled={isSubmitting} />
		</>
	);
}

export default RegisterForm; 