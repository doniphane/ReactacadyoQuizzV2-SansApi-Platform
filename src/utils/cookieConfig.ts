
export const COOKIE_OPTIONS = {
    secure: import.meta.env.PROD, 
    sameSite: 'lax' as const,  
    expires: 7,        
};


export const COOKIE_REMOVE_OPTIONS = {
    path: '/'
};


export const COOKIE_NAMES = {
    JWT_TOKEN: 'jwt_token',
    AUTH_USER: 'auth-user'
} as const; 