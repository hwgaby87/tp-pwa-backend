import User from "../models/user.model.js"
import UserDTO from "../dtos/user.dto.js"
import ServerError from "../helpers/error.helper.js"

/**
 * UserRepository
 * El patrón "Repositorio" se utiliza para aislar a la capa de servicios de los
 * detalles concretos de la base de datos (MongoDB/Mongoose en este caso).
 * Todas las consultas (guardar, buscar, eliminar, actualizar) a la tabla de
 * usuarios se centralizan aquí.
 */
class UserRepository {

    /**
     * Crea un nuevo usuario en la base de datos.
     */
    async create(username, email, password) {
        try {
            await User.create({
                name: username,
                email: email,
                password: password
            })
        } catch (error) {
            console.error("Error en UserRepository.create:", error);
            // 11000 es el código de error de MongoDB para violación de clave única (ej: email repetido)
            if (error.code === 11000) 
            {   
                // keyPattern es un objeto que MongoDB incluye en el error para indicar qué campo causó la violación
                if (error.keyPattern?.email) throw new ServerError("El email ya está registrado", 400);
                if (error.keyPattern?.name) throw new ServerError("El nombre de usuario ya está registrado", 400);
            }
            throw new ServerError("Error interno en la base de datos al crear usuario", 500);
        }
    }

    /**
     * Elimina un usuario buscando por su ID.
     */
    async deleteById(user_id) {
        try {
            await User.findByIdAndDelete(user_id)
        } catch (error) {
            console.error("Error en UserRepository.deleteById:", error);
            throw new ServerError("Error al eliminar el usuario", 500);
        }
    }

    /**
     * Obtiene un usuario por su ID y lo devuelve formateado como DTO (Data Transfer Object).
     * El DTO sirve para ocultar campos sensibles como contraseñas antes de enviarlo.
     */
    async getById(user_id) {
        try {
            const user = await User.findById(user_id)
            return user && new UserDTO(user)
        } catch (error) {
            console.error("Error en UserRepository.getById:", error);
            throw new ServerError("Error al obtener el usuario", 500);
        }
    }

    /**
     * Obtiene todos los usuarios, pero excluye (-password) la contraseña de la búsqueda.
     */
    async getAll() {
        try {
            const users = await User.find({}, '-password')
            return users.map(user => new UserDTO(user))
        } catch (error) {
            console.error("Error en UserRepository.getAll:", error);
            throw new ServerError("Error al obtener los usuarios", 500);
        }
    }

    /**
     * Actualiza propiedades específicas de un usuario buscando por su ID.
     */
    async updateById(id, new_user_props) {
        try {
            const new_user = await User.findByIdAndUpdate(
                id,
                new_user_props,
                { returnDocument: 'after' } // 'after' hace que devuelva el documento YA actualizado
            )
            return new_user && new UserDTO(new_user)
        } catch (error) {
            console.error("Error en UserRepository.updateById:", error);
            if (error.code === 11000) {
                throw new ServerError("Los datos proporcionados ya están en uso por otro usuario", 400);
            }
            throw new ServerError("Error al actualizar el usuario", 500);
        }
    }

    /**
     * Busca un usuario por su email.
     */
    async getByEmail(email) {
        try {
            const user = await User.findOne({ email: email })
            return user && new UserDTO(user)
        } catch (error) {
            console.error("Error en UserRepository.getByEmail:", error);
            throw new ServerError(`Error al buscar usuario por email: ${error.message}`, 500);
        }
    }

    /**
     * Obtiene un usuario cualquiera (útil para pruebas o sacar un registro).
     */
    async getUser() {
        try {
            const user = await User.findOne()
            return user && new UserDTO(user)
        } catch (error) {
            console.error("Error en UserRepository.getUser:", error);
            throw new ServerError("Error al obtener usuario", 500);
        }
    }

    /**
     * Busca un usuario por su nombre.
     */
    async getByUsername(name) {
        try {
            const user = await User.findOne({ name: name })
            return user && new UserDTO(user)
        } catch (error) {
            console.error("Error en UserRepository.getByUsername:", error);
            throw new ServerError("Error al buscar usuario por nombre", 500);
        }
    }
}

const userRepository = new UserRepository()

export default userRepository