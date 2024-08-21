import { google } from 'googleapis';
import { Readable } from 'stream';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });
const upload = multer();

// ID de la carpeta por defecto
const folderId = '1d4Vw4frsuUBJHq8NqZqAlQbcb6JLLcjt';

async function getNextId(folderId) {
    try {
        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(name)',
            orderBy: 'name desc'
        });

        if (response.data.files.length > 0) {
            const fileNames = response.data.files.map(file => file.name);
            const ids = fileNames.map(name => parseInt(name.split(' - ')[0])).filter(Number.isInteger);
            const maxId = Math.max(...ids);
            return maxId + 1;
        } else {
            return 1;
        }
    } catch (error) {
        console.error('Error getting next ID:', error.message);
        throw error;
    }
}

async function generateFileName(req, folderId) {
    const nextId = await getNextId(folderId);
    const now = new Date();
    const options = { timeZone: 'Europe/Madrid', hour12: false };
    const date = now.toLocaleDateString('es-ES', options).replace(/\//g, '-');
    const time = now.toLocaleTimeString('es-ES', options).replace(/:/g, '-');

    const servicio = req.body.servicio ? req.body.servicio.replace(/\s+/g, '-') : 'SinTitulo';

    return `${nextId.toString().padStart(4, '0')} - ${servicio}_${date}_${time}.pdf`;
}

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    upload.fields([
        { name: 'pdf', maxCount: 1 },
        { name: 'servicio', maxCount: 1 },
        { name: 'ubicacion', maxCount: 1 },
        { name: 'fecha-hora', maxCount: 1 },
        { name: 'duracion', maxCount: 1 },
        { name: 'voluntarios', maxCount: 1 },
        { name: 'solicitante', maxCount: 1 },
        { name: 'descripcion', maxCount: 1 },
    ])(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error uploading the file', error: err.message });
        }

        try {
            if (!req.files || !req.files.pdf || req.files.pdf.length === 0) {
                throw new Error("No file received");
            }

            const fileName = await generateFileName(req, folderId);

            const fileStream = new Readable();
            fileStream.push(req.files.pdf[0].buffer);
            fileStream.push(null);

            const response = await drive.files.create({
                media: {
                    mimeType: 'application/pdf',
                    body: fileStream
                },
                requestBody: {
                    name: fileName,
                    parents: [folderId]
                }
            });

            console.log(`Archivo subido a Google Drive:`, response.data.id);
            res.status(200).json({ fileId: response.data.id });
        } catch (error) {
            console.error('Error uploading file to Google Drive:', error.message);
            res.status(500).send({ message: 'Error uploading the file', error: error.message });
        }
    });
};
