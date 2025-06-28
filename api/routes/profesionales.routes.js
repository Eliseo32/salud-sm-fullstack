const express = require('express');
const router = express.Router();

// 1. Importar el controlador completo para profesionales
// Asegúrate de que tu profesionales.controller.js exporte todas estas funciones.
const {
    createProfesional,
    getProfesionales,
    getProfesionalById, // Necesitarás añadir esta función a tu controlador
    updateProfesional,  // Necesitarás añadir esta función a tu controlador
    deleteProfesional   // Necesitarás añadir esta función a tu controlador
} = require('../controllers/profesionales.controller.js');

// 2. Importar los middlewares de seguridad
const { protect, isAdmin } = require('../middlewares/auth.middleware.js');

// --- RUTAS PÚBLICAS ---
// Cualquiera (incluso sin iniciar sesión) puede ver la lista de profesionales y el detalle de uno.
// Esto es útil para que los pacientes puedan ver qué médicos hay antes de registrarse.
router.get('/', getProfesionales);
router.get('/:id', getProfesionalById);

// --- RUTAS PROTEGIDAS PARA ADMINS ---
// Solo un usuario que esté logueado (protect) Y que tenga el rol de 'admin' (isAdmin)
// puede crear, actualizar o eliminar un profesional.
router.post('/', protect, isAdmin, createProfesional);
router.put('/:id', protect, isAdmin, updateProfesional);
router.delete('/:id', protect, isAdmin, deleteProfesional);

module.exports = router;
