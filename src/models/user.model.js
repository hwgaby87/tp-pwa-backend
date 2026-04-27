import mongoose from 'mongoose'

/**
 * Los "Modelos" representan la estructura de los datos que se guardan en la base de datos.
 * En este caso, usamos Mongoose, que es una librería para interactuar con MongoDB.
 * Un "Schema" (esquema) define qué campos tendrá cada usuario, qué tipo de dato son,
 * y reglas como si son obligatorios (required) o únicos (unique).
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,     // El nombre será texto
            required: true    // Es obligatorio proveer un nombre
        },
        email: {
            type: String,
            required: true,
            unique: true      // No puede haber dos usuarios con el mismo email
        },
        password: {
            type: String,
            required: true
        },
        email_verified: {
            type: Boolean,    // Verdadero o Falso
            default: false,   // Por defecto es falso hasta que verifiquen su correo
            required: true
        },
        created_at: {
            type: Date,
            required: true,
            default: Date.now // Si no se provee, se guarda la fecha actual automáticamente
        },
        image: {
            type: String,
            default: ''
        }
    }
)

// Creamos y exportamos el Modelo a partir del esquema.
// El tercer parámetro 'users' es el nombre de la colección (tabla) en la base de datos MongoDB.
const User = mongoose.model('User', userSchema, 'users')

export default User