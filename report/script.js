// Datos de las tareas
const tareasAntes = [
    { icon: "home", text: "Barrer y limpiar (cabañas y rancho)" },
    { icon: "droplet", text: "Limpiar servicios sanitarios y lavar baños" },
    { icon: "moon", text: "Tender camas (+ sofá cama que tiene un forro)" },
    { icon: "map", text: "Barrer aceras alrededor de las cabañas" },
    { icon: "refresh-cw", text: "Lavar y acomodar trastes" },
    { icon: "package", text: "Dejar 2 pañitos de cocina" },
    { icon: "box", text: "Limpiar el microondas por dentro y fuera" },
    { icon: "thermometer", text: "Limpiar refrigeradoras, vaciarlas, dejarlas abiertas"},
    { icon: "tool", text: "Limpiar cocina por dentro y fuera" },
    { icon: "shopping-bag", text: "Poner bolsa a los basureros" },
    { icon: "disc", text: "Revisar parrilla y lavarla" },
    { icon: "feather", text: "Revisar fogata que no tenga basura" },
    { icon: "wind", text: "Barrer alrededor de la fogata" },
    { icon: "maximize-2", text: "Acomodar/cerrar sillas blancas plásticas" },
    { icon: "grid", text: "Mantener limpia la mesa blanca" },
    { icon: "maximize-2", text: "Acomodar sillas de la fogata" }
];

const tareasDespues = [
    { icon: "trash-2", text: "Recoger y sacar la basura de todos los basureros" },
    { icon: "droplet", text: "Limpiar servicios sanitarios y lavar baños" },
    { icon: "package", text: "Lavar cobijas y guardarlas bien dobladas" },
    { icon: "thermometer", text: "Limpiar refrigeradoras, vaciarlas, dejarlas abiertas" },
    { icon: "box", text: "Limpiar el microondas por dentro y fuera" },
    { icon: "tool", text: "Limpiar cocina por dentro y fuera" },
    { icon: "disc", text: "Revisar y limpiar parrilla" },
    { icon: "feather", text: "Revisar fogata que no tenga basura" },
    { icon: "wind", text: "Barrer alrededor de la fogata" },
    { icon: "maximize-2", text: "Acomodar/cerrar sillas blancas plásticas" },
    { icon: "grid", text: "Mantener limpia la mesa blanca" },
    { icon: "maximize-2", text: "Acomodar sillas de la fogata" },
    { icon: "clipboard", text: "Revisar inventario: papel, jabón, cloro, suavitel, etc." }
];

function tomarFoto() {
    const input = document.getElementById('tomarFoto');
    input.click();
}

function formatearFecha(fecha) {
    return fecha.toISOString().split('T')[0];
}

async function comprimirImagen(imagenBase64, maxWidth = 800, maxHeight = 600) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = imagenBase64;
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    const fechaInput = document.getElementById('fechaLimpieza');
    fechaInput.value = formatearFecha(new Date());
    feather.replace();
});

function generarFilaTarea(tarea) {
    return `
        <tr class="hover:bg-gray-50 transition-colors duration-200">
            <td class="px-3 sm:px-6 py-4">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="flex-shrink-0 text-gray-500">
                        <i data-feather="${tarea.icon}" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                    </div>
                    <div class="text-sm text-gray-900 break-words">${tarea.text}</div>
                </div>
            </td>
            <td class="px-2 sm:px-6 py-4 text-center w-16 sm:w-24">
                <label class="inline-flex items-center justify-center">
                    <input type="checkbox" 
                           class="form-checkbox h-6 w-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer transition-all duration-200"
                           aria-label="Marcar tarea como completada">
                </label>
            </td>
        </tr>
    `;
}

async function previewImages(event) {
    const preview = document.getElementById('imagePreview');
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
        alert('Por favor, tome una foto');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const imagenComprimida = await comprimirImagen(e.target.result);

            const div = document.createElement('div');
            div.className = 'relative';
            div.innerHTML = `
                <div class="group relative">
                    <img src="${imagenComprimida}" class="w-full h-32 object-cover rounded-lg shadow">
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onclick="eliminarImagen(this.closest('.relative'))"
                            class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                        >
                            <i data-feather="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
            preview.appendChild(div);
            feather.replace();

            div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        alert('Error al procesar la imagen. Por favor, intente de nuevo.');
    }
    event.target.value = '';
}

function eliminarImagen(elemento) {
    elemento.remove();
}

function mostrarTabla() {
    const tipo = document.getElementById('tipoLimpieza').value;
    document.getElementById('tablaAntes').classList.add('hidden');
    document.getElementById('tablaDespues').classList.add('hidden');

    if (tipo === 'antes') {
        document.getElementById('tablaAntes').classList.remove('hidden');
        document.getElementById('tareasAntes').innerHTML =
            tareasAntes.map(generarFilaTarea).join('');
    } else if (tipo === 'despues') {
        document.getElementById('tablaDespues').classList.remove('hidden');
        document.getElementById('tareasDespues').innerHTML =
            tareasDespues.map(generarFilaTarea).join('');
    }

    feather.replace();
}

async function enviarReporte() {
    const tipo = document.getElementById('tipoLimpieza').value;
    if (!tipo) {
        alert('Por favor seleccione un tipo de limpieza');
        return;
    }

    const fecha = document.getElementById('fechaLimpieza').value;
    if (!fecha) {
        alert('Por favor seleccione una fecha');
        return;
    }

    const imagePreview = document.getElementById('imagePreview');
    const imageElements = imagePreview.getElementsByTagName('img');
    if (imageElements.length === 0) {
        alert('Por favor tome al menos una foto antes de enviar el reporte');
        return;
    }

    const tabla = tipo === 'antes' ? 'tareasAntes' : 'tareasDespues';
    const checkboxes = document.querySelectorAll(`#${tabla} input[type="checkbox"]`);
    const tareas = tipo === 'antes' ? tareasAntes : tareasDespues;

    // Crear array de tareas con su estado
    const tareasEstado = Array.from(checkboxes).map((checkbox, index) => ({
        text: tareas[index].text,
        completed: checkbox.checked
    }));

    if (!tareasEstado.some(t => t.completed)) {
        alert('Por favor complete al menos una tarea antes de enviar el reporte');
        return;
    }

    const comentarios = document.getElementById('comentarios').value;

    try {
        const formData = new FormData();
        formData.append('type', tipo);
        formData.append('date', fecha);
        formData.append('tasks', JSON.stringify(tareasEstado));
        formData.append('comments', comentarios);

        // Agregar imágenes
        const imagePromises = Array.from(imageElements).map(async (img, index) => {
            const response = await fetch(img.src);
            const blob = await response.blob();
            formData.append('images', blob, `imagen${index + 1}.jpg`);
        });

        const botonEnviar = document.querySelector('button[onclick="enviarReporte()"]');
        botonEnviar.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
        `;
        botonEnviar.disabled = true;

        await Promise.all(imagePromises);

        const response = await fetch('http://localhost:3000/api/email/cleaning-report', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Reporte enviado con éxito');
            // Limpiar formulario
            document.getElementById('tipoLimpieza').value = '';
            document.getElementById('comentarios').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('fechaLimpieza').value = formatearFecha(new Date());
            mostrarTabla();
        } else {
            throw new Error(data.message || 'Error al enviar el reporte');
        }
    } catch (error) {
        console.error('Error al enviar el reporte:', error);
        alert('Hubo un error al enviar el reporte. Por favor intente de nuevo.');
    } finally {
        const botonEnviar = document.querySelector('button[onclick="enviarReporte()"]');
        botonEnviar.innerHTML = `
            <i data-feather="check-circle"></i>
            LIMPIEZA TERMINADA
        `;
        botonEnviar.disabled = false;
        feather.replace();
    }
}

feather.replace();