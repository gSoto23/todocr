const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

require('dotenv').config();

const app = express();
// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
    origin: '*', // Permite solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

// Rutas
app.use('/api/pdf', pdfRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});