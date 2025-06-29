require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

require('./models/relations');

const app = express();

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN ---
const frontendURL = process.env.VITE_FRONTEND_URL;
console.log(`[CORS] La URL del frontend permitida es: ${frontendURL}`); // Log de diagnóstico

const corsOptions = {
  origin: function (origin, callback) {
    // La whitelist ahora es solo la URL del frontend
    if (frontendURL === origin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por la política de CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuración de Rutas
app.use('/api/v1/centros', require('./routes/centros.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/pacientes', require('./routes/pacientes.routes'));
app.use('/api/v1/turnos', require('./routes/turnos.routes'));
app.use('/api/v1/profesionales', require('./routes/profesionales.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/disponibilidad', require('./routes/disponibilidad.routes'));

module.exports = app;
