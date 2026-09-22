# TODOCR

TODOCR es un proyecto de **Tomato CR**: sitio de servicios de jardinería, limpieza y mantenimiento de propiedades (Airbnb, hoteles, condominios) en Poás y Alajuela, Costa Rica.

## Estructura

- `index.html`, `css/`, `js/`, `assets/` — sitio público (frontend estático).
- `coti/` — cotizador interno (requiere login, ver abajo).
- `report/` — checklist interno de limpieza para el equipo.
- `backend/` — API Node/Express que envía correos (SendGrid) y protege el login del cotizador.

## Backend: configuración

Copia `backend/.env.example` a `backend/.env` y completa:

```bash
SENDGRID_API_KEY=      # API key de SendGrid
FROM_EMAIL=tomatocostarica@gmail.com   # remitente verificado en SendGrid
CONTACT_EMAIL=tomatocostarica@gmail.com
REPORTS_EMAIL=tomatocostarica@gmail.com

AUTH_USER=              # usuario del cotizador
AUTH_PASS=              # contraseña del cotizador
AUTH_SECRET=            # cadena aleatoria larga, ej: openssl rand -hex 32

PORT=3000
NODE_ENV=production
```

El login del cotizador (`login.html`) ya no valida credenciales en el navegador: llama a `POST /api/auth/login`, que verifica `AUTH_USER`/`AUTH_PASS` y devuelve un token firmado. `coti/cotizador.html` valida ese token contra `GET /api/auth/verify` antes de mostrar la página, y el envío de cotizaciones (`POST /api/email/quote`) exige el mismo token.

```bash
cd backend
npm install
npm start
```
