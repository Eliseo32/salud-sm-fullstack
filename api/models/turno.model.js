const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turno = sequelize.define('Turno', {
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    motivo_consulta: {
        type: DataTypes.TEXT
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'Pendiente' // Pendiente, Confirmado, Cancelado
    }
}, {
    tableName: 'Turnos',
    timestamps: true
});

module.exports = Turno;
