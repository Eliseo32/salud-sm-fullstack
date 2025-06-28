const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Ruta para registrar un nuevo paciente
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;
