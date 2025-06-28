// Cargar las variables de entorno desde el archivo .env al inicio de todo
require('dotenv').config();

// Importaciones de librerías y módulos
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importar el archivo que define todas las relaciones entre los modelos.
// Esto asegura que Sequelize conozca todas las asociaciones antes de arrancar.
require('./models/relations');

// Creación de la aplicación Express
const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite a Express entender el cuerpo de las peticiones en formato JSON

// --- Configuración de Rutas ---
// La aplicación usará los diferentes archivos de rutas para manejar las peticiones
// a las URLs correspondientes.
app.use('/api/v1/centros', require('./routes/centros.routes.js'));
app.use('/api/v1/auth', require('./routes/auth.routes.js'));
app.use('/api/v1/pacientes', require('./routes/pacientes.routes.js'));
app.use('/api/v1/turnos', require('./routes/turnos.routes.js'));
app.use('/api/v1/profesionales', require('./routes/profesionales.routes.js'));
app.use('/api/v1/admin', require('./routes/admin.routes.js'));
app.use('/api/v1/disponibilidad', require('./routes/disponibilidad.routes.js'));


// Ruta Raíz de la API para una simple verificación de que está funcionando
app.get('/', (req, res) => {
    res.send('API de Salud Comunitaria de Santa María - v1');
});

// Puerto del Servidor
// Usa el puerto definido en las variables de entorno (para producción) o el 3000 por defecto (para desarrollo)
const PORT = process.env.PORT || 3000;

// Función asíncrona para arrancar el servidor de forma segura
async function startServer() {
    try {
        // 1. Primero, intenta autenticar la conexión a la base de datos.
        // Si esto falla, la aplicación no continuará.
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // 2. Después de una conexión exitosa, sincroniza los modelos.
        // { force: false } evita que se borren las tablas existentes.
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');

        // 3. Solo si todo lo anterior tuvo éxito, inicia el servidor Express.
        app.listen(PORT, () => {
            console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        // Si ocurre cualquier error durante el arranque, lo muestra en la consola
        // y detiene el proceso para evitar un estado inconsistente.
        console.error('*** ERROR FATAL AL INICIAR EL SERVIDOR ***');
        console.error(error);
        process.exit(1);
    }
}

// Ejecutar la función para arrancar todo el proceso
startServer();
