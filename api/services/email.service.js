const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar un email de bienvenida
const enviarEmailBienvenida = async (destinatarioEmail, nombreUsuario) => {
    try {
        const info = await transporter.sendMail({
            from: `"Salud SM" <${process.env.EMAIL_USER}>`,
            to: destinatarioEmail,
            subject: "¡Bienvenido/a a Salud SM!",
            html: `<h1>¡Hola ${nombreUsuario}!</h1><p>Te damos la bienvenida a la plataforma de turnos de Santa María.</p><p>Gracias por registrarte.</p>`
        });
        console.log("Email de bienvenida enviado: %s", info.messageId);
    } catch (error) {
        console.error("Error al enviar el email de bienvenida:", error);
    }
};

// --- NUEVA FUNCIÓN ---
// Función para enviar una confirmación de turno
const enviarConfirmacionTurno = async (destinatarioEmail, datosTurno) => {
    const { paciente, profesional, fecha, hora } = datosTurno;
    try {
        await transporter.sendMail({
            from: `"Salud SM" <${process.env.EMAIL_USER}>`,
            to: destinatarioEmail,
            subject: "Confirmación de tu Turno en Salud SM",
            html: `
                <h2>¡Hola ${paciente}!</h2>
                <p>Tu turno ha sido confirmado con éxito.</p>
                <h3>Detalles del turno:</h3>
                <ul>
                    <li><strong>Profesional:</strong> Dr. ${profesional}</li>
                    <li><strong>Fecha:</strong> ${fecha}</li>
                    <li><strong>Hora:</strong> ${hora}</li>
                </ul>
                <p>¡Te esperamos!</p>
            `
        });
        console.log("Email de confirmación de turno enviado.");
    } catch (error) {
        console.error("Error al enviar el email de confirmación de turno:", error);
    }
};

module.exports = {
    enviarEmailBienvenida,
    enviarConfirmacionTurno // <-- No olvides exportar la nueva función
};
