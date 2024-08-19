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


 // Lógica para manejar la visibilidad de las secciones del formulario
 const tipoInformeSelect = document.getElementById("tipo-informe");

 tipoInformeSelect.addEventListener("change", function() {
     // Oculta todas las secciones
     document.querySelectorAll(".seccion-oculta").forEach(function(seccion) {
         seccion.classList.remove("seccion-visible");
     });

     // Muestra la sección correspondiente según la opción seleccionada
     const tipoSeleccionado = tipoInformeSelect.value;
     if (tipoSeleccionado) {
         document.getElementById(`seccion-${tipoSeleccionado}`).classList.add("seccion-visible");
     }
 });

document.getElementById('informe-form').addEventListener('submit', function(event) {
 event.preventDefault();
 alert('Formulario enviado. Se generará el informe.');
 // Aquí se implementará la lógica para generar el informe
});


document.getElementById('informe-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Capturar los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const departamento = document.getElementById("departamento").value;
    const progreso = document.getElementById("progreso").value;
    const comentarios = document.getElementById("comentarios").value;
    const firma = document.getElementById("firma").value;

    // Añadir contenido al PDF
    doc.text("Informe Generado", 10, 10);
    doc.text(`Nombre: ${nombre}`, 10, 20);
    doc.text(`Correo Electrónico: ${email}`, 10, 30);
    doc.text(`Departamento: ${departamento}`, 10, 40);
    doc.text(`Progreso del Proyecto: ${progreso}%`, 10, 50);
    doc.text(`Comentarios: ${comentarios}`, 10, 60);
    doc.text(`Firma: ${firma}`, 10, 70);

    // Convertir el PDF a un Blob y luego a un File
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], `Informe_${nombre}.pdf`, { type: 'application/pdf' });

    // Crear FormData y agregar el archivo PDF
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    // Enviar el archivo al servidor usando fetch
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('PDF subido con éxito', data);  // Aquí verás la respuesta del servidor
    })
    .catch(error => console.error('Error al subir el PDF:', error));  // Aquí verás si hay algún error
});