const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const { sign } = require('../utils/token');
const { requireAuth } = require('../middleware/auth');

const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 horas
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

// Limitador simple de intentos en memoria (por IP)
const attempts = new Map();

function timingSafeEqualStr(a, b) {
    const aBuf = Buffer.from(String(a));
    const bBuf = Buffer.from(String(b));
    if (aBuf.length !== bBuf.length) {
        // comparación "dummy" para no filtrar el largo por timing
        crypto.timingSafeEqual(aBuf, aBuf);
        return false;
    }
    return crypto.timingSafeEqual(aBuf, bBuf);
}

router.post('/login', (req, res) => {
    const ip = req.ip;
    const now = Date.now();
    const record = attempts.get(ip) || { count: 0, first: now };

    if (now - record.first > WINDOW_MS) {
        record.count = 0;
        record.first = now;
    }

    if (record.count >= MAX_ATTEMPTS) {
        return res.status(429).json({ success: false, message: 'Demasiados intentos. Intenta de nuevo más tarde.' });
    }

    const validUser = process.env.AUTH_USER;
    const validPass = process.env.AUTH_PASS;

    if (!validUser || !validPass || !process.env.AUTH_SECRET) {
        console.error('AUTH_USER, AUTH_PASS o AUTH_SECRET no están definidas en el entorno');
        return res.status(500).json({ success: false, message: 'Autenticación no configurada' });
    }

    const { username, password } = req.body || {};

    const ok = Boolean(username) && Boolean(password) &&
        timingSafeEqualStr(username, validUser) &&
        timingSafeEqualStr(password, validPass);

    record.count += 1;
    attempts.set(ip, record);

    if (!ok) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    attempts.delete(ip);
    const token = sign({ sub: username }, process.env.AUTH_SECRET, TOKEN_TTL_SECONDS);
    res.json({ success: true, token, expiresIn: TOKEN_TTL_SECONDS });
});

router.get('/verify', requireAuth, (req, res) => {
    res.json({ success: true });
});

module.exports = router;
