import express from 'express'
import workspaceMemberController from '../controllers/workspace-member.controller.js'
import verifyWorkspaceMember from '../middlewares/verify-member-workspace.middleware.js'
import verifyRole from '../middlewares/verify-role.middleware.js'
import { AVAILABLE_MEMBER_ROLES } from '../constants/member-roles.constant.js'
import authmiddleware from '../middlewares/auth.middleware.js'
import handleValidationErrors from '../middlewares/handle-validation.middleware.js'
import { validateInviteMember, validateUpdateMember, validateRemoveMember } from '../middlewares/validators/member.validator.js'

const memberWorkspaceRouter = express.Router({ mergeParams: true })

memberWorkspaceRouter.use(authmiddleware)
memberWorkspaceRouter.use(verifyWorkspaceMember)

memberWorkspaceRouter.post(
    '/',
    verifyRole(AVAILABLE_MEMBER_ROLES.ADMIN),
    validateInviteMember,
    handleValidationErrors,
    workspaceMemberController.inviteMember
)

memberWorkspaceRouter.get(
    '/',
    workspaceMemberController.getMembers
)

memberWorkspaceRouter.get(
    '/:memberId',
    workspaceMemberController.getMemberById
)

memberWorkspaceRouter.put(
    '/:memberId',
    verifyRole(AVAILABLE_MEMBER_ROLES.ADMIN),
    validateUpdateMember,
    handleValidationErrors,
    workspaceMemberController.updateMember
)

memberWorkspaceRouter.delete(
    '/:memberId',
    verifyRole(AVAILABLE_MEMBER_ROLES.ADMIN),
    validateRemoveMember,
    handleValidationErrors,
    workspaceMemberController.removeMember
)

export default memberWorkspaceRouter
