import { getAuthHeader } from './auth.js';

async function patchDados(url) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        };

        const response = await fetch(url, {
            method: 'PATCH',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        throw error;
    }
}

export default patchDados;
