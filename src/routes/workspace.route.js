import { Router } from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import verifyWorkspaceMember from '../middlewares/verify-member-workspace.middleware.js'
import verifyRole from '../middlewares/verify-role.middleware.js'
import handleValidationErrors from '../middlewares/handle-validation.middleware.js'
import { validateWorkspaceCreate, validateWorkspaceUpdate, validateWorkspaceDelete } from '../middlewares/validators/workspace.validator.js'
import { uploadWorkspaceImage } from '../middlewares/upload.middleware.js'
import channelRouter from './channel.route.js'
import memberWorkspaceRouter from './member-workspace.route.js'
import directMessageRouter from './direct-message.route.js'

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

    verifyWorkspaceMember,
    workspaceController.getById
)


workspaceRouter.put(
    '/:workspace_id',
    verifyWorkspaceMember,
    verifyRole('admin'),
    validateWorkspaceUpdate,
    handleValidationErrors,
    workspaceController.update
)

workspaceRouter.delete(
    '/:workspace_id',
    verifyWorkspaceMember,
    verifyRole('owner'),
    validateWorkspaceDelete,
    handleValidationErrors,
    workspaceController.delete
)

workspaceRouter.post(
    '/:workspace_id/restore',
    verifyWorkspaceMember,
    verifyRole('owner'),
    workspaceController.restore
)

workspaceRouter.post(
    '/:workspace_id/image',
    verifyWorkspaceMember,
    verifyRole('admin'),
    uploadWorkspaceImage.single('image'),
    workspaceController.updateWorkspaceImage
)

workspaceRouter.delete(
    '/:workspace_id/image',
    verifyWorkspaceMember,
    verifyRole('admin'),
    workspaceController.deleteWorkspaceImage
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