import ServerError from "../helpers/error.helper.js"
import workspaceRepository from "../repository/workspace.repository.js"
import memberWorkspaceService from "./member-workspace.services.js"

class WorkspaceService {
    async create(title, description, url_image, user_id) {
        if (!title) {
            throw new ServerError('El nombre es obligatorio', 400)
        }

        const default_url = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(title) + '&background=random'
        const final_url = url_image || default_url

        const workspace_created = await workspaceRepository.create(title, description || '', final_url)
        await memberWorkspaceService.create(
            user_id,
            workspace_created._id,
            'owner',
            'accepted'
        )
        return workspace_created
    }
    async getOne(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("El ID del espacio de trabajo es obligatorio", 400)
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
            throw new ServerError("El ID del espacio de trabajo es obligatorio", 400)
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
            throw new ServerError("El ID del espacio de trabajo es obligatorio", 400);
        }
        try {
            const workspace = await workspaceRepository.getById(workspace_id);
            if (!workspace) {
                throw new ServerError("El espacio de trabajo no existe", 404);
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