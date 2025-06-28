// Importar los modelos necesarios de la base de datos
const Turno = require('../models/turno.model');
const Paciente = require('../models/paciente.model');
const Profesional = require('../models/profesional.model');
// Importar el servicio de email para enviar notificaciones
const { enviarConfirmacionTurno } = require('../services/email.service');

/**
 * Controlador para obtener todos los turnos del paciente que ha iniciado sesión.
 * La petición debe estar protegida y contener req.user con los datos del token.
 */
const getMisTurnos = async (req, res) => {
    try {
        // Busca todos los turnos donde el 'pacienteId' coincida con el ID del usuario logueado (req.user.id).
        // 'req.user.id' es añadido por el middleware 'protect'.
        const turnos = await Turno.findAll({
            where: { pacienteId: req.user.id },
            // "Include" funciona como un JOIN en SQL para traer datos de las tablas asociadas.
            include: [
                {
                    model: Profesional,
                    attributes: ['nombre', 'apellido', 'especialidad'] // Solo trae estos campos del profesional.
                }
            ],
            order: [['fecha_hora', 'ASC']] // Ordena los turnos por fecha de más antigua a más nueva.
        });
        // Devuelve la lista de turnos en formato JSON.
        res.json(turnos);
    } catch (error) {
        // En caso de error, lo muestra en la consola y envía una respuesta de error 500.
        console.error("Error al obtener mis turnos:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

/**
 * Controlador para que un paciente solicite un nuevo turno.
 */
const solicitarTurno = async (req, res) => {
    try {
        // Extrae los datos necesarios del cuerpo (body) de la petición POST.
        const { profesionalId, fecha_hora, motivo_consulta } = req.body;
        // Obtiene el ID del paciente del token JWT, asegurando que el paciente solo pueda sacar turnos para sí mismo.
        const pacienteId = req.user.id;

        // Crea el nuevo registro del turno en la base de datos usando el método de Sequelize.
        const turno = await Turno.create({
            pacienteId,
            profesionalId,
            fecha_hora,
            motivo_consulta
        });

        // Una vez creado el turno, busca los datos completos para enviar el email de confirmación.
        const paciente = await Paciente.findByPk(pacienteId);
        const profesional = await Profesional.findByPk(profesionalId);

        // Llama al servicio de email para enviar la notificación de confirmación.
        await enviarConfirmacionTurno(paciente.email, {
            paciente: paciente.nombre,
            profesional: `${profesional.nombre} ${profesional.apellido}`,
            fecha: new Date(fecha_hora).toLocaleDateString('es-AR'), // Formatea la fecha a formato local.
            hora: new Date(fecha_hora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) // Formatea la hora a formato local.
        });

        // Responde con un estado 201 (Creado) y el objeto del turno recién creado.
        res.status(201).json(turno);
    } catch (error) {
        // En caso de error, lo muestra en la consola y envía una respuesta de error 500.
        console.error("Error al solicitar turno:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

/**
 * Controlador para que un paciente cancele uno de sus turnos existentes.
 */
const cancelarTurno = async (req, res) => {
    try {
        // Obtiene el ID del turno de los parámetros de la URL (ej: /turnos/5/cancelar).
        const { id } = req.params;
        // Obtiene el ID del paciente del token para seguridad.
        const pacienteId = req.user.id;

        // Busca el turno en la base de datos, pero con una condición de seguridad adicional:
        // el turno debe tener el 'id' correcto Y pertenecer al 'pacienteId' que hace la petición.
        // Esto evita que un usuario pueda cancelar los turnos de otro.
        const turno = await Turno.findOne({ where: { id, pacienteId } });

        // Si no se encuentra el turno (o no le pertenece al usuario), se devuelve un error 404.
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado o no le pertenece.' });
        }

        // Si se encuentra, se actualiza el estado y se guarda en la base de datos.
        turno.estado = 'Cancelado';
        await turno.save();

        // Responde con un mensaje de éxito.
        res.json({ message: 'Turno cancelado con éxito.' });
    } catch (error)
        // En caso de error, lo muestra en la consola y envía una respuesta de error 500.
        {
        console.error("Error al cancelar turno:", error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Exporta todas las funciones del controlador para que puedan ser usadas en el archivo de rutas.
module.exports = { 
    getMisTurnos, 
    solicitarTurno, 
    cancelarTurno 
};
