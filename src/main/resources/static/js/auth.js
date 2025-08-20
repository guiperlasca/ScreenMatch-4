document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const closeButtons = document.querySelectorAll('.close');

    const API_BASE_URL = 'http://localhost:8080';
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- Modal Handling ---
    function openModal(modal) {
        if(modal) modal.style.display = 'block';
    }

    function closeModal(modal) {
        if(modal) modal.style.display = 'none';
    }

    if(loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if(registerBtn) {
        registerBtn.addEventListener('click', () => {
            const isLoggedIn = !!localStorage.getItem('authToken');
            if (isLoggedIn) {
                logout();
            } else {
                openModal(registerModal);
            }
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(registerModal);
        });
    });

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

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === registerModal) closeModal(registerModal);
    });

    // --- Authentication Logic ---
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
                    const errorText = await response.text();
                    throw new Error(errorText || 'Registration failed');
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
            document.body.classList.add('logged-in');
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.textContent = 'Sair';
        } else {
            document.body.classList.remove('logged-in');
            if (loginBtn) loginBtn.style.display = 'inline-flex';
            if (registerBtn) registerBtn.textContent = 'Cadastrar';
        }
    }

    function logout() {
        localStorage.removeItem('authToken');
        updateUIAfterLogin();
        // Optional: redirect to home page or refresh
        // window.location.href = '/';
    }

    // Initial UI update on page load
    updateUIAfterLogin();
});
