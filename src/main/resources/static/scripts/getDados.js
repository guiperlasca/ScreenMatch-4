import { getAuthHeader } from './auth.js';

// URL base da API
const baseURL = 'http://localhost:8080';

export default function getDados(endpoint) {
    return fetch(`${baseURL}${endpoint}`, {
        headers: getAuthHeader()
    })
    .then(response => {
        if (response.status === 403) {
            // Se for não autorizado, pode ser token expirado
            return Promise.reject(new Error('Acesso não autorizado.'));
        }
        if (!response.ok) {
            return Promise.reject(new Error('Erro na requisição.'));
        }
        return response.json();
    })
    .catch(error => {
        console.error(`Erro ao acessar o endpoint ${endpoint}:`, error);
        throw error;
    });
}
