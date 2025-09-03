import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ForgotPasswordFormData {
    email: string;
}

function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ForgotPasswordFormData>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: { email: '' }
    });

    const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
        if (isLoading || isSubmitting) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8000/api/mail/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage(result.message || 'Si cette adresse email existe, un email de réinitialisation a été envoyé');
                reset();
                // Pas de redirection automatique - l'utilisateur doit cliquer sur le lien dans l'email
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
                    <p className="text-xs mt-1">
                        📧 Vérifiez votre boîte email et cliquez sur le lien pour réinitialiser votre mot de passe.
                    </p>
                    <p className="text-xs mt-1 font-semibold">
                        ⏰ Le lien expire dans 1 heure.
                    </p>
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
                    Envoi en cours...
                </>
            ) : (
                <>
                    Envoyer le lien de réinitialisation
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
                Vous vous souvenez de votre mot de passe ?{' '}
                <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-amber-500 hover:text-amber-600"
                    onClick={onNavigate}
                >
                    Se connecter
                </Button>
            </p>
        </div>
    );

    const ForgotPasswordForm = () => {
        const isFormDisabled = isLoading || isSubmitting;
        
        const handleFormSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
        };
        
        return (
            <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Entrez votre adresse email"
                    autoComplete="email"
                    error={errors.email}
                    disabled={isFormDisabled}
                    register={register}
                    fieldName="email"
                    validation={{
                        required: 'Email requis',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalide'
                        }
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
                        Mot de passe oublié
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Entrez votre adresse email pour recevoir un lien de réinitialisation
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <StatusMessages 
                        error={errorMessage} 
                        success={successMessage}
                    />
                    
                    <ForgotPasswordForm />
                    
                    <BackToLoginLink onNavigate={handleBackToLogin} />
                </CardContent>
            </Card>
        </div>
    );
}

export default ForgotPasswordPage;