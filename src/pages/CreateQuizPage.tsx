import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthService from "../services/AuthService";


interface CreateQuizFormData {
  title: string;
  description: string;
}


interface QuizDataToSend {
  title: string;
  description: string;
  estActif: boolean;
  estDemarre: boolean;
  scorePassage: number;
}


interface QuizResponse {
  id: number;
  title: string;
  description: string;
  accessCode: string;
  uniqueCode: string;
  isActive: boolean;
  isStarted: boolean;
  scorePassage: number;
  createdAt: string;
}


interface ValidationViolation {
  message: string;
}

interface ServerErrorData {
  violations?: ValidationViolation[];
  detail?: string;
}

function CreateQuizPage() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError,
  } = useForm<CreateQuizFormData>({
    mode: "onChange",
    defaultValues: { title: "", description: "" },
  });

 
  const validateTitle = (title: string): string | null => {
    if (!title.trim()) {
      return "Le titre est obligatoire";
    }
    if (title.length > 100) {
      return "Le titre ne peut pas dépasser 100 caractères";
    }
    return null;
  };

  
  const validateDescription = (description: string): string | null => {
    if (description.length > 500) {
      return "La description ne peut pas dépasser 500 caractères";
    }
    return null;
  };

  
  const handleCreateQuizError = (error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
      const fetchError = error as {
        response: { status: number; data?: ServerErrorData };
      };
      const status = fetchError.response.status;
      switch (status) {
        case 401:
          return "Vous devez être connecté pour créer un quiz";
        case 403:
          return "Vous n'avez pas les permissions pour créer un quiz";
        case 422:
          if (fetchError.response.data?.violations) {
            const messages = fetchError.response.data.violations
              .map((v: ValidationViolation) => v.message)
              .join(", ");
            return messages;
          }
          return "Données invalides. Vérifiez vos informations.";
        default:
          return "Erreur lors de la création du quiz. Veuillez réessayer.";
      }
    }
    return "Erreur réseau. Vérifiez votre connexion.";
  };

  const handleBackToAdmin = (): void => {
    navigate("/admin");
  };

  const onSubmit = async (data: CreateQuizFormData): Promise<void> => {
    // Nettoyer les erreurs précédentes
    setGlobalError(null);
    clearErrors();

   
    const titleError = validateTitle(data.title);
    const descriptionError = validateDescription(data.description);

    if (titleError) {
      setError("title", { type: "manual", message: titleError });
      return;
    }

    if (descriptionError) {
      setError("description", { type: "manual", message: descriptionError });
      return;
    }

    try {

      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        setGlobalError("Vous devez être connecté pour créer un quiz");
        return;
      }

   
      const dataToSend: QuizDataToSend = {
        title: data.title.trim(),
        description: data.description.trim(),
        estActif: true,
        estDemarre: false,
        scorePassage: 70,
      };

      
      const token = AuthService.getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/questionnaires`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        
        let errorData: ServerErrorData | undefined;
        try {
          errorData = await response.json();
        } catch {
          errorData = undefined;
        }
        
        throw {
          response: {
            status: response.status,
            data: errorData,
          },
        };
      }

      const createdQuiz: QuizResponse = await response.json();

   
      toast.success("Quiz créé avec succès !");

      
      if (createdQuiz.uniqueCode) {
        setTimeout(() => {
          toast.success(`Code d'accès : ${createdQuiz.uniqueCode}`, {
            duration: 10000,
            icon: "📋",
          });
        }, 1000);
      }

      
      setTimeout(() => {
        navigate(`/manage-questions/${createdQuiz.id}`);
      }, 2000);
    } catch (error) {
      const errorMessage = handleCreateQuizError(error);
      setGlobalError(errorMessage);
    }
  };

  const Breadcrumb = ({ onBack }: { onBack: () => void }) => (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <button
        onClick={onBack}
        className="hover:text-yellow-400 transition-colors duration-200"
      >
        Dashboard
      </button>
      <span className="text-gray-600">/</span>
      <span className="text-yellow-400 font-medium">Créer un quiz</span>
    </nav>
  );

  const CreateQuizHeader = () => (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-2">
        Créer un nouveau quiz
      </h1>
      <p className="text-gray-300 text-lg">
        Créez votre quiz en quelques étapes simples
      </p>
    </div>
  );

  const ErrorMessage = ({ message }: { message: string | null }) => {
    if (!message) return null;
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p className="text-sm">{message}</p>
      </div>
    );
  };

  const FormField = ({
    label,
    id,
    type,
    placeholder,
    error,
    disabled,
    register,
    fieldName,
    validation,
    maxLength,
    isRequired = false,
  }: {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    error: { message?: string } | undefined;
    disabled: boolean;
    register: unknown;
    fieldName: string;
    validation: object;
    maxLength?: number;
    isRequired?: boolean;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`border border-black focus:ring-amber-500 focus:border-amber-500 ${
          error ? "border-red-500" : ""
        }`}
        {...(register as (name: string, options?: object) => object)(
          fieldName,
          validation
        )}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {maxLength && (
        <div className="text-sm text-gray-600">
          {maxLength} caractères maximum
        </div>
      )}
    </div>
  );

  const FormTextarea = ({
    label,
    id,
    placeholder,
    error,
    disabled,
    register,
    fieldName,
    validation,
    maxLength,
    rows = 3,
  }: {
    label: string;
    id: string;
    placeholder: string;
    error: { message?: string } | undefined;
    disabled: boolean;
    register: unknown;
    fieldName: string;
    validation: object;
    maxLength?: number;
    rows?: number;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={`border border-black focus:ring-amber-500 focus:border-amber-500 ${
          error ? "border-red-500" : ""
        }`}
        {...(register as (name: string, options?: object) => object)(
          fieldName,
          validation
        )}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      {maxLength && (
        <div className="text-sm text-gray-600">
          {maxLength} caractères maximum (optionnel)
        </div>
      )}
    </div>
  );

  const ActionButtons = ({
    isSubmitting,
    onCancel,
  }: {
    isSubmitting: boolean;
    onCancel: () => void;
  }) => (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        onClick={onCancel}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Création...
          </>
        ) : (
          "Créer le quiz"
        )}
      </Button>
    </div>
  );

  const QuizForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Champ titre */}
      <FormField
        label="Titre du quiz"
        id="title"
        type="text"
        placeholder="Ex: Quiz de culture générale"
        error={errors.title}
        disabled={isSubmitting}
        register={register}
        fieldName="title"
        validation={{
          required: "Le titre est obligatoire",
          maxLength: {
            value: 100,
            message: "Le titre ne peut pas dépasser 100 caractères",
          },
        }}
        maxLength={100}
        isRequired={true}
      />

     
      <FormTextarea
        label="Description"
        id="description"
        placeholder="Description optionnelle du quiz"
        error={errors.description}
        disabled={isSubmitting}
        register={register}
        fieldName="description"
        validation={{
          maxLength: {
            value: 500,
            message: "La description ne peut pas dépasser 500 caractères",
          },
        }}
        maxLength={500}
      />

   
      <ActionButtons isSubmitting={isSubmitting} onCancel={handleBackToAdmin} />
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Breadcrumb onBack={handleBackToAdmin} />
      <CreateQuizHeader />
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-100 text-gray-900">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Créer un nouveau quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorMessage message={globalError} />
            <QuizForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateQuizPage;