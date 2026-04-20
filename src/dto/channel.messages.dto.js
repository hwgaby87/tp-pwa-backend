class ChannelMessagesDTO {
    constructor (channelMessage) {
        this.channel_message_id = channelMessage._id
        this.channel_message_channel_id = channelMessage.fk_id_channel
        this.channel_message_member_id = channelMessage.fk_id_member
        this.channel_message_content = channelMessage.content
        this.channel_message_created_at = channelMessage.created_at

    }
}

export default ChannelMessagesDTO