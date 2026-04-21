import ServerError from "../helpers/error.helper.js";
import workspaceMemberRepository from "../repository/member.repository.js";

function verifyMemberWorkspaceRoleMiddleware(valid_roles = []) {
    return async function (req, res, next) {
        try {
            const user = req.user; //Que significa? Debe ir luego del authMiddleware y NECESITA tener  el authMiddleware
            const workspaceId = req.params.workspace_id;
            if (!workspaceId) {
                throw new ServerError({
                    status: 400,
                    message: "ID del espacio de trabajo es requerido",
                    ok: false
                })
            }
            const member = await workspaceMemberRepository.isMemberPartOfWorkspaceById(
                user.id,
                workspaceId
            )
            if (!member) {
                throw new ServerError({
                    status: 403,
                    message: "El usuario no pertenece al espacio de trabajo o no tiene permisos para acceder",
                    ok: false
                })
            }
            if (valid_roles.length >= 1 && !valid_roles.includes(member.role)) {
                throw new ServerError('Rol no válido', 403)
            }

            req.member = member
            next();
        } catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error al verificar espacio de trabajo y membresia', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Error inesperado en el servidor"
                    }
                )
            }
        }
    }
}

export default verifyMemberWorkspaceRoleMiddleware;