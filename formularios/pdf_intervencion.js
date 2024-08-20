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

    // Definimos el ancho máximo del texto
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    // Función para agregar texto con control de línea y salto de página
    function addTextWithWrapAndStyle(text, x, y, style = 'normal') {
        const textLines = doc.splitTextToSize(text, maxLineWidth);
        const lineHeight = 10;
        doc.setFont('helvetica', style); // Aquí se establece la fuente y el estilo
        for (let i = 0; i < textLines.length; i++) {
            if (y > doc.internal.pageSize.getHeight() - margin) { // Si el texto se sale de la página
                doc.addPage();
                y = margin; // Restablece la posición Y
            }
            doc.text(x, y, textLines[i]);
            y += lineHeight;
        }
        return y; // Devuelve la nueva posición Y
    }
    

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

    // Posición inicial Y
    let y = 20;

    // Añadiendo texto al PDF con envoltura
    y = addTextWithWrapAndStyle(`· Motivo intervención: ${motivo}`, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`· Voluntario: ${voluntario}`, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`· Vehículo Utilizado: ${vehiculo}`, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`· Fecha y Hora: ${fechaHoraFormateada}`, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`· Hora de Fin: ${horaFin}`, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`· Solicitante: ${solicitante}`, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`· Cooperación con otras entidades: ${cooperacion}`, margin, y, 'bold');
    doc.line(margin, y, pageWidth - margin, y); // Dibuja la línea horizontal
    y += 10;

    // Añadir preguntas específicas según la categoría seleccionada
    if (categoria === 'sanitaria') {
        const tipoSanitaria = document.getElementById('tipo-sanitaria').value;
        y = addTextWithWrapAndStyle(`- Tipo de emergencia sanitaria: ${tipoSanitaria}`, margin, y, 'italic');
        const nombrePaciente = document.getElementById('nombre-paciente').value;
        y = addTextWithWrapAndStyle(`- Nombre del paciente: ${nombrePaciente}`, margin, y, 'italic');
        const estadoPaciente = document.getElementById('estado-paciente').value;
        y = addTextWithWrapAndStyle(`- Estado del paciente: ${estadoPaciente}`, margin, y, 'italic');
        const primerosAuxilios = document.getElementById('primeros-auxilios').value;
        y = addTextWithWrapAndStyle(`- Primeros auxilios realizados: ${primerosAuxilios}`, margin, y, 'italic');
        const traslado = document.getElementById('traslado').value;
        y = addTextWithWrapAndStyle(`- Traslado: ${traslado}`, margin, y, 'italic');
    } else if (categoria === 'incendio') {
        const detalleIncendio = document.getElementById('detalle-incendio').value;
        y = addTextWithWrapAndStyle(`Detalle del incendio: ${detalleIncendio}`, margin, y);
    } else if (categoria === 'trafico') {
        const detalleTrafico = document.getElementById('detalle-trafico').value;
        y = addTextWithWrapAndStyle(`Detalle del incidente de tráfico: ${detalleTrafico}`, margin, y);
    } else if (categoria === 'ayuda_social') {
        const detalleAyudaSocial = document.getElementById('detalle-ayuda-social').value;
        y = addTextWithWrapAndStyle(`Detalle de la ayuda social: ${detalleAyudaSocial}`, margin, y);
    } else if (categoria === 'proteccion_animal') {
        const detalleProteccionAnimal = document.getElementById('detalle-proteccion-animal').value;
        y = addTextWithWrapAndStyle(`Detalle de la protección animal: ${detalleProteccionAnimal}`, margin, y);
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