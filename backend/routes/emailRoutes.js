const express = require('express');
const router = express.Router();
const multer = require('multer');
const EmailService = require('../services/emailService');
const { contactTemplate, quotationTemplate, reportTemplate } = require('../utils/emailTemplates');

const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB límite
        files: 10 // máximo 10 archivos
    }
});

// Ruta para el formulario de contacto simple (desde index.html)
router.post('/contact-home', async (req, res) => {
    try {
        const { name, email, phone, service, size, date, message } = req.body;

        // Validar campos requeridos
        if (!email || !name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        const emailContent = contactTemplate({
            name,
            email,
            phone,
            service,
            size,
            date,
            message
        });

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

// Ruta para el cotizador (desde cotizador.html)
router.post('/quote', upload.array('attachments'), async (req, res) => {
    try {
        const { to, cc, service, datos } = req.body;

        // Validar datos
        if (!datos) {
            return res.status(400).json({
                success: false,
                message: 'Datos requeridos no proporcionados'
            });
        }

        let datosCompletos;
        try {
            datosCompletos = JSON.parse(datos);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error al procesar los datos JSON'
            });
        }

        // Validar y procesar archivos adjuntos
        let processedAttachments = [];
        if (req.files && req.files.length > 0) {
            try {
                processedAttachments = req.files.map(file => {
                    EmailService.validateAttachment(file);
                    return {
                        content: file.buffer,
                        filename: file.originalname,
                        type: file.mimetype,
                        disposition: 'attachment'
                    };
                });
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }

        console.log('Enviando email con:', {
            to,
            cc,
            attachmentsCount: processedAttachments.length,
            service
        });

        const emailContent = quotationTemplate(datosCompletos);

        await EmailService.sendEmail({
            to: to || 'info.todocr@gmail.com',
            cc: cc ? [cc] : [],
            subject: `Cotización TODOCR: ${service}`,
            html: emailContent.html,
            text: emailContent.text,
            attachments: processedAttachments
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error detallado en ruta /quote:', error);

        // Determinar el tipo de error y establecer el mensaje apropiado
        let errorMessage = 'Error al enviar la cotización';
        let statusCode = 500;

        if (error.message.includes('tamaño total')) {
            errorMessage = error.message;
            statusCode = 400;
        } else if (error.message.includes('Tipo de archivo')) {
            errorMessage = error.message;
            statusCode = 400;
        } else if (error.response?.body?.errors) {
            errorMessage = error.response.body.errors
                .map(err => err.message)
                .join('. ');
        }

        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            debug: process.env.NODE_ENV === 'development' ? {
                error: error.message,
                stack: error.stack
            } : undefined
        });
    }
});



// Ruta para el reporte de limpieza (desde reporte.html)
router.post('/cleaning-report', upload.array('images'), async (req, res) => {
    try {
        const { type, date, tasks, comments } = req.body;

        // Validar campos requeridos
        if (!type || !date || !tasks) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        let parsedTasks;
        try {
            parsedTasks = JSON.parse(tasks);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error al procesar las tareas'
            });
        }

        // Procesar archivos adjuntos
        let processedAttachments = [];
        if (req.files && req.files.length > 0) {
            try {
                processedAttachments = req.files.map(file => {
                    EmailService.validateAttachment(file);
                    return {
                        content: file.buffer,
                        filename: file.originalname || `imagen${Date.now()}.jpg`,
                        type: file.mimetype,
                        disposition: 'attachment'
                    };
                });
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }

        const emailContent = reportTemplate({
            type,
            date,
            tasks: parsedTasks,
            comments
        });

        console.log('Enviando reporte con:', {
            type,
            date,
            attachmentsCount: processedAttachments.length
        });

        await EmailService.sendEmail({
            to: process.env.REPORTS_EMAIL || 'info.todocr@gmail.com',
            subject: `Reporte de limpieza - ${type} - ${date}`,
            html: emailContent.html,
            text: emailContent.text,
            attachments: processedAttachments
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error en cleaning-report:', error);

        let errorMessage = 'Error al enviar el reporte';
        let statusCode = 500;

        if (error.message.includes('tamaño total')) {
            errorMessage = error.message;
            statusCode = 400;
        } else if (error.message.includes('Tipo de archivo')) {
            errorMessage = error.message;
            statusCode = 400;
        }

        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            debug: process.env.NODE_ENV === 'development' ? {
                error: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

module.exports = router;