import ChannelMessages from "../models/channel-messages.model.js";
import ChannelMessagesDTO from "../dto/channel-messages.dto.js";
import ServerError from "../helpers/error.helper.js";

class MessageRepository {
    async create(channel_id, member_id, content) {
        try {
            const message = await ChannelMessages.create({
                fk_id_channel: channel_id,
                fk_id_member: member_id,
                content
            });
            return new ChannelMessagesDTO(message);
        } catch (error) {
            throw new ServerError("Error al crear el mensaje", 500);
        }
    }

    async getByChannelId(channel_id) {
        try {
            const messages = await ChannelMessages.find({ fk_id_channel: channel_id })
                .populate({
                    path: 'fk_id_member',
                    populate: {
                        path: 'fk_id_user',
                        select: 'name'
                    }
                })
                .sort({ created_at: 1 });

            return messages.map(msg => {
                const dto = new ChannelMessagesDTO(msg);
                // Extend DTO with user info for frontend
                return {
                    ...dto,
                    user_name: msg.fk_id_member?.fk_id_user?.name || 'Usuario desconocido',
                    user_id: msg.fk_id_member?.fk_id_user?._id
                };
            });
        } catch (error) {
            throw new ServerError("Error al obtener los mensajes", 500);
        }
    }

    async updateStatus(message_id, status) {
        try {
            const message = await ChannelMessages.findByIdAndUpdate(
                message_id,
                { status },
                { new: true }
            );
            return new ChannelMessagesDTO(message);
        } catch (error) {
            throw new ServerError("Error al actualizar el estado del mensaje", 500);
        }
    }

    async getById(message_id) {
        try {
            const message = await ChannelMessages.findById(message_id);
            return message && new ChannelMessagesDTO(message);
        } catch (error) {
            throw new ServerError("Error al obtener el mensaje", 500);
        }
    }

    async delete(message_id) {
        try {
            await ChannelMessages.findByIdAndDelete(message_id);
        } catch (error) {
            throw new ServerError("Error al eliminar el mensaje", 500);
        }
    }
}

const messageRepository = new MessageRepository();
export default messageRepository;
