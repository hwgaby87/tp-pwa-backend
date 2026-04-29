/**
 * @file user.controller.js
 * @description Controlador para la gestión de usuarios.
 * Maneja operaciones como listar usuarios, obtener un perfil específico, 
 * actualizar datos del usuario y cambiar la foto de perfil.
 */

import userService from "../services/user.service.js";
import authService from "../services/auth.service.js";

class UserController {
    /**
     * Obtiene la lista completa de usuarios registrados.
     * @param {Object} req - Petición de Express.
     * @param {Object} res - Respuesta de Express.
     * @param {Function} next - Middleware next.
     */
    async listUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({
                ok: true,
                status: 200,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Obtiene los datos de un usuario por su ID.
     * @param {Object} req - Petición con id en params.
     * @param {Object} res - Respuesta con los datos del usuario.
     * @param {Function} next - Middleware next.
     */
    async getUser(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            return res.status(200).json({
                ok: true,
                status: 200,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Elimina un usuario por su ID.
     * @param {Object} req - Petición con id en params.
     * @param {Object} res - Respuesta confirmando la eliminación.
     * @param {Function} next - Middleware next.
     */
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUserById(id);
            return res.status(200).json({
                ok: true,
                status: 200,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza la información del usuario (nombre, etc).
     * @param {Object} req - Petición con id en params/body o extraído del token.
     * @param {Object} res - Respuesta con el usuario actualizado.
     * @param {Function} next - Middleware next.
     */
    async updateUser(req, res, next) {
        try {
            const id = req.params.id || req.body.id || req.user?.id;
            const new_user_props = req.body;
            const updated_user = await userService.updateUserById(id, new_user_props);
            return res.status(200).json({
                ok: true,
                status: 200,
                data: updated_user
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Actualiza la foto de perfil del usuario cargándola en Cloudinary.
     * @param {Object} req - Petición con archivo de imagen en req.file.
     * @param {Object} res - Respuesta con los nuevos datos y un token actualizado.
     * @param {Function} next - Middleware next.
     */
    async updateProfilePicture(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    message: "No se ha subido ningún archivo"
                });
            }

            const userId = req.user.id;
            // Con Cloudinary, req.file.path contiene la URL pública de la imagen
            const imageUrl = req.file.path;
            
            // Actualizar el usuario con la nueva URL de la imagen
            const updatedUser = await userService.updateUserById(userId, { image: imageUrl });

            // Generar un nuevo token que incluya la nueva imagen
            const newToken = authService.generateToken(updatedUser);

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Foto de perfil actualizada con éxito",
                data: {
                    user: updatedUser,
                    auth_token: newToken
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();