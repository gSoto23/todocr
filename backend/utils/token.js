const crypto = require('crypto');

function toBase64Url(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function fromBase64Url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return Buffer.from(str, 'base64');
}

function sign(payload, secret, expiresInSeconds) {
    const body = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
    const payloadEncoded = toBase64Url(Buffer.from(JSON.stringify(body)));
    const signature = toBase64Url(crypto.createHmac('sha256', secret).update(payloadEncoded).digest());
    return `${payloadEncoded}.${signature}`;
}

function verify(token, secret) {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;

    const [payloadEncoded, signature] = token.split('.');
    if (!payloadEncoded || !signature) return null;

    const expectedSignature = toBase64Url(crypto.createHmac('sha256', secret).update(payloadEncoded).digest());

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return null;
    }

    let payload;
    try {
        payload = JSON.parse(fromBase64Url(payloadEncoded).toString('utf8'));
    } catch (error) {
        return null;
    }

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
    }

    return payload;
}

module.exports = { sign, verify };
