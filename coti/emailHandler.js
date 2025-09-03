class EmailHandler {
    constructor() {
        this.initializeConfig();
    }

    initializeConfig() {
        this.API_CONFIG = {
            // BASE_URL: 'http://localhost:3000',
            BASE_URL: 'https://todocr.com/',
            ENDPOINTS: {
                QUOTE: '/api/email/quote-new'
            }
        };
    }

    // Mostrar notificación
    mostrarNotificacion(tipo, mensaje) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = mensaje;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Mostrar/ocultar pantalla de carga
    mostrarCarga(mostrar = true) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('hidden', !mostrar);
        }
    }

    // Validar campos requeridos
    validarDatos() {
        const nombre = document.getElementById('clienteNombre').value.trim();
        const email = document.getElementById('clienteEmail').value.trim();
        const telefono = document.getElementById('clienteTelefono').value.trim();

        if (!nombre) {
            this.mostrarNotificacion('error', 'El nombre del cliente es obligatorio');
            return false;
        }

        if (!telefono) {
            this.mostrarNotificacion('error', 'El teléfono del cliente es obligatorio');
            return false;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.mostrarNotificacion('error', 'El correo electrónico es obligatorio y debe ser válido');
            return false;
        }

        // Validar que haya al menos un servicio
        const serviciosBody = document.getElementById('serviciosBody');
        if (!serviciosBody || serviciosBody.children.length === 0) {
            this.mostrarNotificacion('error', 'Debe agregar al menos un servicio');
            return false;
        }

        return true;
    }

    // Recopilar datos del formulario
    recopilarDatos() {
        // Datos del cliente
        const cliente = {
            nombre: document.getElementById('clienteNombre').value.trim(),
            email: document.getElementById('clienteEmail').value.trim(),
            telefono: document.getElementById('clienteTelefono').value.trim()
        };

        // Fecha de la cotización
        const fecha = document.getElementById('fechaCotizacion').value;

        // Recopilar servicios
        const servicios = [];
        const serviciosBody = document.getElementById('serviciosBody');
        if (serviciosBody) {
            const filas = serviciosBody.querySelectorAll('tr');
            filas.forEach(fila => {
                const id = fila.getAttribute('data-servicio-id');
                if (id) {
                    const inputs = fila.querySelectorAll('input');
                    const total = fila.querySelector('.celda-total');

                    servicios.push({
                        id,
                        descripcion: inputs[0].value,
                        cantidad: parseInt(inputs[1].value) || 1,
                        precioUnitario: parseFloat(inputs[2].value) || 0,
                        total: parseFloat(total.textContent.replace(/[^0-9.-]+/g, '')) || 0
                    });
                }
            });
        }

        // Recopilar materiales
        const materiales = [];
        const matBody = document.getElementById('matBody');
        if (matBody) {
            const filas = matBody.querySelectorAll('tr');
            filas.forEach(fila => {
                const id = fila.getAttribute('data-material-id');
                if (id) {
                    const inputs = fila.querySelectorAll('input');
                    const total = fila.querySelector('.celda-total');

                    materiales.push({
                        id,
                        descripcion: inputs[0].value,
                        cantidad: parseInt(inputs[1].value) || 1,
                        precioUnitario: parseFloat(inputs[2].value) || 0,
                        total: parseFloat(total.textContent.replace(/[^0-9.-]+/g, '')) || 0
                    });
                }
            });
        }

        // Totales
        const subtotalServicios = servicios.reduce((sum, s) => sum + s.total, 0);
        const subtotalMateriales = materiales.reduce((sum, m) => sum + m.total, 0);
        const subtotal = subtotalServicios + subtotalMateriales;
        const iva = subtotal * 0.13;
        const total = subtotal + iva;

        // Comentarios
        const comentarios = document.getElementById('comentarios').value.trim();

        return {
            cliente,
            fecha,
            servicios,
            materiales,
            totales: {
                subtotalServicios,
                subtotalMateriales,
                subtotal,
                iva,
                total
            },
            comentarios
        };
    }

    async enviarEmail() {
        if (!this.validarDatos()) return;

        try {
            this.mostrarCarga(true);
            const datos = this.recopilarDatos();

            // Preparar FormData para el envío
            const formData = new FormData();
            formData.append('datos', JSON.stringify(datos));
            formData.append('to', datos.cliente.email);
            formData.append('cc', 'info.todocr@gmail.com');
            formData.append('service', 'Cotización - Nuevo Cotizador');

            // Procesar imágenes si existen
            if (window.imageHandler && typeof window.imageHandler.getImages === 'function') {
                const images = window.imageHandler.getImages();

                if (images && images.length > 0) {
                    console.log(`Adjuntando ${images.length} imágenes`);

                    for (const file of images) {
                        try {
                            // Comprimir la imagen antes de enviarla si es posible
                            let fileToUpload = file;
                            if (typeof window.imageHandler.compressImage === 'function') {
                                fileToUpload = await window.imageHandler.compressImage(file);
                            }
                            formData.append('attachments', fileToUpload, file.name);
                        } catch (error) {
                            console.error('Error procesando imagen:', error);
                        }
                    }
                }
            }

            console.log('Enviando solicitud...');
            const response = await fetch(
                `${this.API_CONFIG.BASE_URL}${this.API_CONFIG.ENDPOINTS.QUOTE}`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error HTTP: ${response.status}`);
            }

            if (data.success) {
                this.mostrarNotificacion('success', 'Cotización enviada exitosamente por email');
                // Opcional: limpiar el formulario después del envío exitoso
                // this.limpiarFormulario();
            } else {
                throw new Error(data.message || 'Error al enviar la cotización');
            }
        } catch (error) {
            console.error('Error al enviar email:', error);
            this.mostrarNotificacion('error', `Error al enviar la cotización: ${error.message}`);
        } finally {
            this.mostrarCarga(false);
        }
    }

    // Formatear mensaje para WhatsApp
    formatearMensajeWhatsApp(datos) {
        const formatNumber = (num) => Math.round(num).toLocaleString('es-CR');

        // Formatear lista de servicios
        let serviciosText = '*Servicios:*\n';
        datos.servicios.forEach(s => {
            serviciosText += `• ${s.descripcion}: ${s.cantidad} x ₡${formatNumber(s.precioUnitario)} = ₡${formatNumber(s.total)}\n`;
        });

        // Formatear lista de materiales si existen
        let materialesText = '';
        if (datos.materiales && datos.materiales.length > 0) {
            materialesText = [
                '*Materiales:*',
                ...datos.materiales.map(mat =>
                    `• ${mat.descripcion}: ${mat.cantidad} x ₡${formatNumber(mat.precioUnitario)} = ₡${formatNumber(mat.total)}`
                )
            ].join('\n');
        }

        // Comprobar si hay imágenes adjuntas
        let imagenesText = '';
        if (window.imageHandler && typeof window.imageHandler.getImages === 'function') {
            const images = window.imageHandler.getImages();
            if (images && images.length > 0) {
                imagenesText = `\n*Imágenes adjuntas:* ${images.length} imágenes`;
            }
        }

        const partes = [
            '*TODOCR - Nueva Cotización*',
            '',
            '*Información del Cliente*',
            `*Nombre:* ${datos.cliente.nombre}`,
            `*Teléfono:* ${datos.cliente.telefono}`,
            `*Email:* ${datos.cliente.email}`,
            '',
            '*Detalles de la Cotización*',
            `*Fecha:* ${datos.fecha}`,
            '',
            serviciosText,
            '',
            materialesText,
            '',
            '*Resumen Final*',
            `*Subtotal Servicios:* ₡${formatNumber(datos.totales.subtotalServicios)}`,
            datos.materiales.length > 0 ? `*Subtotal Materiales:* ₡${formatNumber(datos.totales.subtotalMateriales)}` : '',
            `*Subtotal:* ₡${formatNumber(datos.totales.subtotal)}`,
            `*IVA (13%):* ₡${formatNumber(datos.totales.iva)}`,
            `*Total:* ₡${formatNumber(datos.totales.total)}`,
            '',
            imagenesText,
            '',
            datos.comentarios ? '*Observaciones:*' : '',
            datos.comentarios || ''
        ];

        return partes.filter(Boolean).join('\n');
    }

    enviarWhatsApp() {
        if (!this.validarDatos()) return;

        try {
            const datos = this.recopilarDatos();
            const mensaje = this.formatearMensajeWhatsApp(datos);

            // Obtener y formatear el número del cliente
            let numeroCliente = datos.cliente.telefono
                .replace(/\D/g, '')
                .replace(/^0+/, '');

            // Asegurarse que el número tenga el formato correcto
            if (!numeroCliente.startsWith('506')) {
                numeroCliente = '506' + numeroCliente;
            }

            const url = `https://wa.me/${numeroCliente}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al enviar WhatsApp:', error);
            this.mostrarNotificacion('error', 'Error al abrir WhatsApp');
        }
    }

    // Limpiar formulario
    limpiarFormulario() {
        // Limpiar datos del cliente
        document.getElementById('clienteNombre').value = '';
        document.getElementById('clienteEmail').value = '';
        document.getElementById('clienteTelefono').value = '';

        // Restablecer fecha
        document.getElementById('fechaCotizacion').value = formatearFecha(new Date());

        // Limpiar servicios
        const serviciosBody = document.getElementById('serviciosBody');
        if (serviciosBody) {
            serviciosBody.innerHTML = '';
        }

        // Limpiar materiales
        const matBody = document.getElementById('matBody');
        if (matBody) {
            matBody.innerHTML = '';
        }

        // Limpiar comentarios
        document.getElementById('comentarios').value = '';

        // Limpiar imágenes
        if (window.imageHandler && typeof window.imageHandler.clearImages === 'function') {
            window.imageHandler.clearImages();
        }

        // Restablecer totales
        document.getElementById('subtotalServicios').textContent = '₡0';
        document.getElementById('subtotalMateriales').textContent = '₡0';
        document.getElementById('resumenServicios').textContent = '₡0';
        document.getElementById('resumenMateriales').textContent = '₡0';
        document.getElementById('subtotal').textContent = '₡0';
        document.getElementById('iva').textContent = '₡0';
        document.getElementById('totalGeneral').textContent = '₡0';

        // Función auxiliar para formatear fecha
        function formatearFecha(fecha) {
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            return `${año}-${mes}-${dia}`;
        }
    }
}

// Inicializar el manejador de emails
const emailHandler = new EmailHandler();

// Asignar eventos a los botones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Botón de enviar por email
    const btnEmail = document.getElementById('enviarEmail');
    if (btnEmail) {
        btnEmail.addEventListener('click', () => emailHandler.enviarEmail());
    }

    // Botón de enviar por WhatsApp
    const btnWhatsapp = document.getElementById('enviarWhatsapp');
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', () => emailHandler.enviarWhatsApp());
    }
});

// Exportar para uso global
window.emailHandler = emailHandler;