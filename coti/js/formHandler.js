class FormHandler {
    constructor() {
        this.initializeConfig();
        this.initializeElements();
        this.initializeState();
        this.init();
    }

    initializeConfig() {
        this.API_CONFIG = {
            BASE_URL: 'http://localhost:3000',
            ENDPOINTS: {
                CONTACT: '/api/email/contact'
            },
            WHATSAPP: {
                PHONE: '50670808613'
            }
        };
    }

    initializeElements() {
        const elements = {
            'form': 'calculator-form',
            'totalCotizacion': 'totalCotizacion',
            'totalColones': 'totalColones',
            'nombreCliente': 'nombreCliente',
            'telefonoCliente': 'telefonoCliente',
            'emailCliente': 'emailCliente',
            'direccionTrabajo': 'direccionTrabajo',
            'observaciones': 'observaciones',
            'fechaTrabajo': 'fechaTrabajo',
            'categoria': 'categoria',
            'servicio': 'servicio',
            'area': 'area',
            'horas': 'horas',
            'matBody': 'matBody',
            'montoRecargo': 'montoRecargo',
            'loadingOverlay': 'loading-overlay',
            'preview': 'preview'
        };

        for (const [key, id] of Object.entries(elements)) {
            this[key] = document.getElementById(id);
        }
    }

    initializeState() {
        this.totalUSD = 0;
        this.totalCRC = 0;
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const buttons = {
            'enviarEmail': () => this.enviarEmail(),
            'enviarWhatsApp': () => this.enviarWhatsApp(),
            'descargarPDF': () => this.descargarPDF()
        };

        for (const [id, handler] of Object.entries(buttons)) {
            document.getElementById(id)?.addEventListener('click', handler);
        }

        document.addEventListener('calculoActualizado', (event) => {
            this.totalUSD = event.detail.totalUSD;
            this.totalCRC = event.detail.total;
            this.actualizarTotales();
        });
    }

    actualizarTotales() {
        if (this.totalCotizacion) {
            this.totalCotizacion.textContent = `$${Math.round(this.totalUSD).toLocaleString()}`;
        }
        if (this.totalColones) {
            this.totalColones.textContent = `₡${Math.round(this.totalCRC).toLocaleString()}`;
        }
    }

    validarCamposRequeridos() {
        const camposRequeridos = [
            {
                campo: this.nombreCliente,
                mensaje: 'Nombre del cliente es requerido',
                validacion: (valor) => valor.trim().length >= 2
            },
            {
                campo: this.telefonoCliente,
                mensaje: 'Teléfono es requerido',
                validacion: (valor) => /^[\d\s+()-]{8,}$/.test(valor.trim())
            },
            {
                campo: this.emailCliente,
                mensaje: 'Email es requerido y debe ser válido',
                validacion: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
            },
            {
                campo: this.direccionTrabajo,
                mensaje: 'Dirección es requerida',
                validacion: (valor) => valor.trim().length >= 5
            }
        ];

        return this.realizarValidaciones(camposRequeridos);
    }

    realizarValidaciones(campos) {
        // Limpiar validaciones anteriores
        campos.forEach(({campo}) => {
            campo.classList.remove('invalid');
            const feedback = campo.parentElement.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.classList.add('hidden');
                feedback.textContent = '';
            }
        });

        // Realizar validaciones
        let esValido = true;
        for (const {campo, mensaje, validacion} of campos) {
            const valor = campo.value;
            if (!valor || !validacion(valor)) {
                esValido = false;
                campo.classList.add('invalid');
                const feedback = campo.parentElement.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.textContent = mensaje;
                    feedback.classList.remove('hidden');
                }
                if (esValido === false) {
                    campo.focus();
                }
            }
        }
        return esValido;
    }

    mostrarLoading(mostrar = true) {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.toggle('hidden', !mostrar);
            this.loadingOverlay.classList.toggle('flex', mostrar);
        }
    }

    recopilarDatos() {
        const materiales = Array.from(this.matBody?.getElementsByTagName('tr') || [])
            .map(fila => {
                const celdas = fila.getElementsByTagName('td');
                return {
                    nombre: celdas[0]?.textContent || '',
                    precio: celdas[1]?.textContent || '',
                    cantidad: celdas[2]?.textContent || '',
                    subtotal: celdas[3]?.textContent || ''
                };
            });

        return {
            cliente: {
                nombre: this.nombreCliente?.value || '',
                telefono: this.telefonoCliente?.value || '',
                email: this.emailCliente?.value || '',
                direccion: this.direccionTrabajo?.value || ''
            },
            servicio: {
                categoria: this.categoria?.value || '',
                tipo: this.servicio?.value || '',
                fecha: this.fechaTrabajo?.value || '',
                area: this.area?.value || '',
                horas: this.horas?.value || ''
            },
            materiales,
            observaciones: this.observaciones?.value || '',
            recargo: this.montoRecargo?.value || '0',
            totales: {
                colones: this.totalCRC,
                dolares: this.totalUSD
            }
        };
    }

    async enviarEmail() {
        if (!this.validarCamposRequeridos()) return;

        try {
            this.mostrarLoading(true);
            const datos = this.recopilarDatos();
            const formData = this.prepararFormData(datos);

            const response = await fetch(
                `${this.API_CONFIG.BASE_URL}${this.API_CONFIG.ENDPOINTS.CONTACT}`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                this.mostrarNotificacion('success', 'Cotización enviada exitosamente por email');
                this.limpiarFormulario();
            } else {
                throw new Error(data.message || 'Error al enviar la cotización');
            }
        } catch (error) {
            console.error('Error al enviar email:', error);
            this.mostrarNotificacion('error', `Error al enviar la cotización: ${error.message}`);
        } finally {
            this.mostrarLoading(false);
        }
    }

    prepararFormData(datos) {
        const formData = new FormData();
        const message = this.formatearMensajeEmail(datos);

        // Datos para el email
        formData.append('to', datos.cliente.email);  // Correo del cliente
        formData.append('cc', 'info.todocr@gmail.com');  // Correo CC
        formData.append('name', datos.cliente.nombre);
        formData.append('phone', datos.cliente.telefono);
        formData.append('service', `${datos.servicio.categoria} - ${datos.servicio.tipo}`);
        formData.append('size', datos.servicio.area || datos.servicio.horas);
        formData.append('date', datos.servicio.fecha);
        formData.append('message', message);

        // Procesar imágenes si existe el imageHandler
        if (window.imageHandler && typeof window.imageHandler.getImages === 'function') {
            this.adjuntarImagenes(formData);
        }

        return formData;
    }


    adjuntarImagenes(formData) {
        const imagenes = window.imageHandler.getImages() || [];
        imagenes.forEach((imagen, index) => {
            try {
                if (!imagen || !imagen.src) {
                    console.warn(`Imagen inválida en índice ${index}`);
                    return;
                }

                const blob = this.base64ToBlob(imagen.src);
                if (blob) {
                    formData.append('attachments', blob, `imagen${index + 1}.jpg`);
                }
            } catch (error) {
                console.error('Error procesando imagen:', error);
            }
        });
    }

    base64ToBlob(base64String) {
        if (!base64String || typeof base64String !== 'string') {
            console.warn('String base64 inválido');
            return null;
        }

        try {
            if (base64String instanceof Blob) return base64String;
            if (base64String.startsWith('blob:')) return null;

            const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                console.warn('Formato de string base64 inválido');
                return null;
            }

            const contentType = matches[1];
            const base64 = matches[2];
            const byteCharacters = atob(base64);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);

                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                byteArrays.push(new Uint8Array(byteNumbers));
            }

            return new Blob(byteArrays, { type: contentType });
        } catch (error) {
            console.error('Error convirtiendo base64 a blob:', error);
            return null;
        }
    }

    formatearMensajeEmail(datos) {
        const partes = [
            'Detalles de la Cotización:',
            '',
            `Cliente: ${datos.cliente.nombre}`,
            `Teléfono: ${datos.cliente.telefono}`,
            `Email: ${datos.cliente.email}`,
            `Dirección: ${datos.cliente.direccion}`,
            '',
            `Servicio: ${datos.servicio.categoria} - ${datos.servicio.tipo}`,
            `Fecha: ${new Date(datos.servicio.fecha).toLocaleDateString('es-CR')}`,
            datos.servicio.area ? `Área: ${datos.servicio.area}m²` : '',
            datos.servicio.horas ? `Horas: ${datos.servicio.horas}` : '',
        ];

        // Agregar materiales si existen
        if (datos.materiales.length > 0) {
            partes.push('', 'Materiales:');
            datos.materiales.forEach(material => {
                partes.push(`- ${material.nombre}: ${material.cantidad} x ₡${material.precio}`);
            });
        }

        partes.push(
            '',
            `Total: ₡${Math.round(datos.totales.colones).toLocaleString()} ` +
            `(US$${Math.round(datos.totales.dolares).toLocaleString()})`
        );

        if (datos.observaciones) {
            partes.push('', 'Observaciones:', datos.observaciones);
        }

        return partes.filter(Boolean).join('\n');
    }

    mostrarNotificacion(tipo, mensaje) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = mensaje;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    limpiarFormulario() {
        this.form?.reset();

        // Limpiar imágenes si existe el imageHandler
        if (window.imageHandler && typeof window.imageHandler.clearImages === 'function') {
            window.imageHandler.clearImages();
        }

        // Limpiar la tabla de materiales
        if (this.matBody) {
            this.matBody.innerHTML = '';
        }

        // Limpiar el preview de imágenes
        if (this.preview) {
            this.preview.innerHTML = '';
        }

        // Restablecer totales
        this.totalUSD = 0;
        this.totalCRC = 0;
        this.actualizarTotales();
    }

    enviarWhatsApp() {
        if (!this.validarCamposRequeridos()) return;

        try {
            const datos = this.recopilarDatos();
            const mensaje = this.formatearMensajeWhatsApp(datos);
            const url = `https://wa.me/${this.API_CONFIG.WHATSAPP.PHONE}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al enviar WhatsApp:', error);
            this.mostrarNotificacion('error', 'Error al abrir WhatsApp');
        }
    }

    formatearMensajeWhatsApp(datos) {
        const fecha = new Date(datos.servicio.fecha).toLocaleDateString('es-CR');
        const partes = [
            '*TODOCR - Nueva Cotización*',
            '',
            `*Cliente:* ${datos.cliente.nombre}`,
            `*Teléfono:* ${datos.cliente.telefono}`,
            `*Dirección:* ${datos.cliente.direccion}`,
            '',
            `*Servicio:* ${datos.servicio.categoria} - ${datos.servicio.tipo}`,
            `*Fecha:* ${fecha}`,
            datos.servicio.area ? `*Área:* ${datos.servicio.area}m²` : '',
            datos.servicio.horas ? `*Horas:* ${datos.servicio.horas}` : '',
            '',
            `*Total:* ₡${Math.round(datos.totales.colones).toLocaleString()} ` +
            `(US$${Math.round(datos.totales.dolares).toLocaleString()})`,
            datos.observaciones ? `\n*Observaciones:*\n${datos.observaciones}` : ''
        ];

        return partes.filter(Boolean).join('\n');
    }

    async descargarPDF() {
        if (!this.validarCamposRequeridos()) return;

        try {
            this.mostrarLoading(true);
            const datos = this.recopilarDatos();

            // Simulación de descarga PDF (reemplazar con implementación real)
            await new Promise(resolve => setTimeout(resolve, 1000));
            const blob = new Blob(['PDF simulado'], {type: 'application/pdf'});

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cotizacion.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.mostrarNotificacion('error', 'Error al generar PDF');
        } finally {
            this.mostrarLoading(false);
        }
    }
}

// Inicializar y exportar
const formHandler = new FormHandler();
window.formHandler = formHandler;