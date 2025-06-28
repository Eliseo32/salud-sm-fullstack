const Paciente = require('../models/paciente.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { enviarEmailBienvenida } = require('../services/email.service');

// Función para registrar un nuevo paciente
const register = async (req, res) => {
    try {
        // Creamos el paciente con los datos del body.
        // La contraseña se hasheará automáticamente gracias al hook del modelo.
        const paciente = await Paciente.create(req.body);

        // Enviar email de bienvenida después de crear el usuario con éxito
        await enviarEmailBienvenida(paciente.email, paciente.nombre);

        res.status(201).json({ message: 'Paciente registrado con éxito', paciente });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Función para iniciar sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si el paciente existe en la base de datos
        const paciente = await Paciente.findOne({ where: { email } });
        if (!paciente) {
            return res.status(401).json({ message: 'Credenciales inválidas' }); // Mensaje genérico por seguridad
        }

        // 2. Comparar la contraseña enviada con la hasheada en la base de datos
        const isMatch = await bcrypt.compare(password, paciente.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' }); // Mensaje genérico
        }

        // 3. Si todo es correcto, crear el payload para el token incluyendo el ROL.
        const payload = { 
            id: paciente.id, 
            nombre: paciente.nombre,
            rol: paciente.rol
        };
        
        // 4. Firmar el token con una clave secreta y establecer un tiempo de expiración
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'tu_secreto_por_defecto', 
            { expiresIn: '1h' }
        );

        // 5. Enviar el token al cliente
        res.json({ message: 'Login exitoso', token });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    register,
    login
};
