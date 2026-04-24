import AVAILABLE_MEMBER_ROLES from "../constants/member-roles.constants.js";
import ServerError from "../helpers/error.helper.js";
import workspaceMemberRepository from "../repository/member.repository.js";

function verifyMemberWorkspaceRoleMiddleware(valid_roles = []) {
    

    return async function (req, res, next) {
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
                throw new ServerError("No pertenece al workspace o sin permisos", 403)
            }

            const memberRole = member.role || member.workspace_member_role
            if (valid_roles.length >= 1 && !valid_roles.includes(memberRole)) {
                throw new ServerError("Rol no válido", 403)
            }

            req.member = member
            next();
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json({
                    ok: false,
                    status: error.status,
                    message: error.message
                })
            }
            return res.status(500).json({
                ok: false,
                status: 500,
                message: "Error inesperado en el servidor"
            })
        }
    }
}


export default verifyMemberWorkspaceRoleMiddleware;