import mongoose from 'mongoose'; // Importa Mongoose para manejar la conexión a MongoDB
import ENVIRONMENT from './environment.config.js'; // Importa la configuración del entorno para obtener la cadena de conexión a MongoDB

// Función para conectar a la base de datos
async function connectDB() {
    try {
        await mongoose.connect(ENVIRONMENT.MONGO_DB_CONECTION_STRING); // Conexión exitosa
        console.log('Conexión exitosa a la BD');
    } catch (error) {
        console.log("Error de conexión", error); // Manejo de errores de conexión
    }
}
export default connectDB;