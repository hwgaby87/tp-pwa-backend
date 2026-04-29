/**
 * @file message.controller.js
 * @description Controlador para la gestión de mensajes en canales públicos.
 * Maneja el envío, recuperación, marcado de lectura/recepción y eliminación de mensajes de canales.
 */

import messageService from "../services/message.service.js";

class MessageController {
    /**
     * Envía un mensaje a un canal específico.
     * @param {Object} req - Petición con workspace_id, channel_id en params y content en body.
     * @param {Object} res - Respuesta con el mensaje creado.
     * @param {Function} next - Middleware next.
     * */

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

    /**
     * Obtiene todos los mensajes de un canal específico.
     * @param {Object} req - Petición con channel_id en params.
     * @param {Object} res - Respuesta con la lista de mensajes.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Marca un mensaje de canal como leído.
     * @param {Object} req - Petición con message_id en params.
     * @param {Object} res - Respuesta con el mensaje actualizado.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Marca un mensaje de canal como recibido.
     * @param {Object} req - Petición con message_id en params.
     * @param {Object} res - Respuesta con el mensaje actualizado.
     * @param {Function} next - Middleware next.
     */
    async markAsReceived(req, res, next) {
        try {
            const { message_id } = req.params;
            const message = await messageService.markAsReceived(message_id);

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

    /**
     * Elimina un mensaje de canal (solo si el usuario actual es el autor).
     * @param {Object} req - Petición con message_id en params.
     * @param {Object} res - Respuesta confirmando la eliminación.
     * @param {Function} next - Middleware next.
     */
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
