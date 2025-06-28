const Turno = require('../models/turno.model');
const Paciente = require('../models/paciente.model');
const Profesional = require('../models/profesional.model');

// Función para que el admin obtenga TODOS los turnos del sistema
const getAllTurnos = async (req, res) => {
    try {
        const turnos = await Turno.findAll({
            // Incluimos los modelos asociados para tener la información completa
            include: [
                {
                    model: Paciente,
                    attributes: ['nombre', 'apellido', 'dni'] // Solo los campos necesarios
                },
                {
                    model: Profesional,
                    attributes: ['nombre', 'apellido', 'especialidad']
                }
            ],
            // Opcional: ordenar por fecha
            order: [['fecha_hora', 'DESC']]
        });

        res.json(turnos);

    } catch (error) {
        console.error("Error al obtener todos los turnos:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    getAllTurnos
};
