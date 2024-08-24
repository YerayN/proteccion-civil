const USERS = [
    { username: "y.navarro", password: "prote123", role: "admin" },
    { username: "p.marquez", password: "J100", role: "admin" },
    { username: "s.lloret", password: "PCvillajoyosa22", role: "user" },
    { username: "j.molina", password: "prote123", role: "user" },
    { username: "p.lopez", password: "pedropclavila", role: "user" },
    { username: "n.martinez", password: "proteccioncivil1990", role: "user" },
    { username: "v.moya", password: "PCLVJ2024_", role: "user" },
    { username: "j.climent", password: "atletismo123", role: "user" },
    { username: "p.peinado", password: "Almarcha34", role: "user" },
    { username: "y.real", password: "Real999", role: "user" },
    { username: "a.garcia", password: "VoluN24", role: "user" },
    { username: "m.sordo", password: "140498", role: "user" },
    { username: "j.ruiz", password: "Lavila1994", role: "user" },
    { username: "l.molto", password: "luiset1000", role: "user" }
];



function login(event) { //Controla el inicio de sesión y entrega un token
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


function checkAuth(requiredRole) {//Verifica el token y el rol de cada usuario
    const authToken = localStorage.getItem("authToken");
    const loggedUser = localStorage.getItem("loggedUser");

    if (!authToken || !loggedUser) {
        window.location.href = "../login.html";
        return;
    }

    const user = USERS.find(u => u.username === loggedUser);

    if (!user || (requiredRole && user.role !== requiredRole)) {
        window.location.href = "../index.html";
    }
}


function logout() {//Controla el cierre de sesión
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