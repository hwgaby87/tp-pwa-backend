class DirectMessageDTO {
    constructor (directMessage) {
        this.message_id = directMessage._id
        this.workspace_id = directMessage.fk_id_workspace
        this.sender_id = directMessage.fk_id_sender
        this.receiver_id = directMessage.fk_id_receiver
        this.content = directMessage.content
        this.status = directMessage.status
        this.created_at = directMessage.created_at
        this.deleted_at = directMessage.deleted_at
    }
}

export default DirectMessageDTO
