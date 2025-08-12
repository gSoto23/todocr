// calculator.js — TODOCR (versión final)

// ----------------------------
// CONFIGURACIÓN
// ----------------------------
const CONFIG = {
    EXCHANGE_RATE: 535,     // CRC por USD
    LABOR_MARGIN: 0.40,     // Margen sobre costo de mano de obra
    MATERIALS_MARGIN: 0.10, // Margen/handling sobre materiales
    MIN_AREA: 1,            // m² mínimos para evitar 0
    MIN_HOURS: 0.5,         // horas mínimas facturables
    BASE_HOUR_RATE: 8025    // Costo interno de MO en CRC (≈ $15 * 535)
};

// ----------------------------
// SERVICIOS
// ----------------------------
const SERVICES = {
    jardin: {
        name: 'Jardinería',
        options: [
            { id: 'corte',    name: 'Corte de césped y bordes',       productivityM2h: 200 },
            { id: 'poda',     name: 'Poda de arbustos y árboles',     productivityM2h: 50  },
            { id: 'riego',    name: 'Riego y abonado',                productivityM2h: 150 },
            { id: 'limpieza', name: 'Limpieza de zonas verdes',       productivityM2h: 150 },
            { id: 'diseno',   name: 'Diseño y reposición de plantas', productivityM2h: 60  }
        ]
    },
    limpieza: {
        name: 'Limpieza',
        options: [
            { id: 'turnover',     name: 'Turnover Airbnb (check-in/check-out)', productivityM2h: 50 },
            { id: 'profunda',     name: 'Limpieza profunda',                     productivityM2h: 30 },
            { id: 'vidrios',      name: 'Limpieza de vidrios interior/exterior', productivityM2h: 20 },
            { id: 'post',         name: 'Post-remodelación',                     productivityM2h: 25 },
            { id: 'sanitizacion', name: 'Sanitización focal',                    productivityM2h: 45 }
        ]
    },
    mantenimiento: {
        name: 'Mantenimiento',
        options: [
            { id: 'electrico',    name: 'Electricidad y fontanería básica', hourly: true, minSellRate: 10700 },
            { id: 'pintura',      name: 'Pintura interior/exterior y techos',hourly: true, minSellRate:  8025 },
            { id: 'instalaciones',name: 'Instalaciones menores',            hourly: true, minSellRate:  9630 },
            { id: 'diagnostico',  name: 'Diagnóstico preventivo',           hourly: true, minSellRate: 13375 },
            { id: 'urgencias',    name: 'Urgencias 24 horas',               hourly: true, minSellRate: 16050 }
        ]
    }
};

const SHOW_MATERIALS_FOR = {
    jardin: true,
    limpieza: true,
    mantenimiento: true
};

// ----------------------------
// DOM ELEMENTS
// ----------------------------
const elements = {
    form: document.getElementById('calculator-form'),
    categoria: document.getElementById('categoria'),
    servicio: document.getElementById('servicio'),
    area: document.getElementById('area'),
    horas: document.getElementById('horas'),
    areaBox: document.getElementById('areaBox'),
    hoursBox: document.getElementById('hoursBox'),
    matCard: document.getElementById('matCard'),
    matBody: document.getElementById('matBody'),
    matNombre: document.getElementById('matNombre'),
    matPrecio: document.getElementById('matPrecio'),
    matCantidad: document.getElementById('matCantidad'),
    addMat: document.getElementById('addMat'),
    aplicarRecargo: document.getElementById('aplicarRecargo'),
    zonaRecargo: document.getElementById('zonaRecargo'),
    montoRecargo: document.getElementById('montoRecargo'),
    fechaTrabajo: document.getElementById('fechaTrabajo'),
    resHoras: document.getElementById('resHoras'),
    resCosto: document.getElementById('resCosto'),
    resMat: document.getElementById('resMat'),
    resPrecio: document.getElementById('resPrecio'),
    calcularBtn: document.getElementById('calcularBtn')
};

// ----------------------------
// INITIALIZATION
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
    initializeCalculator();
    setupMaterialsHandling();
    setupTravelCharge();
});

function initializeCalculator() {
    populateServices();
    disableAllFields();

    elements.categoria.addEventListener('change', handleCategoryChange);
    elements.servicio.addEventListener('change', handleServiceChange);
    elements.area.addEventListener('input', handleAutoCalculation);
    elements.horas.addEventListener('input', handleAutoCalculation);

    if (elements.form) {
        elements.form.addEventListener('submit', handleCalculation);
        elements.form.addEventListener('reset', handleClear);
    }
    if (elements.calcularBtn) {
        elements.calcularBtn.addEventListener('click', handleCalculation);
    }

    toggleMaterialsCard();
}

function disableAllFields() {
    elements.servicio.disabled = true;
    elements.area.disabled = true;
    elements.horas.disabled = true;
    elements.fechaTrabajo.disabled = true;
    elements.matNombre.disabled = true;
    elements.matPrecio.disabled = true;
    elements.matCantidad.disabled = true;
    elements.addMat.disabled = true;
}

// ----------------------------
// HANDLERS
// ----------------------------
function handleCategoryChange() {
    const hasCategory = elements.categoria.value !== '';

    elements.servicio.disabled = !hasCategory;
    elements.servicio.value = '';
    elements.area.disabled = true;
    elements.horas.disabled = true;
    elements.fechaTrabajo.disabled = true;

    populateServices();
    toggleInputs();
    toggleMaterialsCard();
    handleAutoCalculation();
}

function handleServiceChange() {
    const hasCategory = elements.categoria.value !== '';
    const hasService = elements.servicio.value !== '';

    if (hasCategory && hasService) {
        elements.fechaTrabajo.disabled = false;
        if (elements.categoria.value === 'mantenimiento') {
            elements.horas.disabled = false;
        } else {
            elements.area.disabled = false;
        }
        elements.matNombre.disabled = false;
        elements.matPrecio.disabled = false;
        elements.matCantidad.disabled = false;
        elements.addMat.disabled = false;
    } else {
        disableAllFields();
    }

    handleAutoCalculation();
}

function handleAutoCalculation() {
    if (elements.categoria.value && elements.servicio.value) {
        const data = {
            categoria: elements.categoria.value,
            servicio: elements.servicio.value,
            area: parseFloat(elements.area.value) || 0,
            horas: parseFloat(elements.horas.value) || 0,
            materiales: calculateMaterialsTotal(),
            recargo: parseFloat(elements.montoRecargo.value) || 0
        };
        const result = calculatePrice(data);
        displayResults(result);
    }
}

function handleCalculation(e) {
    if (e) e.preventDefault();
    if (!validateInputs()) return;

    const data = {
        categoria: elements.categoria.value,
        servicio: elements.servicio.value,
        area: parseFloat(elements.area.value) || 0,
        horas: parseFloat(elements.horas.value) || 0,
        materiales: calculateMaterialsTotal(),
        recargo: parseFloat(elements.montoRecargo.value) || 0
    };

    const result = calculatePrice(data);
    displayResults(result);
}

function handleClear() {
    disableAllFields();
    elements.matBody.innerHTML = '';
    displayResults({
        hours: 0,
        laborCost: 0,
        materialsTotal: 0,
        total: 0
    });
}

// ----------------------------
// UI UPDATES
// ----------------------------
function toggleInputs() {
    const isMantenimiento = elements.categoria.value === 'mantenimiento';
    elements.areaBox.classList.toggle('hidden', isMantenimiento);
    elements.hoursBox.classList.toggle('hidden', !isMantenimiento);

    if (isMantenimiento) {
        elements.area.value = '80';
        elements.horas.disabled = true;
    } else {
        elements.horas.value = '2';
        elements.area.disabled = true;
    }
}

function toggleMaterialsCard() {
    const category = elements.categoria.value;
    const showMaterials = SHOW_MATERIALS_FOR[category] ?? true;
    elements.matCard.classList.toggle('hidden', !showMaterials);
}

function populateServices() {
    elements.servicio.innerHTML = '<option value="">Seleccione servicio</option>';

    const category = elements.categoria.value;
    if (SERVICES[category]) {
        SERVICES[category].options.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            elements.servicio.appendChild(option);
        });
    }
}

// ----------------------------
// MATERIALS HANDLING
// ----------------------------
function setupMaterialsHandling() {
    elements.addMat.addEventListener('click', addMaterial);
}

function addMaterial() {
    const nombre = elements.matNombre.value.trim();
    const precio = parseFloat(elements.matPrecio.value);
    const cantidad = parseInt(elements.matCantidad.value);

    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert('Por favor complete todos los campos de materiales correctamente');
        return;
    }

    const row = elements.matBody.insertRow();
    row.innerHTML = `
        <td class="p-2">${nombre}</td>
        <td class="text-right p-2">₡${precio.toLocaleString()}</td>
        <td class="text-right p-2">${cantidad}</td>
        <td class="text-right p-2">₡${(precio * cantidad).toLocaleString()}</td>
        <td class="text-center p-2">
            <button type="button" onclick="this.closest('tr').remove(); handleAutoCalculation();" 
                    class="text-red-500 hover:text-red-700">×</button>
        </td>
    `;

    clearMaterialInputs();
    handleAutoCalculation();
}

function clearMaterialInputs() {
    elements.matNombre.value = '';
    elements.matPrecio.value = '';
    elements.matCantidad.value = '';
}

function calculateMaterialsTotal() {
    let total = 0;
    const rows = elements.matBody.getElementsByTagName('tr');
    for (const row of rows) {
        const subtotal = parseFloat(row.cells[3].textContent.replace('₡', '').replace(/,/g, ''));
        total += subtotal;
    }
    return total * (1 + CONFIG.MATERIALS_MARGIN);
}

// ----------------------------
// TRAVEL CHARGE HANDLING
// ----------------------------
function setupTravelCharge() {
    elements.aplicarRecargo.addEventListener('change', handleTravelChargeToggle);
    elements.zonaRecargo.addEventListener('change', updateTravelCharge);
}

function handleTravelChargeToggle() {
    const enabled = elements.aplicarRecargo.checked;
    elements.zonaRecargo.disabled = !enabled;
    elements.montoRecargo.disabled = !enabled;
    if (enabled) {
        updateTravelCharge();
    } else {
        elements.montoRecargo.value = '0';
        handleAutoCalculation();
    }
}

function updateTravelCharge() {
    const recargoColones = parseInt(elements.zonaRecargo.value);
    elements.montoRecargo.value = recargoColones.toString();
    handleAutoCalculation();
}

// ----------------------------
// CALCULATIONS
// ----------------------------
function calculatePrice(data) {
    const category = SERVICES[data.categoria];
    const service = category?.options.find(s => s.id === data.servicio);

    if (!service) return { hours: 0, laborCost: 0, materialsTotal: 0, total: 0 };

    let hours, laborCost;

    if (service.hourly) {
        hours = Math.max(data.horas, CONFIG.MIN_HOURS);
        laborCost = hours * service.minSellRate;
    } else {
        const area = Math.max(data.area, CONFIG.MIN_AREA);
        hours = area / service.productivityM2h;
        laborCost = hours * CONFIG.BASE_HOUR_RATE * (1 + CONFIG.LABOR_MARGIN);
    }

    const total = laborCost + data.materiales + data.recargo;

    return {
        hours,
        laborCost,
        materialsTotal: data.materiales,
        total
    };
}

function displayResults(result) {
    elements.resHoras.textContent = result.hours.toFixed(1);
    elements.resCosto.textContent = `₡${Math.round(result.laborCost).toLocaleString()}`;
    if (elements.resMat) {
        elements.resMat.textContent = `₡${Math.round(result.materialsTotal).toLocaleString()}`;
    }
    if (elements.resPrecio) {
        const subtotal = result.total;
        const iva = subtotal * 0.13;
        const total = subtotal + iva;

        elements.resPrecio.textContent = `₡${Math.round(total).toLocaleString()}`;
    }

    // Disparar evento para FormHandler
    document.dispatchEvent(new CustomEvent('calculoActualizado', {
        detail: {
            subtotal: result.total,  // Subtotal sin IVA
            iva: result.total * 0.13, // Monto del IVA
            total: result.total * 1.13, // Total con IVA
            totalUSD: (result.total * 1.13) / CONFIG.EXCHANGE_RATE // Total en USD con IVA incluido
        }
    }));
}

// ----------------------------
// VALIDATION
// ----------------------------
function validateInputs() {
    const requiredInputs = [
        { el: elements.categoria, msg: 'Seleccione una categoría' },
        { el: elements.servicio, msg: 'Seleccione un servicio' },
        { el: elements.fechaTrabajo, msg: 'Seleccione una fecha' }
    ];

    if (elements.categoria.value !== 'mantenimiento') {
        requiredInputs.push({ el: elements.area, msg: 'Ingrese el área en m²' });
    } else {
        requiredInputs.push({ el: elements.horas, msg: 'Ingrese las horas' });
    }

    let isValid = true;
    requiredInputs.forEach(input => {
        if (!input.el.value) {
            alert(input.msg);
            isValid = false;
        }
    });

    return isValid;
}

// Exportar para uso en otros módulos
window.calculator = {
    handleCalculation,
    handleClear
};