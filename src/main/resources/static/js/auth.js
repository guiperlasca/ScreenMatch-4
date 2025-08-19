document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    const closeButtons = document.querySelectorAll('.close');

    // Function to open a modal
    function openModal(modal) {
        modal.style.display = 'block';
    }

    // Function to close a modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Event listeners for header buttons
    if(loginBtn) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }
    if(registerBtn) {
        registerBtn.addEventListener('click', () => openModal(registerModal));
    }

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(registerModal);
        });
    });

    // Event listeners for switching between modals
    if(showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }

    if(showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // Close modals if user clicks outside of them
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    const API_BASE_URL = 'http://localhost:8080';
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const result = await response.json();
                localStorage.setItem('authToken', result.token);
                updateUIAfterLogin();
                closeModal(loginModal);
            } catch (error) {
                console.error('Error during login:', error);
                alert('Login failed. Please check your credentials.');
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/usuarios/cadastro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Registration failed');
                }

                alert('Registration successful! Please log in.');
                closeModal(registerModal);
                openModal(loginModal);
            } catch (error) {
                console.error('Error during registration:', error);
                alert(`Registration failed: ${error.message}`);
            }
        });
    }

    function updateUIAfterLogin() {
        const token = localStorage.getItem('authToken');
        if (token) {
            // In a real app, you would decode the token to get user info
            // For now, we'll just change the buttons
            if(loginBtn) loginBtn.style.display = 'none';
            if(registerBtn) {
                registerBtn.textContent = 'Sair';
                registerBtn.removeEventListener('click', () => openModal(registerModal));
                registerBtn.addEventListener('click', logout);
            }
        }
    }

    function logout() {
        localStorage.removeItem('authToken');
        if(loginBtn) loginBtn.style.display = 'inline-flex';
        if(registerBtn) {
            registerBtn.textContent = 'Cadastrar';
            registerBtn.removeEventListener('click', logout);
            registerBtn.addEventListener('click', () => openModal(registerModal));
        }
    }

    // Check login status on page load
    updateUIAfterLogin();
});
