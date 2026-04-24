import express from 'express'
import workspaceMemberController from '../controllers/workspace-member.controller.js'
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verify-member-workspace.middleware.js'
import available_member_roles from '../constants/member-roles.constants.js'
import authmiddleware from '../middlewares/auth.middleware.js'

const memberWorkspaceRouter = express.Router({ mergeParams: true })

memberWorkspaceRouter.use(authmiddleware)
memberWorkspaceRouter.use(verifyMemberWorkspaceRoleMiddleware([]))

memberWorkspaceRouter.post(
    '/',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER, available_member_roles.ADMIN]
    ),
    workspaceMemberController.inviteMember
)

memberWorkspaceRouter.get(
    '/',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceMemberController.getMembers
)

memberWorkspaceRouter.get(
    '/:memberId',
    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceMemberController.getMemberById
)

memberWorkspaceRouter.put(
    '/:memberId',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER, available_member_roles.ADMIN]
    ),
    workspaceMemberController.updateMember
)

memberWorkspaceRouter.delete(
    '/:memberId',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER, available_member_roles.ADMIN]
    ),
    workspaceMemberController.removeMember
)

export default memberWorkspaceRouter
