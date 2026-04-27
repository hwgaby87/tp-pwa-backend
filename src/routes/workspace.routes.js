import { Router } from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verify-member-workspace.middleware.js'
import handleValidationErrors from '../middlewares/handle-validation.middleware.js'
import { validateWorkspaceCreate, validateWorkspaceUpdate, validateWorkspaceDelete } from '../middlewares/validators/workspace.validator.js'
import channelRouter from './channel.routes.js'
import memberWorkspaceRouter from './member-workspace.routes.js'
import directMessageRouter from './direct-message.routes.js'

const workspaceRouter = Router()

workspaceRouter.get(
    '/respond-invitation',
    workspaceController.respondToInvitation
)

workspaceRouter.get(
    '/:workspace_id/member',
    workspaceController.respondToInvitation
)

workspaceRouter.use(authMiddleware) // Protege todas las rutas siguientes

workspaceRouter.get(
    '/',
    workspaceController.getWorkspaces
)

workspaceRouter.get(
    '/archived',
    workspaceController.getArchivedWorkspaces
)

workspaceRouter.post(
    '/',
    validateWorkspaceCreate,
    handleValidationErrors,
    workspaceController.create
)

workspaceRouter.get(
    '/:workspace_id',

    verifyMemberWorkspaceRoleMiddleware([]),
    workspaceController.getById
)


workspaceRouter.put(
    '/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware(['admin', 'owner']),
    validateWorkspaceUpdate,
    handleValidationErrors,
    workspaceController.update
)

workspaceRouter.delete(
    '/:workspace_id',
    verifyMemberWorkspaceRoleMiddleware(['owner']),
    validateWorkspaceDelete,
    handleValidationErrors,
    workspaceController.delete
)

workspaceRouter.post(
    '/:workspace_id/restore',
    verifyMemberWorkspaceRoleMiddleware(['owner']),
    workspaceController.restore
)

workspaceRouter.use(
    '/:workspace_id/channels',
    channelRouter
)

workspaceRouter.use(
    '/:workspace_id/members',
    memberWorkspaceRouter
)

workspaceRouter.use(
    '/:workspace_id/direct-messages',
    directMessageRouter
)

export default workspaceRouter