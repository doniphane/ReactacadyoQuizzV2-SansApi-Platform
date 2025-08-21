import axios from 'axios';
import { Cookies } from 'react-cookie';
import { COOKIE_OPTIONS, COOKIE_REMOVE_OPTIONS, COOKIE_NAMES } from '../utils/cookieConfig';

// Types pour les réponses d'authentification
interface LoginCredentials {
    username: string;
    password: string;
}

// Interface pour les erreurs de connexion
interface LoginErrorResponse {
    message?: string;
    error?: string;
    code?: number;
}

// Interface pour la réponse de connexion réussie
interface LoginSuccessResponse {
    message?: string;
    user?: {
        email: string;
        roles: string[];
    };
    token?: string;
}

// Interface pour les informations utilisateur
export interface UserInfo {
    id: number;
    email: string;
    roles: string[];
    firstName?: string;
    lastName?: string;
}

// Type utilisateur pour le frontend (alias pour UserInfo)
export type User = UserInfo;

class AuthService {
    private jwtToken: string | null = null;
    private cookies: Cookies = new Cookies();

    constructor() {
       
        axios.defaults.withCredentials = false;
        
   
        this.jwtToken = this.cookies.get(COOKIE_NAMES.JWT_TOKEN) || null;
        
        
        this.setupAxiosInterceptors();
    }

    private setupAxiosInterceptors(): void {
   
        axios.interceptors.request.use(
            (config) => {
                if (this.jwtToken) {
                    config.headers.Authorization = `Bearer ${this.jwtToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                   
                    this.logout();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public async login(email: string, password: string): Promise<{ success: boolean; message: string; token?: string }> {
        try {
            const credentials: LoginCredentials = {
                username: email,
                password: password
            };

            const response = await axios.post<LoginSuccessResponse>(`${import.meta.env.VITE_API_BASE_URL}/api/login_check`, credentials);
            
            if (response.status === 200 && response.data.token) {
                this.jwtToken = response.data.token;
              
                this.cookies.set(
                    COOKIE_NAMES.JWT_TOKEN,
                    response.data.token,
                    {
                        sameSite: COOKIE_OPTIONS.sameSite,
                        secure: COOKIE_OPTIONS.secure,
                        maxAge: typeof COOKIE_OPTIONS.expires === 'number'
                            ? COOKIE_OPTIONS.expires * 24 * 60 * 60
                            : undefined
                    }
                );
                return { success: true, message: 'Connexion réussie', token: response.data.token };
            }
            
            return { success: false, message: 'Erreur lors de la connexion' };
        } catch (error) {
            const axiosError = error as { response?: { data?: LoginErrorResponse; status?: number } };
            const message = axiosError.response?.data?.message || 'Erreur de connexion';
            return { success: false, message };
        }
    }

    public async logout(): Promise<void> {
        try {
           
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logout`);
        } catch {
            // Ignore logout errors
        } finally {
         
            this.jwtToken = null;
            this.cookies.remove(COOKIE_NAMES.JWT_TOKEN, COOKIE_REMOVE_OPTIONS);
        }
    }

    public async getCurrentUser(): Promise<User | null> {
        try {
            if (!this.jwtToken) {
                return null;
            }

           
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`);
            
            if (response.data) {
               
                const userData = response.data;
                const user = {
                    id: userData.id,
                    email: userData.email,
                    roles: userData.roles || [],
                    firstName: userData.firstName,
                    lastName: userData.lastName
                };
                return user;
            }
            
            return null;
        } catch (error) {
          
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                this.jwtToken = null;
                this.cookies.remove(COOKIE_NAMES.JWT_TOKEN, COOKIE_REMOVE_OPTIONS);
            }
            return null;
        }
    }

    public async isAuthenticated(): Promise<boolean> {
        try {
            
            const user = await this.getCurrentUser();
            return user !== null;
        } catch {
            return false;
        }
    }

    public async hasRole(role: string): Promise<boolean> {
        try {
            const user = await this.getCurrentUser();
            return user?.roles?.includes(role) || false;
        } catch {
            return false;
        }
    }

    public async isAdmin(): Promise<boolean> {
        return await this.hasRole('ROLE_ADMIN');
    }

    public async isStudent(): Promise<boolean> {
        return await this.hasRole('ROLE_USER');
    }

   
    public getToken(): string | null {
        return this.jwtToken;
    }
}

export default new AuthService();