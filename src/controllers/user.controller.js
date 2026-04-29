import userService from "../services/user.service.js";
import authService from "../services/auth.service.js";

class UserController {
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
            const filePath = `/public/uploads/profile-pictures/${req.file.filename}`;
            
            // Actualizar el usuario con la nueva ruta de la imagen
            const updatedUser = await userService.updateUserById(userId, { image: filePath });

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