require('dotenv').config();

if (!process.env.SENDGRID_API_KEY) {
    console.error('Error: SENDGRID_API_KEY no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.FROM_EMAIL) {
    console.error('Error: FROM_EMAIL no está definido en el archivo .env');
    process.exit(1);
}

module.exports = {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.FROM_EMAIL
};