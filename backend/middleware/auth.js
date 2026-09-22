const { verify } = require('../utils/token');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!process.env.AUTH_SECRET) {
        console.error('AUTH_SECRET no está definida en el entorno');
        return res.status(500).json({ success: false, message: 'Autenticación no configurada' });
    }

    const payload = token ? verify(token, process.env.AUTH_SECRET) : null;
    if (!payload) {
        return res.status(401).json({ success: false, message: 'No autorizado' });
    }

    req.user = payload;
    next();
}

module.exports = { requireAuth };
