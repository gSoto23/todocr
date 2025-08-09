class FormHandler {
    constructor() {
        // Referencias a elementos del DOM
        this.form = document.getElementById('calculator-form');
        this.totalCotizacion = document.getElementById('totalCotizacion');
        this.totalColones = document.getElementById('totalColones');
        this.nombreCliente = document.getElementById('nombreCliente');
        this.telefonoCliente = document.getElementById('telefonoCliente');
        this.emailCliente = document.getElementById('emailCliente');
        this.direccionTrabajo = document.getElementById('direccionTrabajo');
        this.observaciones = document.getElementById('observaciones');
        this.fechaTrabajo = document.getElementById('fechaTrabajo');
        this.categoria = document.getElementById('categoria');
        this.servicio = document.getElementById('servicio');
        this.area = document.getElementById('area');
        this.horas = document.getElementById('horas');
        this.matBody = document.getElementById('matBody');
        this.montoRecargo = document.getElementById('montoRecargo');
        this.loadingOverlay = document.getElementById('loading-overlay');

        // Valores de la cotización
        this.totalUSD = 0;
        this.totalCRC = 0;

        this.init();
    }

    init() {
        // Event listeners para los botones
        document.getElementById('enviarEmail')?.addEventListener('click', () => this.enviarEmail());
        document.getElementById('enviarWhatsApp')?.addEventListener('click', () => this.enviarWhatsApp());
        document.getElementById('descargarPDF')?.addEventListener('click', () => this.descargarPDF());

        // Listener para actualización de totales
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

        // Limpiar validaciones anteriores
        camposRequeridos.forEach(({ campo }) => {
            campo.classList.remove('invalid');
            const feedback = campo.parentElement.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.classList.add('hidden');
                feedback.textContent = '';
            }
        });

        // Realizar validaciones
        let esValido = true;
        for (const { campo, mensaje, validacion } of camposRequeridos) {
            const valor = campo.value;

            if (!valor || !validacion(valor)) {
                esValido = false;

                // Aplicar estilo de error al campo
                campo.classList.add('invalid');

                // Mostrar mensaje de error
                const feedback = campo.parentElement.querySelector('.invalid-feedback');
                if (feedback) {
                    feedback.textContent = mensaje;
                    feedback.classList.remove('hidden');
                }

                // Si es el primer error, hacer focus en ese campo
                if (esValido === false) {
                    campo.focus();
                }
            }
        }

        return esValido;
    }


    mostrarLoading() {
        this.loadingOverlay?.classList.remove('hidden');
        this.loadingOverlay?.classList.add('flex');
    }

    ocultarLoading() {
        this.loadingOverlay?.classList.add('hidden');
        this.loadingOverlay?.classList.remove('flex');
    }

    recopilarDatos() {
        // Obtener información de materiales
        const materiales = [];
        const filasMateriales = this.matBody?.getElementsByTagName('tr') || [];
        for (const fila of filasMateriales) {
            const celdas = fila.getElementsByTagName('td');
            materiales.push({
                nombre: celdas[0]?.textContent || '',
                precio: celdas[1]?.textContent || '',
                cantidad: celdas[2]?.textContent || '',
                subtotal: celdas[3]?.textContent || ''
            });
        }

        // Crear objeto con todos los datos
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
            materiales: materiales,
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
            this.mostrarLoading();
            const datos = this.recopilarDatos();
            const imagenes = window.imageHandler.getImages();

            // Aquí iría la lógica de envío de email
            console.log('Enviando email...', datos);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

            alert('Email enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar email:', error);
            alert('Error al enviar email');
        } finally {
            this.ocultarLoading();
        }
    }

    enviarWhatsApp() {
        if (!this.validarCamposRequeridos()) return;

        try {
            const datos = this.recopilarDatos();
            const mensaje = this.formatearMensajeWhatsApp(datos);
            const url = `https://wa.me/50670808613?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al enviar WhatsApp:', error);
            alert('Error al abrir WhatsApp');
        }
    }

    formatearMensajeWhatsApp(datos) {
        const fecha = new Date(datos.servicio.fecha).toLocaleDateString('es-CR');
        let mensaje = `*TODOCR - Nueva Cotización*\n\n`;
        mensaje += `*Cliente:* ${datos.cliente.nombre}\n`;
        mensaje += `*Teléfono:* ${datos.cliente.telefono}\n`;
        mensaje += `*Dirección:* ${datos.cliente.direccion}\n\n`;
        mensaje += `*Servicio:* ${datos.servicio.categoria} - ${datos.servicio.tipo}\n`;
        mensaje += `*Fecha:* ${fecha}\n`;

        if (datos.servicio.area) {
            mensaje += `*Área:* ${datos.servicio.area}m²\n`;
        }
        if (datos.servicio.horas) {
            mensaje += `*Horas:* ${datos.servicio.horas}\n`;
        }

        mensaje += `\n*Total:* ₡${Math.round(datos.totales.colones).toLocaleString()} (US$${Math.round(datos.totales.dolares).toLocaleString()})\n`;

        if (datos.observaciones) {
            mensaje += `\n*Observaciones:*\n${datos.observaciones}\n`;
        }

        return mensaje;
    }

    async descargarPDF() {
        if (!this.validarCamposRequeridos()) return;

        try {
            this.mostrarLoading();
            const datos = this.recopilarDatos();

            // Aquí iría la lógica de generación de PDF
            console.log('Generando PDF...', datos);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

            // Simulación de descarga
            const blob = new Blob(['PDF simulado'], { type: 'application/pdf' });
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
            alert('Error al generar PDF');
        } finally {
            this.ocultarLoading();
        }
    }
}

// Inicializar el manejador de formularios
const formHandler = new FormHandler();

// Exportar para uso en otros módulos si es necesario
window.formHandler = formHandler;