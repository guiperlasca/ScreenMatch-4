// Configuração da API
const API_BASE_URL = 'http://localhost:8080';

// Elementos DOM
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupAuthEventListeners();
});

function setupAuthEventListeners() {
    // Botões para abrir modais
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal);
    }
    
    // Botões para fechar modais
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Formulários
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Links para alternar entre modais
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideLoginModal();
            showRegisterModal();
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideRegisterModal();
            showLoginModal();
        });
    }
}

// Funções para mostrar/esconder modais
function showLoginModal() {
    hideAllModals();
    loginModal.classList.remove('hidden');
    loginModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    loginModal.classList.remove('show');
    loginModal.classList.add('hidden');
}

function showRegisterModal() {
    hideAllModals();
    registerModal.classList.remove('hidden');
    registerModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideRegisterModal() {
    registerModal.classList.remove('show');
    registerModal.classList.add('hidden');
}

function closeAllModals() {
    hideAllModals();
    document.body.style.overflow = 'auto';
}

function hideAllModals() {
    hideLoginModal();
    hideRegisterModal();
}

// Função para fazer login
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const loginData = {
        login: formData.get('login'),
        senha: formData.get('senha')
    };
    
    try {
        // Mostrar loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>Entrando...';
        
        // Fazer requisição para a API
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }
        
        const data = await response.json();
        
        // Salvar token e dados do usuário
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify({ login: loginData.login }));
        
        // Fechar modal e atualizar UI
        closeAllModals();
        showSuccessMessage('Login realizado com sucesso!');
        
        // Recarregar página para atualizar estado
        setTimeout(() => {
            location.reload();
        }, 1500);
        
    } catch (error) {
        console.error('Erro no login:', error);
        showErrorMessage(loginForm, 'Erro no login. Verifique suas credenciais.');
    } finally {
        // Restaurar botão
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
    }
}

// Função para fazer registro
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(registerForm);
    const registerData = {
        login: formData.get('login'),
        senha: formData.get('senha')
    };
    
    try {
        // Mostrar loading
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>Cadastrando...';
        
        // Fazer requisição para a API
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }
        
        // Fechar modal e mostrar sucesso
        closeAllModals();
        showSuccessMessage('Usuário cadastrado com sucesso! Faça login para continuar.');
        
        // Limpar formulário
        registerForm.reset();
        
    } catch (error) {
        console.error('Erro no registro:', error);
        showErrorMessage(registerForm, 'Erro ao cadastrar usuário. Tente novamente.');
    } finally {
        // Restaurar botão
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Cadastrar';
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Recarregar página
    location.reload();
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

// Função para obter o token de autenticação
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Função para obter dados do usuário
function getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

// Funções para mostrar mensagens
function showErrorMessage(form, message) {
    // Remover mensagens de erro existentes
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Criar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Inserir no início do formulário
    form.insertBefore(errorDiv, form.firstChild);
}

function showSuccessMessage(message) {
    // Criar elemento de mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(successDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// Função para fazer requisições autenticadas
async function authenticatedRequest(url, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    
    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const response = await fetch(`${API_BASE_URL}${url}`, finalOptions);
    
    if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        location.reload();
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    
    return response;
}

// Função para obter favoritos do usuário
async function getUserFavorites() {
    try {
        const response = await authenticatedRequest('/usuarios/meus-favoritos');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar favoritos');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        throw error;
    }
}

// Função para obter reviews do usuário
async function getUserReviews() {
    try {
        const response = await authenticatedRequest('/usuarios/meus-reviews');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar reviews');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar reviews:', error);
        throw error;
    }
}

// Função para adicionar série aos favoritos
async function addToFavorites(serieId) {
    try {
        const response = await authenticatedRequest('/usuarios/favoritos', {
            method: 'POST',
            body: JSON.stringify({ serieId })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao adicionar aos favoritos');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar aos favoritos:', error);
        throw error;
    }
}

// Função para remover série dos favoritos
async function removeFromFavorites(serieId) {
    try {
        const response = await authenticatedRequest(`/usuarios/favoritos/${serieId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao remover dos favoritos');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro ao remover dos favoritos:', error);
        throw error;
    }
}

// Exportar funções para uso global
window.auth = {
    showLoginModal,
    showRegisterModal,
    closeAllModals,
    login: handleLogin,
    register: handleRegister,
    logout,
    isUserLoggedIn,
    getAuthToken,
    getCurrentUser,
    authenticatedRequest,
    getUserFavorites,
    getUserReviews,
    addToFavorites,
    removeFromFavorites
};

// Função global para mostrar modal de login (usada pelo app.js)
window.showLoginModal = showLoginModal;
