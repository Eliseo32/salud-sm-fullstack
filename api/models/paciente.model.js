const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // Importamos bcrypt

const Paciente = sequelize.define('Paciente', {
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY
    },
    telefono: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Validación para que sea un email válido
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // --- CAMPO AÑADIDO ---
    rol: {
        type: DataTypes.STRING,
        defaultValue: 'paciente' // 'paciente' o 'admin'
    }
}, {
    tableName: 'Pacientes',
    timestamps: true,
    // --- HOOK DE SEQUELIZE ---
    hooks: {
        // Este "hook" se ejecuta automáticamente ANTES de crear un paciente
        beforeCreate: async (paciente) => {
            // Generamos un "salt" y hasheamos la contraseña
            const salt = await bcrypt.genSalt(10);
            paciente.password = await bcrypt.hash(paciente.password, salt);
        }
    }
});

module.exports = Paciente;