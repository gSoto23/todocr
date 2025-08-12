const sgMail = require('@sendgrid/mail');
const config = require('../config/sendgrid');

sgMail.setApiKey(config.apiKey);

class EmailService {
    static async sendEmail({ to, cc, subject, text, html, attachments = [] }) {
        try {
            const msg = {
                to,
                from: config.fromEmail,
                subject,
                text,
                html
            };

            // Agregar CC si existe
            if (cc && cc.length > 0) {
                msg.cc = Array.isArray(cc) ? cc : [cc];
            }

            // Procesar archivos adjuntos si existen
            if (attachments.length > 0) {
                msg.attachments = attachments.map((file, index) => ({
                    content: file.buffer.toString('base64'),
                    filename: file.originalname || `attachment${index + 1}${this.getFileExtension(file.mimetype)}`,
                    type: file.mimetype,
                    disposition: 'attachment'
                }));
            }

            // Validar tamaño total de adjuntos
            if (msg.attachments) {
                const totalSize = msg.attachments.reduce((sum, attachment) =>
                    sum + Buffer.from(attachment.content, 'base64').length, 0);

                // SendGrid tiene un límite de 30MB para el total de adjuntos
                const MAX_ATTACHMENT_SIZE = 30 * 1024 * 1024; // 30MB en bytes
                if (totalSize > MAX_ATTACHMENT_SIZE) {
                    throw new Error('El tamaño total de los archivos adjuntos excede el límite de 30MB');
                }
            }

            await sgMail.send(msg);
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response) {
                console.error('SendGrid API Error:', error.response.body);
            }

            // Crear un mensaje de error más amigable
            let errorMessage = 'Error al enviar el email';
            if (error.message.includes('tamaño total')) {
                errorMessage = error.message;
            } else if (error.response?.body?.errors) {
                errorMessage = error.response.body.errors
                    .map(err => err.message)
                    .join('. ');
            }

            throw new Error(errorMessage);
        }
    }

    static getFileExtension(mimetype) {
        const extensions = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'application/pdf': '.pdf',
            'text/plain': '.txt',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-excel': '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
        };
        return extensions[mimetype] || '';
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateAttachment(file) {
        // Lista de tipos MIME permitidos
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        // Verificar tipo MIME
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(`Tipo de archivo no permitido: ${file.mimetype}`);
        }

        // Verificar tamaño individual del archivo (20MB)
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB en bytes
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`El archivo ${file.originalname} excede el límite de 20MB`);
        }

        return true;
    }
}

module.exports = EmailService;