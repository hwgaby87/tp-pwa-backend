import WorkspaceModel from "../models/workspace.model.js";
import WorkspaceDTO from "../dto/workspace.dto.js";
import ServerError from "../helpers/error.helper.js";

class WorkspaceRepository {
    async create(title, description, url_image, active) {
        try {
            const workspace = await WorkspaceModel.create({
                title: title,
                description: description,
                url_image,
                active
            })
            return new WorkspaceDTO(workspace)
        } catch (error) {
            if (error.code === 11000) {
                throw new ServerError("El título de este espacio de trabajo ya está en uso", 400);
            }
            throw new ServerError("Error al crear el espacio de trabajo en la base de datos", 500);
        }
    };

    async deleteById(workspace_id) {
        try {
            await WorkspaceModel.findByIdAndUpdate(workspace_id, { active: false });
        } catch (error) {
            throw new ServerError("Error al eliminar el espacio de trabajo", 500);
        }
    };

    async restoreById(workspace_id) {
        try {
            await WorkspaceModel.findByIdAndUpdate(workspace_id, { active: true });
        } catch (error) {
            throw new ServerError("Error al restaurar el espacio de trabajo", 500);
        }
    };

    async getById(workspace_id) {
        try {
            const workspace = await WorkspaceModel.findOne({ _id: workspace_id, active: true })
            return workspace && new WorkspaceDTO(workspace)
        } catch (error) {
            throw new ServerError("Error al obtener el espacio de trabajo", 500);
        }
    };

    async updateById(workspace_id, new_workspace_props) {
        try {
            const new_workspace = await WorkspaceModel.findOneAndUpdate(
                { _id: workspace_id, active: true },
                new_workspace_props, 
                { new: true }
            )
            return new_workspace && new WorkspaceDTO(new_workspace);
        } catch (error) {
            if (error.code === 11000) {
                throw new ServerError("El título proporcionado ya está en uso", 400);
            }
            throw new ServerError("Error al actualizar el espacio de trabajo", 500);
        }
    };
}
const workspaceRepository = new WorkspaceRepository()

export default workspaceRepository;
