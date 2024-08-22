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


function checkAuth(requiredRole) {
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


let voluntariosApuntados = {
    evento1: 0,
    evento2: 0,
    // Añadir más eventos aquí si es necesario
};

function apuntarVoluntario(eventoId) {
    const maxVoluntarios = 2;

    // Verificar si el usuario está autenticado
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("Por favor, inicie sesión para apuntarse al evento.");
        window.location.href = "login.html";
        return;
    }

    // Continuar con el proceso de inscripción si está autenticado
    if (voluntariosApuntados[eventoId] < maxVoluntarios) {
        voluntariosApuntados[eventoId]++;
        document.getElementById(`${eventoId}-voluntarios`).textContent = `Voluntarios apuntados: ${voluntariosApuntados[eventoId]}/2`;

        if (voluntariosApuntados[eventoId] >= maxVoluntarios) {
            document.querySelector(`#${eventoId} button`).disabled = true;
        }
    }
}
