require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importar el archivo que define todas las relaciones
require('./models/relations');

const app = express();

// --- CONFIGURACIÓN DE CORS PARA PRODUCCIÓN ---
const whiteList = [process.env.VITE_FRONTEND_URL]; // La URL de tu frontend desde las variables de entorno

const corsOptions = {
  origin: function (origin, callback) {
    // Permitimos peticiones sin origen (como las de Postman o apps móviles) y las de nuestra whitelist
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};

// Usamos la nueva configuración de CORS
app.use(cors(corsOptions));

app.use(express.json());

// Configuración de Rutas (sin cambios)
app.use('/api/v1/centros', require('./routes/centros.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/pacientes', require('./routes/pacientes.routes'));
app.use('/api/v1/turnos', require('./routes/turnos.routes'));
app.use('/api/v1/profesionales', require('./routes/profesionales.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));
app.use('/api/v1/disponibilidad', require('./routes/disponibilidad.routes'));

// Exportamos la app para que Vercel la pueda usar
module.exports = app;
