
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    // BASE_URL: 'https://todocr.com/',
    ENDPOINTS: {
        QUOTE: '/api/email/quote-new',
        PDF: '/api/pdf/generate'
    }
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
        // Recopilar los datos de la cotización
        const datos = {
            cliente: {
                nombre: document.getElementById('clienteNombre').value.trim(),
                email: document.getElementById('clienteEmail').value.trim(),
                telefono: document.getElementById('clienteTelefono').value.trim()
            },
            fecha: document.getElementById('fechaCotizacion').value,
            servicios: servicios.map(s => ({
                descripcion: s.descripcion,
                cantidad: s.cantidad,
                precioUnitario: s.precioUnitario,
                total: s.total
            })),
            materiales: materiales.map(m => ({
                descripcion: m.descripcion,
                cantidad: m.cantidad,
                precioUnitario: m.precioUnitario,
                total: m.total
            })),
            totales: {
                subtotalServicios: servicios.reduce((sum, s) => sum + s.total, 0),
                subtotalMateriales: materiales.reduce((sum, m) => sum + m.total, 0),
                subtotal: servicios.reduce((sum, s) => sum + s.total, 0) + materiales.reduce((sum, m) => sum + m.total, 0),
                iva: (servicios.reduce((sum, s) => sum + s.total, 0) + materiales.reduce((sum, m) => sum + m.total, 0)) * 0.13,
                total: (servicios.reduce((sum, s) => sum + s.total, 0) + materiales.reduce((sum, m) => sum + m.total, 0)) * 1.13
            },
            comentarios: document.getElementById('comentarios').value.trim()
        };

        // Configurar la solicitud
        fetch(`${API_CONFIG.BASE_URL}/api/pdf/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ datos }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || `Error HTTP: ${response.status}`);
                    });
                }
                return response.blob();
            })
            .then(blob => {
                // Crear URL del blob
                const url = window.URL.createObjectURL(blob);

                // Crear un enlace para descargar el PDF
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion_TODOCR_${datos.cliente.nombre.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();

                // Limpiar
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                // Ocultar carga y mostrar éxito
                ocultarCarga();
                mostrarExito('PDF generado y descargado correctamente');
            })
            .catch(error => {
                console.error('Error al generar el PDF:', error);
                ocultarCarga();
                mostrarError(`Error al generar el PDF: ${error.message}`);
            });
    } catch (error) {
        console.error('Error al preparar los datos para el PDF:', error);
        ocultarCarga();
        mostrarError('Error al generar el PDF. Por favor, intente de nuevo.');
    }
}

// Exponer funciones necesarias globalmente
window.actualizarServicio = actualizarServicio;
window.eliminarServicio = eliminarServicio;
window.actualizarMaterial = actualizarMaterial;
window.eliminarMaterial = eliminarMaterial;