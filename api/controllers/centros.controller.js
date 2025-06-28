const CentroDeSalud = require('../models/centro.model');

// Función para obtener todos los centros de salud
const getCentros = async (req, res) => {
    try {
        const centros = await CentroDeSalud.findAll();
        res.json(centros);
    } catch (error) {
        console.error('Error al obtener los centros de salud:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Función para crear un nuevo centro de salud
const createCentro = async (req, res) => {
    try {
        const nuevoCentro = req.body;
        const centroCreado = await CentroDeSalud.create(nuevoCentro);
        res.status(201).json(centroCreado);
    } catch (error) {
        console.error('Error al crear el centro de salud:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// --- NUEVA FUNCIÓN ---
// Función para obtener un centro por su ID
const getCentroById = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
        const centro = await CentroDeSalud.findByPk(id); // findByPk busca por Primary Key

        if (!centro) {
            // Si no se encuentra el centro, devolvemos un error 404
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        res.json(centro);
    } catch (error) {
        console.error('Error al obtener el centro de salud:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// --- NUEVA FUNCIÓN ---
// Función para actualizar un centro de salud
const updateCentro = async (req, res) => {
    try {
        const { id } = req.params;
        const centro = await CentroDeSalud.findByPk(id);

        if (!centro) {
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        // El método update actualiza el objeto con los datos del body
        await centro.update(req.body);

        res.json(centro); // Devolvemos el centro actualizado
    } catch (error) {
        console.error('Error al actualizar el centro de salud:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// --- NUEVA FUNCIÓN ---
// Función para eliminar un centro de salud
const deleteCentro = async (req, res) => {
    try {
        const { id } = req.params;
        const centro = await CentroDeSalud.findByPk(id);

        if (!centro) {
            return res.status(404).json({ message: 'Centro de salud no encontrado' });
        }

        // El método destroy elimina el registro de la DB
        await centro.destroy();

        res.status(204).send(); // Respondemos con 204 (No Content) para indicar éxito
    } catch (error) {
        console.error('Error al eliminar el centro de salud:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// Exportamos todas las funciones
module.exports = {
    getCentros,
    createCentro,
    getCentroById,
    updateCentro,
    deleteCentro
};
