import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ResetPasswordFormData {
    token: string;
    password: string;
    confirmPassword: string;
}

function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm<ResetPasswordFormData>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        defaultValues: { 
            token: '', 
            password: '', 
            confirmPassword: '' 
        }
    });


    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setValue('token', tokenFromUrl);
        } else {
            // Si pas de token dans l'URL, rediriger vers forgot-password
            setErrorMessage('Lien invalide ou expiré. Veuillez faire une nouvelle demande.');
            setTimeout(() => {
                navigate('/forgot-password');
            }, 3000);
        }
    }, [searchParams, setValue, navigate]);

    const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
        if (isLoading || isSubmitting) {
            return;
        }

        // Vérification des mots de passe uniquement à la soumission
        if (data.password !== data.confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/mail/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: data.token, 
                    password: data.password 
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || 'Mot de passe réinitialisé avec succès');
                reset();
                setTimeout(() => {
                    navigate('/login', { 
                        state: { 
                            successMessage: 'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.' 
                        } 
                    });
                }, 2000);
            } else {
                setErrorMessage(result.error || 'Une erreur est survenue');
            }
        } catch (error) {
            setErrorMessage('Erreur réseau. Veuillez vérifier votre connexion.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const StatusMessages = ({ 
        error, 
        success 
    }: { 
        error: string; 
        success: string;
    }) => (
        <>
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <p className="text-sm font-medium">{success}</p>
                    <p className="text-xs mt-1">Redirection vers la page de connexion...</p>
                </div>
            )}
        </>
    );

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
        validation,
        description
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
        description?: string;
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
            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}
            {error && (
                <p className="text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );

    const SubmitButton = ({ isDisabled }: { isDisabled: boolean }) => (
        <Button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-yellow-500 hover:bg-yellow-400 focus:ring-amber-500 text-black font-bold"
        >
            {isDisabled ? (
                <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Réinitialisation...
                </>
            ) : (
                <>
                    Réinitialiser le mot de passe
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </>
            )}
        </Button>
    );

    const BackToLoginLink = ({ onNavigate }: { onNavigate: () => void }) => (
        <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
                Retour à la{' '}
                <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-amber-500 hover:text-amber-600"
                    onClick={onNavigate}
                >
                    page de connexion
                </Button>
            </p>
        </div>
    );

    const ResetPasswordForm = () => {
        const isFormDisabled = isLoading || isSubmitting;
        
        const handleFormSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
        };
        
        return (
            <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                {/* Token caché - récupéré automatiquement depuis l'URL */}
                <input 
                    type="hidden" 
                    {...(register as (name: string, options?: object) => object)('token', {
                        required: 'Token requis'
                    })}
                />

                <FormField
                    label="Nouveau mot de passe"
                    id="password"
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    autoComplete="new-password"
                    error={errors.password}
                    disabled={isFormDisabled}
                    register={register}
                    fieldName="password"
                    validation={{
                        required: 'Nouveau mot de passe requis',
                        minLength: {
                            value: 6,
                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                        }
                    }}
                />

                <FormField
                    label="Confirmer le mot de passe"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                    disabled={isFormDisabled}
                    register={register}
                    fieldName="confirmPassword"
                    validation={{
                        required: 'Confirmation du mot de passe requise'
                    }}
                />

                <SubmitButton isDisabled={isFormDisabled} />
            </form>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#18191D' }}>
            <Card className="w-full max-w-md border-2 border-amber-500 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Réinitialiser le mot de passe
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Choisissez votre nouveau mot de passe sécurisé
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <StatusMessages 
                        error={errorMessage} 
                        success={successMessage}
                    />
                    
                    <ResetPasswordForm />
                    
                    <BackToLoginLink onNavigate={handleBackToLogin} />
                </CardContent>
            </Card>
        </div>
    );
}

export default ResetPasswordPage;