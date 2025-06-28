const CentroDeSalud = require('./centro.model');
const Paciente = require('./paciente.model');
const Profesional = require('./profesional.model');
const Turno = require('./turno.model');
const Disponibilidad = require('./disponibilidad.model');

// Un Centro de Salud tiene muchos Profesionales
CentroDeSalud.hasMany(Profesional, { foreignKey: 'centroId' });
Profesional.belongsTo(CentroDeSalud, { foreignKey: 'centroId' });

// Un Paciente puede tener muchos Turnos
Paciente.hasMany(Turno, { foreignKey: 'pacienteId' });
Turno.belongsTo(Paciente, { foreignKey: 'pacienteId' });

// Un Profesional puede tener muchos Turnos
Profesional.hasMany(Turno, { foreignKey: 'profesionalId' });
Turno.belongsTo(Profesional, { foreignKey: 'profesionalId' });

// Un Profesional puede tener muchos horarios de Disponibilidad
Profesional.hasMany(Disponibilidad, { foreignKey: 'profesionalId' });
Disponibilidad.belongsTo(Profesional, { foreignKey: 'profesionalId' });
