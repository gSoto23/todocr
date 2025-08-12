exports.contactTemplate = (data) => ({
    html: `
        <h2>Nuevo Contacto</h2>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Servicio:</strong> ${data.service}</p>
        <p><strong>Tamaño:</strong> ${data.size}</p>
        <p><strong>Fecha:</strong> ${data.date}</p>
        <p><strong>Mensaje:</strong> ${data.message}</p>
    `,
    text: `
        Nuevo Contacto
        Nombre: ${data.name}
        Email: ${data.email}
        Teléfono: ${data.phone}
        Servicio: ${data.service}
        Tamaño: ${data.size}
        Fecha: ${data.date}
        Mensaje: ${data.message}
    `
});

exports.reportTemplate = (data) => ({
    html: `
        <h2>Reporte de Limpieza</h2>
        <p><strong>Tipo:</strong> ${data.type}</p>
        <p><strong>Fecha:</strong> ${data.date}</p>
        <h3>Tareas Completadas:</h3>
        <ul>
            ${data.tasks.map(task => `<li>${task.completed ? '✅' : '❌'} ${task.text}</li>`).join('')}
        </ul>
        ${data.comments ? `<p><strong>Comentarios:</strong> ${data.comments}</p>` : ''}
    `,
    text: `
        Reporte de Limpieza
        Tipo: ${data.type}
        Fecha: ${data.date}
        
        Tareas Completadas:
        ${data.tasks.map(task => `${task.completed ? '✓' : '✗'} ${task.text}`).join('\n')}
        
        ${data.comments ? `Comentarios: ${data.comments}` : ''}
    `
});