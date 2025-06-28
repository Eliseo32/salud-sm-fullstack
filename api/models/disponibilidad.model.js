const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Disponibilidad = sequelize.define('Disponibilidad', {
    dia_semana: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'Disponibilidades',
    timestamps: false
});

module.exports = Disponibilidad;
