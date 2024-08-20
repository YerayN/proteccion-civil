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
    const vehiculo = document.getElementById('vehiculo').value;
    const averia = document.getElementById('averia').value;
    const voluntario = document.getElementById('voluntario').value;

    // Posición inicial Y
    let y = 20;

    // Añadiendo texto al PDF con etiquetas en negrita y valores normales
    y = addTextWithWrapAndStyle(`- Vehículo: `, motivo, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Avería: `, voluntario, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Voluntario: `, vehiculo, margin, y, 'bold');
    doc.line(margin, y, pageWidth - margin, y); // Dibuja la línea horizontal
    y += 10;


    // Generar el PDF como un blob
    const pdfBlob = doc.output('blob');

    // Crear un FormData para enviar el PDF al servidor
    const formData = new FormData();
    formData.append('vehiculo', vehiculo);
    formData.append('averia', averia);
    formData.append('voluntario', voluntario);
    formData.append('pdf', pdfBlob, 'informe.pdf');

    // Enviar el PDF generado al backend
    try {
        const response = await fetch('/api/upload_averias', {
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
