// =====================
//  Base Template (Email)
// =====================

// Función para obtener el nombre de la categoría a partir de su ID
function getCategoryName(categoryId) {
    const categories = {
        'jardin': 'Jardinería',
        'limpieza': 'Limpieza',
        'mantenimiento': 'Mantenimiento'
    };
    return categories[categoryId] || categoryId;
}

// Función para obtener el nombre del servicio a partir de su ID y categoría
function getServiceName(categoryId, serviceId) {
    const services = {
        'jardin': {
            'corte': 'Corte de césped y bordes',
            'poda': 'Poda de arbustos y árboles',
            'riego': 'Riego y abonado',
            'limpieza': 'Limpieza de zonas verdes',
            'diseno': 'Diseño y reposición de plantas'
        },
        'limpieza': {
            'turnover': 'Turnover Airbnb (check-in/check-out)',
            'profunda': 'Limpieza profunda',
            'vidrios': 'Limpieza de vidrios interior/exterior',
            'post': 'Post-remodelación',
            'sanitizacion': 'Sanitización focal'
        },
        'mantenimiento': {
            'electrico': 'Electricidad y fontanería básica',
            'pintura': 'Pintura interior/exterior o techos',
            'instalaciones': 'Instalaciones menores',
            'diagnostico': 'Diagnóstico preventivo',
            'urgencias': 'Urgencias 24 horas'
        }
    };

    return services[categoryId] && services[categoryId][serviceId]
        ? services[categoryId][serviceId]
        : serviceId;
}
const baseTemplate = (content, { preheader = "TODOCR — Jardinería, Limpieza y Mantenimiento" } = {}) => `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>TODOCR</title>
<meta name="color-scheme" content="light only">
<style>
  /* Paleta de marca */
  :root {
    --tp-green: #6B9236;
    --tp-blue:  #1E88C7;
    --tp-yellow:#E8A62B;
    --tp-black: #1A1A1A;
    --tp-light: #f6f8fa;
    --tp-muted: #6b7280;
    --tp-border:#e5e7eb;
  }

  /* Reset básico compatible con email */
  body,table,td { margin:0; padding:0; }
  img { border:0; line-height:100%; outline:none; text-decoration:none; }
  table { border-collapse:collapse !important; }
  body { width:100% !important; height:100% !important; background:#f2f4f7; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; font-family: Arial, Helvetica, sans-serif; color:#1f2937; }

  /* Contenedor */
  .wrapper { width:100%; background:#f2f4f7; padding:24px 0; }
  .container { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,.06); }

  /* Brand bar */
  .brandbar { background: var(--tp-green); height:6px; }

  /* Header */
  .header { background:#eef2f7; padding:20px; text-align:center; }
  .logo { max-width:220px; height:auto; display:block; margin:0 auto; }
  .title { font-size:20px; font-weight:700; color:#111827; margin:14px 0 0 0; }
  .subtitle { font-size:13px; color:#6b7280; margin:4px 0 0 0; }

  /* Content card */
  .content { padding:24px; }

  /* Badges / chips */
  .badge { display:inline-block; font-size:20px; font-weight:700; color:#374151; background:var(--tp-blue); padding:6px 10px; border-radius:999px; letter-spacing:.2px; text-align:center; }

  /* Tablas key/value */
  .kv { width:100%; border:1px solid var(--tp-border); border-radius:10px; overflow:hidden; }
  .kv tr td { padding:12px 14px; font-size:14px; vertical-align:top; }
  .kv tr:nth-child(odd) td { background:#fafafa; }
  .kv td.k { width:36%; color:#374151; font-weight:700; background:#f8fafc; }
  .kv td.v a { color:var(--tp-blue); text-decoration:none; }

  /* Subtítulos de bloque */
  .block-title { margin:18px 0 8px; font-size:14px; font-weight:800; color:#374151; text-transform:uppercase; letter-spacing:.6px; }

  /* Message box */
  .note { background:#f8fafc; border-left:4px solid var(--tp-yellow); padding:14px; border-radius:8px; font-size:14px; color:#374151; }

  /* Totales y tablas detalladas */
  .totals { width:100%; border:1px solid var(--tp-border); border-radius:10px; overflow:hidden; margin-top:8px; }
  .totals td { padding:12px 14px; font-size:14px; }
  .totals .row { background:#ffffff; }
  .totals .row:nth-child(odd) { background:#fafafa; }
  .totals .grand { background:#eef2f7; color:#374151; font-weight:800; font-size:24px; }
  .totals .header { background:#f8fafc; color:#374151; font-weight:700; text-align:left; }

  /* Footer */
  .footer { text-align:center; color:#6b7280; font-size:12px; padding:18px; line-height:1.5; }
  .footer a { color: var(--tp-green); text-decoration:none; }

  /* Preheader (oculto) */
  .preheader { display:none; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all; }
  @media (max-width:640px){
    .content{ padding:18px; }
    .title{ font-size:18px; }
  }
</style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="wrapper">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0">
          <tr><td class="brandbar"></td></tr>
          <tr><td class="header">
            <img class="logo" src="https://www.todocr.com/assets/logotodocr.png" alt="TODOCR">
            <div class="subtitle">Jardinería · Limpieza · Mantenimiento</div>
          </td></tr>
          <tr><td class="content">
            ${content}
          </td></tr>
          <tr><td class="footer">
            TODOCR · Poás, Alajuela, Costa Rica<br/>
            WhatsApp: <a href="https://wa.me/50670808613" target="_blank">+506 7080 8613</a> · Email: <a href="mailto:info.todocr@gmail.com">info.todocr@gmail.com</a><br/>
            © ${new Date().getFullYear()} TODOCR
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>
</body>
</html>
`;

// ===============================
//  Contact Email (Nuevo Contacto)
// ===============================
exports.contactTemplate = (data) => {
    const content = `
    <div class="badge">Nuevo Contacto</div>

    <table class="kv" role="presentation" cellpadding="0" cellspacing="0">
      <tr><td class="k">Nombre:</td><td class="v">${data.name || "-"}</td></tr>
      <tr><td class="k">Email:</td><td class="v"><a href="mailto:${data.email}">${data.email || "-"}</a></td></tr>
      <tr><td class="k">Teléfono:</td><td class="v">${data.phone || "-"}</td></tr>
      <tr><td class="k">Servicio:</td><td class="v">${data.service || "-"}</td></tr>
      <tr><td class="k">Tamaño:</td><td class="v">${data.size || "-"}</td></tr>
      <tr><td class="k">Fecha Estimada:</td><td class="v">${data.date || "-"}</td></tr>
    </table>

    ${data.message ? `
      <div class="block-title">Mensaje</div>
      <div class="note">${data.message}</div>
    ` : ``}
  `;

    return {
        html: baseTemplate(content, { preheader: `Nuevo contacto: ${data.name || ""} — TODOCR` }),
        text:
            `Nuevo Contacto — TODOCR
Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone}
Servicio: ${data.service}
Tamaño: ${data.size}
Fecha: ${data.date}
${data.message ? `Mensaje:\n${data.message}` : ""}`
    };
};

// =======================
//  Quotation (Cotización)
// =======================
exports.quotationTemplate = (data) => {
    const fmtCRC = (n) =>
        new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(n);

    const content = `
    <div class="badge">Cotización de Servicios</div>

    <div class="block-title">Información del Cliente</div>
    <table class="kv" role="presentation" cellpadding="0" cellspacing="0">
      <tr><td class="k">Nombre:</td><td class="v">${data.cliente.nombre || "-"}</td></tr>
      <tr><td class="k">Email:</td><td class="v"><a href="mailto:${data.cliente.email}">${data.cliente.email || "-"}</a></td></tr>
      <tr><td class="k">Teléfono:</td><td class="v">${data.cliente.telefono || "-"}</td></tr>
      <tr><td class="k">Dirección:</td><td class="v">${data.cliente.direccion || "-"}</td></tr>
    </table>

    <div class="block-title">Detalles del Servicio</div>
    <table class="kv" role="presentation" cellpadding="0" cellspacing="0">

    <tr><td class="k">Tipo de Trabajo:</td><td class="v">${getCategoryName(data.servicio.categoria)} — ${getServiceName(data.servicio.categoria, data.servicio.tipo)}</td></tr>      
    <tr><td class="k">Fecha Estimada:</td><td class="v">${new Date(data.servicio.fecha).toLocaleDateString('es-CR')}</td></tr>
      ${data.servicio.area ? `<tr><td class="k">Área:</td><td class="v">${data.servicio.area} m²</td></tr>` : ``}
      <tr><td class="k">Horas estimadas:</td><td class="v">${data.servicio.horasEstimadas ?? "N/A"}</td></tr>
    </table>

    ${data.materiales?.length ? `
      <div class="block-title">Detalle de Materiales</div>
      <table class="totals" role="presentation" cellpadding="0" cellspacing="0">
        <tr class="header">
          <td>Material</td>
          <td align="center">Cantidad</td>
          <td align="right">Precio Unit.</td>
          <td align="right">Subtotal</td>
        </tr>
        ${data.materiales.map(m => `
          <tr class="row">
            <td>${m.nombre}</td>
            <td align="center">${m.cantidad}</td>
            <td align="right">${fmtCRC(m.precio)}</td>
            <td align="right">${fmtCRC(m.subtotal)}</td>
          </tr>
        `).join('')}
      </table>
    `: ``}

    <div class="block-title">Desglose de Costos</div>
    <table class="kv" role="presentation" cellpadding="0" cellspacing="0">
      <tr><td class="k">Mano de obra:</td><td class="v">${fmtCRC(data.costos.manoDeObra)}</td></tr>
      ${data.materiales?.length ? `<tr><td class="k">Materiales:</td><td class="v">${fmtCRC(data.costos.totalMateriales)}</td></tr>` : ``}
      ${data.costos.desplazamiento ? `<tr><td class="k">Desplazamiento:</td><td class="v">${fmtCRC(data.costos.desplazamiento)}</td></tr>` : ``}
    </table>

    ${data.observaciones ? `
      <div class="block-title">Observaciones</div>
      <div class="note">${data.observaciones}</div>
    `: ``}

    <div class="block-title">Totales</div>
    <table class="totals" role="presentation" cellpadding="0" cellspacing="0">
      <tr class="row"><td><strong>Sub Total</strong></td><td align="right">${fmtCRC(data.totales.subtotal)}</td></tr>
      <tr class="row"><td><strong>IVA (13%)</strong></td><td align="right">${fmtCRC(data.totales.iva)}</td></tr>
      <tr class="grand"><td><strong>Total Final</strong></td><td align="right"><strong>${fmtCRC(data.totales.total)}</strong></td></tr>
    </table>
    <div style="text-align:right; color:#6b7280; font-size:12px; margin-top:6px;">
      ≈ US$ ${Math.round(data.totales.dolares).toLocaleString()}
    </div>
  `;

    return {
        html: baseTemplate(content, { preheader: `Cotización — ${data.cliente.nombre || "Cliente"} · TODOCR` }),
        text:
            `Cotización TODOCR
CLIENTE
Nombre: ${data.cliente.nombre}
Email: ${data.cliente.email}
Teléfono: ${data.cliente.telefono}
Dirección: ${data.cliente.direccion}

SERVICIO
Tipo: ${data.servicio.categoria} — ${data.servicio.tipo}
Fecha: ${new Date(data.servicio.fecha).toLocaleDateString('es-CR')}
${data.servicio.area ? `Área: ${data.servicio.area} m²` : ``}
Horas estimadas: ${data.servicio.horasEstimadas ?? "N/A"}

${data.materiales?.length ? `MATERIALES
${data.materiales.map(m => `${m.nombre}: ${m.cantidad} × ${fmtCRC(m.precio)} = ${fmtCRC(m.subtotal)}`).join('\n')}
` : ``}

COSTOS
Mano de obra: ${fmtCRC(data.costos.manoDeObra)}
${data.materiales?.length ? `Materiales: ${fmtCRC(data.costos.totalMateriales)}` : ``}
${data.costos.desplazamiento ? `Desplazamiento: ${fmtCRC(data.costos.desplazamiento)}` : ``}
${data.observaciones ? `\nOBSERVACIONES:\n${data.observaciones}` : ``}

TOTALES
Sub Total: ${fmtCRC(data.totales.subtotal)}
IVA (13%): ${fmtCRC(data.totales.iva)}
Total Final: ${fmtCRC(data.totales.total)}
≈ US$ ${Math.round(data.totales.dolares).toLocaleString()}`
    };
};

// ======================
//  Cleaning Report Email
// ======================
exports.reportTemplate = (data) => {
    const content = `
    <div class="badge">Reporte de Limpieza</div>

    <table class="kv" role="presentation" cellpadding="0" cellspacing="0">
      <tr><td class="k">Tipo:</td><td class="v">${data.type}</td></tr>
      <tr><td class="k">Fecha:</td><td class="v">${data.date}</td></tr>
    </table>

    <div class="block-title">Tareas Completadas</div>
    <table class="kv" role="presentation" cellpadding="0" cellspacing="0">
      ${data.tasks.map(t => `
        <tr><td class="k" style="width:48px;">${t.completed ? "✅" : "❌"}</td><td class="v">${t.text}</td></tr>
      `).join('')}
    </table>

    ${data.comments ? `
      <div class="block-title">Comentarios</div>
      <div class="note">${data.comments}</div>
    `: ``}
  `;

    return {
        html: baseTemplate(content, { preheader: `Reporte de limpieza — ${data.type}` }),
        text:
            `Reporte de Limpieza — TODOCR
Tipo: ${data.type}
Fecha: ${data.date}

TAREAS:
${data.tasks.map(t => `${t.completed ? "✓" : "✗"} ${t.text}`).join("\n")}
${data.comments ? `\nCOMENTARIOS:\n${data.comments}` : ""}`
    };
};