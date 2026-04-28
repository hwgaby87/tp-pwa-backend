import express from 'express';
import directMessageController from '../controllers/direct-message.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import verifyWorkspaceMiddleware from '../middlewares/verify-workspace.middleware.js';
import verifyWorkspaceMember from '../middlewares/verify-member-workspace.middleware.js';

const directMessageRouter = express.Router({ mergeParams: true });

directMessageRouter.use(authMiddleware);
directMessageRouter.use(verifyWorkspaceMiddleware);
directMessageRouter.use(verifyWorkspaceMember);

directMessageRouter.post('/:receiver_member_id', directMessageController.sendMessage);
directMessageRouter.get('/:other_member_id', directMessageController.getConversation);
directMessageRouter.put('/:message_id/read', directMessageController.markAsRead);
directMessageRouter.put('/:message_id/received', directMessageController.markAsReceived);
directMessageRouter.delete('/:message_id', directMessageController.deleteMessage);

export default directMessageRouter;
