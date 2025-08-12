// Template base con estilos y estructura común
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TODOCR</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #ffffff;
        }
        .header {
            background: #dee2e6;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .logo {
            max-width: 200px;
            height: auto;
        }
        .content {
            padding: 30px;
            background: #ffffff;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #ffffff;
        }
        .data-table th, .data-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
            text-align: left;
        }
        .data-table th {
            background: #f8f9fa;
            font-weight: bold;
            color: #495057;
        }
        .message-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            border-left: 4px solid #F4A300;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 14px;
        }
        .total-section {
            background: #1E88C7;
            color: #ffffff;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
            text-align: center;
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.todocr.com/assets/logotodocr.png" alt="TODOCR" class="logo">
        </div>
        ${content}
        <div class="footer">
            <p>TODOCR · Jardinería, Limpieza y Mantenimiento</p>
            <p>Poás, Alajuela, Costa Rica</p>
            <p>WhatsApp: <a href="https://wa.me/50670808613" target="_blank" style="color: #74A643; text-decoration: none;">+506 7080 8613</a></p>
            <p>Email: info.todocr@gmail.com</p>
        </div>
    </div>
</body>
</html>
`;

// Template para el formulario de contacto simple
exports.contactTemplate = (data) => {
    const content = `
        <div class="content">
            <h2 style="color: #74A643; margin-bottom: 20px;">Nuevo Contacto</h2>
            <table class="data-table">
                <tr>
                    <td><strong>Nombre:</strong></td>
                    <td>${data.name}</td>
                </tr>
                <tr>
                    <td><strong>Email:</strong></td>
                    <td>${data.email}</td>
                </tr>
                <tr>
                    <td><strong>Teléfono:</strong></td>
                    <td>${data.phone}</td>
                </tr>
                <tr>
                    <td><strong>Servicio:</strong></td>
                    <td>${data.service}</td>
                </tr>
                <tr>
                    <td><strong>Tamaño:</strong></td>
                    <td>${data.size}</td>
                </tr>
                <tr>
                    <td><strong>Fecha:</strong></td>
                    <td>${data.date}</td>
                </tr>
            </table>
            ${data.message ? `
                <div class="message-box">
                    <strong>Mensaje:</strong><br>
                    ${data.message}
                </div>
            ` : ''}
        </div>
    `;

    return {
        html: baseTemplate(content),
        text: `
            Nuevo Contacto desde Web TODOCR
            ==============================
            Nombre: ${data.name}
            Email: ${data.email}
            Teléfono: ${data.phone}
            Servicio: ${data.service}
            Tamaño: ${data.size}
            Fecha: ${data.date}
            ${data.message ? `\nMensaje:\n${data.message}` : ''}
        `
    };
};

// Template para cotizaciones detalladas
exports.quotationTemplate = (data) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC'
        }).format(amount);
    };

    const content = `
        <div class="content">
            <h2 style="color: #74A643; margin-bottom: 20px;">Cotización de Servicios</h2>
            
            <table class="data-table">
                <tr><th colspan="2">Información del Cliente</th></tr>
                <tr>
                    <td><strong>Nombre:</strong></td>
                    <td>${data.cliente.nombre}</td>
                </tr>
                <tr>
                    <td><strong>Email:</strong></td>
                    <td>${data.cliente.email}</td>
                </tr>
                <tr>
                    <td><strong>Teléfono:</strong></td>
                    <td>${data.cliente.telefono}</td>
                </tr>
                <tr>
                    <td><strong>Dirección:</strong></td>
                    <td>${data.cliente.direccion}</td>
                </tr>
            </table>

            <table class="data-table">
                <tr><th colspan="2">Detalles del Servicio</th></tr>
                <tr>
                    <td><strong>Tipo:</strong></td>
                    <td>${data.servicio.categoria} - ${data.servicio.tipo}</td>
                </tr>
                <tr>
                    <td><strong>Fecha:</strong></td>
                    <td>${new Date(data.servicio.fecha).toLocaleDateString('es-CR')}</td>
                </tr>
                ${data.servicio.area ? `
                    <tr>
                        <td><strong>Área:</strong></td>
                        <td>${data.servicio.area} m²</td>
                    </tr>
                ` : ''}
                <tr>
                    <td><strong>Horas estimadas:</strong></td>
                    <td>${data.servicio.horasEstimadas || 'N/A'}</td>
                </tr>
            </table>

            <table class="data-table">
                <tr><th colspan="2">Desglose de Costos</th></tr>
                <tr>
                    <td><strong>Mano de obra:</strong></td>
                    <td>${formatCurrency(data.costos.manoDeObra)}</td>
                </tr>
                ${data.materiales && data.materiales.length > 0 ? `
                    <tr>
                        <td><strong>Total materiales:</strong></td>
                        <td>${formatCurrency(data.costos.totalMateriales)}</td>
                    </tr>
                ` : ''}
                ${data.costos.desplazamiento ? `
                    <tr>
                        <td><strong>Desplazamiento:</strong></td>
                        <td>${formatCurrency(data.costos.desplazamiento)}</td>
                    </tr>
                ` : ''}
            </table>

            ${data.materiales && data.materiales.length > 0 ? `
                <table class="data-table">
                    <tr><th colspan="4">Detalle de Materiales</th></tr>
                    <tr>
                        <th>Material</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                    ${data.materiales.map(mat => `
                        <tr>
                            <td>${mat.nombre}</td>
                            <td>${mat.cantidad}</td>
                            <td>${formatCurrency(mat.precio)}</td>
                            <td>${formatCurrency(mat.subtotal)}</td>
                        </tr>
                    `).join('')}
                </table>
            ` : ''}

            ${data.observaciones ? `
                <div class="message-box">
                    <strong>Observaciones:</strong><br>
                    ${data.observaciones}
                </div>
            ` : ''}

            <table class="data-table" style="margin-top: 20px;">
                <tr>
                    <td><strong>Sub Total:</strong></td>
                    <td style="text-align: right">${formatCurrency(data.totales.subtotal)}</td>
                </tr>
                <tr>
                    <td><strong>IVA (13%):</strong></td>
                    <td style="text-align: right">${formatCurrency(data.totales.iva)}</td>
                </tr>
                <tr style="background-color: #1E88C7; color: white;">
                    <td><strong>Total:</strong></td>
                    <td style="text-align: right"><strong>${formatCurrency(data.totales.total)}</strong></td>
                </tr>
            </table>

            <div style="text-align: right; margin-top: 10px; font-size: 0.9em; color: #666;">
                <small>(US$ ${Math.round(data.totales.dolares).toLocaleString()})</small>
            </div>
        </div>
    `;

    return {
        html: baseTemplate(content),
        text: `
            Cotización TODOCR
            =================
            INFORMACIÓN DEL CLIENTE
            Nombre: ${data.cliente.nombre}
            Email: ${data.cliente.email}
            Teléfono: ${data.cliente.telefono}
            Dirección: ${data.cliente.direccion}

            DETALLES DEL SERVICIO
            Tipo: ${data.servicio.categoria} - ${data.servicio.tipo}
            Fecha: ${new Date(data.servicio.fecha).toLocaleDateString('es-CR')}
            ${data.servicio.area ? `Área: ${data.servicio.area} m²` : ''}
            Horas estimadas: ${data.servicio.horasEstimadas || 'N/A'}

            DESGLOSE DE COSTOS
            Mano de obra: ${formatCurrency(data.costos.manoDeObra)}
            ${data.materiales && data.materiales.length > 0 ? `Total materiales: ${formatCurrency(data.costos.totalMateriales)}` : ''}
            ${data.costos.desplazamiento ? `Desplazamiento: ${formatCurrency(data.costos.desplazamiento)}` : ''}

            ${data.materiales && data.materiales.length > 0 ? `
            DETALLE DE MATERIALES
            ${data.materiales.map(mat =>
            `${mat.nombre}: ${mat.cantidad} x ${formatCurrency(mat.precio)} = ${formatCurrency(mat.subtotal)}`
        ).join('\n')}
            ` : ''}

            ${data.observaciones ? `\nOBSERVACIONES:\n${data.observaciones}` : ''}

            TOTALES
            Sub Total: ${formatCurrency(data.totales.subtotal)}
            IVA (13%): ${formatCurrency(data.totales.iva)}
            Total: ${formatCurrency(data.totales.total)}
            (US$ ${Math.round(data.totales.dolares).toLocaleString()})
        `
    };
};

// Template para reportes de limpieza
exports.reportTemplate = (data) => {
    const content = `
        <div class="content">
            <h2 style="color: #74A643; margin-bottom: 20px;">Reporte de Limpieza</h2>
            <table class="data-table">
                <tr>
                    <td><strong>Tipo:</strong></td>
                    <td>${data.type}</td>
                </tr>
                <tr>
                    <td><strong>Fecha:</strong></td>
                    <td>${data.date}</td>
                </tr>
            </table>

            <h3>Tareas Completadas:</h3>
            <table class="data-table">
                ${data.tasks.map(task => `
                    <tr>
                        <td>${task.completed ? '✅' : '❌'}</td>
                        <td>${task.text}</td>
                    </tr>
                `).join('')}
            </table>

            ${data.comments ? `
                <div class="message-box">
                    <strong>Comentarios:</strong><br>
                    ${data.comments}
                </div>
            ` : ''}
        </div>
    `;

    return {
        html: baseTemplate(content),
        text: `
            Reporte de Limpieza TODOCR
            =========================
            Tipo: ${data.type}
            Fecha: ${data.date}

            TAREAS COMPLETADAS:
            ${data.tasks.map(task =>
            `${task.completed ? '✓' : '✗'} ${task.text}`
        ).join('\n')}

            ${data.comments ? `\nCOMENTARIOS:\n${data.comments}` : ''}
        `
    };
};