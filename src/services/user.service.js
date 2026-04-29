/**
 * @file user.service.js
 * @description Servicio de lógica de negocio para la gestión de usuarios.
 * Interactúa con los repositorios para realizar validaciones antes de persistir datos.
 */

import userRepository from "../repositories/user.repository.js";
import workspaceMemberRepository from "../repositories/member.repository.js";
import ServerError from "../helpers/error.helper.js";

class UserService {
    /**
     * Obtiene todos los usuarios del sistema.
     * @returns {Promise<Array>} Lista de usuarios.
     */
        try {
            return await userRepository.getAll();
        } catch (error) {
            throw new ServerError("Error al obtener la lista de usuarios", 500);
        }
    }

    /**
     * Obtiene un usuario por su ID.
     * @param {string} userId - ID del usuario.
     * @returns {Promise<Object>} El usuario encontrado.
     */
    async getUserById(userId) {
        if (!userId) {
            throw new ServerError("El ID del usuario es obligatorio", 400);
        }
        try {
            const user = await userRepository.getById(userId);
            if (!user) {
                throw new ServerError("El usuario no existe", 404);
            }
            return user;
        } catch (error) {
            if (error instanceof ServerError) throw error;
            throw new ServerError("Error al obtener el usuario", 500);
        }
    }

    /**
     * Elimina un usuario verificando restricciones (ej: si es único miembro de un WS).
     * @param {string} userId - ID del usuario.
     * @returns {Promise<Object>} Mensaje de éxito.
     */
    async deleteUserById(userId) {
        if (!userId) {
            throw new ServerError("El ID del usuario es obligatorio", 400);
        }
        try {
            const user = await userRepository.getById(userId);
            if (!user) {
                throw new ServerError("El usuario no existe", 404);
            }

            // Verificar si el usuario es el único miembro en alguno de sus workspaces
            const userWorkspaces = await workspaceMemberRepository.getWorkspaceListByUserId(userId);
            
            for (const ws of userWorkspaces) {
                const membersCount = await workspaceMemberRepository.countMembersByWorkspaceId(ws.workspace_id);
                if (membersCount <= 1) {
                    throw new ServerError(`No se puede eliminar al usuario porque es el único miembro del espacio "${ws.workspace_title}". Debe invitar a alguien más o eliminar el espacio primero.`, 400);
                }
            }

            await userRepository.deleteById(userId);
            return { message: "Usuario eliminado exitosamente" };
        } catch (error) {
            if (error instanceof ServerError) throw error;
            throw new ServerError("Error al eliminar el usuario", 500);
        }
    }

    /**
     * Actualiza las propiedades de un usuario.
     * @param {string} userId - ID del usuario.
     * @param {Object} newUserProps - Propiedades a actualizar.
     * @returns {Promise<Object>} El usuario actualizado.
     */
    async updateUserById(userId, newUserProps) {
        if (!userId) {
            throw new ServerError("El ID del usuario es obligatorio", 400);
        }
        if (!newUserProps || Object.keys(newUserProps).length === 0) {
            throw new ServerError("No se proporcionaron datos para actualizar", 400);
        }
        try {
            const user = await userRepository.getById(userId);
            if (!user) {
                throw new ServerError("El usuario no existe", 404);
            }
            const updatedUser = await userRepository.updateById(userId, newUserProps);
            if (!updatedUser) {
                throw new ServerError("El usuario no existe", 404);
            }
            return updatedUser;
        } catch (error) {
            if (error instanceof ServerError) throw error;
            throw new ServerError("Error al actualizar el usuario", 500);
        }
    }
}

export default new UserService();