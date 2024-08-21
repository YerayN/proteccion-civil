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
    const vehiculo = document.getElementById('vehiculo').value;
    const repostajeLitros = document.getElementById('repostaje-litros').value;
    const repostajeEuros = document.getElementById('repostaje-euros').value;
    const kilometros = document.getElementById('kilometros').value;
    const voluntario = document.getElementById('voluntario').value;

    // Posición inicial Y
    let y = 20;

    // Añadiendo texto al PDF con etiquetas en negrita y valores normales
    y = addTextWithWrapAndStyle(`- Vehículo: `, vehiculo, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Cantidad repostada (Litros): `, repostajeLitros, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Cantidad repostada (Dinero): `, repostajeEuros, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Kilómetros actuales: `, kilometros, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Voluntario: `, voluntario, margin, y, 'bold');
    y = addTextWithWrapAndStyle(`- Usuario: `, username, margin, y, 'bold');
    doc.line(margin, y, pageWidth - margin, y); // Dibuja la línea horizontal
    y += 10;

    // Generar el PDF como un blob
    const pdfBlob = doc.output('blob');

    // Crear un FormData para enviar el PDF al servidor
    const formData = new FormData();
    formData.append('vehiculo', vehiculo);
    formData.append('repostaje-litros', repostajeLitros);
    formData.append('repostaje-euros', repostajeEuros);
    formData.append('kilometros', kilometros);
    formData.append('voluntario', voluntario);
    formData.append('username', username);
    formData.append('pdf', pdfBlob, 'informe.pdf');

    // Enviar el PDF generado al backend
    try {
        const response = await fetch('/api/upload_repostaje', {
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
