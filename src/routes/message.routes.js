import express from 'express';
import messageController from '../controllers/message.controller.js';
import authmiddleware from '../middlewares/auth.middleware.js';
import verifyWorkspaceMiddleware from '../middlewares/verify-workspace.middleware.js';
import verifyChannelMiddleware from '../middlewares/verify-channel.middleware.js';
import verifyMemberWorkspaceRoleMiddleware from '../middlewares/verify-member-workspace.middleware.js';

const messageRouter = express.Router({ mergeParams: true });

messageRouter.use(authmiddleware);
messageRouter.use(verifyWorkspaceMiddleware);
messageRouter.use(verifyChannelMiddleware);
messageRouter.use(verifyMemberWorkspaceRoleMiddleware());

messageRouter.post('/', messageController.sendMessage);
messageRouter.get('/', messageController.getMessages);
messageRouter.put('/:message_id/read', messageController.markAsRead);
messageRouter.put('/:message_id/received', messageController.markAsReceived);
messageRouter.delete('/:message_id', messageController.deleteMessage);

export default messageRouter;
