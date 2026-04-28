import ServerError from "../helpers/error.helper.js";
import workspaceMemberRepository from "../repositories/member.repository.js";

async function verifyWorkspaceMember(req, res, next) {
    try {
        const user = req.user;
        const workspaceId = req.params.workspace_id;

        if (!workspaceId) {
            throw new ServerError("ID del espacio de trabajo es requerido", 400)
        }

        const member = await workspaceMemberRepository.isMemberPartOfWorkspaceById(
            user.id,
            workspaceId
        )

        if (!member) {
            return res.status(403).json({
                success: false,
                message: "No tenés permisos para realizar esta acción"
            })
        }

        req.member = member
        next();
    } catch (error) {
        if (error instanceof ServerError) {
            return res.status(error.status).json({
                success: false,
                status: error.status,
                message: error.message
            })
        }
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error inesperado en el servidor"
        })
    }
}

export default verifyWorkspaceMember;