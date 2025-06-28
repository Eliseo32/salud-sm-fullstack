const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importamos la conexión

// Definimos el modelo para la tabla 'CentrosDeSalud'
const CentroDeSalud = sequelize.define('CentroDeSalud', {
    // El ID se crea automáticamente por Sequelize
    nombre: {
        type: DataTypes.STRING,
        allowNull: false // No puede ser nulo
    },
    direccion: {
        type: DataTypes.STRING
    },
    lat: {
        type: DataTypes.DECIMAL(10, 8) // Precisión para latitud
    },
    lon: {
        type: DataTypes.DECIMAL(11, 8) // Precisión para longitud
    },
    telefono: {
        type: DataTypes.STRING
    },
    horarios: {
        type: DataTypes.STRING
    }
}, {
    // Opciones adicionales del modelo
    tableName: 'CentrosDeSalud', // Aseguramos que el nombre de la tabla sea exacto
    timestamps: true // Sequelize añadirá las columnas createdAt y updatedAt
});

module.exports = CentroDeSalud;
