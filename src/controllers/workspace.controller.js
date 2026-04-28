import workspaceMemberRepository from "../repositories/member.repository.js"
import memberWorkspaceService from "../services/member-workspace.service.js"
import workspaceService from "../services/workspace.service.js"
import ServerError from "../helpers/error.helper.js"
import AVAILABLE_MEMBER_ROLES from "../constants/member-roles.constant.js"
import AVAILABLE_INVITATION_RESPONSES from "../constants/invitation-responses.constant.js"
import ENVIRONMENT from "../config/environment.config.js"

class WorkspaceController {
    async getWorkspaces(request, response, next) {
        try {
            //Cliente consultante
            const user = request.user

            //Traer la lista de espacios de trabajo asociados al usuario
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id)
            response.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajo obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        }
        catch (error) {
            next(error)
        }
    }

    async getArchivedWorkspaces(request, response, next) {
        try {
            const user = request.user
            const workspaces = await workspaceMemberRepository.getArchivedWorkspaceListByUserId(user.id)
            response.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajo archivados obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        }
        catch (error) {
            next(error)
        }
    }

    async create(request, response, next) {
        try {
            const { title, description } = request.body
            const user = request.user
            await workspaceService.create(
                title,
                description,
                null,
                user.id
            )

            return response.status(201).json({
                ok: true,
                status: 201,
                message: "Espacio de trabajo creado con éxito"
            })
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        const { workspace_id } = req.params
        try {
            const workspace = await workspaceService.getOne(workspace_id)
            const members = await memberWorkspaceService.getMemberList(workspace_id)
            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace,
                        members: members
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }
    async update(request, response, next) {
        const workspace_id = request.params.workspace_id || request.body.workspace_id
        const { title, description } = request.body
        try {
            if (!workspace_id) {
                throw new ServerError('El ID del espacio de trabajo es requerido', 400)
            }
            const user = request.user
            const member = await workspaceMemberRepository.isMemberPartOfWorkspaceById(user.id, workspace_id)
            const memberRole = member?.role || member?.workspace_member_role
            if (!member || ![AVAILABLE_MEMBER_ROLES.ADMIN, AVAILABLE_MEMBER_ROLES.OWNER].includes(memberRole)) {
                throw new ServerError('No tienes permisos para actualizar este espacio de trabajo', 403)
            }
            const workspace = await workspaceService.update(workspace_id, title, description)
            response.json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo actualizado',
                data: { workspace }
            })
        } catch (error) {
            next(error)
        }
    }

    async respondToInvitation(req, res, next) {
        const { token } = req.query
        try {
            const result = await memberWorkspaceService.respondToInvitation(token)
            
            // Redireccionamos al frontend con un parámetro de éxito
            const redirectUrl = `${ENVIRONMENT.URL_FRONTEND}/login?invitation_status=${result.workspace_member_accept_invitation}`
            return res.redirect(redirectUrl)

        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        const { workspace_id } = req.params 
        try {
            await workspaceService.deleteWorkspaceById(workspace_id)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo eliminado con éxito'
            })
        } catch (error) {
            next(error)
        }
    }

    async restore(req, res, next) {
        const { workspace_id } = req.params 
        try {
            await workspaceService.restoreWorkspaceById(workspace_id)
            res.status(200).json({
                ok: true,
                status: 200,
                message: 'Espacio de trabajo restaurado con éxito'
            })
        } catch (error) {
            next(error)
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController