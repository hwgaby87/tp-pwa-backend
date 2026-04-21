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
}
const workspaceService = new WorkspaceService()
export default workspaceService