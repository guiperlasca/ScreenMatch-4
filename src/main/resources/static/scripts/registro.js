document.getElementById('registro-form').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const login = evento.target.login.value;
    const senha = evento.target.senha.value;

    try {
        const response = await fetch('/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, senha })
        });

        if (!response.ok) {
            throw new Error('Falha ao registrar usuário');
        }

        alert('Usuário registrado com sucesso! Você será redirecionado para a página de login.');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('Ocorreu um erro ao tentar registrar. Por favor, tente novamente.');
    }
});
