const express = require('express');
const router = express.Router();

// 1. Importar el controlador completo para los centros de salud
const { 
    getCentros, 
    createCentro, 
    getCentroById, 
    updateCentro, 
    deleteCentro 
} = require('../controllers/centros.controller.js');

// 2. Importar los middlewares de seguridad
const { protect, isAdmin } = require('../middlewares/auth.middleware.js');

// --- RUTAS PÚBLICAS ---
// Cualquiera, incluso sin iniciar sesión, puede ver la lista de centros y el detalle de uno.
router.get('/', getCentros);
router.get('/:id', getCentroById);

// --- RUTAS PROTEGIDAS PARA ADMINS ---
// Solo un usuario que esté logueado (protect) Y que tenga el rol de 'admin' (isAdmin)
// puede crear, actualizar o eliminar un centro de salud.
router.post('/', protect, isAdmin, createCentro);
router.put('/:id', protect, isAdmin, updateCentro);
router.delete('/:id', protect, isAdmin, deleteCentro);

module.exports = router;
