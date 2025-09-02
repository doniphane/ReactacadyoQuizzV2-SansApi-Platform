// Types d'authentification
export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | string;

export interface User {
  id: number;
  email: string;
  roles: UserRole[];
  prenom?: string;
  nom?: string;
  name?: string; 
  firstName?: string;
  lastName?: string;
}

// Types de base pour les quiz
export interface Quiz {
  id: number;
  title: string;
  description?: string;
  accessCode: string;
  uniqueCode?: string;
  isActive: boolean;
  isStarted: boolean;
  scorePassage?: number;
  createdAt?: string;
}

// Types pour les props des composants
export interface ActionsCardProps {
  onBackToHome: () => void;
}

export interface AnswerDetailsCardProps {
  results: CalculatedResults;
}

export interface MainResultsCardProps {
  results: CalculatedResults;
}

export interface AttemptDetailsProps {
  selectedAttempt: TransformedAttempt | null;
  attemptDetails: AttemptDetail[];
  loadingDetails: boolean;
}

export interface AttemptsListProps {
  attempts: TransformedAttempt[];
  selectedAttempt: TransformedAttempt | null;
  onAttemptSelect: (attempt: TransformedAttempt) => void;
}

export interface QuestionsListProps {
  questions: ApiQuestionData[];
  quizTitle: string;
  onQuestionUpdate?: (questionId: number, updatedQuestion: ApiQuestionData) => Promise<void>;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export interface NavigationState {
  from?: unknown;
  error?: string;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export interface AIGeneratedQuestionsProps {
  quizId: number;
  currentQuestionsCount: number;
  onAddQuestions: (questions: Array<{
    texte: string;
    numeroOrdre: number;
    questionnaire: number;
    reponses: Array<{
      texte: string;
      estCorrecte: boolean;
      numeroOrdre: number;
    }>;
  }>) => Promise<void>;
  isSubmitting: boolean;
}

export interface EditQuestionFormProps {
  question: ApiQuestionData;
  onSave: (updatedQuestion: ApiQuestionData) => Promise<void>;
  onCancel: () => void;
}

// Types pour TakeQuizPage
export interface TakeQuizLocationState {
  participantData: {
    firstName: string;
    lastName: string;
  };
  quizInfo: {
    id: number;
    title: string;
    titre?: string; 
    description?: string;
    accessCode: string;
    scorePassage?: number;
  };
}

export interface TakeQuizQuestion {
  id: number;
  text: string;
  order: number;
  answers: TakeQuizAnswer[];
  isMultipleChoice: boolean;
}

export interface TakeQuizAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface TakeQuizResults {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  totalQuestions: number;
}

// Types pour les pages
export interface LocationState {
  from?: unknown;
  error?: string;
  successMessage?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface QuizInfo {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  isStarted: boolean;
  accessCode: string;
  scorePassage?: number;
  questions?: unknown[];
}

export interface CreateQuizFormData {
  title: string;
  description: string;
}

export interface QuizDataToSend {
  title: string;
  description: string;
  estActif: boolean;
  estDemarre: boolean;
  scorePassage: number;
}

export interface QuizResponse {
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

export interface ValidationViolation {
  message: string;
}

export interface ServerErrorData {
  violations?: ValidationViolation[];
  detail?: string;
}

// Types pour la gestion des questions
export interface QuizWithQuestions {
  id: number;
  title: string;
  accessCode: string;
  questions: ApiQuestionData[];
}

export interface ApiQuestionData {
  id: number;
  texte: string;
  numeroOrdre: number;
  questionnaire: number;
  reponses: ApiAnswerData[];
}

export interface ApiAnswerData {
  id: number;
  texte: string;
  estCorrecte: boolean;
  numeroOrdre: number;
}

// Types pour les résultats de quiz
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  name?: string; 
  percentage?: number;
  score?: number;
  totalQuestions?: number;
  date?: string; 
}

export interface AnswerDetail {
  questionId: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface Metrics {
  totalStudents: number;
  averageScore: number;
  passRate: number;
  totalQuestions: number;
  attempts: number;
  bestScore?: number; 
  lowestScore?: number; 
  successRate?: number; 
}

export interface QuizResultsNavigationState {
  quizId: number;
  quizTitle: string;
  quizCode: string;
}

export interface BackendAttempt {
  id: number;
  prenomParticipant: string;
  nomParticipant: string;
  dateDebut: string;
  score?: number;
  nombreTotalQuestions?: number;
  questionnaire: string | { id: number };
}

// Types pour l'historique étudiant
export interface ApiAttempt {
  id: number;
  questionnaireTitre: string;
  questionnaireCode: string;
  date: string;
  heure: string;
  score: number;
  nombreTotalQuestions: number;
  pourcentage: number;
  estReussi: boolean;
}

export interface ApiAttemptDetail {
  questionId: string;
  questionTexte: string;
  reponseUtilisateurTexte: string;
  reponseCorrecteTexte: string;
  estCorrecte: boolean;
}

export interface ApiAttemptDetailResponse {
  reponsesDetails: ApiAttemptDetail[];
}

export interface HydraCollection<T> {
  'hydra:member'?: T[];
  member?: T[];
}

export interface TransformedAttempt {
  id: number;
  quizTitle: string;
  quizCode: string;
  date: string;
  time: string;
  score: number;
  totalQuestions: number;
  nombreTotalQuestions: number; 
  percentage: number;
  isPassed: boolean;
}

export interface AttemptDetail {
  questionId: number;
  questionText: string;
  answer: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export type AttemptWithNames = TransformedAttempt & { prenomParticipant?: string; nomParticipant?: string };

// Types pour l'administration
export interface AdminMetrics {
  quizzesCreated: number;
  totalAttempts: number;
  registeredUsers: number;
}

export type LoadingQuizId = number | null;

// Types pour l'IA
export interface AIQuestionResponse {
  question: string;
  answers: Array<{
    text: string;
    correct: boolean;
  }>;
}

// Types pour les résultats (si utilisés dans QuizResultsPage)
export interface QuizResultsLocationState {
  quizInfo: {
    id: number;
    title: string;
    accessCode: string;
    scorePassage?: number;
  };
  userAnswers: {
    [questionId: number]: number | string;
  };
  tentativeId: number;
}

export interface CustomLocation {
  state?: QuizResultsLocationState;
}

export interface CalculatedResults {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  questions: Array<{
    question: QuizQuestion;
    userAnswer: UserAnswerDetail;
  }>;
  userAnswers: Array<{
    questionId: number;
    questionText: string;
    isCorrect: boolean;
    isMultipleChoice: boolean;
    userAnswers: Array<{
      id: number;
      texte: string;
    }>;
    correctAnswers: Array<{
      id: number;
      texte: string;
    }>;
  }>;
}

export interface QuizQuestion {
  id: number;
  text: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface UserAnswerDetail {
  questionId: number;
  userAnswer: number | string;
  correctAnswer: number | string;
  isCorrect: boolean;
}

// Types pour la gestion des questions
export interface ApiQuestion {
  id?: number;
  texte: string;
  numeroOrdre: number;
  questionnaire: number;
  isMultipleChoice?: boolean;
  reponses: ApiAnswerData[];
}

export interface AddQuestionFormData {
  text: string;
  answers: {
    text: string;
    correct: boolean;
  }[];
}

// Types pour les composants
export interface ListeQuizProps {
  quizzes: Quiz[];
  loading: boolean;
  loadingQuizId: number | null;
  onToggleStatus: (quizId: number, currentStatus: boolean) => Promise<void>;
  onDeleteQuiz: (quizId: number, quizTitre: string) => Promise<void>;
}

export interface MetricsDashboardProps {
  metrics: AdminMetrics;
}

export interface QuizMetricsProps {
  quizId?: number;
  metrics: Metrics;
}

export interface StudentResultsDetailProps {
  selectedStudent: {
    id: number;
    name?: string;
    email?: string;
    percentage?: number;
    score?: number;
    totalQuestions?: number;
  } | null;
  studentAnswers: AnswerDetail[];
  onExportPDF: () => void;
}

export interface StudentsListProps {
  students: {
    id: number;
    name?: string;
    email?: string;
    date?: string;
    percentage?: number;
  }[];
  selectedStudent: {
    id: number;
    name?: string;
  } | null;
  onStudentSelect: (student: Student) => void;
}

// Types pour l'authentification
export interface UserData {
  id?: number;
  email: string;
  roles?: string[];
  firstName: string;
  lastName: string;
  password: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  violations?: { message: string }[];
  detail?: string;
}
