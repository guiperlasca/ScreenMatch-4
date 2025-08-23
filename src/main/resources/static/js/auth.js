// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loginModal = null;
        this.signupModal = null;
        this.init();
    }

    init() {
        this.setupModals();
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupModals() {
        this.loginModal = document.getElementById('loginModal');
        this.signupModal = document.getElementById('signupModal');
        
        // Setup modal controls
        this.setupModalControls();
    }

    setupModalControls() {
        // Login modal controls
        const loginBtn = document.getElementById('loginBtn');
        const closeLoginModal = document.getElementById('closeLoginModal');
        const switchToSignup = document.getElementById('switchToSignup');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => this.hideLoginModal());
        }

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideLoginModal();
                this.showSignupModal();
            });
        }

        // Signup modal controls
        const signupBtn = document.getElementById('signupBtn');
        const closeSignupModal = document.getElementById('closeSignupModal');
        const switchToLogin = document.getElementById('switchToLogin');

        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.showSignupModal());
        }

        if (closeSignupModal) {
            closeSignupModal.addEventListener('click', () => this.hideSignupModal());
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideSignupModal();
                this.showLoginModal();
            });
        }

        // Close modals when clicking outside
        [this.loginModal, this.signupModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modal);
                    }
                });
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLoginModal();
                this.hideSignupModal();
            }
        });
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Get started button
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                if (this.isAuthenticated()) {
                    // Scroll to featured section or go to profile
                    document.getElementById('featuredSection')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    this.showSignupModal();
                }
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Validate form
        if (!this.validateLoginForm(credentials)) {
            return;
        }

        try {
            // Show loading state
            this.setButtonLoading(submitBtn, true);
            
            // Call API
            await apiService.login(credentials);
            
            // Success
            this.hideLoginModal();
            this.showNotification('Login realizado com sucesso!', 'success');
            this.updateAuthUI();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification(error.message || 'Erro ao fazer login', 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate form
        if (!this.validateSignupForm(userData)) {
            return;
        }

        try {
            // Show loading state
            this.setButtonLoading(submitBtn, true);
            
            // Call API
            await apiService.register(userData);
            
            // Success - now login automatically
            await apiService.login({
                email: userData.email,
                password: userData.password
            });
            
            this.hideSignupModal();
            this.showNotification('Conta criada com sucesso!', 'success');
            this.updateAuthUI();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = error.message || 'Erro ao criar conta';
            
            // Mensagens específicas para diferentes tipos de erro
            if (errorMessage.includes('Email já está em uso')) {
                errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
            } else if (errorMessage.includes('Credenciais inválidas')) {
                errorMessage = 'Erro no login automático. Por favor, faça login manualmente.';
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    handleLogout() {
        try {
            apiService.logout();
            this.showNotification('Logout realizado com sucesso!', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Erro ao fazer logout', 'error');
        }
    }

    validateLoginForm(credentials) {
        const errors = [];
        
        if (!credentials.email) {
            errors.push('Email é obrigatório');
        } else if (!this.isValidEmail(credentials.email)) {
            errors.push('Email inválido');
        }
        
        if (!credentials.password) {
            errors.push('Senha é obrigatória');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }

    validateSignupForm(userData) {
        const errors = [];
        
        if (!userData.name?.trim()) {
            errors.push('Nome é obrigatório');
        }
        
        if (!userData.email) {
            errors.push('Email é obrigatório');
        } else if (!this.isValidEmail(userData.email)) {
            errors.push('Email inválido');
        }
        
        if (!userData.password) {
            errors.push('Senha é obrigatória');
        } else if (userData.password.length < 6) {
            errors.push('Senha deve ter pelo menos 6 caracteres');
        }
        
        if (userData.password !== userData.confirmPassword) {
            errors.push('Senhas não coincidem');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                this.currentUser = JSON.parse(user);
                this.updateAuthUI();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.handleLogout();
            }
        }
    }

    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userAvatar = document.getElementById('userAvatar');
        const isAuth = this.isAuthenticated();
        
        if (isAuth) {
            // Hide auth buttons
            if (authButtons) {
                authButtons.classList.add('hidden');
            }
            
            // Show user menu
            if (userMenu) {
                userMenu.classList.remove('hidden');
            }
            
            // Update user avatar and info
            this.updateUserInfo();
            
        } else {
            // Show auth buttons
            if (authButtons) {
                authButtons.classList.remove('hidden');
            }
            
            // Hide user menu
            if (userMenu) {
                userMenu.classList.add('hidden');
            }
        }
    }

    updateUserInfo() {
        const user = apiService.getCurrentUser();
        if (!user) return;

        // Update avatar in header
        const userAvatar = document.querySelector('#userMenu .user-avatar img');
        if (userAvatar && user.avatar) {
            userAvatar.src = user.avatar;
        }

        // Update profile modal if open
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');

        if (profileName) profileName.textContent = user.name || user.email;
        if (profileEmail) profileEmail.textContent = user.email;
        if (profileAvatar && user.avatar) {
            profileAvatar.src = user.avatar;
        }
    }

    isAuthenticated() {
        return apiService.isAuthenticated();
    }

    // Modal control methods
    showLoginModal() {
        if (this.loginModal) {
            this.loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = this.loginModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    hideLoginModal() {
        if (this.loginModal) {
            this.hideModal(this.loginModal);
        }
    }

    showSignupModal() {
        if (this.signupModal) {
            this.signupModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            setTimeout(() => {
                const firstInput = this.signupModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    hideSignupModal() {
        if (this.signupModal) {
            this.hideModal(this.signupModal);
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setButtonLoading(button, loading) {
        if (!button) return;
        
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    type === 'warning' ? 'fas fa-exclamation-triangle' : 
                    'fas fa-info-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 5 seconds
        const autoHideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);

        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoHideTimeout);
                this.hideNotification(notification);
            });
        }
    }

    hideNotification(notification) {
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});