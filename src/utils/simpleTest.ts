

const API_KEY = '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';

export async function simpleOpenRouterTest(): Promise<void> {
    console.log('=== Test Simple OpenRouter ===');
    
    try {
        // Test selon la documentation officielle
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    {
                        role: 'user',
                        content: 'Hello'
                    }
                ]
            })
        });
        
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Réponse:', data);
        } else {
            const errorText = await response.text();
            console.error('Erreur:', errorText);
        }
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Test avec curl équivalent
export async function curlEquivalentTest(): Promise<void> {
    console.log('=== Test équivalent curl ===');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    {
                        role: 'user',
                        content: 'What is the meaning of life?'
                    }
                ]
            })
        });
        
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Réponse:', data);
        } else {
            const errorText = await response.text();
            console.error('Erreur:', errorText);
        }
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Test de vérification de la clé API
export async function checkAPIKey(): Promise<void> {
    console.log('=== Vérification de la clé API ===');
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Info clé API:', data);
        } else {
            const errorText = await response.text();
            console.error('Erreur clé API:', errorText);
        }
        
    } catch (error) {
        console.error('Erreur:', error);
    }
} 