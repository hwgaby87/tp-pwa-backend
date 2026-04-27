import directMessageRepository from "../repository/direct-message.repository.js";
import workspaceMemberRepository from "../repository/member.repository.js";
import ServerError from "../helpers/error.helper.js";

class DirectMessageService {
    async sendMessage(workspace_id, sender_user_id, receiver_member_id, content) {
        if (!workspace_id || !sender_user_id || !receiver_member_id || !content) {
            throw new ServerError("Todos los campos son obligatorios", 400);
        }

        // Obtener el miembro emisor
        const sender_member = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, sender_user_id);
        if (!sender_member) {
            throw new ServerError("No eres miembro de este espacio de trabajo", 403);
        }

        // Obtener el miembro receptor
        const receiver_member = await workspaceMemberRepository.getById(receiver_member_id);
        if (!receiver_member || receiver_member.workspace_id.toString() !== workspace_id) {
            throw new ServerError("El receptor no es miembro de este espacio de trabajo", 404);
        }

        if (sender_member.workspace_member_id.toString() === receiver_member.member_id.toString()) {
            throw new ServerError("No puedes enviarte mensajes a ti mismo", 400);
        }

        return await directMessageRepository.create(
            workspace_id,
            sender_member.workspace_member_id,
            receiver_member.member_id,
            content
        );
    }

    async getConversation(workspace_id, user_id, other_member_id) {
        if (!workspace_id || !user_id || !other_member_id) {
            throw new ServerError("ID de espacio, usuario y miembro son obligatorios", 400);
        }

        // Obtener mi propio miembro
        const my_member = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user_id);
        if (!my_member) {
            throw new ServerError("No eres miembro de este espacio de trabajo", 403);
        }

        // El otro miembro ya se verificará en el repositorio por id y workspace implicito en la consulta
        // pero validamos que exista y pertenezca al workspace
        const other_member = await workspaceMemberRepository.getById(other_member_id);
        if (!other_member || other_member.workspace_id.toString() !== workspace_id) {
            throw new ServerError("El miembro no pertenece a este espacio de trabajo", 404);
        }

        if (my_member.workspace_member_id.toString() === other_member.member_id.toString()) {
            throw new ServerError("No puedes chatear contigo mismo", 400);
        }

        return await directMessageRepository.getConversation(workspace_id, my_member.workspace_member_id, other_member.member_id);
    }

    async markAsRead(message_id) {
        return await directMessageRepository.markAsRead(message_id);
    }

    async markAsReceived(message_id) {
        return await directMessageRepository.markAsReceived(message_id);
    }

    async deleteMessage(message_id, user_id, workspace_id) {
        const my_member = await workspaceMemberRepository.getByWorkspaceAndUserId(workspace_id, user_id);
        if (!my_member) {
            throw new ServerError("No tienes permisos", 403);
        }

        const message = await directMessageRepository.delete(message_id, my_member.workspace_member_id);
        if (!message) {
            throw new ServerError("No se encontró el mensaje o no tienes permisos para eliminarlo", 404);
        }

        return { ok: true, message: "Mensaje eliminado exitosamente" };
    }
}

const directMessageService = new DirectMessageService();
export default directMessageService;
