require('dotenv').config();

if (!process.env.GMAIL_USER) {
    console.error('Error: GMAIL_USER no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.GMAIL_APP_PASSWORD) {
    console.error('Error: GMAIL_APP_PASSWORD no está definida en el archivo .env');
    process.exit(1);
}

module.exports = {
    user: process.env.GMAIL_USER,
    appPassword: process.env.GMAIL_APP_PASSWORD
};
