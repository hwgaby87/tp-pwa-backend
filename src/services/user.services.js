import userRepository from "../repository/user.repository.js";
import workspaceMemberRepository from "../repository/member.repository.js";
import ServerError from "../helpers/error.helper.js";

class UserService {
    async getAllUsers() {
        try {
            return await userRepository.getAll();
        } catch (error) {
            throw new ServerError("Error al obtener la lista de usuarios", 500);
        }
    }

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