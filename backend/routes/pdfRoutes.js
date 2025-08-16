const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');

// Ruta para generar un PDF a partir de datos enviados
router.post('/generate', async (req, res) => {
    try {
        const { datos } = req.body;
        
        if (!datos) {
            return res.status(400).json({
                success: false,
                message: 'Datos requeridos no proporcionados'
            });
        }

        // Parsear los datos si vienen como string
        let datosCompletos;
        try {
            datosCompletos = typeof datos === 'string' ? JSON.parse(datos) : datos;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error al procesar los datos JSON'
            });
        }

        // Generar el PDF
        const pdfBuffer = await generatePDF(datosCompletos);
        
        // Enviar el PDF como respuesta
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Cotizacion_TODOCR_${datosCompletos.cliente.nombre.replace(/\s+/g, '_')}.pdf`,
            'Content-Length': pdfBuffer.length
        });
        
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al generar el PDF'
        });
    }
});

// Función para generar el PDF con Puppeteer
async function generatePDF(datos) {
    const browser = await puppeteer.launch({
        headless: 'new',  // Usar el nuevo modo headless
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ]
    });

    try {
        const page = await browser.newPage();

        // Establecer el contenido HTML
        const htmlContent = generateHTML(datos);
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000  // Aumentar el timeout a 30 segundos
        });

        // Configurar la página
        await page.emulateMediaType('screen');

        // Generar el PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '1cm',
                right: '1cm',
                bottom: '1cm',
                left: '1cm'
            },
            preferCSSPageSize: true
        });

        return pdf;
    } finally {
        await browser.close();
    }
}

// Función para generar el HTML del PDF
function generateHTML(datos) {
    // Formatear valores monetarios
    const formatMoney = (value) => `₡${Math.round(value).toLocaleString('es')}`;
    
    // Colores de marca
    const azulTodocr = '#1E88C7';
    const verdeTodocr = '#74A643';
    
    // Crear tablas de servicios y materiales
    let serviciosHTML = '';
    if (datos.servicios && datos.servicios.length > 0) {
        const serviciosRows = datos.servicios.map((s, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'}">
                <td style="padding: 8px; border: 1px solid #ddd;">${s.descripcion || 'Sin descripción'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.cantidad}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(s.precioUnitario)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(s.total)}</td>
            </tr>
        `).join('');
        
        serviciosHTML = `
            <h2 style="color: ${azulTodocr}; font-size: 18px; margin-top: 20px;">SERVICIOS</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                    <tr style="background-color: ${azulTodocr}; color: white;">
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Descripción</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Precio Unit.</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${serviciosRows}
                    <tr style="background-color: #e9ecef; font-weight: bold;">
                        <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Servicios:</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(datos.totales.subtotalServicios)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    let materialesHTML = '';
    if (datos.materiales && datos.materiales.length > 0) {
        const materialesRows = datos.materiales.map((m, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'}">
                <td style="padding: 8px; border: 1px solid #ddd;">${m.descripcion || 'Sin descripción'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${m.cantidad}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(m.precioUnitario)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(m.total)}</td>
            </tr>
        `).join('');
        
        materialesHTML = `
            <h2 style="color: ${azulTodocr}; font-size: 18px; margin-top: 20px;">MATERIALES/INSUMOS</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                    <tr style="background-color: ${azulTodocr}; color: white;">
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Descripción</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Precio Unit.</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${materialesRows}
                    <tr style="background-color: #e9ecef; font-weight: bold;">
                        <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total Materiales:</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatMoney(datos.totales.subtotalMateriales)}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    // Observaciones
    const observacionesHTML = datos.comentarios ? `
        <h2 style="color: ${azulTodocr}; font-size: 18px; margin-top: 20px;">OBSERVACIONES</h2>
        <div style="background-color: #f8f9fa; border-left: 4px solid #E8A62B; padding: 15px; margin-bottom: 20px;">
            ${datos.comentarios}
        </div>
    ` : '';
    
    // Armar el HTML completo
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cotización TODOCR</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .logo {
                    max-height: 60px;
                }
                .titulo {
                    text-align: center;
                    color: ${azulTodocr};
                    margin: 10px 0;
                }
                .fecha {
                    text-align: center;
                    color: #666;
                    margin-bottom: 20px;
                }
                .cliente {
                    background-color: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                h2 {
                    border-bottom: 2px solid ${azulTodocr};
                    padding-bottom: 5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    background-color: ${azulTodocr};
                    color: white;
                    text-align: left;
                    padding: 8px;
                }
                td {
                    padding: 8px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .totales {
                    margin-top: 20px;
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                }
                .total-final {
                    font-size: 18px;
                    font-weight: bold;
                    color: ${azulTodocr};
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <!-- Modificación aquí: comentar o eliminar la imagen del logo si causa problemas -->
                <!-- <img src="https://www.todocr.com/assets/logotodocrmini.png" alt="TODOCR" class="logo"> -->
                <h1 class="titulo">COTIZACIÓN TODOCR</h1>
            </div>

            
            <div class="fecha">
                Fecha: ${datos.fecha ? new Date(datos.fecha).toLocaleDateString('es-CR') : new Date().toLocaleDateString('es-CR')}
            </div>
            
            <div class="cliente">
                <h2 style="color: ${azulTodocr}; margin-top: 0;">DATOS DEL CLIENTE</h2>
                <p><strong>Nombre:</strong> ${datos.cliente.nombre}</p>
                <p><strong>Email:</strong> ${datos.cliente.email || 'N/A'}</p>
                <p><strong>Teléfono:</strong> ${datos.cliente.telefono}</p>
            </div>
            
            ${serviciosHTML}
            
            ${materialesHTML}
            
            ${observacionesHTML}
            
            <div class="totales">
                <h2 style="color: ${azulTodocr}; margin-top: 0;">RESUMEN</h2>
                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: right; border: none;"><strong>Subtotal:</strong></td>
                        <td style="text-align: right; width: 120px; border: none;">${formatMoney(datos.totales.subtotal)}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right; border: none;"><strong>IVA (13%):</strong></td>
                        <td style="text-align: right; border: none;">${formatMoney(datos.totales.iva)}</td>
                    </tr>
                    <tr class="total-final">
                        <td style="text-align: right; border-top: 2px solid #ddd; padding-top: 10px; border-left: none; border-right: none; border-bottom: none;">
                            <strong>TOTAL:</strong>
                        </td>
                        <td style="text-align: right; border-top: 2px solid #ddd; padding-top: 10px; border-left: none; border-right: none; border-bottom: none;">
                            <strong>${formatMoney(datos.totales.total)}</strong>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="footer">
                <p>TODOCR · Poás, Alajuela, Costa Rica</p>
                <p>WhatsApp: +506 7080 8613 · Email: info.todocr@gmail.com</p>
                <p>© ${new Date().getFullYear()} TODOCR</p>
            </div>
        </body>
        </html>
    `;
}

module.exports = router;
