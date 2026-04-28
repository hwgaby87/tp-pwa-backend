import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repositories/member.repository.js"
import userRepository from "../repositories/user.repository.js"
import jwt from 'jsonwebtoken'
import ENVIRONMENT from "../config/environment.config.js"
import mailerTransporter from "../config/mailer.config.js"
import AVAILABLE_MEMBER_ROLES from "../constants/member-roles.constant.js"
import AVAILABLE_INVITATION_RESPONSES from "../constants/invitation-responses.constant.js"
import getEmailTemplate from "../helpers/email-template.helper.js"


class MemberWorkspaceService {
    async getWorkspaces(user_id) {
        //traer la lista de espacios de trabajo relacionados a el usuario logueado
        const workspacesList = await workspaceMemberRepository.getWorkspaceListByUserId(user_id)
        return workspacesList
    }
    async create(user_id, workspace_id, role, acceptInvitation) {
        //Checkear que no exista un membresia para ese usuario
        const result = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user_id)

        if (result) {
            throw new ServerError('El usuario ya es miembro de este espacio de trabajo')
        }

        // Validar que el rol sea uno de los roles disponibles
        if (!Object.values(AVAILABLE_MEMBER_ROLES).includes(role)) {
            throw new ServerError("Rol no válido", 400)
        }

        await workspaceMemberRepository.create(workspace_id, user_id, role, acceptInvitation)
    }

    async getMemberList(workspace_id) {
        try {
            if (!workspace_id) {
                throw new ServerError("Todos los campos son obligatorios", 404)
            }

            return await workspaceMemberRepository.getMemberList(
                workspace_id
            )
        } catch (error) {
            throw error
        }
    }

    async getMemberById(member_id) {
        try {
            if (!member_id) {
                throw new ServerError("El ID del miembro es obligatorio", 400)
            }
            const member = await workspaceMemberRepository.getById(member_id)
            if (!member) {
                throw new ServerError("El miembro no existe", 404)
            }
            return member
        } catch (error) {
            throw error
        }
    }


    async updateMember(member_id, role, requesting_user_id) {
        try {
            if (!member_id || !role) {
                throw new ServerError("Todos los campos son obligatorios", 400)
            }

            // Validar que el rol sea uno de los roles disponibles
            if (!Object.values(AVAILABLE_MEMBER_ROLES).includes(role)) {
                throw new ServerError("Rol no válido", 400)
            }

            const memberToUpdate = await workspaceMemberRepository.getById(member_id)
            if (!memberToUpdate) {
                throw new ServerError("El miembro no existe", 404)
            }

            const requestingMember = await workspaceMemberRepository.getByWorkspaceAndUserId(memberToUpdate.workspace_id, requesting_user_id)
            
            // Regla: ADMIN no puede degradar al creador (owner)
            if (memberToUpdate.member_role === AVAILABLE_MEMBER_ROLES.OWNER && requestingMember.role !== AVAILABLE_MEMBER_ROLES.OWNER) {
                throw new ServerError("No tenés permisos para degradar al propietario", 403)
            }

            // Regla: Solo el OWNER puede promover a otros a OWNER (si el sistema lo permite)
            // Según el prompt: "ADMIN: Puede promover miembros a admin pero NO puede crear owners"
            if (role === AVAILABLE_MEMBER_ROLES.OWNER && requestingMember.role !== AVAILABLE_MEMBER_ROLES.OWNER) {
                throw new ServerError("Solo el propietario puede asignar el rol de propietario", 403)
            }

            return await workspaceMemberRepository.updateRoleById(member_id, role)
        } catch (error) {
            throw error
        }
    }

    async removeMember(member_id, requesting_user_id) {
        try {
            if (!member_id) {
                throw new ServerError("El ID del miembro es obligatorio", 400)
            }

            const member = await workspaceMemberRepository.getById(member_id)
            if (!member) {
                throw new ServerError("El miembro no existe", 404)
            }

            const isSelfRemoval = member.user_id.toString() === requesting_user_id.toString()

            // Regla: CREADOR (owner) no puede abandonar el workspace sin transferir ownership
            if (isSelfRemoval && member.member_role === AVAILABLE_MEMBER_ROLES.OWNER) {
                const membersCount = await workspaceMemberRepository.countMembersByWorkspaceId(member.workspace_id)
                if (membersCount > 1) {
                    throw new ServerError("No podés abandonar el workspace sin transferir la propiedad", 400)
                }
            }

            // Regla: ADMIN no puede abandonar el workspace si es el último admin
            if (isSelfRemoval && member.member_role === AVAILABLE_MEMBER_ROLES.ADMIN) {
                const members = await workspaceMemberRepository.getMemberList(member.workspace_id)
                const admins = members.filter(m => m.member_role === AVAILABLE_MEMBER_ROLES.ADMIN)
                if (admins.length === 1) {
                    throw new ServerError("No podés abandonar el workspace si sos el último administrador", 400)
                }
            }

            return await workspaceMemberRepository.deleteById(member_id)
        } catch (error) {
            throw error
        }
    }

    async inviteMember(workspace_id, invited_email, role) {
        if (!workspace_id || !invited_email || !role) {
            throw new ServerError('Todos los campos son obligatorios', 400)
        }

        const invitedUser = await userRepository.getByEmail(invited_email)
        if (!invitedUser) {
            throw new ServerError('El usuario invitado no existe', 404)
        }

        const existingMember = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, invitedUser._id)
        if (existingMember) {
            if (existingMember.workspace_member_accept_invitation === AVAILABLE_INVITATION_RESPONSES.PENDING) {
                throw new ServerError('Ya hay una invitación pendiente para este usuario', 400)
            }
            throw new ServerError('El usuario ya es miembro de este espacio de trabajo', 400)
        }

        const newMember = await workspaceMemberRepository.create(workspace_id, invitedUser._id, role)

        const accept_token = jwt.sign(
            {
                email: invited_email,
                workspace_id,
                action: AVAILABLE_INVITATION_RESPONSES.ACCEPTED
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        const reject_token = jwt.sign(
            {
                email: invited_email,
                workspace_id,
                action: AVAILABLE_INVITATION_RESPONSES.REJECTED
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        const accept_link = `${ENVIRONMENT.URL_FRONTEND}/invitation?token=${accept_token}`
        const reject_link = `${ENVIRONMENT.URL_FRONTEND}/invitation?token=${reject_token}`

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: invited_email,
            subject: `Invitación a unirse al espacio de trabajo`,
            html: getEmailTemplate(`
                <div class="content-block">
                    <h2>Has sido invitado</h2>
                    <p>¡Hola! Has sido invitado a unirte a un espacio de trabajo en <strong>Conecta</strong>.</p>
                </div>
                
                <div class="member-preview">
                    <div class="member-avatar">
                        ${invitedUser.image ? `<img src="${invitedUser.image}" class="member-avatar" />` : (invitedUser.name?.substring(0, 1).toUpperCase() || 'U')}
                    </div>
                    <div class="member-info">
                        <h3>${invitedUser.name}</h3>
                        <p>${invited_email}</p>
                    </div>
                </div>

                <div class="content-block text-center">
                    <p>Haz clic en uno de los siguientes botones para responder a la invitación:</p>
                    <a href="${accept_link}" class="btn btn-primary">Aceptar Invitación</a>
                    <a href="${reject_link}" class="btn btn-secondary">Rechazar</a>
                </div>
                
                <div class="content-block" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7; font-size: 13px; color: #64748b;">
                    <p>Esta invitación expirará en 7 días.</p>
                </div>
            `, 'Invitación al Espacio de Trabajo')
        })

        return newMember
    }

    async respondToInvitation(token) {
        if (!token) {
            throw new ServerError('El token no se ha proporcionado', 400)
        }

        try {
            const { email, workspace_id, action } = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)

            const user = await userRepository.getByEmail(email)
            if (!user) {
                throw new ServerError('El usuario no existe', 404)
            }

            const membership = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user._id)
            if (!membership) {
                throw new ServerError('La invitación no existe', 404)
            }

            if (membership.workspace_member_accept_invitation === action) {
                const actionSpanish = action === 'accepted' ? 'aceptado' : 'rechazado';
                throw new ServerError(`Ya has respondido '${actionSpanish}' a esta invitación`, 400)
            }

            const updatedMembership = await workspaceMemberRepository.updateInvitationStatus(membership.workspace_member_id, action)
            return updatedMembership

        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError('Token inválido o expirado', 401)
            }
            throw error
        }
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService