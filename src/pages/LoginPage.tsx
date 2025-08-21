import { useNavigate, useLocation } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationState {
    from?: Location;
    error?: string;
    successMessage?: string;
}


interface LoginFormData {
    email: string;
    password: string;
}

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError, user } = useAuth();
   
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        clearErrors,
        setError
    } = useForm<LoginFormData>({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: '' }
    });

    const successMessage = location.state && 
        (location.state as LocationState & { successMessage?: string }).successMessage;
    
   
    const getDestinationPage = (isAdmin: boolean, isStudent: boolean): string => {
        if (isAdmin) return '/admin';
        if (isStudent) return '/student';
        return '/student'; 
    };

    
    const handleLoginError = (
        error: unknown, 
        setError: (field: 'email' | 'password', options: { type: string; message: string }) => void, 
        clearError: () => void,
        clearErrors: (fields?: ('email' | 'password')[]) => void
    ): void => {
        clearError();
        clearErrors(['email', 'password']);
        
       
        if (error && typeof error === 'object' && 'status' in error) {
            const fetchError = error as { status: number; message?: string };
            const status = fetchError.status;
            let message = '';
            
            switch (status) {
                case 401:
                    message = 'Identifiants incorrects. Veuillez réessayer.';
                    break;
                case 500:
                    message = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
                    break;
                default:
                    message = `Erreur inattendue : ${status}. `;
            }
            
            setError('email', { type: 'manual', message });
        } 
        
        else if (error && typeof error === 'object' && 'response' in error) {
            const errorResponse = error as { response: { status: number } };
            const status = errorResponse.response.status;
            let message = '';
            
            switch (status) {
                case 401:
                    message = 'Identifiants incorrects. Veuillez réessayer.';
                    break;
                case 500:
                    message = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
                    break;
                default:
                    message = `Erreur inattendue : ${status}. `;
            }
            
            setError('email', { type: 'manual', message });
        } 
     
        else {
            const errorMessage = error && typeof error === 'object' && 'message' in error 
                ? (error as { message: string }).message
                : 'Erreur réseau. Veuillez vérifier votre connexion.';
            setError('email', { type: 'manual', message: errorMessage });
        }
    };

   
    const getRedirectPath = (location: Location, isAdmin: boolean, isStudent: boolean): string => {
        const fromLocation = location.state?.from;
        
        if (!fromLocation) {
            return getDestinationPage(isAdmin, isStudent);
        }
        
        const targetPath = typeof fromLocation === 'string' 
            ? fromLocation 
            : fromLocation.pathname + fromLocation.search;
        
        if (targetPath.startsWith('/admin') && !isAdmin) {
            return getDestinationPage(isAdmin, isStudent);
        }
        
        if (targetPath.startsWith('/student') && !isStudent && !isAdmin) {
            return getDestinationPage(isAdmin, isStudent);
        }
        
        return targetPath;
    };

    const clearSuccessMessage = (): void => {
        navigate(location.pathname, { replace: true, state: {} });
    };

    const handleNavigateToRegister = (): void => {
        navigate('/register');
    };
  
    const onSubmit = async (data: LoginFormData): Promise<void> => {
        // Empêcher les soumissions multiples
        if (isLoading || isSubmitting) {
            return;
        }
        
        clearError();
        clearErrors();
        
        try {
            const success = await login(data.email, data.password);
            if (success) {
                setTimeout(() => {
                    const currentUser = user;
                    
                    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
                        const userIsAdmin = currentUser.roles.includes('ROLE_ADMIN');
                        const userIsStudent = currentUser.roles.includes('ROLE_USER');
                        
                        const redirectPath = getRedirectPath(location, userIsAdmin, userIsStudent);
                        navigate(redirectPath, { replace: true });
                    } else {
                        navigate('/student', { replace: true });
                    }
                }, 100);
            }
        } catch (err) {
            handleLoginError(err, setError, clearError, clearErrors);
        }
    };
   
    const LoginHeader = () => (
        <div className="hidden xl:flex w-1/2 items-center justify-end pr-16">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">
                    <span className="text-white">Acadyo</span>
                    <span className="text-amber-500"> Quiz</span>
                </h1>
                <p className="text-white text-xl">Plateforme de quiz</p>
            </div>
        </div>
    );

    const StatusMessages = ({ 
        error, 
        successMessage, 
        onClearSuccess 
    }: { 
        error: string | null; 
        successMessage?: string; 
        onClearSuccess?: () => void;
    }) => (
        <>
          
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="text-sm">{error}</p>
                </div>
            )}
           
            {successMessage && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg relative">
                    <p className="text-sm font-medium pr-8">{successMessage}</p>
                    {onClearSuccess && (
                        <button
                            onClick={onClearSuccess}
                            className="absolute top-2 right-2 text-green-600 hover:text-green-800"
                            type="button"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    )}
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
                onKeyDown={(e) => {
                    // Empêcher la soumission sur Entrée dans les champs de texte
                    if (e.key === 'Enter' && type !== 'submit') {
                        e.preventDefault();
                    }
                }}
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

    const LoginButton = ({ isDisabled }: { isDisabled: boolean }) => (
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
                    Connexion en cours...
                </>
            ) : (
                <>
                    Se Connecter
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </>
            )}
        </Button>
    );

    const RegisterLink = ({ onNavigate }: { onNavigate: () => void }) => (
        <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
                Pas de compte ?{' '}
                <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-amber-500 hover:text-amber-600"
                    onClick={onNavigate}
                >
                    S'inscrire
                </Button>
            </p>
        </div>
    );

    const LoginForm = () => {
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
                    placeholder="Entrez votre email"
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

               
                <FormField
                    label="Mot de passe"
                    id="password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    autoComplete="current-password"
                    error={errors.password}
                    disabled={isFormDisabled}
                    register={register}
                    fieldName="password"
                    validation={{
                        required: 'Mot de passe requis',
                        minLength: {
                            value: 6,
                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                        }
                    }}
                />

                
                <LoginButton isDisabled={isFormDisabled} />
            </form>
        );
    };
    
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#18191D' }}>
            <LoginHeader />
            
            
            <div className="w-full xl:w-1/2 flex items-center justify-center p-6 xl:justify-start xl:pl-16">
                <Card className="w-full max-w-md border-2 border-amber-500 shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Connexion
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Accédez à votre espace
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <StatusMessages 
                            error={error} 
                            successMessage={successMessage} 
                            onClearSuccess={clearSuccessMessage}
                        />
                        
                        <LoginForm />
                        
                        <RegisterLink onNavigate={handleNavigateToRegister} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default LoginPage;