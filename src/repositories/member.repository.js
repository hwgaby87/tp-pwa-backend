/**
 * @file member.repository.js
 * @description Repositorio para la gestión de miembros de espacios de trabajo (WorkspaceMember).
 * Maneja las operaciones de base de datos relacionadas con la pertenencia de usuarios a workspaces.
 */

import WorkspaceMember from "../models/workspace-member.model.js"
import WorkspaceMemberDTO from "../dtos/workspace-member.dto.js"
import ServerError from "../helpers/error.helper.js"
import AVAILABLE_INVITATION_RESPONSES from "../constants/invitation-responses.constant.js"

class WorkspaceMemberRepository {
    /**
     * Registra un nuevo miembro en un espacio de trabajo.
     * @param {string} fk_id_workspace - ID del workspace.
     * @param {string} fk_id_user - ID del usuario.
     * @param {string} role - Rol asignado (creador, admin, miembro).
     * @param {string} [acceptInvitation] - Estado inicial de la invitación.
     * @returns {Promise<WorkspaceMemberDTO>} DTO del miembro creado.
     */
    async create(fk_id_workspace, fk_id_user, role, acceptInvitation) {
        try {
            const member = await WorkspaceMember.create({
                fk_id_workspace,
                fk_id_user,
                role,
                acceptInvitation: acceptInvitation || AVAILABLE_INVITATION_RESPONSES.PENDING
            })
            return new WorkspaceMemberDTO(member)
        } catch (error) {
            if (error.code === 11000) {
                throw new ServerError("El usuario ya es miembro de este espacio de trabajo", 400);
            }
            throw new ServerError("Error al registrar el miembro en la base de datos", 500);
        }
    }

    /**
     * Elimina un registro de miembro por su ID.
     * @param {string} workspace_member_id - ID del registro a eliminar.
     */
    async deleteById(workspace_member_id) {
        try {
            await WorkspaceMember.findByIdAndDelete(workspace_member_id)
        } catch (error) {
            throw new ServerError("Error al eliminar el miembro", 500);
        }
    }

    /**
     * Obtiene los datos de un miembro específico incluyendo información del usuario.
     * @param {string} workspace_member_id - ID del miembro.
     * @returns {Promise<Object|null>} Objeto con datos del miembro y usuario.
     */
    async getById(workspace_member_id) {
        try {
            const member = await WorkspaceMember.findById(workspace_member_id)
                .populate('fk_id_user', 'name email image')

            if (!member || !member.fk_id_user) return null

            return {
                member_id: member._id,
                member_role: member.role,
                member_created_at: member.created_at,
                workspace_id: member.fk_id_workspace,

                user_id: member.fk_id_user._id,
                user_name: member.fk_id_user.name,
                user_email: member.fk_id_user.email,
                user_image: member.fk_id_user.image,
                invitation_status: member.acceptInvitation
            }
        } catch (error) {
            throw new ServerError("Error al obtener el miembro", 500);
        }
    }

    /**
     * Actualiza el rol de un miembro en el espacio de trabajo.
     * @param {string} member_id - ID del miembro.
     * @param {string} role - Nuevo rol a asignar.
     * @returns {Promise<WorkspaceMemberDTO|null>} DTO del miembro actualizado.
     */
    async updateRoleById(member_id, role) {
        try {
            const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
                member_id,
                { role: role },
                { new: true }
            )
            return new_workspace_member && new WorkspaceMemberDTO(new_workspace_member)
        } catch (error) {
            throw new ServerError("Error al actualizar el rol del miembro", 500);
        }
    }

    /**
     * Actualiza el estado de aceptación de una invitación.
     * @param {string} member_id - ID del miembro.
     * @param {string} status - Nuevo estado (aceptado, rechazado, pendiente).
     * @returns {Promise<WorkspaceMemberDTO|null>} DTO del miembro actualizado.
     */
    async updateInvitationStatus(member_id, status) {
        try {
            const updated_member = await WorkspaceMember.findByIdAndUpdate(
                member_id,
                { acceptInvitation: status },
                { new: true }
            ).lean()
            return updated_member && new WorkspaceMemberDTO(updated_member)
        } catch (error) {
            throw new ServerError("Error al actualizar el estado de la invitación", 500);
        }
    }

    /**
     * Obtiene todos los registros de miembros de la base de datos.
     * @returns {Promise<WorkspaceMemberDTO[]>} Lista de todos los miembros.
     */
    async getAll() {
        try {
            const members = await WorkspaceMember.find()
            return members.map(member => new WorkspaceMemberDTO(member))
        } catch (error) {
            throw new ServerError("Error al obtener la lista de miembros", 500);
        }
    }

    /**
     * Obtiene la lista de miembros de un workspace específico con datos de usuario.
     * @param {string} fk_id_workspace - ID del workspace.
     * @returns {Promise<Object[]>} Lista mapeada de miembros.
     */
    async getMemberList(fk_id_workspace) {
        try {
            const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace })
                .populate('fk_id_user', 'name email image')

            const members_mapped = members
                .filter(member => member.fk_id_user)
                .map((member) => {
                    return {
                        member_id: member._id,
                        member_role: member.role,
                        member_created_at: member.created_at,

                        user_id: member.fk_id_user._id,
                        user_name: member.fk_id_user.name,
                        user_email: member.fk_id_user.email,
                        user_image: member.fk_id_user.image,
                        invitation_status: member.acceptInvitation
                    }
                })
            return members_mapped
        } catch (error) {
            throw new ServerError("Error al obtener la lista de miembros del espacio", 500);
        }
    }

    /**
     * Obtiene la lista de workspaces a los que pertenece un usuario.
     * @param {string} user_id - ID del usuario.
     * @returns {Promise<Object[]>} Lista de workspaces mapeada.
     */
    async getWorkspaceListByUserId(user_id) {
        try {
            const members = await WorkspaceMember.find({ fk_id_user: user_id })
                .populate('fk_id_workspace')

            const members_mapped = members
                .filter(member => member.fk_id_workspace)
                .map((member) => {
                    return {
                        member_id: member._id,
                        member_role: member.role,
                        member_created_at: member.created_at,

                        workspace_id: member.fk_id_workspace._id,
                        workspace_title: member.fk_id_workspace.title,
                        workspace_description: member.fk_id_workspace.description,
                        workspace_active: member.fk_id_workspace.active,
                        workspace_url_image: member.fk_id_workspace.url_image
                    }
                })

            return members_mapped
        } catch (error) {
            throw new ServerError("Error al obtener la lista de espacios de trabajo del usuario", 500);
        }
    }

    /**
     * Obtiene la lista de workspaces archivados (inactivos) de un usuario.
     * @param {string} user_id - ID del usuario.
     * @returns {Promise<Object[]>} Lista de workspaces archivados.
     */
    async getArchivedWorkspaceListByUserId(user_id) {
        try {
            const members = await WorkspaceMember.find({ fk_id_user: user_id })
                .populate('fk_id_workspace')

            const members_mapped = members
                .filter(member => member.fk_id_workspace && !member.fk_id_workspace.active)
                .map((member) => {
                    return {
                        member_id: member._id,
                        member_role: member.role,
                        member_created_at: member.created_at,

                        workspace_id: member.fk_id_workspace._id,
                        workspace_title: member.fk_id_workspace.title,
                        workspace_description: member.fk_id_workspace.description,
                        workspace_url_image: member.fk_id_workspace.url_image
                    }
                })

            return members_mapped
        } catch (error) {
            throw new ServerError("Error al obtener la lista de espacios de trabajo archivados", 500);
        }
    }

    /**
     * Busca la relación de membresía entre un usuario y un workspace.
     * @param {string} workspace_id - ID del workspace.
     * @param {string} user_id - ID del usuario.
     * @returns {Promise<WorkspaceMemberDTO|null>} DTO del miembro si existe.
     */
    async getByWorkspaceAndUserId(workspace_id, user_id) {
        try {
            const member = await WorkspaceMember.findOne({ fk_id_workspace: workspace_id, fk_id_user: user_id }).lean()
            return member && new WorkspaceMemberDTO(member)
        } catch (error) {
            throw new ServerError("Error al buscar el miembro en el espacio", 500);
        }
    }

    /**
     * Verifica si un usuario es parte de un workspace.
     * @param {string} user_id - ID del usuario.
     * @param {string} workspace_id - ID del workspace.
     * @returns {Promise<WorkspaceMemberDTO|null>} Membresía encontrada.
     */
    async isMemberPartOfWorkspaceById(user_id, workspace_id) {
        try {
            const member = await WorkspaceMember.findOne({
                fk_id_user: user_id,
                fk_id_workspace: workspace_id,
            });
            return member && new WorkspaceMemberDTO(member);
        } catch (error) {
            throw new ServerError("Error al verificar la pertenencia al espacio", 500);
        }
    }

    /**
     * Cuenta la cantidad de miembros registrados en un workspace.
     * @param {string} workspace_id - ID del workspace.
     * @returns {Promise<number>} Cantidad de miembros.
     */
    async countMembersByWorkspaceId(workspace_id) {
        try {
            return await WorkspaceMember.countDocuments({ fk_id_workspace: workspace_id })
        } catch (error) {
            throw new ServerError("Error al contar los miembros del espacio", 500);
        }
    }
}
const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository