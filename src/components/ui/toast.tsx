// Composant Toast simple pour afficher des notifications
// Ce composant affiche des messages temporaires à l'utilisateur
import { useEffect, useState } from 'react';

// Interface pour les props du toast
interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
    duration?: number; // Durée en millisecondes
}

function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
    const [isShowing, setIsShowing] = useState(false);

    // Gestion de l'affichage du toast
    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);
            
            // Fermer automatiquement après la durée spécifiée
            const timer = setTimeout(() => {
                setIsShowing(false);
                setTimeout(onClose, 300); // Attendre l'animation de fermeture
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    // Styles selon le type de toast
    const getToastStyles = () => {
        const baseStyles = "fixed top-4 left-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform";
        
        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white ${isShowing ? 'translate-x-0' : '-translate-x-full'}`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white ${isShowing ? 'translate-x-0' : '-translate-x-full'}`;
            case 'info':
                return `${baseStyles} bg-blue-500 text-white ${isShowing ? 'translate-x-0' : '-translate-x-full'}`;
            default:
                return `${baseStyles} bg-gray-500 text-white ${isShowing ? 'translate-x-0' : '-translate-x-full'}`;
        }
    };

    // Icône selon le type
    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'info':
                return 'ℹ️';
            default:
                return '💬';
        }
    };

    if (!isVisible) return null;

    return (
        <div className={getToastStyles()}>
            <div className="flex items-center space-x-2">
                <span className="text-lg">{getIcon()}</span>
                <span className="font-medium">{message}</span>
                <button 
                    onClick={() => {
                        setIsShowing(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-2 text-white hover:text-gray-200"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default Toast; 