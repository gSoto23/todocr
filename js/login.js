// Configuración
const CONFIG = {
    credentials: {
        user: 'todocr',
        pass: '2025!'
    },
    redirectPath: './coti/cotizador.html',
    authKey: 'todocr_auth',
    authValue: 'authenticated' // Mejor valor que solo 'ok'
};

// Verificar si ya está autenticado
function checkAuth() {
    const isAuthenticated = localStorage.getItem(CONFIG.authKey) === CONFIG.authValue;
    if (isAuthenticated) {
        redirectToApp();
    }
}

// Función de redirección
function redirectToApp() {
    window.location.href = CONFIG.redirectPath;
}

// Validación de credenciales
function validateLogin(username, password) {
    return username === CONFIG.credentials.user &&
        password === CONFIG.credentials.pass;
}

// Manejar el proceso de login
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('user').value.trim();
    const password = document.getElementById('pass').value;

    if (validateLogin(username, password)) {
        // Guardar autenticación
        localStorage.setItem(CONFIG.authKey, CONFIG.authValue);
        redirectToApp();
    } else {
        alert('Credenciales inválidas');
        document.getElementById('pass').value = '';
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    checkAuth();

    // Configurar el formulario
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});