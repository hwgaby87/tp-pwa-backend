import messageRepository from "../repository/message.repository.js";
import workspaceMemberRepository from "../repository/member.repository.js";
import ServerError from "../helpers/error.helper.js";
import MESSAGE_STATUS from "../constants/message-status.constants.js";

class MessageService {
    async sendMessage(workspace_id, channel_id, user_id, content) {
        if (!workspace_id || !channel_id || !user_id || !content) {
            throw new ServerError("Todos los campos son obligatorios", 400);
        }

        // Obtener el member_id del usuario en este workspace
        const member = await workspaceMemberRepository.isMemberPartOfWorkspaceById(user_id, workspace_id);
        if (!member) {
            throw new ServerError("El usuario no es miembro de este espacio de trabajo", 403);
        }

        const message = await messageRepository.create(channel_id, member.workspace_member_id, content);
        return message;
    }

    async getMessages(channel_id) {
        if (!channel_id) {
            throw new ServerError("El ID del canal es obligatorio", 400);
        }
        return await messageRepository.getByChannelId(channel_id);
    }

    async markAsRead(message_id) {
        if (!message_id) {
            throw new ServerError("El ID del mensaje es obligatorio", 400);
        }
        return await messageRepository.updateStatus(message_id, MESSAGE_STATUS.LEIDO);
    }

    async markAsReceived(message_id) {
        if (!message_id) {
            throw new ServerError("El ID del mensaje es obligatorio", 400);
        }
        return await messageRepository.updateStatus(message_id, MESSAGE_STATUS.RECIBIDO);
    }

    async deleteMessage(message_id, user_id) {
        if (!message_id || !user_id) {
            throw new ServerError("El ID del mensaje y del usuario son obligatorios", 400);
        }

        const message = await messageRepository.getById(message_id);
        if (!message) {
            throw new ServerError("El mensaje no existe", 404);
        }

        // Obtener el miembro para verificar el user_id
        const member = await workspaceMemberRepository.getById(message.channel_message_member_id);
        
        if (member.user_id.toString() !== user_id.toString()) {
            throw new ServerError("No tienes permiso para eliminar este mensaje", 403);
        }

        await messageRepository.delete(message_id);
        return { message: "Mensaje eliminado con éxito" };
    }
}

const messageService = new MessageService();
export default messageService;
