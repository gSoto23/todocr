const express = require('express');
const router = express.Router();
const multer = require('multer');
const EmailService = require('../services/emailService');
const { contactTemplate, reportTemplate } = require('../utils/emailTemplates');

const upload = multer();

// Ruta para el formulario de contacto
router.post('/contact', upload.array('attachments'), async (req, res) => {
    try {
        const { to, cc, name, phone, service, size, date, message } = req.body;

        const emailContent = contactTemplate({
            name,
            phone,
            service,
            size,
            date,
            message
        });

        // Preparar los archivos adjuntos si existen
        const attachments = req.files ? req.files.map(file => ({
            content: file.buffer.toString('base64'),
            filename: file.originalname,
            type: file.mimetype,
            disposition: 'attachment'
        })) : [];

        // Enviar email al cliente y CC
        await EmailService.sendEmail({
            to,
            cc: [cc],  // SendGrid acepta un array de correos CC
            subject: `Cotización TODOCR: ${service}`,
            html: emailContent.html,
            text: emailContent.text,
            attachments
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al enviar el email'
        });
    }
});


// Ruta para el reporte de limpieza
router.post('/cleaning-report', upload.array('images'), async (req, res) => {
    try {
        const { type, date, tasks, comments } = req.body;

        const emailContent = reportTemplate({
            type,
            date,
            tasks: JSON.parse(tasks),
            comments
        });

        await EmailService.sendEmail({
            to: process.env.REPORTS_EMAIL,
            subject: `Reporte de limpieza - ${date}`,
            html: emailContent.html,
            text: emailContent.text,
            attachments: req.files
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/contact-home', async (req, res) => {
    try {
        const { name, email, phone, service, size, date, message } = req.body;

        // Usar el template existente
        const emailContent = contactTemplate({
            name,
            email,
            phone,
            service,
            size,
            date,
            message
        });

        // Enviar email
        await EmailService.sendEmail({
            to: 'info.todocr@gmail.com',
            cc: email,
            subject: `Nuevo contacto desde web: ${service}`,
            html: emailContent.html,
            text: emailContent.text
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al enviar el email'
        });
    }
});


module.exports = router;