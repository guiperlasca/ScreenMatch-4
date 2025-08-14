import { api } from './api.js';

document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const login = form.login.value;
    const senha = form.senha.value;
    const button = form.querySelector('button');

    button.disabled = true;
    button.textContent = 'Registrando...';

    try {
        await api.post('/usuarios', { login, senha });
        alert('Registro realizado com sucesso! Você será redirecionado para a página de login.');
        window.location.href = '/login.html';
    } catch (error) {
        alert('Falha no registro. Tente outro nome de usuário.');
        button.disabled = false;
        button.textContent = 'Registrar';
    }
});
