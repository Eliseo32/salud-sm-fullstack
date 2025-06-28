const { Op } = require('sequelize');
const Disponibilidad = require('../models/disponibilidad.model');
const Turno = require('../models/turno.model');

// ... (getDisponibilidadPorProfesional, addDisponibilidad, deleteDisponibilidad no cambian)
const getDisponibilidadPorProfesional = async (req, res) => {
    try {
        const { profesionalId } = req.params;
        const horarios = await Disponibilidad.findAll({ where: { profesionalId }, order: [['dia_semana', 'ASC']] });
        res.json(horarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la disponibilidad' });
    }
};
const addDisponibilidad = async (req, res) => {
    try {
        const { profesionalId } = req.params;
        const { dia_semana, hora_inicio, hora_fin } = req.body;
        const nuevaDisponibilidad = await Disponibilidad.create({ profesionalId, dia_semana, hora_inicio, hora_fin });
        res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
        res.status(500).json({ message: 'Error al añadir la disponibilidad' });
    }
};
const deleteDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        await Disponibilidad.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la disponibilidad' });
    }
};

// --- FUNCIÓN CORREGIDA ---
const getHorariosDisponibles = async (req, res) => {
    try {
        const { profesionalId } = req.params;
        const { fecha } = req.query; // ej: "2025-07-28"

        // Usamos new Date() para interpretar la fecha. Al no tener hora, JS la interpreta como UTC.
        const fechaSeleccionada = new Date(fecha);
        // getUTCDay() nos da el día de la semana correcto (0=Dom, 1=Lun) para esa fecha.
        const diaSemana = fechaSeleccionada.getUTCDay();

        const horarioLaboral = await Disponibilidad.findOne({
            where: { profesionalId, dia_semana: diaSemana }
        });

        if (!horarioLaboral) {
            return res.json([]);
        }

        const inicioDelDiaUTC = new Date(`${fecha}T00:00:00.000Z`);
        const finDelDiaUTC = new Date(`${fecha}T23:59:59.999Z`);

        const turnosReservados = await Turno.findAll({
            where: {
                profesionalId,
                fecha_hora: { [Op.between]: [inicioDelDiaUTC, finDelDiaUTC] },
                estado: { [Op.ne]: 'Cancelado' }
            }
        });
        const horasReservadas = new Set(turnosReservados.map(t => t.fecha_hora.toISOString()));

        const slotsDisponibles = [];
        const duracionSlot = 30;

        // --- ESTA ES LA CORRECCIÓN CLAVE ---
        // Creamos las fechas combinando el string de fecha y el de hora, SIN la 'Z'.
        // Esto le dice a JavaScript: "interpreta esta hora en la zona horaria del servidor".
        let horaActual = new Date(`${fecha}T${horarioLaboral.hora_inicio}`);
        const horaFin = new Date(`${fecha}T${horarioLaboral.hora_fin}`);

        while (horaActual < horaFin) {
            // Comparamos el formato universal (ISO String) para evitar errores.
            if (!horasReservadas.has(horaActual.toISOString())) {
                slotsDisponibles.push(new Date(horaActual));
            }
            horaActual.setMinutes(horaActual.getMinutes() + duracionSlot);
        }

        res.json(slotsDisponibles);

    } catch (error) {
        console.error("Error al calcular horarios disponibles:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    getDisponibilidadPorProfesional,
    addDisponibilidad,
    deleteDisponibilidad,
    getHorariosDisponibles
};
