import directMessageService from "../services/direct-message.services.js";

class DirectMessageController {
    async sendMessage(req, res, next) {
        try {
            const { workspace_id, receiver_member_id } = req.params;
            const { content } = req.body;
            const user_id = req.user.id;

            const message = await directMessageService.sendMessage(workspace_id, user_id, receiver_member_id, content);

            res.status(201).json({
                ok: true,
                status: 201,
                message: "Mensaje enviado con éxito",
                data: message
            });
        } catch (error) {
            next(error);
        }
    }

    async getConversation(req, res, next) {
        try {
            const { workspace_id, other_member_id } = req.params;
            const user_id = req.user.id;

            const messages = await directMessageService.getConversation(workspace_id, user_id, other_member_id);

            res.status(200).json({
                ok: true,
                status: 200,
                message: "Mensajes obtenidos con éxito",
                data: messages
            });
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const { message_id } = req.params;
            const message = await directMessageService.markAsRead(message_id);

            res.status(200).json({
                ok: true,
                status: 200,
                message: "Mensaje marcado como leído",
                data: message
            });
        } catch (error) {
            next(error);
        }
    }

    async markAsReceived(req, res, next) {
        try {
            const { message_id } = req.params;
            const message = await directMessageService.markAsReceived(message_id);

            res.status(200).json({
                ok: true,
                status: 200,
                message: "Mensaje marcado como recibido",
                data: message
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMessage(req, res, next) {
        try {
            const { message_id, workspace_id } = req.params;
            const user_id = req.user.id;

            const result = await directMessageService.deleteMessage(message_id, user_id, workspace_id);

            res.status(200).json({
                ok: true,
                status: 200,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

const directMessageController = new DirectMessageController();
export default directMessageController;
