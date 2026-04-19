import nodemailer from 'nodemailer';
import ENVIRONMENT from "./environment.config.js";

// Configuración del transporte de correo utilizando nodemailer
const mailerTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.MAIL_USER,
        pass: ENVIRONMENT.MAIL_PASSWORD
    }
});

export default mailerTransporter;