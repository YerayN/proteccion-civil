function mostrarFormulario() {
    const categoria = document.getElementById('categoria').value;
    const formularios = document.querySelectorAll('.formulario-categoria');

    formularios.forEach(formulario => {
        formulario.classList.add('seccion-oculta');
    });

    if (categoria) {
        document.getElementById(`formulario-${categoria}`).classList.remove('seccion-oculta');
    }
}

document.getElementById('informe-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita el envío normal del formulario

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const motivo = document.getElementById('motivo').value;
    const voluntario = document.getElementById('voluntario').value;
    const vehiculo = document.getElementById('vehiculo').value;
    const fechaHoraRaw = document.getElementById('fecha-hora').value;
    const horaFin = document.getElementById('hora-fin').value;
    const solicitante = document.getElementById('solicitante').value;
    const cooperacion = document.getElementById('cooperacion').value;
    const categoria = document.getElementById('categoria').value;

    // Formatear la fecha y hora
    const fecha = new Date(fechaHoraRaw);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const ano = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const fechaHoraFormateada = `${dia}-${mes}-${ano}_${hora}:${minutos}`;

    // Aquí generas el contenido del PDF basado en el formulario
    doc.text(20, 20, `Motivo intervención: ${motivo}`);
    doc.text(20, 30, `Voluntario: ${voluntario}`);
    doc.text(20, 40, `Vehículo Utilizado: ${vehiculo}`);
    doc.text(20, 50, `Fecha y Hora: ${fechaHoraFormateada}`);
    doc.text(20, 60, `Hora de Fin: ${horaFin}`);
    doc.text(20, 70, `Solicitante: ${solicitante}`);
    doc.text(20, 80, `Cooperación con otras entidades: ${cooperacion}`);
    doc.line(20, 90, 190, 90); // Dibuja una línea horizontal desde (20, 95) hasta (190, 95)

    // Añadir preguntas específicas según la categoría seleccionada
    if (categoria === 'sanitaria') {
        const tipoSanitaria = document.getElementById('tipo-sanitaria').value;
        doc.text(20, 100, `Tipo de emergencia sanitaria: ${tipoSanitaria}`);
        const nombrePaciente = document.getElementById('nombre-paciente').value;
        doc.text(20, 110, `Nombre del paciente: ${nombrePaciente}`);
        const estadoPaciente = document.getElementById('estado-paciente').value;
        doc.text(20, 120, `Estado del paciente: ${estadoPaciente}`);
        const primerosAuxilios = document.getElementById('primeros-auxilios').value;
        doc.text(20, 130, `Primeros auxilios realizados: ${primerosAuxilios}`);
        const traslado = document.getElementById('traslado').value;
        doc.text(20, 140, `Traslado: ${traslado}`);
    } else if (categoria === 'incendio') {
        const detalleIncendio = document.getElementById('detalle-incendio').value;
        doc.text(20, 100, `Detalle del incendio: ${detalleIncendio}`);
    } else if (categoria === 'trafico') {
        const detalleTrafico = document.getElementById('detalle-trafico').value;
        doc.text(20, 100, `Detalle del incidente de tráfico: ${detalleTrafico}`);
    } else if (categoria === 'ayuda_social') {
        const detalleAyudaSocial = document.getElementById('detalle-ayuda-social').value;
        doc.text(20, 100, `Detalle de la ayuda social: ${detalleAyudaSocial}`);
    } else if (categoria === 'proteccion_animal') {
        const detalleProteccionAnimal = document.getElementById('detalle-proteccion-animal').value;
        doc.text(20, 100, `Detalle de la protección animal: ${detalleProteccionAnimal}`);
    }

    // Generar el PDF como un blob
    const pdfBlob = doc.output('blob');

    // Crear un FormData para enviar el PDF al servidor
    const formData = new FormData();
    formData.append('motivo', motivo);
    formData.append('voluntario', voluntario);
    formData.append('vehiculo', vehiculo);
    formData.append('fecha-hora', fechaHoraFormateada);
    formData.append('hora-fin', horaFin);
    formData.append('solicitante', solicitante);
    formData.append('cooperacion', cooperacion);
    formData.append('categoria', categoria);
    formData.append('pdf', pdfBlob, 'informe.pdf');

    // Enviar el PDF generado al backend
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert('Informe subido correctamente: ' + result.fileId);
        } else {
            console.error('Error al subir el informe:', result.message);
            alert('Error al subir el informe');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al subir el informe');
    }
});