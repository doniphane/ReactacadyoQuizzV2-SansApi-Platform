export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_SUPER_ADMIN' | string;

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

// Types de base pour les questions
export interface Question {
  id: number;
  text: string;
  quizId: number;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer?: string;
}

// Types de base pour les réponses
export interface Answer {
  id: number;
  text: string;
  questionId: number;
  isCorrect: boolean;
}

// Types de base pour les tentatives
export interface Attempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  maxScore: number;
  completedAt: string;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: number;
  answerId?: number;
  textAnswer?: string;
  isCorrect: boolean;
}

// ActionsCard
export interface ActionsCardProps {
  onBackToHome: () => void;
}

// AnswerDetailsCard
export interface AnswerDetailsCardProps {
  results: CalculatedResults;
}

// MainResultsCard
export interface MainResultsCardProps {
  results: CalculatedResults;
}

// MetricsDashboard
export interface MetricsDashboardProps {
  metrics: AdminMetrics;
}

// AttemptDetails
export interface AttemptDetailsProps {
  selectedAttempt: TransformedAttempt | null;
  attemptDetails: AttemptDetail[];
  loadingDetails: boolean;
}

// AttemptsList
export interface AttemptsListProps {
  attempts: TransformedAttempt[];
  selectedAttempt: TransformedAttempt | null;
  onAttemptSelect: (attempt: TransformedAttempt) => void;
}

// QuestionsList
export interface QuestionsListProps {
  questions: ApiQuestionData[];
  quizTitle: string;
  onQuestionUpdate?: (questionId: number, updatedQuestion: ApiQuestionData) => Promise<void>;
}

// ProtectedRoute
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export interface NavigationState {
  from?: unknown;
  error?: string;
}

// StudentResultsDetail
export interface StudentResultsDetailProps {
  selectedStudent: Student | null;
  studentAnswers: AnswerDetail[];
  onExportPDF: () => void;
}

// StudentsList
export interface StudentsListProps {
  students: Student[];
  selectedStudent: Student | null;
  onStudentSelect: (student: Student) => void;
}

// AIGeneratedQuestions
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

// EditQuestionForm
export interface EditQuestionFormProps {
  question: ApiQuestionData;
  onSave: (updatedQuestion: ApiQuestionData) => Promise<void>;
  onCancel: () => void;
}

// SearchBar
export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

// QuizMetrics
export interface QuizMetricsProps {
  metrics: Metrics;
}

// ListeQuiz
export interface ListeQuizProps {
  quizzes: Quiz[];
  loading: boolean;
  loadingQuizId: LoadingQuizId;
  onToggleStatus: (quizId: number, currentStatus: boolean) => Promise<void>;
  onDeleteQuiz: (quizId: number, quizTitle: string) => Promise<void>;
}

// LoginPage
export interface LocationState {
  from?: unknown;
  error?: string;
  successMessage?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// TakeQuizPage
export interface LocationState {
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

export interface Question {
  id: number;
  text: string;
  order: number;
  answers: Answer[];
  isMultipleChoice: boolean;
}

export interface UserAnswers {
  [questionId: number]: number | string | number[];
}

export interface QuizResults {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  totalQuestions: number;
}

export interface ApiQuestion {
  id: number;
  texte: string;
  numeroOrdre: number;
  isMultipleChoice: boolean;
  reponses: Array<{
    id: number;
    texte: string;
    numeroOrdre: number;
  }>;
}

// ManageQuestionsPage
export interface QuizWithQuestions {
  id: number;
  title: string;
  accessCode: string;
  questions: ApiQuestionData[];
}

export interface ApiQuestionCreate {
  texte: string;
  numeroOrdre: number;
  questionnaire: number;
  reponses: Array<{
    texte: string;
    estCorrecte: boolean;
    numeroOrdre: number;
  }>;
}

// StudentPage
export interface StudentFormData {
  firstName: string;
  lastName: string;
  quizCode: string;
}

export interface QuizInfo {
  id: number;
  title: string;
  description?: string;
  isActive: boolean;
  isStarted: boolean;
  accessCode: string;
  scorePassage?: number;
}

// QuizResultsPage
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

export interface QuizAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  text: string;
  answers: QuizAnswer[];
}

export interface UserAnswerDetail {
  questionId: number;
  userAnswer: number | string;
  correctAnswer: number | string;
  isCorrect: boolean;
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

// QuizResultsDetailPage
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
  bestScore?: number; 
  lowestScore?: number; 
  successRate?: number; 
}

export interface QuizResultsNavigationState {
  quizId: number;
  quizTitle: string;
  quizCode: string;
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  answers: QuizAnswer[];
}

export interface UserAnswer {
  questionId: number;
  answerId?: number;
  textAnswer?: string;
  isCorrect: boolean;
}

export interface HydraApiResponse {
  member?: unknown[];
  'hydra:member'?: unknown[];
}

// StudentHistoryPage
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
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// RegisterPage
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// CreateQuizPage
export interface CreateQuizFormData {
  title: string;
  description: string;
}

export interface QuizDataToSend {
  title: string;
  description: string;
  scorePassage: number;
}



// AIService
export interface AIQuestionResponse {
  question: string;
  answers: Array<{
    text: string;
    correct: boolean;
  }>;
}

export interface AIGeneratedQuestions {
  questions: AIQuestionResponse[];
  message?: string;
  error?: string;
}

export interface AvailabilityResponse {
  isAvailable: boolean;
  message?: string;
  error?: string;
}

// AuthService
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginErrorResponse {
  message?: string;
  error?: string;
}

export interface LoginSuccessResponse {
  message?: string;
  user?: {
    email: string;
    roles: string[];
  };
}

export interface UserInfo {
  id: number;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}



export interface Auth {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isStudent: () => boolean;
}



// Types pour l'administration
export interface AdminMetrics {
  quizzesCreated: number;
  totalAttempts: number;
  registeredUsers: number;
}

export type LoadingQuizId = number | null;

// Types pour la création de quiz
export interface QuizFormData {
  title: string;
  description: string;
  scorePassage: number;
}

export interface QuizCreateRequest {
  titre: string;
  description: string;
  estActif: boolean;
  estDemarre: boolean;
  scorePassage: number;
}

export interface QuizCreateResponse {
  id: number;
  titre: string;
  description: string;
  uniqueCode: string;
  estActif: boolean;
  estDemarre: boolean;
  scorePassage: number;
  createdAt?: string;
}

export interface QuizCreateError {
  message?: string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
  detail?: string;
}

// Types pour les résultats
export interface QuizResultsParams {
  quizId: number;
  quizTitle: string;
  quizCode: string;
}

export interface StudentResult {
  userId: number;
  userName: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

// Types pour la gestion des questions
export interface QuestionFormData {
  text: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  options?: string[];
  correctAnswer?: string;
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
  numeroOrdre: number;
  question?: number; 
  estCorrecte: boolean;
}

// Types pour l'historique étudiant
export interface StudentHistory {
  quizId: number;
  quizTitle: string;
  score: number;
  maxScore: number;
  completedAt: string;
  isPassed: boolean;
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
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// Types pour l'inscription
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegistrationSuccessResponse {
  message: string;
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}

export interface ApiErrorResponse {
  message?: string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
  detail?: string;
}

// Types pour les réponses d'API
export type ApiResponse<T> = T;
export type QuizApiResponse = Quiz[];
export type UserApiResponse = User[];
export type AttemptApiResponse = Attempt[];

// Types pour les erreurs
export interface ApiError {
  message?: string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
  detail?: string;
}

// Types pour les actions
export type QuizAction = 'toggle' | 'delete' | 'edit' | 'view';
export type FormMode = 'create' | 'edit' | 'view'; 