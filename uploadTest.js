const { google } = require('googleapis');
const fs = require('fs');

const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

async function uploadFile() {
    const fileStream = fs.createReadStream('test.pdf'); // Ruta al archivo de prueba

    try {
        const response = await drive.files.create({
            media: {
                mimeType: 'application/pdf',
                body: fileStream
            },
            requestBody: {
                name: 'Test Upload.pdf',
                parents: ['1CA8ofJdJJcRkh7GGLcnyULGhS5gsIkWj'] // Reemplaza con el ID de tu carpeta
            }
        });

        console.log('Archivo subido a Google Drive, ID:', response.data.id);
    } catch (error) {
        console.error('Error al subir a Google Drive:', error.message);
    }
}

uploadFile();
