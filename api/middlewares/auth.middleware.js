const jwt = require('jsonwebtoken');
const Paciente = require('../models/paciente.model'); // Necesitamos el modelo para obtener el rol

const protect = async (req, res, next) => {
    let token;

    // Buscamos el token en la cabecera 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Obtenemos el token de la cabecera (formato: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificamos el token con nuestra clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Obtenemos el usuario de la DB y lo añadimos a la petición (sin la contraseña)
            // Esto nos asegura que el usuario todavía existe y nos da sus datos actualizados, como el rol.
            req.user = await Paciente.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            // 4. Llamamos a next() para que continúe al siguiente middleware o controlador
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token falló' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

const isAdmin = (req, res, next) => {
    // Este middleware se usa DESPUÉS de 'protect',
    // por lo que ya tenemos acceso a req.user con sus datos de la DB.
    if (req.user && req.user.rol === 'admin') {
        next(); // Si es admin, continúa
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

module.exports = { protect, isAdmin };