export function getToken() {
    return localStorage.getItem('token');
}

export function getAuthHeader() {
    const token = getToken();
    if (token) {
        return {
            'Authorization': `Bearer ${token}`
        };
    }
    return {};
}

export function isUserLoggedIn() {
    return !!getToken();
}

export function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}
