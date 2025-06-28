const Profesional = require('../models/profesional.model');
const CentroDeSalud = require('../models/centro.model');

// Crear un nuevo profesional
const createProfesional = async (req, res) => {
    try {
        const profesional = await Profesional.create(req.body);
        res.status(201).json(profesional);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Obtener todos los profesionales
const getProfesionales = async (req, res) => {
    try {
        const profesionales = await Profesional.findAll({
            include: [{ model: CentroDeSalud, attributes: ['nombre'] }]
        });
        res.json(profesionales);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// --- NUEVAS FUNCIONES ---

// Obtener un profesional por su ID
const getProfesionalById = async (req, res) => {
    try {
        const { id } = req.params;
        const profesional = await Profesional.findByPk(id, {
            include: [{ model: CentroDeSalud, attributes: ['nombre'] }]
        });
        if (!profesional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        res.json(profesional);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Actualizar un profesional
const updateProfesional = async (req, res) => {
    try {
        const { id } = req.params;
        const profesional = await Profesional.findByPk(id);
        if (!profesional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        await profesional.update(req.body);
        res.json(profesional);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Eliminar un profesional
const deleteProfesional = async (req, res) => {
    try {
        const { id } = req.params;
        const profesional = await Profesional.findByPk(id);
        if (!profesional) {
            return res.status(404).json({ message: 'Profesional no encontrado' });
        }
        await profesional.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    createProfesional,
    getProfesionales,
    getProfesionalById,
    updateProfesional,
    deleteProfesional
};
