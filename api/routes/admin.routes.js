const express = require('express');
const router = express.Router();
const { getAllTurnos } = require('../controllers/admin.controller.js');
const { protect, isAdmin } = require('../middlewares/auth.middleware.js');

// Aplicamos los middlewares a TODAS las rutas de este archivo.
// El usuario debe estar logueado (protect) Y ser un admin (isAdmin).
router.use(protect, isAdmin);

// Definimos la ruta para obtener todos los turnos
router.get('/turnos', getAllTurnos);

// Aquí podríamos añadir más rutas de admin en el futuro
// ej: router.get('/estadisticas', getEstadisticas);

module.exports = router;
