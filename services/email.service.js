const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    secure: true,
    port: 25,
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'cyberguard.uade@gmail.com', // poner cuenta gmail
        pass: 'xfjn jzhv topg lbyd'  // contraseña cuenta IMPORTANTE HABILITAR acceso apps poco seguras google
    }
});

async function sendEmail(mailOptions) {
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return { status: 200, message: "Email enviado con éxito" };
    } catch (error) {
        console.log("Error envio mail: ", error);
        return { status: 400, message: "Error envio mail" };
    }
}

module.exports = {
    sendEmail
};
