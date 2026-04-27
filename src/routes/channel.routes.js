import express from 'express'
import channelController from '../controllers/channel.controller.js'
import messageRouter from './message.routes.js'
import verifyWorkspaceMiddleware from '../middlewares/verify-workspace.middleware.js'
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verify-member-workspace.middleware.js'
import verifyChannelMiddleware from '../middlewares/verify-channel.middleware.js'
import available_member_roles from '../constants/member-roles.constants.js'
import handleValidationErrors from '../middlewares/handle-validation.middleware.js'
import { validateChannelCreate, validateChannelUpdate, validateChannelDelete, validateChannelRestore } from '../middlewares/validators/channel.validator.js'

const channelRouter = express.Router({ mergeParams: true })

channelRouter.use(verifyWorkspaceMiddleware)

channelRouter.post(
    '/',
    verifyMemberWorkspaceRoleMiddleware([available_member_roles.OWNER, available_member_roles.ADMIN]),
    validateChannelCreate,
    handleValidationErrors,
    channelController.create
)

channelRouter.get(
    '/',
    verifyMemberWorkspaceRoleMiddleware(),
    channelController.getAll
)

channelRouter.get(
    '/deleted',
    verifyMemberWorkspaceRoleMiddleware([available_member_roles.OWNER, available_member_roles.ADMIN]),
    channelController.getDeleted
)

channelRouter.delete(
    '/:channel_id',
    verifyMemberWorkspaceRoleMiddleware([available_member_roles.OWNER, available_member_roles.ADMIN]),
    validateChannelDelete,
    handleValidationErrors,
    verifyChannelMiddleware,
    channelController.delete
)

channelRouter.post(
    '/:channel_id/restore',
    verifyMemberWorkspaceRoleMiddleware([available_member_roles.OWNER, available_member_roles.ADMIN]),
    validateChannelRestore,
    handleValidationErrors,
    channelController.restore
)

channelRouter.put(
    '/:channel_id',
    verifyMemberWorkspaceRoleMiddleware([available_member_roles.OWNER, available_member_roles.ADMIN]),
    validateChannelUpdate,
    handleValidationErrors,
    verifyChannelMiddleware,
    channelController.update
)


channelRouter.use('/:channel_id/messages', messageRouter)

export default channelRouter