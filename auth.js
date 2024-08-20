const USERS = [
    { username: "voluntario1", password: "password123" },
    { username: "voluntario2", password: "password456" }
];

function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("authToken", "loggedIn");
        window.location.href = "index.html";
    } else {
        document.getElementById("error-message").textContent = "Usuario o contraseña incorrectos.";
    }
}

function checkAuth() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "/login.html";
}


// Verificar la autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Solo verifica la autenticación si no estás en la página de login
    if (!window.location.href.includes('login.html')) {
        checkAuth();
    }
});