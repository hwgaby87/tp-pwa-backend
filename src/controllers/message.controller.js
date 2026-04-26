import messageService from "../services/message.services.js";

class MessageController {
    async sendMessage(req, res, next) {
        try {
            const { workspace_id, channel_id } = req.params;
            const { content } = req.body;
            const user_id = req.user.id;

            const message = await messageService.sendMessage(workspace_id, channel_id, user_id, content);

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

    async getMessages(req, res, next) {
        try {
            const { channel_id } = req.params;
            const messages = await messageService.getMessages(channel_id);

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
            const message = await messageService.markAsRead(message_id);

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

    async deleteMessage(req, res, next) {
        try {
            const { message_id } = req.params;
            const user_id = req.user.id;

            const result = await messageService.deleteMessage(message_id, user_id);

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

const messageController = new MessageController();
export default messageController;
