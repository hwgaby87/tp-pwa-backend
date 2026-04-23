import ServerError from "../helpers/error.helper.js"
import workspaceRepository from "../repository/workspace.repository.js"
import memberWorkspaceService from "./member-workspace.services.js"

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title || !description || !url_image) {
            throw new ServerError('Todos los campos son obligatorios', 400)
        }
        const workspace_created = await workspaceRepository.create(title, description, url_image)
        await memberWorkspaceService.create(
            user_id,
            workspace_created._id,
            'owner'
        )
        return workspace_created
    }
    async getOne(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un ID", 400)
        }

        try {
            const workspace = await workspaceRepository.getById(workspace_id)

            if (!workspace) {
                throw new ServerError("El espacio de trabajo no existe", 404)
            }

            return workspace
        } catch (error) {
            throw error
        }
    }

    async update(workspace_id, title, description) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un ID", 400)
        }
        if (!title && !description) {
            throw new ServerError("Debe proporcionar al menos un campo para actualizar", 400)
        }

        const new_workspace_props = {}
        if (title) new_workspace_props.title = title
        if (description) new_workspace_props.description = description

        try {
            const updatedWorkspace = await workspaceRepository.updateById(workspace_id, new_workspace_props)
            if (!updatedWorkspace) {
                throw new ServerError("El espacio de trabajo no existe", 404)
            }
            return updatedWorkspace
        } catch (error) {
            throw error
        }
    }

    async deleteWorkspaceById(workspace_id) {
            if (!workspace_id) {
                throw new ServerError("ID de espacio de trabajo es requerido", 400);
            }
            try {
                const workspace = await workspaceRepository.getById(workspace_id);
                if (!workspace) {
                    throw new ServerError("Espacio de trabajo no encontrado", 404);
                }
                await workspaceRepository.deleteById(workspace_id);
                return { message: "Espacio de trabajo eliminado exitosamente" };
            } catch (error) {
                if (error instanceof ServerError) throw error;
                throw new ServerError("Error al eliminar el espacio de trabajo", 500);
            }
        }
}
const workspaceService = new WorkspaceService()
export default workspaceService