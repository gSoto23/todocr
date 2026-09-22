const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

// Rutas de autenticación (cotizador)
app.use('/api/auth', authRoutes);

// Rutas de email
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});