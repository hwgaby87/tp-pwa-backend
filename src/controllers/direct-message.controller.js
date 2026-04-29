/**
 * @file direct-message.controller.js
 * @description Controlador para la gestión de mensajes directos entre usuarios.
 * Maneja el envío, obtención de conversaciones, marcado de lectura/recepción y eliminación de mensajes privados.
 */

import directMessageService from "../services/direct-message.service.js";

class DirectMessageController {
    /**
     * Envía un mensaje directo a otro miembro del workspace.
     * @param {Object} req - Petición con workspace_id, receiver_member_id en params y content en body.
     * @param {Object} res - Respuesta con el mensaje creado.
     * @param {Function} next - Middleware next.
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

    /**
     * Obtiene el historial de mensajes entre el usuario actual y otro miembro.
     * @param {Object} req - Petición con workspace_id y other_member_id en params.
     * @param {Object} res - Respuesta con la lista de mensajes.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Marca un mensaje directo como leído por el receptor.
     * @param {Object} req - Petición con message_id en params.
     * @param {Object} res - Respuesta con el mensaje actualizado.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Marca un mensaje directo como recibido (entregado) al dispositivo del receptor.
     * @param {Object} req - Petición con message_id en params.
     * @param {Object} res - Respuesta con el mensaje actualizado.
     * @param {Function} next - Middleware next.
     */
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

    /**
     * Elimina un mensaje directo (solo si el usuario actual es el autor).
     * @param {Object} req - Petición con message_id y workspace_id en params.
     * @param {Object} res - Respuesta confirmando la eliminación.
     * @param {Function} next - Middleware next.
     */
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
