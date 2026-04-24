import express from 'express'
import memberController from '../controllers/member.controller.js'
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
    memberController.inviteMember
)

memberWorkspaceRouter.get(
    '/',
    verifyMemberWorkspaceRoleMiddleware([]),
    memberController.getMembers
)

memberWorkspaceRouter.get(
    '/:memberId',
    verifyMemberWorkspaceRoleMiddleware([]),
    memberController.getMemberById
)

memberWorkspaceRouter.put(
    '/:memberId',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER, available_member_roles.ADMIN]
    ),
    memberController.updateMember
)

memberWorkspaceRouter.delete(
    '/:memberId',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER, available_member_roles.ADMIN]
    ),
    memberController.removeMember
)

export default memberWorkspaceRouter
