const API_CONFIG = {
    // BASE_URL: 'http://localhost:3000',
    BASE_URL: 'https://todocr.com/',
};

// cotizador.js
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar iconos Feather
    feather.replace();

    // Establecer la fecha actual
    document.getElementById('fechaCotizacion').value = formatearFecha(new Date());

    // Agregar listeners a los botones
    document.getElementById('agregarServicio').addEventListener('click', agregarServicio);
    document.getElementById('agregarMaterial').addEventListener('click', agregarMaterial);
    document.getElementById('enviarWhatsapp').addEventListener('click', enviarPorWhatsapp);
    document.getElementById('enviarEmail').addEventListener('click', enviarPorEmail);
    document.getElementById('exportarPDF').addEventListener('click', exportarPDF);
});

// Variables para controlar los elementos
let servicios = [];
let materiales = [];

// Formato de moneda
const formatoMoneda = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0
});

// Formatear fecha (YYYY-MM-DD)
function formatearFecha(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

// Funciones para gestionar servicios
function agregarServicio() {
    const nuevoServicio = {
        id: Date.now(),
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        total: 0
    };

    servicios.push(nuevoServicio);
    renderizarServicios();
    calcularTotales();
}

function eliminarServicio(id) {
    servicios = servicios.filter(servicio => servicio.id !== id);
    renderizarServicios();
    calcularTotales();
}

function actualizarServicio(id, campo, valor) {
    const servicio = servicios.find(s => s.id === id);
    if (servicio) {
        servicio[campo] = valor;

        // Recalcular el total de este servicio
        if (campo === 'cantidad' || campo === 'precioUnitario') {
            servicio.total = servicio.cantidad * servicio.precioUnitario;

            // Actualizar visualmente el total en la fila correspondiente
            const fila = document.querySelector(`tr[data-servicio-id="${id}"]`);
            if (fila) {
                const celdaTotal = fila.querySelector('.celda-total');
                if (celdaTotal) {
                    celdaTotal.textContent = formatoMoneda.format(servicio.total);
                }
            }
        }

        calcularTotales();
    }
}

function renderizarServicios() {
    const tbody = document.getElementById('serviciosBody');
    tbody.innerHTML = '';

    servicios.forEach(servicio => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.setAttribute('data-servicio-id', servicio.id);
        tr.innerHTML = `
            <td class="py-2">
                <input type="text" class="w-full p-1 border rounded" 
                       value="${servicio.descripcion}" 
                       onchange="actualizarServicio(${servicio.id}, 'descripcion', this.value)">
            </td>
            <td class="py-2">
                <input type="number" class="w-full p-1 border rounded text-center" 
                       value="${servicio.cantidad}" min="1" 
                       oninput="actualizarServicio(${servicio.id}, 'cantidad', parseInt(this.value) || 1)">
            </td>
            <td class="py-2">
                <input type="number" class="w-full p-1 border rounded text-center" 
                       value="${servicio.precioUnitario}" min="0" 
                       oninput="actualizarServicio(${servicio.id}, 'precioUnitario', parseFloat(this.value) || 0)">
            </td>
            <td class="py-2 text-center celda-total">
                ${formatoMoneda.format(servicio.total)}
            </td>
            <td class="py-2 text-center">
                <button class="text-red-500 hover:text-red-700" onclick="eliminarServicio(${servicio.id})">
                    <i data-feather="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Reinicializar iconos Feather en las nuevas filas
    feather.replace();
}

// Funciones para gestionar materiales
function agregarMaterial() {
    const nuevoMaterial = {
        id: Date.now(),
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        total: 0
    };

    materiales.push(nuevoMaterial);
    renderizarMateriales();
    calcularTotales();
}

function eliminarMaterial(id) {
    materiales = materiales.filter(material => material.id !== id);
    renderizarMateriales();
    calcularTotales();
}

function actualizarMaterial(id, campo, valor) {
    const material = materiales.find(m => m.id === id);
    if (material) {
        material[campo] = valor;

        // Recalcular el total de este material
        if (campo === 'cantidad' || campo === 'precioUnitario') {
            material.total = material.cantidad * material.precioUnitario;

            // Actualizar visualmente el total en la fila correspondiente
            const fila = document.querySelector(`tr[data-material-id="${id}"]`);
            if (fila) {
                const celdaTotal = fila.querySelector('.celda-total');
                if (celdaTotal) {
                    celdaTotal.textContent = formatoMoneda.format(material.total);
                }
            }
        }

        calcularTotales();
    }
}

function renderizarMateriales() {
    const tbody = document.getElementById('matBody');
    tbody.innerHTML = '';

    materiales.forEach(material => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.setAttribute('data-material-id', material.id);
        tr.innerHTML = `
            <td class="py-2">
                <input type="text" class="w-full p-1 border rounded" 
                       value="${material.descripcion}" 
                       onchange="actualizarMaterial(${material.id}, 'descripcion', this.value)">
            </td>
            <td class="py-2">
                <input type="number" class="w-full p-1 border rounded text-center" 
                       value="${material.cantidad}" min="1" 
                       oninput="actualizarMaterial(${material.id}, 'cantidad', parseInt(this.value) || 1)">
            </td>
            <td class="py-2">
                <input type="number" class="w-full p-1 border rounded text-center" 
                       value="${material.precioUnitario}" min="0" 
                       oninput="actualizarMaterial(${material.id}, 'precioUnitario', parseFloat(this.value) || 0)">
            </td>
            <td class="py-2 text-center celda-total">
                ${formatoMoneda.format(material.total)}
            </td>
            <td class="py-2 text-center">
                <button class="text-red-500 hover:text-red-700" onclick="eliminarMaterial(${material.id})">
                    <i data-feather="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Reinicializar iconos Feather en las nuevas filas
    feather.replace();
}

// Función para calcular los totales
function calcularTotales() {
    const totalServicios = servicios.reduce((sum, servicio) => sum + servicio.total, 0);
    const totalMateriales = materiales.reduce((sum, material) => sum + material.total, 0);
    const subtotal = totalServicios + totalMateriales;
    const iva = subtotal * 0.13; // 13% IVA
    const total = subtotal + iva;

    // Actualizar los totales en el HTML
    document.getElementById('subtotalServicios').textContent = formatoMoneda.format(totalServicios);
    document.getElementById('subtotalMateriales').textContent = formatoMoneda.format(totalMateriales);
    document.getElementById('resumenServicios').textContent = formatoMoneda.format(totalServicios);
    document.getElementById('resumenMateriales').textContent = formatoMoneda.format(totalMateriales);
    document.getElementById('subtotal').textContent = formatoMoneda.format(subtotal);
    document.getElementById('iva').textContent = formatoMoneda.format(iva);
    document.getElementById('totalGeneral').textContent = formatoMoneda.format(total);
}

// Función para mostrar notificación de error
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.querySelector('.error-text').textContent = mensaje;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Función para mostrar notificación de éxito
function mostrarExito(mensaje = 'Operación completada con éxito') {
    const successDiv = document.getElementById('successMessage');
    successDiv.querySelector('.success-text').textContent = mensaje;
    successDiv.classList.remove('hidden');
    setTimeout(() => {
        successDiv.classList.add('hidden');
    }, 3000);
}

// Función para mostrar pantalla de carga
function mostrarCarga() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

// Función para ocultar pantalla de carga
function ocultarCarga() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

// Función para validar datos básicos
function validarDatos() {
    const nombre = document.getElementById('clienteNombre').value.trim();
    const telefono = document.getElementById('clienteTelefono').value.trim();

    if (!nombre) {
        mostrarError('El nombre del cliente es obligatorio');
        return false;
    }

    if (!telefono) {
        mostrarError('El teléfono del cliente es obligatorio');
        return false;
    }

    if (servicios.length === 0) {
        mostrarError('Debe agregar al menos un servicio');
        return false;
    }

    return true;
}

// Función para preparar texto de la cotización
function prepararTextoCotizacion() {
    const nombre = document.getElementById('clienteNombre').value.trim();
    const fecha = document.getElementById('fechaCotizacion').value;
    const comentarios = document.getElementById('comentarios').value.trim();

    let totalServicios = 0;
    servicios.forEach(s => totalServicios += s.total);

    let totalMateriales = 0;
    materiales.forEach(m => totalMateriales += m.total);

    const subtotal = totalServicios + totalMateriales;
    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    let texto = `*COTIZACIÓN TODOCR*\n\n`;
    texto += `*Cliente:* ${nombre}\n`;
    texto += `*Fecha:* ${fecha}\n\n`;

    texto += `*SERVICIOS:*\n`;
    servicios.forEach(s => {
        texto += `- ${s.descripcion} (${s.cantidad} x ${formatoMoneda.format(s.precioUnitario)}) = ${formatoMoneda.format(s.total)}\n`;
    });
    texto += `*Total Servicios:* ${formatoMoneda.format(totalServicios)}\n\n`;

    if (materiales.length > 0) {
        texto += `*MATERIALES:*\n`;
        materiales.forEach(m => {
            texto += `- ${m.descripcion} (${m.cantidad} x ${formatoMoneda.format(m.precioUnitario)}) = ${formatoMoneda.format(m.total)}\n`;
        });
        texto += `*Total Materiales:* ${formatoMoneda.format(totalMateriales)}\n\n`;
    }

    texto += `*Subtotal:* ${formatoMoneda.format(subtotal)}\n`;
    texto += `*IVA (13%):* ${formatoMoneda.format(iva)}\n`;
    texto += `*TOTAL:* ${formatoMoneda.format(total)}\n\n`;

    if (comentarios) {
        texto += `*Observaciones:*\n${comentarios}\n\n`;
    }

    texto += `Gracias por confiar en TODOCR.`;

    return texto;
}

// Función para enviar por WhatsApp
function enviarPorWhatsapp() {
    if (!validarDatos()) return;

    const telefono = document.getElementById('clienteTelefono').value.trim();
    // Limpiar el teléfono (eliminar guiones, espacios, etc.)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    const texto = prepararTextoCotizacion();

    // Codificar el texto para URL
    const textoEncodificado = encodeURIComponent(texto);

    // Crear el enlace de WhatsApp (usa API para WhatsApp Web en navegadores de escritorio)
    const urlWhatsapp = `https://wa.me/${telefonoLimpio}?text=${textoEncodificado}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(urlWhatsapp, '_blank');
}

// Función para enviar por Email
function enviarPorEmail() {
    if (!validarDatos()) return;

    const email = document.getElementById('clienteEmail').value.trim();

    if (!email) {
        mostrarError('El correo electrónico es obligatorio para enviar por email');
        return;
    }

    // En un entorno real, aquí se enviaría la solicitud al servidor para procesar el email
    // Para esta demostración, solo mostraremos un mensaje de éxito
    mostrarCarga();

    setTimeout(() => {
        ocultarCarga();
        mostrarExito('Cotización enviada por email correctamente');
    }, 2000);
}

// Función para exportar a PDF

function exportarPDF() {
    if (!validarDatos()) return;
    mostrarCarga();

    try {
        // Obtener datos de la cotización
        const nombreCliente = document.getElementById('clienteNombre').value.trim();
        const emailCliente = document.getElementById('clienteEmail').value.trim();
        const telefonoCliente = document.getElementById('clienteTelefono').value.trim();
        const fechaCotizacion = document.getElementById('fechaCotizacion').value;
        const comentarios = document.getElementById('comentarios').value.trim();

        const totalServicios = servicios.reduce((sum, s) => sum + s.total, 0);
        const totalMateriales = materiales.reduce((sum, m) => sum + m.total, 0);
        const subtotal = totalServicios + totalMateriales;
        const iva = subtotal * 0.13;
        const total = subtotal + iva;

        // Crear una nueva ventana para el PDF
        const newWindow = window.open('', '_blank');

        if (!newWindow) {
            mostrarError('Por favor, permite las ventanas emergentes para generar el PDF');
            ocultarCarga();
            return;
        }

        // Escribir el HTML en la nueva ventana
        newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cotización TODOCR - ${nombreCliente}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
            body {
                font-family: Arial, Helvetica, sans-serif;
                padding: 20px;
                background-color: #f3f4f6;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 24px rgba(0, 0, 0, .06);
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
            }
            th, td {
                border: 1px solid #e5e7eb;
                padding: 8px 12px;
            }
            th {
                background-color: #1E88C7;
                color: white;
                text-align: left;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .logo {
                height: 140px;
            }
            .client-info {
                margin-bottom: 20px;
            }
            .total-section {
                text-align: right;
                margin-top: 20px;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border-top: 1px solid #e5e7eb;
                padding-top: 15px;
            }
            .button {
                background-color: #1E88C7;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 12px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
                font-weight: bold;
            }
            .button:hover {
                background-color: #1a75ab;
            }
            .center {
                text-align: center;
            }
            h1, h2 {
                font-weight: bold;
            }
            .observaciones {
                background-color: #f9fafb;
                border-left: 4px solid #E8A62B;
                padding: 15px;
                margin-bottom: 20px;
            }
            /* Evitar que el pie de página se corte */
            @media print {
                .footer {
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    background: white;
                }
                .content-wrapper {
                    margin-bottom: 80px; /* Espacio para el footer */
                }
            }
        </style>
    </head>
    <body>
        <div class="container" id="pdf-container">
            <div id="pdf-content" class="content-wrapper">
                <!-- Logo y encabezado -->
                <div class="header">
                    <img src="logotodocrmini.png" alt="TODOCR Logo" class="logo">
                    <div style="text-align: right;">
                        <p><strong>TODOCR | COTIZACIÓN</strong></p>
                        <p>Limpieza y Jardinería</p>
                        <p>Tel: +506 7080 8613</p>
                        <p>Email: info.todocr@gmail.com</p>
                    </div>
                </div>

                <!-- Datos cliente -->
                <div class="client-info">
                    <h1 style="font-size: 20px;">Cotización ${nombreCliente}</h1>
                    <p style="color: #4b5563; font-size: 14px;">Contacto: ${nombreCliente}</p>
                    ${emailCliente ? `<p style="color: #4b5563; font-size: 14px;">Email: ${emailCliente}</p>` : ''}
                    <p style="color: #4b5563; font-size: 14px;">Tel: ${telefonoCliente}</p>
                    <p style="color: #4b5563; font-size: 14px;">Fecha: ${new Date(fechaCotizacion).toLocaleDateString('es-CR')}</p>
                </div>

                <!-- Servicios -->
                ${servicios.length > 0 ? `
                    <h2 style="color: #1E88C7; font-size: 16px; margin-top: 20px;">SERVICIOS</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th style="text-align: center;">Cantidad</th>
                                <th style="text-align: center;">Precio Unitario</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${servicios.map((s, index) => `
                                <tr>
                                    <td>${s.descripcion || 'Sin descripción'}</td>
                                    <td style="text-align: center;">${s.cantidad}</td>
                                    <td style="text-align: right;">${formatoMoneda.format(s.precioUnitario)}</td>
                                    <td style="text-align: right;">${formatoMoneda.format(s.total)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="text-align: right; margin-bottom: 15px;">
                        <strong>Total Servicios:</strong> ${formatoMoneda.format(totalServicios)}
                    </div>
                ` : ''}

                <!-- Materiales -->
                ${materiales.length > 0 ? `
                    <h2 style="color: #1E88C7; font-size: 16px; margin-top: 20px;">MATERIALES/INSUMOS</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th style="text-align: center;">Cantidad</th>
                                <th style="text-align: right;">Precio Unitario</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${materiales.map((m, index) => `
                                <tr>
                                    <td>${m.descripcion || 'Sin descripción'}</td>
                                    <td style="text-align: center;">${m.cantidad}</td>
                                    <td style="text-align: right;">${formatoMoneda.format(m.precioUnitario)}</td>
                                    <td style="text-align: right;">${formatoMoneda.format(m.total)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="text-align: right; margin-bottom: 15px;">
                        <strong>Total Materiales:</strong> ${formatoMoneda.format(totalMateriales)}
                    </div>
                ` : ''}

                <!-- Comentarios -->
                ${comentarios ? `
                    <h2 style="color: #1E88C7; font-size: 16px; margin-top: 20px;">OBSERVACIONES</h2>
                    <div class="observaciones">
                    ${comentarios.replace(/\n/g, '<br>')}
                    </div>
                ` : ''}

                <!-- Totales -->
                <div class="total-section">
                    <p>Subtotal: <strong>${formatoMoneda.format(subtotal)}</strong></p>
                    <p>IVA (13%): <strong>${formatoMoneda.format(iva)}</strong></p>
                    <p style="font-size: 18px; font-weight: bold; color: #1E88C7;">
                        Total: ${formatoMoneda.format(total)}
                    </p>
                </div>
            </div>

            <!-- Footer - Fuera del div principal para evitar que se corte -->
            <div class="footer" id="pdf-footer">
                <p>TOMATO COSTA RICA ANY SRL · Cédula Jurídica: 3102816296 · www.todocr.com</p>
                <p style="margin-top: 8px;">© ${new Date().getFullYear()} TODOCR · Poás, Alajuela, Costa Rica</p>
            </div>

            <!-- Botón para generar PDF -->
            <div class="center" style="margin-top: 40px;">
                <button id="download-pdf" class="button">
                    Descargar PDF
                </button>
            </div>
        </div>

        <script>
            // Precargar la imagen del logo
            function precargarImagen(url) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.warn('No se pudo cargar la imagen:', url);
                        resolve(); // Continuar incluso si falla
                    };
                    img.src = url;
                });
            }

            // Esperar a que la página se cargue completamente
            window.onload = function() {
                // Precargar el logo
                precargarImagen('logotodocrmini.png')
                .then(() => {
                    console.log('Imagen precargada, esperando para generar PDF...');
                    // Esperar un poco más para asegurarse de que todo está renderizado
                    setTimeout(function() {
                        // Configurar el botón de descarga
                        document.getElementById('download-pdf').addEventListener('click', generarPDF);
                        
                        // Llamar automáticamente después de un tiempo
                        setTimeout(function() {
                            console.log('Iniciando generación automática del PDF');
                            generarPDF();
                        }, 1000);
                    }, 1000);
                });
            };

            function generarPDF() {
                // Ocultar el botón antes de generar el PDF
                document.getElementById('download-pdf').style.display = 'none';
                
                // Opciones para html2pdf
                const opt = {
                    margin: 10,
                    filename: 'Cotizacion_TODOCR_${nombreCliente.replace(/\s+/g, '_')}.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true,
                        logging: true
                    },
                    jsPDF: { 
                        unit: 'mm', 
                        format: 'a4', 
                        orientation: 'portrait',
                    }
                };
                
                // Crear una versión combinada del contenido y el footer para el PDF
                const content = document.getElementById('pdf-content');
                const footer = document.getElementById('pdf-footer');
                
                // Generar el PDF
                html2pdf()
                    .from(document.getElementById('pdf-container'))
                    .set(opt)
                    .save()
                    .catch(err => {
                        console.error('Error generando PDF:', err);
                    });
            }
        </script>
    </body>
    </html>
        `);

        // Cerrar el documento para finalizar la escritura
        newWindow.document.close();

        // Ocultar pantalla de carga después de un tiempo
        setTimeout(() => {
            ocultarCarga();
            mostrarExito('Vista previa de PDF generada correctamente');
        }, 2500);

    } catch (error) {
        console.error('Error al preparar los datos para el PDF:', error);
        ocultarCarga();
        mostrarError('Error al generar el PDF: ' + error.message);
    }
}

// Exponer funciones necesarias globalmente
window.actualizarServicio = actualizarServicio;
window.eliminarServicio = eliminarServicio;
window.actualizarMaterial = actualizarMaterial;
window.eliminarMaterial = eliminarMaterial;