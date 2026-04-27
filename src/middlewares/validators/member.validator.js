import { body, param } from 'express-validator';
import userRepository from '../../repositories/user.repository.js';
import workspaceMemberRepository from '../../repositories/member.repository.js';
import AVAILABLE_MEMBER_ROLES from '../../constants/member-roles.constant.js';
import AVAILABLE_INVITATION_RESPONSES from '../../constants/invitation-responses.constant.js';

export const validateInviteMember = [
    param('workspace_id')
        .isMongoId().withMessage('ID de espacio de trabajo inválido'),
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email debe ser válido')
        .custom(async (email, { req }) => {
            const invitedUser = await userRepository.getByEmail(email);
            if (!invitedUser) {
                throw new Error('El usuario invitado no existe en el sistema');
            }
            if (invitedUser._id.toString() === req.user.id) {
                throw new Error('No puedes invitarte a ti mismo');
            }
            const workspaceId = req.params.workspace_id;
            const existingMember = await workspaceMemberRepository.getByWorkspaceAndUserId(workspaceId, invitedUser._id);
            if (existingMember) {
                if (existingMember.workspace_member_accept_invitation === AVAILABLE_INVITATION_RESPONSES.PENDING) {
                    throw new Error('El usuario ya tiene una invitación pendiente');
                }
                throw new Error('El usuario ya es miembro de este espacio de trabajo');
            }
            return true;
        }),
    body('role')
        .notEmpty().withMessage('El rol es requerido')
        .isIn(Object.values(AVAILABLE_MEMBER_ROLES)).withMessage('El rol debe ser uno de: ' + Object.values(AVAILABLE_MEMBER_ROLES).join(', '))
];

export const validateUpdateMember = [
    param('memberId')
        .isMongoId().withMessage('ID de miembro inválido')
        .custom(async (memberId) => {
            const member = await workspaceMemberRepository.getById(memberId);
            if (!member) {
                throw new Error('El miembro no existe');
            }
            if (member.member_role === AVAILABLE_MEMBER_ROLES.OWNER) {
                throw new Error('No se puede degradar al owner del espacio de trabajo');
            }
            return true;
        }),
    body('role')
        .notEmpty().withMessage('El rol es requerido')
        .isIn(Object.values(AVAILABLE_MEMBER_ROLES)).withMessage('El rol debe ser uno de: ' + Object.values(AVAILABLE_MEMBER_ROLES).join(', '))
];

export const validateRemoveMember = [
    param('memberId')
        .isMongoId().withMessage('ID de miembro inválido')
        .custom(async (memberId) => {
            const member = await workspaceMemberRepository.getById(memberId);
            if (!member) {
                throw new Error('El miembro no existe');
            }
            if (member.member_role === AVAILABLE_MEMBER_ROLES.OWNER) {
                throw new Error('No se puede eliminar al owner del espacio de trabajo');
            }
            return true;
        })
];
