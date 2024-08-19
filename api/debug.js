export default async (req, res) => {
    console.log("Request received");

    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests are allowed' });
    }

    // Imprimir el contenido de req.body
    console.log("Campos del formulario recibidos en req.body:", req.body);

    res.status(200).json({ message: 'Datos recibidos correctamente', data: req.body });
};
