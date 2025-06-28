const express = require('express');
const router = express.Router();
const { getMisTurnos, solicitarTurno, cancelarTurno } = require('../controllers/turnos.controller');
const { protect } = require('../middlewares/auth.middleware');

// Aplicamos el middleware 'protect' a TODAS las rutas de este archivo
router.use(protect);

router.get('/', getMisTurnos);
router.post('/', solicitarTurno);
router.put('/:id/cancelar', cancelarTurno);

module.exports = router;
