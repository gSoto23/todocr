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
                QUOTE: '/api/email/quote',
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
            'subtotalColones': 'subtotalColones',
            'ivaColones': 'ivaColones',
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
            if (event.detail) {
                this.totalUSD = event.detail.totalUSD || 0;
                this.totalCRC = event.detail.total || 0;
                this.subtotal = event.detail.subtotal || 0;
                this.iva = event.detail.iva || 0;
            } else {
                this.totalUSD = 0;
                this.totalCRC = 0;
                this.subtotal = 0;
                this.iva = 0;
            }
            this.actualizarTotales();
        });
    }

    actualizarTotales() {
        const formatNumber = (num) => Math.round(num).toLocaleString();

        if (this.subtotalColones) {
            this.subtotalColones.textContent = `₡${formatNumber(this.subtotal)}`;
        }
        if (this.ivaColones) {
            this.ivaColones.textContent = `₡${formatNumber(this.iva)}`;
        }
        if (this.totalColones) {
            this.totalColones.textContent = `₡${formatNumber(this.totalCRC)}`;
        }
        if (this.totalCotizacion) {
            this.totalCotizacion.textContent = `$${Math.round(this.totalUSD).toLocaleString()}`;
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
        // Calcular totales
        const subtotal = this.totalCRC;
        const iva = subtotal * 0.13;
        const total = subtotal + iva;

        // Calcular total de materiales
        const materiales = Array.from(this.matBody?.getElementsByTagName('tr') || [])
            .map(fila => {
                const celdas = fila.getElementsByTagName('td');
                const precio = parseFloat(celdas[1]?.textContent?.replace(/[^0-9.-]+/g, '') || 0);
                const cantidad = parseFloat(celdas[2]?.textContent || 0);
                const subtotal = parseFloat(celdas[3]?.textContent?.replace(/[^0-9.-]+/g, '') || 0);

                return {
                    nombre: celdas[0]?.textContent || '',
                    precio: precio,
                    cantidad: cantidad,
                    subtotal: subtotal
                };
            });

        const totalMateriales = materiales.reduce((sum, mat) => sum + mat.subtotal, 0);

        // Obtener monto de recargo (desplazamiento)
        const montoRecargo = parseFloat(this.montoRecargo?.value || 0);

        // Calcular mano de obra (subtotal - materiales - recargo)
        const manoDeObra = subtotal - totalMateriales - montoRecargo;

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
                horasEstimadas: this.horas?.value || ''
            },
            costos: {
                manoDeObra: manoDeObra,
                totalMateriales: totalMateriales,
                desplazamiento: montoRecargo > 0 ? montoRecargo : null
            },
            materiales: materiales,
            observaciones: this.observaciones?.value || '',
            totales: {
                subtotal: subtotal,
                iva: iva,
                total: total,
                dolares: this.totalUSD
            }
        };
    }

    async enviarEmail() {
        if (!this.validarCamposRequeridos()) return;

        try {
            this.mostrarLoading(true);
            const datos = this.recopilarDatos();

            // Validación adicional de los datos
            if (!datos.cliente || !datos.servicio || !datos.totales) {
                throw new Error('Faltan datos requeridos para la cotización');
            }

            console.log('Preparando FormData...');
            const formData = await this.prepararFormData(datos);

            // Log para verificar el contenido del FormData
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
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

    async prepararFormData(datos) {
        const formData = new FormData();

        // Enviar los datos completos como JSON
        formData.append('datos', JSON.stringify(datos));

        // Datos básicos para el email
        formData.append('to', datos.cliente.email);
        formData.append('cc', 'info.todocr@gmail.com');
        formData.append('service', `${datos.servicio.categoria} - ${datos.servicio.tipo}`);

        // Procesar imágenes
        if (window.imageHandler) {
            const images = window.imageHandler.getImages();
            console.log('Imágenes a adjuntar:', images.length);

            for (const file of images) {
                try {
                    // Opcionalmente comprimir la imagen antes de enviarla
                    const compressedFile = await window.imageHandler.compressImage(file);
                    formData.append('attachments', compressedFile, file.name);
                } catch (error) {
                    console.error('Error procesando imagen:', error);
                }
            }
        }

        return formData;
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
        // Restablecer el formulario
        if (this.form) {
            this.form.reset();
        }

        // Limpiar campos específicos
        const camposALimpiar = [
            'nombreCliente',
            'telefonoCliente',
            'emailCliente',
            'direccionTrabajo',
            'observaciones',
            'fechaTrabajo',
            'area',
            'horas',
            'montoRecargo'
        ];

        camposALimpiar.forEach(campo => {
            if (this[campo]) {
                this[campo].value = '';
            }
        });

        // Restablecer selects
        if (this.categoria) {
            this.categoria.value = '';
            this.categoria.dispatchEvent(new Event('change'));
        }

        if (this.servicio) {
            this.servicio.value = '';
            this.servicio.disabled = true;
        }

        // Deshabilitar campos que deberían estar deshabilitados inicialmente
        if (this.area) this.area.disabled = true;
        if (this.horas) this.horas.disabled = true;
        if (this.fechaTrabajo) this.fechaTrabajo.disabled = true;

        // Limpiar tabla de materiales
        if (this.matBody) {
            this.matBody.innerHTML = '';
        }

        // Limpiar imágenes si existe el imageHandler
        if (window.imageHandler && typeof window.imageHandler.clearImages === 'function') {
            window.imageHandler.clearImages();
        }

        // Limpiar preview de imágenes
        if (this.preview) {
            this.preview.innerHTML = '';
        }

        // Restablecer totales
        this.totalUSD = 0;
        this.totalCRC = 0;
        this.actualizarTotales();

        // Limpiar checkbox y recargo por desplazamiento
        const aplicarRecargo = document.getElementById('aplicarRecargo');
        const zonaRecargo = document.getElementById('zonaRecargo');
        if (aplicarRecargo) {
            aplicarRecargo.checked = false;
        }
        if (zonaRecargo) {
            zonaRecargo.value = '0';
            zonaRecargo.disabled = true;
        }

        // Crear y disparar un evento personalizado con los totales en 0
        const eventoCalculo = new CustomEvent('calculoActualizado', {
            detail: {
                totalUSD: 0,
                total: 0
            }
        });
        document.dispatchEvent(eventoCalculo);
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