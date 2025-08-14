import { api } from './api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const login = form.login.value;
    const senha = form.senha.value;
    const button = form.querySelector('button');

    button.disabled = true;
    button.textContent = 'Entrando...';

    try {
        const data = await api.post('/login', { login, senha });
        localStorage.setItem('token', data.token);
        window.location.href = '/';
    } catch (error) {
        alert('Falha no login. Verifique seu usuário e senha.');
        button.disabled = false;
        button.textContent = 'Entrar';
    }
});
