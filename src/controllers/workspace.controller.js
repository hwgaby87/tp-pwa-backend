import workspaceMemberRepository from "../repositories/member.repository.js"
import memberWorkspaceService from "../services/member-workspace.service.js"
import workspaceService from "../services/workspace.service.js"
import ServerError from "../helpers/error.helper.js"
import AVAILABLE_MEMBER_ROLES from "../constants/member-roles.constant.js"
import AVAILABLE_INVITATION_RESPONSES from "../constants/invitation-responses.constant.js"
import ENVIRONMENT from "../config/environment.config.js"
import { getSuccessHTML, getErrorHTML } from "../helpers/html-response.helper.js"

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
            
            const isAccepted = result.workspace_member_accept_invitation === AVAILABLE_INVITATION_RESPONSES.ACCEPTED
            const title = isAccepted ? '¡Invitación Aceptada!' : 'Invitación Rechazada'
            const message = isAccepted 
                ? 'Te has unido correctamente al espacio de trabajo. Ya puedes empezar a colaborar con tu equipo.'
                : 'Has rechazado la invitación al espacio de trabajo.'

            return res.send(getSuccessHTML(title, message))

        } catch (error) {
            const errorMessage = error instanceof ServerError ? error.message : "El enlace de invitación es inválido o ha expirado."
            return res.status(error.status || 500).send(getErrorHTML("Error en la Invitación", errorMessage))
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

    /**
     * Actualiza la imagen del workspace.
     * Solo owners y admins pueden cambiarla.
     */
    async updateWorkspaceImage(req, res, next) {
        const { workspace_id } = req.params
        try {
            if (!req.file) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    message: 'No se ha subido ningún archivo'
                })
            }

            const user = req.user
            const member = await workspaceMemberRepository.isMemberPartOfWorkspaceById(user.id, workspace_id)
            const memberRole = member?.role || member?.workspace_member_role
            if (!member || ![AVAILABLE_MEMBER_ROLES.ADMIN, AVAILABLE_MEMBER_ROLES.OWNER].includes(memberRole)) {
                return res.status(403).json({
                    ok: false,
                    status: 403,
                    message: 'Solo el dueño o administrador puede cambiar la imagen del workspace'
                })
            }

            // req.file.path contiene la URL pública de Cloudinary
            const imageUrl = req.file.path
            const updatedWorkspace = await workspaceService.updateImage(workspace_id, imageUrl)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Imagen del workspace actualizada con éxito',
                data: { workspace: updatedWorkspace }
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * Elimina la imagen del workspace (vuelve al avatar por defecto).
     */
    async deleteWorkspaceImage(req, res, next) {
        const { workspace_id } = req.params
        try {
            const user = req.user
            const member = await workspaceMemberRepository.isMemberPartOfWorkspaceById(user.id, workspace_id)
            const memberRole = member?.role || member?.workspace_member_role
            if (!member || ![AVAILABLE_MEMBER_ROLES.ADMIN, AVAILABLE_MEMBER_ROLES.OWNER].includes(memberRole)) {
                return res.status(403).json({
                    ok: false,
                    status: 403,
                    message: 'Solo el dueño o administrador puede cambiar la imagen del workspace'
                })
            }

            const workspace = await workspaceService.getOne(workspace_id)
            const defaultUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(workspace.title) + '&background=random'
            const updatedWorkspace = await workspaceService.updateImage(workspace_id, defaultUrl)

            return res.status(200).json({
                ok: true,
                status: 200,
                message: 'Imagen del workspace eliminada con éxito',
                data: { workspace: updatedWorkspace }
            })
        } catch (error) {
            next(error)
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController