import express from 'express'
import channelController from '../controllers/channel.controller.js'
import verifyWorkspaceMiddleware from '../middlewares/verify-workspace.middleware.js'
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verify-member-workspace.middleware.js'
import verifyChannelMiddleware from '../middlewares/verify-channel.middleware.js'
import available_member_roles from '../constants/member-roles.constants.js'

const channelRouter = express.Router({ mergeParams: true })

channelRouter.use(verifyWorkspaceMiddleware)

channelRouter.post(
    '/',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER],
        [available_member_roles.ADMIN]
    ),
    channelController.create
)

channelRouter.get(
    '/',
    verifyMemberWorkspaceRoleMiddleware(),
    channelController.getAll
)

channelRouter.delete(
    '/:channel_id',
    verifyMemberWorkspaceRoleMiddleware(
        [available_member_roles.OWNER]
    ),
    verifyChannelMiddleware,
    channelController.delete
)


export default channelRouter