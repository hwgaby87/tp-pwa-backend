import { Router } from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verify-member-workspace.middleware.js'
import channelRouter from './channel.routes.js'

const workspaceRouter = Router()

workspaceRouter.get(
    '/:workspace_id/member',
    workspaceController.respondToInvitation
)

workspaceRouter.use(authMiddleware) // Protege todas las rutas siguientes

workspaceRouter.get(
    '/',
    workspaceController.getWorkspaces
)

workspaceRouter.post(
    '/',
    workspaceController.create
)

workspaceRouter.get(
    '/:workspace_id',

    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.getById
)

workspaceRouter.post(
    '/:workspace_id/member/invite',
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    workspaceController.inviteMember
)

workspaceRouter.put(
    '/',
    workspaceController.update
)

workspaceRouter.put(
    '/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    workspaceController.update
)

workspaceRouter.delete(
    '/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    workspaceController.delete
)

workspaceRouter.use(
    '/:workspace_id/channels',
    channelRouter
)


export default workspaceRouter