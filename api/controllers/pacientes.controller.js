const Paciente = require('../models/paciente.model');

// Función para obtener el perfil del paciente logueado
const getMiPerfil = async (req, res) => {
    try {
        // Gracias al middleware, tenemos req.user.id con el ID del paciente
        // Buscamos al paciente pero excluimos el password de la respuesta
        const paciente = await Paciente.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json(paciente);
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    getMiPerfil
};
