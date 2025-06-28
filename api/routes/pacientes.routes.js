const express = require('express');
const router = express.Router();
const { getMiPerfil } = require('../controllers/pacientes.controller.js');
const { protect } = require('../middlewares/auth.middleware'); // <-- Importamos nuestro guardia

// Aplicamos el middleware 'protect' a esta ruta.
// Solo si 'protect' dice que sí, se ejecutará 'getMiPerfil'.
router.get('/mi-perfil', protect, getMiPerfil);

module.exports = router;
