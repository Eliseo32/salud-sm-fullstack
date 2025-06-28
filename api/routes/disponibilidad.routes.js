const express = require('express');
const router = express.Router();
const controller = require('../controllers/disponibilidad.controller.js');
const { protect, isAdmin } = require('../middlewares/auth.middleware.js');

router.get('/profesional/:profesionalId/horarios', protect, controller.getHorariosDisponibles);
router.get('/profesional/:profesionalId', protect, isAdmin, controller.getDisponibilidadPorProfesional);
router.post('/profesional/:profesionalId', protect, isAdmin, controller.addDisponibilidad);
router.delete('/:id', protect, isAdmin, controller.deleteDisponibilidad);

module.exports = router;
