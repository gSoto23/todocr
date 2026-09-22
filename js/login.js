// Configuración
const CONFIG = {
    apiBase: 'https://todocr.com',
    endpoints: {
        login: '/api/auth/login',
        verify: '/api/auth/verify'
    },
    redirectPath: './coti/cotizador.html',
    tokenKey: 'todocr_auth_token'
};

// Verificar si ya hay una sesión válida (contra el backend, no solo localStorage)
async function checkAuth() {
    const token = localStorage.getItem(CONFIG.tokenKey);
    if (!token) return;

    try {
        const res = await fetch(`${CONFIG.apiBase}${CONFIG.endpoints.verify}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            redirectToApp();
        } else {
            localStorage.removeItem(CONFIG.tokenKey);
        }
    } catch (error) {
        // Sin conexión: dejamos que el usuario inicie sesión normalmente
    }
}

function redirectToApp() {
    window.location.href = CONFIG.redirectPath;
}

function setLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? 'Ingresando...' : 'Ingresar';
}

// Manejar el proceso de login contra el backend
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('user').value.trim();
    const password = document.getElementById('pass').value;
    const submitButton = e.target.querySelector('.login-btn');

    if (!username || !password) {
        alert('Usuario y contraseña son requeridos');
        return;
    }

    setLoading(submitButton, true);

    try {
        const res = await fetch(`${CONFIG.apiBase}${CONFIG.endpoints.login}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success && data.token) {
            localStorage.setItem(CONFIG.tokenKey, data.token);
            redirectToApp();
        } else {
            alert(data.message || 'Credenciales inválidas');
            document.getElementById('pass').value = '';
        }
    } catch (error) {
        alert('No se pudo conectar con el servidor. Intenta de nuevo.');
    } finally {
        setLoading(submitButton, false);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});
