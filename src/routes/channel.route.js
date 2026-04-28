import express from 'express'
import channelController from '../controllers/channel.controller.js'
import messageRouter from './message.route.js'
import verifyWorkspaceMiddleware from '../middlewares/verify-workspace.middleware.js'
import verifyWorkspaceMember from '../middlewares/verify-member-workspace.middleware.js'
import verifyRole from '../middlewares/verify-role.middleware.js'
import verifyChannelMiddleware from '../middlewares/verify-channel.middleware.js'
import { AVAILABLE_MEMBER_ROLES } from '../constants/member-roles.constant.js'
import handleValidationErrors from '../middlewares/handle-validation.middleware.js'
import { validateChannelCreate, validateChannelUpdate, validateChannelDelete, validateChannelRestore } from '../middlewares/validators/channel.validator.js'

const channelRouter = express.Router({ mergeParams: true })

channelRouter.use(verifyWorkspaceMiddleware)

channelRouter.post(
    '/',
    verifyWorkspaceMember,
    verifyRole(AVAILABLE_MEMBER_ROLES.USER),
    validateChannelCreate,
    handleValidationErrors,
    channelController.create
)

channelRouter.get(
    '/',
    verifyWorkspaceMember,
    channelController.getAll
)

channelRouter.get(
    '/deleted',
    verifyWorkspaceMember,
    verifyRole(AVAILABLE_MEMBER_ROLES.ADMIN),
    channelController.getDeleted
)

channelRouter.delete(
    '/:channel_id',
    verifyWorkspaceMember,
    verifyRole(AVAILABLE_MEMBER_ROLES.ADMIN),
    validateChannelDelete,
    handleValidationErrors,
    verifyChannelMiddleware,
    channelController.delete
)

channelRouter.post(
    '/:channel_id/restore',
    verifyWorkspaceMember,
    verifyRole(AVAILABLE_MEMBER_ROLES.ADMIN),
    validateChannelRestore,
    handleValidationErrors,
    channelController.restore
)

channelRouter.put(
    '/:channel_id',
    verifyWorkspaceMember,
    verifyRole(AVAILABLE_MEMBER_ROLES.USER),
    validateChannelUpdate,
    handleValidationErrors,
    verifyChannelMiddleware,
    channelController.update
)


channelRouter.use('/:channel_id/messages', messageRouter)

export default channelRouter