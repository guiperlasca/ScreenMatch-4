document.getElementById('login-form').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const login = evento.target.login.value;
    const senha = evento.target.senha.value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, senha })
        });

        if (!response.ok) {
            throw new Error('Falha ao fazer login');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);

        alert('Login realizado com sucesso! Você será redirecionado para a página inicial.');
        window.location.href = '/';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Usuário ou senha inválidos.');
    }
});
