function mostrarFormulario() {
    const categoria = document.getElementById('categoria').value;
    const formularios = document.querySelectorAll('.formulario-categoria');

    formularios.forEach(formulario => {
        formulario.classList.add('seccion-oculta');
    });

    const formularioSeleccionado = document.getElementById(`formulario-${categoria}`);
    if (formularioSeleccionado) {
        formularioSeleccionado.classList.remove('seccion-oculta');
    } else {
        console.error(`No se encontró el formulario para la categoría: ${categoria}`);
    }
}


document.getElementById('informe-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita el envío normal del formulario

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtener el nombre de usuario desde localStorage
    const username = localStorage.getItem('loggedUser');

    // Definimos el ancho máximo del texto
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;

    // Función para agregar texto con control de línea y salto de página
    function addTextWithWrapAndStyle(label, value, x, y, style = 'normal') {
        doc.setFont('helvetica', style); // Aplicar estilo a la etiqueta
        const labelWidth = doc.getTextWidth(label); // Obtener el ancho del texto de la etiqueta
        doc.text(x, y, label); // Imprimir la etiqueta

        doc.setFont('helvetica', 'normal'); // Cambiar el estilo a normal para el valor
        const textLines = doc.splitTextToSize(value, maxLineWidth - labelWidth);
        const lineHeight = 10;

        for (let i = 0; i < textLines.length; i++) {
            if (y > doc.internal.pageSize.getHeight() - margin) { // si el texto se sale de la página
                doc.addPage();
                y = margin; // restablece la posición Y
            }
            if (i === 0) {
                // Imprimir la primera línea del valor en la misma línea que la etiqueta
                doc.text(x + labelWidth, y, textLines[i]);
            } else {
                // Imprimir las líneas siguientes debajo
                y += lineHeight;
                doc.text(x, y, textLines[i]);
            }
        }
        return y + lineHeight; // Devuelve la nueva posición Y
    }

    // Recopilación de los datos del formulario
    const motivo = document.getElementById('motivo').value;
    const voluntario = document.getElementById('voluntario').value;
    const vehiculo = document.getElementById('vehiculo').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const fechaHoraRaw = document.getElementById('fecha-hora').value;
    const duracion = document.getElementById('duracion').value;
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

    // Añadiendo texto al PDF con etiquetas en negrita y valores normales
    y = addTextWithWrapAndStyle(`- Motivo intervención: `, motivo, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Voluntario: `, voluntario, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Vehículo Utilizado: `, vehiculo, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Ubicación: `, ubicacion, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Fecha y Hora: `, fechaHoraFormateada, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Duración (Horas): `, duracion, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Solicitante: `, solicitante, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Cooperación con otras entidades: `, cooperacion, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Usuario: `, username, margin, y, 'bold');
    doc.line(margin, y, pageWidth - margin, y); // Dibuja la línea horizontal
    y += 10;

    // Añadir preguntas específicas según la categoría seleccionada con guion y estilo
    if (categoria === 'sanitaria') {
        const tipoSanitaria = document.getElementById('tipo-sanitaria').value;
        y = addTextWithWrapAndStyle(`- Tipo de emergencia sanitaria: `, tipoSanitaria, margin, y, 'bold');
        const nombrePaciente = document.getElementById('nombre-paciente').value;
        y = addTextWithWrapAndStyle(`- Nombre del paciente: `, nombrePaciente, margin, y, 'bold');
        const edadPaciente = document.getElementById('edad-paciente').value;
        y = addTextWithWrapAndStyle(`- Edad: `, edadPaciente, margin, y, 'bold');
        const sexoPaciente = document.getElementById('sexo-paciente').value;
        y = addTextWithWrapAndStyle(`- Sexo: `, sexoPaciente, margin, y, 'bold');
        const estadoPaciente = document.getElementById('estado-paciente').value;
        y = addTextWithWrapAndStyle(`- Estado del paciente: `, estadoPaciente, margin, y, 'bold');
        const primerosAuxilios = document.getElementById('primeros-auxilios').value;
        y = addTextWithWrapAndStyle(`- Primeros auxilios realizados: `, primerosAuxilios, margin, y, 'bold');
        const traslado = document.getElementById('traslado').value;
        y = addTextWithWrapAndStyle(`- Traslado: `, traslado, margin, y, 'bold');
    } else if (categoria === 'incendio') {
        const tipoIncendio = document.getElementById('tipo-incendio').value;
        y = addTextWithWrapAndStyle(`- Tipo de incendio: `, tipoIncendio, margin, y, 'bold');
        const tamanoIncendio = document.getElementById('tamano-incendio').value;
        y = addTextWithWrapAndStyle(`- Tamaño del incendio: `, tamanoIncendio, margin, y, 'bold');
        const apoyoIncendio = document.getElementById('apoyo-incendio').value;
        y = addTextWithWrapAndStyle(`- Medidas de apoyo realizadas: `, apoyoIncendio, margin, y, 'bold');
        const recursosIncendio = document.getElementById('recursos-incendio').value;
        y = addTextWithWrapAndStyle(`- Recursos empleados: `, recursosIncendio, margin, y, 'bold');
    } else if (categoria === 'trafico') {
        const tipoTrafico = document.getElementById('tipo-trafico').value;
        y = addTextWithWrapAndStyle(`- Tipo de intervención: `, tipoTrafico, margin, y, 'bold');
        const apoyoTrafico = document.getElementById('apoyo-trafico').value;
        y = addTextWithWrapAndStyle(`- Medidas de apoyo realizadas: `, apoyoTrafico, margin, y, 'bold');
        const recursosTrafico = document.getElementById('recursos-trafico').value;
        y = addTextWithWrapAndStyle(`- Recursos empleados: `, recursosTrafico, margin, y, 'bold');
    } else if (categoria === 'ayuda_social') {
        const beneficiarioSocial = document.getElementById('beneficiario-social').value;
        y = addTextWithWrapAndStyle(`- Beneficiario de la ayuda social: `, beneficiarioSocial, margin, y, 'bold');
        const apoyoSocial = document.getElementById('apoyo-social').value;
        y = addTextWithWrapAndStyle(`- Medidas de apoyo realizadas: `, apoyoSocial, margin, y, 'bold');
        const recursosSocial = document.getElementById('recursos-social').value;
        y = addTextWithWrapAndStyle(`- Recursos empleados: `, recursosSocial, margin, y, 'bold');
    } else if (categoria === 'proteccion_animal') {
        const tipoAnimal = document.getElementById('tipo-animal').value;
        y = addTextWithWrapAndStyle(`- Tipo de animal: `, tipoAnimal, margin, y, 'bold');
        const chip = document.getElementById('chip').value;
        y = addTextWithWrapAndStyle(`- Tiene chip: `, chip, margin, y, 'bold');
        const apoyoAnimal = document.getElementById('apoyo-animal').value;
        y = addTextWithWrapAndStyle(`- Medidas de apoyo realizadas: `, apoyoAnimal, margin, y, 'bold');
        const recursosAnimal = document.getElementById('recursos-animal').value;
        y = addTextWithWrapAndStyle(`- Recursos empleados: `, recursosAnimal, margin, y, 'bold');
        const trasladoAnimal = document.getElementById('traslado-animal').value;
        y = addTextWithWrapAndStyle(`- Traslado: `, trasladoAnimal, margin, y, 'bold');
    }

    // Generar el PDF como un blob
    const pdfBlob = doc.output('blob');

    // Crear un FormData para enviar el PDF al servidor
    const formData = new FormData();
    formData.append('motivo', motivo);
    formData.append('voluntario', voluntario);
    formData.append('vehiculo', vehiculo);
    formData.append('ubicacion', ubicacion);
    formData.append('fecha-hora', fechaHoraFormateada);
    formData.append('duracion', duracion);
    formData.append('solicitante', solicitante);
    formData.append('cooperacion', cooperacion);
    formData.append('categoria', categoria);
    formData.append('username', username);
    formData.append('pdf', pdfBlob, 'informe.pdf');

    // Enviar el PDF generado al backend
    try {
        const response = await fetch('/api/upload_intervencion', {
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
