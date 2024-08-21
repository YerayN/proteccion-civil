const USERS = [
    { username: "y.navarro", password: "prote123" },
    { username: "p.marquez", password: "prote123" },
    { username: "s.lloret", password: "prote123" },
    { username: "j.molina", password: "prote123" },
    { username: "p.lopez", password: "pedropclavila" },
    { username: "n.martinez", password: "proteccioncivil1990" },
    { username: "v.moya", password: "PCLVJ2024_" },
    { username: "j.climent", password: "atletismo123" }
];

function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("authToken", "loggedIn");
        localStorage.setItem("loggedUser", username); // Guardar el nombre de usuario
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