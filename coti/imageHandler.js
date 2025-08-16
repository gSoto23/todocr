
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 10;

class ImageHandler {
    constructor() {
        this.images = [];
        this.init();
    }

    init() {
        // Esperar a que el DOM esté cargado
        document.addEventListener('DOMContentLoaded', () => {
            this.fileInput = document.getElementById('imageInput');
            this.previewContainer = document.getElementById('imagePreview');
            
            if (this.fileInput) {
                this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
            }
        });
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);

        // Validar número total de imágenes
        if (this.images.length + files.length > MAX_IMAGES) {
            this.showError(`Máximo ${MAX_IMAGES} imágenes permitidas`);
            return;
        }

        // Validar cada archivo
        const invalidFiles = files.filter(file => !this.isValidFile(file));
        if (invalidFiles.length > 0) {
            this.showError('Algunos archivos no son válidos. Use imágenes JPG/PNG/WEBP menores a 5MB.');
            return;
        }

        // Procesar archivos válidos
        files.forEach(file => this.processFile(file));

        // Limpiar input
        this.fileInput.value = '';
    }

    isValidFile(file) {
        return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE;
    }

    async processFile(file) {
        try {
            const preview = await this.createPreview(file);
            this.previewContainer.appendChild(preview);
            this.images.push(file);
            
            // Actualizar contador de imágenes
            this.updateImageCounter();
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }

    createPreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const container = document.createElement('div');
                container.className = 'preview-item';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                img.alt = file.name;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'preview-remove';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = () => {
                    const index = this.images.indexOf(file);
                    if (index > -1) {
                        this.images.splice(index, 1);
                    }
                    container.remove();
                    this.updateImageCounter();
                };

                container.appendChild(img);
                container.appendChild(removeBtn);

                resolve(container);
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    updateImageCounter() {
        const counter = document.getElementById('imageCounter');
        if (counter) {
            counter.textContent = `${this.images.length}/${MAX_IMAGES}`;
        }
    }

    showError(message) {
        // Usar el sistema de notificaciones existente si está disponible
        if (window.emailHandler && typeof window.emailHandler.mostrarNotificacion === 'function') {
            window.emailHandler.mostrarNotificacion('error', message);
        } else {
            alert(message);
        }
    }

    getImages() {
        return this.images;
    }

    clearImages() {
        this.images = [];
        if (this.previewContainer) {
            this.previewContainer.innerHTML = '';
        }
        this.updateImageCounter();
    }

    // Compresión de imágenes antes de envío
    async compressImage(file) {
        return new Promise((resolve, reject) => {
            if (!file || !(file instanceof File)) {
                reject(new Error('Archivo inválido'));
                return;
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calcular nuevas dimensiones manteniendo aspecto
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1200;

                    if (width > height && width > maxDim) {
                        height = (height * maxDim) / width;
                        width = maxDim;
                    } else if (height > maxDim) {
                        width = (width * maxDim) / height;
                        height = maxDim;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Error al comprimir imagen'));
                            return;
                        }

                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });

                        resolve(compressedFile);
                    }, 'image/jpeg', 0.8);
                };

                img.onerror = () => reject(new Error('Error al cargar imagen'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Error al leer archivo'));
            reader.readAsDataURL(file);
        });
    }
}

// Inicializar el manejador de imágenes
const imageHandler = new ImageHandler();

// Exportar para uso en otros módulos
window.imageHandler = imageHandler;
