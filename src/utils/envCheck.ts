

export function checkEnvironmentVariables(): void {
    console.log('=== Vérification des variables d\'environnement ===');
    
   
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    console.log('VITE_OPENROUTER_API_KEY:', apiKey ? 'Présente' : 'Manquante');
    console.log('VITE_OPENROUTER_API_KEY length:', apiKey?.length || 0);
    console.log('VITE_API_BASE_URL:', apiBaseUrl || 'Non définie');
    
    // Afficher toutes les variables d'environnement VITE_*
    const viteEnvVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
    console.log('Variables VITE_ disponibles:', viteEnvVars);
    
    // Vérifier si la clé API semble valide
    if (apiKey) {
        const isValidFormat = apiKey.startsWith('sk-or-v1-') && apiKey.length > 50;
        console.log('Format de la clé API valide:', isValidFormat);
    }
    
    console.log('=== Fin de la vérification ===');
}

// Exporter une fonction pour tester la connexion OpenRouter
export async function testOpenRouterConnection(): Promise<boolean> {
    try {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        
        if (!apiKey) {
            console.error('Clé API OpenRouter manquante');
            return false;
        }
        
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Test de connexion OpenRouter:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Modèles disponibles:', data.data?.length || 0);
            return true;
        } else {
            console.error('Erreur de connexion OpenRouter:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors du test de connexion:', error);
        return false;
    }
} 