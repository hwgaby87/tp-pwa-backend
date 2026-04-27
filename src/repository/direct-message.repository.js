import DirectMessageModel from "../models/direct-message.model.js"
import DirectMessageDTO from "../dto/direct-message.dto.js"
import ServerError from "../helpers/error.helper.js"
import MESSAGE_STATUS from "../constants/message-status.constants.js"

class DirectMessageRepository {
    async create(workspace_id, sender_id, receiver_id, content) {
        try {
            const message = await DirectMessageModel.create({
                fk_id_workspace: workspace_id,
                fk_id_sender: sender_id,
                fk_id_receiver: receiver_id,
                content
            })
            return new DirectMessageDTO(message)
        } catch (error) {
            console.error("Error creating direct message", error)
            throw new ServerError("Error al enviar el mensaje privado", 500)
        }
    }

    async getConversation(workspace_id, member1_id, member2_id) {
        try {
            const messages = await DirectMessageModel.find({
                fk_id_workspace: workspace_id,
                $or: [
                    { fk_id_sender: member1_id, fk_id_receiver: member2_id },
                    { fk_id_sender: member2_id, fk_id_receiver: member1_id }
                ],
                deleted_at: null
            })
                .populate({
                    path: 'fk_id_sender',
                    populate: {
                        path: 'fk_id_user',
                        select: 'name'
                    }
                })
                .sort({ created_at: 1 })

            return messages.map(msg => {
                const dto = new DirectMessageDTO(msg);
                return {
                    ...dto,
                    user_name: msg.fk_id_sender?.fk_id_user?.name || 'Usuario',
                    user_id: msg.fk_id_sender?.fk_id_user?._id
                };
            });
        } catch (error) {
            console.error("Error fetching direct messages", error)
            throw new ServerError("Error al obtener los mensajes privados", 500)
        }
    }

    async markAsRead(message_id) {
        try {
            const message = await DirectMessageModel.findByIdAndUpdate(
                message_id,
                { status: MESSAGE_STATUS.LEIDO },
                { new: true }
            )
            return message && new DirectMessageDTO(message)
        } catch (error) {
            throw new ServerError("Error al marcar el mensaje como leído", 500)
        }
    }

    async markAsReceived(message_id) {
        try {
            const message = await DirectMessageModel.findByIdAndUpdate(
                message_id,
                { status: MESSAGE_STATUS.RECIBIDO },
                { new: true }
            )
            return message && new DirectMessageDTO(message)
        } catch (error) {
            throw new ServerError("Error al marcar el mensaje como recibido", 500)
        }
    }

    async delete(message_id, member_id) {
        try {
            const message = await DirectMessageModel.findOneAndUpdate(
                { _id: message_id, fk_id_sender: member_id },
                { deleted_at: new Date() },
                { new: true }
            )
            return message && new DirectMessageDTO(message)
        } catch (error) {
            throw new ServerError("Error al eliminar el mensaje privado", 500)
        }
    }
}

const directMessageRepository = new DirectMessageRepository()
export default directMessageRepository
