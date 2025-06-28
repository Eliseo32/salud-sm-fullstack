const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// --- LOGS DE DIAGNÓSTICO ---
console.log(`[DIAGNÓSTICO] Entorno NODE_ENV: ${process.env.NODE_ENV}`);

const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    // Mostramos solo una parte de la URL por seguridad
    console.log(`[DIAGNÓSTICO] Variable DATABASE_URL encontrada. Comienza con: ${dbUrl.substring(0, 25)}...`);
} else {
    console.log('[DIAGNÓSTICO] ¡ERROR! La variable DATABASE_URL no fue encontrada.');
}
// --- FIN DE LOGS ---


if (process.env.NODE_ENV === 'production' && dbUrl) {
    // --- CONFIGURACIÓN PARA PRODUCCIÓN (RENDER + NEON) ---
    console.log('[INFO] Intentando conectar a la base de datos de producción (PostgreSQL)...');
    sequelize = new Sequelize(dbUrl, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
} else {
    // --- CONFIGURACIÓN PARA DESARROLLO LOCA (XAMPP) ---
    console.log('[INFO] Usando configuración de desarrollo local (MySQL)...');
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql'
        }
    );
}

module.exports = sequelize;
